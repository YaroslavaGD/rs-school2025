import { ASSIST_NAME, MODE, RESULT_REASON, UI_EVENTS } from "./constants.js";
import { EventBus } from "./eventBus.js";
import { Storage } from "./storage.js";
import { Store } from "./store.js";
import { formatTime } from "./utils.js";

export const UI = (() => {
  const addUniversalClickListener = (element, handler) => {
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDevice = false;

    // Touch events
    element.addEventListener('touchstart', (e) => {
      isTouchDevice = true;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      if (!isTouchDevice) return;
      
      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      const deltaX = Math.abs(touchEndX - touchStartX);
      const deltaY = Math.abs(touchEndY - touchStartY);

      if (deltaX < 10 && deltaY < 10) {
        e.preventDefault();
        handler(e);
      }
    });

    // Click events for desktop
    element.addEventListener('click', (e) => {
      if (!isTouchDevice) {
        handler(e);
      }
    });
  };
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

      const newGameContainer = document.createElement('div');
      newGameContainer.classList.add('new-game');

      const newGameTitle = document.createElement('h2');
      newGameTitle.classList.add('new-game__title');
      newGameTitle.textContent = 'New Game';
      
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

      newGameContainer.appendChild(newGameTitle);
      newGameContainer.appendChild(modeContainer);
      
      start.appendChild(newGameContainer);
      const hasSavedGame = Storage.hasSavedGame();
      if (hasSavedGame) {
        const continueBtn = this.createContinueBtn();
        start.appendChild(continueBtn);
      }

      const footer = this.createFooter();
      start.appendChild(footer);

      root.appendChild(start);
    },

    renderGame(root, state) {
      const { grid } = state;
      const gameDiv = document.createElement('div');
      gameDiv.classList.add('game__main');
      const mainInfoDiv = this.createMainInfo(state);
      const gridDiv = this.createGrid(grid);
      const assistDiv = this.createAssist(state);

      gameDiv.appendChild(gridDiv);
      gameDiv.appendChild(assistDiv);

      root.appendChild(mainInfoDiv);
      root.appendChild(gameDiv);
    },

    updateGameState(state) {
      const { grid, score, selected, assists, eraserMode } = state;
      
      const scoreEl = document.querySelector('.info__score-content');
      if (scoreEl) {
        scoreEl.textContent = `${score} / 100`;
      }

      this.updateAddNumbersButton(state);
      this.updateShuffleButton(state);
      this.updateEraserButton(state);
      this.updateEraserModeUI(eraserMode);

      const gridEl = document.querySelector('.grid');
      if (gridEl) {
        const existingCount = gridEl.children.length;
        if (existingCount !== grid.length) {
          const newGrid = this.createGrid(grid);
          gridEl.replaceWith(newGrid);
          return;
        }

        grid.forEach((num, i) => {
          const cell = gridEl.querySelector(`.grid__item[data-index="${i}"]`);
          if (cell) {
            const currentText = cell.textContent;
            const newText = num === null ? '' : String(num);

            if (currentText !== newText) {
              cell.textContent = newText;
            }

            if (eraserMode && num !== null) {
              cell.classList.add('eraser-target');
              cell.classList.remove('selected');
            } else {
              cell.classList.remove('eraser-target');
              if (selected.includes(i)) {
                cell.classList.add('selected');
              } else {
                cell.classList.remove('selected');
              }
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

    updateAddNumbersButton(state) {
      const btn = document.querySelector('.add-button');
      if (!btn) return;

      const { assists, linesCount } = state;

      btn.disabled = assists.addNumbersUsed >= 10;
      btn.classList.toggle('disabled', btn.disabled);
      let triesEl = btn.querySelector('.button__tries');
      let linesEl = btn.querySelector('.button__lines');

      if (!triesEl) {
        triesEl = document.createElement('div');
        triesEl.classList.add('button__extra-info', 'button__tries');
        btn.appendChild(triesEl);
      }

      if (!linesEl) {
        linesEl = document.createElement('div');
        linesEl.classList.add('button__extra-info', 'button__lines');
        btn.appendChild(linesEl); 
      }
  
      triesEl.textContent = `(${assists.addNumbersUsed} / 10)`;
      linesEl.textContent = `lines: ${linesCount} / 50`;
    },

    updateShuffleButton(state) {
      const btn = document.querySelector('.shuffle-button');
      if (!btn) return;

      const { assists } = state;

      btn.disabled = assists.shuffleUsed >= 5;
      btn.classList.toggle('disabled', btn.disabled);
      let triesEl = btn.querySelector('.button__tries');

      if (!triesEl) {
        triesEl = document.createElement('div');
        triesEl.classList.add('button__extra-info', 'button__tries');
        btn.appendChild(triesEl);
      }
  
      triesEl.textContent = `(${assists.shuffleUsed} / 5)`;
    },

    updateEraserButton(state) {
      const btn = document.querySelector('.eraser-button');
      if (!btn) return;

      const { assists, eraserMode } = state;
      const isLimitReached = assists.eraserUsed >= 5;

      btn.disabled = isLimitReached;
      btn.classList.toggle('disabled', btn.disabled);
      
      if (isLimitReached && eraserMode) {
        Store.setState({ eraserMode: false });
        EventBus.emit(UI_EVENTS.ERASER_CANCELLED);
      }

      let triesEl = btn.querySelector('.button__tries');

      if (!triesEl) {
        triesEl = document.createElement('div');
        triesEl.classList.add('button__extra-info', 'button__tries');
        btn.appendChild(triesEl);
      }
  
      triesEl.textContent = `(${assists.eraserUsed} / 5)`;
    },

    updateEraserModeUI(eraserMode) {
      const eraserBtn = document.querySelector('.eraser-button');
      const gridEl = document.querySelector('.grid');

      if (eraserMode) {
        if (eraserBtn) {
          eraserBtn.classList.add('active-mode');
        }

        if (gridEl) {
          gridEl.classList.add('eraser-mode');
        }

        this.showEraserHint();
      } else {
        if (eraserBtn) {
          eraserBtn.classList.remove('active-mode');
        }
        
        if (gridEl) {
          gridEl.classList.remove('eraser-mode');
        }

        this.hideEraserHint();
      }
    },

    showEraserHint() {
      let hint = document.querySelector('.eraser-hint');

      if (!hint) {
        hint = document.createElement('div');
        hint.classList.add('eraser-hint');
        hint.textContent = 'Click on a cell to erase it';

        const gameMain = document.querySelector('.game__main');
        if (gameMain) {
          gameMain.appendChild(hint);
        }
      }
    },

    hideEraserHint() {
      const hint = document.querySelector('.eraser-hint');
      if (hint) {
        hint.remove();
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

      addUniversalClickListener(button, () => {
        EventBus.emit(UI_EVENTS.START, { mode: button.dataset.mode });
      });

      // button.addEventListener('click', () => {
      //   EventBus.emit('ui:start', { mode: button.dataset.mode });
      // });

      button.appendChild(span);

      return button;
    },

    createContinueBtn() {
      const continueBtn = document.createElement('button');
      continueBtn.classList.add('button');
      continueBtn.classList.add('continue-button');

      const continueBtnText = document.createElement('div');
      continueBtnText.classList.add('button__text');
      continueBtnText.textContent = 'Continue Game';

      addUniversalClickListener(continueBtn, () => {
        EventBus.emit(UI_EVENTS.CONTINUE, {}); 
      });

      continueBtn.appendChild(continueBtnText);

      return continueBtn;
    },

    createFooter() {
      const footer = document.createElement('footer');
      footer.classList.add('footer');

      const year = document.createElement('span');
      year.classList.add('footer__year');
      year.textContent = `© ${new Date().getFullYear()}`;

      const separator = document.createElement('span');
      separator.classList.add('footer__separator');
      separator.textContent = '|';

      const githubLink = document.createElement('a');
      githubLink.classList.add('footer__link');
      githubLink.href = 'https://github.com/YaroslavaGD';
      githubLink.target = '_blank';
      githubLink.rel = 'noopener noreferrer';
      githubLink.textContent = 'GitHub';

      footer.appendChild(year);
      footer.appendChild(separator);
      footer.appendChild(githubLink);

      return footer;
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

      info.appendChild(modeP);
      info.appendChild(scoreP);
      info.appendChild(timerP);

      header.appendChild(backBtn);
      header.appendChild(info);


      return header;
    },

    createAssist(state) {
      const assistDiv = document.createElement('aside');
      assistDiv.classList.add('assist');
      console.log('state', state);
      const hintsBtn = this.createHintsBtn(state.assists.hintsLeft);
      const revertBtn = this.createRevertBtn();
      const addBtn = this.createAddBtn();
      const shuffleBtn = this.createShuffleBtn();
      const eraserBtn = this.createEraserBtn();

      assistDiv.appendChild(hintsBtn);
      assistDiv.appendChild(revertBtn);
      assistDiv.appendChild(addBtn);
      assistDiv.appendChild(shuffleBtn);
      assistDiv.appendChild(eraserBtn);
      return assistDiv;
    },

    createBackBtn() {
      const backBtn = document.createElement('button');
      backBtn.classList.add('button');
      const backBtnText = document.createElement('div');
      backBtnText.classList.add('button__text');
      backBtnText.textContent = 'Back to Menu';

      addUniversalClickListener(backBtn, () => {
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
      revertBtnText.textContent = '↶ Revert';

      addUniversalClickListener(revertBtn, () => {
        EventBus.emit(UI_EVENTS.ASSIST_USE, { name: ASSIST_NAME.REVERT }); 
      });

      revertBtn.appendChild(revertBtnText);

      return revertBtn;
    },

    createHintsBtn(count) {
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
      if (count) {
        hintsCounter.textContent = count > 5 ? '5+' : String(count);
      }

      addUniversalClickListener(hintsBtn, () => {
        EventBus.emit(UI_EVENTS.ASSIST_USE, { name: ASSIST_NAME.HINTS }); 
      });
      
      hintsBtn.appendChild(hintsBtnText);
      hintsBtn.appendChild(hintsCounter);

      return hintsBtn;
    },

    createAddBtn() {
      const addBtn = document.createElement('button');
      addBtn.classList.add('button');
      addBtn.classList.add('assist-button');
      addBtn.classList.add('add-button');

      const addBtnText = document.createElement('div');
      addBtnText.classList.add('button__text');
      addBtnText.textContent = '+ Add';

      const addBtnTries = document.createElement('div');
      addBtnTries.classList.add('button__extra-info', 'button__tries');
      addBtnTries.textContent = '(0 / 10)';
      
      const addBtnLines = document.createElement('div');
      addBtnLines.classList.add('button__extra-info', 'button__lines');
      addBtnLines.textContent = 'lines: 3 / 50';

      addUniversalClickListener(addBtn, () => {
        EventBus.emit(UI_EVENTS.ASSIST_USE, { name: ASSIST_NAME.ADD_NUMBERS }); 
      });

      addBtn.appendChild(addBtnText);
      addBtn.appendChild(addBtnTries);
      addBtn.appendChild(addBtnLines);

      return addBtn;
    },

    createShuffleBtn() {
      const shuffleBtn = document.createElement('button');
      shuffleBtn.classList.add('button');
      shuffleBtn.classList.add('assist-button');
      shuffleBtn.classList.add('shuffle-button');

      const shuffleBtnText = document.createElement('div');
      shuffleBtnText.classList.add('button__text');
      shuffleBtnText.textContent = '⇄ Shuffle';

      const shuffleBtnTries = document.createElement('div');
      shuffleBtnTries.classList.add('button__extra-info', 'button__tries');
      shuffleBtnTries.textContent = '(0 / 5)';

      addUniversalClickListener(shuffleBtn, () => {
        EventBus.emit(UI_EVENTS.ASSIST_USE, { name: ASSIST_NAME.SHUFFLE }); 
      });

      shuffleBtn.appendChild(shuffleBtnText);
      shuffleBtn.appendChild(shuffleBtnTries);

      return shuffleBtn;
    },

    createEraserBtn() {
      const eraserBtn = document.createElement('button');
      eraserBtn.classList.add('button');
      eraserBtn.classList.add('assist-button');
      eraserBtn.classList.add('eraser-button');

      const eraserBtnText = document.createElement('div');
      eraserBtnText.classList.add('button__text');
      eraserBtnText.textContent = '✖ Eraser';

      const eraserBtnTries = document.createElement('div');
      eraserBtnTries.classList.add('button__extra-info', 'button__tries');
      eraserBtnTries.textContent = '(0 / 5)';

      addUniversalClickListener(eraserBtn, () => {
        const { eraserMode } = Store.getState();
        if (eraserMode) {
          Store.setState({ eraserMode: false });
          EventBus.emit(UI_EVENTS.ERASER_CANCELLED);
        } else {
          EventBus.emit(UI_EVENTS.ASSIST_USE, { name: ASSIST_NAME.ERASER }); 
        }
      });

      eraserBtn.appendChild(eraserBtnText);
      eraserBtn.appendChild(eraserBtnTries);

      return eraserBtn;
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

        addUniversalClickListener(buttonCell, () => {
          EventBus.emit(UI_EVENTS.CELL_CLICK, { index: i });
        });

        gridDiv.appendChild(buttonCell);
      });

      return gridDiv;
    },
  };
})();