import { IS_DEBUG, IS_STORE_DEBUG, SCREEN_TYPE } from "./constants.js";
import { Storage } from "./storage.js";

export const Store = (() => {
  let state = {
    mode: null, // 'classic', 'random', 'chaotic'
    screen: SCREEN_TYPE.START, // 'start', 'game', 'results'
    grid: [],
    selected: [],
    history: null,
    score: 0,
    linesCount: 0,
    resultReason: null, // 'win', 'lose-no-moves', 'lose-50-lines'
    timer: { running: false, elapsedMs: 0 },
    eraserMode: false,
    assists: {
      hintsLeft: 999,
      revertAvailable: false,
      addNumbersUsed: 0,
      shuffleUsed: 0,
      eraserUsed: 0,
    },
  };

  const subscribers = [];

  return {
    getState() {
      return JSON.parse(JSON.stringify(state));
    },

    setState(patch) {
      state = { ...state, ...patch };

      subscribers.forEach((fn) => fn(state));
      if (IS_DEBUG && IS_STORE_DEBUG) console.debug('[Store] State updated:', state);

      if (state.screen === SCREEN_TYPE.GAME) {
        Storage.saveGame(Store.getState());
      }
    },

    subscribe(fn) {
      subscribers.push(fn);

      return () => {
        const index = subscribers.indexOf(fn);
        if (index > -1) subscribers.splice(index, 1);
      };
    }
  };
})();