/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core";
import { jest, describe, test, expect, beforeEach } from "@jest/globals";


const mockHandler = jest.fn();

const Child = createComponent({
  render({ props }) {
    return `
      <div data-ref="child">
        <span>${props.label}</span>
        <button data-ref="clickBtn">Click me</button>
      </div>
    `;
  },
  on: {
    "click button"() {
      this.emitGlobal("child:clicked", { id: this.props.item.id, label: this.props.item.label });
    }
  }
});

const Parent = createComponent({
  state: {
    items: [
      { id: 1, label: "Alpha" },
      { id: 2, label: "Beta" },
      { id: 3, label: "Gamma" }
    ]
  },
  onMount() {
    this.onEmitGlobal("child:clicked", (event) => {
      console.log('clicked', event)
      mockHandler(event);
    });
  },
  render({ state }) {
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
    console.log(out);
    return out;
  }
});

xtest("Parent preserves child instances and receives bubbled events", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  Parent.mount(container);

  await Promise.resolve();

//   console.log(container.innerHTML)
  // Click the first child button
  const firstBtn = container.querySelector('[data-ref="children"] button');
  firstBtn.click();

  await Promise.resolve();
  expect(mockHandler).toHaveBeenCalledWith({ id: 1, label: "Alpha" });

  // Save reference to the second child element
  const secondChildBefore = parent.el.querySelectorAll('[data-ref="child"]')[1];

  // Trigger parent re-render by updating state (rename Beta → Delta)
  parent.setState({
    items: [
      { id: 1, label: "Alpha" },
      { id: 2, label: "Delta" }, // changed label
      { id: 3, label: "Gamma" }
    ]
  });

  const secondChildAfter = parent.el.querySelectorAll('[data-ref="child"]')[1];

  // The DOM node should be the same (child instance preserved)
  expect(secondChildBefore).toBe(secondChildAfter);

  // And it should have updated text
  expect(secondChildAfter.querySelector("span").textContent).toBe("Delta");
});
