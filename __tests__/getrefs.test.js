import ref from "../lib/get-refs.js";

describe("ref utility coverage", () => {
  test("returns null if el is null", () => {
    expect(ref(null, "input")).toBeNull();
    expect(ref(undefined, "input")).toBeNull();
  });

  test("throws error if el does not have data-comp-root", () => {
    const container = document.createElement("div");
    // Do NOT set data-comp-root
    expect(() => ref(container, "input")).toThrow(
      "ref() must be called with a component root element"
    );
  });

  test("returns element for data-ref, slot, or selector (lines 52-53)", () => {
    const container = document.createElement("div");
    container.setAttribute("data-comp-root", "");
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

  test("returns null if not found in el or parent", () => {
    const parent = document.createElement("div");
    parent.setAttribute("data-comp-root", "");
    const child = document.createElement("div");
    child.setAttribute("data-comp-root", "");
    parent.appendChild(child);

    const parentbtn = document.createElement("button");
    parentbtn.setAttribute("data-ref", "pbtn");
    parent.appendChild(parentbtn);

    expect(ref(parent, "pbtn")).toBeInstanceOf(HTMLElement);
    expect(ref(parent, "missing")).toBeNull();

    const childbtn = document.createElement("button");
    childbtn.setAttribute("data-ref", "cbtn");
    child.appendChild(childbtn);

    expect(ref(child, "cbtn")).toBeInstanceOf(HTMLElement);
    expect(ref(child, "missing")).toBeNull();

    // Should return null for missing refs in both parent and child
    expect(ref(parent, "cbtn")).toBeNull();
    expect(ref(child, "pbtn")).toBeNull();
  });

  test("throws error if parent or child is missing data-comp-root", () => {
    const parent = document.createElement("div");
    // parent missing data-comp-root
    const child = document.createElement("div");
    // child missing data-comp-root
    parent.appendChild(child);
    expect(() => ref(parent, "pbtn")).toThrow("ref() must be called with a component root element");
    expect(() => ref(child, "cbtn")).toThrow("ref() must be called with a component root element");
  });
});

describe("ref cache scope coverage", () => {
  test("returns null if cached element is moved out of scope, and finds new element if present", () => {
    // Setup: create two separate containers
    const topContainer = document.createElement("div");
    topContainer.setAttribute("data-comp-root", "");
    const containerA = document.createElement("div");
    containerA.setAttribute("data-comp-root", "");
    const containerB = document.createElement("div");
    containerB.setAttribute("data-comp-root", "");
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
    expect(ref(containerA, "btn")).toBeNull();

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
    container1.setAttribute("data-comp-root", "");
    const container2 = document.createElement("div");
    container2.setAttribute("data-comp-root", "");

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
    topContainer.setAttribute("data-comp-root", "");
    const containerA = document.createElement("div");
    containerA.setAttribute("data-comp-root", "");
    const containerB = document.createElement("div");
    containerB.setAttribute("data-comp-root", "");
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
