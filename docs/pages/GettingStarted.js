// GettingStarted.js
import { TabbedContent } from "../comps/boot/TabbedContent.js";
import { createComponent } from "//unpkg.com/@magnumjs/micro-ui?module";
import { escapeCode } from "../utils/escapeCode.js";
import { DocsSection } from "../comps/DocsSection.js";

const codeExample = `
import { createComponent } from '@magnumjs/micro-ui';

// Define a simple Counter component
const Counter = createComponent({
  state: { count: 0 }, // Initial state
  render({ state, setState }) {
    // Define an increment method for the button
    this.increment = () => setState({ count: ++state.count });
    // The render function returns HTML for the component
    return \`<button class="btn btn-primary" data-action-click="increment">Count: \${state.count}</button>\`;
  }
});

// Mount the Counter to a DOM element
Counter.mount(document.getElementById('counter-demo'));
`;

const annotatedCode = `
import { createComponent } from '@magnumjs/micro-ui'; // Import MicroUI

// Define a simple Counter component
const Counter = createComponent({
  state: { count: 0 }, // Initial state for the counter
  render({ state, setState }) {
  // Define an increment method for the button
  this.increment = () => setState({ count: ++state.count });
  // The render function returns HTML for the component
  return \`<button class="btn btn-primary" data-action-click="increment">Count: \${state.count}</button>\`;
  // When clicked, the increment method updates the count
  }
});

// Mount the Counter to a DOM element with id 'counter-demo'
Counter.mount(document.getElementById('counter-demo'));
`;

const liveDemo = `
<div id="counter-demo"></div>
<script type="module">
  import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';
  const Counter = createComponent({
    state: { count: 0 },
    render({ state, setState }) {
      this.increment = () => setState({ count: ++state.count });
      return \`<button class='btn btn-primary' data-action-click="increment">Count: \${state.count}</button>\`;
    }
  });
  Counter.mount(document.getElementById('counter-demo'));
</script>
`;

export const GettingStarted = createComponent({
  render() {
    return `
      <h2>Getting Started</h2>
      <p>Install MicroUI:</p>
      <pre><code>npm install @magnumjs/micro-ui</code></pre>
      ${TabbedContent({
        tabs: [
          {
            label: "Full Code",
            id: "code",
            content: DocsSection({
              title: "Full Example",
              body: "A complete MicroUI Counter component implementation.",
              code: codeExample
            })
          },
          {
            label: "Step-by-Step",
            id: "annotated",
            content: DocsSection({
              title: "Step-by-Step",
              body: "Annotated breakdown of the Counter component, showing each part and its purpose.",
              code: annotatedCode
            })
          },
          { label: "Live Demo", id: "demo", content: liveDemo }
        ],
        activeId: "code"
      })}
    `;
  }
});
