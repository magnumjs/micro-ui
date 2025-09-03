import { useCurrentComponent } from "../reactive-core.js";

// -------------------------
// useContext
// -------------------------
const globalContexts = {}; // key → { value, subs:Set }

export function useContext(key, defaultValue = {}) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("useContext() must be inside render()");

  if (!globalContexts[key]) {
    globalContexts[key] = {
      value: defaultValue,
      subs: new Set()
    };
  }

  const ctx = globalContexts[key];
  ctx.subs.add(comp);

  comp.onUnmount(() => ctx.subs.delete(comp));

  const setValue = (next) => {
    ctx.value =
      typeof next === "function" ? next(ctx.value) : next;
    ctx.subs.forEach(c => c.update());
  };

  return [ctx.value, setValue];
}
