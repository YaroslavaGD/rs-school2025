import { EventBus } from './eventBus.js';
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
        if (state.screen === 'start') {
          UI.renderStart(root);
        } else if (state.screen === 'game') {
          UI.renderGame(root, state);
        } else if (state.screen === 'results') {
          //TODO: render results screen
          console.log('Render results screen');
        }
      });

      EventBus.on('ui:start', ({ mode }) => {
        //TODO: GameEngine.generateGrid(mode)
        Store.setState({
          mode,
          screen: 'game',
          // grid,
          score: 0,
          linesCount: 0,
          //timer: { running: true, elapsedMs: 0 }
        });
      });

      EventBus.on('ui:back', () => {
        Store.setState({ screen: 'start' });
      });

      //TODO: start timer

      Store.setState({ screen: 'start' });

      console.log('App initialized');
    }
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});