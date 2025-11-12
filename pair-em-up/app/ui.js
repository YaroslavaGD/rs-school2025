import { MODE, UI_EVENTS } from "./constants.js";
import { EventBus } from "./eventBus.js";

export const UI = (() => {
  return {
    renderStart(root) {
      console.log('renderStart');
      const start = document.createElement('div');
      start.id = 'start-screen';
      start.classList.add('start-screen');
      
      const title = document.createElement('h1');
      title.classList.add('start-screen__title')
      title.innerText = `Pair '\em Up`;
      
      const modeContainer = document.createElement('ul');
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
      console.log('renderGame');
      const { mode, score, grid } = state;
      const gameDiv = document.createElement('div');
      const mainInfoDiv = this.createMainInfo(mode, score);
      const gridDiv = this.createGrid(grid);

      gameDiv.appendChild(mainInfoDiv);
      gameDiv.appendChild(gridDiv);

      root.appendChild(gameDiv);
    },

    createModeButton(modeValue, modeLabel) {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');
      const span = document.createElement('span');

      li.classList.add('mode__item');
      label.classList.add('mode__label');

      input.type = 'radio';
      input.name = 'mode';
      input.value = modeValue;
      input.id = `mode-${modeValue}`;
      input.classList.add('mode__radio');
      if (modeValue === 'classic') input.checked = true;

      span.textContent = modeLabel;
      span.classList.add('mode__text');

      input.addEventListener('click', () => {
        EventBus.emit('ui:start', { mode: input.value });
      });

      label.htmlFor = `mode-${modeValue}`;
      label.appendChild(input);
      label.appendChild(span);
      li.appendChild(label);

      return li;
    },

    createMainInfo(mode, score){
      const header = document.createElement('header');
      header.classList.add('game__header');

      const info = document.createElement('div');
      info.textContent = `Mode: ${mode}, Score: ${score}`;

      const backBtn = document.createElement('button');
      backBtn.textContent = 'Back to Menu';
      backBtn.addEventListener('click', () => {
        EventBus.emit(UI_EVENTS.BACK, {}); 
      });

      header.appendChild(info);
      header.appendChild(backBtn);

      return header;
    },

    createGrid(grid){
      const gridDiv = document.createElement('div');
      gridDiv.classList.add('grid');

      grid.forEach(num => {
        const buttonCell = document.createElement('button');
        buttonCell.classList.add('grid__item');
        buttonCell.textContent = num;
        gridDiv.appendChild(buttonCell);
      });

      return gridDiv;
    },
  };
})();