/**
 * @jest-environment jsdom
 */

// HelloComponent.js
import { createComponent } from "../lib/reactive-core";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

const HelloComponent = createComponent(
  () => {
    return `<h1 data-ref="title">Hello, World!</h1>`;
  },
  {
    onMount() {

    },
    onUnmount() {

    },
  }
);

describe("HelloComponent", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });
  const flushEffects = () => new Promise((r) => queueMicrotask(r));

  it("renders Hello, World! heading", async () => {
    HelloComponent.mount(container);
    await flushEffects();

    expect(container.innerHTML).toContain("Hello, World!");
    expect(HelloComponent.refs.title.textContent).toBe("Hello, World!");
  });

  it("calls onUnmount and clears DOM", () => {
    const spy = jest.fn();
    HelloComponent._resetInternal(); // ensure clean instance
    const Comp = createComponent(
      () => {
        return `<h1>Hello, Test</h1>`;
      },
      {
        onUnmount: spy,
      }
    );
    Comp.mount(container);
    Comp.unmount();
    expect(container.innerHTML).toBe("");
    expect(spy).toHaveBeenCalled();
  });
});
