const NOTES_KEY = 'goodnight-store:notes';
const SETTINGS_KEY = 'goodnight-store:settings';
const STORIES_KEY = 'goodnight-store:stories';

export function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { apiUrl: '', apiKey: '', model: '' };
  } catch {
    return { apiUrl: '', apiKey: '', model: '' };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

const SOUND_PREFS_KEY = 'goodnight-store:sound-prefs';

export function loadSoundPrefs() {
  try {
    const raw = localStorage.getItem(SOUND_PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSoundPrefs(prefs) {
  localStorage.setItem(SOUND_PREFS_KEY, JSON.stringify(prefs));
}

export function loadStories() {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStories(stories) {
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}
