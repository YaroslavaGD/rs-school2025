import type { ArrayArticles } from '../../../types';
import './news.css';

class News {
  draw(data: ArrayArticles) {
    const news: ArrayArticles = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

    const fragment: DocumentFragment = document.createDocumentFragment();
    const newsItemTemp: Element | null = document.querySelector('#newsItemTemp');

    if (!(newsItemTemp && newsItemTemp instanceof HTMLTemplateElement)) return;

    news.forEach((item, idx) => {
      const newsClone: Node | null = newsItemTemp.content.cloneNode(true);
      if (!(newsClone && newsClone instanceof DocumentFragment)) return;
      const newsItem: Element | null = newsClone.querySelector('.news__item');
      const newsPhoto: Element | null = newsClone.querySelector('.news__meta-photo');
      const newsAuthor: Element | null = newsClone.querySelector('.news__meta-author');
      const newsDate: Element | null = newsClone.querySelector('.news__meta-date');
      const newsTitle: Element | null = newsClone.querySelector('.news__description-title');
      const newsSource: Element | null = newsClone.querySelector('.news__description-source');
      const newsContent: Element | null = newsClone.querySelector('.news__description-content');
      const newsReadMore: Element | null = newsClone.querySelector('.news__read-more a');

      if (newsItem && idx % 2) newsItem.classList.add('alt');

      if (newsPhoto && newsPhoto instanceof HTMLElement) {
        newsPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
      }
      if (newsAuthor) {
        newsAuthor.textContent = item.author || item.source.name;
      }

      if (newsDate) {
        newsDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');
      }

      if (newsTitle) {
        newsTitle.textContent = item.title;
      }

      if (newsSource) {
        newsSource.textContent = item.source.name;
      }

      if (newsContent) {
        newsContent.textContent = item.description;
      }

      if (newsReadMore) {
        newsReadMore.setAttribute('href', item.url);
      }

      fragment.append(newsClone);
    });

    const newsContainer: Element | null = document.querySelector('.news');

    if (!newsContainer) return;
    newsContainer.innerHTML = '';
    newsContainer.appendChild(fragment);
  }
}

export default News;
