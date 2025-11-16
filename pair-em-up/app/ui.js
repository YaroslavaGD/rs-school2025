import { ASSIST_NAME, MODE, RESULT_REASON, UI_EVENTS } from "./constants.js";
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
      gameDiv.classList.add('game__main');
      const mainInfoDiv = this.createMainInfo(state);
      const gridDiv = this.createGrid(grid);
      const assistDiv = this.createAssist();

      gameDiv.appendChild(gridDiv);
      gameDiv.appendChild(assistDiv);

      root.appendChild(mainInfoDiv);
      root.appendChild(gameDiv);
    },

    updateGameState(state) {
      const { grid, score, selected, assists } = state;
      
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

      const revertBtn = document.querySelector('.revert-button');
      if (revertBtn) {
        if (assists?.revertAvailable) {
          revertBtn.classList.remove('disabled');
          revertBtn.disabled = false;
        } else {
          revertBtn.classList.add('disabled');
          revertBtn.disabled = true;
        }
      }

      const hintsCounter = document.querySelector('.hints-counter');
      if (hintsCounter && assists?.hintsLeft !== undefined) {
        hintsCounter.textContent = assists.hintsLeft > 5 ? '5+' : String(assists.hintsLeft);
      }
    },

    updateMatched(indexes) {
      indexes.forEach(i => {
        const el = document.querySelector(`.grid__item[data-index="${i}"]`);
        if (el) el.classList.add('matched');
      });
    },

    updateUnmatched(indexes) {
      indexes.forEach(i => {
        const el = document.querySelector(`.grid__item[data-index="${i}"]`);
        if (el) el.classList.add('unmatched');
      });
    },

    updateHintsCounter(count) {
      const counter = document.querySelector('.hints-counter');
      if (counter) {
        counter.textContent = count > 5 ? '5+' : String(count);
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

    createAssist() {
      const assistDiv = document.createElement('aside');
      assistDiv.classList.add('assist');

      const hintsBtn = this.createHintsBtn();
      const revertBtn = this.createRevertBtn();

      assistDiv.appendChild(hintsBtn);
      assistDiv.appendChild(revertBtn);
      return assistDiv;
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

    createRevertBtn() {
      const revertBtn = document.createElement('button');
      revertBtn.classList.add('button');
      revertBtn.classList.add('assist-button');
      revertBtn.classList.add('revert-button');

      const revertBtnText = document.createElement('div');
      revertBtnText.classList.add('button__text');
      revertBtnText.textContent = 'Revert';

      revertBtn.addEventListener('click', () => {
        EventBus.emit(UI_EVENTS.ASSIST_USE, { name: ASSIST_NAME.REVERT }); 
      });
      revertBtn.appendChild(revertBtnText);

      return revertBtn;
    },

    createHintsBtn() {
      const hintsBtn = document.createElement('button');
      hintsBtn.classList.add('button');
      hintsBtn.classList.add('assist-button');
      hintsBtn.classList.add('hints-button');

      hintsBtn.disabled = true;
      hintsBtn.style.cursor = 'default';

      const hintsBtnText = document.createElement('div');
      hintsBtnText.classList.add('button__text');
      hintsBtnText.textContent = 'Hints';

      const hintsCounter = document.createElement('div');
      hintsCounter.classList.add('hints-counter');
      hintsCounter.textContent = '?';

      hintsBtn.addEventListener('click', () => {
        EventBus.emit(UI_EVENTS.ASSIST_USE, { name: ASSIST_NAME.HINTS }); 
      });
      
      hintsBtn.appendChild(hintsBtnText);
      hintsBtn.appendChild(hintsCounter);

      return hintsBtn;
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