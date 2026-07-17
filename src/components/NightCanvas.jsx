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
      let moonImg; // 预渲染的月牙
      let poleX, headX, lampHeadY, groundY, coneBaseX;
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
        poleX = p.width * 0.92;
        lampHeadY = p.height * 0.09;
        headX = poleX - 38;
        groundY = p.height - 56;
        // 光锥斜向左下照，星星和光都落在这里
        coneBaseX = headX - (groundY - lampHeadY) * 0.2;
      }

      function renderMoon() {
        const g = p.createGraphics(120, 120);
        g.noStroke();
        g.fill(255, 224, 178);
        g.circle(60, 60, 84);
        // 挖出月牙缺口（透明，不会露出难看的暗圆盘）
        g.erase();
        g.circle(78, 46, 72);
        g.noErase();
        moonImg = g;
      }

      function spawnStar() {
        const c = STAR_COLORS[Math.floor(p.random(STAR_COLORS.length))];
        const vy = p.random(0.6, 1.2);
        falling.push({
          x: headX + p.random(-8, 8),
          y: lampHeadY + p.random(4, 16),
          r: p.random(4, 9),
          rot: p.random(p.TWO_PI),
          vr: p.random(-0.04, 0.04),
          vy,
          // 顺着光锥的方向微微向左飘
          vx: -vy * p.random(0.12, 0.28),
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
        renderMoon();

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
            vy: p.random(2.4, 4.2),
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
        const my = p.height * 0.12;
        p.fill(255, 210, 160, 10);
        p.circle(mx, my, 120);
        p.fill(255, 210, 160, 16);
        p.circle(mx, my, 76);
        p.image(moonImg, mx - 30, my - 30, 60, 60);

        // 后层雾
        p.fill(120, 110, 170, 9);
        for (const f of fogs) {
          const fx = p.width / 2 + Math.sin(t * 0.004 + f.phase) * p.width * 0.12;
          p.ellipse(fx, f.y, f.rx * 2, f.ry * 2);
        }

        // 路灯：灯杆 + 弯臂 + 大灯头
        p.stroke(150, 145, 185, 90);
        p.strokeWeight(4);
        p.line(poleX, lampHeadY + 20, poleX, groundY + 8);
        p.noFill();
        p.arc(poleX - 20, lampHeadY + 20, 40, 40, -p.HALF_PI, 0);
        p.line(poleX - 20, lampHeadY, headX + 10, lampHeadY);
        p.noStroke();
        // 灯头往左斜下照的光锥
        const ctx = p.drawingContext;
        ctx.save();
        const grad = ctx.createLinearGradient(headX, lampHeadY, coneBaseX, groundY);
        grad.addColorStop(0, 'rgba(215, 225, 255, 0.16)');
        grad.addColorStop(1, 'rgba(215, 225, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(headX - 16, lampHeadY + 8);
        ctx.lineTo(headX + 16, lampHeadY + 8);
        ctx.lineTo(coneBaseX + 62, groundY);
        ctx.lineTo(coneBaseX - 62, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // 大灯头（微微倾斜，罩向左下）
        p.push();
        p.translate(headX, lampHeadY);
        p.rotate(0.12);
        p.fill(210, 220, 255, 34);
        p.ellipse(0, 4, 78, 46);
        p.fill(58, 52, 92, 255);
        p.rect(-20, -10, 40, 13, 6);
        p.fill(232, 238, 255, 210);
        p.ellipse(0, 4, 34, 9);
        p.pop();

        // 光雨丝
        p.strokeWeight(1);
        for (const th of threads) {
          p.stroke(205, 228, 228, th.alpha);
          p.line(th.x, th.y, th.x, th.y + th.len);
          th.y += th.vy;
          if (th.y > groundY + 20) {
            th.x = p.random(p.width);
            th.y = p.random(-p.height * 0.25, -20);
            th.vy = p.random(2.4, 4.2);
          }
        }
        p.noStroke();

        // 星星从灯口洒落
        if (t % 24 === 0 && falling.length < 15) spawnStar();
        for (let i = falling.length - 1; i >= 0; i--) {
          const s = falling[i];
          s.y += s.vy;
          s.x += s.vx;
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
        p.ellipse(coneBaseX, groundY + 5, 130, 26);
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
        renderMoon();
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
