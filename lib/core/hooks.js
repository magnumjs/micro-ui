// Lifecycle and hook helpers for micro-ui
// Includes registerLifecycleHooks, runHook, runBeforeHook
// Helper to get the correct callback array from api by lifecycle name
export function getLifecycleCbs(api, name) {
  return api[`_${name}Cbs`];
}

// Run hooks by string name (e.g., 'onBeforeMount')
export function runNamedHook(name, arg, clear = true, context) {
  const cbs = getLifecycleCbs(context, name);
  return runHook(cbs, arg, clear, context);
}

export function runNamedBeforeHook(name, next, context) {
  const cbs = getLifecycleCbs(context, name);
  return runBeforeHook(cbs, next, context);
}

// Registers lifecycle hooks from options into the api


// Central enum for component lifecycle states
export const LIFECYCLE_STATE = Object.freeze({
  IDLE: 'idle',
  MOUNTING: 'mounting',
  RENDERING: 'rendering',
  UPDATING: 'updating',
  UNMOUNTING: 'unmounting',
  MOUNTED: 'mounted',
});

// core/hooks.js
export const LIFECYCLE_NAMES = [
  'onMount', 'onUnmount', 'onBeforeMount',
  'onBeforeUnmount', 'onUpdate', 'onBeforeRender',
];

export function registerLifecycleHooks(api, defs = {}) {
  LIFECYCLE_NAMES.forEach(name => {
    api[`_${name}Cbs`] = [];
    if (defs[name]) api[`_${name}Cbs`].push(defs[name]);
    api[name] = fn => fn && api[`_${name}Cbs`].push(fn);
  });
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
export function runBeforeHook(hookArray, next, context) {
  let idx = 0;
  function runNext() {
    if (idx < hookArray.length) {
      const cb = hookArray[idx++];
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
}
