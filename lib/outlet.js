export default function Outlet(html, props = {}) {
  if (typeof html === "string") {
    html = html.replace(
      /<slot(?:\s+name="([^"]+)")?>([\s\S]*?)<\/slot>/gs,
      (_, name, fallback) => {
        const { children, slots } = props;

        if (!name) {
          // Default unnamed slot
          if (typeof children === "object" && children?.default != null) {
            return children.default;
          } else if (typeof slots === "object" && slots?.default != null) {
            return slots.default;
          } else {
            return typeof children === "string" ? children : fallback;
          }
        }

        // Named slot lookup
        if (typeof children === "object" && children?.[name] != null) {
          return children[name];
        } else if (typeof slots === "object" && slots?.[name] != null) {
          return slots[name];
        } else {
          return fallback;
        }
      }
    );
  }

  return html? html : "";
}
