import { renderCounterDocs } from './docs/Counter.docs.js';
import { renderWelcomeCardDocs } from './docs/WelcomeCard.docs.js';
import { renderAuthCardDocs } from './docs/AuthCard.docs.js';
import { renderTodoListDocs } from './docs/TodoList.docs.js';
import { renderRefsDocs } from './docs/renderRefsDocs.js';
import { renderCardDocs } from './docs/renderCardDocs.js';
import { renderCardWithFallbackDocs } from './docs/CardWithFallbacks.docs.js';
import { showCounterDemo, showTodoDemo } from '../examples.js';

renderCounterDocs();
renderAuthCardDocs();
renderWelcomeCardDocs();
renderTodoListDocs();
renderRefsDocs();
renderCardDocs();
renderCardWithFallbackDocs();

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('docs-root');
  document.getElementById('nav-counter')?.addEventListener('click', (e) => {
    e.preventDefault();
    showCounterDemo(root);
  });
  document.getElementById('nav-todo')?.addEventListener('click', (e) => {
    e.preventDefault();
    showTodoDemo(root);
  });
  // Add more listeners for other examples as needed
});
