// injectSlotContent.js

export default function injectSlotContent(refNode, value) {
  if (!refNode || value == null) return;

  const resolved = typeof value === "function" ? value() : value;

  // Array of items
  if (Array.isArray(resolved)) {
    const fragment = document.createDocumentFragment();

    resolved.forEach((item) => {

      if (item && typeof item.mount === "function") {
        const temp = document.createElement("div");
        item.mount(temp);
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
    return;
  }

  // Single item logic
  if (resolved && typeof resolved.mount === "function") {
    const temp = document.createElement("div");
    refNode.replaceWith(temp);
    resolved.mount(temp);
  } else if (resolved?.el instanceof HTMLElement) {
    refNode.replaceWith(resolved.el);
  } else if (resolved instanceof Node) {
    refNode.replaceWith(resolved);
  } else if (typeof resolved === "string") {
    const temp = document.createElement("div");
    temp.innerHTML = resolved;
    if (temp.firstElementChild) {
      refNode.replaceWith(temp.firstElementChild);
    }
  }
}
