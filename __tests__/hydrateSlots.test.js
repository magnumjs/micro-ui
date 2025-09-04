/**
 * @jest-environment jsdom
 */
import hydrateSlots from '../lib/hydrateSlots.js';

describe('hydrateSlots edge cases', () => {
  it('returns early if slots is undefined (line 11)', () => {
    const result = hydrateSlots({}, {}, {}, undefined);
    expect(result).toBeUndefined();
  });

  it('handles missing slot name (line 38)', () => {
    const result = hydrateSlots({}, {}, {}, 'missingSlot');
    expect(result).toBeUndefined();
  });

  it('handles empty children (line 45)', () => {
    const result = hydrateSlots({}, { slot1: [] }, {}, 'slot1');
    expect(result).toBeUndefined();
  });
});
