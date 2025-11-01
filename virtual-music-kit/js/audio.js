import { kalimbaEvents, keyToNote } from './constants.js';
import { EventBus } from './eventBus.js';

const sounds = {};

export function initAudio() {
  Object.values(keyToNote).forEach((note, i) => {
    const name = `../sounds/${i + 1}_Kalimba_${note}.wav`;
    sounds[note] = new Audio(name);

    EventBus.on(kalimbaEvents.NOTE_PLAY, ({ key }) => playSound(key));
  });
}

function playSound(key) {
  const note = keyToNote[key.toUpperCase()];
  const sound = sounds[note];

  if (!sound) return;

  sound.currentTime = 0;
  sound.play();
}