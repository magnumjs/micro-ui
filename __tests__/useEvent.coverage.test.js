import { useEvent } from '../lib/hooks/useEvent.js';
describe('useEvent coverage', () => {
  it('throws if not inside render', () => {
    expect(() => useEvent()).toThrow();
  });
});
