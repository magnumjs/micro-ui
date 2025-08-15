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
    const fragment = document.createDocumentFragment();

    resolved.forEach((origItem) => {
      let item = typeof origItem === "function" ? origItem() : origItem;
      if (item && typeof item.mount === "function") {
        const temp = document.createElement("div");
        if (item.isMounted()) {
          item.unmount();
        }
        item.mount(temp);
        api._mountedChildren.push(item);
        if (temp.firstElementChild) {
          fragment.appendChild(temp.firstElementChild);
        }
      } else if (item?.el instanceof HTMLElement) {
        fragment.appendChild(item.el);
      } else if (item instanceof Node) {
        fragment.appendChild(item);
      } else if (typeof item === "string") {
        const temp = document.createElement("div");
        temp.innerHTML = item;
        if (temp.firstElementChild) {
          fragment.appendChild(temp.firstElementChild);
        }
      }
    });

    refNode.replaceWith(fragment);
    slotContentCache.set(refNode, { value });
    return;
  }

  // Single item logic
  if (resolved && typeof resolved.mount === "function") {
    const temp = document.createElement("div");
    refNode.replaceWith(temp);
    if (resolved.isMounted()) {
      resolved.unmount();
    }
    resolved.mount(temp);

    if (resolved.el === refNode) {
      // console.warn("Component mounted to its own refNode, this may cause issues:", resolved.el);
      resolved.el = temp;
    }
    api._mountedChildren.push(resolved);
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
