import { createComponent, slot } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.all.esm.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

const Message = createComponent(
  ({props}) => `Hi, ${props.name ?? ''}`
);

const Login = createComponent({
  render() {
    const [getName, setName] = slot('');
    this.handler = ({event}) => {
      event.preventDefault();
      setName(this.refs.username.value);
    };
    return `<div data-key="message">
      ${Message({name: getName(), key: 1})}
    </div>
    <form data-key="form-data" data-action-submit="handler">
      <input value="${getName()}" type="text" data-ref="username" data-action-input="handler" />
      <button data-ref="submit">Login</button>
    </form>`;
  }
});

export const LoginMessageExampleSection = createComponent(() => {
  setTimeout(() => {
    if (document.getElementById('login-message-demo')) {
      Login.mount('#login-message-demo');
    }
  }, 0);
  const codeBlock = [
    'const Message = createComponent(',
    '  ({props}) => `Hi, ${props.name ?? ""}`',
    ')',
    '',
    'const Login = createComponent({',
    '  render() {',
    "    const [getName, setName] = slot('')",
    '    this.handler = ({event}) => {',
    '      event.preventDefault()',
    '      setName(this.refs.username.value)',
    '    }',
    '    return `<div data-key=\"message\">',
    '      ${Message({name: getName(), key: 1})}',
    '    </div>',
    '    <form data-key=\"form-data\" data-action-submit=\"handler\">',
    '      <input value=\"${getName()}\" type=\"text\" data-ref=\"username\" data-action-input=\"handler\" />',
    '      <button data-ref=\"submit\">Login</button>',
    '    </form>`',
    '  }',
    '});'
  ].join('\n');
  const explanations = [
    '<b>createComponent</b>: Defines a MicroUI component. You can use either a render function or an object with lifecycle methods.',
    '<b>props</b>: Properties passed to a component instance, e.g., <code>name</code> in Message.',
    '<b>slot</b>: MicroUI hook for local state. <code>slot(\'\')</code> creates a reactive value and setter.',
    '<b>refs</b>: <code>this.refs</code> gives access to DOM elements with <code>data-ref</code> attributes.',
    '<b>Event handling</b>: <code>data-action-input</code> and <code>data-action-submit</code> wire up events to handler methods.',
    '<b>Component composition</b>: The Login component renders the Message component and passes the current name as a prop.'
  ];
  return `
    <section class="login-message-example-section" style="padding:2em;max-width:700px;margin:auto;">
      <h2>🔑 Login Message Live Example</h2>
      <div id="login-message-demo" style="margin-bottom:2em;"></div>
      <h3>MicroUI Concepts in This Example</h3>
      <ul style="text-align:left;font-size:1em;color:#444;">
        ${explanations.map(e => `<li>${e}</li>`).join('')}
      </ul>
      <h3>Code</h3>
      <pre class="line-numbers language-js"><code class="language-js">${escapeCode(codeBlock)}</code></pre>
    </section>
  `;
});
