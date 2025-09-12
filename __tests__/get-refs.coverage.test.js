import ref from '../lib/get-refs.js';
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";

describe('get-refs coverage edge cases', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => {
    console.warn.mockRestore();
  });
  let root;
  beforeEach(() => {
    root = document.createElement('div');
    root.setAttribute('data-comp-root', '1');
    document.body.appendChild(root);
  });
  afterEach(() => {
    root.remove();
  });

  it('returns null if no boundaryRoot', () => {
    expect(ref(null, 'foo')).toBeNull();
  });

  it('throws if not a component root', () => {
    const el = document.createElement('div');
    expect(() => ref(el, 'foo')).toThrow();
  });

  it('returns cached ref if valid', () => {
    const child = document.createElement('span');
    child.setAttribute('data-ref', 'foo');
    root.appendChild(child);
    expect(ref(root, 'foo')).toBe(child);
    // Should be cached
    expect(ref(root, 'foo')).toBe(child);
  });

  it('removes stale cached ref', () => {
    const child = document.createElement('span');
    child.setAttribute('data-ref', 'foo');
    root.appendChild(child);
    expect(ref(root, 'foo')).toBe(child);
    root.removeChild(child);
    expect(ref(root, 'foo')).toBeNull();
  });

  it('returns component instance if present', () => {
    const child = document.createElement('span');
    child.setAttribute('data-key', 'foo');
    child._componentInstance = { test: true };
    root.appendChild(child);
    expect(ref(root, 'foo')).toBe(child._componentInstance);
  });

  it('handles invalid selector gracefully', () => {
    // selector will be invalid if name contains invalid chars
    expect(() => ref(root, 'foo]')).not.toThrow();
    expect(ref(root, 'foo]')).toBeNull();
  });
});
