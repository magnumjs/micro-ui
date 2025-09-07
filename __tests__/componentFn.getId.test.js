import { createComponent } from "../lib/reactive-core.js";

test("componentFn.getId returns the correct _id and can be used to select the component via data-comp", () => {
  const InnerComp = createComponent("inside you");
  // Create a simple component
  const MyComp = createComponent({
    render() {
      return `<span>Hello</span>
      <div data-comp='${InnerComp.getId()}'>`;
    },
  });

  // Mount the component to a div
  const div = document.createElement("div");
  MyComp.mount(div);

  // Use getId to select the component via data-comp
  const compId = InnerComp.getId();
  const selector = `[data-comp='${compId}']`;

  expect(div.querySelector(selector)).not.toBeNull();
  expect(div.querySelector(selector).outerHTML).toContain("inside you");
  expect(div.querySelector('span').outerHTML).toContain("Hello");
});
