import { createComponent } from "../lib/reactive-core.js";

it("detaches and reattaches DOM without re-rendering", () => {
  const Comp = createComponent(() => `<div id="node">Hello</div>`);
  const container = document.createElement("div");
  document.body.appendChild(container);

  Comp.mount(container);
  expect(container.innerHTML).toContain("Hello");

  const cachedNode = container.querySelector("#node");
  Comp.unmount();
  expect(container.innerHTML).toBe(""); // DOM removed but cached

  Comp.mount(container);
  expect(container.querySelector("#node")).toStrictEqual(cachedNode); // same node reused
});
