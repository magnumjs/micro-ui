import { createComponent } from "../lib/reactive-core.js";

describe("hydrateActions", () => {
  it("binds methods from api.on when declared with data-action-*", async () => {
    const Comp = createComponent({
      render() {
        return `
          <button data-action-click="save">Save</button>
        `;
      },
      on: {
        save(e) {
          this.setState({ called: true });
        },
      },
      state: { called: false },
    });

    const el = document.createElement("div");
    Comp.mount(el);

    // simulate click
    el.querySelector("button").click();

    await Promise.resolve();
    expect(Comp.state.called).toBe(true);
  });

  it("binds instance methods when on is not defined", async () => {
    const Comp = createComponent({
      render() {
        return `
          <button data-action-click="submit">Submit</button>
        `;
      },
      submit() {
        this.setState({ called: true });
      },
      state: { called: false },
    });

    const el = document.createElement("div");
    Comp.mount(el);

    el.querySelector("button").click();
    await Promise.resolve();
    expect(Comp.state.called).toBe(true);
  });

  it("prefers explicit api.on[eventType:action] over generic action", () => {
    const Comp = createComponent({
      render() {
        return `
          <button data-action-click="doSomething">Do it</button>
        `;
      },
      on: {
        "click:doSomething"(e) {
          this.setState({ which: "explicit" });
        },
        doSomething(e) {
          this.setState({ which: "generic" });
        },
      },
      state: { which: null },
    });

    const el = document.createElement("div");
    Comp.mount(el);

    el.querySelector("button").click();

    expect(Comp.state.which).toBe("explicit");
  });

  it("does nothing if element has invalid action name", () => {
    const Comp = createComponent({
      render() {
        return `
          <button data-action-click="">Broken</button>
        `;
      },
      state: { called: false },
    });

    const el = document.createElement("div");
    Comp.mount(el);

    el.querySelector("button").click();

    expect(Comp.state.called).toBe(false);
  });
});
