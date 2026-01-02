import { Component, type ElementFnProps } from './component';

export const div = (props: ElementFnProps<HTMLDivElement>, ...children: (Component | HTMLElement | null)[]) =>
  new Component<HTMLDivElement>(props, ...children);

export const input = (props: ElementFnProps & Partial<HTMLInputElement>) =>
  new Component<HTMLInputElement>({ ...props, tag: 'input' });

export const label = (props: ElementFnProps<HTMLLabelElement>, ...children: Component[]) =>
  new Component<HTMLLabelElement>({ ...props, tag: 'label' }, ...children);

export const form = (props: ElementFnProps<HTMLFormElement>, ...children: Component[]) =>
  new Component<HTMLFormElement>({ ...props, tag: 'form' }, ...children);

export const button = (props: ElementFnProps<HTMLButtonElement>, ...children: Component[]) =>
  new Component<HTMLButtonElement>({ ...props, tag: 'button' }, ...children);

export const img = ({ src = '', alt = '', className = '' }) =>
  new Component<HTMLElementTagNameMap['img']>({
    tag: 'img',
    className,
    src,
    alt,
  });
export const span = (props: ElementFnProps<HTMLSpanElement>, ...children: Component[]) =>
  new Component<HTMLSpanElement>({ ...props, tag: 'span' }, ...children);

export const a = (props: ElementFnProps<HTMLAnchorElement>, ...children: Component[]) =>
  new Component<HTMLAnchorElement>({ ...props, tag: 'a' }, ...children);

export const p = (props: ElementFnProps<HTMLParagraphElement>, ...children: Component[]) =>
  new Component<HTMLParagraphElement>({ ...props, tag: 'p' }, ...children);

export const h1 = (className: string, text: string) =>
  new Component<HTMLElementTagNameMap['h1']>({ tag: 'h1', className, text });

export const h2 = (className: string, text: string) =>
  new Component<HTMLElementTagNameMap['h2']>({ tag: 'h2', className, text });

export const h3 = (className: string, text: string) =>
  new Component<HTMLElementTagNameMap['h3']>({ tag: 'h3', className, text });

export const main = (props: ElementFnProps, ...children: Component[]) =>
  new Component({ ...props, tag: 'main' }, ...children);
export const nav = (props: ElementFnProps, ...children: Component[]) =>
  new Component({ ...props, tag: 'nav' }, ...children);
