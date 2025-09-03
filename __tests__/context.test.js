import { context } from '../lib/reactive-core-helpers/context.js';
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe('context pub/sub system', () => {
  beforeEach(() => {
    context.clear();
  });

  test('should subscribe and receive emitted payload', () => {
    const handler = jest.fn();
    context.subscribe('auth::login', handler);

    context.emit('auth::login', { user: 'Alice' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ user: 'Alice' });
  });

  test('should support multiple listeners for same event', () => {
    const a = jest.fn();
    const b = jest.fn();

    context.subscribe('cart::update', a);
    context.subscribe('cart::update', b);

    context.emit('cart::update', { items: [1, 2, 3] });

    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
  });

  test('should not call handler after unsubscribe', () => {
    const handler = jest.fn();
    const unsub = context.subscribe('ping::pong', handler);

    context.emit('ping::pong', 'first');
    unsub();
    context.emit('ping::pong', 'second');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('first');
  });

  test('should not throw if no listeners for event', () => {
    expect(() => {
      context.emit('does::not-exist', { safe: true });
    }).not.toThrow();
  });

  test('should clear all subscribers', () => {
    const fn = jest.fn();
    context.subscribe('something::happened', fn);
    context.clear();

    context.emit('something::happened', { after: 'clear' });

    expect(fn).not.toHaveBeenCalled();
  });
});
