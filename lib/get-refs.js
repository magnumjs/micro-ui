const refCache = {}; // Global cache for storing references

export default function ref(el, name) {
  if (!el) return null;

  // 1. Check the cache first
  if (refCache[name]) {
    const cachedElement = refCache[name];

    // Check if the cached element is still connected to the DOM
    if (cachedElement.isConnected) {
      // Also ensure it's within the current scope (this.el or its parent)
      if (
        el.contains(cachedElement) ||
        (el.parentNode &&
          el.parentNode !== document.body &&
          el.parentNode.contains(cachedElement))
      ) {
        return cachedElement;
      } else {
        // If it's connected but not in the desired scope, it's stale for this context
        delete refCache[name]; // Remove from cache
      }
    } else {
      // Element is no longer connected to the DOM, dispose of it
      delete refCache[name];
    }
  }

  // 2. If not found in cache or disposed, perform the search
  // Prioritize ID lookup as it's typically the fastest
  //   const elementById = document.getElementById(name);
  //   if (elementById && (el.contains(elementById) || (el.parentNode && el.parentNode.contains(elementById)))) {
  //     refCache[name] = elementById; // Cache the found element
  //     return elementById;
  //   }

  // Attempt each query on both this.el and its parent
  const selectors = [
    `[data-ref="${name}"]`,
    `slot[name="${name}"]`,
    name, // General selector, less performant if broad
  ];

  for (const selector of selectors) {
    let foundElement = el.querySelector(selector);
    if (foundElement) {
      refCache[name] = foundElement; // Cache the found element
      return foundElement;
    }

    // Check parentNode if not found in this.el
    if (el.parentNode) {
      foundElement = el.parentNode.querySelector(selector);
      if (foundElement) {
        refCache[name] = foundElement; // Cache the found element
        return foundElement;
      }
    }
  }

  return null;
}
