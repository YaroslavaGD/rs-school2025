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

      if (a === 5 && b === 5) return 10;
      if (a === b) return 1;
      if ((a + b) === 10) return 2;

      return 0;
    },

    //PRIVATE
    isValidPair(i1, i2, grid) {
      if (i1 === i2) return false;
      if (grid[i1] == null || grid[i2] == null) return false;

      const row1 = Math.floor(i1 / 9);
      const col1 = i1 % 9; 

      const row2 = Math.floor(i2 / 9);
      const col2 = i2 % 9; 

      const isHorizontal = row1 === row2 && Math.abs(col1 - col2) === 1; 
      const isVertical = col1 === col2 && Math.abs(row1 - row2) === 1; 
      if (isHorizontal || isVertical) return true;

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