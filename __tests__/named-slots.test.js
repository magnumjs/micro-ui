/**
 * @jest-environment jsdom
 */

import { createComponent } from '../lib/reactive-core.js';

describe('Named Slot Support', () => {
  let root;
  let Component;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    Component?.destroy?.();
    document.body.innerHTML = '';
  });

  it('renders default slot using props.children (string)', () => {
    Component = createComponent(() => `<div><slot></slot></div>`);
    Component.mount(root);
    Component.update({ children: 'Hello World' });

    expect(root.innerHTML).toContain('Hello World');
  });

  it('renders default slot using props.children.default (named)', () => {
    Component = createComponent(() => `<div><slot></slot></div>`);
    Component.mount(root);
    Component.update({ children: { default: '<p>Hello</p>' } });

    expect(root.innerHTML).toContain('<p>Hello</p>');
  });

  it('renders named slot with fallback when not provided', () => {
    Component = createComponent(() => `<div><slot name="header">Default Header</slot></div>`);
    Component.mount(root);
    Component.update({});

    expect(root.innerHTML).toContain('Default Header');
  });

  it('renders named slot content when provided', () => {
    Component = createComponent(() => `<div><slot name="header">Default Header</slot></div>`);
    Component.mount(root);
    Component.update({
      slots: { header: '<h1>Custom Header</h1>' },
    });

    expect(root.innerHTML).toContain('<h1>Custom Header</h1>');
    expect(root.innerHTML).not.toContain('Default Header');
  });

  it('renders multiple named slots', () => {
    Component = createComponent(() => `
      <header><slot name="header">Default Header</slot></header>
      <main><slot></slot></main>
      <footer><slot name="footer">Default Footer</slot></footer>
    `);
    Component.mount(root);
    Component.update({
      slots: {
        default: '<p>Main content</p>',
        header: '<h1>My App</h1>',
        footer: '<small>© 2025</small>',
      },
    });

    expect(root.querySelector('header').innerHTML).toContain('My App');
    expect(root.querySelector('main').innerHTML).toContain('Main content');
    expect(root.querySelector('footer').innerHTML).toContain('© 2025');
  });

  it('uses default content when named slot not present in children', () => {
    Component = createComponent(() => `
      <header><slot name="header">Fallback Header</slot></header>
      <main><slot></slot></main>
      <footer><slot name="footer">Fallback Footer</slot></footer>
    `);
    Component.mount(root);
    Component.update({
      children: {
        default: '<p>Main</p>',
        header: '<h1>Header</h1>',
        // no footer provided
      },
    });

    expect(root.querySelector('footer').innerHTML).toContain('Fallback Footer');
  });
});
