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
