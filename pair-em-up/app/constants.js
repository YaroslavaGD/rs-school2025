export const CLASSIC_GRID_LENGTH = 20;
export const MODE = {
  CLASSIC: 'classic',
  RANDOM: 'random',
  CHAOTIC: 'chaotic',
};

export const UI_EVENTS = {
  START: 'ui:start',
  BACK: 'ui:back',
  RESET: 'ui:reset',
  CONTINUE: 'ui:continue',
  CELL_CLICK: 'ui:cell:click',
  MATCHED: 'ui:matched',
  UNMATCHED: 'ui:unmatched',
  ASSIST_USE: 'ui:assist:use',
  UPDATE_ASSISTS_UI: 'ui:assist:update',
  ERASER_ACTIVATED: 'ui:eraser:activated',
  ERASER_CANCELLED: 'ui:eraser:cancelled',
};

export const GAME_EVENTS = {
  WIN: 'game: win',
  LOSE: 'game: lose',
};

export const SCREEN_TYPE = {
  START: 'start',
  GAME: 'game',
  RESULTS: 'results',
};

export const RESULT_REASON = {
  WIN: 'win',
  LOSE_LINES: 'lose: 50-line limit',
  LOSE_NO_MOVES: 'lose: no valid moves',
};

export const ASSIST_NAME = {
  HINTS: 'hints',
  REVERT: 'revert',
  ADD_NUMBERS: 'addNumbers',
  SHUFFLE: 'shuffle',
  ERASER: 'eraser',
};

export const ANIMATION_DELAYS = {
  PAIR_CHECK: 160,
  PAIR_REMOVE: 160,
  UNMATCHED_RESET: 300,
  WIN_SCREEN_DELAY: 350,
}

export const IS_DEBUG = true;
export const IS_STORE_DEBUG = false;
export const IS_EVENTS_DEBUG = false;