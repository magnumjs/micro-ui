
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


export const appState = createState({
    user: null,
    count: 0,
  todos: [
    { id: '1', text: 'Learn JS', done: false },
    { id: '2', text: 'Build Stuff', done: true },
  ],
});
