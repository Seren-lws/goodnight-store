import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import * as engine from '../lib/sound/engine';
import './Sounds.css';

const TIMER_OPTIONS = [
  { label: '不定时', minutes: null },
  { label: '15 分钟', minutes: 15 },
  { label: '30 分钟', minutes: 30 },
  { label: '60 分钟', minutes: 60 },
];

function formatLeft(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Sounds() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => engine.subscribe(force), []);

  const timer = engine.getTimer();
  const anyPlaying = engine.activeCount() > 0;

  return (
    <div className="sounds-page">
      <header className="sounds-header">
        <Link to="/" className="back-btn neu-raised neu-interactive" aria-label="返回">
          ‹
        </Link>
        <h1>声音角</h1>
        <span className="header-spacer" />
      </header>

      <p className="sounds-hint">
        {anyPlaying ? '声音可以叠着放，去别的页面也不会断' : '点一张卡片，让房间里有点声音'}
      </p>

      <div className="sound-grid">
        {engine.SOUNDS.map((s) => {
          const active = engine.isActive(s.id);
          return (
            <div key={s.id} className={`sound-card ${active ? 'neu-pressed sound-card-active' : 'neu-raised'}`}>
              <button className="sound-toggle" onClick={() => engine.toggle(s.id)}>
                <span className={`sound-icon ${active ? 'sound-icon-active' : ''}`}>{s.icon}</span>
                <span className="sound-label">{s.label}</span>
                <span className="sound-desc">{s.desc}</span>
              </button>
              <input
                className="sound-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={engine.getVolume(s.id)}
                onChange={(e) => engine.setVolume(s.id, Number(e.target.value))}
                aria-label={`${s.label}音量`}
              />
            </div>
          );
        })}
      </div>

      <section className="timer-section neu-raised">
        <h2>睡眠定时器</h2>
        <p className="timer-desc">
          {timer.end
            ? `还剩 ${formatLeft(timer.end - Date.now())}，最后一分钟会慢慢变轻，然后安静收摊`
            : '到点声音慢慢变轻、自动停，不吵你一整夜'}
        </p>
        <div className="timer-chips">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              className={`timer-chip neu-interactive ${timer.minutes === opt.minutes ? 'timer-chip-active' : 'neu-raised'}`}
              onClick={() => engine.setTimer(opt.minutes)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {anyPlaying && (
        <button className="stop-all-btn neu-raised neu-interactive" onClick={() => engine.stopAll()}>
          全部安静
        </button>
      )}

      <p className="sounds-note">小提示：锁屏后系统可能会把声音掐掉，亮着屏或者开着别的应用放没问题</p>
    </div>
  );
}
