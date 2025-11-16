import { ASSIST_NAME, GAME_EVENTS, RESULT_REASON, SCREEN_TYPE, UI_EVENTS } from './constants.js';
import { EventBus } from './eventBus.js';
import { GameEngine } from './gameEngine.js';
import { Store } from './store.js';
import { Timer } from './timer.js';
import { UI } from './ui.js';

const App = (() => {
  let currentScreen = null;

  return {
    init() {
      const app = document.createElement('div');
      app.id = 'app';
      document.body.appendChild(app);
      UI.renderHeader(app);
      const root = document.createElement('main');
      app.appendChild(root);

      Store.subscribe((state) => {
        if (state.screen === SCREEN_TYPE.GAME && state.timer.running) {
          Timer.start();
        } else {
          Timer.stop();
        }

        if (state.screen !== currentScreen) {
          currentScreen = state.screen;
          root.innerHTML = '';
          if (state.screen === SCREEN_TYPE.START) {
            UI.renderStart(root);
          } else if (state.screen === SCREEN_TYPE.GAME) {
            UI.renderGame(root, state);
          } else if (state.screen === SCREEN_TYPE.RESULTS) {
            UI.renderResults(root, state);
          }
        } else if (state.screen === SCREEN_TYPE.GAME) {
          UI.updateGameState(state);
        }
      });

      EventBus.on(UI_EVENTS.START, ({ mode }) => {
        const grid = GameEngine.generateGrid(mode);
        const availablePairs = GameEngine.getAvailablePairsCount(grid);

        Store.setState({
          mode,
          screen: SCREEN_TYPE.GAME,
          grid,
          score: 0,
          history: null,
          timer: { running: true, elapsedMs: 0 },
          linesCount: 0,
          assists: {
            ...Store.getState().assists,
            revertAvailable: false,
            hintsLeft: availablePairs
          }
        });
      });

      EventBus.on(UI_EVENTS.BACK, () => {
        Timer.reset();
        Store.setState({ screen: SCREEN_TYPE.START });
      });

      EventBus.on(GAME_EVENTS.WIN, () => {
        Store.setState({
          timer: {
            ...Store.getState().timer,
            running: false
          }
        });
        setTimeout(()=> {
          Store.setState({ 
            screen: SCREEN_TYPE.RESULTS,
            resultReason: RESULT_REASON.WIN
          });
        }, 650);
      });

      EventBus.on(UI_EVENTS.CELL_CLICK, ({ index }) => {
        const { selected, grid, score } = Store.getState();

        if (grid[index] === null) return;

        if (selected.includes(index)) {
          Store.setState({ selected: selected.filter(i => i !== index) });
          return;
        }

        if (selected.length === 0) {
          Store.setState({ selected: [index] });
          return;
        }

        if (selected.length === 1) {
          const newSelected = [...selected, index];
          Store.setState({ selected: newSelected });

          setTimeout(() => {
            const [i1, i2] = newSelected;

            const pairScore = GameEngine.scorePair(i1, i2, grid);
  
            if (pairScore > 0) {
              const currentState = Store.getState();
              Store.setState({ 
                history: { 
                  grid: [...currentState.grid],
                  score: currentState.score,
                  selected: [] 
                },
                assists: {
                  ...currentState.assists,
                  revertAvailable: true,
                }
              });
              EventBus.emit(UI_EVENTS.MATCHED, { indexes: [i1, i2] });
              setTimeout(() => {
                const newGrid = [...grid];
                newGrid[i1] = null;
                newGrid[i2] = null;

                const availablePairs = GameEngine.getAvailablePairsCount(newGrid);

                Store.setState({
                  grid: newGrid,
                  score: score + pairScore,
                  selected: [],
                  assists: {
                    ...Store.getState().assists,
                    hintsLeft: availablePairs,
                  }
                });

                if (score + pairScore >= 100) EventBus.emit(GAME_EVENTS.WIN);

              }, 350);
            } else {
              EventBus.emit(UI_EVENTS.UNMATCHED, { indexes: [i1, i2] });
            }
          }, 350);
          return;
        }
      });

      EventBus.on(UI_EVENTS.MATCHED, ({ indexes }) => {
        UI.updateMatched(indexes);
      });

      EventBus.on(UI_EVENTS.UNMATCHED, ({ indexes }) => {
        UI.updateUnmatched(indexes);
        setTimeout(() => {
          Store.setState({ selected: [] });
        }, 300);
      });

      EventBus.on(UI_EVENTS.ASSIST_USE, ({ name }) => {
        if (name === ASSIST_NAME.REVERT) {
          const { history, assists } = Store.getState();

          if (history && assists.revertAvailable) {
            const availablePairs = GameEngine.getAvailablePairsCount(history.grid);

            Store.setState({
              grid: history.grid,
              score: history.score,
              selected: [],
              history: null,
              assists: {
                ...assists,
                revertAvailable: false,
                hintsLeft: availablePairs
              }
            });
          }
        }

        if (name === ASSIST_NAME.HINTS) {
          const { grid } = Store.getState();
          const count = GameEngine.getAvailablePairsCount(grid);
          UI.updateHintsCounter(count);
        }
      });

      Store.setState({ screen: SCREEN_TYPE.START });
    }
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});