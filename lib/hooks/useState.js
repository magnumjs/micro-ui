// hooks.js
import { useCurrentComponent } from "../reactive-core.js";

// -------------------------
// useState
// -------------------------
export function useState(initial) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("useState must be inside render()");

  // --- auto-setters for default state, run once ---
  if (!comp._hasStateSetters) {
    if (comp.state) {
      Object.keys(comp.state).forEach(key => {
        const setterName = "set" + key.charAt(0).toUpperCase() + key.slice(1);
        if (!comp[setterName]) {
          comp[setterName] = (next) => {
            const value = comp.state[key];
            const newValue = typeof next === "function" ? next(value) : next;
            if (newValue !== value) {
              comp.state[key] = newValue;
              comp.update();
            }
          };
        }
      });
    }
    comp._hasStateSetters = true;
  }
 // --- dynamic hook state ---
  const hookIndex = comp._renderIndex++;
  if (!comp._hooks) comp._hooks = [];
  if (comp._hooks[hookIndex] === undefined) {
    comp._hooks[hookIndex] =
      typeof initial === "function" ? initial() : initial;
  }

  const setValue = (next) => {
    const value = comp._hooks[hookIndex];
    const newValue =
      typeof next === "function" ? next(value) : next;
    if (newValue !== value) {
      comp._hooks[hookIndex] = newValue;
      comp.update();
    }
  };

  return [comp._hooks[hookIndex], setValue];
}

