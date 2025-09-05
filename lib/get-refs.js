const refCache = new WeakMap(); // Cache per boundary root

export default function ref(boundaryRoot, name) {
  if (!boundaryRoot) return null;

  // Ensure we're always operating within the correct component boundary
  if (!boundaryRoot.hasAttribute("data-comp-root")) {
    throw new Error("ref() must be called with a component root element");
  }

  // 1. Check scoped cache
  let cacheForBoundary = refCache.get(boundaryRoot);
  if (!cacheForBoundary) {
    cacheForBoundary = {};
    refCache.set(boundaryRoot, cacheForBoundary);
  }

  if (cacheForBoundary[name]) {
    const cached = cacheForBoundary[name];
    if (cached.isConnected && boundaryRoot.contains(cached)) {
      return cached; // valid cached ref
    } else {
      delete cacheForBoundary[name]; // stale
    }
  }

  // in get refs 1️⃣ Check for a component instance via data-key
  const compEl = boundaryRoot.querySelector(`[data-key="${name}"]`);
  if (compEl && compEl._componentInstance) {
    cacheForBoundary[name] = compEl._componentInstance;
    return compEl._componentInstance;
  }
  // 2️⃣ Fallback to DOM refs (existing behavior)

  // 2. Search only inside this boundary root
  const selectors = [
    `[data-ref="${name}"]`,
    `[data-slot="${name}"]`,
    `slot[name="${name}"]`,
    `slot:not([name])`,
    `${name}`, // allow names, but scoped
    `#${name}`, // allow ids, but scoped
  ];

  function isInCurrentBoundary(el, boundaryRoot) {
    if (el === boundaryRoot) return true;
    const nestedRoot = el.closest("[data-comp-root]");
    return !nestedRoot || nestedRoot === boundaryRoot;
  }

  for (const selector of selectors) {
    let found = null;
    try {
      const allMatches = boundaryRoot.querySelectorAll(selector);
      for (const el of allMatches) {
        if (isInCurrentBoundary(el, boundaryRoot)) {
          found = el;
          break;
        }
      }
    } catch (err) {
      console.warn(`ref() invalid selector: ${selector} for ref name ${name}`);
      //throw new Error(`ref() invalid selector: ${selector} for ref name ${name}`);
    }
    if (found) {
      cacheForBoundary[name] = found;
      return found;
    }
  }

  return null;
}
