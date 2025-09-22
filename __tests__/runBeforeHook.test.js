import { runBeforeHook } from "../lib/core/hooks.js";
import { jest, describe, test, expect } from "@jest/globals";

describe("runBeforeHook", () => {
  let originalConsoleError;
  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalConsoleError;
  });


  test("calls array of sync hooks in order", done => {
    const calls = [];
    const hooks = [
      jest.fn(() => calls.push(1)),
      jest.fn(() => calls.push(2)),
      jest.fn(() => calls.push(3)),
    ];
    runBeforeHook(hooks, () => {
      expect(calls).toEqual([1, 2, 3]);
      hooks.forEach(h => expect(h).toHaveBeenCalled());
      done();
    });
  });

  test("calls array of async hooks in order", done => {
    const calls = [];
    const hooks = [
      jest.fn(() => Promise.resolve(calls.push(1))),
      jest.fn(() => Promise.resolve(calls.push(2))),
      jest.fn(() => Promise.resolve(calls.push(3))),
    ];
    runBeforeHook(hooks, () => {
      expect(calls).toEqual([1, 2, 3]);
      hooks.forEach(h => expect(h).toHaveBeenCalled());
      done();
    });
  });

  test("handles errors in sync hook and continues", done => {
    const calls = [];
    const hooks = [
      jest.fn(() => { throw new Error("fail"); }),
      jest.fn(() => calls.push(2)),
    ];
    runBeforeHook(hooks, () => {
      expect(hooks[0]).toHaveBeenCalled();
      expect(calls).toEqual([2]);
      done();
    });
  });

  test("handles errors in async hook and continues", done => {
    const calls = [];
    const hooks = [
      jest.fn(() => Promise.reject("fail")),
      jest.fn(() => calls.push(2)),
    ];
    runBeforeHook(hooks, () => {
      expect(hooks[0]).toHaveBeenCalled();
      expect(calls).toEqual([2]);
      done();
    });
  });


});
