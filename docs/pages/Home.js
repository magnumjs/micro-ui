// Home.js
import { createComponent } from "//unpkg.com/@magnumjs/micro-ui?module";
import { Counter } from "./examples/CounterCode.js";
import { loadSourceCode } from "../utils/loadSourceCode.js";
import { escapeCode } from "../utils/escapeCode.js";
import { TabbedContent } from "../comps/boot/TabbedContent.js";
import { Alert } from "../comps/boot/Bootstrap.js";
import { GridContainer } from "../comps/boot/GridContainer.js";
// Usage:
//Counter.mount(document.getElementById('counter-demo'));

export const Home = createComponent({
  render() {
    return GridContainer({
      containerClass: "container py-5",
      rowClass: "row",
      columns: [
        {
          className: "col-md-7",
          content: `
            <h1 class=\"display-4 fw-bold mb-3\">MicroUI: The Tiny, Reactive, Composable UI Library</h1>
            <p class=\"lead mb-4\">Build modern web apps with <span class=\"text-primary\">declarative slots</span>, <span class=\"text-success\">keyed lists</span>, <span class=\"text-warning\">reactive props</span>, and <span class=\"text-info\">lifecycle actions</span>—all in a single, tiny package.</p>
            <ul class=\"list-group list-group-flush mb-4\">
              <li class=\"list-group-item\">⚡ <b>Ultra-lightweight:</b> ~3KB gzipped</li>
              <li class=\"list-group-item\">🔗 <b>Composable actions:</b> Functions for state, events, and effects</li>
              <li class=\"list-group-item\">🔄 <b>Reactive state & lifecycles:</b> Automatic updates and hooks</li>
              <li class=\"list-group-item\">🎯 <b>Declarative slots & keyed lists:</b> Intuitive, flexible rendering</li>
            </ul>
            ${Alert({
              type: "success",
              className: "mt-4",
              message: `<b>Try it now:</b> Click the counter below to see MicroUI in action!`
            })}
          `
        },
        {
          className: "col-md-5 text-center",
          content: `
            <div id=\"micro-demo\" class=\"p-4 border rounded shadow-sm bg-light\">
              <h4 class=\"mb-3\">MicroUI Counter Demo</h4>
              ${TabbedContent({
                tabs: [
                  {
                    label: 'Demo',
                    id: 'demo',
                    content: `<div id=\"counter-demo\"><div data-comp=\"${Counter.getId()}\"></div></div>`
                  },
                  {
                    label: 'Code',
                    id: 'code',
                    content: `<pre id=\"counter-source\" class=\"line-numbers\"><code class=\"language-js\"></code></pre>`
                  }
                ],
                activeId: 'demo'
              })}
            </div>
          `
        }
      ]
    });
  },
  onMount() {
    // Mount the Counter component
    const counterContainer = this.el.querySelector("#counter-demo");
    if (counterContainer) {
      Counter.mount(counterContainer);
    }

    // Load and display Counter source code in the "Code" tab
    loadSourceCode("/pages/examples/CounterCode.js").then((src) => {
      const pre = document.querySelector("#counter-source code");
      if (pre) pre.innerHTML = escapeCode(src);

      Prism.highlightAllUnder(document.querySelector("#counter-source"));
    });
  },
});

