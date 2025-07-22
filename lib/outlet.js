export default function Outlet(html, props = {}) {
  if (typeof html !== "string") return ""; // return empty string if null or non-string

  const { children = {}, slots = {} } = props;

  function getSlotContent(name, fallback) {
    if (!name) {
      if (
        children &&
        typeof children === "object" &&
        children.default != null
      ) {
        return children.default;
      }
      if (slots && typeof slots === "object" && slots.default != null) {
        return slots.default;
      }
      if (typeof children === "string") {
        return children;
      }
      return fallback;
    }

    if (children && typeof children === "object" && children[name] != null) {
      return children[name];
    }
    if (slots && typeof slots === "object" && slots[name] != null) {
      return slots[name];
    }
    return fallback;
  }

  html = html.replace(
    /<slot(?:\s+name="([^"]+)")?>([\s\S]*?)<\/slot>/gis,
    (_, name, fallback) => getSlotContent(name, fallback)
  );

  html = html.replace(
    /<([a-z]+)([^>]*)\sdata-slot="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/gis,
    (_, tag, before, name, after, fallback) => {
      const content = getSlotContent(name, fallback);
      return `<${tag}${before}${after}>${content}</${tag}>`;
    }
  );

  return html;
}
