import { createComponent } from "../lib/reactive-core.js";

describe("Parent-Child Component Interaction", () => {
  const Parent = createComponent(
    ({ props }) => `
  <div>
    <slot></slots <!-- Will auto-map to props.children.default -->
  </div>
`
  );

  const Child = createComponent(({ props }) => `<p>Hello ${props.name}</p>`);

  Parent.mount(document.body, { children: Child({ name: "Mike!" }) });

  expect(document.body.innerHTML).toContain("<p>Hello Mike!</p>");
});

describe("Slot Content Injection", () => {
  const Parent = createComponent(({ props }) => {
    return `<div>${props.slots.content.render() || ""}</div>`;
  });

  const Child = createComponent(({ props }) => {
    return `<span>${props.slots.nested.render() || ""}</span>`;
  });

  const NestedChild = createComponent(() => {
    return `<i>Nested</i>`;
  });

  test("injects nested slots correctly", () => {
    const root = document.createElement("div");
    document.body.appendChild(root);

    Parent.mount(root, {
      slots: {
        content: Child({
          slots: {
            nested: NestedChild(),
          },
        }),
      },
    });

    expect(root.innerHTML).toContain("<span><i>Nested</i></span>");
  });
});
