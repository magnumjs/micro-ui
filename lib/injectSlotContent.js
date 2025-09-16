// injectSlotContent.js
const slotContentCache = new WeakMap();

export default function injectSlotContent(refNode, value, api) {
  if (!refNode || value === null) return;

  // Skip if identical value (cached)
  if (slotContentCache.has(refNode)) {
    const cached = slotContentCache.get(refNode);
    if (cached.value === value) return;
  }

  let resolved = typeof value === "function" ? value() : value;

  // Handle default slot { default: ... }
  if (
    refNode.nodeName === "SLOT" &&
    !refNode.hasAttribute("name") &&
    resolved &&
    typeof resolved === "object" &&
    "default" in resolved
  ) {
    resolved = resolved.default;
  }

  // === ARRAY SLOT CASE ===
  if (Array.isArray(resolved)) {
    const parent = refNode.parentNode;
    if (!parent) return;

    const existingNodes = {};
    Array.from(parent.children).forEach((child) => {
      const key = child.getAttribute && child.getAttribute("data-key");
      if (key != null) existingNodes[key] = child;
    });

    const newNodes = [];
    resolved.forEach((origItem) => {
      let item = typeof origItem === "function" ? origItem() : origItem;
      let node = null;

      let key = item?.props?.key ?? item?.el?.getAttribute?.("data-key");
      if (key != null && existingNodes[key]) {
        // Reuse existing keyed node
        node = existingNodes[key];
        if (item?.update) item.update();
      } else if (item?.mount) {
        // First mount
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

    // Only remove slot placeholder once
    if (parent.contains(refNode)) {
      parent.replaceChild(document.createComment("slot"), refNode);
    }

    // Reorder/move nodes without nuking
    newNodes.forEach((node, idx) => {
      if (parent.children[idx] !== node) {
        parent.insertBefore(node, parent.children[idx] || null);
      }
    });

    // Remove extra nodes not in newNodes
    Array.from(parent.children).forEach((child) => {
      if (
        child.nodeType !== Node.COMMENT_NODE && // keep slot placeholder comment
        !newNodes.includes(child)
      ) {
        parent.removeChild(child);
      }
    });

    slotContentCache.set(refNode, { value });
    return;
  }

  // === SINGLE SLOT CASE ===
  if (resolved?.mount) {
    if (resolved.isMounted()) {
      resolved.update();
      // Ensure it sits in the right place
      if (refNode.parentNode && resolved.el !== refNode) {
        refNode.parentNode.insertBefore(resolved.el, refNode);
        if (refNode.nodeType !== Node.COMMENT_NODE) {
          refNode.replaceWith(document.createComment("slot"));
        }
      }
    } else {
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
    const temp = document.createElement("div");
    temp.innerHTML = resolved;
    const fragment = document.createDocumentFragment();
    while (temp.firstChild) fragment.appendChild(temp.firstChild);
    refNode.replaceWith(fragment);
  } else {
    refNode.replaceWith(document.createTextNode(""));
  }

  slotContentCache.set(refNode, { value });
}
