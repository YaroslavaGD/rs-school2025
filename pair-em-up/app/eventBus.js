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
      
      console.debug(`[EventBus] ${name}:`, data);
    }
  };
})();