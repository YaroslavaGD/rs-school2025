import { ANIMATION_DELAYS, GAME_EVENTS, RESULT_REASON, SCREEN_TYPE, UI_EVENTS } from "./constants.js";
import { EventBus } from "./eventBus.js";
import { GameEngine } from "./gameEngine.js";
import { Store } from "./store.js";

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
    const currentState = Store.getState();
    
    Store.setState({
      history: {
        grid: [...grid],
        score: score,
        selected: []
      },
      assists: {
        ...currentState.assists,
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

  return {
    handleCellClick,
    handleWin,
    handleLose,
  };
})();