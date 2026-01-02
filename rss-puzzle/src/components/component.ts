import { isNotNullable } from '../utils/isNotNullable';

type ComponentProps = { tag?: keyof HTMLElementTagNameMap; text?: string };
type ElementProps<T extends HTMLElement> = Partial<Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>>;
export type Props<T extends HTMLElement = HTMLElement> = ComponentProps & ElementProps<T>;

export class Component<T extends HTMLElement = HTMLElement> {
  protected node: T;
  protected children: (Component | HTMLElement)[] = [];

  private mounted = false;
  private destroyed = false;

  constructor(props: Props<T>, ...children: (Component | HTMLElement | null)[]) {
    const { text, tag, ...rest } = props;
    this.node = document.createElement(tag || 'div') as T;
    if (text !== undefined) this.node.textContent = text;
    Object.assign(this.node, rest);
    this.appendChildren(children.filter(isNotNullable));
  }

  public getNode(): T {
    return this.node;
  }

  public mount(parent: HTMLElement): this {
    if (this.destroyed) {
      throw new Error('Cannot mount a destroyed component.');
    }
    if (!this.mounted) {
      parent.append(this.node);
      this.mounted = true;
    }

    return this;
  }

  public unmount(): this {
    if (this.mounted) {
      this.node.remove();
      this.mounted = false;
    }

    return this;
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.unmount();
    this.destroyAllChildren();
    // this.node.remove();
  }

  // -- CHILDREN
  public append(child: Component | HTMLElement): this {
    if (this.destroyed) {
      throw new Error('Cannot append to destroyed component');
    }

    this.children.push(child);

    if (child instanceof Component) {
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }

    return this;
  }

  public appendChildren(children: (Component | HTMLElement)[]): this {
    children.filter(isNotNullable).forEach((child) => {
      this.append(child);
    });

    return this;
  }

  public destroyAllChildren(): void {
    this.children.forEach((child) => {
      if (child instanceof Component) {
        child.destroy();
      } else {
        child.remove();
      }
    });

    this.children = [];
  }

  public setText(text: string): this {
    this.node.textContent = text;
    return this;
  }

  public addClass(className: string): this {
    this.node.classList.add(className);
    return this;
  }

  public toggleClass(className: string): this {
    this.node.classList.toggle(className);
    return this;
  }

  public removeClass(className: string): this {
    this.node.classList.remove(className);
    return this;
  }

  public setAttr(name: string, value: string): this {
    this.node.setAttribute(name, value);
    return this;
  }

  public removeAttr(name: string): this {
    this.node.removeAttribute(name);
    return this;
  }

  public on<K extends keyof HTMLElementEventMap>(
    event: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): this {
    this.node.addEventListener(event, listener as EventListener, options);
    return this;
  }
}
