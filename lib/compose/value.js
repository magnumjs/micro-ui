
// value.js
import { useCurrentComponent } from "../reactive-core.js";

export function slot(initial) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("slot() must be called inside a component");


  comp._slots = comp._slots || [];
  const i = comp._renderIndex++;

  if (comp._slots[i]) return comp._slots[i]; // reuse


  let value = initial;
  const get = () => value;
  const set = (next) => {
    value = typeof next === "function" ? next(value) : next;
    comp.update();
  };


  const pair = [get, set];
  comp._slots[i] = pair;
  return pair;
}

