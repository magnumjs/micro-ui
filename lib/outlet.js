export default function Outlet(html, props = {}) {
  if (typeof html !== "string") return ""; // return empty string if null or non-string

  const { children = {}, slots = {} } = props;

  function getSlotContent(name, fallback) {
    let value;

    if (!name) {
      if (
        children &&
        typeof children === "object" &&
        children.default != null
      ) {
        value = children.default;
      } else if (slots && typeof slots === "object" && slots.default != null) {
        value = slots.default;
      } else if (typeof children === "string") {
        value = children;
      } else {
        return fallback;
      }
    } else {
      value = children?.[name] ?? slots?.[name] ?? fallback;
    }

    if (typeof value === "function") {
      value = value();
    }

    if (value?.el instanceof HTMLElement) {
      return value.el.outerHTML; // insert HTML, real DOM will be handled later
    }

    if (value instanceof Node) {
      const temp = document.createElement("div");
      temp.appendChild(value.cloneNode(true));
      return temp.innerHTML;
    }

    return value ?? fallback;
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
