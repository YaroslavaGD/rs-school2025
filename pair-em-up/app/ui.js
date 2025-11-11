export const UI = (() => {
  return {
    renderStart(root) {
      const start = document.createElement('div');
      start.id = 'start-screen';
      start.classList.add('start-screen');
      
      const title = document.createElement('h1');
      title.classList.add('start-screen__title')
      title.innerText = `Pair '\em Up`;
      
      const mode = document.createElement('ul');
      mode.classList.add('mode');

      for (let i = 0; i < 3; i += 1) {
        const modeLi = document.createElement('li');
        modeLi.classList.add('mode__item');

        const modeLabel = document.createElement('label');
        modeLabel.classList.add('mode__label');

        const modeRadio = document.createElement('input');
        modeRadio.type = 'radio';
        modeRadio.name = 'mode';
        modeRadio.classList.add('mode__radio');

        const modeText = document.createElement('span');
        modeText.classList.add('mode__text');

        if (i === 0) {
          modeRadio.checked = true;
          modeRadio.value = 'classic';
          modeRadio.id = 'mode-classic';
          modeRadio.setAttribute('checked', true);

          modeLabel.setAttribute('for', 'mode-classic');
          modeText.innerText = 'Classic';
        }

        if (i === 1) {
          modeRadio.value = 'random';
          modeRadio.id = 'mode-random';

          modeLabel.setAttribute('for', 'mode-random');
          modeText.innerText = 'Random';
        }

        if (i === 2) {
          modeRadio.value = 'chaotic';
          modeRadio.id = 'mode-chaotic';

          modeLabel.setAttribute('for', 'mode-chaotic');
          modeText.innerText = 'Chaotic';
        }

        modeLabel.appendChild(modeRadio);
        modeLabel.appendChild(modeText);
        modeLi.appendChild(modeLabel);

        mode.appendChild(modeLi);
      }

      start.appendChild(title);
      start.appendChild(mode);
      root.appendChild(start);
    },
    renderGame(root) {

    },
  };
})();