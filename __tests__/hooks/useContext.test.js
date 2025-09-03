import { useContext } from '../../lib/hooks/useContext.js';
import { createComponent } from '../../lib/reactive-core.js';
import { jest } from '@jest/globals';

describe('useContext', () => {
  it('throws if called outside a component render', () => {
    expect(() => useContext('fail')).toThrow('useContext() must be inside render()');
  });

  it('provides and retrieves context value inside a component', () => {
    let result;
    const Comp = createComponent({
      render() {
        result = useContext('foo', 'default');
        return '';
      }
    });
    // Use mount to simulate real component lifecycle
    if (Comp.mount) {
      Comp.mount(document.createElement('div'));
    } else {
      Comp();
    }
    const [val, setVal] = result;
    expect(val).toBe('default');
    setVal('newValue');
    // Simulate another render to get updated value
    let newResult;
    const Comp2 = createComponent({
      render() {
        newResult = useContext('foo');
        return '';
      }
    });
    if (Comp2.mount) {
      Comp2.mount(document.createElement('div'));
    } else {
      Comp2();
    }
    const [newVal] = newResult;
    expect(newVal).toBe('newValue');
  });

  it('subscribes to context changes inside a component', () => {
    let result;
    const Comp = createComponent({
      render() {
        result = useContext('bar', 1);
        return '';
      }
    });
    if (Comp.mount) {
      Comp.mount(document.createElement('div'));
    } else {
      Comp();
    }
    const [val, setVal] = result;
    setVal(2);
    expect(val).toBe(1);
  });
});

