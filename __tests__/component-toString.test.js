import { createComponent } from "../lib/reactive-core.js";


describe("componentFn.toString()", () => {
  test("returns latest rendered HTML string after mount and update", () => {
    const Comp = createComponent(function () {
      return `<div>Hello ${this.state.count}</div>`;
    }, {
      state: { count: 1 }
    });

    // Before mount, toString should be NOT empty
    expect(Comp.toString()).toBe("1");

    // Mount the component
    const container = document.createElement("div");
    Comp.mount(container);
    expect(Comp.toString()).toBe("<div>Hello 1</div>");

    // Update state and check toString again
    Comp.setState({ count: 2 });
    // Wait for microtask queue to flush
    return Promise.resolve().then(() => {
      expect(Comp.toString()).toBe("<div>Hello 2</div>");
    });
  });
  test("handles various state updates and types", async () => {
    const container = document.createElement("div");
    const comp = createComponent(function () {
      return `<span>${this.state.val}</span>`;
    }, {
      state: { val: 1 }
    });

    // Before mount, toString should be NOT empty
    expect(comp.toString()).toBe("2");

    // Mount the component
    comp.mount(container);
    expect(comp.toString()).toBe("<span>1</span>");

    // Update state and check toString again
    comp.setState({ val: 2 });
    // Wait for microtask queue to flush
    return Promise.resolve().then(() => {
      expect(comp.toString()).toBe("<span>2</span>");
    });
  });
})


describe("componentFn.toString()", () => {
  test("using data-comp attribute for child component maintains id on rerender when parent is mounted", () => {
    const Child = createComponent(function () {
      return `<span>Child</span>`;
    });
    const Parent = createComponent(function () {
      return `<div><div data-comp='${Child.getId()}'>Child</div></div>`;
    });
  // Mount the parent component
  const container = document.createElement("div");
  Parent.mount(container);
  // Check container HTML after mount
  const html = container.innerHTML;
  expect(html).toMatch(/data-comp=['"](Child|Component|[A-Za-z0-9_-]+)['"]/);
  expect(html).not.toContain('data-comp="<span');
  // After re-render, check container HTML again
  Parent();
  const html2 = container.innerHTML;
  expect(html2).toMatch(/data-comp=['"](Child|Component|[A-Za-z0-9_-]+)['"]/);
  expect(html2).not.toContain('data-comp="<span');
  Parent.unmount()
  });
});