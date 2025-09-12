import hydrateSlots from '../lib/hydrateSlots.js';

describe('hydrateSlots coverage edge cases', () => {
  it('handles missing slot name gracefully', () => {
    const el = document.createElement('div');
    el.setAttribute('data-comp-root', '');
    const compFn = { el, _id: 1 };
    expect(() => hydrateSlots(compFn, {}, {}, null)).not.toThrow();
  });

  it('handles default slot fallback', () => {
    const el = document.createElement('div');
    el.setAttribute('data-comp-root', '');
    const compFn = { el, _id: 2 };
    expect(() => hydrateSlots(compFn, { children: 'child' }, {}, {})).not.toThrow();
  });

  it('handles slotEntries with null default', () => {
    const el = document.createElement('div');
    el.setAttribute('data-comp-root', '');
    const compFn = { el, _id: 3 };
    expect(() => hydrateSlots(compFn, {}, {}, {})).not.toThrow();
  });

  it('handles missing ntarget', () => {
    const el = document.createElement('div');
    el.setAttribute('data-comp-root', '');
    const compFn = { el, _id: 4 };
    expect(() => hydrateSlots(compFn, {}, {}, { foo: 'bar' })).not.toThrow();
  });

  it('handles value as null', () => {
    const el = document.createElement('div');
    el.setAttribute('data-comp-root', '');
    const compFn = { el, _id: 5 };
    expect(() => hydrateSlots(compFn, {}, {}, { foo: null })).not.toThrow();
  });
});
