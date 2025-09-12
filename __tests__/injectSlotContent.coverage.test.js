import injectSlotContent from '../lib/injectSlotContent.js';

describe('injectSlotContent coverage edge cases', () => {
  it('handles missing slot gracefully', () => {
    const el = document.createElement('div');
    expect(() => injectSlotContent(el, null)).not.toThrow();
  });

  it('handles fallback slot', () => {
    const el = document.createElement('div');
    el.innerHTML = '<div data-slot="main"></div>';
    expect(() => injectSlotContent(el, 'main')).not.toThrow();
  });

  it('handles error branch', () => {
    const el = document.createElement('div');
    el.innerHTML = '<div></div>';
    expect(() => injectSlotContent(el, 'missing')).not.toThrow();
  });
});
