import bindEvents from "../lib/bindEvents.js";
import { jest } from "@jest/globals";

/**
 * @jest-environment jsdom
 */


/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";

describe("MicroUI component boundaries with on-event delegation", () => {
  let parentComp;
  let childComp;
  let parentHandler;
  let childHandler;
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    parentHandler = jest.fn();
    childHandler = jest.fn();

    // Child component
    childComp = createComponent(()=>{
        // Child component template
        return `<div data-component-root="true">
          <button data-action="childAction">Child</button>
        </div>`;
      },{
      on: {
        "click [data-action='childAction']": childHandler,
      },
    });

    // Parent component
    parentComp = createComponent(()=>{
        return `<div data-component-root="true">
          <button data-action="parentAction">Parent</button>
          <div data-slot="child-slot"></div>
        </div>`;
    },{
      on: {
        "click [data-action='parentAction']": parentHandler,
      },
      slots: {
        "child-slot": childComp,
      },
    });

    parentComp.mount(container);
  });

  afterEach(() => {
    parentComp.unmount();
    container.remove();
  });

  test("Parent button click triggers parent handler only", () => {
    const parentButton = container.querySelector("[data-action='parentAction']");
    parentButton.click();
    expect(parentHandler).toHaveBeenCalledTimes(1);
    expect(childHandler).not.toHaveBeenCalled();
  });

  test("Child button click triggers child handler only", () => {
    const childButton = container.querySelector("[data-action='childAction']");
    childButton.click();
    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(parentHandler).not.toHaveBeenCalled();
  });
});


describe("Component boundaries and event delegation", () => {
  let parentRoot;
  let childRoot;
  let parentHandler;
  let childHandler;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div data-component-root="true" id="parent">
        <button data-action="parentAction">Parent</button>
        <div data-component-root="true" id="child">
          <button data-action="childAction">Child</button>
        </div>
      </div>
    `;

    parentRoot = document.getElementById("parent");
    childRoot = document.getElementById("child");

    // Mock handlers
    parentHandler = jest.fn();
    childHandler = jest.fn();

    // Event delegation for parent
    parentRoot.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      // Only handle if inside parent's boundary but not inside a child component
      if (!action.closest("[data-component-root]") || action.closest("#parent") === parentRoot) {
        if (action.dataset.action === "parentAction") parentHandler();
      }
    });

    // Event delegation for child
    childRoot.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "childAction") childHandler();
    });
  });

  test("Parent button click triggers parent handler only", () => {
    const parentButton = parentRoot.querySelector("[data-action='parentAction']");
    parentButton.click();
    expect(parentHandler).toHaveBeenCalledTimes(1);
    expect(childHandler).not.toHaveBeenCalled();
  });

  test("Child button click triggers child handler only", () => {
    const childButton = childRoot.querySelector("[data-action='childAction']");
    childButton.click();
    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(parentHandler).not.toHaveBeenCalled();
  });
});



describe("bindEvents component boundary isolation", () => {
  let root, childComp, handler, boundEvents;

  beforeEach(() => {
    // Parent component root
    root = document.createElement("div");
    root.innerHTML = `
      <div data-component-root="true">
        <button data-action="parentAction">Parent</button>
        <div data-component-root="true">
          <button data-action="childAction">Child</button>
        </div>
      </div>
    `;
    boundEvents = [];
    handler = jest.fn();
  });

  it("is backwards compatible: binds events to all descendants if no nested component root", () => {
    // Remove nested data-component-root
    root.innerHTML = `
      <div data-component-root="true">
        <button data-action="parentAction">Parent</button>
        <div>
          <button data-action="childAction">Child</button>
        </div>
      </div>
    `;
    const on = {
      "click [data-action='parentAction']": handler,
      "click [data-action='childAction']": handler,
    };
    const parentRoot = root.firstElementChild;
    bindEvents(
      { state: {}, setState: () => {}, props: {}, refs: {} },
      root,
      on,
      boundEvents
    );

    // Both buttons should trigger the handler
    const parentBtn = parentRoot.querySelector("[data-action='parentAction']");
    const childBtn = parentRoot.querySelector("[data-action='childAction']");
    parentBtn.click();
    childBtn.click();
    expect(handler).toHaveBeenCalledTimes(2);
  });
});