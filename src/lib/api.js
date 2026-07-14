import { loadSettings } from './storage';
import { buildStoryPrompt } from './prompts';

function buildEndpoint(rawUrl) {
  const base = rawUrl.trim().replace(/\/+$/, '');
  if (base.endsWith('/chat/completions')) return base;
  if (/\/v\d+$/.test(base)) return `${base}/chat/completions`;
  return `${base}/v1/chat/completions`;
}

export async function streamStory({ genreId, customSetting, onDelta, signal }) {
  const settings = loadSettings();
  if (!settings.apiUrl || !settings.apiKey) {
    const err = new Error('中转站还没配置');
    err.code = 'MISSING_CONFIG';
    throw err;
  }

  const { system, user } = buildStoryPrompt({ genreId, customSetting });
  const endpoint = buildEndpoint(settings.apiUrl);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      ...(settings.model ? { model: settings.model } : {}),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      stream: true,
      temperature: 0.9,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '');
    const err = new Error(`请求失败（状态码 ${res.status}）${text ? '：' + text.slice(0, 200) : ''}`);
    err.code = 'REQUEST_FAILED';
    throw err;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]' || !data) continue;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content ?? '';
        if (delta) {
          fullText += delta;
          onDelta?.(delta, fullText);
        }
      } catch {
        // 有些中转站会在流里夹心跳/注释行，解析不了就跳过
      }
    }
  }

  return fullText;
}
