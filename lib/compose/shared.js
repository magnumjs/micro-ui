
// shared.js
import { useCurrentComponent } from "../reactive-core.js";

// ---------- Core reactive primitive ----------
function createState(initial={}) {
  let state = initial;
  const subs = new Set();

  function setState(next) {
    // Defer updates if called during render
    queueMicrotask(() => {
      if (
        typeof state === "object" &&
        state !== null &&
        typeof next === "object" &&
        next !== null &&
        !Array.isArray(state) &&
        !Array.isArray(next)
      ) {
        state = { ...state, ...next };
      } else {
        state = typeof next === "function" ? next(state) : next;
      }

      subs.forEach((fn) => fn(state));
    });
  }

  function subscribe(fn) {
    subs.add(fn);
    fn(state);
    return () => subs.delete(fn);
  }

  function get() {
    return state;
  }

  return { get, setState, subscribe };
}

// Shared store map keyed by string
const stores = new Map();

export function shared(key, initial) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("shared() must be called inside a component");

  if (!stores.has(key)) {
    const state = createState(initial);
    const subscribers = new Map(); // comp._id -> unsubscribe fn

    const api = {
      get: state.get,
      set: state.setState,
      subscribe: state.subscribe,
      _subscribers: subscribers,
    };

    stores.set(key, api);
  }

  const store = stores.get(key);

  // Subscribe once per component
  if (!store._subscribers.has(comp._id)) {
    const unsubscribe = store.subscribe(() => {
      comp.update();
    });
    store._subscribers.set(comp._id, unsubscribe);

    // Cleanup on unmount
    comp.onUnmount(() => {
      const unsub = store._subscribers.get(comp._id);
      if (unsub) unsub();
      store._subscribers.delete(comp._id);
    });
  }

  return [store.get, store.set];
}

shared.clear = () => stores.clear();
