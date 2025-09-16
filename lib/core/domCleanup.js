// Removes all child nodes from el and all event listeners from boundEvents
export function cleanupDomAndEvents(el, boundEvents) {
  el.innerHTML = "";
  boundEvents.forEach(({ node, type, listener }) => {
    node.removeEventListener(type, listener);
  });
  return [];
}
