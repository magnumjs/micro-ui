import { createComponent } from "../lib/reactive-core.js";

describe("data-slot attribute support", () => {
  let root;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("replaces data-slot with named content", () => {
    const Card = createComponent(() => `
      <section>
        <header data-slot="title">Default Title</header>
        <div><slot></slot></div>
        <footer data-slot="footer">Default Footer</footer>
      </section>
    `);

    Card.mount(root);
    Card.update({
      children: {
        title: "<h1>Hello World</h1>",
        footer: "<p>Goodbye</p>",
        default: "<p>Body</p>",
      },
    });

    expect(root.innerHTML).toContain("Hello World");
    expect(root.innerHTML).toContain("Body");
    expect(root.innerHTML).toContain("Goodbye");
  });

  it("uses fallback content if no slot is passed", () => {
    const Box = createComponent(() => `
      <div>
        <footer data-slot="footer">Fallback Footer</footer>
      </div>
    `);

    Box.mount(root);
    Box.update(); // no children

    expect(root.innerHTML).toContain("Fallback Footer");
  });
});
