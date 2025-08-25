import { createComponent } from "../lib/reactive-core.js";
import { jest, test, expect, describe, beforeEach, afterEach } from "@jest/globals";

describe("bindEvents integration: child button component in parent", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("clicking child button component triggers parent's handler with correct data", () => {
    const handler = jest.fn();
    // Child button component
    const Button = (props) => `
      <button data-action-click="btnClick" data-id="${props.id}">${props.label}</button>
    `;
    // Parent component
    const Parent = createComponent(() => `
      <div>
        ${Button({ id: "child1", label: "Click Me" })}
      </div>
    `, {
      on: {
        "click:btnClick": handler,
      },
    });
    Parent.mount(container);
    const btn = container.querySelector("button");
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "btnClick",
        id: "child1",
        event: expect.any(MouseEvent),
      })
    );
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
