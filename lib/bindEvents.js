export default function bindEvents(api, el, on, boundEvents) {
  if (!el || !el.children[0] || !on) return;
  const root = el.children.length > 1 ? el : el.children[0];

  // Find the closest ancestor (up to root) that has either data-action
  // or any attribute that starts with data-action- (e.g. data-action-click)
  function closestWithActionAttr(startEl, boundary) {
    for (
      let el = startEl;
      el && el !== boundary.parentNode;
      el = el.parentElement
    ) {
      if (!el || !el.hasAttributes || !el.hasAttributes()) continue;
      for (const attr of el.attributes) {
        if (
          attr.name === "data-action" ||
          attr.name.startsWith("data-action-")
        ) {
          return el;
        }
      }
    }
    return null;
  }

  function traverse(node, isRoot = false) {
    if (!node) return;
    // Stop at component boundaries, except for the root node itself
    if (!isRoot && node.hasAttribute && node.hasAttribute("data-comp-root")) {
      return;
    }

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
          const actionTarget = closestWithActionAttr(e.target, root);

          // Prefer event-specific: data-action-click / data-args-click
          // Fallback to generic:   data-action        / data-args
          let actionValue = "";
          let dataArgsRaw = "";

          if (actionTarget) {
            const specificActionAttr = `data-action-${e.type}`;
            const specificArgsAttr = `data-args-${e.type}`;

            actionValue =
              actionTarget.getAttribute(specificActionAttr) ??
              actionTarget.getAttribute("data-action") ??
              "";

            dataArgsRaw =
              actionTarget.getAttribute(specificArgsAttr) ??
              actionTarget.getAttribute("data-args") ??
              "";
          }

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
            ...e.target.dataset,
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
            } else {
              // console.warn(
              //   `No matching element: found for selector: ${actionOrSelector}`
              // );
              return;
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

    for (const child of node.children) {
      traverse(child, false);
    }
  }
  traverse(el, true);
}
