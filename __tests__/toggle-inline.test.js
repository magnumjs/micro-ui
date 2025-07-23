/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js";

describe("ToggleWithNull: simple toggleable child with caching", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("toggles visibility of child with DOM caching", () => {
    const Toggle = createComponent(function ({ state, setState }) {
      return `
        <div>
          <button data-ref="toggle">Toggle</button>
          ${
            state.show
              ? `<div data-ref="child">Hello!</div>`
              : ""
          }
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

    Toggle.mount(container);

    expect(container.textContent).toContain("Hello!");

    // Toggle off (should unmount)
    container.querySelector("[data-ref='toggle']").click();
    expect(container.textContent).not.toContain("Hello!");

    // Toggle on (should reuse cached)
    container.querySelector("[data-ref='toggle']").click();
    expect(container.textContent).toContain("Hello!");
  });
});
