import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { TodoList } from "../TodoList.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

const codeExample = `import { TodoList } from './TodoList.js';

const todos = [
  { id: 1, text: 'Learn micro-ui', done: false },
  { id: 2, text: 'Build a TodoList', done: false }
];

function onAdd(text) {
  todos.push({ id: Date.now(), text, done: false });
  TodoList.update({ todos });
}
function onToggle(id) {
  const todo = todos.find(t => t.id == id);
  if (todo) todo.done = !todo.done;
  TodoList.update({ todos });
}
function onRemove(id) {
  const idx = todos.findIndex(t => t.id == id);
  if (idx > -1) todos.splice(idx, 1);
  TodoList.update({ todos });
}

TodoList.mount('#todo-demo', { todos, onAdd, onToggle, onRemove });`;


const codeExample2 = `import { createComponent, renderList } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const TodoList = createComponent(
  ({ props:{todos = [], onToggle, onRemove, onAdd} }) => {
    const items = renderList(
      todos,
      (todo) => \`
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <input type="checkbox" data-id="\${todo.id}" \${todo.done ? 'checked' : ''} />
          <span style="flex:1;\${todo.done ? 'text-decoration:line-through;' : ''}">\${todo.text}</span>
          <button class="remove" data-id="\${todo.id}">❌</button>
        </div>
      \`,
      (todo) => todo.id
    );

    return \`
      <div>
        <h3>✅ Todo List</h3>
        <form id="add-form" style="display:flex;gap:0.5rem;">
          <input id="new-todo" placeholder="What needs to be done?" />
          <button>Add</button>
        </form>
        <div>\${items}</div>
      </div>
    \`;
  },
  {
    on: {
      'submit #add-form': function ({event}) {
        event.preventDefault();
        const input = this.el.querySelector('#new-todo');
        const text = input.value.trim();
        if (text) {
          this.props.onAdd?.(text);
          input.value = '';
        }
      },
      'click .remove': function ({event}) {
        const id = event.target.dataset.id;
        this.props.onRemove?.(id);
      },
      'click input[type="checkbox"]': function ({event}) {
        const id = event.target.dataset.id;
        this.props.onToggle?.(id);
      },
    },
  }
);`;

export const TodoListExampleSection = createComponent(() => `
  <section class="todo-example-section">
    <h2>TodoList Live Example</h2>
    <div id="todo-demo"></div>
    <h3>Code Example</h3>
    <pre class="line-numbers"><code class="language-js">
${escapeCode(codeExample)}</code></pre>
   

<h3>Component Code</h3>
    <pre class="line-numbers"><code class="language-js">
${escapeCode(codeExample2)}</code></pre>
    <p>Add, check, and remove todos. All state is managed in plain JS!</p>
  </section>
`, {
  onMount: () => {
    // Simple demo state
    const todos = [
      { id: 1, text: 'Learn micro-ui', done: false },
      { id: 2, text: 'Build a TodoList', done: false }
    ];
    function onAdd(text) {
      todos.push({ id: Date.now(), text, done: false });
      TodoList.update({ todos });
    }
    function onToggle(id) {
      const todo = todos.find(t => t.id == id);
      if (todo) todo.done = !todo.done;
      TodoList.update({ todos });
    }
    function onRemove(id) {
      const idx = todos.findIndex(t => t.id == id);
      if (idx > -1) todos.splice(idx, 1);
      TodoList.update({ todos });
    }
    TodoList.mount('#todo-demo', { todos, onAdd, onToggle, onRemove });
  }
});
