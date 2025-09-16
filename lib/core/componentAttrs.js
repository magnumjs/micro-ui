// Set the data-comp-root attribute for a component root element
export function setComponentRootAttr(el, componentFn, renderFn) {
  el.setAttribute(
    "data-comp-root",
    componentFn._id + "-" + (renderFn.name || "")
  );
}

// Set the data-key attribute for a component root element if key is present
export function setComponentKeyAttr(el, key) {
  if (key) el.setAttribute("data-key", key);
}
