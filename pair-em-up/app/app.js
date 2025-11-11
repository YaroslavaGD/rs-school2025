import { EventBus } from './eventBus.js';
import { Store } from './store.js';

const App = (() => {
  return {
    init() {
      const root = document.createElement('div');
      root.id = 'app';
      document.body.appendChild(root);

      Store.subscribe((state) => {
        if (state.screen === 'start') {
          //TODO: render start screen
          console.log('Render start screen');
        } else if (state.screen === 'game') {
          //TODO: render game screen
          console.log('Render game screen');
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

      //TODO: start timer

      Store.setState({ screen: 'start' });

      console.log('App initialized');
    }
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});