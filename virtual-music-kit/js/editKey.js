import { kalimbaEvents, keyToNote } from './constants.js';
import { EventBus } from './eventBus.js';

let inputEl;

export function initEditKey() {
  inputEl = document.createElement('input');
  inputEl.classList.add('key-edit-input');
  inputEl.placeholder = 'Press new key and Enter';
  inputEl.style.display = 'none';
  document.body.appendChild(inputEl);

  let currentNote = null;

  EventBus.on(kalimbaEvents.KEY_EDIT, ({ note }) => {
    currentNote = note;
    inputEl.value = '';
    inputEl.style.display = 'block';
    inputEl.focus();
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentNote) {
      const newKey = inputEl.value.trim().toUpperCase();

      if (!newKey.match(/^[A-Z]$/)) return alert('Use English letter keys only!');
      if (Object.keys(keyToNote).includes(newKey)) return alert('This key is already used.');

      const oldKey = Object.entries(keyToNote).find(([k, v]) => v === currentNote)?.[0];
      if (oldKey) delete keyToNote[oldKey];

      keyToNote[newKey] = currentNote;
      EventBus.emit(kalimbaEvents.KEY_UPDATE, { note: currentNote, newKey});
      inputEl.style.display = 'none';
      currentNote = null;
    }
  });
}