// hooks/useEmit.js

import { context, createChannelMap } from "../utils/context.js";
import { useCurrentComponent } from "../reactive-core.js";

export function useEmit() {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("useEmit must be inside render()");

  if (comp._hasEmits) return comp._emitsApi;
  comp._hasEmits = true;

  const localBus = createChannelMap();

  const api = {
    emit: (event, payload) => localBus.emit(event, payload),
    onEmit: (event, fn) => {
      const unsub = localBus.subscribe(event, fn);
      comp.onUnmount(unsub); // auto cleanup
      return unsub;
    },
    emitGlobal: (event, payload) => context.emit(event, payload),
    onEmitGlobal: (event, fn) => {
      const unsub = context.subscribe(event, fn);
      comp.onUnmount(unsub);
      return unsub;
    },
  };

  Object.assign(comp, api);
  comp._emitsApi = api;

  //useContextListeners(comp, comp.on);

  comp.onBeforeRender(function () {
    // console.log("Component render called:", Object.keys(comp.on));
    useContextListeners(comp, comp.on);
  });

  // cleanup hook
  comp.onUnmount(() => {
    localBus.clear();
  });

  return api;
}

// hooks/useContextListeners.js

function useContextListeners(comp, on = {}) {
  let contextUnsubs = [];
  Object.entries(on).forEach(([key, handler]) => {
    // console.log("Registering context event:", key);
    if (key.includes("::")) {
      const bound = handler.bind(comp);
      const unsub = context.subscribe(key, bound);
      contextUnsubs.push(unsub);
    }
    // else if it doesn't include any spaces * or : we can treat as a local listener
    else if (!key.includes(" ") && !key.includes("*") && !key.includes(":")) {
      // console.log("Registering local event:", key);
      comp.onEmit(key, handler.bind(comp));
    }
  });

  comp.onUnmount(() => {
    contextUnsubs.forEach((unsub) => unsub());
    contextUnsubs = [];
  });
}
