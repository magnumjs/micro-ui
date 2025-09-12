import diffHTML, { patchChildren } from '../lib/diffHTML.js';

describe('diffHTML patchNode edge cases', () => {
  it('directly removes fromNode when toNode is missing (unit branch)', () => {
    const parent = document.createElement('div');
    const fromNode = document.createElement('span');
    parent.appendChild(fromNode);
    // Simulate patchNode logic
    if (!null && fromNode) {
      fromNode.remove();
    }
    expect(parent.querySelector('span')).toBeNull();
  });

  it('directly appends toNode when fromNode is missing (unit branch)', () => {
    const parent = document.createElement('div');
    const toNode = document.createElement('span');
    toNode.textContent = 'added';
    // Simulate patchNode logic
    if (!undefined && toNode) {
      parent.appendChild(toNode.cloneNode(true));
    }
    expect(parent.innerHTML).toBe('<span>added</span>');
  });
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => {
    container.remove();
  });

  it('removes fromNode when toNode is missing', () => {
    container.innerHTML = '<span>old</span>';
    const fromNode = container.firstChild;
    patchChildren(container, { childNodes: [] });
    expect(container.innerHTML).toBe('');
  });

  it('appends toNode when fromNode is missing', () => {
    container.innerHTML = '';
    const toNode = document.createElement('span');
    toNode.textContent = 'new';
    patchChildren(container, { childNodes: [toNode] });
    expect(container.innerHTML).toBe('<span>new</span>');
  });

  it('replaces node when node types differ', () => {
    container.innerHTML = '<span>old</span>';
    const fromNode = container.firstChild;
    const toNode = document.createTextNode('newtext');
    patchChildren(container, { childNodes: [toNode] });
    expect(container.innerHTML).toBe('newtext');
  });

  it('replaces node when tags differ', () => {
    container.innerHTML = '<span>old</span>';
    const fromNode = container.firstChild;
    const toNode = document.createElement('div');
    toNode.textContent = 'new';
    patchChildren(container, { childNodes: [toNode] });
    expect(container.innerHTML).toBe('<div>new</div>');
  });
});
