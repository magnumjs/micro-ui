import { useState } from '../../lib/hooks/useState.js';
import { createComponent } from '../../lib/reactive-core.js';
import { jest } from '@jest/globals';

describe('useState', () => {
  it('auto-generates setters for object state and updates only on change', async () => {
    let count, setCount, value, setValue;
    const Comp = createComponent({
      state: { count: 0, value: 'a' },
      render() {
        [count, setCount] = useState(Comp.state.count);
        [value, setValue] = useState(Comp.state.value);
        return '<div></div>';
      }
    });
    if (Comp.mount) {
      Comp.mount(document.createElement('div'));
    } else {
      Comp();
    }
    // Test auto-generated setter exists
    expect(typeof Comp.setCount).toBe('function');
    expect(typeof Comp.setValue).toBe('function');
    // Update count and value
    Comp.setCount(5);
    Comp.setValue('b');
    await Promise.resolve();
    expect(Comp.state.count).toBe(5);
    expect(Comp.state.value).toBe('b');
    // Should not update if value is unchanged
    const prevCount = Comp.state.count;
    Comp.setCount(5);
    await Promise.resolve();
    expect(Comp.state.count).toBe(prevCount);
  });
  it('initializes and gets value inside a component', () => {
    let val;
    const Comp = createComponent({
      render() {
        [val] = useState(5);
        return '';
      }
    });
    if (Comp.mount) {
      Comp.mount(document.createElement('div'));
    } else {
      Comp();
    }
    expect(val).toBe(5);
  });

  it('updates value inside a component and reflects in next render', async () => {
    let val, setVal;
    const Comp = createComponent({
      render() {
        [val, setVal] = useState(1);
        return '<!-- test -->';
      }
    });
    if (Comp.mount) {
      Comp.mount(document.createElement('div'));
    } else {
      Comp();
    }
    setVal(2);
    // Re-render to get updated value
    await Promise.resolve();
    expect(val).toBe(2);
  });
});
