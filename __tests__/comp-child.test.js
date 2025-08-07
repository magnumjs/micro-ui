import { createComponent } from "../lib/reactive-core.js"; // adjust path as needed

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));



test("renders component instance into named slot", () => {
  const Child = createComponent(() => `<aside>Sidebar Component</aside>`);

  const Parent = createComponent(() => `
    <div>
      <div data-ref="sidebar"></div>
    </div>
  `);

  const el = document.createElement("div");
  Parent.mount(el, {
    slots: {
      sidebar: Child(),
    },
  });

  expect(el.querySelector("aside")?.textContent).toBe("Sidebar Component");
});


test("renders props.children as default slot", () => {
  const Child = createComponent(() => `<p>I'm the child</p>`);

  const Parent = createComponent(() => `
    <main>
      <div data-ref="children"></div>
    </main>
  `);

  const el = document.createElement("div");
  Parent.mount(el, {
    children: Child(),
  });

  expect(el.querySelector("p")?.textContent).toBe("I'm the child");
});