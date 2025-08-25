import { createComponent } from "../lib/reactive-core.js";
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";

describe("bindEvents integration: multiple child Button components in loop", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("clicking each child Button triggers parent's handler with correct data", () => {
    const items = [
      { id: "btn1", label: "Button 1" },
      { id: "btn2", label: "Button 2" },
      { id: "btn3", label: "Button 3" },
    ];
    const handler = jest.fn();
    // Child Button component
    const Button = (props) => `
      <button data-action-click="btnClick" data-id="${props.id}">${props.label}</button>
    `;
    // Parent component
    const Parent = createComponent(() => `
      <div>
        ${items.map(item => Button(item)).join("")}
      </div>
    `, {
      on: {
        "click:btnClick": handler,
      },
    });
    Parent.mount(container);
    const btns = container.querySelectorAll("button");
    btns.forEach((btn, idx) => {
      btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "btnClick",
          id: items[idx].id,
          event: expect.any(MouseEvent),
        })
      );
    });
    expect(handler).toHaveBeenCalledTimes(items.length);
  });
});
