import { TodoList } from "./TodoList.js";
import { createState } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui-context.esm.js";

const state = createState({
  todos: [
    { id: 1, text: "Learn reactive-core", done: false },
    { id: 2, text: "Write a TodoList", done: false },
  ],
});

// Static handlers (not part of state)
const handlers = {
  onToggle: (id) => {
    state.setState(({ todos }) => ({
      todos: todos.map((todo) =>
        todo.id === Number(id) ? { ...todo, done: !todo.done } : todo
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
};

export function initTodoList(selector) {
  TodoList.mount("#todo-demo");

  // Subscribe only to update `todos`, and merge in static handlers
  state.subscribe(({ todos }) => {
    TodoList.update({
      todos,
      ...handlers,
    });
  });
}
