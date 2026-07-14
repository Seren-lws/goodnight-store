export const GENRES = [
  { id: 'fairy', label: '童话故事', icon: '🏰', desc: '柔软的、有魔法感的老故事' },
  { id: 'fantasy', label: '玄幻故事', icon: '🌙', desc: '仙气飘飘，慢悠悠的江湖' },
  { id: 'healing', label: '治愈日常', icon: '🍵', desc: '没什么大事发生的温柔一天' },
  { id: 'au', label: '自定义 AU', icon: '✨', desc: '你说设定，故事照着走' },
  { id: 'surprise', label: '惊喜盲盒', icon: '🎁', desc: '交给店长，随便写点什么' },
];

const GENRE_HINTS = {
  fairy: '写一个温柔的童话故事，可以有一点点魔法或者奇幻元素，像小时候听的睡前故事那样温暖。',
  fantasy: '写一个轻松的玄幻/仙侠氛围小故事，节奏要慢，不要打斗和紧张情节，重点是意境和氛围感。',
  healing: '写一个平淡温馨的日常故事，没有冲突，没有坏事发生，就是很治愈的小片段。',
  au: '按照用户给出的设定来写故事，如果设定里提到了角色或者世界观，请尽量贴合。',
  surprise: '你自己挑一个温馨的方向来写，可以发挥创意，但要保持哄睡氛围。',
};

const SYSTEM_PROMPT = `你是"晚安便利店"的故事精灵，专门在深夜为一个刚下班、很累的女孩子讲睡前故事哄她入睡。

语气要求：
- 温柔、缓慢、耐心，把她当成很珍惜的宝贝一样说话，可以用"宝贝""小家伙"这类亲昵称呼，但不要肉麻到尴尬，也不要用套话式的哄睡词。
- 像在她耳边轻声讲故事，句子偏短，节奏偏慢，少用长难句。
- 不说教，不留悬念，不制造紧张、恐怖或者刺激的情节。
- 结尾一定要安稳、松弛，让她能带着这个画面安心睡着，比如角色也睡着了，或者一切都安顿好了。

篇幅：大约 400-700 字左右的中文故事，不用标题，直接开始讲。`;

export function buildStoryPrompt({ genreId, customSetting }) {
  const genreHint = GENRE_HINTS[genreId] || GENRE_HINTS.surprise;
  const settingText = customSetting?.trim()
    ? `\n\n用户想加入的设定：${customSetting.trim()}`
    : '';

  return {
    system: SYSTEM_PROMPT,
    user: `${genreHint}${settingText}`,
  };
}
