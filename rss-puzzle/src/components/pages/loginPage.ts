import { login } from '../../actions/actions';
import { Component } from '../component';
import { button, input } from '../tags';

export class LoginPage extends Component {
  constructor() {
    super({ tag: 'div', className: 'login-page' });

    const inputName = input({
      className: 'login-input',
      placeholder: 'First Name',
      type: 'text',
    });

    const inputLastName = input({
      className: 'login-input',
      placeholder: 'Last Name',
      type: 'text',
    });

    const loginButton = button({
      className: 'login-button',
      text: 'Login',
    }).on('click', () => {
      login(inputName.getNode().value, inputLastName.getNode().value);
    });

    this.appendChildren([inputName, inputLastName, loginButton]);
  }
}
