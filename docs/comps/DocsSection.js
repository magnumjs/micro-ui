import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';
import { escapeCode } from "../utils/escapeCode.js";

export default createComponent({
  onUpdate(){
    Prism.highlightAllUnder(this.el.querySelector('.card-body'));
  },
  render({ props }) {
    const { title, body, code } = props;

    return `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${body}</p>
          ${code ? `<pre class="line-numbers"><code class="language-js">${escapeCode(code)}</code></pre>` : ""}
        </div>
      </div>
    `;
  }
});