/**
 * @jest-environment jsdom
 */
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import diffHTML from '../lib/diffHTML.js'; // adjust import path accordingly

describe('diffHTML function', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  test('returns false if el is falsy', () => {
    expect(diffHTML(null, '<div></div>')).toBe(false);
  });

  test('inserts all new nodes when container is empty', () => {
    const html = `
      <div data-key="a">A</div>
      <div data-key="b">B</div>
    `.trim();

    const result = diffHTML(container, html);
    expect(result).toBe(true);
    expect(container.children.length).toBe(2);
    expect(container.querySelector('[data-key="a"]').textContent).toBe('A');
    expect(container.querySelector('[data-key="b"]').textContent).toBe('B');
  });

  test('updates innerHTML of existing keyed nodes if different', () => {
    container.innerHTML = `
      <div data-key="a">Old</div>
      <div data-key="b">B</div>
    `.trim();

    const html = `
      <div data-key="a">New</div>
      <div data-key="b">B</div>
    `.trim();

    diffHTML(container, html);
    expect(container.querySelector('[data-key="a"]').textContent).toBe('New');
  });

  test('does not update innerHTML if it is the same', () => {
    container.innerHTML = `
      <div data-key="a">Same</div>
    `.trim();

    const html = `
      <div data-key="a">Same</div>
    `.trim();

    // Spy on innerHTML setter to check it is NOT called
    const node = container.querySelector('[data-key="a"]');
    const spy = jest.spyOn(node, 'innerHTML', 'set');
    diffHTML(container, html);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('moves existing nodes when order changes', () => {
    container.innerHTML = `
      <div data-key="1">One</div>
      <div data-key="2">Two</div>
      <div data-key="3">Three</div>
    `.trim();

    const html = `
      <div data-key="3">Three</div>
      <div data-key="1">One</div>
      <div data-key="2">Two</div>
    `.trim();

    // Spy on insertBefore to verify movement
    const spy = jest.spyOn(container, 'insertBefore');

    diffHTML(container, html);

    expect(spy).toHaveBeenCalled();
    // Check final order is correct
    const keys = [...container.children].map((el) => el.dataset.key);
    expect(keys).toEqual(['3', '1', '2']);

    spy.mockRestore();
  });

  test('inserts new keyed nodes if not present', () => {
    container.innerHTML = `
      <div data-key="1">One</div>
    `.trim();

    const html = `
      <div data-key="1">One</div>
      <div data-key="2">Two</div>
    `.trim();

    diffHTML(container, html);
    expect(container.children.length).toBe(2);
    expect(container.querySelector('[data-key="2"]').textContent).toBe('Two');
  });

  test('removes leftover keyed nodes not in newHTML', () => {
    container.innerHTML = `
      <div data-key="1">One</div>
      <div data-key="2">Two</div>
      <div data-key="3">Three</div>
    `.trim();

    const html = `
      <div data-key="1">One</div>
      <div data-key="3">Three</div>
    `.trim();

    diffHTML(container, html);
    expect(container.querySelector('[data-key="2"]')).toBeNull();
    expect(container.children.length).toBe(2);
  });

  test('removes extra unkeyed nodes if newHTML is shorter', () => {
    container.innerHTML = `
      <div>Unkeyed 1</div>
      <div>Unkeyed 2</div>
      <div>Unkeyed 3</div>
    `.trim();

    const html = `
      <div>Unkeyed 1</div>
    `.trim();

    diffHTML(container, html);
    expect(container.children.length).toBe(1);
    expect(container.textContent).toBe('Unkeyed 1');
  });

  test('handles mix of keyed and unkeyed nodes', () => {
    container.innerHTML = `
      <div data-key="1">One</div>
      <div>Two</div>
      <div data-key="3">Three</div>
    `.trim();

    const html = `
      <div>Two</div>
      <div data-key="3">Three updated</div>
      <div data-key="1">One</div>
    `.trim();

    diffHTML(container, html);

    expect(container.children.length).toBe(3);
    expect(container.children[0].textContent).toBe('Two');
    expect(container.children[1].textContent).toBe('Three updated');
    expect(container.children[2].textContent).toBe('One');
  });

  test('returns true when update completes', () => {
    const html = '<div>Test</div>';
    expect(diffHTML(container, html)).toBe(true);
  });
});
