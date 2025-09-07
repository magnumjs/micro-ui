/**
 * @jest-environment jsdom
 */

import { useFetch } from '../../lib/hooks/useFetch.js';
import { createComponent } from '../../lib/reactive-core.js';
import { jest } from '@jest/globals';


describe('useFetch', () => {
  it('explicitly covers useFetch.js lines 19-27 (success and error)', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve({ ok: true })
    }));
    let api;
    const Comp = createComponent({
      render() {
        api = useFetch('/cover');
        return '<div></div>';
      }
    });
    Comp();
    await api.refresh();
    expect(api.get().data).toEqual({ ok: true });
    expect(api.get().loading).toBe(false);
    // Error branch
    global.fetch = jest.fn().mockImplementationOnce(() => Promise.reject('fail'));
    await api.refresh();
    expect(api.get().error).toBe('fail');
    expect(api.get().loading).toBe(false);
  });
  it('throws if called outside a component render', () => {
    expect(() => useFetch('/fail')).toThrow('useFetch must be called inside a component render or lifecycle');
  });
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => Promise.resolve({
      json: () => Promise.resolve({ result: 'ok', url }),
    }));
  });

  it('initializes with loading state inside a component', () => {
    let api;
    const Comp = createComponent({
      render() {
        api = useFetch('/test');
        return '<div></div>';
      }
    });
    Comp();
    expect(api.get().loading).toBe(true);
  });

  it('fetches data and updates state inside a component (manual refresh)', async () => {
    let api;
    const Comp = createComponent({
      render() {
        api = useFetch('/test');
        return '<div></div>';
      }
    });
    Comp();
    await api.refresh(); // force fetch
    await new Promise(r => setTimeout(r, 0)); // wait for microtask
    expect(api.get().data).toEqual({ result: 'ok', url: '/test' });
    expect(api.get().loading).toBe(false);
  }, 5000);

  it('calls subscribe callback on state update', async () => {
    let api;
    const callback = jest.fn();
    let Comp;
    Comp = createComponent({
      render() {
        api = useFetch('/sub');
        return '<div></div>';
      }
    });
    Comp.mount(document.createElement('div'));
    api.subscribe(callback);
    await api.refresh();
    if (Comp.update) {
      Comp.update();
    }
    await new Promise(r => setTimeout(r, 0));
    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[callback.mock.calls.length - 1][0].data).toEqual({ result: 'ok', url: '/sub' });
  });
  
  it('handles fetch error inside a component (manual refresh)', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('fail'));
    let api;
    const Comp = createComponent({
      render() {
        api = useFetch('/fail');
        return '<div></div>';
      }
    });
    Comp();
    await api.refresh(); // force fetch
    await new Promise(r => setTimeout(r, 0)); // wait for microtask
    expect(api.get().error).toBe('fail');
    expect(api.get().loading).toBe(false);
  }, 5000);
});
