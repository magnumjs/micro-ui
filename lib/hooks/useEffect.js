// useEffect composable for Micro UI
// Usage: useEffect(fn) runs fn on mount, returns cleanup to run on unmount
import { useCurrentComponent } from "../reactive-core.js";

export function useEffect(effect) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("useEffect must be called during render");
  comp.onMount(() => {
    const cleanup = effect();
    if (typeof cleanup === "function") {
      comp.onUnmount(cleanup);
    }
  });
}
