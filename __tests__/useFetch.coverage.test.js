import { useFetch } from '../lib/hooks/useFetch.js';
import { jest } from '@jest/globals';
describe('useFetch coverage', () => {
  it('throws if not inside render', () => {
    expect(() => useFetch('/api')).toThrow();
  });
  it('handles fetch error (real component)', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('fail')));
    const { createComponent } = await import('../lib/reactive-core.js');
    let errorState;
    const comp = createComponent(() => {
      const api = useFetch('/api');
      errorState = api.get().error;
      return `<span>fetch</span>`;
    });
    const container = document.createElement('div');
    comp.mount(container);
    // Wait for the fetch error to propagate and state to update
    await new Promise(resolve => setTimeout(resolve, 10));
    errorState = comp.state.error;
    expect(errorState).toBeInstanceOf(Error);
    comp.unmount();
  });
});
