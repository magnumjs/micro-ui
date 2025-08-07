import { createComponent } from "../lib/reactive-core";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

import { waitFor } from "@testing-library/dom";


describe("child.update({ ... }) vs child.update({ props: ... })", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test("updates child props using both styles", async () => {
    const renderSpy = jest.fn();

    const Child = createComponent(({ props }) => {
      renderSpy(props.name);
      return `<div>Hello, ${props.name}</div>`;
    });

    const Parent = createComponent(
      ({ state }) => {
        return `<div data-ref="child"></div>`;
      },
      {
        onMount() {
          this.child = Child;
          this.child.mount(this.refs.child, { name: "Tova" });
        },
      }
    );

    Parent.mount(container);
    await Promise.resolve(); // Ensure async rendering completes
    expect(container.innerHTML).toContain("Tova");
    expect(renderSpy).toHaveBeenCalledWith("Tova");

    // ✅ OLD STYLE: update({ name })
    Parent.child.update({ name: "Aviva" });
    expect(container.innerHTML).toContain("Aviva");
    expect(renderSpy).toHaveBeenCalledWith("Aviva");

    // ✅ NEW STYLE: update({ props: { name } })
    Parent.child.update({ props: { name: "Sarah" } });
    expect(container.innerHTML).toContain("Sarah");
    expect(renderSpy).toHaveBeenCalledWith("Sarah");

    // Final check: Called 3 times with 3 different values
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  test("child re-renders when parent updates state and pushes props", async () => {
    const childRenderSpy = jest.fn();

    // Child component that receives `name` prop
    const Child = createComponent(({ props }) => {
      childRenderSpy(props.name);
      return `<div>Hello, ${props.name}</div>`;
    });

    // Parent component with internal state
    const Parent = createComponent(
      ({ state }) => {
        return `<div data-ref="slot"></div>`;
      },
      {
        state: { name: "Tova" },

        onMount() {

          this.child = Child;
          this.child.mount(this.refs.slot, { name: this.state.name });

          this.setName = (newName) => {
            this.setState({ name: newName });
            this.child.update({ props: { name: newName } });
          };
        },
      }
    );

    // Initial mount
    Parent.mount(container);
    // await Promise.resolve(); // Ensure async rendering completes

    expect(container.innerHTML).toContain("Tova");
    expect(childRenderSpy).toHaveBeenCalledWith("Tova");

    // Simulate parent state change
    Parent.setName("Aviva");
    // await Promise.resolve(); // wait for async update
    expect(container.innerHTML).toContain("Aviva");
    expect(childRenderSpy).toHaveBeenCalledWith("Aviva");

    // Simulate another state change
    Parent.setName("Sarah");
    expect(container.innerHTML).toContain("Sarah");
    expect(childRenderSpy).toHaveBeenCalledWith("Sarah");

    expect(childRenderSpy).toHaveBeenCalledTimes(3);
  });
});
