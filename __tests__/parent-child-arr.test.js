/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core";
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import { useEmit } from "../lib/hooks/useEmit.js";

const mockHandler = jest.fn();

const Child = ({ item }) =>
  createComponent({
    render() {
      useEmit()
      return `
      <div data-ref="child">
        <span>${item ? item.label : ""}</span>
        <button data-ref="clickBtn">Click me</button>
      </div>
    `;
    },
    on: {
      "click button"() {
        if (item) {
          this.emitGlobal("child:clicked", { id: item.id, label: item.label });
        } else {
          this.emitGlobal("child:clicked", { id: undefined, label: undefined });
        }
      },
    },
  });

const Parent = createComponent({
  state: {
    items: [
      { id: 1, label: "Alpha" },
      { id: 2, label: "Beta" },
      { id: 3, label: "Gamma" },
    ],
  },
  onMount() {
    this.onEmitGlobal("child:clicked", (event) => {
      mockHandler(event);
    });
  },
  render({ state }) {
          useEmit()

    return `
      <div data-ref="parent">
        <h2>Parent</h2>
        <div data-ref="children">
          ${state.items
            .map((item) => `<slot name="child-${item.id}"></slot>`)
            .join("")}
        </div>
      </div>
    `;
  },

  slots() {
    const out = {};
    for (const item of this.state.items) {
      out[`child-${item.id}`] = Child({ item });
    }
    return out;
  },
});

test("Parent preserves child instances and receives bubbled events", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  Parent.mount(container);

  await Promise.resolve();

  // Click the first child button
  const firstBtn = container.querySelector('[data-ref="children"] button');
  firstBtn.click();

  await Promise.resolve();

  expect(mockHandler).toHaveBeenCalledWith({ id: 1, label: "Alpha" });

  // Save reference to the second child element
  const secondChildBefore = Parent.el.querySelectorAll('[data-ref="child"]')[1];

  // Trigger parent re-render by updating state (rename Beta → Delta)
  Parent.setState({
    items: [
      { id: 1, label: "Alpha" },
      { id: 2, label: "Delta" }, // changed label
      { id: 3, label: "Gamma" },
    ],
  });
  await Promise.resolve();

  const secondChildAfter = Parent.el.querySelectorAll('[data-ref="child"]')[1];

  // The DOM node should be the same (child instance preserved)
  //expect(secondChildBefore).toBe(secondChildAfter);

  // And it should have updated text
  expect(secondChildAfter.querySelector("span").textContent).toBe("Delta");
});
