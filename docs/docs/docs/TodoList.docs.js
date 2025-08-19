import { TodoList } from '../../components/TodoList.js';
import { createState } from 'https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js';
import { escapeCode } from '../utils/escapeCode.js';

export function renderTodoListDocs() {
  const section = document.createElement('section');
  section.id = 'todo';

  section.innerHTML = `
    <h2>📝 TodoList Component</h2>

    <div class="demo-box" id="todo-demo"></div>

    <div class="step">
      <h4>1. Define the Component</h4>
      <pre class="line-numbers"><code class="language-js">${escapeCode(TodoList.renderFn.toString())}</code></pre>
    </div>

    <div class="step">
      <h4>2. Mount to DOM</h4>
      <pre class="line-numbers"><code class="language-js">TodoList.mountTo('#todo-demo');</code></pre>
    </div>

    <div class="step">
      <h4>3. Update Reactively</h4>
      <pre class="line-numbers"><code class="language-js">
const state = createState({ todos: [...] });

state.subscribe(({ todos }) => {
  TodoList.update({
    todos,
    onAdd: (text) => ...,
    onToggle: (id) => ...,
    onRemove: (id) => ...
  });
});
      </code></pre>
    </div>
  `;

  document.getElementById('docs-root').appendChild(section);

  // 🎯 Mount the actual demo logic
  const state = createState({
    todos: [
      { id: 1, text: 'Learn reactive-core', done: false },
      { id: 2, text: 'Write TodoList docs', done: false },
    ],
  });

  TodoList.mount('#todo-demo');

  state.subscribe(({ todos }) => {
    TodoList.update({
      todos,
      onToggle: (id) => {
        state.setState(({ todos }) => ({
          todos: todos.map((todo) =>
            todo.id === Number(id)
              ? { ...todo, done: !todo.done }
              : todo
          ),
        }));
      },
      onRemove: (id) => {
        state.setState(({ todos }) => ({
          todos: todos.filter((todo) => todo.id !== Number(id)),
        }));
      },
      onAdd: (text) => {
        state.setState(({ todos }) => ({
          todos: [...todos, { id: Date.now(), text, done: false }],
        }));
      },
    });
  });
}