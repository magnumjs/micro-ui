// core/cacheNodes.js
const nodeCache = new WeakMap();

/**
 * Cache all children of an element.
 * Removes them from DOM and stores a clone.
 */
export function cacheNodes(el) {
  if (!el || !el.hasChildNodes()) return null;

  const fragment = document.createDocumentFragment();
  el.childNodes.forEach((child) => {
    fragment.appendChild(child.cloneNode(true));
  });

  nodeCache.set(el, fragment);

  // remove all actual children
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  return fragment;
}

/**
 * Restore cached children if available.
 */
export function restoreNodes(el) {
  const cached = nodeCache.get(el);
  if (!cached) return null;

  const clone = cached.cloneNode(true);
  el.appendChild(clone);
  return clone;
}
