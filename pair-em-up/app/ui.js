import { MODE, RESULT_REASON, UI_EVENTS } from "./constants.js";
import { EventBus } from "./eventBus.js";
import { Store } from "./store.js";
import { formatTime } from "./utils.js";

export const UI = (() => {
  return {
    renderHeader(root) {
      const header = document.createElement('header');
      header.classList.add('header');

      const title = document.createElement('h1');
      title.classList.add('logo');
      title.innerText = "Pair 'em Up";

      header.appendChild(title);
      root.appendChild(header);
    },

    renderStart(root) {
      const start = document.createElement('div');
      start.id = 'start-screen';
      start.classList.add('start-screen');
      
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

      start.appendChild(modeContainer);
      root.appendChild(start);
    },

    renderGame(root, state) {
      const { grid } = state;
      const gameDiv = document.createElement('div');
      const mainInfoDiv = this.createMainInfo(state);
      const gridDiv = this.createGrid(grid);

      gameDiv.appendChild(mainInfoDiv);
      gameDiv.appendChild(gridDiv);

      root.appendChild(gameDiv);
    },

    updateGameState(state) {
      const { grid, score, selected } = state;
      
      const scoreEl = document.querySelector('.info__score-content');
      if (scoreEl) {
        scoreEl.textContent = `${score} / 100`;
      }

      const gridEl = document.querySelector('.grid');
      if (gridEl) {
        grid.forEach((num, i) => {
          const cell = gridEl.querySelector(`.grid__item[data-index="${i}"]`);
          if (cell) {
            const currentText = cell.textContent;
            const newText = num === null ? '' : String(num);

            if (currentText !== newText) {
              cell.textContent = newText;
            }

            if (selected.includes(i)) {
              cell.classList.add('selected');
            } else {
              cell.classList.remove('selected');
            }

            cell.classList.remove('matched', 'unmatched');
          }
        });
      }
    },

    renderResults(root, state) {
      const { resultReason } = state;
      const backBtn = this.createBackBtn();

      if (resultReason) {
        const message = document.createElement('p');

        if (resultReason === RESULT_REASON.WIN) message.textContent = `You win!`;
        if (resultReason === RESULT_REASON.LOSE_LINES) message.textContent = `You lose! Reason: the 50-line grid limit has been reached`;
        if (resultReason === RESULT_REASON.LOSE_NO_MOVES) message.textContent = `You lose! Reason: no valid moves remain and all assist tools have been used`;

        root.appendChild(backBtn);
        root.appendChild(message);
      }
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

    createMainInfo(state){
      const {mode, score, timer} = state;
      const header = document.createElement('div');
      header.classList.add('game__header');

      const info = document.createElement('div');
      info.classList.add('info');

      const modeP = document.createElement('p');
      modeP.classList.add('info__item');
      modeP.classList.add('info__mode');
  
      const modeTitle = document.createElement('span');
      modeTitle.textContent = 'mode';
      modeTitle.classList.add('info__title');

      const modeContent = document.createElement('span');
      modeContent.textContent = mode;
      modeContent.classList.add('info__content');

      const scoreP = document.createElement('p');
      scoreP.classList.add('info__item');
      scoreP.classList.add('info__score');
  
      const scoreTitle = document.createElement('span');
      scoreTitle.textContent = 'score';
      scoreTitle.classList.add('info__title');

      const scoreContent = document.createElement('span');
      scoreContent.textContent = `${score} / 100`;
      scoreContent.classList.add('info__content');
      scoreContent.classList.add('info__score-content');
      scoreContent.classList.add('info__number-content');

      const timerP = document.createElement('p');
      timerP.classList.add('info__item');
      timerP.classList.add('info__timer');
  
      const timerTitle = document.createElement('span');
      timerTitle.textContent = 'time';
      timerTitle.classList.add('info__title');

      const timerContent = document.createElement('span');
      timerContent.textContent = formatTime(timer.elapsedMs);
      timerContent.classList.add('info__content');
      timerContent.classList.add('info__number-content');
      timerContent.classList.add('timer-value');

      const backBtn = this.createBackBtn();

      modeP.appendChild(modeTitle);
      modeP.appendChild(modeContent);
      
      scoreP.appendChild(scoreTitle);
      scoreP.appendChild(scoreContent);

      timerP.appendChild(timerTitle);
      timerP.appendChild(timerContent);

      info.appendChild(backBtn);
      info.appendChild(modeP);
      info.appendChild(scoreP);
      info.appendChild(timerP);

      header.appendChild(info);


      return header;
    },

    createBackBtn() {
      const backBtn = document.createElement('button');
      backBtn.classList.add('button');
      const backBtnText = document.createElement('div');
      backBtnText.classList.add('button__text');
      backBtnText.textContent = 'Back to Menu';

      backBtn.addEventListener('click', () => {
        EventBus.emit(UI_EVENTS.BACK, {}); 
      });
      backBtn.appendChild(backBtnText);

      return backBtn;
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

EventBus.on(UI_EVENTS.UNMATCHED, ({ indexes }) => {
  indexes.forEach(i => {
    const el = document.querySelector(`.grid__item[data-index="${i}"]`);
    if (el) el.classList.add('unmatched');
  });
});