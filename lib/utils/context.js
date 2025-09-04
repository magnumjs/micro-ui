// context.js

// ---------- Reusable channel map (used by global + components) ----------
export function createChannelMap() {
  const channels = new Map();

  return {
    subscribe(eventName, fn) {
      if (!channels.has(eventName)) channels.set(eventName, new Set());
      const set = channels.get(eventName);
      set.add(fn);
      return () => set.delete(fn);
    },
    emit(eventName, payload) {
      const set = channels.get(eventName);
      if (set) for (const fn of set) fn(payload);
    },
    clear() {
      channels.clear();
    },
  };
}

// ---------- Core reactive primitive ----------
export function createState(initial) {
  let state = initial;
  const subs = new Set();

  function setState(next) {
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
  }
  function subscribe(fn) {
    subs.add(fn);
    fn(state);
    return () => subs.delete(fn);
  }
  function get() {
    return state;
  }

  return { get, setState, getState: get, subscribe };
}

// ---------- Global pub/sub (unchanged API) ----------
export const context = createChannelMap();

// ---------- Shared stores (global keyed) ----------
const stores = new Map();

export function shared(key, initial = {}) {
  if (!stores.has(key)) {
    const state = createState(initial);
    const api = {
      ...state,
      emit(event, payload) {
        state.setState(payload);
        context.emit(`${key}::${event}`, state.getState());
      },
      on(event, fn) {
        return context.subscribe(`${key}::${event}`, fn);
      },
    };
    stores.set(key, api);
  }
  return stores.get(key);
}
shared.clear = () => stores.clear();
