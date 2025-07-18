/**
 * @jest-environment jsdom
 */

import { Counter } from "../example/components/Counter.js";

describe("Counter Component", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-root"></div>';
    Counter.mountTo("#test-root");
    Counter.update({ count: 0 }); // initial render with 0 count
  });

  afterEach(() => {
    Counter.destroy();
    // Counter.reset(); // reset internal state after each test
    // document.body.innerHTML = "";
  });

  it("should render with initial count", () => {
    Counter.update({ count: 5 });
    const root = document.getElementById("test-root");
    expect(root.innerHTML).toContain("Count: 5");
  });

  it("should update when incremented manually", () => {
    Counter.update({ count: 0 });
    Counter.update({ count: 1 });

    setTimeout(() => {
      const root = document.getElementById("test-root");
      expect(root.innerHTML).toContain("Count: 1");
    }, 0);
  });

  it("should update when decremented manually", () => {
    Counter.update({ count: 0 });
    Counter.update({ count: -1 });

    setTimeout(() => {
      const root = document.getElementById("test-root");
      expect(root.innerHTML).toContain("Count: -1");
    }, 0);
  });
  it("should respond to click events and update internally", () => {
    Counter.update({ count: 0 });

    const root = document.getElementById("test-root");
    const decrementButton = root.querySelector("#decrement");

    // Simulate + click and rely on Counter internal handler to update UI
    decrementButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(root.innerHTML).toContain("Count: -1");
  });

  it("should respond to click events and update internally", () => {
    Counter.update({ count: 0 });

    const root = document.getElementById("test-root");
    const incrementButton = root.querySelector("#increment");
    const decrementButton = root.querySelector("#decrement");

    // Simulate + click and rely on Counter internal handler to update UI
    incrementButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    setTimeout(() => {
      expect(root.innerHTML).toContain("Count: 1");

      // Simulate - click and expect decrement
      decrementButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(root.innerHTML).toContain("Count: 0");
    }, 0);
  });
  it("should handle multiple updates correctly", () => {
    Counter.update({ count: 0 });

    const root = document.getElementById("test-root");
    const incrementButton = root.querySelector("#increment");

    // Simulate multiple clicks
    incrementButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    incrementButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    incrementButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    setTimeout(() => {
      expect(root.innerHTML).toContain("Count: 3");
    }, 0);
  });
  it("should reset count when reset button is clicked", () => {
    Counter.update({ count: 5 });

    const root = document.getElementById("test-root");
    const resetButton = root.querySelector("#reset");

    resetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    setTimeout(() => {
      expect(root.innerHTML).toContain("Count: 0");
    }, 0);
  });
  it("should reset internal state when reset function is called", () => {
    Counter.update({ count: 5 });
    Counter.reset();

    const root = document.getElementById("test-root");
    expect(root.innerHTML).toContain("Count: 0");
  });
  it("should handle multiple updates in quick succession", () => {
    Counter.update({ count: 0 });

    const root = document.getElementById("test-root");
    const incrementButton = root.querySelector("#increment");

    // Simulate rapid clicks
    for (let i = 0; i < 10; i++) {
      incrementButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }

    setTimeout(() => {
      expect(root.innerHTML).toContain("Count: 10");
    }, 0);
  });
  it("should not update if no changes are made", () => {
    Counter.update({ count: 0 });

    const root = document.getElementById("test-root");
    const initialHTML = root.innerHTML;

    // Call update with same props
    Counter.update({ count: 0 });

    setTimeout(() => {
      expect(root.innerHTML).toBe(initialHTML); // No change should occur
    }, 0);
  });
  it("calls onDestroy properly", () => {
    const root = document.getElementById("test-root");
    Counter.destroy(); // should clean up without error
    expect(root.innerHTML).toBe("");
  });
});
