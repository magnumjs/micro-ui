// Lifecycle and hook helpers for micro-ui
// Includes registerLifecycleHooks, runHook, runBeforeHook

// Registers lifecycle hooks from options into the api
export function registerLifecycleHooks(api, options) {
  const { onMount, onUnmount, onBeforeMount, onBeforeUnmount, onUpdate, onBeforeRender } = options;
  if (onMount) api.onMount(onMount);
  if (onUnmount) api.onUnmount(onUnmount);
  if (onBeforeMount) api.onBeforeMount(onBeforeMount);
  if (onBeforeUnmount) api.onBeforeUnmount(onBeforeUnmount);
  if (onUpdate) api.onUpdate(onUpdate);
  if (onBeforeRender) api.onBeforeRender(onBeforeRender);
}

// Runs an array of hooks (cbs) with an argument, optionally clears after
export function runHook(cbs, arg, clear = true, context) {
  let result = arg;
  for (const fn of cbs) {
    try {
      const res = fn.call(context, result);
      if (res !== undefined) result = res;
    } catch (e) {
      console.error(e);
    }
  }
  if (clear) cbs.length = 0;
  return result;
}

// Runs before hooks (sync/async, array or single), then calls next
export function runBeforeHook(hookOrArray, next, context) {
  if (Array.isArray(hookOrArray)) {
    let idx = 0;
    function runNext() {
      if (idx < hookOrArray.length) {
        const cb = hookOrArray[idx++];
        try {
          if (cb.length) cb.call(context, runNext);
          else Promise.resolve(cb.call(context)).then(runNext).catch((e) => { console.error(e); runNext(); });
        } catch (e) {
          console.error(e);
          runNext();
        }
      } else {
        next();
      }
    }
    runNext();
  } else if (hookOrArray) {
    try {
      if (hookOrArray.length) hookOrArray.call(context, next);
      else Promise.resolve(hookOrArray.call(context)).then(next).catch((e) => { console.error(e); next(); });
    } catch (e) {
      console.error(e);
      next();
    }
  } else {
    next();
  }
}
