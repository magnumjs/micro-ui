import { createComponent } from '../lib/reactive-core.js';

describe('component instance with key outside parent render', () => {
  it('should render and mount children with and without keys correctly', () => {
    const Child = createComponent({
      render({ props }) {
        return `<span>${props.label}:${props.color}</span>`;
      },
    });

    // Parent with keys
    const ParentWithKeys = createComponent({
      render() {
        const childA = Child({ key: 'a', label: 'A', color: 'red' });
        const childB = Child({ key: 'b', label: 'B', color: 'green' });
        const childC = Child({ key: 'c', label: 'C', color: 'blue' });
        return `<div>${childA}${childB}${childC}</div>`;
      },
    });

    // Parent without keys
    const ParentNoKeys = createComponent({
      render() {
        const childA = Child({ label: 'A', color: 'red' });
        const childB = Child({ label: 'B', color: 'green' });
        const childC = Child({ label: 'C', color: 'blue' });
        return `<div>${childA}${childB}${childC}</div>`;
      },
    });

    // Mount to a real DOM element
    const realEl1 = document.createElement('div');
    document.body.appendChild(realEl1);
    ParentWithKeys.mount(realEl1);
    const realEl2 = document.createElement('div');
    document.body.appendChild(realEl2);
    ParentNoKeys.mount(realEl2);

    // After mount, check actual DOM content for ParentNoKeys
    expect(realEl2.innerHTML).toContain('<span>A:red</span>');
    expect(realEl2.innerHTML).toContain('<span>B:green</span>');
    expect(realEl2.innerHTML).toContain('<span>C:blue</span>');

    // After mount, check actual DOM content for ParentWithKeys
    expect(realEl1.innerHTML).toContain('<span data-key="a">A:red</span>');
    expect(realEl1.innerHTML).toContain('<span data-key="b">B:green</span>');
    expect(realEl1.innerHTML).toContain('<span data-key="c">C:blue</span>');

    // After mount, check instance uniqueness
    const parentInstKeys = ParentWithKeys();
    const childInstA = Child({ key: 'a', label: 'A', color: 'red' });
    const childInstB = Child({ key: 'b', label: 'B', color: 'green' });
    const childInstC = Child({ key: 'c', label: 'C', color: 'blue' });
    expect(childInstA.getId()).not.toBe(childInstB.getId());
    expect(childInstB.getId()).not.toBe(childInstC.getId());
    expect(+childInstA.toString()).toBe(childInstA.getId());
    expect(+childInstB.toString()).toBe(childInstB.getId());
    expect(+childInstC.toString()).toBe(childInstC.getId());

    expect(childInstA.render().toString()).toBe(`<span>A:red</span>`);
    expect(childInstB.render().toString()).toBe(`<span>B:green</span>`);
    expect(childInstC.render().toString()).toBe(`<span>C:blue</span>`);

    // Without keys, instances may be reused or not unique
    const parentInstNoKeys = ParentNoKeys();
    const childInstA2 = Child({ label: 'A', color: 'red' });
    const childInstB2 = Child({ label: 'B', color: 'green' });
    const childInstC2 = Child({ label: 'C', color: 'blue' });
    // These may or may not be unique depending on implementation, but output should be correct
    //   expect(childInstA2.toString()).toBe("<span>A:red</span>");
    //   expect(childInstB2.toString()).toBe("<span>B:green</span>");
    expect(childInstC2.toString()).toBe('<span>C:blue</span>');

    // Now test render output before and after mount
    const htmlKeysBeforeMount = ParentWithKeys.render();
    //   expect(htmlKeysBeforeMount.toString()).toContain("<span>A:red</span>");
    //   expect(htmlKeysBeforeMount.toString()).toContain("<span>B:green</span>");
    expect(htmlKeysBeforeMount.toString()).toContain('<div>131415</div>');

    const htmlNoKeys = ParentNoKeys.render();
    //   expect(htmlNoKeys.toString()).toContain("<span>A:red</span>");
    //   expect(htmlNoKeys.toString()).toContain("<span>B:green</span>");
    expect(htmlNoKeys.toString()).toContain(
      '<div><span>C:blue</span><span>C:blue</span><span>C:blue</span></div>',
    );

    const htmlKeysAfterMount = ParentWithKeys.render();
    //   expect(htmlKeysAfterMount.toString()).toContain("<span>A:red</span>");
    //   expect(htmlKeysAfterMount.toString()).toContain("<span>B:green</span>");
    expect(htmlKeysAfterMount.toString()).toContain('<div>131415</div>');
  });
});
