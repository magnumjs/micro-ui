import { useEmit } from '../lib/hooks/useEmit.js';
import { createComponent } from '../lib/reactive-core.js';
describe('useEmit coverage', () => {
  it('cleans up context listeners on unmount', () => {
    const comp = createComponent(() => {
      useEmit();
      return `<span>emit</span>`;
    });
    const container = document.createElement('div');
    comp.mount(container);
    comp.unmount();
    expect(comp._hasEmits).toBe(true);
  });
});
