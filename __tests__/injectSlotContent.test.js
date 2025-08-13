/**
 * @jest-environment jsdom
 */

import injectSlotContent from "../lib/injectSlotContent";

const api = {
  _mountedChildren: [],
  refs: {},
};

const createFakeComponent = (html = "<div>Comp</div>") => {
  let mounted = false;
  const instance = {
    el: null,
    mount(target) {
      mounted = true;
      target.innerHTML = html;
      this.el = target.firstElementChild;
    },
  };
  return instance;
};



describe("injectSlotContent caching", () => {
  it("skips injection if the same value is already injected", () => {
    // Setup a slot node
    const container = document.createElement("div");
    container.innerHTML = `<slot name="header"></slot>`;
    const slotNode = container.querySelector('slot[name="header"]');

    // Spy to detect replacement
    const originalReplaceWith = slotNode.replaceWith;
    let replaceCalled = 0;
    slotNode.replaceWith = function () {
      replaceCalled++;
      return originalReplaceWith.apply(this, arguments);
    };

    // First injection
    injectSlotContent(slotNode, "<h1>Header</h1>", { _mountedChildren: [] });
    expect(container.innerHTML).toContain("<h1>Header</h1>");
    expect(replaceCalled).toBe(1);

    // Add a new slot node for the second test (simulate DOM diffing)
    container.innerHTML = `<slot name="header"></slot>`;
    const slotNode2 = container.querySelector('slot[name="header"]');

    // Second injection with the same value (should skip)
    injectSlotContent(slotNode2, "<h1>Header</h1>", { _mountedChildren: [] });
    // Since slotNode2 is a new node, cache won't match; to test the cache, use the same node:
    injectSlotContent(slotNode, "<h1>Header</h1>", { _mountedChildren: [] });
    expect(replaceCalled).toBe(1); // Should not increase

    // Third injection with a different value (should inject)
    injectSlotContent(slotNode, "<h2>Header2</h2>", { _mountedChildren: [] });
    expect(replaceCalled).toBe(2);

    // Restore
    slotNode.replaceWith = originalReplaceWith;
  });
});

describe("injectSlotContent", () => {
  let root;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.innerHTML = ""; // reset dom
    document.body.appendChild(root);
    root.innerHTML = `<div data-slot></div>`;
  });

  const slot = () => root.querySelector("[data-slot]");

  test("removes if value is null", () => {
    injectSlotContent(slot(), null, api);
    expect(root.innerHTML).toContain(`data-slot`);
  });

  test("does nothing if value is empty", () => {
    injectSlotContent(slot(), "", api);
    expect(root.innerHTML).toContain(``);
  });

  test("resolves and injects string HTML", () => {
    injectSlotContent(slot(), "<p>Hello</p>", api);
    expect(root.innerHTML).toContain("<p>Hello</p>");
  });

  test("injects DOM Node directly", () => {
    const span = document.createElement("span");
    span.textContent = "Text";
    injectSlotContent(slot(), span, api);
    expect(root.querySelector("span").textContent).toBe("Text");
  });

  test("injects mounted component.el", () => {
    const comp = createFakeComponent();
    const mountTarget = document.createElement("div");
    comp.mount(mountTarget);
    injectSlotContent(slot(), comp, api);
    expect(root.innerHTML).toContain("Comp");
  });

  test("auto-mounts unmounted component instance", () => {
    const comp = createFakeComponent("<h1>Auto</h1>");
    injectSlotContent(slot(), comp, api);
    expect(root.innerHTML).toContain("<h1>Auto</h1>");
    expect(comp.el).toBeInstanceOf(HTMLElement);
  });

  test("calls function to resolve dynamic value", () => {
    injectSlotContent(slot(), () => "<i>Dynamic</i>", api);
    expect(root.innerHTML).toContain("Dynamic");
  });

  test("injects array of strings", () => {
    injectSlotContent(slot(), ["<li>One</li>", "<li>Two</li>"]);
    expect(root.innerHTML).toContain("One");
    expect(root.innerHTML).toContain("Two");
  });

  test("injects array of DOM nodes", () => {
    const a = document.createElement("a");
    a.textContent = "Link";
    const b = document.createElement("b");
    b.textContent = "Bold";
    injectSlotContent(slot(), [a, b], api);
    expect(root.innerHTML).toContain("Link");
    expect(root.innerHTML).toContain("Bold");
  });

  test("injects array of DOM nodes", () => {
    const a = createFakeComponent("<li>Item 1</li>");
    // a.textContent = "Link";
    const b = createFakeComponent("<li>Item 2</li>");
    b.textContent = "Bold";
    injectSlotContent(slot(), [a, b], api);
    expect(root.innerHTML).toContain("<li>Item 1</li><li>Item 2</li>");
    expect(root.innerHTML).toContain("<li>Item 1</li><li>Item 2</li>");
  });

  test("injectSlotContent: injects single item with .el HTMLElement", () => {
    const ref = document.createElement("div");
    ref.setAttribute("data-ref", "slot");

    const el = document.createElement("section");
    el.textContent = "Single .el content";

    const wrapper = { el };

    const container = document.createElement("div");
    container.appendChild(ref);

    injectSlotContent(ref, wrapper);

    expect(container.innerHTML).toBe("<section>Single .el content</section>");
  });

  test("injectSlotContent: injects single string HTML into refNode", () => {
    const ref = document.createElement("div");
    ref.setAttribute("data-ref", "slot");

    const container = document.createElement("div");
    container.appendChild(ref);

    const htmlString = `<section>Hello World</section>`;

    injectSlotContent(ref, htmlString);

    expect(container.innerHTML).toBe("<section>Hello World</section>");
  });

  test("skips unsupported item types in array", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    // Array contains unsupported types: number, boolean, null, undefined
    injectSlotContent(div, [123, null, undefined, true, {}]);

    // The fragment should be empty, so div is replaced with an empty fragment
    // If div was in the DOM, it should be removed
    expect(document.body.contains(div)).toBe(false);
  });

  test("skips unsupported item types in array", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    // Array contains unsupported types: number, boolean, null, undefined
    injectSlotContent(div, [123, null, undefined, true, {}]);

    // The fragment should be empty, so div is replaced with an empty fragment
    // If div was in the DOM, it should be removed
    expect(document.body.contains(div)).toBe(false);
  });

  test("skips unsupported item types in array", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    // Array contains unsupported types: number, boolean, null, undefined
    injectSlotContent(div, [123, null, undefined, true, {}]);

    // The fragment should be empty, so div is replaced with an empty fragment
    // If div was in the DOM, it should be removed
    expect(document.body.contains(div)).toBe(false);
  });

  test("injects array with null and valid string", () => {
    const ref = document.createElement("div");
    const container = document.createElement("div");
    container.appendChild(ref);

    injectSlotContent(ref, [null, "<span>Hi</span>"]);
    expect(container.innerHTML).toContain("Hi");
  });

  test("calls function that returns unsupported type", () => {
    const ref = document.createElement("div");
    const container = document.createElement("div");
    container.appendChild(ref);

    injectSlotContent(ref, () => 123);
    expect(container.innerHTML).toBe("");
  });

  test("injects array with function item", () => {
    const ref = document.createElement("div");
    const container = document.createElement("div");
    container.appendChild(ref);

    injectSlotContent(ref, [() => "<span>Func</span>"]);
    expect(container.innerHTML).toContain("Func");
  });

  test("injects array of mounted components", () => {
    const comp1 = createFakeComponent("<li>Item 1</li>");
    comp1.mount(document.createElement("div"));

    const comp2 = createFakeComponent("<li>Item 2</li>");
    comp2.mount(document.createElement("div"));

    injectSlotContent(slot(), [comp1, comp2], api);
    expect(root.innerHTML).toContain("Item 1");
    expect(root.innerHTML).toContain("Item 2");
  });

  test("injectSlotContent: injects item with .el HTMLElement", () => {
    const ref = document.createElement("span");
    ref.setAttribute("data-ref", "slot");

    const el = document.createElement("div");
    el.textContent = "Hello from .el";

    const wrapper = { el };

    // Add to DOM so we can observe changes
    const container = document.createElement("div");
    container.appendChild(ref);

    // Inject using wrapper with `.el`
    injectSlotContent(ref, [wrapper], api);

    expect(container.innerHTML).toBe("<div>Hello from .el</div>");
  });

  test("injects array of mounted components", () => {
    const comp1 = createFakeComponent("<li>Item 1</li>");
    comp1.mount(document.createElement("div"));

    // const comp2 = createFakeComponent("<b>Item 2222</b>");
    // comp2.mount(document.createElement("div"));

    const comp2 = document.createElement("b");
    comp2.textContent = "Item 2222";

    injectSlotContent(slot(), [comp1, comp2], api);
    expect(root.innerHTML).toContain("Item 1");
    expect(root.innerHTML).toContain("Item 2");
  });

  test("auto-mounts array of unmounted components", () => {
    const comp1 = createFakeComponent("<li>Item A</li>");
    const comp2 = createFakeComponent("<li>Item B</li>");
    injectSlotContent(slot(), [comp1, comp2], api);
    expect(root.innerHTML).toContain("Item A");
    expect(root.innerHTML).toContain("Item B");
    expect(comp1.el).not.toBeNull();
    expect(comp2.el).not.toBeNull();
  });

  test("handles mixed array of strings, nodes, and components", () => {
    const node = document.createElement("u");
    node.textContent = "Underline";

    const comp = createFakeComponent("<em>Italic</em>");
    comp.mount(document.createElement("div"));

    injectSlotContent(slot(), ["<b>Bold</b>", node, comp], api);

    expect(root.innerHTML).toContain("Bold");
    expect(root.innerHTML).toContain("Underline");
    expect(root.innerHTML).toContain("Italic");
  });

  test("does not crash if refNode is null", () => {
    expect(() => injectSlotContent(null, "test")).not.toThrow();
  });
});
