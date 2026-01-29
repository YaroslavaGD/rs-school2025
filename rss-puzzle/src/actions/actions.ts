import { store } from '../store/store';

export function login(firstName: string, lastName: string) {
  store.setState({
    ...store.getState(),
    user: { firstName, lastName },
    page: 'game',
  });
}
