import { kalimbaEvents, keyToNote } from './constants.js';
import { EventBus } from './eventBus.js';

const sounds = {};
const soundFolder = './sounds/';
const soundExtension = '.wav';

export function initAudio() {
  Object.values(keyToNote).forEach((note, i) => {
    const name = `${soundFolder}${i + 1}_${note}${soundExtension}`;
    sounds[note] = new Audio(name);

    EventBus.on(kalimbaEvents.NOTE_PLAY, ({ key }) => playSound(key));
    EventBus.on(kalimbaEvents.KEY_UPDATE, ({ note, newKey }) => updateKey(note, newKey));
  });
}

function playSound(key) {
  const note = keyToNote[key.toUpperCase()];
  if (!note) return;

  const sound = sounds[note];
  if (!sound) return;

  sound.currentTime = 0;
  sound.play();
}

function updateKey(note, newKey) {
  for (const [key, mappedNote] of Object.entries(keyToNote)) {
    if (mappedNote === note) delete keyToNote[key];
  }

  keyToNote[newKey] = note;
  console.log(`Reassigned ${note} → ${newKey}`);
}