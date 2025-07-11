// TodoList.js
import { createComponent, renderList } from '../../lib/reactive-core.js';

export const TodoList = createComponent(
  ({ todos = [], onToggle, onRemove, onAdd }) => {
    const itemsHTML = renderList(
      todos,
      (todo) => `
        <div data-key="${todo.id}" style="display:flex;align-items:center;gap:0.5rem;">
          <input type="checkbox" data-id="${todo.id}" ${todo.done ? 'checked' : ''} />
          <span style="flex:1;${todo.done ? 'text-decoration:line-through;' : ''}">${todo.text}</span>
          <button data-id="${todo.id}" class="remove">x</button>
        </div>
      `,
      (todo) => todo.id
    );

    return `
      <div>
        <h3>Todo List</h3>
        <form id="add-form" style="display:flex;gap:0.5rem;margin-bottom:1rem;">
          <input type="text" id="new-todo" placeholder="What needs to be done?" style="flex:1;" />
          <button type="submit">Add</button>
        </form>
        <div>${itemsHTML}</div>
      </div>
    `;
  },
  {
    events: {
      'click .remove': function (e) {
        const id = e.target.dataset.id;
        this.props.onRemove?.(id);
      },
      'click input[type="checkbox"]': function (e) {
        const id = e.target.dataset.id;
        this.props.onToggle?.(id);
      },
      'submit #add-form': function (e) {
        e.preventDefault();
        const input = this.el.querySelector('#new-todo');
        const text = input.value.trim();
        if (text) {
          this.props.onAdd?.(text);
          input.value = '';
        }
      },
    },
  }
);
