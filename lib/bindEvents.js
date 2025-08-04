export default function bindEvents(api, el, on, boundEvents) {
  if (!el || !on) return;
  const root = el.firstElementChild;
  if (!root) return;

  Object.entries(on).forEach(([key, handler]) => {
    const isColonSyntax = key.includes(":");
    const [eventType, actionOrSelector] = isColonSyntax
      ? key.split(":")
      : key.split(" ");

    const isWildcardEvent = eventType === "*";
    const eventsToBind = isWildcardEvent
      ? ["click", "input", "change", "keydown", "submit"]
      : [eventType];

    eventsToBind.forEach((type) => {
      const listener = (e) => {
        const actionTarget = e.target.closest("[data-action]");
        const actionValue = actionTarget?.dataset.action || "";
        const dataArgsRaw = actionTarget?.dataset.args;

        const actionParts = actionValue.split(":");
        const actionName = actionParts[0];
        let actionArgs = [];

        // Prefer data-args if present
        if (dataArgsRaw) {
          try {
            const parsed = JSON.parse(dataArgsRaw);
            actionArgs = Array.isArray(parsed) ? parsed : [parsed];
          } catch (err) {
            console.warn("Invalid JSON in data-args:", dataArgsRaw);
          }
        } else {
          actionArgs = actionParts.slice(1);
        }

        const context = {
          event: e,
          state: api.state,
          setState: api.setState,
          props: api.props,
          refs: api.refs,
          action: actionName,
          args: actionArgs,
        };

        // Action handler
        if (isColonSyntax && actionTarget) {
          const matches =
            (actionOrSelector === "*" || actionOrSelector === actionName) &&
            (isWildcardEvent || e.type === eventType);

          if (matches) {
            return handler.call(api, context);
          }
        }

        // Fallback to selector-based if no action match
        if (!isColonSyntax) {
          const target = e.target.closest(actionOrSelector || "*");
          if (target && root.contains(target)) {
            return handler.call(api, context);
          }
        }
      };

      const marker = `__microBound_${type}_${key}`;
      if (!root[marker]) {
        root.addEventListener(type, listener);
        root[marker] = true;
        boundEvents.push({ node: root, type, listener });
      }
    });
  });
}
