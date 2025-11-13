import { CLASSIC_GRID_LENGTH, MODE } from "./constants.js";

export const GameEngine = (() => {
  let grid = [];
  return {
    generateGrid(mode) {
      grid = [];

      if (mode === MODE.CLASSIC) {
        grid = this.generateClassicGrid();
      }

      return grid;
    },

    generateClassicGrid() {
      const initGrid = [];
      for (let num = 1; num < CLASSIC_GRID_LENGTH; num += 1) {
        if (this.containsZero(num)) continue;

        if (num <= 9) {
          initGrid.push(num);
          continue;
        }

        const numArray = String(num).split('').map(Number);
        initGrid.push(...numArray);
      }

      return initGrid;
    },

    containsZero(num) {
      return String(num).includes('0');
    },
  };
})();