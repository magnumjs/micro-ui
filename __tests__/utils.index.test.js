import * as utils from '../lib/utils/index.js';

describe('utils/index.js exports', () => {
  it('should export context and renderList modules', () => {
    expect(typeof utils).toBe('object');
    expect('context' in utils).toBe(true);
    expect('renderList' in utils).toBeDefined();
  });

  it('should have valid exports for context.js', () => {
    expect(typeof utils.context).toBe('object');
    expect(typeof utils.context.subscribe).toBe('function');
    expect(typeof utils.context.emit).toBe('function');
    expect(typeof utils.context.clear).toBe('function');
  });

  it('should have valid exports for renderList.js', () => {
    expect(typeof utils.renderList).toBe('function');
  });
});
