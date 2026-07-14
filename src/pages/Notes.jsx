import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadNotes, saveNotes } from '../lib/storage';
import './Notes.css';

function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}

export default function Notes() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [draft, setDraft] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  function handleSave() {
    const text = draft.trim();
    if (!text) return;
    const next = [{ id: Date.now(), text, createdAt: Date.now() }, ...notes];
    setNotes(next);
    saveNotes(next);
    setDraft('');
  }

  function handleDelete(id) {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    saveNotes(next);
  }

  async function handleCopy(note) {
    try {
      await navigator.clipboard.writeText(note.text);
      setCopiedId(note.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // 剪贴板权限不可用时静默忽略
    }
  }

  return (
    <div className="notes-page">
      <header className="notes-header">
        <Link to="/" className="back-btn neu-raised neu-interactive" aria-label="返回">
          ‹
        </Link>
        <h1>便签抽屉</h1>
        <span className="header-spacer" />
      </header>

      <p className="notes-hint">脑子里乱糟糟的想法，写下来就好，不用整理</p>

      <div className="notes-composer neu-pressed">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="今天有什么放不下的……写在这里吧"
          rows={4}
        />
        <button className="save-btn neu-raised neu-interactive" onClick={handleSave} disabled={!draft.trim()}>
          放进抽屉
        </button>
      </div>

      <div className="notes-list">
        {notes.length === 0 && <p className="notes-empty">抽屉还是空的，晚安故事之前，先清空一下脑子吧</p>}
        {notes.map((note) => (
          <div className="note-card neu-raised" key={note.id}>
            <p className="note-text">{note.text}</p>
            <div className="note-footer">
              <span className="note-time">{formatTime(note.createdAt)}</span>
              <div className="note-actions">
                <button className="note-action-btn neu-interactive" onClick={() => handleCopy(note)}>
                  {copiedId === note.id ? '已复制' : '复制'}
                </button>
                <button className="note-action-btn neu-interactive" onClick={() => handleDelete(note.id)}>
                  丢掉
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
