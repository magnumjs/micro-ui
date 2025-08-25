import { jest, test, expect, describe } from "@jest/globals";
import { runBeforeHook } from "../lib/reactive-core-helpers/runBeforeHook.js";

describe("runBeforeHook edge cases", () => {
  test("should catch and log error in single sync hook and still call next", done => {
    const error = new Error("sync error");
    const hook = jest.fn(() => { throw error; });
    const next = jest.fn(() => {
      expect(hook).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      done();
    });
    runBeforeHook(hook, next);
  });

  test("should catch and log error in single async hook and still call next", done => {
    const hook = jest.fn(() => Promise.reject("async error"));
    const next = jest.fn(() => {
      expect(hook).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      done();
    });
    runBeforeHook(hook, next);
  });
});
