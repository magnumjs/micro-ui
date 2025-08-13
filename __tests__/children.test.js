import { createComponent } from "../lib/reactive-core.js";

describe("Component children as slot content", () => {
  let root;
  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);
  });
  afterEach(() => {
    Parent?.unmount?.();
    Child?.unmount?.();
    if (root) root.remove();
    document.body.innerHTML = "";
    root = null;
  });

  const Child = createComponent(({ props: {msg} }) => `<p>${msg}</p>`);
  const Parent = createComponent(
    ({ children }) => `
    <div>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  `
  );

  it("renders child component output in default slot", () => {
    Parent.mount(root);
    Parent.update({
      children:  Child({ msg: "Hello!" }),
    });
    expect(root.innerHTML).toContain("<p>Hello!</p>");
  });

  it("renders named slot with component", () => {
    const Footer = createComponent(() => `<footer>Footer Area</footer>`);
    Parent.mount(root);
    Parent.update({
      slots: {
        footer: Footer.render(),
      },
    });
    setTimeout(() => {
      expect(root.innerHTML).toContain("Footer Area");
    }, 0);
  });
});
