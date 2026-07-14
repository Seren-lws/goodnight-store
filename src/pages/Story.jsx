import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GENRES } from '../lib/prompts';
import { streamStory } from '../lib/api';
import { loadStories, saveStories } from '../lib/storage';
import './Story.css';

export default function Story() {
  const [genreId, setGenreId] = useState('fairy');
  const [customSetting, setCustomSetting] = useState('');
  const [phase, setPhase] = useState('select'); // select | streaming | done | error
  const [text, setText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [collected, setCollected] = useState(false);
  const abortRef = useRef(null);

  async function handleStart() {
    setPhase('streaming');
    setText('');
    setCollected(false);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamStory({
        genreId,
        customSetting,
        signal: controller.signal,
        onDelta: (_delta, fullText) => setText(fullText),
      });
      setPhase('done');
    } catch (err) {
      if (err.name === 'AbortError') {
        setPhase('done');
        return;
      }
      const isKnown = err.code === 'MISSING_CONFIG' || err.code === 'REQUEST_FAILED';
      setErrorCode(err.code || '');
      setErrorMsg(isKnown ? err.message : '连不上中转站，检查一下设置里的地址和网络，或者稍后再试');
      setPhase('error');
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleReset() {
    setPhase('select');
    setText('');
    setCollected(false);
  }

  function handleCollect() {
    if (!text.trim() || collected) return;
    const genre = GENRES.find((g) => g.id === genreId);
    const stories = loadStories();
    const next = [
      { id: Date.now(), text, genreLabel: genre?.label ?? '', createdAt: Date.now() },
      ...stories,
    ];
    saveStories(next);
    setCollected(true);
  }

  return (
    <div className="story-page">
      <header className="story-header">
        <Link to="/" className="back-btn neu-raised neu-interactive" aria-label="返回">
          ‹
        </Link>
        <h1>故事柜</h1>
        <Link to="/story/collection" className="jar-btn neu-raised neu-interactive" aria-label="故事罐">
          🫙
        </Link>
      </header>

      {phase === 'select' && (
        <>
          <p className="story-hint">今晚想听点什么？</p>
          <div className="genre-grid">
            {GENRES.map((g) => (
              <button
                key={g.id}
                className={`genre-chip neu-interactive ${genreId === g.id ? 'genre-chip-active' : 'neu-raised'}`}
                onClick={() => setGenreId(g.id)}
              >
                <span className="genre-icon">{g.icon}</span>
                <span className="genre-label">{g.label}</span>
                <span className="genre-desc">{g.desc}</span>
              </button>
            ))}
          </div>

          <div className="setting-composer neu-pressed">
            <textarea
              value={customSetting}
              onChange={(e) => setCustomSetting(e.target.value)}
              placeholder="想加什么设定？（选填）比如角色、场景、剧情走向……"
              rows={3}
            />
          </div>

          <button className="start-btn neu-raised neu-interactive" onClick={handleStart}>
            开始讲故事
          </button>
        </>
      )}

      {(phase === 'streaming' || phase === 'done') && (
        <>
          <div className="story-reader neu-raised">
            <p className="story-text">
              {text}
              {phase === 'streaming' && <span className="story-cursor">▍</span>}
            </p>
          </div>

          <div className="story-actions">
            {phase === 'streaming' && (
              <button className="action-btn neu-raised neu-interactive" onClick={handleStop}>
                先停在这儿
              </button>
            )}
            {phase === 'done' && (
              <>
                <button className="action-btn neu-raised neu-interactive" onClick={handleCollect} disabled={collected}>
                  {collected ? '已收进故事罐' : '收进故事罐'}
                </button>
                <button className="action-btn neu-raised neu-interactive" onClick={handleReset}>
                  再听一个
                </button>
              </>
            )}
          </div>
        </>
      )}

      {phase === 'error' && (
        <div className="story-error neu-raised">
          <p className="story-error-text">{errorMsg}</p>
          {errorCode === 'MISSING_CONFIG' ? (
            <Link to="/settings" className="action-btn neu-raised neu-interactive">
              去设置里填一下
            </Link>
          ) : (
            <button className="action-btn neu-raised neu-interactive" onClick={handleReset}>
              重新选一次
            </button>
          )}
        </div>
      )}
    </div>
  );
}
