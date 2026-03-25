const SAVE_KEY = 'adel_game_v1';

// Ephemeral UI fields that should not be persisted
const OMIT_FIELDS = ['notifications', 'connectionModalOpen', 'rogueAlertPending'];

export function saveGame(state) {
  try {
    const toSave = { ...state };
    OMIT_FIELDS.forEach(k => delete toSave[k]);
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('ADEL: failed to save game', e);
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('ADEL: failed to load game', e);
    return null;
  }
}

export function clearGame() {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSavedGame() {
  return Boolean(localStorage.getItem(SAVE_KEY));
}
