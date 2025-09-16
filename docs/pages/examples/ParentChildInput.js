import { createComponent } from "//unpkg.com/@magnumjs/micro-ui?module";
import { DocsSection } from "../../comps/DocsSection.js";

const InputField = createComponent({
  render({ props }) {
    return `<input id='input' value='${props.value}' />`;
  },
  on: {
    "input #input": function ({event : e}) {
      if (this.props.onInput) this.props.onInput(e.target.value);
    }
  }
});


const Parent = createComponent({
  state: { text: "" },
  render({ state }) {
    return `
      <div>
        <label>Type something:</label>
         ${InputField({ key: "myinput", value: state.text, onInput: (val) => this.setState({ text: val }) })}
        <p>Echo: ${state.text}</p>
      </div>
    `;
  }
});
const ParentChildInputExample = createComponent({
  render() {
    return `
      <h3>Parent-Child Controlled Input Example</h3>
      ${Parent({key: "myinputcontainer"})}
      <p>This demonstrates parent-child communication for controlled input.</p>
      ${DocsSection({
        title: "Controlled Input Pattern",
        body: "Parent passes value and handler to child input; child updates parent state.",
        codeUrl: `./pages/examples/ParentChildInput.js`
      })}
    `;
  },
});



export { ParentChildInputExample };
