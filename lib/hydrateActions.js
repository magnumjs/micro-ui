export default function hydrateActions(api, rootEl) {
  if (!rootEl) return;

  // Find all elements with any data-action-* attribute
  const elements = rootEl.querySelectorAll("*");
  elements.forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (!attr.name.startsWith("data-action-")) return;

      const eventType = attr.name.slice("data-action-".length);
      const actionName = attr.value;
      if (!actionName) return;

      const key = `${eventType}:${actionName}`;
      // Prefer explicit handler already in api.on
      if (typeof api.on[key] === "function") return;

      // Check plain action name in api.on
      if (typeof api.on[actionName] === "function") {
        api.on[key] = api.on[actionName].bind(api);
        return;
      }

      // Otherwise, check instance method
      if (typeof api[actionName] === "function") {
        api.on[key] = api[actionName].bind(api);
      }

    //   console.log("Bound action", key, api.on[key] ? "found" : "not found");
    });
  });
}
