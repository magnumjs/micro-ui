
export function Outlet(html, props = {}) {
  if (typeof html === "string") {
    html = html.replace(
      /<slot(?:\s+name="([^"]+)")?>(.*?)<\/slot>/gs,
      (_, name, fallback) => getSlotContent(name, props, fallback)
    );
  }
  return html;
} 

function getSlotContent(name, props, fallback = "") {
  const { children, slots } = props;
  if (!name) {
    return typeof children === "object"
      ? children.default ?? fallback
      : children ?? fallback;
  } else if (typeof children === "object" && children[name]) {
    return children[name];
  } else if (typeof slots === "object" && slots[name]) {
    return slots[name];
  } else {
    return fallback;
  }
}
