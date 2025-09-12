import { useEffect } from '../lib/hooks/useEffect.js';
describe('useEffect coverage', () => {
  it('throws if not inside render', () => {
    expect(() => useEffect(() => {})).toThrow();
  });
});
