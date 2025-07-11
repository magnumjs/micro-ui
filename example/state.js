import { createState } from '../../lib/reactive-core.js';

export const appState = createState({
    user: null,
    count: 0,
  todos: [
    { id: '1', text: 'Learn JS', done: false },
    { id: '2', text: 'Build Stuff', done: true },
  ],
});