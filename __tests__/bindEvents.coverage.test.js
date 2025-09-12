import bindEvents from '../lib/bindEvents.js';
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";

describe('bindEvents coverage edge cases', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => {
    console.warn.mockRestore();
  });
  let el, api, boundEvents;
  beforeEach(() => {
    el = document.createElement('div');
    el.innerHTML = '<button data-action-click="doSomething" data-args-click="[1,2]"></button>';
    api = { state: {}, setState: jest.fn(), props: {}, refs: {} };
    boundEvents = [];
  });

  it('returns early if el is missing', () => {
    expect(() => bindEvents(api, null, {}, boundEvents)).not.toThrow();
  });

  it('returns early if el.children[0] is missing', () => {
    const emptyEl = document.createElement('div');
    expect(() => bindEvents(api, emptyEl, {}, boundEvents)).not.toThrow();
  });

  it('returns early if on is missing', () => {
    expect(() => bindEvents(api, el, null, boundEvents)).not.toThrow();
  });

  it('handles invalid JSON in data-args', () => {
    el.innerHTML = '<button data-action-click="doSomething" data-args-click="notjson"></button>';
    const handler = jest.fn();
    bindEvents(api, el, { 'click *': handler }, boundEvents);
    const btn = el.querySelector('button');
    btn.click();
    // Should warn but not throw
    expect(handler).toHaveBeenCalled();
  });

  it('handles selector-based fallback', () => {
    const handler = jest.fn();
    bindEvents(api, el, { 'click button': handler }, boundEvents);
    const btn = el.querySelector('button');
    btn.click();
    expect(handler).toHaveBeenCalled();
  });

  it('handles colon syntax and wildcard event', () => {
    const handler = jest.fn();
    bindEvents(api, el, { '*:doSomething': handler }, boundEvents);
    const btn = el.querySelector('button');
    btn.click();
    expect(handler).toHaveBeenCalled();
  });
});
