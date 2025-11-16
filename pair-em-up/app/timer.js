import { Store } from "./store.js";

export const Timer = (() => {
  let intervalId = null;

  function start() {
    if (intervalId) return;

    intervalId = setInterval(() => {
      const { timer } = Store.getState();
      if (!timer.running) return;

      Store.setState({
        timer: {
          ...timer,
          elapsedMs: timer.elapsedMs + 1000,
        }
      });

      setTimeout(() => {
        const el = document.querySelector('.timer-value');
        if (el) el.textContent = formatTime(newElapsed);
      }, 0);
    }, 1000);
  }

  function stop() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  }

  function reset() {
    stop();
    Store.setState({
      timer: {
        running: false,
        elapsedMs: 0,
      }
    });
  }

  return {
    start,
    stop,
    reset,
  }
})();