import { Store } from "./store.js";
import { formatTime } from "./utils.js";

export const Timer = (() => {
  let intervalId = null;

  function start() {
    if (intervalId) return;

    intervalId = setInterval(() => {
      const { timer } = Store.getState();
      if (!timer.running) return;

      const newElapsed = timer.elapsedMs + 1000;
      // Store.setState({
      //   timer: {
      //     ...timer,
      //     elapsedMs: newElapsed,
      //   }
      // });

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