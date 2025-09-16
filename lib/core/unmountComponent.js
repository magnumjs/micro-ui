// Handles the cleanup logic for component unmount
export function unmountComponent({
  el,
  _cachedNode,
  boundEvents,
  mounted,
  onBeforeMountDone,
  _renderedNull,
  api,
  componentFn,
  runHook,
  unregisterComponent
}) {
  if (el.firstChild) {
    _cachedNode = el.firstChild.cloneNode(true);
    el.removeChild(el.firstChild);
  }

  runHook(api._unmountCbs, undefined, true, componentFn);

  boundEvents.forEach(({ node, type, listener }) => {
    node.removeEventListener(type, listener);
  });
  boundEvents = [];

  mounted = false;
  onBeforeMountDone = false;
  _renderedNull = true;

  unregisterComponent(componentFn);
  if (api._resetInternal) api._resetInternal();

  return { _cachedNode, boundEvents, mounted, onBeforeMountDone, _renderedNull };
}
