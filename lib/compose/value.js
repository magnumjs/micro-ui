
// value.js
import { useCurrentComponent } from "../reactive-core.js";

export function slot(initial) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("slot() must be called inside a component");

  let value = initial;

  const get = () => value;
  const set = (next) => {
    value = typeof next === "function" ? next(value) : next;
    comp.update(); // re-render
  };

  return [get, set];
}
