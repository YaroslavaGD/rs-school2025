import { GAME_EVENTS, SCREEN_TYPE, UI_EVENTS } from './constants.js';
import { EventBus } from './eventBus.js';
import { GameController } from './gameController.js';
import { GameEngine } from './gameEngine.js';
import { Storage } from './storage.js';
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
      root.classList.add('main');
      app.appendChild(root);

      Store.subscribe((state) => {

        const prevScreen = currentScreen;
        const newScreen = state.screen;

        if (prevScreen === SCREEN_TYPE.GAME && newScreen !== SCREEN_TYPE.GAME) {
          Timer.stop();
        }

        if (newScreen === SCREEN_TYPE.GAME && state.timer.running) {
          Timer.start();
        }

        if (newScreen !== prevScreen) {
          currentScreen = newScreen;
          root.replaceChildren();
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
        const linesCount = GameEngine.getGridRowCount(grid);
  
        Store.setState({
          mode,
          screen: SCREEN_TYPE.GAME,
          grid,
          score: 0,
          history: null,
          timer: { running: true, elapsedMs: 0 },
          linesCount,
          assists: {
            ...Store.getState().assists,
            revertAvailable: false,
            addNumbersUsed: 0,
            shuffleUsed: 0,
            eraserUsed: 0,
            hintsLeft: availablePairs
          }
        });
      });

      EventBus.on(UI_EVENTS.CONTINUE, () => {
        const savedGame = Storage.loadGame();

        if (!savedGame) {
          console.error('No saved game found');
          return;
        }

        Timer.setElapsed(savedGame.timer.elapsedMs);
        Timer.start();

        const availablePairs = GameEngine.getAvailablePairsCount(savedGame.grid);

        Store.setState({
          mode: savedGame.mode,
          screen: SCREEN_TYPE.GAME,
          grid: savedGame.grid,
          score: savedGame.score,
          history: savedGame.history,
          timer: { running: true, elapsedMs: savedGame.timer.elapsedMs },
          linesCount: savedGame.linesCount,
          selected: [],
          eraserMode: false,
          assists: {
            ...savedGame.assists,
            hintsLeft: availablePairs
          }
        });

        setTimeout(() => {
          UI.updateGameState(Store.getState());
        }, 0);
      });

      EventBus.on(UI_EVENTS.RESET, () => {
        Timer.resetHard();
        const { mode } = Store.getState();
        const grid = GameEngine.generateGrid(mode);
        const availablePairs = GameEngine.getAvailablePairsCount(grid);
        const linesCount = GameEngine.getGridRowCount(grid);
  
        Store.setState({
          mode,
          screen: SCREEN_TYPE.GAME,
          grid,
          score: 0,
          history: null,
          timer: { running: true, elapsedMs: 0 },
          linesCount,
          assists: {
            ...Store.getState().assists,
            revertAvailable: false,
            addNumbersUsed: 0,
            shuffleUsed: 0,
            eraserUsed: 0,
            hintsLeft: availablePairs
          }
        });
      });

      EventBus.on(UI_EVENTS.BACK, () => {
        Timer.stop();

        Store.setState({ screen: SCREEN_TYPE.START });

        Timer.reset();
      });

      EventBus.on(GAME_EVENTS.WIN, GameController.handleWin);

      EventBus.on(GAME_EVENTS.LOSE, GameController.handleLose);

      EventBus.on(UI_EVENTS.CELL_CLICK, ({ index }) => GameController.handleCellClick(index));

      EventBus.on(UI_EVENTS.MATCHED, ({ indexes }) => {
        UI.updateMatched(indexes);
      });

      EventBus.on(UI_EVENTS.UNMATCHED, ({ indexes }) => {
        UI.updateUnmatched(indexes);
        setTimeout(() => {
          Store.setState({ selected: [] });
        }, 300);
      });

      EventBus.on(UI_EVENTS.ASSIST_USE, GameController.handleAssistsUse);

      EventBus.on(UI_EVENTS.UPDATE_ASSISTS_UI, () => {
        UI.updateAddNumbersButton(Store.getState());
        UI.updateShuffleButton(Store.getState());
      });

      EventBus.on(UI_EVENTS.ERASER_ACTIVATED, () => {
        UI.updateEraserModeUI(true);
      });

      EventBus.on(UI_EVENTS.ERASER_CANCELLED, () => {
        UI.updateEraserModeUI(false);
      });

      Store.setState({ screen: SCREEN_TYPE.START });
    }
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});