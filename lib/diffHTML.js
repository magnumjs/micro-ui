export default function diffHTML(el, newHTML) {
  if (!el) return false;

  const temp = document.createElement("div");
  temp.innerHTML = newHTML;

  const newChildren = Array.from(temp.children);
  const oldChildren = Array.from(el.children);

  const newKeyed = new Map();
  const oldKeyed = new Map();

  // Index new keyed nodes
  for (const child of newChildren) {
    const key = child.dataset.key;
    if (key) newKeyed.set(key, child);
  }

  // Index old keyed nodes
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

      // Update inner content only if it changed
      if (existing.innerHTML !== newChild.innerHTML) {
        existing.innerHTML = newChild.innerHTML;
      }

      if (existing !== currentNode) {
        el.insertBefore(existing, currentNode || null); // 🧠 move DOM node
      }

      oldKeyed.delete(key); // ✅ mark as used
    } else {
      // Either unkeyed or new keyed node → insert new one
      el.insertBefore(newChild, currentNode || null);
    }

    cursor++;
  }

  // Remove leftover keyed nodes that were not reused
  for (const leftover of oldKeyed.values()) {
    leftover.remove();
  }

  // Remove extra unkeyed children if any
  while (el.children.length > newChildren.length) {
    el.lastChild.remove();
  }

  return true;
}
