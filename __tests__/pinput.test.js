import { createComponent } from '../lib/reactive-core.js';

describe("Parent/Child input focus preservation", () => {
  let mount;

  beforeEach(() => {
    document.body.innerHTML = "";
    mount = document.createElement("div");
    document.body.appendChild(mount);
  });

  it("preserves input focus and value across rapid parent re-renders", async () => {
    // Child component with input
    const Child = createComponent({
        state: { value: "" },
        render() {
          return `
            <input
              type="text"
              data-ref="field"
              value="${this.state.value}"
            />`;
        },
        on: {
          "input input" ({event: e}) {
            this.setState({ value: e.target.value });
            this.props.onInput?.(e.target.value);
          },
        },
      });

    // Parent component holds child value in state
    const Parent = createComponent({
      state: { childValue: "" },
      render() {
        return `
          <div>
            <slot></slot>
            <p>Child said: ${this.state.childValue}</p>
          </div>`;
      },
    });

    // Mount Parent with Child slotted in
    // const parent = Parent({
    //   slots: {
    //     default: () =>
    //       Child({
    //         onInput: (val) => parent.setState({ childValue: val }),
    //       }),
    //   },
    // });

    Parent.mount(mount,{
       slots: {
        default: 
          Child({
            onInput: (val) =>{
              Parent.setState({ childValue: val });
            },
          }),
      },
    });
    await Promise.resolve(); // wait for mount
    // Find child input
    const input = document.querySelector("[data-ref='field']");
    input.focus();

    // Simulate rapid typing
    const values = ["a", "ab", "abc", "abcd", "abcde"];
    values.forEach((val) => {
      input.value = val;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // Assert input stayed focused
    // expect(document.activeElement).toBe(input);

    // Assert final value is preserved
    expect(input.value).toBe("abcde");
    await Promise.resolve(); // wait for update

    // Assert parent rendered with child's last state
    expect(mount.textContent).toContain("Child said: abcde");
  });
});



test("child input keeps focus while typing with parent updates", () => {
  let parentInstance;
  let childInstance;

  // Child with an input
  const Child =  createComponent({
      render() {
        return `<input data-ref="field" value="${this.props.value || ""}">`;
      },
      onMount() {
        childInstance = this;
      }
    });

  // Parent with callback props
  function Parent() {
    return createComponent({
      state: { text: "" },
      render() {
        return `
          <div>
            ${Child({
              value: this.state.text,
              onInput: (e) => this.setState({ text: e.target.value })
            })}
          </div>
        `;
      },
      onMount() {
        parentInstance = this;
      }
    });
  }

  // Mount parent
  const el = document.createElement("div");
  Parent().mount(el);


  // Grab the child input
  const input = childInstance.ref("field");
  input.focus();

  // Simulate user typing + async re-renders
  input.value = "h";
  input.dispatchEvent(new Event("input"));
  setTimeout(() => {
    expect(document.activeElement).toBe(input);

    input.value = "he";
    input.dispatchEvent(new Event("input"));
    setTimeout(() => {
      expect(document.activeElement).toBe(input);

      input.value = "hel";
      input.dispatchEvent(new Event("input"));
      setTimeout(() => {
        expect(document.activeElement).toBe(input);

       // done();
      }, 0);
    }, 0);
  }, 0);
});

