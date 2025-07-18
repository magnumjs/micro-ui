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

    if (key && oldKeyed.has(key)) {
      const existing = oldKeyed.get(key);

      // Update innerHTML if different
      if (existing.innerHTML !== newChild.innerHTML) {
        existing.innerHTML = newChild.innerHTML;
      }

      const currentNode = el.children[cursor];
      if (currentNode !== existing) {
        el.insertBefore(existing, currentNode || null);
      }

      oldKeyed.delete(key);
    } else {
      // Insert new node
      const currentNode = el.children[cursor];
      el.insertBefore(newChild, currentNode || null);
    }

    cursor++;
  }

  // Remove any leftover keyed nodes not used
  for (const leftover of oldKeyed.values()) {
    leftover.remove();
  }

  // Remove extra unkeyed nodes if new is shorter
  while (el.children.length > newChildren.length) {
    el.lastChild.remove();
  }

  return true;
}
