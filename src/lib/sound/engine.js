// 声音角的合成引擎：不加载任何音频文件，所有声音都是现场用代码"熬"出来的。
// 白噪音的本质是随机数；雨、风、火就是把随机数过滤成不同的形状；
// 风铃则是最干净的正弦波，随机挑时间敲一下。
// 播放状态放在模块级（不在组件里），切页面声音不断。

import { loadSoundPrefs, saveSoundPrefs } from '../storage';

export const SOUNDS = [
  { id: 'rain', label: '雨声', icon: '🌧️', desc: '隔着窗户的沙沙雨' },
  { id: 'fire', label: '篝火', icon: '🔥', desc: '呼呼的火苗和噼啪声' },
  { id: 'wind', label: '风声', icon: '🌬️', desc: '忽远忽近的呜呜风' },
  { id: 'stream', label: '溪流', icon: '🏞️', desc: '清清亮亮的潺潺水' },
  { id: 'chime', label: '风铃', icon: '🎐', desc: '偶尔叮咚一下' },
];

let ctx = null;
let master = null;
const noiseBuffers = {};

const playing = new Map(); // id -> { userGain, stop }
const volumes = { rain: 0.7, fire: 0.7, wind: 0.6, stream: 0.6, chime: 0.5, ...loadSoundPrefs() };
let timerEnd = null; // 毫秒时间戳
let timerMinutes = null;
let timerInterval = null;
let fadeStarted = false;

const listeners = new Set();
function emit() {
  listeners.forEach((fn) => fn());
}
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function noiseBuffer(type) {
  if (noiseBuffers[type]) return noiseBuffers[type];
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  if (type === 'white') {
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  } else if (type === 'pink') {
    // Paul Kellet 近似法
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  } else {
    // brown：越走越沉的随机漫步
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
  }
  noiseBuffers[type] = buf;
  return buf;
}

function loopSource(type) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(type);
  src.loop = true;
  src.start();
  return src;
}

// 一次性的"噗/嗒/啪"：从噪音里剪一小段，套上急促的音量包络
function burst(dest, { filterType, freq, q = 1, dur, peak }) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer('white');
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.005);
  g.gain.setTargetAtTime(0.0001, t + 0.005, dur / 4);
  src.connect(filter).connect(g).connect(dest);
  src.start(t, Math.random() * 1.5, dur + 0.1);
  src.stop(t + dur + 0.15);
}

// 低频振荡器：让某个参数慢慢地起伏（风的忽大忽小、火的呼吸）
function lfo(param, { rate, depth, base }) {
  const osc = ctx.createOscillator();
  osc.frequency.value = rate;
  const g = ctx.createGain();
  g.gain.value = depth;
  osc.connect(g).connect(param);
  if (base !== undefined) param.value = base;
  osc.start();
  return osc;
}

const builders = {
  rain(dest) {
    // 雨的底：亮而细碎的沙沙（太低会闷成瀑布）
    const base = loopSource('white');
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 600;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 5200;
    const g = ctx.createGain();
    // 阵雨：整体强弱慢慢起伏
    const gust = lfo(g.gain, { rate: 0.06, depth: 0.1, base: 0.48 });
    base.connect(hp).connect(lp).connect(g).connect(dest);
    // 密集的细雨嗒嗒
    const tick = setInterval(() => {
      if (Math.random() < 0.65) {
        burst(dest, { filterType: 'bandpass', freq: 3200 + Math.random() * 3500, q: 3, dur: 0.02 + Math.random() * 0.02, peak: Math.random() * 0.09 });
      }
    }, 70);
    // 偶尔一颗打在窗沿上的清脆水珠（下降调的"啵"）
    const plip = setInterval(() => {
      if (Math.random() < 0.3) {
        const t = ctx.currentTime;
        const f0 = 1100 + Math.random() * 900;
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(f0, t);
        osc.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + 0.04);
        const pg = ctx.createGain();
        pg.gain.setValueAtTime(0, t);
        pg.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.05, t + 0.003);
        pg.gain.setTargetAtTime(0.0001, t + 0.003, 0.03);
        osc.connect(pg).connect(dest);
        osc.start(t);
        osc.stop(t + 0.2);
      }
    }, 420);
    return () => {
      clearInterval(tick);
      clearInterval(plip);
      base.stop();
      gust.stop();
    };
  },

  fire(dest) {
    const base = loopSource('brown');
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 380;
    const g = ctx.createGain();
    const breath = lfo(g.gain, { rate: 0.18, depth: 0.12, base: 0.62 });
    base.connect(lp).connect(g).connect(dest);
    // 噼啪爆点
    const timer = setInterval(() => {
      if (Math.random() < 0.32) {
        const loud = Math.random();
        burst(dest, { filterType: 'highpass', freq: 2200, q: 0.8, dur: 0.03 + Math.random() * 0.04, peak: loud * loud * 0.4 });
      }
    }, 130);
    return () => {
      clearInterval(timer);
      base.stop();
      breath.stop();
    };
  },

  wind(dest) {
    const base = loopSource('pink');
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 400;
    bp.Q.value = 0.8;
    const g = ctx.createGain();
    // 风向和强弱都慢慢飘
    const sweep = lfo(bp.frequency, { rate: 0.06, depth: 220, base: 420 });
    const swell = lfo(g.gain, { rate: 0.045, depth: 0.28, base: 0.5 });
    base.connect(bp).connect(g).connect(dest);
    return () => {
      base.stop();
      sweep.stop();
      swell.stop();
    };
  },

  stream(dest) {
    // 水底：低沉的哗哗（和雨声拉开频段）
    const low = loopSource('pink');
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 480;
    const g = ctx.createGain();
    g.gain.value = 0.55;
    low.connect(lp).connect(g).connect(dest);
    // 两个快速游走的共鸣，做出咕噜咕噜的流动感
    const mid = loopSource('white');
    const bp1 = ctx.createBiquadFilter();
    bp1.type = 'bandpass';
    bp1.Q.value = 6;
    const g1 = ctx.createGain();
    g1.gain.value = 0.14;
    const gurgle1 = lfo(bp1.frequency, { rate: 1.3, depth: 320, base: 620 });
    mid.connect(bp1).connect(g1).connect(dest);
    const mid2 = loopSource('white');
    const bp2 = ctx.createBiquadFilter();
    bp2.type = 'bandpass';
    bp2.Q.value = 7;
    const g2 = ctx.createGain();
    g2.gain.value = 0.09;
    const gurgle2 = lfo(bp2.frequency, { rate: 0.8, depth: 420, base: 1050 });
    mid2.connect(bp2).connect(g2).connect(dest);
    // 溪流的灵魂：一颗颗上升调的小气泡"咕"
    const bubbles = setInterval(() => {
      if (Math.random() < 0.6) {
        const t = ctx.currentTime;
        const f0 = 180 + Math.random() * 420;
        const dur = 0.035 + Math.random() * 0.05;
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(f0, t);
        osc.frequency.exponentialRampToValueAtTime(f0 * (2 + Math.random()), t + dur);
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(0, t);
        bg.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.09, t + 0.006);
        bg.gain.setTargetAtTime(0.0001, t + 0.006, dur / 2);
        osc.connect(bg).connect(dest);
        osc.start(t);
        osc.stop(t + dur + 0.2);
      }
    }, 160);
    return () => {
      clearInterval(bubbles);
      low.stop();
      mid.stop();
      mid2.stop();
      gurgle1.stop();
      gurgle2.stop();
    };
  },

  chime(dest) {
    // 五声音阶，怎么敲都不刺耳
    const notes = [880, 987.8, 1108.7, 1318.5, 1480, 1760];
    let stopped = false;
    let timeout = null;

    function strike() {
      if (stopped) return;
      const f = notes[Math.floor(Math.random() * notes.length)];
      const t = ctx.currentTime;
      const vel = 0.08 + Math.random() * 0.14;
      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pan) pan.pan.value = Math.random() * 1.4 - 0.7;
      const out = pan || ctx.createGain();

      // 基音 + 一点金属泛音
      for (const [mult, amt, decay] of [[1, 1, 3.5], [2.76, 0.28, 1.6]]) {
        const osc = ctx.createOscillator();
        osc.frequency.value = f * mult;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vel * amt, t + 0.006);
        g.gain.setTargetAtTime(0.0001, t + 0.006, decay / 4);
        osc.connect(g).connect(out);
        osc.start(t);
        osc.stop(t + decay + 1);
      }
      out.connect(dest);

      // 偶尔连敲两下，像风真的吹过
      const next = Math.random() < 0.25 ? 300 + Math.random() * 400 : 3500 + Math.random() * 9000;
      timeout = setTimeout(strike, next);
    }
    timeout = setTimeout(strike, 800);
    return () => {
      stopped = true;
      clearTimeout(timeout);
    };
  },
};

// —— 对外的控制面 ——

export function isActive(id) {
  return playing.has(id);
}

export function getVolume(id) {
  return volumes[id] ?? 0.6;
}

export function activeCount() {
  return playing.size;
}

export function toggle(id) {
  if (playing.has(id)) {
    const { userGain, stop } = playing.get(id);
    stop();
    userGain.disconnect();
    playing.delete(id);
  } else {
    ensureCtx();
    const userGain = ctx.createGain();
    userGain.gain.value = volumes[id] ?? 0.6;
    userGain.connect(master);
    const stop = builders[id](userGain);
    playing.set(id, { userGain, stop });
  }
  emit();
}

export function setVolume(id, v) {
  volumes[id] = v;
  const entry = playing.get(id);
  if (entry) entry.userGain.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
  saveSoundPrefs(volumes);
  emit();
}

export function stopAll() {
  for (const [, { userGain, stop }] of playing) {
    stop();
    userGain.disconnect();
  }
  playing.clear();
  emit();
}

// —— 睡眠定时器：最后一分钟慢慢淡出，然后收摊 ——

export function getTimer() {
  return { minutes: timerMinutes, end: timerEnd };
}

if (import.meta.env.DEV) {
  window.__sound = {
    toggle,
    isActive,
    activeCount,
    setVolume,
    stopAll,
    setTimer,
    getTimer,
    debug: () => ({
      ctxState: ctx?.state ?? 'no-ctx',
      playing: [...playing.keys()],
      listeners: listeners.size,
    }),
    tap: () => {
      if (!ctx) return null;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      master.connect(analyser);
      return analyser;
    },
  };
}

export function setTimer(minutes) {
  clearInterval(timerInterval);
  timerInterval = null;
  fadeStarted = false;
  if (master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(1, ctx.currentTime);
  }
  if (!minutes) {
    timerEnd = null;
    timerMinutes = null;
    emit();
    return;
  }
  timerMinutes = minutes;
  timerEnd = Date.now() + minutes * 60 * 1000;
  timerInterval = setInterval(() => {
    const left = timerEnd - Date.now();
    if (left <= 0) {
      setTimer(null);
      stopAll();
      return;
    }
    if (left <= 60 * 1000 && !fadeStarted && master) {
      fadeStarted = true;
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + left / 1000);
    }
    emit();
  }, 1000);
  emit();
}
