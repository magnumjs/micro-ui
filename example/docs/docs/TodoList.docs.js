import { TodoList } from '../../components/TodoList.js';
import { createState } from '../../lib/reactive-core.js';
import { escapeCode } from '../utils/escapeCode.js';

export function renderTodoListDocs() {
  const section = document.createElement('section');
  section.id = 'todo';

  section.innerHTML = `
    <h2>✅ TodoList Component</h2>

    <div class="demo-box" id="todo-demo"></div>

    <div class="step">
      <h4>1. Define the Component</h4>
       <pre><code class="language-js">${escapeCode(TodoList.renderFn.toString())}</code></pre>
    </div>

    <div class="step">
      <h4>2. Mount to DOM</h4>
       <pre><code class="language-js">TodoList.mountTo('#todo-demo');</code></pre>
    </div>

    <div class="step">
      <h4>3. Reactively Bind State</h4>
       <pre><code class="language-js">
const state = createState({ todos: [] });

TodoList.update({
  todos: state.get().todos,
  onAdd(text) {
    const id = Date.now().toString();
    state.setState((prev) => ({
      todos: [...prev.todos, { id, text, done: false }],
    }));
  },
  onToggle(id) {
    state.setState((prev) => ({
      todos: prev.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      ),
    }));
  },
  onRemove(id) {
    state.setState((prev) => ({
      todos: prev.todos.filter((todo) => todo.id !== id),
    }));
  },
});

state.subscribe((next) => {
  TodoList.update({ todos: next.todos });
});
      </code></pre>
    </div>
  `;

  document.getElementById('docs-root').appendChild(section);

  // Mount and bind
  TodoList.mountTo('#todo-demo');

  const state = createState({ todos: [] });

  TodoList.update({
    todos: state.get().todos,
    onAdd(text) {
      const id = Date.now().toString();
      state.setState((prev) => ({
        todos: [...prev.todos, { id, text, done: false }],
      }));
    },
    onToggle(id) {
      state.setState((prev) => ({
        todos: prev.todos.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        ),
      }));
    },
    onRemove(id) {
      state.setState((prev) => ({
        todos: prev.todos.filter((todo) => todo.id !== id),
      }));
    },
  });

  state.subscribe((next) => {
    TodoList.update({ todos: next.todos });
  });
}
