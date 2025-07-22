/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe("createComponent DOM caching for null return and remount", () => {
  let container;
  let lifecycle;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    lifecycle = {
      onMount: jest.fn(),
      onBeforeUnmount: jest.fn(),
      onUnmount: jest.fn(),
    };
  });

  afterEach(() => {
    container.remove();
    container = null;
  });

  test("caches DOM when render returns null and re-attaches on remount", () => {
    let show = true;

    const Comp = createComponent(
      function ({ state }) {
        if (!state.show) return null;
        return `<div data-ref="box">Visible content</div>`;
      },
      {
        state: { show },
        onMount: lifecycle.onMount,
        onBeforeUnmount: lifecycle.onBeforeUnmount,
        onUnmount: lifecycle.onUnmount,
      }
    );

    // Initial mount with visible content
    Comp.mount(container);
    expect(container.firstChild?.textContent).toBe("Visible content");
    expect(lifecycle.onMount).toHaveBeenCalledTimes(1);

    // Set state to hide content (render returns null)
    Comp.setState({ show: false });
    // Await any async lifecycle
    return Promise.resolve().then(() => {
      // Container should be empty (node cached)
      expect(container.firstChild).toBeNull();
      expect(lifecycle.onBeforeUnmount).toHaveBeenCalledTimes(1);
      expect(lifecycle.onUnmount).toHaveBeenCalledTimes(1);

      // Now set state to show content again
      Comp.setState({ show: true });
      return Promise.resolve().then(() => {
        // The cached node should be re-attached
        expect(container.firstChild?.textContent).toBe("Visible content");

        // onMount called again on remount
        expect(lifecycle.onMount).toHaveBeenCalledTimes(2);
      });
    });
  });
});
