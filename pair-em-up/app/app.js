import { SCREEN_TYPE, UI_EVENTS } from './constants.js';
import { EventBus } from './eventBus.js';
import { GameEngine } from './gameEngine.js';
import { Store } from './store.js';
import { UI } from './ui.js';

const App = (() => {
  return {
    init() {
      const root = document.createElement('div');
      root.id = 'app';
      document.body.appendChild(root);

      Store.subscribe((state) => {
        root.innerHTML = '';
        if (state.screen === SCREEN_TYPE.START) {
          UI.renderStart(root);
        } else if (state.screen === SCREEN_TYPE.GAME){
          console.log()
          UI.renderGame(root, state);
        } else if (state.screen === SCREEN_TYPE.RESULTS) {
          //TODO: render results screen
          console.log('Render results screen');
        }
      });

      EventBus.on(UI_EVENTS.START, ({ mode }) => {
        const grid = GameEngine.generateGrid(mode);
        Store.setState({
          mode,
          screen: SCREEN_TYPE.GAME,
          grid,
          score: 0,
          linesCount: 0,
          //timer: { running: true, elapsedMs: 0 }
        });
      });

      EventBus.on(UI_EVENTS.BACK, () => {
        Store.setState({ screen: SCREEN_TYPE.START });
      });

      //TODO: start timer

      Store.setState({ screen: SCREEN_TYPE.START });

      console.log('App initialized');
    }
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});