// injectSlotContent.js
const slotContentCache = new WeakMap();

export default function injectSlotContent(refNode, value, api) {
  // Remove previous injected content if slot is null/undefined
  if (!refNode || value === null) {
    return;
  }

  // Use refNode as cache key
  if (slotContentCache.has(refNode)) {
    const cached = slotContentCache.get(refNode);
    if (cached.value === value) {
      // Already injected, skip
      return;
    }
  }

  let resolved = typeof value === "function" ? value() : value;

  // Unwrap { default: ... } for default slot
  if (
    refNode.nodeName === "SLOT" &&
    !refNode.hasAttribute("name") &&
    resolved &&
    typeof resolved === "object" &&
    "default" in resolved
  ) {
    resolved = resolved.default;
  }
  // Array of items
  if (Array.isArray(resolved)) {
    // Find parent node to manipulate children
    const parent = refNode.parentNode;
    if (!parent) return;

    // Build a map of current keyed children
    const existingNodes = {};
    Array.from(parent.children).forEach((child) => {
      const key = child.getAttribute && child.getAttribute("data-key");
      if (key != null) existingNodes[key] = child;
    });

    // Prepare new order of nodes
    const newNodes = [];
    resolved.forEach((origItem) => {
      let item = typeof origItem === "function" ? origItem() : origItem;
      let node = null;
      let key = item?.props?.key ?? (item?.el?.getAttribute && item.el.getAttribute("data-key"));
      if (key != null && existingNodes[key]) {
        // Move existing node
        node = existingNodes[key];
        if (item && typeof item.update === "function") item.update();
      } else if (item && typeof item.mount === "function") {
        const temp = document.createElement("div");
        item.mount(temp);
        node = item.el instanceof HTMLElement ? item.el : temp;
        if (!api._mountedChildren.includes(item)) {
          api._mountedChildren.push(item);
        }
      } else if (item?.el instanceof HTMLElement) {
        node = item.el;
      } else if (item instanceof Node) {
        node = item;
      } else if (typeof item === "string") {
        const temp = document.createElement("div");
        temp.innerHTML = item;
        node = temp.firstChild;
      }
      if (node) newNodes.push(node);
    });

    // Remove refNode placeholder
    if (parent.contains(refNode)) parent.removeChild(refNode);

    // Reorder/move nodes in parent
    newNodes.forEach((node, idx) => {
      if (parent.children[idx] !== node) {
        parent.insertBefore(node, parent.children[idx] || null);
      }
    });

    // Remove any extra nodes not in newNodes
    Array.from(parent.children).forEach((child) => {
      if (!newNodes.includes(child)) parent.removeChild(child);
    });

    slotContentCache.set(refNode, { value });
    return;
  }

  // Single item logic
  if (resolved && typeof resolved.mount === "function") {
    if (resolved.isMounted()) {
      // Reuse instead of remount
      resolved.update();
      // Ensure DOM position is correct
      if (resolved.el !== refNode) {
        refNode.replaceWith(resolved.el);
      }
    } else {
      // First mount
      const temp = document.createElement("div");
      refNode.replaceWith(temp);
      resolved.mount(temp);
      if (resolved.el === refNode) {
        resolved.el = temp;
      }
    }
    if (!api._mountedChildren.includes(resolved)) {
      api._mountedChildren.push(resolved);
    }
  } else if (resolved?.el instanceof HTMLElement) {
    refNode.replaceWith(resolved.el);
  } else if (resolved instanceof Node) {
    refNode.replaceWith(resolved);
  } else if (typeof resolved === "string") {
    // Replace slot with HTML nodes (not just text)
    const temp = document.createElement("div");
    temp.innerHTML = resolved;
    // Insert all children, not just the first
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    refNode.replaceWith(fragment);
  } else {
    refNode.replaceWith(document.createTextNode(""));
  }
  // After replacing slot content, cache the value

  slotContentCache.set(refNode, { value });
}
