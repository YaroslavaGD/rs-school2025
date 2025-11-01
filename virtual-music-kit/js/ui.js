import { keyToNote } from './constants.js';
import { EventBus } from './eventBus.js';

export function createKalimba() {
  const container = document.createElement('div');
  container.classList.add('kalimba-container');

  Object.entries(keyToNote).forEach(([key, note]) => {
    const tine = document.createElement('div');
    tine.classList.add('tine');
    tine.dataset.key = key;
    tine.dataset.note = note;
    tine.innerHTML = `<div class='note'>${note}</div><div class='key'>${key}</div>`;

    tine.addEventListener('mousedown', () => triggerPlay(key));
    tine.addEventListener('mouseup', () => deactivate(tine));

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

function triggerPlay(key) {
  console.log('play');
  EventBus.emit('note:play', { key });

  const tine = document.querySelector(`.tine[data-key='${key}']`);
  if (tine) tine.classList.add('active');
}

function deactivate(tine) {
  tine.classList.remove('active');
}