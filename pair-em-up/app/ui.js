import { MODE, UI_EVENTS } from "./constants.js";
import { EventBus } from "./eventBus.js";
import { Store } from "./store.js";

export const UI = (() => {
  return {
    renderStart(root) {
      const start = document.createElement('div');
      start.id = 'start-screen';
      start.classList.add('start-screen');
      
      const title = document.createElement('h1');
      title.classList.add('logo');
      title.innerText = "Pair 'em Up";
      
      const modeContainer = document.createElement('div');
      modeContainer.classList.add('mode');

      const modes = [
        { value: MODE.CLASSIC, label: 'Classic' },
        { value: MODE.RANDOM, label: 'Random' },
        { value: MODE.CHAOTIC, label: 'Chaotic' },
      ];

      modes.forEach(m => {
        modeContainer.appendChild(this.createModeButton(m.value, m.label));
      });

      start.appendChild(title);
      start.appendChild(modeContainer);
      root.appendChild(start);
    },

    renderGame(root, state) {
      const { mode, score, grid } = state;
      const gameDiv = document.createElement('div');
      const mainInfoDiv = this.createMainInfo(mode, score);
      const gridDiv = this.createGrid(grid);

      gameDiv.appendChild(mainInfoDiv);
      gameDiv.appendChild(gridDiv);

      root.appendChild(gameDiv);
    },

    createModeButton(modeValue, modeLabel) {
      const button = document.createElement('button');
      const span = document.createElement('div');

      button.classList.add('button');
      button.dataset.mode = modeValue;

      span.textContent = modeLabel;
      span.classList.add('button__text');

      button.addEventListener('click', () => {
        EventBus.emit('ui:start', { mode: button.dataset.mode });
      });

      button.appendChild(span);

      return button;
    },

    createMainInfo(mode, score){
      const header = document.createElement('header');
      header.classList.add('game__header');

      const info = document.createElement('div');
      info.textContent = `Mode: ${mode}, Score: ${score}`;

      const backBtn = document.createElement('button');
      backBtn.classList.add('button');
      const backBtnText = document.createElement('div');
      backBtnText.classList.add('button__text');
      backBtnText.textContent = 'Back to Menu';

      backBtn.addEventListener('click', () => {
        EventBus.emit(UI_EVENTS.BACK, {}); 
      });
      backBtn.appendChild(backBtnText);
      header.appendChild(info);

      header.appendChild(backBtn);

      return header;
    },

    createGrid(grid){
      const gridDiv = document.createElement('div');
      gridDiv.classList.add('grid');

      const { selected } = Store.getState();

      grid.forEach((num, i) => {
        const buttonCell = document.createElement('button');
        buttonCell.classList.add('grid__item');
        buttonCell.dataset.index = i;
        buttonCell.textContent = num;

        if (selected.includes(i)) {
          buttonCell.classList.add('selected');
        }

        buttonCell.addEventListener('click', () => {
          EventBus.emit(UI_EVENTS.CELL_CLICK, { index: i });
        });
        gridDiv.appendChild(buttonCell);
      });

      return gridDiv;
    },
  };
})();

EventBus.on(UI_EVENTS.MATCHED, ({ indexes }) => {
  indexes.forEach(i => {
    const el = document.querySelector(`.grid__item[data-index="${i}"]`);
    if (el) el.classList.add('matched');
  });
});