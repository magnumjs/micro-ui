import { useEffect } from '../../lib/hooks/useEffect.js';
import { createComponent } from '../../lib/reactive-core.js';
import { jest } from '@jest/globals';

describe('useEffect', () => {
  it('runs effect and cleanup inside a component', () => {
    let effectRun = false;
    let cleanupRun = false;
    const Comp = createComponent({
      render() {
        useEffect(() => {
          effectRun = true;
          return () => { cleanupRun = true; };
        });
        return '<div></div>';
      }
    });
    if (Comp.mount) {
      Comp.mount(document.createElement('div'));
    } else {
      Comp();
    }
    expect(effectRun).toBe(true);
    // Simulate unmount
    if (Comp.unmount) {
      Comp.unmount();
      expect(cleanupRun).toBe(true);
    }
  });

  it('runs effect on dependency change inside a component', async () => {
    let count = 0;
    let dep = { val: 1 };
    const Comp = createComponent({
      render() {
        useEffect(() => { count++; }, [dep.val]);
        return '<div></div>';
      }
    });
    if (Comp.mount) {
      Comp.mount(document.createElement('div'));
    } else {
      Comp();
    }
    dep.val = 2;
    Comp.update();
    await Promise.resolve();
    expect(count).toBe(2);
  });
});
