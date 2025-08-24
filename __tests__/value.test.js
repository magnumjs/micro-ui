import { slot } from "../lib/compose/value.js";
import { createComponent } from "../lib/reactive-core.js";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("value.js coverage", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("slot: get and set values", () => {
    let api;
    const Comp = createComponent(() => {
      if (!api) api = slot(0);
      return `<span>${api[0]()}</span>`;
    });

    Comp.mount(container);
    expect(container.innerHTML).toContain("0");

    api[1](1);
    expect(container.innerHTML).toContain("1");

    api[1]((prev) => prev + 1);
    expect(container.innerHTML).toContain("2");
  });

  test("slot: re-renders component on set", () => {
    let renderCount = 0;
    let api;
    const Comp = createComponent(() => {
      renderCount++;
      if (!api) api = slot("initial");
      return `<span>${api[0]()}</span>`;
    });

    Comp.mount(container);
    expect(renderCount).toBe(1);

    api[1]("updated");
    expect(renderCount).toBe(2);
    expect(container.innerHTML).toContain("updated");
  });

  test("slot: throws error if used outside component", () => {
    expect(() => slot(0)).toThrow("slot() must be called inside a component");
  });

  test("multiple slot instances in one render function", () => {
    let api1, api2;
    const Comp = createComponent(() => {
      if (!api1) api1 = slot(10);
      if (!api2) api2 = slot("A");
      return `<span>${api1[0]()}-${api2[0]()}</span>`;
    });

    Comp.mount(container);
    expect(container.innerHTML).toContain("10-A");

    api1[1](20);
    expect(container.innerHTML).toContain("20-A");

    api2[1]("B");
    expect(container.innerHTML).toContain("20-B");

    api1[1]((prev) => prev + 5);
    api2[1]((prev) => prev + "C");
    expect(container.innerHTML).toContain("25-BC");
  });

  test("slot: object values and property updates", () => {
    let apiObj;
    const Comp = createComponent(() => {
      if (!apiObj) apiObj = slot({ x: 1, y: "foo" });
      const obj = apiObj[0]();
      return `<span>${obj.x},${obj.y}</span>`;
    });

    Comp.mount(container);
    expect(container.innerHTML).toContain("1,foo");

    apiObj[1]((prev) => ({ ...prev, x: prev.x + 1 }));
    expect(container.innerHTML).toContain("2,foo");

    apiObj[1]((prev) => ({ ...prev, y: prev.y + "bar" }));
    expect(container.innerHTML).toContain("2,foobar");
  });
});
