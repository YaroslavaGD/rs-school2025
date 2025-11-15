import { SCREEN_TYPE } from "./constants.js";

export const Store = (() => {
  let state = {
    mode: null, // 'classic', 'random', 'chaotic'
    screen: SCREEN_TYPE.START, // 'start', 'game', 'results'
    grid: [],
    selected: [],
    score: 0,
    linesCount: 0,
  };

  const subscribers = [];

  return {
    getState() {
      return JSON.parse(JSON.stringify(state));
    },

    setState(patch) {
      state = { ...state, ...patch };

      subscribers.forEach((fn) => fn(state));
      console.debug('[Store] State updated:', state);
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