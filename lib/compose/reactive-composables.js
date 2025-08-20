// reactive-composables.js
import { createState, shared as sharedStore } from "./context.js";
import { useCurrentComponent } from "../reactive-core.js";

// 1) Local state — returns [get, set, subscribe]
export function useState(initial) {
  const state = createState(initial);
  const get = () => state.get();
  const set = (next) => state.setState(next);

  const comp = useCurrentComponent();
  if (comp) {
    const unsub = state.subscribe(() => comp.update());
    comp.onUnmount(unsub);
  }
  return [get, set, state.subscribe];
}

// 2) Shared (global keyed) — auto rerender in component
export function shared(key, initial = {}) {
  const store = sharedStore(key, initial);
  const comp = useCurrentComponent();
  if (comp) {
    const unsub = store.subscribe(() => comp.update());
    comp.onUnmount(unsub);
  }
  return store;
}

// 3) Computed derived values with optional deps for auto-recompute
//    deps: array of subscribe-able things or subscribe functions
export function computed(getter, deps = []) {
  let cached = getter();
  const subs = new Set();

  function evaluate() {
    const v = getter();
    if (v !== cached) {
      cached = v;
      subs.forEach(fn => fn(cached));
    }
  }

  // Auto re-evaluate when deps change
  const comp = useCurrentComponent();
  const unsubs = [];
  for (const dep of deps) {
    const subscribe = typeof dep === "function" ? dep : dep?.subscribe;
    if (typeof subscribe === "function") {
      const u = subscribe(() => { evaluate(); if (comp) comp.update(); });
      unsubs.push(u);
    }
  }
  if (comp) comp.onUnmount(() => { unsubs.forEach(u => u && u()); subs.clear(); });

  return {
    get value() { return cached; },
    subscribe(fn) { subs.add(fn); fn(cached); return () => subs.delete(fn); },
    recompute: evaluate,
  };
}


