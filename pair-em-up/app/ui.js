import { EventBus } from "./eventBus.js";

export const UI = (() => {
  return {
    renderStart(root) {
      console.log('renderStart');
      const start = document.createElement('div');
      start.id = 'start-screen';
      start.classList.add('start-screen');
      
      const title = document.createElement('h1');
      title.classList.add('start-screen__title')
      title.innerText = `Pair '\em Up`;
      
      const modeContainer = document.createElement('ul');
      modeContainer.classList.add('mode');

      const modes = [
        { value: 'classic', label: 'Classic' },
        { value: 'random', label: 'Random' },
        { value: 'chaotic', label: 'Chaotic' },
      ];

      modes.forEach(m => {
        modeContainer.appendChild(this.createModeButton(m.value, m.label));
      });

      start.appendChild(title);
      start.appendChild(modeContainer);
      root.appendChild(start);
    },

    renderGame(root, state) {
      console.log('renderGame');
      const gameDiv = document.createElement('div');

      const info = document.createElement('div');
      info.textContent = `Mode: ${state.mode}, Score: ${state.score}`;
      gameDiv.appendChild(info);

      const backBtn = document.createElement('button');
      backBtn.textContent = 'Back to Menu';
      backBtn.addEventListener('click', () => {
        EventBus.emit('ui:back', {}); 
      });
      gameDiv.appendChild(backBtn);

      root.appendChild(gameDiv);
    },

    createModeButton(modeValue, modeLabel) {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');
      const span = document.createElement('span');

      li.classList.add('mode__item');
      label.classList.add('mode__label');

      input.type = 'radio';
      input.name = 'mode';
      input.value = modeValue;
      input.id = `mode-${modeValue}`;
      input.classList.add('mode__radio');
      if (modeValue === 'classic') input.checked = true;

      span.textContent = modeLabel;
      span.classList.add('mode__text');

      input.addEventListener('click', () => {
        EventBus.emit('ui:start', { mode: input.value });
      });

      label.htmlFor = `mode-${modeValue}`;
      label.appendChild(input);
      label.appendChild(span);
      li.appendChild(label);

      return li;
    }
  };
})();