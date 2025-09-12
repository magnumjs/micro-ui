import { useEvents } from '../lib/hooks/useEvents.js';
import { jest } from '@jest/globals';
describe('useEvents coverage', () => {
  it('throws if not inside render', () => {
    expect(() => useEvents()).toThrow();
  });
  it('adds event handler and returns ref (real component)', async () => {
    const { createComponent } = await import('../lib/reactive-core.js');
    let refValue;
    const comp = createComponent(() => {
      const api = useEvents();
      refValue = api.onClick(() => {});
      return `<span>events</span>`;
    });
    const container = document.createElement('div');
    comp.mount(container);
    expect(typeof refValue).toBe('string');
    comp.unmount();
  });
});
