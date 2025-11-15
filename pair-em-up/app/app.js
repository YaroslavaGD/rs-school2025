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

      EventBus.on(UI_EVENTS.CELL_CLICK, ({ index }) => {
        const { selected, grid, score } = Store.getState();

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
            const a = grid[i1];
            const b = grid[i2];
    
            const pairScore = GameEngine.scorePair(a, b);
  
            if (pairScore > 0) {
              EventBus.emit(UI_EVENTS.MATCHED, { indexes: [i1, i2] });
              setTimeout(() => {
                const newGrid = [...grid];
                newGrid[i1] = null;
                newGrid[i2] = null;
      
                Store.setState({
                  grid: newGrid,
                  score: score + pairScore,
                  selected: []
                });
              }, 350);
            } else {
              Store.setState({ selected: [] });
            }
          }, 350);
          return;
        }
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