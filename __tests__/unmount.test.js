import { createComponent } from "../lib/reactive-core";
import { context } from "../lib/compose/context.js";
import { jest, describe, test, expect } from "@jest/globals";

describe("Unmount logic and event/context cleanup", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
  });

  test("removes event listeners and context subscriptions on unmount", () => {
    const clickSpy = jest.fn();
    const unsubSpy = jest.fn();

    // Simulate context subscription
    context.subscribe("test", unsubSpy);

    const Demo = createComponent(
      () => `<button data-ref="btn">Click</button>`,
      {
        onMount() {
          this.ref("btn").addEventListener("click", clickSpy);
        },
        onUnmount() {
          // nothing
        }
      }
    );

    Demo.mount(container);
    const btn = container.querySelector("[data-ref='btn']");
    btn.click();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // Unmount and check event is removed
    Demo.unmount();
    btn.click();
    expect(clickSpy).toHaveBeenCalledTimes(2); // Should not increment

    // Simulate context unsubscription
    context.emit("test");
    expect(unsubSpy).toHaveBeenCalledTimes(1); // Should be called once
  });
});