import { createComponent } from "../lib/reactive-core";
import { jest, describe, test, expect } from "@jest/globals";

describe("bindEvents actually binds events", () => {
  test("event handler is called when event is triggered", () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const clickSpy = jest.fn();

    const Demo = createComponent(
      () => `<button data-ref="btn">Click</button>`,
      {
        on: {
          "click button": clickSpy
        }
      }
    );

    Demo.mount("#app");
    const btn = document.querySelector("[data-ref='btn']");
    btn.click();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});