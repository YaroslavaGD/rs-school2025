export const Storage = (() => {
  const MAIN_KEY = 'YaroslavaGD_PairemUp';
  const KEYS = {
    CURRENT_GAME: `${MAIN_KEY}_current_game`,
    SETTINGS: `${MAIN_KEY}_settings`,
    RESULTS: `${MAIN_KEY}_results`,
  };
  return {
    saveGame(state) {
      try {
        const gameData = {
          mode: state.mode,
          grid: state.grid,
          score: state.score,
          timer: {
            running: state.timer.running,
            elapsedMs: state.timer.elapsedMs
          },
          assists: state.assists,
          linesCount: state.linesCount,
          history: state.history,
          selected: state.selected
        };
        localStorage.setItem(KEYS.CURRENT_GAME, JSON.stringify(gameData));

      } catch (error) {
        console.error('Failed to save game', error);
      }
    },

    loadGame() {
      try {
        const saved = localStorage.getItem(KEYS.CURRENT_GAME);
        return saved ? JSON.parse(saved) : null;
      } catch (error) {
        console.error('Failed to load game:', error);
        return null;
      }
    },

    hasSavedGame() {
      return localStorage.getItem(KEYS.CURRENT_GAME) !== null;
    },

    removeGame() {
      localStorage.removeItem(KEYS.CURRENT_GAME);
    },

    saveSettings(state) {
      try {
        const settings = {
          theme: state.theme,
        };
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    },

    loadSettings() {
      try {
        const saved = localStorage.getItem(KEYS.SETTINGS);
        return saved ? JSON.parse(saved) : null;
      } catch (error) {
        console.error('Failed to load settings:', error);
        return null;
      }
    },

    hasSettings() {
      return localStorage.getItem(KEYS.SETTINGS) !== null;
    },

    removeSettings() {
      localStorage.removeItem(KEYS.SETTINGS);
    }
  }
})();