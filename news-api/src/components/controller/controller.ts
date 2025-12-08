import { EndpointValues, type Callback } from '../../types';
import AppLoader from './appLoader';

class AppController extends AppLoader {
  getSources(callback: Callback) {
    super.getResp(
      {
        endpoint: EndpointValues.sources,
      },
      callback
    );
  }

  getNews(e: Event, callback: Callback): void {
    let target: EventTarget | null = e.target;
    const newsContainer: EventTarget | null = e.currentTarget;
    if (!(newsContainer instanceof HTMLElement)) return;

    while (target !== newsContainer) {
      if (target && target instanceof HTMLElement) {
        if (target.classList.contains('source__item')) {
          const sourceId = target.getAttribute('data-source-id');

          if (sourceId && newsContainer.getAttribute('data-source') !== sourceId) {
            newsContainer.setAttribute('data-source', sourceId);
            super.getResp(
              {
                endpoint: EndpointValues.sources,
                options: {
                  sources: sourceId,
                },
              },
              callback
            );
          }
          return;
        }

        target = target.parentNode;
      }
    }
  }
}

export default AppController;
