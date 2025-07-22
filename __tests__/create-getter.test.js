/**
 * @jest-environment jsdom
 */
import { createComponent, renderList } from "../lib/reactive-core.js";

describe("createComponent state getter", () => {
  test("returns the internal state via getter", () => {
    const initialState = { count: 42 };
    const Comp = createComponent(() => "<div></div>", { state: initialState });

    expect(Comp.state).toEqual(initialState);

    // Updating state updates getter's return value
    Comp.setState({ count: 100 });
    expect(Comp.state).toEqual({ count: 100 });
  });
});


describe("renderList function", () => {
  test("returns inner content directly if not a string", () => {
    const arr = [{ id: 1 }, { id: 2 }];

    const renderFn = () => {
      // Return a DOM node instead of string to trigger `return inner;`
      const div = document.createElement("div");
      div.textContent = "Node";
      return div;
    };

    const result = renderList(arr, renderFn, (item) => item.id);

    // Result should be a concatenation of DOM nodes (converted to string, so [object HTMLDivElement])
    // Since joining DOM nodes in string context gives '[object HTMLDivElement][object HTMLDivElement]'
    expect(result).toBe(
      "[object HTMLDivElement][object HTMLDivElement]"
    );
  });
});
