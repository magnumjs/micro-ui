import { shared } from "./context.js";
import { useCurrentComponent } from "../reactive-core.js";

// withState composable: local or shared state
export function withState(initialValue, key) {
  const comp = useCurrentComponent();

  if (key) {
    // Use shared context for global state
    const store = shared(key, initialValue);
    // Subscribe component to shared state changes
    if (comp && typeof comp.update === "function") {
      // Only subscribe once per component instance
      if (!comp.__withStateSharedSubs) comp.__withStateSharedSubs = {};
      if (!comp.__withStateSharedSubs[key]) {
        comp.__withStateSharedSubs[key] = store.subscribe(() => comp.update());
      }
    }
    function set(next) {
      store.setState(next);
      // No need to call comp.update(); all subscribers will update
    }
    return [() => store.get(), set];
  }
  // Local state, per component instance
  if (comp) {
    if (!comp.__withStateLocal) comp.__withStateLocal = new Map();
    if (!comp.__withStateLocal.has(initialValue)) {
      comp.__withStateLocal.set(initialValue, initialValue);
    }
    function set(next) {
      const prev = comp.__withStateLocal.get(initialValue);
      const nextVal = typeof next === "function" ? next(prev) : next;
      comp.__withStateLocal.set(initialValue, nextVal);
      if (typeof comp.update === "function") comp.update();
    }
    return [() => comp.__withStateLocal.get(initialValue), set];
  } else {
    // Fallback for usage outside component context
    let value = initialValue;
    function set(next) {
      value = typeof next === "function" ? next(value) : next;
    }
    return [() => value, set];
  }
}
