import { createComponent } from "//unpkg.com/@magnumjs/micro-ui";

export default createComponent({
  state: {
    code: `<h3>Hello Micro-UI + Bootstrap!</h3>`
  },

  render({ state }) {
    return `
      <div class="card mb-4">
        <div class="card-header">Live Code Editor</div>
        <div class="card-body">
          <textarea id="live-edit" class="form-control mb-3" rows="5" data-ref="editor">${state.code}</textarea>
          <div class="border p-3 bg-light" data-ref="preview">${state.code}</div>
        </div>
      </div>
    `;
  },

  onMount() {
    const editor = this.ref("editor");

    // Live update
    editor.addEventListener("input", (e) => {
      this.setState({ code: e.target.value });
    });
  }
});