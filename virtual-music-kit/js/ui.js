import { colorMap, kalimbaEvents, keyToNote } from './constants.js';
import { initEditKey } from './editKey.js';
import { EventBus } from './eventBus.js';

let activeTine = null;

export function createKalimba() {
  const kalimba = document.createElement('div');
  kalimba.classList.add('kalimba');

  const mainText = document.createElement('h1');
  mainText.classList.add('kalimba__title');
  mainText.textContent = 'Kalimba';

  const tinesContainer = document.createElement('div');
  tinesContainer.classList.add('kalimba-container');

  const symbolsContainer = document.createElement('div');
  symbolsContainer.classList.add('symbols');

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
    editBtn.addEventListener('touchstart', (ev) => {
      ev.stopPropagation();
    }, { passive: true });

    divInfo.appendChild(divNote);
    divInfo.appendChild(divKey);
    tineInn.appendChild(editBtn);
    tineInn.appendChild(divInfo);
    tine.appendChild(tineInn);

    tine.addEventListener('mousedown', (e) => {
      const currentKey = e.currentTarget.dataset.key;
      triggerPlay(currentKey);
      applyKeyColor(currentKey);
      tine.classList.add('active');
      activeTine = tine;
    });

    tine.addEventListener('mouseup', (e) => {
      deactivate(tine);
    });

    tine.addEventListener('touchstart', (e) => {
      if (e.target && e.target.closest && e.target.closest('.edit-btn')) return;
      if (e.cancelable) e.preventDefault();
      const currentKey = e.currentTarget.dataset.key;
      triggerPlay(currentKey);
      applyKeyColor(currentKey);
      tine.classList.add('active');
      activeTine = tine;
    }, { passive: false });

    tine.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      EventBus.emit(kalimbaEvents.KEY_EDIT, { key, note });
    });

    tinesContainer.appendChild(tine);
  });

  const inputEl = initEditKey();

  const sequenceBtn = document.createElement('button');
  sequenceBtn.classList.add('sequence-btn');
  sequenceBtn.textContent = '▶ Play Sequence';
  sequenceBtn.addEventListener('click', () => {
    EventBus.emit(kalimbaEvents.SEQUENCE_MODE);
  });

  kalimba.appendChild(tinesContainer);
  kalimba.appendChild(inputEl);
  addDecorSVGs(symbolsContainer);
  kalimba.appendChild(symbolsContainer);
  kalimba.appendChild(mainText);
  kalimba.appendChild(sequenceBtn);
  document.body.appendChild(kalimba);


  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;

    if (document.querySelector('.tine.active')) return;
    const key = mapEventToKeyLetter(e);
    if (!key) return;

    const tine = document.querySelector(`.tine[data-key='${key}']`);

    if(!tine || tine.classList.contains('active')) return;
    triggerPlay(key);
    tine.classList.add('active');
  });

  document.addEventListener('keyup', (e) => {
    const key = mapEventToKeyLetter(e);
    if (!key) return;
    const tine = document.querySelector(`.tine[data-key='${key}']`);
  
    if(!tine || !tine.classList.contains('active')) return;
    deactivate(tine);
  });

  document.addEventListener('mouseleave', () => {
    if (activeTine) deactivate(activeTine);
    activeTine = null;
  });
  
  EventBus.on(kalimbaEvents.KEY_UPDATE, ({ note, newKey }) => {
    const tine = document.querySelector(`.tine[data-note='${note}']`);
    if (tine) {
      tine.dataset.key = newKey;
      tine.querySelector('.key').textContent = newKey;
    }
  });
  
  EventBus.on(kalimbaEvents.SEQUENCE_START, () => {
    sequenceBtn.disabled = true;
    sequenceBtn.classList.add('disabled');
    tinesContainer.classList.add('disabled');
    tinesContainer.style.pointerEvents = 'none';
  });

  EventBus.on(kalimbaEvents.SEQUENCE_END, () => {
    sequenceBtn.disabled = false;
    sequenceBtn.classList.remove('disabled');
    
    tinesContainer.classList.remove('disabled');
    tinesContainer.style.pointerEvents = 'auto';
  });

}

document.addEventListener('keydown', handleKeyColor);

document.addEventListener('mouseup', () => {
  if (activeTine) {
    deactivate(activeTine);
    activeTine = null;
  }
});

document.addEventListener('touchend', () => {
  if (activeTine) {
    deactivate(activeTine);
    activeTine = null;
  }
});


function triggerPlay(key) {
  EventBus.emit(kalimbaEvents.NOTE_PLAY, { key });
}

function deactivate(tine) {
  tine.classList.remove('active');
}

function addDecorSVGs(container) {
  const svgPaths = [
    './img/kalimba_symbols/symbol1.svg',
    './img/kalimba_symbols/symbol2.svg',
    './img/kalimba_symbols/symbol3.svg',
    './img/kalimba_symbols/symbol4.svg',
    './img/kalimba_symbols/symbol5.svg',
    './img/kalimba_symbols/symbol6.svg',
    './img/kalimba_symbols/symbol7.svg',
    './img/kalimba_symbols/symbol8.svg',
    './img/kalimba_symbols/symbol9.svg',
    './img/kalimba_symbols/symbol10.svg',
    './img/kalimba_symbols/symbol11.svg',
  ];

  svgPaths.forEach((path, index) => {
    fetch(path)
      .then(res => res.text())
      .then(svgContent => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('symbols__decor');
        wrapper.dataset.index = index;
        wrapper.innerHTML = svgContent;

        wrapper.querySelectorAll('path').forEach(p => {
          p.style.fill = 'var(--svg-fill-color)';
          p.style.transition = 'fill 0.3s ease';
        });

        container.appendChild(wrapper);
      });
  });
}

function handleKeyColor(e) {
  const key = mapEventToKeyLetter(e);
  if (!key) return;
  applyKeyColor(key);
}

function applyKeyColor(key) {
  if (document.querySelector('.tine.active')) return;
  const color = colorMap[key.toUpperCase()] || '#f4d1ad';
  document.documentElement.style.setProperty('--svg-fill-color', color);
}

function mapEventToKeyLetter(e) {
  if (e && typeof e.code === 'string' && e.code.startsWith('Key')) {
    return e.code.slice(3).toUpperCase();
 }

  const key = e && e.key ? String(e.key).toUpperCase() : '';
  if (key && /^[A-Z]$/.test(key)) return key;
  return null;
}