export default function diffHTML(el, newHTML) {
  if (!el) return false;

  // Optional: parse with cache using newHTML._id
  const temp = document.createElement("div");
  temp.innerHTML = newHTML;

    // Special case: if newHTML is plain text (no elements)
  if (temp.children.length === 0 && temp.textContent) {
    el.textContent = temp.textContent;
    return true;
  }

  const newChildren = Array.from(temp.children);
  const oldChildren = Array.from(el.children);

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

      patchElement(existing, newChild);

      if (existing !== currentNode) {
        el.insertBefore(existing, currentNode || null);
      }

      oldKeyed.delete(key);
    } else {
      el.insertBefore(newChild, currentNode || null);
    }

    cursor++;
  }

  for (const leftover of oldKeyed.values()) {
    leftover.remove();
  }

  while (el.children.length > newChildren.length) {
    el.lastChild.remove();
  }

  return true;
}

function patchElement(fromEl, toEl) {
  if (fromEl.tagName !== toEl.tagName) {
    fromEl.replaceWith(toEl.cloneNode(true));
    return;
  }
  syncAttributes(fromEl, toEl);
  patchChildren(fromEl, toEl);
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

function patchChildren(fromEl, toEl) {
  const fromNodes = Array.from(fromEl.childNodes);
  const toNodes = Array.from(toEl.childNodes);
  const max = Math.max(fromNodes.length, toNodes.length);

  for (let i = 0; i < max; i++) {
    const fromNode = fromNodes[i];
    const toNode = toNodes[i];

    if (!toNode && fromNode) {
      fromEl.removeChild(fromNode);
      continue;
    }

    if (!fromNode && toNode) {
      fromEl.appendChild(toNode.cloneNode(true));
      continue;
    }

    patchNode(fromNode, toNode);
  }
}

function patchNode(fromNode, toNode) {

  if (fromNode.isEqualNode(toNode)) return;
  if (fromNode.nodeType !== toNode.nodeType) {
    fromNode.replaceWith(toNode.cloneNode(true));
    return;
  }

  if (fromNode.nodeType === Node.TEXT_NODE) {
    if (fromNode.nodeValue !== toNode.nodeValue) {
      fromNode.nodeValue = toNode.nodeValue;
    }
  } else if (
    fromNode.nodeType === Node.ELEMENT_NODE &&
    fromNode.tagName === toNode.tagName
  ) {
    patchElement(fromNode, toNode);
  } else {
    fromNode.replaceWith(toNode.cloneNode(true));
  }
}

