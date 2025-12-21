export function setupCounter(element: HTMLButtonElement) {
  const button = element;
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    button.innerHTML = `count is ${counter}`;
  };
  button.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
