export const Store = (() => {
  let state = {
    mode: null, // 'classic', 'random', 'chaotic'
    screen: 'start', // 'start', 'game', 'results'
    grid: [],
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