import { createComponent, renderList } from '../lib/reactive-core.js';

export const TodoList = createComponent(
  ({ props:{todos = [], onToggle, onRemove, onAdd} }) => {
    const items = renderList(
      todos,
      (todo) => `
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <input type="checkbox" data-id="${todo.id}" ${todo.done ? 'checked' : ''} />
          <span style="flex:1;${todo.done ? 'text-decoration:line-through;' : ''}">${todo.text}</span>
          <button class="remove" data-id="${todo.id}">❌</button>
        </div>
      `,
      (todo) => todo.id
    );

    return `
      <div>
        <h3>✅ Todo List</h3>
        <form id="add-form" style="display:flex;gap:0.5rem;">
          <input id="new-todo" placeholder="What needs to be done?" />
          <button>Add</button>
        </form>
        <div>${items}</div>
      </div>
    `;
  },
  {
    on: {
      'submit #add-form': function ({event}) {
        console.log(event)
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
);
