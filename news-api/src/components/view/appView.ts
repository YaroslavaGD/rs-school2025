import type { IEverything, ISources } from '../../types';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
  private news: News = new News();
  private sources: Sources = new Sources();

  drawNews(data: IEverything) {
    const values = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  drawSources(data: ISources) {
    const values = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
