import { createComponent } from "../lib/reactive-core.js";
/**
 * @jest-environment jsdom
 */

// ❌ Child without data-comp
const TodoItem1 = createComponent({
  render({ props }) {
    return `<li data-ref="item-${props.id}">${props.text}</li>`;
  },
});

// Parent
const TodoList1 = createComponent({
  state: { todos: [] },

  render() {
    return `
      <ul>
        ${this.state.todos.map((todo) => TodoItem1({ key: todo.id, ...todo }))}
      </ul>
    `;
  },
});

test("fails to hydrate correctly without data-comp", async () => {
  // Pretend SSR rendered HTML without data-comp
  document.body.innerHTML = `
    <ul>
      <li data-ref="item-1">First</li>
      <li data-ref="item-2">Second</li>
    </ul>
  `;

  const preHydrateFirst = document.querySelector('[data-ref="item-1"]');
  const preHydrateSecond = document.querySelector('[data-ref="item-2"]');

  // Mount component into existing UL
  const list = TodoList1();
  list.mount(document.body);

  // Trigger state update (same content as SSR)
  list.setState({
    todos: [
      { id: 1, text: "First" },
      { id: 2, text: "Second" },
    ],
  });
  await Promise.resolve();
  const postHydrateFirst = list.el.querySelector('[data-ref="item-1"]');
  const postHydrateSecond = list.el.querySelector('[data-ref="item-2"]');

  // ❌ Nodes are replaced, not reused
  expect(postHydrateFirst).not.toBe(preHydrateFirst);
  expect(postHydrateSecond).not.toBe(preHydrateSecond);

  // Content matches but DOM identity is lost
  expect(postHydrateFirst.textContent).toBe("First");
  expect(postHydrateSecond.textContent).toBe("Second");
});

// Simple child with `data-comp`
const TodoItem2 = createComponent({
  render({ props }) {
    return `<li data-comp="TodoItem" data-ref="item-${props.id}">${props.text}</li>`;
  },
});

// Parent list
const TodoList2 = createComponent({
  state: { todos: [] },

  render() {
    return `
      <ul data-comp="TodoList">
        ${this.state.todos.map((todo) => TodoItem2({ key: todo.id, ...todo }))}
      </ul>
    `;
  },
});

xtest("reuses mounted children with data-comp + data-key when reordering", async () => {
  const list = TodoList2();
  document.body.innerHTML = "";
  list.mount(document.body);

  // Initial state
  list.setState({
    todos: [
      { id: 1, text: "First" },
      { id: 2, text: "Second" },
    ],
  });
  await Promise.resolve();
  const firstItem = list.el.querySelector('[data-ref="item-1"]');
  const secondItem = list.el.querySelector('[data-ref="item-2"]');


  // Save references
  expect(firstItem.textContent).toBe("First");
  expect(secondItem.textContent).toBe("Second");

  // Reorder: [2, 1]
  list.setState({
    todos: [
      { id: 2, text: "Second" },
      { id: 1, text: "First" },
    ],
  });

  await Promise.resolve();
  const newFirst = list.el.querySelector('[data-ref="item-1"]');
  const newSecond = list.el.querySelector('[data-ref="item-2"]');

      console.log(list.el.outerHTML);

  // ✅ Same DOM nodes reused
  expect(newFirst).toEqual(firstItem);
  expect(newSecond).toBe(secondItem);

  // ✅ Correct new positions
  const lis = [...list.el.querySelectorAll("li")];
  expect(lis[0]).toBe(secondItem); // now first in order
  expect(lis[1]).toBe(firstItem); // now second in order
});

// Child with `data-comp`
const TodoItem3 = createComponent({
  render({ props }) {
    return `<li data-comp="TodoItem" data-ref="item-${props.id}">${props.text}</li>`;
  },
});

// Parent
const TodoList3 = createComponent({
  state: { todos: [] },

  render() {
    return `
      <ul data-comp="TodoList">
        ${this.state.todos.map((todo) => TodoItem3({ key: todo.id, ...todo }))}
      </ul>
    `;
  },
});

test("hydrates existing DOM using data-comp", async () => {
  // Pretend this came from SSR
  document.body.innerHTML = `
    <ul data-comp="TodoList">
      <li data-comp="TodoItem" data-ref="item-1">First</li>
      <li data-comp="TodoItem" data-ref="item-2">Second</li>
    </ul>
  `;

  // Mount component into existing DOM
  const list = TodoList3();
  list.mount(document.body.querySelector("[data-comp='TodoList']"));

  // Initialize state (same as pre-rendered HTML)
  list.setState({
    todos: [
      { id: 1, text: "First" },
      { id: 2, text: "Second" },
    ],
  });

  await Promise.resolve();
  const firstItem = list.el.querySelector('[data-ref="item-1"]');
  const secondItem = list.el.querySelector('[data-ref="item-2"]');

  // ✅ Hydration should keep original DOM nodes
  expect(firstItem.textContent).toBe("First");
  expect(secondItem.textContent).toBe("Second");

  // ✅ They should be the same nodes that existed before hydration
  const preHydrateFirst = document.querySelector('[data-ref="item-1"]');
  const preHydrateSecond = document.querySelector('[data-ref="item-2"]');

  expect(firstItem).toBe(preHydrateFirst);
  expect(secondItem).toBe(preHydrateSecond);
});
