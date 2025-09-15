import { createComponent } from "../lib/reactive-core";

describe("input field without data-key loses focus on re-render", () => {
  const Child = createComponent(({ props }) => `<p>Hello ${props.name}</p>`);

  const Input = createComponent({
    handler({ event }) {
      this.setState({ name: event.target.value });
    },
    render() {
      return `
        <div>
          <input data-action-input="handler" value="${this.state.name ?? ""}" />
          ${Child({ name: this.state.name ?? "" })}
        </div>`;
    },
  });

  const App = createComponent({
    render() {
      return `<div>${Input({ key: 1 })}</div>`;
    },
  });

  test("input loses focus on every keystroke without data-key", async () => {
    App.mount(document.body);
    const input = document.querySelector("input");
    input.focus();
    expect(document.activeElement).toBe(input);

    // Simulate typing 'A'
    input.value = "A";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    await Promise.resolve();
    // After re-render, input should NOT be focused
    const newInput = document.querySelector("input");
    expect(document.activeElement).toBe(newInput);

    App.unmount();
  });
});

describe("ParentChildInputExample - input retains focus after parent update", () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = `<div id="test-root"></div>`;
    container = document.getElementById("test-root");
  });

  test("input keeps focus after typing and parent state update", async () => {
    // Import the example

    const InputField = createComponent({
      render({ props }) {
        return `<div><input id='input' value='${props.value}' /></div>`;
      },
      on: {
        "input #input": function ({ event: e }) {
          if (this.props.onInput) this.props.onInput(e.target.value);
        },
      },
    });

    const Parent = createComponent({
      state: { text: "" },
      render({ state }) {
        return `<div>
        <label for="input">Type something:</label>
        ${InputField({
          key: "myinput",
          value: state.text,
          onInput: (val) => this.setState({ text: val }),
        })}
        <p>Echo: ${state.text}</p>
      </div>
    `;
      },
    });

    const ParentChildInputExample = createComponent({
      render() {
        return `
      <h3>Parent-Child Controlled Input Example</h3>
      ${Parent({ })}
      <p>This demonstrates parent-child communication for controlled input.</p>
    `;
      },
    });

    ParentChildInputExample.mount(container);

    const input = container.querySelector("#input");
    input.focus();
    expect(document.activeElement).toBe(input);

    // Simulate input event
const beforeNode = container.querySelector("#input");
// console.log('placeholder HTML in parent now:', container.innerHTML);
input.value = "hello";
input.dispatchEvent(new Event("input", { bubbles: true }));
await Promise.resolve();
const afterNode = container.querySelector("#input");
// console.log('same input node?', beforeNode === afterNode);

    // After update, input should still be focused
    //input.focus();
    expect(document.activeElement).toBe(input);
    expect(container.textContent).toContain("Echo: hello");
  });
});
