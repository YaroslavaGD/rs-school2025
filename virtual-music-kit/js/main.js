import { initAudio } from './audio.js';
import { createKalimba } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  createKalimba();
  initAudio();
});