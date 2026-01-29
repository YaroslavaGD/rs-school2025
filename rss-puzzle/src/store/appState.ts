export type Page = 'login' | 'game';

export interface AppState {
  page: Page;
  user: {
    firstName: string;
    lastName: string;
  } | null;
  level: number;
}

export const initialState: AppState = {
  page: 'login',
  user: null,
  level: 1,
};
