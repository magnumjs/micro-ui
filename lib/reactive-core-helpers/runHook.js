export function runHook(cbs, arg, clear = true, context) {
  for (const fn of cbs) {
    try {
      fn.call(context, arg);
    } catch (e) {
      console.error(e);
    }
  }
  if (clear) cbs.length = 0;
}
