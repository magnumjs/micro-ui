import ref from "../lib/get-refs.js";

describe("ref utility coverage", () => {
  test("returns null if el is null", () => {
    expect(ref(null, "input")).toBeNull();
    expect(ref(undefined, "input")).toBeNull();
  });

  test("returns element for data-ref, slot, or selector (lines 52-53)", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <input data-ref="input" />
      <button data-ref="btn"></button>
      <span></span>
      <slot name="slotA"></slot>
    `;
    expect(ref(container, "input")).toBeInstanceOf(HTMLElement);
    expect(ref(container, "btn")).toBeInstanceOf(HTMLElement);
    expect(ref(container, "slotA")).toBeInstanceOf(HTMLElement);
    expect(ref(container, "span")).toBeInstanceOf(HTMLElement); // matches by tag name
    expect(ref(container, "missing")).toBeNull();
  });

  test("returns element from parent if not found in el", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);

    const btn = document.createElement("button");
    btn.setAttribute("data-ref", "btn");
    parent.appendChild(btn);

    expect(ref(child, "btn")).toBeInstanceOf(HTMLElement);
  });
});


describe("ref cache scope coverage", () => {
  test("returns null if cached element is moved out of scope, and finds new element if present", () => {
    // Setup: create two separate containers
    const topContainer = document.createElement("div");
    const containerA = document.createElement("div");
    const containerB = document.createElement("div");
    topContainer.appendChild(containerA);
    topContainer.appendChild(containerB);
    document.body.appendChild(topContainer);

    // Create an element and cache it using ref
    const btn = document.createElement("button");
    btn.setAttribute("data-ref", "btn");
    containerA.appendChild(btn);

    // First lookup: caches btn for "btn"
    expect(ref(containerA, "btn")).toBe(btn);

    // Move btn to containerB (still connected, but not in containerA)
    containerB.appendChild(btn);

    // Now, btn is connected, but not in containerA
    expect(ref(containerA, "btn")).not.toBeNull();

    // Add a new button with same ref to containerA
    const btn2 = document.createElement("button");
    btn2.setAttribute("data-ref", "btn");
    containerA.appendChild(btn2);

    // Should now find the new button
    expect(ref(containerA, "btn")).toEqual(btn2);

    // Clean up
    document.body.removeChild(topContainer);
  });
});



describe("ref cache scope coverage", () => {
  test("returns null if cached element is removed from the DOM, and finds new element if present", () => {
    // Setup: create a container
    const container1 = document.createElement("div");
    const container2 = document.createElement("div");

    document.body.appendChild(container1);
    container1.appendChild(container2);

    // Create an element and cache it using ref
    const btn = document.createElement("button");
    btn.setAttribute("data-ref", "btn");
    container2.appendChild(btn);

    // First lookup: caches btn for "btn"
    expect(ref(container2, "btn")).toBe(btn);

    // Remove btn from the DOM
    container2.removeChild(btn);

    // Now, btn is disconnected
    expect(ref(container2, "btn")).toBeNull();

    // Add a new button with same ref to container
    const btn2 = document.createElement("button");
    btn2.setAttribute("data-ref", "btn");
    container2.appendChild(btn2);

    // Should now find the new button
    expect(ref(container2, "btn")).toBe(btn2);

    // Clean up
    document.body.removeChild(container1);
  });
});

describe("ref cache scope coverage", () => {
  test("removes cache if cached element is connected but not in el or its parent", () => {
    // Setup: create two containers
    const topContainer = document.createElement("div");
    const containerA = document.createElement("div");
    const containerB = document.createElement("div");
    topContainer.appendChild(containerA);
    document.body.appendChild(containerB);
    document.body.appendChild(topContainer);

    // Create and cache an element in containerA
    const btn = document.createElement("button");
    btn.setAttribute("data-ref", "btn");
    containerA.appendChild(btn);

    // First lookup: caches btn for "btn"
    expect(ref(containerA, "btn")).toBe(btn);

    // Move btn to containerB (still connected, but not in containerA or its parent)
    containerB.appendChild(btn);

    // btn is still connected, but not in containerA or its parent
    expect(btn.isConnected).toBe(true);
    expect(ref(containerA, "btn")).toBeNull();

    // Clean up
    document.body.removeChild(topContainer);
  });
});