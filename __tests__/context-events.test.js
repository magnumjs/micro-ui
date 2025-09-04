import { createComponent } from "../lib/reactive-core.js";
import { useEmits } from "../lib/hooks/useEmits.js";

describe("context-based events (::channel)", () => {
  let Toolbar, Content, rootToolbar, rootContent;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="toolbar"></div>
      <div id="content"></div>
      <div id="runtime"></div>
    `;

    Toolbar = createComponent({
      render() {
        useEmits()
        return `
          <div>
            <button data-action="light">Light</button>
            <button data-action="dark">Dark</button>
          </div>
        `;
      },
      on: {
        "click [data-action]": function ({event}) {
          this.emitGlobal("theme::change", event.target.dataset.action);
        },
      },
    });

    Content = createComponent({
      state: { theme: "light" },
      render({ state }) {
        useEmits()
        return `<div class="content ${state.theme}">Theme: ${state.theme}</div>`;
      },
      on: {
        "theme::change": function (theme) {
          this.setState({ theme });
        },
      },
    });

    Toolbar.mount("#toolbar");
    Content.mount("#content");

    rootToolbar = document.querySelector("#toolbar");
    rootContent = document.querySelector("#content");
  });

  test("initial render", () => {
    expect(rootContent.innerHTML).toContain("Theme: light");
  });

  test("clicking 'dark' button broadcasts event",  async () => {
    rootToolbar.querySelector("[data-action=dark]").click();
    await Promise.resolve();
    expect(rootContent.innerHTML).toContain("Theme: dark");
  });

  test("clicking 'light' button broadcasts event",  async () => {
    rootToolbar.querySelector("[data-action=light]").click();
    await Promise.resolve();
    expect(rootContent.innerHTML).toContain("Theme: light");
  });

  test("multiple subscribers respond",  async () => {
    const ExtraContent = createComponent({
      state: { theme: "light" },
      render({ state }) {
        useEmits()
        return `<p>${state.theme}</p>`;
      },
      on: {
        "theme::change": function (theme) {
          this.setState({ theme });
        },
      },
    });

    document.body.innerHTML += `<div id="extra"></div>`;
    ExtraContent.mount("#extra");

    rootToolbar.querySelector("[data-action=dark]").click();
    await Promise.resolve();
    expect(rootContent.innerHTML).toContain("Theme: dark");
    expect(document.querySelector("#extra").innerHTML).toContain("dark");
  });

  test("unmounting stops listening", async () => {
    Content.unmount();
    rootToolbar.querySelector("[data-action=dark]").click();
    await Promise.resolve();

    // Content should no longer update
    expect(rootContent.innerHTML).not.toContain("Theme: light");
  });

  test("runtime subscription with onEmitGlobal", async () => {
    let runtimeTheme = "light";

    const RuntimeComponent = createComponent({
      render() {
        useEmits()
        return `<div>Runtime theme: ${runtimeTheme}</div>`;
      },
      onMount() {
        this.onEmitGlobal("theme::change", (theme) => {
          runtimeTheme = theme;
          this.update(); // force rerender
        });
      },
    });

    RuntimeComponent.mount("#runtime");

    // Trigger change
    rootToolbar.querySelector("[data-action=dark]").click();
    await Promise.resolve();
    expect(document.querySelector("#runtime").innerHTML).toContain("Runtime theme: dark");

    // Trigger another change
    rootToolbar.querySelector("[data-action=light]").click();
    await Promise.resolve();
    expect(document.querySelector("#runtime").innerHTML).toContain("Runtime theme: light");
  });
});
