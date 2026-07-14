import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadSettings, saveSettings } from '../lib/storage';
import './Settings.css';

export default function Settings() {
  const [settings, setSettings] = useState(() => loadSettings());
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setSettings((s) => ({ ...s, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <Link to="/" className="back-btn neu-raised neu-interactive" aria-label="返回">
          ‹
        </Link>
        <h1>设置</h1>
        <span className="header-spacer" />
      </header>

      <section className="settings-section neu-raised">
        <h2>故事柜 · 中转站</h2>
        <p className="settings-desc">填好你自己的中转站信息，故事柜就能现场为你写故事了。地址和密钥只存在这台设备上。</p>

        <label className="field-label">中转站地址</label>
        <div className="field-input neu-pressed">
          <input
            type="text"
            placeholder="https://your-relay.example.com/v1"
            value={settings.apiUrl}
            onChange={(e) => update('apiUrl', e.target.value)}
          />
        </div>

        <label className="field-label">API Key</label>
        <div className="field-input neu-pressed">
          <input
            type="password"
            placeholder="sk-..."
            value={settings.apiKey}
            onChange={(e) => update('apiKey', e.target.value)}
          />
        </div>

        <label className="field-label">模型名（可选）</label>
        <div className="field-input neu-pressed">
          <input
            type="text"
            placeholder="留空则用中转站默认模型"
            value={settings.model}
            onChange={(e) => update('model', e.target.value)}
          />
        </div>

        <button className="save-btn neu-raised neu-interactive" onClick={handleSave}>
          {saved ? '已保存' : '保存'}
        </button>
      </section>
    </div>
  );
}
