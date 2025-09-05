import { useCurrentComponent } from "../reactive-core.js";

export function useEvents() {
  const component = useCurrentComponent();
  if (!component) throw new Error("useEvent must be inside render()");
  // run once per component
  // if (component._events) return;

  function mergeDataRefs(html) {
    return html.replace(
      /<([a-zA-Z0-9-]+)([^>]*?)>/gs, // match whole tag (multiline + greedy safe)
      (fullMatch, tagName, attrs) => {
        // collect all data-ref="..." values in this tag
        const refs = [...attrs.matchAll(/data-ref="([^"]+)"/g)].map(
          (m) => m[1]
        );

        if (refs.length <= 1) {
          // nothing to merge
          return fullMatch;
        }

        // collapse them into one space-separated value
        const merged = `data-ref="${refs.join(" ")}"`;

        // strip all existing data-ref="..." from attrs
        let cleanedAttrs = attrs.replace(/\s*data-ref="[^"]*"/g, "");

        // rebuild tag with merged data-ref inserted once (at start of attrs for consistency)
        return `<${tagName} ${merged}${cleanedAttrs}>`;
      }
    );
  }

  component.onBeforeRender(mergeDataRefs);

  const prev = { ...component.on };

  // List of common DOM events (single declaration)
  const eventList = [
    "click", "dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave",
    "mousemove", "keydown", "keyup", "keypress", "input", "change", "focus",
    "blur", "submit", "contextmenu", "wheel", "touchstart", "touchend", "touchmove"
  ];

  component.on = function useEventsHook(event, handler) {
    if (event && handler) {
      if (eventList.includes(event)) {
        return addEventWithRef(event, handler);
      } else {
        // Custom event: do not add data-ref decorator
        component.addEvent(event, handler);
        return "";
      }
    }
  };

  Object.assign(component.on, prev);

  function addEventWithRef(event, handler) {
    const refId = `h${component._renderIndex++}`;
    component.addEvent(`${event} [data-ref~=${refId}]`, handler);
    return `data-ref="${refId}"`;
  }

  // component._events = 1;

  function makeSingle(event) {
    return (handler) => {
        return addEventWithRef(event, handler);

    };
  }

  const eventHelpers = {};
  eventList.forEach(event => {
    const name = "on" + event.charAt(0).toUpperCase() + event.slice(1);
    eventHelpers[name] = makeSingle(event);
  });

  return eventHelpers;
}
