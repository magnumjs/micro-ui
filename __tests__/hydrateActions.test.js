import hydrateActions from '../lib/hydrateActions.js';
import {jest} from '@jest/globals';

describe('hydrateActions', () => {
  let api, rootEl;

  beforeEach(() => {
    api = {
      on: {},
      testHandler: jest.fn(),
      anotherHandler: jest.fn(),
    };
    rootEl = document.createElement('div');
  });

  test('does nothing if rootEl is null', () => {
    hydrateActions(api, null);
    expect(Object.keys(api.on)).toHaveLength(0);
  });

  test('binds handler from api.on[actionName]', () => {
    api.on['doSomething'] = jest.fn();
    rootEl.innerHTML = '<button data-action-click="doSomething"></button>';
    hydrateActions(api, rootEl);
    expect(typeof api.on['click:doSomething']).toBe('function');
    expect(api.on['click:doSomething']).not.toBe(api.on['doSomething']); // should be bound
  });

  test('binds handler from api[actionName] if not in api.on', () => {
    rootEl.innerHTML = '<button data-action-click="testHandler"></button>';
    hydrateActions(api, rootEl);
    expect(typeof api.on['click:testHandler']).toBe('function');
    api.on['click:testHandler']();
    expect(api.testHandler).toHaveBeenCalled();
  });

  test('does not bind if actionName is missing', () => {
    rootEl.innerHTML = '<button data-action-click=""></button>';
    hydrateActions(api, rootEl);
    expect(api.on['click:']).toBeUndefined();
  });

  test('does not overwrite explicit api.on[key]', () => {
    api.on['click:anotherHandler'] = jest.fn();
    rootEl.innerHTML = '<button data-action-click="anotherHandler"></button>';
    hydrateActions(api, rootEl);
    expect(api.on['click:anotherHandler']).not.toBe(api.anotherHandler);
  });

  test('handles multiple elements and attributes', () => {
    api.on['foo'] = jest.fn();
    rootEl.innerHTML = `
      <button data-action-click="foo"></button>
      <a data-action-mouseover="testHandler"></a>
    `;
    hydrateActions(api, rootEl);
    expect(typeof api.on['click:foo']).toBe('function');
    expect(typeof api.on['mouseover:testHandler']).toBe('function');
  });
});
