// DOM and unmount helpers for micro-ui
// Includes cleanupDomAndEvents and unmountComponent
import { cacheNodes, restoreNodes } from "./cacheNodes.js";

// Removes all child nodes from el and all event listeners from boundEvents
export function cleanupDomAndEvents(el, boundEvents) {
  el.innerHTML = "";
  boundEvents.forEach(({ node, type, listener }) => {
    node.removeEventListener(type, listener);
  });
  return [];
}

// Set the data-comp-root attribute for a component root element
export function setComponentRootAttr(el, componentFn, renderFn) {
  el.setAttribute(
    "data-comp-root",
    componentFn._id + "-" + (renderFn.name || "")
  );
}

// Set the data-key attribute for a component root element if key is present
export function setComponentKeyAttr(el, key) {
  if (key) el.setAttribute("data-key", key);
}


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

  _cachedNode = cacheNodes(el);

  runHook(api._unmountCbs, undefined, true, componentFn);

  boundEvents.forEach(({ node, type, listener }) => {
    node.removeEventListener(type, listener);
  });
  boundEvents = [];

  mounted = false;
  onBeforeMountDone = false;
  //_renderedNull = true;

  unregisterComponent(componentFn);

  api._resetInternal();

    // remove element attributes except in list contains id,data-comp-root
  Array.from(el.attributes).forEach(attr => {
    if (!["data-comp-root", "id"].includes(attr.name)) {
      el.removeAttribute(attr.name);
    }
  });
  el.innerHTML = "";
  el = null;

  return { _cachedNode, boundEvents, mounted, onBeforeMountDone, _renderedNull };
}
