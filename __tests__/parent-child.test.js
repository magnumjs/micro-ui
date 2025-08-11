import { createComponent } from "../lib/reactive-core";

describe("Nested Component with Slot", () => {
  let root;
  let Child;
  let Parent;
  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);

    Child = createComponent(
      function () {
        return `<p data-ref="msg">Hi from Child</p>`;
      },
      {
        onMount() {
          console.log("Child mounted");
        },
        onUnmount() {
          console.log("Child unmounted");
        },
      }
    );

    Parent = createComponent(function () {
      return `
                <div>
                    <h1>Parent</h1>
                    <slot name="content"></slot>
                </div>
            `;
    });
  });
  afterEach(() => {
    Child?.unmount?.();
    Parent?.unmount?.();
    if (root) root.remove();
    document.body.innerHTML = "";
    root = null;
  });
  test("Parent mounts Child", () => {
    Parent.mount(root, {
      slots: {
        content: Child(), // ✅ wrap in function
      },
    });
    expect(root.innerHTML).toContain("Hi from Child");
    expect(root.innerHTML).toContain("Parent");
    expect(root.innerHTML).toContain("h1");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
  });
  test("Child unmounts correctly", () => {
    const log = [];
    Child = createComponent(
      function () {
        return `<p data-ref="msg">Hi from Child</p>`;
      },
      {
        onMount() {
          log.push("child mounted");
        },
        onUnmount() {
          log.push("child unmounted");
        },
      }
    );

    Parent.mount(root, {
      slots: {
        content: Child(), // ✅ wrap in function
      },
    });

    expect(log).toContain("child mounted");

    Child.unmount();
    expect(log).toContain("child unmounted");
  });
  test("Parent unmounts Child", () => {
    Parent.mount(root, {
      slots: {
        content: Child(), // ✅ wrap in function
      },
    });
    expect(root.innerHTML).toContain("Hi from Child");
    expect(root.innerHTML).toContain("Parent");
    expect(root.innerHTML).toContain("h1");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
    expect(root.innerHTML).toContain("Child");
    expect(root.innerHTML).toContain("p");
    expect(root.innerHTML).toContain("data-ref");
    expect(root.innerHTML).toContain("msg");
  });
  test("Parent unmounts Child and cleans up refs", () => {
    const Parent = createComponent(
      ({ props }) => `
  <div>
    <slot></slot> <!-- Will auto-map to props.children.default -->
  </div>
`);

    const Child = createComponent(() => `<p>Hello</p>`);

    Parent.mount(document.body, { children: Child() });
    expect(document.body.innerHTML).toContain("<p>Hello</p>");
    

    Parent.unmount();
    expect(document.body.innerHTML).not.toContain("<p>Hello</p>");

    console.log("document.body.innerHTML", document.body.innerHTML);

    Parent.mount(document.body, { children: Child });
    expect(document.body.innerHTML).toContain("<p>Hello</p>");

    Parent.unmount();
    expect(document.body.innerHTML).not.toContain("<p>Hello</p>");


    Parent.mount(document.body, { children: Child });
    expect(document.body.innerHTML).toContain("<p>Hello</p>");
    Parent.unmount();
    expect(document.body.innerHTML).not.toContain("<p>Hello</p>");
  });
  test("Child correctly attaches refs inside slot", () => {
    Child = createComponent(function () {
      return `<button data-ref="btn">Click Me</button>`;
    });

    Parent.mount(root, {
      slots: {
        content: Child(),
      },
    });

    const btn = root.querySelector("[data-ref='btn']");
    console.log("root", root.innerHTML);
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe("Click Me");
  });
  test("Child correctly attaches refs inside slot with multiple elements", () => {
    Child = createComponent(function () {
      return `
                <div>
                    <button data-ref="btn1">Button 1</button>
                    <button data-ref="btn2">Button 2</button>
                </div>
            `;
    });

    Parent.mount(root, {
      slots: {
        content: Child(),
      },
    });

    const btn1 = root.querySelector("[data-ref='btn1']");
    const btn2 = root.querySelector("[data-ref='btn2']");
    expect(btn1).not.toBeNull();
    expect(btn2).not.toBeNull();
    expect(btn1.textContent).toBe("Button 1");
    expect(btn2.textContent).toBe("Button 2");
  });
  test("Child correctly attaches refs inside slot with nested components", () => {
    const NestedChild = createComponent(function () {
      return `<span data-ref="nested">Nested Child</span>`;
    });

    Child = createComponent(function () {
      return `<div><slot name="nested"></slot></div>`;
    });

    Parent.mount(root, {
      slots: {
        content: Child({
          slots: {
            nested: NestedChild(),
          },
        }),
      },
    });

    const nestedEl = root.querySelector("[data-ref='nested']");
    expect(nestedEl).not.toBeNull();
    expect(nestedEl.textContent).toBe("Nested Child");
  });
  test("Child correctly attaches refs inside slot with multiple nested components", () => {
    const NestedChild = createComponent(function () {
      return `<span data-ref="nested">Nested Child</span>`;
    });

    Child = createComponent(function () {
      return `<div><slot name="nested"></slot></div>`;
    });

    Parent.mount(root, {
      slots: {
        content: Child({
          slots: {
            nested: NestedChild(),
          },
        }),
      },
    });

    const nestedEl = root.querySelector("[data-ref='nested']");
    console.log("nestedEl", root.innerHTML);
    expect(nestedEl).not.toBeNull();
    expect(nestedEl.textContent).toBe("Nested Child");
  });
});
