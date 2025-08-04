import { createComponent } from "../lib/reactive-core";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("this.refs behavior", () => {
  let component;
  let root;

  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
    root = document.querySelector("#app");

    const Demo = createComponent(
      ({props}) => {
        if (props.hide) return null;
        return `
        <div data-ref="container">
          <input type="text" data-ref="input" />
        </div>
      `;
      },
      {
        onMount() {
          component = this;
        },
      }
    );

    Demo.mount("#app");
  });

  test("refs are populated on mount", () => {
    expect(component.refs).toBeDefined();
    expect(component.refs.input).toBeInstanceOf(HTMLElement);
    expect(component.refs.container).toBeInstanceOf(HTMLElement);
    expect(component.refs.input.tagName).toBe("INPUT");
    expect(component.refs.container.tagName).toBe("DIV");
  });

  test("refs return null or undefined after unmount", async () => {
    component.update({ hide: true });
    await Promise.resolve(); // wait for microtask flush
    expect(component.refs.input).toBeNull(); // Or undefined if using plain object
    expect(component.refs.container).toBeNull(); // Or undefined depending on how refs are reset
  });

  test("DOM is removed after unmount", () => {
    component.unmount(); // Trigger unm
    expect(root.innerHTML).toBe("");
  });
});
