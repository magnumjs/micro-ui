import { createComponent } from '../lib/reactive-core.js';

describe('componentFn.toString context-sensitive behavior', () => {
  it('returns stringified id only when called within a parent render', () => {
    // Simulate parent-child render context
    let capturedId;
    const Child = createComponent(() => 'child-html');
    const Parent = createComponent(() => {
      // Simulate parent render context
      capturedId = Child.toString();
      return 'parent-html';
    });
    Parent(); // triggers parent render, which calls Child.toString in parent context
    expect(capturedId).toBe(String(Child._id));
  });

  it('returns HTML when not in parent render context', () => {
    const Comp = createComponent(() => 'comp-html');
    Comp(); // triggers top-level render
    expect(Comp.toString()).toBe('comp-html');
  });
});
