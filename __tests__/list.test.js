import { createComponent } from "../lib/reactive-core";
import { renderList } from "../lib/utils/";

describe("renderList utility", () => {
  test("adds data-key attribute to each rendered item (covers line 358)", () => {
    const items = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
      { id: 3, name: "C" },
    ];
    const html = renderList(
      items,
      (item) => `<div>${item.name}</div>`,
      (item) => item.id
    );
    // Each div should have a data-key attribute
    expect(html).toContain('data-key="1"');
    expect(html).toContain('data-key="2"');
    expect(html).toContain('data-key="3"');
    expect(html).toContain("<div data-key=\"1\">A</div>");
    expect(html).toContain("<div data-key=\"2\">B</div>");
    expect(html).toContain("<div data-key=\"3\">C</div>");
  });
  test("adds data-key attribute to each rendered item (covers line 358)", () => {
    const items = [
      { key: 1, name: "A" },
      { key: 2, name: "B" },
      { key: 3, name: "C" },
    ];
    const html = renderList(
      items,
      (item) => `<div>${item.name}</div>`,
      (item) => item.key
    );
    // Each div should have a data-key attribute
    expect(html).toContain('data-key="1"');
    expect(html).toContain('data-key="2"');
    expect(html).toContain('data-key="3"');
    expect(html).toContain("<div data-key=\"1\">A</div>");
    expect(html).toContain("<div data-key=\"2\">B</div>");
    expect(html).toContain("<div data-key=\"3\">C</div>");
  });
});