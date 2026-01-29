import { store } from '../store/store';
import { Component } from './component';
import { GamePage } from './pages/gamePage';
import { LoginPage } from './pages/loginPage';

export class App extends Component {
  constructor() {
    super({});

    store.subscribe((state) => {
      this.destroyAllChildren();

      if (state.page === 'login') {
        this.append(new LoginPage());
      }

      if (state.page === 'game') {
        this.append(new GamePage());
      }
    });
  }
}
