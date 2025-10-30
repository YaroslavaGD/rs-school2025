document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.classList.add('kalimba-container');

  const defaultKeys = ['D6', 'B5', 'G5', 'E5', 'C5', 'A4', 'F4', 'D4', 'C4', 'E4', 'G4', 'B4', 'D5', 'F5', 'A5', 'C6', 'E6'];

  defaultKeys.forEach((key) => {
    const tine = document.createElement('div');
    tine.classList.add('tine');
    tine.textContent = key;

    container.appendChild(tine);
  });

  document.body.appendChild(container);
});