
// diffHtml.js



export default function diffHTML(el, newHTML) {
  if (!el) return false;

  const temp = document.createElement("div");
  temp.innerHTML = newHTML;

  // If both old and new are just text, patch safely
  if (
    temp.children.length === 0 &&
    el.children.length === 0 &&
    temp.textContent
  ) {
    if (el.textContent !== temp.textContent) {
      el.textContent = temp.textContent;
    }
    return true;
  }


  const newChildren = Array.from(temp.children);
  const oldChildren = Array.from(el.children);
  // add data-key if present in el to first child if only one child and it doesn't have it
  if (newChildren.length === 1 && el.dataset.key && !newChildren[0]?.dataset.key) {
    newChildren[0].dataset.key = el.dataset.key;
  }

  const newKeyed = new Map();
  const oldKeyed = new Map();

  for (const child of newChildren) {
    const key = child.dataset.key;
    if (key) newKeyed.set(key, child);
  }

  for (const child of oldChildren) {
    const key = child.dataset.key;
    if (key) oldKeyed.set(key, child);
  }

  let cursor = 0;
  for (const newChild of newChildren) {
    const key = newChild.dataset.key;
    let currentNode = el.children[cursor];

    if (key && oldKeyed.has(key)) {
      const existing = oldKeyed.get(key);

      // Patch instead of replace, unless it's a component root
      if (!existing.hasAttribute("data-comp-root")) {
        patchElement(existing, newChild);
      }

      if (existing !== currentNode) {
        el.insertBefore(existing, currentNode || null);
      }

      oldKeyed.delete(key);
    } else {
      el.insertBefore(newChild, currentNode || null);
    }

    cursor++;
  }

  // Remove old keyed children that weren't reused
  for (const leftover of oldKeyed.values()) {
    // Do not auto-remove component roots (let unmount handle it)
    if (leftover.hasAttribute("data-comp-root")) continue;
    leftover.remove();
  }

  // Trim any excess non-keyed children
  while (el.children.length > newChildren.length) {
    const last = el.lastChild;
    if (last?.hasAttribute?.("data-comp-root")) break;
    last.remove();
  }

  return true;
}

function patchElement(fromEl, toEl) {

  // Always replace if tag names differ
  if (fromEl.tagName !== toEl.tagName) {
    fromEl.replaceWith(toEl.cloneNode(true));
    return toEl;
  }

  syncAttributes(fromEl, toEl);
  if (!fromEl.hasAttribute("data-comp-root")) {
    patchChildren(fromEl, toEl);
  }
  return fromEl;
}


function syncAttributes(fromEl, toEl) {
  const fromAttrs = fromEl.attributes;
  const toAttrs = toEl.attributes;

  for (const { name } of Array.from(fromAttrs)) {
    if (!toEl.hasAttribute(name)) {
      fromEl.removeAttribute(name);
    }
  }

  for (const { name, value } of Array.from(toAttrs)) {
    if (fromEl.getAttribute(name) !== value) {
      fromEl.setAttribute(name, value);
    }
  }
}

export function patchChildren(fromEl, toEl) {
  const fromNodes = Array.from(fromEl.childNodes);
  const toNodes = Array.from(toEl.childNodes);
  const max = Math.max(fromNodes.length, toNodes.length);

  for (let i = 0; i < max; i++) {
    const fromNode = fromNodes[i];
    const toNode = toNodes[i];

    if (!toNode) {
      // Remove old node
      if (fromNode.nodeType === 1 && fromNode.hasAttribute("data-comp-root")) {
        continue; // skip components
      }
      fromEl.removeChild(fromNode);
      continue;
    }

    if (!fromNode) {
      fromEl.appendChild(toNode.cloneNode(true));
      continue;
    }

    patchNode(fromNode, toNode);
  }
}


function patchNode(fromNode, toNode) {

  // Type mismatch → replace
  if (fromNode.nodeType !== toNode.nodeType) {
    fromNode.replaceWith(toNode.cloneNode(true));
    return;
  }

  if (fromNode.nodeType === Node.TEXT_NODE) {
    if (fromNode.nodeValue !== toNode.nodeValue) {
      fromNode.nodeValue = toNode.nodeValue;
    }
    return;
  }

  if (fromNode.nodeType === Node.ELEMENT_NODE) {
    // Different tags → replace
    if (fromNode.tagName !== toNode.tagName) {
      fromNode.replaceWith(toNode.cloneNode(true));
      return;
    }

    // Sync attributes
    syncAttributes(fromNode, toNode);

    // Skip inside component boundaries
    if (fromNode.hasAttribute("data-comp-root")) return;

    // Recurse into children
    patchChildren(fromNode, toNode);
  }
}




