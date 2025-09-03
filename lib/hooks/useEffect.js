import { useCurrentComponent } from "../reactive-core.js";
// -------------------------
// useEffect
// -------------------------
export function useEffect(effect, deps = []) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("useEffect must be inside render()");

  const hookIndex = comp._renderIndex++;
  comp._hooks = comp._hooks || [];
  const prevDeps = comp._hooks[hookIndex] || [];

  const changed =
    deps.length === 0 || deps.some((d, i) => d !== prevDeps[i]);

  if (changed) {
    let cleanup;
    comp.onUnmount(() => cleanup && cleanup());
    cleanup = effect();
    comp._hooks[hookIndex] = deps;
    // comp.update();
  }
}
