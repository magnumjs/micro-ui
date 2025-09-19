import { describe, test, expect } from '@jest/globals';
import { createComponent } from '../lib/reactive-core.js';

describe('componentFn.clone', () => {
  test('cloned instance renders HTML and is independent', () => {
    const MyComp = createComponent(({ props }) => {
      return `<div class="mycomp" data-key="${props.key || ''}">${props.text || ''}</div>`;
    });

    const inst1 = MyComp.clone({ key: 'a', text: 'A' });
    const inst2 = MyComp.clone({ key: 'b', text: 'B' });

    // Each clone should render its own HTML
    expect(inst1.render().toString()).toContain('data-key="a"');
    expect(inst1.render().toString()).toContain('A');
    expect(inst2.render().toString()).toContain('data-key="b"');
    expect(inst2.render().toString()).toContain('B');
    // They should be different instances
    expect(inst1).not.toBe(inst2);
    // Changing props on one should not affect the other
    inst1({ text: 'Changed' });
    // inst1.update({ text: 'Changed' });
    expect(inst1.render().toString()).toContain('Changed');
    expect(inst2.render().toString()).toContain('B');
  });
});

describe('componentFn.clone runner behavior', () => {
  test('cloned instance can be called as a runner to update props and re-render', () => {
    const MyComp = createComponent(({ props }) => {
      return `<div class="mycomp" data-key="${props.key || ''}">${props.text || ''}</div>`;
    });

    const inst = MyComp.clone({ key: 'a', text: 'A' });
    // Initial render
    expect(inst.render().toString()).toContain('A');
    // Call as runner to update props
    inst({ text: 'Changed' });
    expect(inst.render().toString()).toContain('Changed');
    // Call as runner again
    inst({ text: 'Again' });
    expect(inst.render().toString()).toContain('Again');
  });
});
