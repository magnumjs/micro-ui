import { useContext } from '../lib/hooks/useContext.js';
import { createComponent } from '../lib/reactive-core.js';
describe('useContext coverage', () => {
  it('throws if not inside render', () => {
    expect(() => useContext('foo')).toThrow();
  });
  it('sets and updates context value', () => {
    let setValue;
    const comp = createComponent(() => {
      const [val, set] = useContext('bar', 1);
      setValue = set;
      return `<span>${val}</span>`;
    });
    const container = document.createElement('div');
    comp.mount(container);
    setValue(42);
    expect(comp.el.innerHTML).toContain('42');
    comp.unmount();
  });
});
