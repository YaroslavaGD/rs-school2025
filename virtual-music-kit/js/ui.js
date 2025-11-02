import { kalimbaEvents, keyToNote } from './constants.js';
import { initEditKey } from './editKey.js';
import { EventBus } from './eventBus.js';

export function createKalimba() {
  const kalimba = document.createElement('div');
  kalimba.classList.add('kalimba');
  const mainText = document.createElement('h1');
  mainText.classList.add('kalimba__title');
  mainText.textContent = 'Kalimba';

  const tinesContainer = document.createElement('div');
  tinesContainer.classList.add('kalimba-container');

  Object.entries(keyToNote).forEach(([key, note]) => {
    const noteType = note[note.length - 1];
    const tine = document.createElement('button');
    tine.classList.add('tine');
    if (noteType == '6') tine.classList.add('tine--6');
    if (noteType == '5') tine.classList.add('tine--5');
    if (noteType == '4') tine.classList.add('tine--4');
    tine.dataset.key = key;
    tine.dataset.note = note;

    const tineInn = document.createElement('div');
    tineInn.classList.add('tine__container');

    const divInfo = document.createElement('div');

    const divKey = document.createElement('div');
    divKey.classList.add('key');
    divKey.textContent = key;

    const divNote = document.createElement('div');
    divNote.classList.add('note');
    divNote.textContent = note;

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = '✎';

    divInfo.appendChild(divNote);
    divInfo.appendChild(divKey);
    tineInn.appendChild(editBtn);
    tineInn.appendChild(divInfo);
    tine.appendChild(tineInn);

    tine.addEventListener('mousedown', (e) => {
      const currentKey = e.currentTarget.dataset.key;
      triggerPlay(currentKey);
    });
    tine.addEventListener('mouseup', () => deactivate(tine));
    tine.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      EventBus.emit(kalimbaEvents.KEY_EDIT, { key, note });
    });

    tinesContainer.appendChild(tine);
  });
  kalimba.appendChild(tinesContainer);
  kalimba.appendChild(initEditKey());
  kalimba.appendChild(mainText);
  document.body.appendChild(kalimba);


  document.addEventListener('keydown', (e) => {
    const key = e.key?.toUpperCase();
    const tine = document.querySelector(`.tine[data-key='${key}']`);

    if(!tine || tine.classList.contains('active')) return;
    triggerPlay(key);
    tine.classList.add('active');
  });
}

document.addEventListener('keyup', (e) => {
  const key = e.key?.toUpperCase();
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