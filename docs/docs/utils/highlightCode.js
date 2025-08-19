export default function highlightCode(source) {
  return `<pre><code class="language-js">${Prism.highlight(source, Prism.languages.javascript, 'javascript')}</code></pre>`;
}