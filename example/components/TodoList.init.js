import { appState } from '../state.js'; // or wherever your state is
import { TodoList } from '../components/TodoList.js';

export function initTodoList(id='#todos') {
 

function onAdd(text) {
  appState.setState((prev) => ({
    todos: [...prev.todos, { id: Date.now().toString(), text, done: false }],
  }));
}

function onToggle(id) {
  appState.setState((prev) => ({
    todos: prev.todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    ),
  }));
}

function onRemove(id) {
  appState.setState((prev) => ({
    todos: prev.todos.filter((t) => t.id !== id),
  }));
}

// Mount component to #examples container
TodoList.mountTo(id);

// Initial render with handlers
TodoList.update({
  todos: appState.get().todos,
  onAdd,
  onToggle,
  onRemove,
});

// Subscribe to state updates and update component accordingly
appState.subscribe((state) => {
  TodoList.update({ todos: state.todos });
});

    return TodoList
}
