import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';
import { escapeCode } from "../utils/escapeCode.js";
import { Card } from "//unpkg.com/@magnumjs/micro-ui/esmall";
import { loadSourceCode } from "../utils/loadSourceCode.js";

export const DocsSection = createComponent({
  onUpdate() {
    Prism.highlightAllUnder(this.el.querySelector('.card-body'));
  },
  render({ props }) {
    const { title, body, code } = props;
    return Card({
      className: "mb-4",
      title,
      body: () => `
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${body}</p>
        ${code ? `<pre id="source" class="line-numbers"><code class="language-js">${escapeCode(code)}</code></pre>` : ""}
      `
    });
  },
  onMount() {
    if(this.props.codeUrl)
     loadSourceCode(this.props.codeUrl).then((src) => {
       this.update({ code: src });
      });
  },
});