/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js";

describe("ToggleWithNull: child component returns null with caching", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("child component can return null and be remounted", () => {
    const Child = createComponent(function () {
      return `<div data-ref="child">Hello!</div>`;
    });

    const Parent = createComponent(function ({ state }) {
      return `
        <div>
          <button data-ref="toggle">Toggle</button>
          ${state.show ? Child.render() : ""}
        </div>
      `;
    }, {
      state: { show: true },
      on: {
        'click [data-ref="toggle"]'(e) {
          this.setState({ show: !this.state.show });
        },
      },
    });

    Parent.mount(container);
    expect(container.textContent).toContain("Hello!");

    // Hide child (simulate null render)
    container.querySelector("[data-ref='toggle']").click();
    expect(container.textContent).not.toContain("Hello!");

    // Show child again (should reuse cached DOM)
    container.querySelector("[data-ref='toggle']").click();
    expect(container.textContent).toContain("Hello!");
  });
});
