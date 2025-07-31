import { createComponent } from "../lib/reactive-core";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("Component returning null", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test("returns null and unmounts", async () => {
    const onBeforeUnmount = jest.fn();
    const onUnmount = jest.fn();

    let toggle = true;

    const Toggle = createComponent(({ props }) => {
      return props.show ? `<div data-ref="box">Visible</div>` : null;
    }, {
      onBeforeUnmount,
      onUnmount,
    });

    // Mount initially with show: true
    Toggle.mount(container, { show: true });

    expect(container.innerHTML).toContain("Visible");

    // Update with show: false — should return null and unmount
    Toggle.update({ props: { show: false } });

    await Promise.resolve(); // Wait for microtask queue

    expect(container.innerHTML).toBe(""); // DOM should be cleared
    expect(onBeforeUnmount).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });
});
