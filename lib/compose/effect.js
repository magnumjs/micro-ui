// effect.js
import { useCurrentComponent } from "../reactive-core.js";

export function effect(cb, deps = []) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("effect() must be called inside a component");

  if (!comp._effects) comp._effects = [];

  const hasDeps = Array.isArray(deps) && deps.length > 0;
  const idx = comp._effects.length;
  const record = { cb, deps, cleanup: null, lastDeps: hasDeps ? [] : null };
  comp._effects.push(record);

  runEffect(comp, record, hasDeps);

  // cleanup on unmount
  comp.onUnmount(() => {
    comp._effects.forEach(r => r.cleanup && r.cleanup());
  });
}

function runEffect(comp, record, hasDeps) {
  const changed = hasDeps ? !shallowEqual(record.lastDeps, record.deps) : record.lastDeps === null;
  if (changed) {
    if (record.cleanup) record.cleanup();
    record.cleanup = record.cb();
    record.lastDeps = hasDeps ? record.deps.slice() : [];
  }
}

function shallowEqual(a, b) {
  return a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
}
