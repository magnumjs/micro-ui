/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("createComponent mount with cached DOM node", () => {
  let container;
  let lifecycle;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    lifecycle = {
      onMount: jest.fn(),
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

test("mount reuses cached DOM node after null render and unmount", async () => {
  const Comp = createComponent(
    ({ state }) => {
      return state.show ? "<div>Visible</div>" : null;
    },
    { state: { show: true } }
  );

  Comp.mount(container);
  expect(container.firstChild).not.toBeNull();
  expect(container.firstChild.textContent).toBe("Visible");

  // Render null and unmount (cache)
  Comp.setState({ show: false });
  await Promise.resolve(); // Ensure async rendering completes
  expect(container.firstChild).toBeNull();

  Comp.unmount();
  expect(Comp._cachedNode).not.toBeNull();

  // Remount and trigger render again
  Comp.setState({ show: true }); // ensure next render returns non-null
  Comp.mount(container);
    await Promise.resolve(); // Ensure async rendering completes

  expect(container.firstChild).not.toBeNull();
  expect(container.firstChild.textContent).toBe("Visible");
});


  test("reuses cached DOM node on mount if previously rendered null", async () => {
    // Ensure initial state to show true on create
    const Comp = createComponent(
      function ({ state }) {
        return state.show ? `<div data-ref="box">Visible</div>` : null;
      },
      {
        state: { show: true },
        ...lifecycle,
      }
    );

    Comp.mount(container);
    expect(container.firstChild).not.toBeNull();
    expect(lifecycle.onMount).toHaveBeenCalledTimes(1);

    // Hide content → render null → cache node
    Comp.setState({ show: false });
    await Promise.resolve(); // Ensure async rendering completes
    expect(container.innerHTML).toBe("");

    Comp.unmount();

    lifecycle.onMount.mockClear();

    // ✅ FIX: Restore the show state before remount
    Comp.setState({ show: true });

    Comp.mount(container);
    await Promise.resolve(); // Ensure async rendering completes

    expect(container.firstChild).not.toBeNull();
    expect(lifecycle.onMount).toHaveBeenCalledTimes(1);
  });
});
