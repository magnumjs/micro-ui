import { createComponent } from "../lib/reactive-core.js";
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";

describe("bindEvents integration: data-action-click with data-id in loop", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("passes unique data-id to action handler for each item", () => {
    const items = [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
    ];
    const handler = jest.fn();
    const comp = createComponent(() => `
      <ul>
        ${items
          .map(
            (item) => `
              <li data-action-click="itemClick" data-id="${item.id}">${item.label}</li>
            `
          )
          .join("")}
      </ul>
    `, {
      on: {
        "click:itemClick": handler,
      },
    });
    comp.mount(container);
    const lis = container.querySelectorAll("li");
    lis.forEach((li, idx) => {
      li.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "itemClick",
          args: [],
          event: expect.any(MouseEvent),
          state: expect.any(Object),
          setState: expect.any(Function),
          props: expect.any(Object),
          refs: expect.any(Object),
          id: items[idx].id,
        })
      );
    });
    expect(handler).toHaveBeenCalledTimes(items.length);
  });
});
