import { MODE } from "./constants.js";

export const GameEngine = (() => {
  return {
    //PUBLIC
    generateGrid(mode) {
      if (mode === MODE.CLASSIC) {
        return this.generateClassicGrid();
      }

      if (mode === MODE.RANDOM) {
        return this.generateRandomGrid();
      }

      if (mode === MODE.CHAOTIC) {
        return this.generateChaoticGrid();
      }

      return [];
    },

    scorePair(i1, i2, grid) {
      const a = grid[i1];
      const b = grid[i2];

      const isValid = this.isValidPair(i1, i2, grid);
      if (!isValid || !a || !b) return 0;

      if (a === 5 && b === 5) return 3;
      if (a === b) return 1;
      if ((a + b) === 10) return 2;

      return 0;
    },

    getAvailablePairsCount(grid) {
      const pairs = new Set();

      for (let i = 0; i < grid.length; i += 1) {
        if (grid[i] === null) continue;

        for (let j = i + 1; j < grid.length; j += 1) {
          if (grid[j] === null) continue;

          const a = grid[i];
          const b = grid[j];

          const isNumberPair = (a === b) || (a + b === 10);
          if (!isNumberPair) continue;

          if (this.isValidPair(i, j, grid)) {
            const pairKey = `${Math.min(i,j)}-${Math.max(i,j)}`;
            pairs.add(pairKey);
          }
        }
      }
      return pairs.size;
    },

    hasAvailableMoves(grid) {
      return this.getAvailablePairsCount(grid) > 0;
    },

    removePair(grid, i1, i2) {
      const newGrid = [...grid];
      newGrid[i1] = null;
      newGrid[i2] = null;
      return newGrid;
    },

    isWinCondition(score, targetScore = 100) {
      return score >= targetScore;
    },

    isLoseConditionGridLimit(grid) {
      return this.isGridLimitReached(grid, 50);
    },

    isLoseConditionNoMoves(grid, assists) {
      const nullNumbers = [...grid];
      const countNulls = nullNumbers.filter(num => num === null).length;
      const countNumbers = grid.length;
      if (countNulls === countNumbers) return true;

      const hasMoves = this.hasAvailableMoves(grid);
      if (hasMoves) return false;

      const hasAddNumbers = assists.addNumbersUsed < 10;
      const hasShuffle = assists.shuffleUsed < 5;
      const hasEraser = assists.eraserUsed < 5;

      const isLose = !hasAddNumbers && !hasShuffle && !hasEraser;

      return isLose;
    },

    generateNewNumbers(mode, currentGrid) {
      const remainingCount = currentGrid.filter( num => num !== null).length;

      if (mode === MODE.CLASSIC) {
        return this.generateClassicNewNumbers(currentGrid);
      }
      
      if (mode === MODE.RANDOM) {
        return this.generateRandomNewNumbers(currentGrid);
      }
      
      if (mode === MODE.CHAOTIC) {
        return this.generateChaoticNewNumbers(remainingCount);
      }

      return [];
    },

    addNewNumbersToGrid(grid, newNumbers) {
      return [...grid, ...newNumbers];
    },

    shuffleGrid(grid) {
      const currentGrid = [...grid];
      const numbers = currentGrid.filter(num => num !== null);
      const shuffled = this.shuffleNumbers(numbers);

      let index = 0;
      return grid.map(cell => cell === null ? null : shuffled[index++]);
    },

    eraseCell(grid, index) {
      const newGrid = [...grid];
      newGrid[index] = null;
      return newGrid;
    },

    //PRIVATE

    getGridRowCount(grid, cols = 9) {
      return Math.ceil(grid.length / cols);
    },

    isGridLimitReached(grid, maxRows = 50) {
      return this.getGridRowCount(grid) >= maxRows;
    },

    isValidPair(i1, i2, grid) {
      const cols = 9;

      const isClearVertical = (from, to, col) => {
        const start = Math.min(from, to);
        const end = Math.max(from, to);
        for (let r = start + 1; r < end; r++) {
          const idx = r * cols + col;
          if (grid[idx] !== null) return false;
        }
        return true;
      };

      if (i1 === i2) return false;
      if (grid[i1] == null || grid[i2] == null) return false;

      const row1 = Math.floor(i1 / cols);
      const col1 = i1 % cols; 

      const row2 = Math.floor(i2 / cols);
      const col2 = i2 % cols; 

      const isHorizontal = row1 === row2 && Math.abs(col1 - col2) === 1; 
      const isVertical = col1 === col2 && Math.abs(row1 - row2) === 1; 
      if (isHorizontal || isVertical) return true;

      if (col1 === col2) {
        if (isClearVertical(row1, row2, col1)) return true;
      }

      const min = Math.min(i1, i2);
      const max = Math.max(i1, i2);

      for (let idx = min + 1; idx < max; idx += 1) {
        if (grid[idx] !== null) return false;
      }

      return true;

    },

    generateClassicGrid() {
      let numbers = this.generateFirstNumbers();
      return this.divideNumbersIntoDigits(numbers);
    },

    generateRandomGrid() {
      let numbers = this.generateFirstNumbers();
      numbers = this.shuffleNumbers(numbers);
      const resGrid = this.divideNumbersIntoDigits(numbers);
      return resGrid;
    },

    generateChaoticGrid() {
      return Array.from(
        { length: 27 }, 
        () => Math.floor(Math.random() * 9) + 1
      );
    },

    generateFirstNumbers() {
      let numbers = Array.from({ length: 19 }, (_, i) => i + 1);
      numbers = numbers.filter(num => num !== 10);

      return numbers;
    },

    generateClassicNewNumbers(currentGrid) {
      const grid = [...currentGrid];
      return grid.filter(num => num !== null);
    },

    generateRandomNewNumbers(currentGrid) {
      const gridNumbers = [...currentGrid];
      const shuffled = this.shuffleNumbers(gridNumbers.filter(num => num !== null));
      return this.divideNumbersIntoDigits(shuffled);
    },

    generateChaoticNewNumbers(count) {
      return Array.from(
        { length: count },
        () => Math.floor(Math.random() * 9) + 1
      );
    },

    divideNumbersIntoDigits(numbers) {
      return numbers.reduce((arr, num) => {
        if (num <= 9) {
          arr.push(num);
          return arr;
        }

        const digitsArray = String(num).split('').map(Number);
        arr.push(...digitsArray);
        return arr;
      }, []);
    },

    shuffleNumbers(numbers) {
      const shuffledNumbers = [...numbers];

      for (let i = shuffledNumbers.length - 1; i > 0; i -= 1) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
      }

      return shuffledNumbers;
    },

  };
})();