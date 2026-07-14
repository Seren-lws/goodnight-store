import { Link } from 'react-router-dom';
import './Home.css';

const SHELVES = [
  { to: '/story', icon: '📖', label: '故事柜', desc: '今晚听个故事' },
  { to: '/sounds', icon: '📻', label: '声音角', desc: '白噪音 · 轻音乐' },
  { to: '/notes', icon: '📝', label: '便签墙', desc: '把烦心事放下' },
  { to: '/settings', icon: '⚙️', label: '设置', desc: '中转站配置' },
];

export default function Home() {
  return (
    <div className="home-page">
      <div className="sky">
        <div className="moon" />
      </div>

      <div className="store-sign neu-raised">
        <h1>晚安便利店</h1>
        <p className="store-tagline">营业中 · 只为你亮灯</p>
      </div>

      <div className="shelf-grid">
        {SHELVES.map((s) => (
          <Link key={s.to} to={s.to} className="shelf-item neu-raised neu-interactive">
            <span className="shelf-icon">{s.icon}</span>
            <span className="shelf-label">{s.label}</span>
            <span className="shelf-desc">{s.desc}</span>
          </Link>
        ))}
      </div>

      <p className="home-footnote">深夜的店，不打烊，也不催你走</p>
    </div>
  );
}
