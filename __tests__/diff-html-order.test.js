import diffHTML from "../lib/diffHTML.js"; // path to your diffHTML

describe("Minimal DOM keyed reorder test", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test("diffHTML reorders keyed elements correctly", () => {
    container.innerHTML = `
    <div data-key="1">One</div>
    <div data-key="2">Two</div>
  `;

    const beforeNode1 = container.querySelector('[data-key="1"]');
    const beforeNode2 = container.querySelector('[data-key="2"]');

    const newHTML = `
    <div data-key="2">Two</div>
    <div data-key="1">One</div>
  `;

    diffHTML(container, newHTML);

    const afterNode1 = container.querySelector('[data-key="1"]');
    const afterNode2 = container.querySelector('[data-key="2"]');

    expect(afterNode1).toBe(beforeNode1);
    expect(afterNode2).toBe(beforeNode2);

    const keys = Array.from(container.children).map((el) => el.dataset.key);
    expect(keys).toEqual(["2", "1"]);
  });
});
