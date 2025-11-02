import { initAudio } from './audio.js';
import { initEditKey } from './editKey.js';
import { createKalimba } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  createKalimba();
  initAudio();
});