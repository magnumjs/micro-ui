import { createComponent } from "../lib/reactive-core.js";

describe("hydrateSlots backwards compatibility", () => {
  it("should render slot content using legacy slot API", () => {
    // Legacy slot usage: pass slots as object
    const Child = createComponent(() => `<span>Legacy Child</span>`);
    const Parent = createComponent(function () {
      return `<div><slot></slot></div>`;
    });
    const parent = Parent({ slots: { default: Child } });
    const container = document.createElement("div");
    parent.mount(container);
    expect(container.innerHTML).toContain("Legacy Child");
  });

  it("should render slot content using new call-order child instance API", () => {
    // New pattern: call Child() directly in parent render
    const Child = createComponent(() => `<span>New Child</span>`);
    const Parent = createComponent(function () {
      return `<div>${Child()}</div>`;
    });
    const parent = Parent();
    const container = document.createElement("div");
    parent.mount(container);
    expect(container.innerHTML).toContain("New Child");
  });

  it("should not break hydrateSlots when mixing both patterns", () => {
    const Child = createComponent(() => `<span>Mixed Child</span>`);
    const Parent = createComponent(function mixed() {
      // Mix legacy and new
      return `<div><slot></slot>${Child()}</div>`;
    });
    const parent = Parent({ slots: { default: Child } });
    const container = document.createElement("div");
    parent.mount(container);
    expect(container.querySelector("slot span").textContent).toContain("Mixed Child");
    expect(container.querySelector("div span").textContent).toContain("Mixed Child");
  });
});
