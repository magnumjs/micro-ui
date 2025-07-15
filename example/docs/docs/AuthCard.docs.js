import { AuthCard } from "../../components/AuthCard.js";
import { LoggedIn } from "../../components/LoggedIn.js";
import { LoginForm } from "../../components/LoginForm.js";
import { escapeCode } from "../utils/escapeCode.js";
import { authState } from "../utils/state.js";
export function renderAuthCardDocs() {
  const section = document.createElement("section");
  section.id = "auth-card";

  section.innerHTML = `
    <h2>🔐 AuthCard Component</h2>

    <div class="demo-box" id="auth-demo"></div>

    <div class="step">
      <h4>1. Define the Component</h4>
      <pre class="line-numbers"><code class="language-js">${escapeCode(
        AuthCard.renderFn.toString()
      )}</code></pre>
    </div>

    <div class="step">
      <h4>2. Define Child Components</h4>
      <h3>A. LoggedIn Component</h3>
      <pre class="line-numbers"><code class="language-js">${escapeCode(
        LoggedIn.renderFn.toString()
      )}</code></pre>
      
      <h3>B. LoginForm Component</h3>
      <pre class="line-numbers"><code class="language-js">${escapeCode(
        LoginForm.renderFn.toString()
      )}</code></pre>
    </div>

    <div class="step">
      <h4>3. Mount to DOM</h4>
      <pre class="line-numbers"><code class="language-js">AuthCard.mountTo('#auth-demo');</code></pre>
    </div>

    <div class="step">
      <h4>4. Update User State Reactively</h4>
      <pre class="line-numbers"><code class="language-js">
const authState = createState({ user: null });

authState.subscribe((state) => {
  AuthCard.update({
    user: state.user,
    onLogin: (name) => authState.setState({ user: { name } }),
    onLogout: () => authState.setState({ user: null }),
  });
});
      </code></pre>
    </div>
  `;

  document.getElementById("docs-root").appendChild(section);

  // Initialize reactive state for demo

  // Subscribe to update the AuthCard on state changes

  // Mount the AuthCard component into DOM
  AuthCard.mountTo("#auth-demo");

  authState.subscribe((state) => {
    AuthCard.update({
      user: state.user,
      onLogin: (name) => authState.setState({ user: { name } }),
      onLogout: () => authState.setState({ user: null }),
    });
  });
}
