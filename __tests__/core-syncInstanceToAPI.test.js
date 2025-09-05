import { syncInstanceToAPI } from "../lib/reactive-core-helpers/syncInstanceToAPI.js";

describe("syncInstanceToAPI", () => {
  it("copies missing keys from instance to componentFn as getters", () => {
    const instance = { foo: 42, bar: "baz" };
    const componentFn = {};
    syncInstanceToAPI(instance, componentFn);
    expect(componentFn.foo).toBe(42);
    expect(componentFn.bar).toBe("baz");
  });

  it("does not overwrite existing keys on componentFn", () => {
    const instance = { foo: 123 };
    const componentFn = { foo: "existing" };
    syncInstanceToAPI(instance, componentFn);
    expect(componentFn.foo).toBe("existing");
  });

  it("getter reflects changes in instance after sync", () => {
    const instance = { foo: 1 };
    const componentFn = {};
    syncInstanceToAPI(instance, componentFn);
    expect(componentFn.foo).toBe(1);
    instance.foo = 99;
    expect(componentFn.foo).toBe(99);
  });
});
