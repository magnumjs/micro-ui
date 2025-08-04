/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core";
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

describe("this.ref() cleanup on unmount", () => {
  let component;
  let root;
  let TestComponent;

  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
    root = document.querySelector("#app");

    TestComponent = createComponent(
      ({ props }) => {
        if (props.hide) return null;
        return `<input type="text" data-ref="input" />`;
      },
      {
        onMount() {
          component = this;
        },
        onBeforeUnmount() {
          const input = this.ref("input");
          expect(input).toBeInstanceOf(HTMLElement);
        },
        onUnmount() {
          const input = this.ref("input");
          expect(input).toBeNull(); // ✅ DOM already removed
        },
      }
    );

    TestComponent.mount("#app");
  });

  test("ref is null after component is unmounted", async () => {
    TestComponent.update({ hide: true });
    await Promise.resolve();

    const input = component.ref("input");
    expect(input).toBeNull();
  });

  test("DOM is removed from container", async () => {
    TestComponent.update({ hide: true });
    await Promise.resolve();

    expect(root.innerHTML).toBe("");
  });
  test("DOM is removed from container", async () => {
    TestComponent.unmount();
    await Promise.resolve();
    expect(root.innerHTML).toBe("");
  });
});
