import type { ArraySources } from '../../../types';
import './sources.css';

class Sources {
  draw(data: ArraySources) {
    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemp: Element | null = document.querySelector('#sourceItemTemp');
    if (sourceItemTemp && sourceItemTemp instanceof HTMLTemplateElement) {
      data.forEach((item) => {
        const sourceClone: Node | null = sourceItemTemp.content.cloneNode(true);

        if (sourceClone && sourceClone instanceof DocumentFragment) {
          const itemName: Element | null = sourceClone.querySelector('.source__item-name');
          const itemSource: Element | null = sourceClone.querySelector('.sources');

          if (!itemName || !itemSource) return;
          itemName.textContent = item.name;

          if (item.id) itemSource.setAttribute('data-source-id', item.id);
          fragment.append(sourceClone);
        }
      });

      const sourcesOutput: Element | null = document.querySelector('.sources');
      if (sourcesOutput) sourcesOutput.append(fragment);
    }
  }
}

export default Sources;
