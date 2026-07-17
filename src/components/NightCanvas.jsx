import { useEffect, useRef } from 'react';
import p5 from 'p5';

// 星星的糖果色
const STAR_COLORS = [
  [255, 217, 160],
  [255, 179, 193],
  [168, 230, 207],
  [201, 184, 240],
  [168, 216, 255],
];

export default function NightCanvas() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    // p5 初始化是异步的，组件卸载可能发生在 setup 之前；
    // 用 cancelled 标记让迟到的 setup 自我销毁，避免留下孤儿画布
    let cancelled = false;

    const sketch = (p) => {
      let bg; // 预渲染的夜空渐变
      let lampX, lampHeadY, groundY;
      const falling = [];
      const landed = [];
      const threads = [];
      const twinkles = [];
      const fogs = [];
      if (import.meta.env.DEV) window.__night = { falling, landed, threads };

      function gradientColorAt(y) {
        const t = p.constrain(y / p.height, 0, 1);
        return p.lerpColor(p.color('#2a2448'), p.color('#14111f'), t);
      }

      function renderBackground() {
        bg = p.createGraphics(p.width, p.height);
        for (let y = 0; y < p.height; y++) {
          bg.stroke(gradientColorAt(y));
          bg.line(0, y, p.width, y);
        }
      }

      function layout() {
        lampX = p.width * 0.86;
        lampHeadY = p.height * 0.09;
        groundY = p.height - 64;
      }

      function spawnStar() {
        const c = STAR_COLORS[Math.floor(p.random(STAR_COLORS.length))];
        falling.push({
          x: lampX + p.random(-10, 10),
          y: lampHeadY + p.random(0, 14),
          r: p.random(4, 9),
          rot: p.random(p.TWO_PI),
          vr: p.random(-0.04, 0.04),
          vy: p.random(0.5, 1.1),
          sway: p.random(p.TWO_PI),
          swayAmp: p.random(4, 14),
          col: c,
        });
      }

      function drawStar(x, y, r, rot, col, alpha) {
        p.push();
        p.translate(x, y);
        p.rotate(rot);
        p.noStroke();
        // 光晕
        p.fill(col[0], col[1], col[2], alpha * 0.14);
        p.circle(0, 0, r * 4.2);
        p.fill(col[0], col[1], col[2], alpha * 0.3);
        p.circle(0, 0, r * 2.4);
        // 五角星
        p.fill(col[0], col[1], col[2], alpha);
        p.beginShape();
        for (let i = 0; i < 10; i++) {
          const ang = -p.HALF_PI + (i * p.PI) / 5;
          const rad = i % 2 === 0 ? r : r * 0.46;
          p.vertex(Math.cos(ang) * rad, Math.sin(ang) * rad);
        }
        p.endShape(p.CLOSE);
        // 星芯
        p.fill(255, 255, 255, alpha * 0.55);
        p.circle(0, 0, r * 0.55);
        p.pop();
      }

      p.setup = () => {
        if (cancelled) {
          p.remove();
          return;
        }
        p.createCanvas(host.clientWidth, host.clientHeight);
        p.frameRate(30);
        layout();
        renderBackground();

        for (let i = 0; i < 34; i++) {
          twinkles.push({
            x: p.random(p.width),
            y: p.random(p.height * 0.55),
            r: p.random(0.7, 1.7),
            phase: p.random(p.TWO_PI),
          });
        }
        for (let i = 0; i < 22; i++) {
          threads.push({
            x: p.random(p.width),
            y: p.random(-p.height * 0.3, p.height * 0.6),
            len: p.random(26, 80),
            vy: p.random(1.0, 2.0),
            alpha: p.random(8, 20),
          });
        }
        for (let i = 0; i < 3; i++) {
          fogs.push({
            y: p.height * (0.3 + i * 0.22),
            phase: p.random(p.TWO_PI),
            rx: p.width * p.random(0.5, 0.75),
            ry: p.height * p.random(0.06, 0.1),
          });
        }
      };

      p.draw = () => {
        p.image(bg, 0, 0);
        const t = p.frameCount;

        // 星野
        p.noStroke();
        for (const s of twinkles) {
          const a = 110 + 100 * Math.sin(t * 0.03 + s.phase);
          p.fill(255, 255, 255, Math.max(a, 0));
          p.circle(s.x, s.y, s.r * 2);
        }

        // 月亮（雾里的一弯）
        const mx = p.width * 0.16;
        const my = p.height * 0.13;
        p.fill(255, 201, 139, 14);
        p.circle(mx, my, 130);
        p.fill(255, 201, 139, 26);
        p.circle(mx, my, 78);
        p.fill(255, 224, 178, 235);
        p.circle(mx, my, 40);
        p.fill(gradientColorAt(my));
        p.circle(mx + 9, my - 6, 34);

        // 后层雾
        p.fill(120, 110, 170, 9);
        for (const f of fogs) {
          const fx = p.width / 2 + Math.sin(t * 0.004 + f.phase) * p.width * 0.12;
          p.ellipse(fx, f.y, f.rx * 2, f.ry * 2);
        }

        // 路灯
        p.stroke(150, 145, 185, 90);
        p.strokeWeight(3);
        p.line(lampX + 14, lampHeadY, lampX + 14, groundY + 8);
        p.line(lampX - 6, lampHeadY, lampX + 15, lampHeadY);
        p.noStroke();
        p.fill(210, 220, 255, 30);
        p.circle(lampX, lampHeadY + 2, 46);
        p.fill(225, 232, 255, 170);
        p.ellipse(lampX, lampHeadY + 1, 20, 5);

        // 光雨丝
        p.strokeWeight(1);
        for (const th of threads) {
          p.stroke(205, 228, 228, th.alpha);
          p.line(th.x, th.y, th.x, th.y + th.len);
          th.y += th.vy;
          if (th.y > groundY + 20) {
            th.x = p.random(p.width);
            th.y = p.random(-p.height * 0.25, -20);
            th.vy = p.random(1.0, 2.0);
          }
        }
        p.noStroke();

        // 星星从灯口洒落
        if (t % 24 === 0 && falling.length < 15) spawnStar();
        for (let i = falling.length - 1; i >= 0; i--) {
          const s = falling[i];
          s.y += s.vy;
          s.rot += s.vr;
          const wobble = Math.sin(t * 0.02 + s.sway) * s.swayAmp * 0.06;
          s.x += wobble * 0.4;
          drawStar(s.x, s.y, s.r, s.rot, s.col, 235);
          if (s.y >= groundY - 4) {
            falling.splice(i, 1);
            landed.push({
              x: s.x + p.random(-14, 16),
              y: groundY + p.random(-3, 6),
              r: s.r * p.random(0.7, 0.95),
              rot: p.random(p.TWO_PI),
              col: s.col,
            });
            if (landed.length > 24) landed.shift();
          }
        }

        // 地上那堆星星，微微发光
        p.fill(255, 220, 200, 16);
        p.ellipse(lampX + 2, groundY + 5, 130, 26);
        for (const s of landed) {
          drawStar(s.x, s.y, s.r, s.rot, s.col, 200);
        }

        // 前层薄雾压一压整体
        p.fill(110, 100, 160, 6);
        p.ellipse(p.width / 2, p.height * 0.8, p.width * 1.6, p.height * 0.3);
      };

      p.windowResized = () => {
        p.resizeCanvas(host.clientWidth, host.clientHeight);
        layout();
        renderBackground();
      };
    };

    const inst = new p5(sketch, host);
    if (import.meta.env.DEV) window.__p5 = inst;
    const ro = new ResizeObserver(() => inst.windowResized?.());
    ro.observe(host);
    return () => {
      cancelled = true;
      ro.disconnect();
      inst.remove();
    };
  }, []);

  return <div className="night-canvas" ref={hostRef} aria-hidden="true" />;
}
