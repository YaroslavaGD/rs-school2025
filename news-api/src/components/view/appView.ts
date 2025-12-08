import type { DataNews, DataSources } from '../../types';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
  private news: News = new News();
  private sources: Sources = new Sources();

  public drawNews(data: DataNews) {
    const values = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  public drawSources(data: DataSources) {
    const values = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
