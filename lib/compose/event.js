import { useCurrentComponent } from "../reactive-core.js";
// import bindEvents from "../bindEvents.js";

export function event(eventMapOrType, maybeHandler) {
  const comp = useCurrentComponent();
  if (!comp) throw new Error("event() must be called inside a component");

  if (typeof eventMapOrType === "string" && typeof maybeHandler === "function") {
    // Single event type and handler
    // const eventMap = { [eventMapOrType]: maybeHandler };
    comp.addEvent(eventMapOrType, maybeHandler);
    //bindEvents(comp, comp.el, eventMap, comp._boundEvents);
  } else if (typeof eventMapOrType === "object") {
    // Event map
    for (const [type, handler] of Object.entries(eventMapOrType)) {
      if (typeof handler === "function") {
        comp.addEvent(type, handler);
      }
    }
  } else {
    throw new Error("Invalid arguments passed to event()");
  }
}
