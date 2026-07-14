import { Link } from 'react-router-dom';
import './ComingSoon.css';

export default function ComingSoon({ title, icon, note }) {
  return (
    <div className="coming-soon-page">
      <header className="coming-soon-header">
        <Link to="/" className="back-btn neu-raised neu-interactive" aria-label="返回">
          ‹
        </Link>
        <h1>{title}</h1>
        <span className="header-spacer" />
      </header>

      <div className="coming-soon-body neu-raised">
        <span className="coming-soon-icon">{icon}</span>
        <p className="coming-soon-text">这个货架还在进货中，很快就摆上来～</p>
        {note && <p className="coming-soon-note">{note}</p>}
      </div>
    </div>
  );
}
