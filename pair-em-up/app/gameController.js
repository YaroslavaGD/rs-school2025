import { ANIMATION_DELAYS, ASSIST_NAME, GAME_EVENTS, RESULT_REASON, SCREEN_TYPE, UI_EVENTS } from "./constants.js";
import { EventBus } from "./eventBus.js";
import { GameEngine } from "./gameEngine.js";
import { Store } from "./store.js";
import { UI } from "./ui.js";

export const GameController = (() => {
  //=== Handle clicks
  const handleCellClick = (index) => {
    const { selected, grid, score } = Store.getState();

    if (grid[index] === null) return;

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
        processPairAttempt(i1, i2, grid, score);
      }, ANIMATION_DELAYS.PAIR_CHECK);
      return;
    }
  };

  const processPairAttempt = (i1, i2, grid, score) => {
    const pairScore = GameEngine.scorePair(i1, i2, grid);
    
    if (pairScore > 0) {
      handleSuccessfulMatch(i1, i2, grid, score, pairScore);
    } else {
      handleFailedMatch(i1, i2);
    }
  }

  const handleSuccessfulMatch = (i1, i2, grid, score, pairScore) => {
    saveHistoryState(grid, score);

    EventBus.emit(UI_EVENTS.MATCHED, { indexes: [i1, i2] });

    setTimeout(() => {
      const newGrid = GameEngine.removePair(grid, i1, i2);

      const availablePairs = GameEngine.getAvailablePairsCount(newGrid);
      const newScore = score + pairScore;

      updateGameState(newGrid, newScore, availablePairs);
      checkGameConditions(newScore, newGrid);
    }, ANIMATION_DELAYS.PAIR_REMOVE);

  };

  const handleFailedMatch = (i1, i2) => {
    EventBus.emit(UI_EVENTS.UNMATCHED, { indexes: [i1, i2] });
    setTimeout(() => {
      Store.setState({ selected: [] });
    }, ANIMATION_DELAYS.UNMATCHED_RESET);
  };

  const saveHistoryState = (grid, score) => {
    const state = Store.getState();
    
    Store.setState({
      history: {
        grid: [...grid],
        score: score,
        selected: [],
        linesCount: state.linesCount,
        assists: {
          addNumbersUsed: state.assists.addNumbersUsed,
          shuffleUsed: state.assists.shuffleUsed,
          eraserUsed: state.assists.eraserUsed
        }
      },
      assists: {
        ...state.assists,
        revertAvailable: true,
      }
    });
  };

  const updateGameState = (newGrid, newScore, availablePairs) => {
    Store.setState({
      grid: newGrid,
      score: newScore,
      selected: [],
      assists: {
        ...Store.getState().assists,
        hintsLeft: availablePairs,
      }
    });
  };

  //======== Check Game Conditions
  const checkGameConditions = (score, grid) => {
    //win
     if (GameEngine.isWinCondition(score)) {
      EventBus.emit(GAME_EVENTS.WIN);
      return;
    }

    const { assists } = Store.getState();

    //lose
    if (GameEngine.isLoseConditionGridLimit(grid)) {
      EventBus.emit(GAME_EVENTS.LOSE, { reason: RESULT_REASON.LOSE_LINES });
      return;
    }

    if (GameEngine.isLoseConditionNoMoves(grid, assists)) {
      EventBus.emit(GAME_EVENTS.LOSE, { reason: RESULT_REASON.LOSE_NO_MOVES });
      return;
    }
  };

  const handleWin = () => {
    Store.setState({
      timer: {
        ...Store.getState().timer,
        running: false
      }
    });

    setTimeout(() => {
      Store.setState({
        screen: SCREEN_TYPE.RESULTS,
        resultReason: RESULT_REASON.WIN
      });
    }, ANIMATION_DELAYS.WIN_SCREEN_DELAY);
  };

  const handleLose = ({ reason }) => {
    Store.setState({
      timer: {
        ...Store.getState().timer,
        running: false
      }
    });

    setTimeout(() => {
      Store.setState({
        screen: SCREEN_TYPE.RESULTS,
        resultReason: reason
      });
    }, ANIMATION_DELAYS.WIN_SCREEN_DELAY);
  };

  const handleAssistsUse = ({ name }) => {
    switch (name) {
      case ASSIST_NAME.REVERT:
        useRevert();
        break;
      case ASSIST_NAME.HINTS:
        updateHints();
        break;
      case ASSIST_NAME.ADD_NUMBERS:
        useAddNumbers();
        break;
      case ASSIST_NAME.SHUFFLE:
        useShuffle();
        break;
    }
  };

  const useRevert = () => {
    const { history, assists } = Store.getState();

    if (!history || !assists.revertAvailable) return;

    const availablePairs = GameEngine.getAvailablePairsCount(history.grid);

    Store.setState({
      grid: history.grid,
      score: history.score,
      selected: [],
      linesCount: history.linesCount,
      history: null,
      assists: {
        ...assists,
        ...history.assists,
        revertAvailable: false,
        hintsLeft: availablePairs
      }
    });

    Store.setState({ history: null });

    UI.updateHintsCounter(availablePairs);
    EventBus.emit(UI_EVENTS.UPDATE_ASSISTS_UI);
  };

  const updateHints = () => {
    const { grid } = Store.getState();
    const count = GameEngine.getAvailablePairsCount(grid);
    //TODO: update hints emit
    UI.updateHintsCounter(count);
  };

  const useAddNumbers = () => {
    const { grid, mode, assists, score } = Store.getState();

    if (assists.addNumbersUsed >= 10) return;

    saveHistoryState(grid, score);

    const newNumbers = GameEngine.generateNewNumbers(mode, grid);
    const newGrid = GameEngine.addNewNumbersToGrid(grid, newNumbers);

    if (GameEngine.isGridLimitReached(newGrid)) {
      EventBus.emit(GAME_EVENTS.LOSE, { reason: RESULT_REASON.LOSE_LINES });
      return;
    }

    const availablePairs = GameEngine.getAvailablePairsCount(newGrid);

    Store.setState({
      grid: newGrid,
      linesCount: GameEngine.getGridRowCount(newGrid),
      assists: {
        ...assists,
        addNumbersUsed: assists.addNumbersUsed + 1,
        hintsLeft: availablePairs,
        revertAvailable: true,
      }
    });

    UI.updateHintsCounter(availablePairs);
    EventBus.emit(UI_EVENTS.UPDATE_ASSISTS_UI);
  };

  const useShuffle = () => {
    const { grid, mode, assists, score } = Store.getState();

    if (assists.shuffleUsed >= 5) return;

    saveHistoryState(grid, score);

    const newGrid = GameEngine.shuffleGrid(grid);
    const availablePairs = GameEngine.getAvailablePairsCount(newGrid);

    if (GameEngine.isGridLimitReached(newGrid)) {
      EventBus.emit(GAME_EVENTS.LOSE, { reason: RESULT_REASON.LOSE_LINES });
      return;
    }

    Store.setState({
      grid: newGrid,
      linesCount: GameEngine.getGridRowCount(newGrid),
      assists: {
        ...assists,
        shuffleUsed: assists.shuffleUsed + 1,
        hintsLeft: availablePairs,
        revertAvailable: true,
      }
    });

    UI.updateHintsCounter(availablePairs);
    EventBus.emit(UI_EVENTS.UPDATE_ASSISTS_UI);
  };

  return {
    handleCellClick,
    handleWin,
    handleLose,
    handleAssistsUse,
  };
})();