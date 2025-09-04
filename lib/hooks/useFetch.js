// useFetch.js
import { useCurrentComponent } from "../reactive-core.js";

export function useFetch(url, options = {}) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error('useFetch must be called inside a component render or lifecycle');

  // Initialize component state only once per component instance
  if (!comp.state || (comp.state.data === undefined && comp.state.loading === undefined && comp.state.error === undefined)) {
    comp.setState({ data: null, loading: true, error: null });
  }

  async function run() {
    comp.setState(s => ({ ...s, loading: true }));
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      comp.setState({ data, error: null, loading: false });
      if (comp.emit) comp.emit("fetch::done", { url, data });
    } catch (error) {
      comp.setState({ data: null, error, loading: false });
      if (comp.emit) comp.emit("fetch::error", { url, error });
    }
  }

  comp.onMount(run);
  if (comp.onEmit) comp.onEmit("fetch::refresh", run);

  return {
    get: () => ({ ...comp.state }),
    subscribe: (fn) => {
      // Simple subscription: call fn on update
      comp.onUpdate(() => fn({ ...comp.state }));
      // Return unsubscribe (not implemented here)
      return () => {};
    },
    refresh: run
  };
}
