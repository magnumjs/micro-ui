export function createState(initial) {
  let state = initial;
  const subs = new Set();

  function setState(next) {
    state = typeof next === "function" ? next(state) : { ...state, ...next };
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
// Top-level shared pub/sub
const channels = new Map();

export const context = {
  subscribe(eventName, fn) {
    if (!channels.has(eventName)) {
      channels.set(eventName, new Set());
    }
    const set = channels.get(eventName);
    set.add(fn);
    return () => set.delete(fn);
  },

  emit(eventName, payload) {
    const set = channels.get(eventName);
    if (set) {
      for (const fn of set) fn(payload);
    }
  },

  clear() {
    channels.clear(); // Optional: useful for testing or full reset
  },
};

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

