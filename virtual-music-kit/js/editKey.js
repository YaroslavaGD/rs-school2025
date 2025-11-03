import { EventBus } from './eventBus.js';
import { kalimbaEvents, keyToNote } from './constants.js';

let inputEl;
let mode = 'edit'; // 'edit' | 'sequence';
let currentNote = null;

export function initEditKey() {
  inputEl = document.createElement('input');
  inputEl.classList.add('edit-input');
  inputEl.name = 'edit-input';
  inputEl.maxLength = Object.keys(keyToNote).length * 2;
  inputEl.style.display = 'none';
  document.body.appendChild(inputEl);

  EventBus.on(kalimbaEvents.KEY_EDIT, ({ key, note }) => {
    mode = 'edit';
    currentNote = note;
    inputEl.value = '';
    inputEl.placeholder =  `Current key = ${key}. Press new key...`;
    showInput();
    inputEl.focus();
    inputEl.select();
  });

  EventBus.on(kalimbaEvents.SEQUENCE_MODE, () => {
    mode = 'sequence';
    currentNote = null;
    inputEl.disabled = false;
    inputEl.value = '';
    inputEl.placeholder = 'Type sequence (A–Z) and press Enter';
    showInput();
    inputEl.focus();
  });

  inputEl.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      if (mode === 'edit') handleEditConfirm();
      else if (mode === 'sequence') await handleSequencePlay();
    } else if (e.key === 'Escape') {
      hideInput();
    }
  });

  inputEl.addEventListener('blur', () => {
    hideInput();
  });

  return inputEl;
}


function showInput() {
  inputEl.style.display = 'block';
}

function hideInput() {
  inputEl.style.display = 'none';
  inputEl.value = '';
  inputEl.placeholder = '';
  currentNote = null;
  mode = null;
}

function handleEditConfirm() {
  if (currentNote) {
    const newKey = inputEl.value.trim().toUpperCase();

    if (!newKey.match(/^[A-Z]$/)) return alert('Use English letter keys only!');
    if (Object.keys(keyToNote).includes(newKey)) return alert('This key is already used.');

    const oldKey = Object.entries(keyToNote).find(([k, v]) => v === currentNote)?.[0];
    if (oldKey) delete keyToNote[oldKey];

    keyToNote[newKey] = currentNote;
    EventBus.emit(kalimbaEvents.KEY_UPDATE, { note: currentNote, newKey});
    inputEl.disabled = true;
    inputEl.value = '';
    inputEl.placeholder = '';
    currentNote = null;

    hideInput();
  }
}

async function handleSequencePlay() {
  const sequence = inputEl.value.toUpperCase().split('');
  const validKeys = Object.keys(keyToNote);
  const filtered = sequence.filter(k => validKeys.includes(k));

  if (!filtered.length) return alert('Enter a valid sequence of keys');

  inputEl.disabled = true;
  EventBus.emit(kalimbaEvents.SEQUENCE_START);
  for (const key of filtered) {
    EventBus.emit(kalimbaEvents.NOTE_PLAY, {key});
    const tine = document.querySelector(`.tine[data-key='${key}']`);
    tine?.classList.add('active');
    await new Promise(r => setTimeout(r, 400));
    tine?.classList.remove('active');
  }

  inputEl.disabled = false;
  EventBus.emit(kalimbaEvents.SEQUENCE_END);
}