import { kalimbaEvents, keyToNote } from './constants.js';
import { EventBus } from './eventBus.js';

export function createKalimba() {
  const container = document.createElement('div');
  container.classList.add('kalimba-container');

  Object.entries(keyToNote).forEach(([key, note]) => {
    const tine = document.createElement('div');
    tine.classList.add('tine');
    tine.dataset.key = key;
    tine.dataset.note = note;
    tine.innerHTML = `
      <div class="note">${note}</div>
      <div class="key">${key}</div>
      <button class="edit-btn">✎</button>
    `;

    tine.addEventListener('mousedown', (e) => {
      const currentKey = e.currentTarget.dataset.key;
      triggerPlay(currentKey);
    });
    tine.addEventListener('mouseup', () => deactivate(tine));
    tine.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      EventBus.emit(kalimbaEvents.KEY_EDIT, { key, note });
    });

    container.appendChild(tine);
  });

  document.body.appendChild(container);

  document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    const tine = document.querySelector(`.tine[data-key='${key}']`);

    if(!tine || tine.classList.contains('active')) return;
    triggerPlay(key);
    tine.classList.add('active');
  });
}

document.addEventListener('keyup', (e) => {
  const key = e.key.toUpperCase();
  const tine = document.querySelector(`.tine[data-key='${key}']`);

  if(!tine || !tine.classList.contains('active')) return;
  deactivate(tine);
});

EventBus.on(kalimbaEvents.KEY_UPDATE, ({ note, newKey }) => {
  const tine = document.querySelector(`.tine[data-note='${note}']`);
  if (tine) {
    tine.dataset.key = newKey;
    tine.querySelector('.key').textContent = newKey;
  }
});

function triggerPlay(key) {
  EventBus.emit(kalimbaEvents.NOTE_PLAY, { key });

  const tine = document.querySelector(`.tine[data-key='${key}']`);
  if (tine) tine.classList.add('active');
}

function deactivate(tine) {
  tine.classList.remove('active');
}