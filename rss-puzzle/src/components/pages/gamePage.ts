import { store } from '../../store/store';
import { Component } from '../component';
import { div, h1, span } from '../tags';

export class GamePage extends Component {
  private levelNode = span({});

  constructor() {
    super({ tag: 'div', className: 'game-page' });

    this.append(h1('game-title', 'Game Page'));

    this.append(div({}, span({ text: 'Level: ' }), this.levelNode));

    store.subscribe((state) => {
      this.levelNode.setText(String(state.level));
    });
  }
}
