import { createComponent } from "../lib/reactive-core.js";
import { jest } from "@jest/globals";

describe("data-slot attribute support", () => {
  it("replaces data-slot with named content", () => {
    const root = document.createElement("div");

    // Parent component with data-slot attributes
    const Parent = createComponent(
      () => `
      <section>
        <header data-slot="title">Default Title</header>
        <div><p>Body</p></div>
        <footer data-slot="footer">Default Footer</footer>
      </section>
    `
    );

    // Mount with slot content for "title" and "footer"
    Parent.mount(root, {
      slots: {
        title: "Hello World",
        footer: "<span>Custom Footer</span>",
      },
    });

    expect(root.innerHTML).toContain("Hello World");
    expect(root.innerHTML).not.toContain("Default Title");
    expect(root.innerHTML).toContain("<span>Custom Footer</span>");
    expect(root.innerHTML).not.toContain("Default Footer");
  });

  it("uses fallback content if no slot is passed", () => {
    const root = document.createElement("div");

    const Parent = createComponent(
      () => `
      <section>
        <header data-slot="title">Default Title</header>
        <div><p>Body</p></div>
        <footer data-slot="footer">Default Footer</footer>
      </section>
    `
    );

    // Mount without any slots
    Parent.mount(root, {});

    expect(root.innerHTML).toContain("Default Title");
    expect(root.innerHTML).toContain("Default Footer");
  });
});

describe("dynamic slots object/function support", () => {
  it("dynamically renders slot content on each update using slots as a function", () => {
    const root = document.createElement("div");

    // Dynamic slot function: returns different content based on props
    const Parent = createComponent(
      function () {
        return `
          <section>
            <header data-slot="title">Default Title</header>
            <main data-slot="main">Default Main</main>
          </section>
        `;
      },
      {
        slots(props) {
          const out = {};
          if (props.title) out.title = `<h1>${props.title}</h1>`;
          if (props.body) out.main = `<p>${props.body}</p>`;
          return out;
        },
      }
    );

    // Initial mount with no props
    Parent.mount(root, {});
    expect(root.innerHTML).toContain("Default Title");
    expect(root.innerHTML).toContain("Default Main");

    // Update with new props, slots function should re-run
    Parent.update({ title: "Dynamic Title", body: "Dynamic body" });
    expect(root.innerHTML).toContain("<h1>Dynamic Title</h1>");
    expect(root.innerHTML).toContain("<p>Dynamic body</p>");
    expect(root.innerHTML).not.toContain("Default Title");
    expect(root.innerHTML).not.toContain("Default Main");

    // Update again with different props
    Parent.update({ title: "Another Title", body: "Another body" });
    expect(root.innerHTML).toContain("<h1>Another Title</h1>");
    expect(root.innerHTML).toContain("<p>Another body</p>");
  });

  it("supports slots as a static object", () => {
    const root = document.createElement("div");

    const Parent = createComponent(
      () => `
        <section>
          <header data-slot="title">Default Title</header>
        </section>
      `,
      {
        slots: {
          title: "<h1>Static Title</h1>",
        },
      }
    );

    Parent.mount(root, {});
    expect(root.innerHTML).toContain("<h1>Static Title</h1>");
    expect(root.innerHTML).not.toContain("Default Title");
  });
});

describe("dynamic slots function is called on state change", () => {
  it("calls slots.product-details with new info when state changes", async () => {
    const root = document.createElement("div");

    // Mock Product component
    const Product = jest.fn(
      ({ props }) => `<div class="product">Product: ${props.name}</div>`
    );

    // Parent with dynamic slot for product-details
    const Parent = createComponent(
      function () {
        return `
          <section>
            <div data-slot="product-details"></div>
            <button data-action="next">Next</button>
          </section>
        `;
      },
      {
        state: { step: 1 },
        slots(props) {
          // Only provide product-details slot
          return {
            "product-details": () =>
              Product({ props: { name: `Product ${this.state.step}` } }),
          };
        },
        on: {
          "click [data-action='next']"(e) {
            this.setState({ step: this.state.step + 1 });
          },
        },
      }
    );

    // Mount and check initial render
    Parent.mount(root, {});
    expect(root.innerHTML).toContain("Product: Product 1");
    expect(Product).toHaveBeenCalledWith({ props: { name: "Product 1" } });

    // Simulate state change (step increment)
    root.querySelector("[data-action='next']").click();
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async updates
    // The slot function should be called again with updated props
    expect(root.innerHTML).toContain("Product: Product 2");
    expect(Product).toHaveBeenCalledWith({ props: { name: "Product 2" } });
  });
});

describe("slots object/function edge cases", () => {
  it("renders string slot content", () => {
    const root = document.createElement("div");
    const Parent = createComponent(
      () => `<div data-slot="foo">Fallback</div>`,
      {
        slots: { foo: "Bar" },
      }
    );
    Parent.mount(root, {});
    expect(root.innerHTML).toContain("Bar");
    expect(root.innerHTML).not.toContain("Fallback");
  });

  it("renders slot as undefined (uses fallback)", () => {
    const root = document.createElement("div");
    const Parent = createComponent(
      () => `<div data-slot="foo">Fallback</div>`,
      {
        slots: { foo: undefined },
      }
    );
    Parent.mount(root, {});
    expect(root.innerHTML).toContain("");
  });

  it("renders slot as undefined (uses fallback)", () => {
    const root = document.createElement("div");
    const Parent = createComponent(
      () => `<div data-slot="foo">Fallback</div>`,
      {
        slots: { foo: null },
      }
    );
    Parent.mount(root, {});
    expect(root.innerHTML).toContain("Fallback");
  });
  it("renders slot as null (removes slot node)", () => {
    const root = document.createElement("div");
    const Parent = createComponent(
      () => `<div data-slot="foo">Fallback</div>`,
      {
        slots: { foo: "" },
      }
    );
    Parent.mount(root, {});
    // Should remove the slot node entirely
    expect(root.innerHTML).not.toContain("Fallback");
    expect(root.innerHTML).not.toContain("data-slot");
  });

  it("renders slot as an array of strings", () => {
    const root = document.createElement("div");
    const Parent = createComponent(
      () => `<div data-slot="foo">Fallback</div>`,
      {
        slots: { foo: ["A", "B", "C"].join("") },
      }
    );
    Parent.mount(root, {});
    expect(root.innerHTML).toContain("ABC");
    expect(root.innerHTML).not.toContain("Fallback");
  });

  it("renders slot as an array of nodes", () => {
    const root = document.createElement("div");
    const Parent = createComponent(
      () => `<div data-slot="foo">Fallback</div>`,
      {
        slots: {
          foo: ["<span>One</span>", "<span>Two</span>"].join(""),
        },
      }
    );
    Parent.mount(root, {});
    expect(root.innerHTML).toContain("One");
    expect(root.innerHTML).toContain("Two");
    expect(root.innerHTML).not.toContain("Fallback");
  });

  it("toggles slot between string and null", async () => {
    const root = document.createElement("div");
    document.body.appendChild(root);
    const Parent = createComponent(
      function () {
        return `<div data-slot="foo">Fallback</div>`;
      },
      {
        state: { show: true },
        slots(props) {
          return {
            foo: props.show ? "<b>Visible</b>" : "",
          };
        },
      }
    );

    Parent.mount(root, { show: true });
    expect(root.innerHTML).toContain("Visible");
    Parent.update({ show: false });
    expect(root.innerHTML).not.toContain("Visible");
    expect(root.innerHTML).not.toContain("Fallback");
    Parent.update({ show: true });
    expect(root.innerHTML).toContain("Visible");
  });
});
