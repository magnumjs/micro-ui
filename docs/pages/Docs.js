import { DocsSection } from "../comps/DocsSection.js";
import { TabbedContent } from "../comps/boot/TabbedContent.js";
import { escapeCode } from "../utils/escapeCode.js";

const nestingSource = escapeCode(`import { createComponent } from '@magnumjs/micro-ui';

const Child = createComponent({
  props: { label: "" },
  render({ props }) {
    return \`<span class='badge bg-info'>\${props.label}</span>\`;
  }
});

const Parent = createComponent({
  render() {
    return \`<div>Parent: \${Child({ label: "Nested" })}</div>\`;
  }
});

Parent.mount(document.getElementById('parent-demo'));
`);

const nestingDemo = `
<div id="parent-demo"></div>
<script type="module">
  import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';
  const Child = createComponent({
    props: { label: "" },
    render({ props }) {
      return \`<span class='badge bg-info'>\${props.label}</span>\`;
    }
  });
  const Parent = createComponent({
    render() {
      return \`<div>Parent: \${Child({ label: "Nested" })}</div>\`;
    }
  });
  Parent.mount(document.getElementById('parent-demo'));
</script>
`;

export const Docs = DocsSection({
  title: "Component Structure & Organization",
  body: `
    <p>MicroUI components are created using <code>createComponent</code>. Each component is an instance with its own state, props, and lifecycle.</p>
    <ul>
      <li><b>Component Instance:</b> The result of <code>createComponent</code> is a callable instance. You can mount, update, and unmount it.</li>
      <li><b>Nesting Components:</b> Call one component from another's <code>render</code> to nest them. Pass props as arguments.</li>
      <li><b>Common Practice:</b> Use keys for lists, keep state local, and use lifecycle hooks for effects.</li>
      <li><b>Calling Children:</b> <code>ChildComponent({ ...props })</code> inside a parent <code>render</code> nests and updates the child.</li>
      <li><b>Instance API:</b> See <a href="#/api-instance">Component Instance API</a> for all available methods and properties.</li>
    </ul>
    <h5 class="mt-3">Example: Nesting Components</h5>
    ${TabbedContent({
      tabs: [
        { label: "Source Code", id: "code", content: `<pre class='bg-light rounded p-3 text-start'><code>${nestingSource}</code></pre>` },
        { label: "Live Demo", id: "demo", content: nestingDemo }
      ],
      activeId: "code"
    })}
    <h5 class="mt-3">Best Practices</h5>
    <ul>
      <li>Keep state local to each component unless sharing is needed.</li>
      <li>Use <code>key</code> props for lists to optimize updates.</li>
      <li>Use lifecycle hooks (<code>onMount</code>, <code>onUpdate</code>, etc.) for effects and cleanup.</li>
      <li>Pass props explicitly to child components for clarity.</li>
      <li>Organize components in separate files for maintainability.</li>
    </ul>
  `,
  code: `// Child triggers parent update via callback
import { createComponent } from "@magnumjs/micro-ui";

const Child = createComponent({
  render({ props }) {
    return \`<button id='child-btn'>\${props.label}</button>\`;
  },
  on: {
    "click #child-btn": function () {
      if (this.props.onChildClick) this.props.onChildClick();
    }
  }
});

const Parent = createComponent({
  state: { count: 0 },
  render({ state }) {
    return \`
      <div>
        <p>Count: \${state.count}</p>
        \${Child({ label: "Increment", onChildClick: () => this.setState({ count: state.count + 1 }) })}
      </div>
    \`;
  }
});

Parent.mount(document.getElementById("parent-demo"));`
});
