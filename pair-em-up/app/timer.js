import { Store } from "./store.js";
import { formatTime } from "./utils.js";

export const Timer = (() => {
  let intervalId = null;
  let startTime = null;
  let pausedElapsedMs = 0;

  function start() {
    const { timer } = Store.getState();
    if (!timer.running) return;

    if (intervalId) return;

    startTime = Date.now() - timer.elapsedMs;
    pausedElapsedMs = timer.elapsedMs;
      

    intervalId = setInterval(() => {
      const currentElapsedMs = Date.now() - startTime;

      const el = document.querySelector('.timer-value');
      if (el) el.textContent = formatTime(currentElapsedMs);

      pausedElapsedMs = currentElapsedMs;
    }, 1000);
  }

  function stop() {
    if (!intervalId) return;

    clearInterval(intervalId);
    intervalId = null;

    // console.log('[Timer.stop] pausedElapsedMs=', pausedElapsedMs, 'store.screen=', Store.getState().screen);
    if (startTime !== null) {
      pausedElapsedMs = Date.now() - startTime;
      Store.setState({
        timer: {
          ...Store.getState().timer,
          elapsedMs: pausedElapsedMs,
        }
      });
    }
  }

  function reset() {
    stop();
    startTime = null;
    pausedElapsedMs = 0;

    // console.log('[Timer.reset] writing 0. store.screen=', Store.getState().screen);
    Store.setState({
      timer: {
        running: false,
        elapsedMs: 0,
      }
    });
  }

  function getElapsed() {
    if (intervalId && startTime) {
      return Date.now() - startTime;
    }
    return pausedElapsedMs;
  }

  function setElapsed(ms) {
    startTime = null;
    pausedElapsedMs = ms;

    const el = document.querySelector('.timer-value');
    if (el) el.textContent = formatTime(ms);
  }

  function resetHard() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;

    startTime = null;
    pausedElapsedMs = 0;

    const el = document.querySelector('.timer-value');
    if (el) el.textContent = formatTime(0);
  }

  return {
    start,
    stop,
    reset,
    resetHard,
    getElapsed,
    setElapsed,
  }
})();