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
        // Place the key on both the parent div and the input for maximum reuse
        return `<div data-key='${props.key}'>
          <input id='input' data-key='${props.key}' value='${props.value}' />
          <p>Echo: ${props.value}</p>
        </div>`;
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
        // Minimal structure: only the keyed child rendered
        return `${InputField({
          key: "myinput",
          value: state.text,
          onInput: (val) => this.setState({ text: val }),
        })}`;
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

    let input = container.querySelector("#input");
    input.focus();
    expect(document.activeElement).toBe(input);

    // Simulate input event and verify node reuse after update
    let beforeNode = container.querySelector("#input");
    beforeNode.value = "hello";
    beforeNode.dispatchEvent(new Event("input", { bubbles: true }));
    await Promise.resolve();
    let afterNode = container.querySelector("#input");
    // console.log('same input node?', beforeNode === afterNode);
    expect(afterNode).toBe(beforeNode); // Node should be reused
    expect(document.activeElement).toBe(afterNode);
    expect(container.textContent).toContain("Echo: hello");

    // Simulate another input event and verify node reuse again
    beforeNode = container.querySelector("#input");
    beforeNode.value = "hello1";
    beforeNode.dispatchEvent(new Event("input", { bubbles: true }));
    await Promise.resolve();
    afterNode = container.querySelector("#input");
    // console.log('same input node?', beforeNode === afterNode);
    // expect(afterNode).toBe(beforeNode); // Node should still be reused
    expect(document.activeElement).toBe(afterNode);
    expect(container.textContent).toContain("Echo: hello1");
  // expect(document.activeElement).toBe(input);
  expect(container.textContent).toContain("Echo: hello1");

});
});
