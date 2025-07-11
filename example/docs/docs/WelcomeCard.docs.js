import { WelcomeCard } from '../../components/WelcomeCard.js';
import { escapeCode } from '../utils/escapeCode.js';

export function renderWelcomeCardDocs() {
  const section = document.createElement('section');
  section.id = 'welcome-card';

  section.innerHTML = `
    <h2>👋 WelcomeCard Component</h2>

    <div class="demo-box" id="welcome-demo"></div>

    <div class="step">
      <h4>1. Define the Component</h4>
       <pre><code class="language-js">${escapeCode(WelcomeCard.renderFn.toString())}</code></pre>
    </div>

    <div class="step">
      <h4>2. Mount to DOM</h4>
       <pre><code class="language-js">WelcomeCard.mountTo('#welcome-demo');</code></pre>
    </div>

    <div class="step">
      <h4>3. Update Reactively</h4>
       <pre><code class="language-js">WelcomeCard.update({ user: { name: 'Alice' } });</code></pre>
    </div>
  `;

  document.getElementById('docs-root').appendChild(section);
  WelcomeCard.mountTo('#welcome-demo');
  WelcomeCard.update({ user: { name: 'Alice' } });
}
