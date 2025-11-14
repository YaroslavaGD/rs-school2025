import { MODE } from "./constants.js";

export const GameEngine = (() => {
  let grid = [];
  return {
    //PUBLIC
    generateGrid(mode) {
      grid = [];

      if (mode === MODE.CLASSIC) {
        grid = this.generateClassicGrid();
      }

      if (mode === MODE.RANDOM) {
        grid = this.generateRandomGrid();
      }

      if (mode === MODE.CHAOTIC) {
        grid = this.generateChaoticGrid();
      }

      return grid;
    },

    //PRIVATE
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