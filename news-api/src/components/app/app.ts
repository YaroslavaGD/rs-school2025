import type { DataNews, DataSources } from '../../types';
import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
  private controller: AppController;
  private view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  start() {
    const sourceContainer: Element | null = document.querySelector('.sources');
    if (sourceContainer && sourceContainer instanceof HTMLElement) {
      sourceContainer.addEventListener('click', (e: MouseEvent): void =>
        this.controller.getNews(e, (data) => this.view.drawNews(data as DataNews))
      );
      this.controller.getSources((data) => this.view.drawSources(data as DataSources));
    }
  }
}

export default App;
