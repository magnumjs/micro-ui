// renderList.js
// Helper to render arrays with keys for micro-ui

export function renderList(array, renderFn, keyFn = (item) => item.id ?? item.key ?? item) {
  return array
    .map((item, index) => {
      const key = keyFn(item, index);
      const inner = renderFn(item, index);
      // Only add data-key if inner is string and starts with a tag
      if (typeof inner === "string") {
        return inner.replace(
          /^<([a-zA-Z0-9-]+)/,
          `<$1 data-key="${String(key).replace(/"/g, "&quot;")}"`
        );
      }
      return inner;
    })
    .join("");
}
