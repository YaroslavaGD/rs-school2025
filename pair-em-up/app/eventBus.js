import { IS_DEBUG, IS_EVENTS_DEBUG } from "./constants.js";

export const EventBus = (() =>{
  const events = {};

  return {
    on(name, listener) {
      if (!events[name]) events[name] = [];
  
      events[name].push(listener);
    },
  
    off(name, listener) {
      if (!events[name]) return;
  
      events[name] = events[name].filter((l) => l !== listener);
    },
  
    emit(name, data) {
      if (!events[name]) return;
  
      events[name].forEach(listener => listener(data));
      
      if (IS_DEBUG && IS_EVENTS_DEBUG) console.debug(`[EventBus] ${name}:`, data);
    }
  };
})();