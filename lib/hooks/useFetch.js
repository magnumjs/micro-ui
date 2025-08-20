// useFetch.js
import { useCurrentComponent } from "../reactive-core.js";
import { createState } from "../compose/context.js";

export function useFetch(url, options = {}) {
  const comp = useCurrentComponent();
  const state = createState({ data: null, loading: true, error: null });

  async function run() {
    state.setState(s => ({ ...s, loading: true }));

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      state.setState({ data, error: null, loading: false });
      comp?.emit("fetch::done", { url, data });
    } catch (error) {
      state.setState({ data: null, error, loading: false });
      comp?.emit("fetch::error", { url, error });
    }
  }

  if (comp) {
    comp.onMount(run);
    comp.onEmit("fetch::refresh", run);
  }
  return { get: state.get, subscribe: state.subscribe, refresh: run };
}
