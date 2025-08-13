import { createComponent } from "../lib/reactive-core.js"; // adjust path
import { jest } from "@jest/globals";

import injectSlotContent from "../lib/injectSlotContent.js";

describe("Slot HTML tags are replaced by their component completely", () => {
  test("injectSlotContent replaces <slot> with component HTML", () => {
    // Create a slot node
    const container = document.createElement("div");
    container.innerHTML = `<div><slot name="test"></slot></div>`;
    const slotNode = container.querySelector('slot[name="test"]');

    // Create a component to inject
    const TestComponent = createComponent(() => `<span class="replaced">Hello!</span>`);
    const testInstance = TestComponent();

    // Inject the component into the slot
    injectSlotContent(slotNode, testInstance, {_mountedChildren: [] });

    // After injection, the slot should be replaced by the component's HTML
    expect(container.innerHTML).toContain('<span class="replaced">Hello!</span>');
    expect(container.querySelector('slot[name="test"]')).toBeNull();
    expect(container.querySelector('.replaced')).not.toBeNull();
  });
});

describe("dynamic slot insertion after state update", () => {
  let root;
  beforeEach(() => {
    root = document.createElement("div");
    document.body.innerHTML = "";
    document.body.appendChild(root);
  });

  it("mounts, updates state, then adds named slot dynamically", async () => {
    // Mock child component
    const ProductInfo = createComponent(() => {
     
        return `<div class="product-info">Extra details</div>`;
      
    });

    // Parent component
    const Product = createComponent(
      ({ state }) => {
        return `
          <div>
            <h1>Product Count: ${state.count}</h1>
            <slot name="product-details"></slot>
          </div>
        `;
      },
      {
        state: { count: 0 },
      }
    );

    // 1️⃣ Mount without any slots
    const product = Product();
    product.mount(root);

    expect(root.innerHTML).toContain("Product Count: 0");
    expect(root.querySelector(".product-info")).toBeNull();

    // 2️⃣ Wait a bit, then update state
    await new Promise((resolve) => setTimeout(resolve, 10));
    await product.setState({ count: 1 });

    expect(root.innerHTML).toContain("Product Count: 1");
    // expect(root.querySelector(".product-info")).toBeNull();

    // 3️⃣ Now update with slot
    product.update({
      slots: {
        "product-details": ProductInfo(),
      },
    });
    expect(root.querySelector(".product-info")).not.toBeNull();
    expect(root.innerHTML).toContain("Extra details");
  });
});
