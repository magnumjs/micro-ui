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
   // done();
  }, 0);
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
});
