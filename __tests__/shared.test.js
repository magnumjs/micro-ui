/**
 * @jest-environment jsdom
 */

import { createState, context, shared } from "../lib/reactive-core";
import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("createState", () => {
  test("initial state is returned via get", () => {
    const store = createState({ count: 1 });
    expect(store.get()).toEqual({ count: 1 });
  });

  test("setState updates state and notifies subscribers", () => {
    const store = createState({ count: 1 });
    const spy = jest.fn();
    store.subscribe(spy);

    store.setState({ count: 2 });
    expect(store.get()).toEqual({ count: 2 });
    expect(spy).toHaveBeenCalledWith({ count: 2 });
  });

  test("setState supports functional update", () => {
    const store = createState({ count: 1 });
    const spy = jest.fn();
    store.subscribe(spy);

    store.setState((prev) => ({ count: prev.count + 1 }));
    expect(store.get()).toEqual({ count: 2 });
    expect(spy).toHaveBeenCalledWith({ count: 2 });
  });

  test("unsubscribe removes the listener", () => {
    const store = createState({ count: 0 });
    const spy = jest.fn();
    const unsub = store.subscribe(spy);

    unsub();
    store.setState({ count: 5 });
    expect(spy).toHaveBeenCalledTimes(1); // Only initial call
  });
});

describe("context pub/sub", () => {
  afterEach(() => context.clear());

  test("subscribers receive emitted payloads", () => {
    const spy = jest.fn();
    context.subscribe("hello::event", spy);
    context.emit("hello::event", { msg: "hi" });

    expect(spy).toHaveBeenCalledWith({ msg: "hi" });
  });

  test("clear removes all channels", () => {
    const spy = jest.fn();
    context.subscribe("hello::event", spy);

    context.emit("hello::event", { msg: "hi" });
    expect(spy).toHaveBeenCalledTimes(1); // ✅ first call works

    context.clear();

    context.emit("hello::event", { msg: "still there?" });
    expect(spy).toHaveBeenCalledTimes(1); // ✅ no additional call
  });

  test("unsubscribe prevents future emits", () => {
    const spy = jest.fn();
    const unsub = context.subscribe("a::b", spy);
    unsub();

    context.emit("a::b", { removed: true });
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe("shared store helper", () => {
  beforeEach(() => {
    context.clear();
    shared.clear(); // 🔥 Clear store memory between tests
  });

  test("shared() returns reactive state with get/set", () => {
    const auth = shared("auth", { loggedIn: false });

    expect(auth.get()).toEqual({ loggedIn: false });

    auth.setState({ loggedIn: true });
    expect(auth.get()).toEqual({ loggedIn: true });
  });

  test("shared().emit() updates state and notifies context", () => {
    const auth = shared("auth", { user: null });

    const received = [];
    const unsub = auth.on("login", (data) => {
      received.push(data);
    });

    auth.emit("login", { user: "Tova" });

    expect(auth.get()).toEqual({ user: "Tova" });
    expect(received[0]).toEqual({ user: "Tova" });

    unsub();
  });

  test("shared() always returns same instance per key", () => {
    const one = shared("auth", { count: 1 });
    const two = shared("auth");

    expect(one).toBe(two);
    expect(two.get()).toEqual({ count: 1 });
  });

  test("emit auto-merges into existing state", () => {
    const store = shared("settings", { dark: false, fontSize: 12 });

    const received = [];
    store.on("update", (val) => received.push(val));

    store.emit("update", { dark: true });

    expect(store.get()).toEqual({ dark: true, fontSize: 12 });
    expect(received[0]).toEqual({ dark: true, fontSize: 12 });
  });
});
