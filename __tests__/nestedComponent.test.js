import { createComponent } from "../lib/reactive-core.js";

test("Parent renders Child via slot and triggers lifecycle", () => {
  const log = [];

  const Child = createComponent(
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

  const Parent = createComponent(function () {
    return `
      <div>
        <h1>Parent</h1>
        <slot name="content"></slot>
      </div>
    `;
  });

  const root = document.createElement("div");
  document.body.appendChild(root);

  const parentInstance = Parent();
  const childInstance = Child();

  parentInstance.mount(root, {
    slots: {
      content: Child(), // ✅ wrap in function
    },
  });


  expect(root.innerHTML).toContain("Hi from Child");
  expect(log).toContain("child mounted");

  childInstance.unmount();
  expect(log).toContain("child unmounted");
});

test("Child correctly attaches refs inside slot", async () => {
  const Child = createComponent(function () {
    return `<button data-ref="btn">Click Me</button>`;
  });

  const Parent = createComponent(function () {
    return `
      <div>
        <slot name="body"></slot>
      </div>
    `;
  });

  const root = document.createElement("div");
  document.body.appendChild(root);

  const parent = Parent();
  const child = Child();

  parent.mount(root, {
    slots: {
      body: Child(), // ✅ wrap in function
    },
  });

  expect(child.ref("btn")).toBeInstanceOf(HTMLElement);
  expect(child.refs.btn.textContent).toBe("Click Me");
  expect(child.refs.btn.tagName).toBe("BUTTON");

  child.unmount();

  expect(child.ref("btn")).toBeNull();
});

test("Child correctly attaches refs inside slot", async () => {
  const Child = createComponent(function () {
    return `<button data-ref="btn">Click Me</button>`;
  });

  const Parent = createComponent(function () {
    return `
      <div>
        <slot></slot>
      </div>
    `;
  });

  const root = document.createElement("div");
  document.body.appendChild(root);

  const parent = Parent();
  const child = Child();

  parent.mount(root, {
    slots: Child(), // ✅ wrap in function
  });

  child.unmount();
  expect(child.ref("btn")).toBeNull();
});

test("Child correctly attaches refs inside slot", async () => {
  const Child = createComponent(function () {
    return `<button data-ref="btn">Click Me</button>`;
  });   

  const Parent = createComponent(function () {
    return `
      <div>
        <slot></slot>
      </div>
    `;
  });   

  const root = document.createElement("div");
  document.body.appendChild(root);

  const parent = Parent();
  const child = Child();

  parent.mount(root, {
    slots: {default: Child(),} // ✅ wrap in function
  });

  child.unmount();
  expect(child.ref("btn")).toBeNull();
  })