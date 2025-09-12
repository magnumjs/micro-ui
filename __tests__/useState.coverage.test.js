import { useState } from '../lib/hooks/useState.js';
import { jest } from '@jest/globals';
describe('useState coverage', () => {
  it('throws if not inside render', () => {
    expect(() => useState(1)).toThrow();
  });
  it('sets and updates state (real component)', async () => {
    const { createComponent } = await import('../lib/reactive-core.js');
    let stateVal, setStateVal;
    const comp = createComponent(() => {
      [stateVal, setStateVal] = useState(2);
      return `<span>${stateVal}</span>`;
    });
    const container = document.createElement('div');
    comp.mount(container);
    setStateVal(3);
    await Promise.resolve();
    expect(comp.el.innerHTML).toContain('3');
    comp.unmount();
  });
});
