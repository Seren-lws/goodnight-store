import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadStories, saveStories } from '../lib/storage';
import './StoryCollection.css';

function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function StoryCollection() {
  const [stories, setStories] = useState(() => loadStories());
  const [openId, setOpenId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  function handleDelete(id) {
    const next = stories.filter((s) => s.id !== id);
    setStories(next);
    saveStories(next);
  }

  async function handleCopy(story) {
    try {
      await navigator.clipboard.writeText(story.text);
      setCopiedId(story.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // 剪贴板权限不可用时静默忽略
    }
  }

  return (
    <div className="collection-page">
      <header className="collection-header">
        <Link to="/story" className="back-btn neu-raised neu-interactive" aria-label="返回">
          ‹
        </Link>
        <h1>故事罐</h1>
        <span className="header-spacer" />
      </header>

      <p className="collection-hint">收藏过的故事都放在这里，想重读随时打开</p>

      <div className="collection-list">
        {stories.length === 0 && <p className="collection-empty">罐子还是空的，去故事柜听一个喜欢的故事收藏吧</p>}
        {stories.map((story) => {
          const open = openId === story.id;
          return (
            <div className="story-card neu-raised" key={story.id}>
              <button className="story-card-header" onClick={() => setOpenId(open ? null : story.id)}>
                <span className="story-card-genre">{story.genreLabel || '故事'}</span>
                <span className="story-card-date">{formatTime(story.createdAt)}</span>
                <span className="story-card-arrow">{open ? '︿' : '﹀'}</span>
              </button>
              {open && (
                <>
                  <p className="story-card-text">{story.text}</p>
                  <div className="story-card-actions">
                    <button className="note-action-btn neu-interactive" onClick={() => handleCopy(story)}>
                      {copiedId === story.id ? '已复制' : '复制'}
                    </button>
                    <button className="note-action-btn neu-interactive" onClick={() => handleDelete(story.id)}>
                      丢掉
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
