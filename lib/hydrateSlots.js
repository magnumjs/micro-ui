// hydrateSlots.js
import getRef from "./get-refs";
import injectSlotContent from "./injectSlotContent";
import { getComponentById } from "./reactive-core";

export default function hydrateSlots(componentFn, props, api, initialSlots) {
  // Resolve initial slots (can be object or function)
  let dynamicSlots =
    typeof initialSlots === "function"
      ? initialSlots.call(api, props)
      : typeof initialSlots === "object"
      ? initialSlots
      : {};

  // Merge with props.slots
  let slotEntries = { ...dynamicSlots, ...(props.slots || {}) };

  // If slots is a component or array, treat as default
  if (
    typeof props.slots === "function" ||
    Array.isArray(props.slots)
    // ||    (props.slots && typeof props.slots === "object" && !("default" in props.slots))
  ) {
    slotEntries = { default: props.slots };
  }

  // Default slot fallback
  if (props.children !== undefined) {
    slotEntries.default = props.children;
  } else if (!slotEntries.default) {
    slotEntries.default = null;
  }

  // --- AUTO: Create slots from <div data-comp="childId"> ---
  const placeholders = componentFn.el?.querySelectorAll("[data-comp]") || [];
  placeholders.forEach((ph) => {
    const compId = ph.getAttribute("data-comp");
    if (!compId) return;
    const childInstance = getComponentById(+compId);
    if (!childInstance) return;
    // Assign a ref for uniformity
    ph.setAttribute("data-ref", compId);

    // Use compId as slot key if no explicit slot exists
    if (!slotEntries[compId]) {
      childInstance._fromSlotHydration = true;
      slotEntries[compId] = childInstance({
        ...childInstance._prevProps,
        ...ph.dataset,
      });
      childInstance._fromSlotHydration = false;
    }
  });

  // console.log("hydrateSlots", slotEntries, componentFn._id);
  // --- INJECT ALL SLOT CONTENT ---
  Object.entries(slotEntries).forEach(([key, value]) => {
    let ntarget;
    // const ntarget = componentFn.refs[key];

    if (key === "default" || key === "children") {
      ntarget =
        componentFn.el?.querySelector('[data-ref="children"]') ||
        componentFn.el?.querySelector("slot:not([name])");
    } else {
      ntarget = getRef(componentFn.el, key);
    }
    if (!ntarget || value == null) return;

    // Ensure/reuse boundary if value is a component
    let boundary = ntarget.querySelector(
      "[data-comp-root='" + componentFn._id + "']"
    );
    if (!boundary && value && typeof value.mount === "function") {
      boundary = document.createElement("div");
      boundary.setAttribute("data-comp-root", componentFn._id);
      ntarget.innerHTML = "";
      ntarget.appendChild(boundary);
    }

    const targetForInjection = boundary || ntarget;
    // console.log("Injecting slot content", key, ntarget.outerHTML, value);
    if (value._id) value._fromSlotHydration = true;
    injectSlotContent(targetForInjection, value, api);
     if (value._id) value._fromSlotHydration = false;
  });
}
