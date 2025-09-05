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
