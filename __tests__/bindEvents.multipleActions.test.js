import { createComponent } from "../lib/reactive-core.js";
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";

describe("bindEvents integration: multiple actions and data values", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("passes multiple data values to click and hover handlers defined on comp.handler and object type", () => {
    const items = [
      { id: "x", label: "X", extra: "foo" },
      { id: "y", label: "Y", extra: "bar" },
    ];
    const clickHandler = jest.fn();
    const hoverHandler = jest.fn();
    const comp = createComponent({
      render() {
        return `
          <ul>
            ${items
              .map(
                (item) => `
                  <li 
                    data-action-click="itemClick" 
                    data-action-mouseover="itemHover" 
                    data-id="${item.id}" 
                    data-extra="${item.extra}" 
                  >${item.label}</li>
                `
              )
              .join("")}
          </ul>
        `;
      },
      on: {
        "click:itemClick": clickHandler,
        "mouseover:itemHover": hoverHandler,
      },
    });
    comp.mount(container);
    const lis = container.querySelectorAll("li");
    lis.forEach((li, idx) => {
      li.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(clickHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "itemClick",
          id: items[idx].id,
          extra: items[idx].extra,
        })
      );
      li.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      expect(hoverHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "itemHover",
          id: items[idx].id,
          extra: items[idx].extra,
        })
      );
    });
    expect(clickHandler).toHaveBeenCalledTimes(items.length);
    expect(hoverHandler).toHaveBeenCalledTimes(items.length);
  });
});
