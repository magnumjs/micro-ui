// __tests__/injectSlotContent.el-reassignment.test.js
import injectSlotContent from "../lib/injectSlotContent";
import { jest, describe, it, expect } from "@jest/globals";

function createMockComponent(el) {
  return {
    el,
    isMounted: () => true,
    unmount: jest.fn(),
    _mountedChildren: [],
    mount: jest.fn((target) => {
      // Normally mount would set el to target, but for this test
      // we simulate the problematic case where el stays equal to refNode.
      // That’s the case we want to cover.
    }),
  };
}

const api = {
  refs: {},
  setState: jest.fn(),
  props: {},
  isMounted: () => true,
  _mountedChildren: [],
};

describe("injectSlotContent - reassigns el when component mounts to its own refNode", () => {
  it("should replace resolved.el with temp when it matches refNode", () => {
    // Arrange: create a parent container and a refNode inside it
    const container = document.createElement("div");
    const refNode = document.createElement("div");
    container.appendChild(refNode);

    // Create a fake component whose el is the same refNode
    const comp = createMockComponent(refNode);

    // We'll spy on mount to make sure it was called
    comp.mount.mockImplementation(() => {
      // Simulate that after mount, el is still refNode (problematic case)
      comp.el = refNode;
    });

    // Act: injectSlotContent with our mock component
    injectSlotContent(refNode, comp, api);

    // Assert: el should have been reassigned to a new temp node
    expect(comp.el).not.toBe(refNode);
    expect(container.contains(comp.el)).toBe(true); // temp is now in DOM
  });
});
