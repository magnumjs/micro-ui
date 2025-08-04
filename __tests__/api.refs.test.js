import { createComponent } from "../lib/reactive-core";

describe("api.refs Proxy", () => {
  test("refs Proxy returns correct element via api.ref", () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const Demo = createComponent(() => `
      <div>
        <input data-ref="input" />
        <button data-ref="btn"></button>
      </div>
    `);

    Demo.mount("#app");
    expect(Demo.refs.input).toBeInstanceOf(HTMLElement);
    expect(Demo.refs.input.tagName).toBe("INPUT");
    expect(Demo.refs.btn.tagName).toBe("BUTTON");
    // Should return null for missing ref
    expect(Demo.refs.missing).toBeNull();
  });
});