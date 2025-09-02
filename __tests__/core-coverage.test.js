import { createComponent } from '../lib/reactive-core.js';
import getRef  from '../lib/get-refs.js';

describe('setState Object.is optimization', () => {
  xit('does not rerender if state is Object.is equal', async () => {
    let renderCount = 0;
    const Comp = createComponent({
      state: { value: 1 },
      render() {
        renderCount++;
        return `<div>${this.state.value}</div>`;
      }
    });
    const container = document.createElement('div');
    Comp.mount(container);
    Comp.setState({ value: 1 }); // Should not rerender
    await Promise.resolve();
    expect(renderCount).toBe(1);
    Comp.setState({ value: 2 }); // Should rerender
    await Promise.resolve();
    expect(renderCount).toBe(2);
  });
});


describe('direct parent handler as prop', () => {
  it('child calls parent handler directly via prop', () => {
    let called = false;
    let calledId = null;
    const Card = createComponent({
      render() {
        return `<button data-action-click="removeMe">Remove</button>`;
      },
      removeMe() {
        if (typeof this.props.remove === 'function') {
          this.props.remove(this.props.id);
        }
      }
    });
    const Parent = createComponent({
      render() {
        return Card({
          id: 42,
          remove: (id) => {
            called = true;
            calledId = id;
          }
        });
      }
    });
    const container = document.createElement('div');
    Parent.mount(container);
    const cardInstance = Parent._mountedChildren[0];
    cardInstance.removeMe();
    expect(called).toBe(true);
    expect(calledId).toBe(42);
  });
});
describe('api.on function', () => {
  it('adds event handler and returns on object', () => {
    const Comp = createComponent({
      render() {
        return `<div></div>`;
      }
    });
    // Add handler
    const result = Comp.on('foo', () => {});
    expect(typeof result).toBe('object');
    expect(typeof result.foo).toBe('function');
  });
});
describe('get-refs data-key lookup', () => {
  it('returns component instance for data-key match', () => {
    // Mock component instance
    const compInstance = { foo: 'bar' };
    // Create boundary root
    const root = document.createElement('div');
    root.setAttribute('data-comp-root', '1-root');
    // Create child with data-key and attach instance
    const child = document.createElement('div');
    child.setAttribute('data-key', 'myKey');
    child._componentInstance = compInstance;
    root.appendChild(child);
    // Import get-refs
   
    // Should return the component instance
    const result = getRef(root, 'myKey');
    expect(result).toBe(compInstance);
  });
});
describe('createComponent toString', () => {
  it('returns HTML string after render', () => {
    const Comp = createComponent({
      render() {
        return `<div>Hello</div>`;
      }
    });
    Comp.mount(document.createElement('div'));
    expect(Comp.toString()).toBe('<div>Hello</div>');
  });
  it('returns id before render', () => {
    const Comp = createComponent({
      render() {
        return `<div>Hello</div>`;
      }
    });
    // Not mounted, not rendered yet
    expect(typeof Comp.toString()).toBe('string');
    // Should be the id, not HTML
    expect(Comp.toString()).toMatch(/^\d+$/);
  });
});
