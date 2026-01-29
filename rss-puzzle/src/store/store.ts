import { type AppState, initialState } from './appState';

type Listener = (state: AppState) => void;

class Store {
  private state: AppState;
  private listeners = new Set<Listener>();

  constructor(initial: AppState) {
    this.state = initial;
  }

  public getState(): AppState {
    return this.state;
  }

  public setState(newState: AppState): void {
    this.state = newState;
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);

    return () => this.listeners.delete(listener);
  }
}

export const store = new Store(initialState);
