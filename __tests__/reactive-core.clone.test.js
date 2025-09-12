import { createComponent } from '../lib/reactive-core.js';
describe('componentFn.clone', () => {
  it('creates a new instance with initialProps', () => {
    const comp = createComponent(() => '<span>hello</span>', { state: { foo: 1 } });
    const clone = comp.clone({ bar: 2 });
    expect(clone).not.toBe(comp);
    expect(clone._templateSource).toBe(comp);
    expect(clone._initialProps).toEqual({ bar: 2 });
    expect(typeof clone.mount).toBe('function');
    expect(clone.state.foo).toBe(1); // original state copied
  });

  it('clone produces same render output as original', () => {
    const comp = createComponent(() => '<span>hello</span>');
    const clone = comp.clone();
    expect(String(clone.render())).toBe(String(comp.render()));
  });
});
