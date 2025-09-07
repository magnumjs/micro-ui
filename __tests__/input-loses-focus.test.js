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
          <input data-action-input="handler" value="${this.state.name ?? ''}" />
          ${Child({ name: this.state.name ?? "" })}
        </div>`;
    }
  });

  const App = createComponent({
    render() {
      return `<div>${Input({key: 1})}</div>`;
    }
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
  });
});
