import { describe, it, expect } from "@jest/globals";
import { Outlet } from "../lib/outlet.js"; // wherever you put the helper

describe("Outlet helper", () => {
  it("replaces unnamed <slot> with string children", () => {
    const html = "<div><slot></slot></div>";
    const props = { children: "Hello world" };
    const output = Outlet(html, props);
    expect(output).toBe("<div>Hello world</div>");
  });

  it("replaces unnamed <slot> with children.default", () => {
    const html = "<div><slot></slot></div>";
    const props = { children: { default: "<p>From default</p>" } };
    const output = Outlet(html, props);
    expect(output).toBe("<div><p>From default</p></div>");
  });

  it("replaces unnamed <slot> with fallback if no children", () => {
    const html = "<div><slot>No user yet</slot></div>";
    const props = {};
    const output = Outlet(html, props);
    expect(output).toBe("<div>No user yet</div>");
  });

  it("replaces named <slot name='footer'> with children.footer", () => {
    const html = '<footer><slot name="footer">Fallback</slot></footer>';
    const props = { children: { footer: "<p>Custom Footer</p>" } };
    const output = Outlet(html, props);
    expect(output).toBe("<footer><p>Custom Footer</p></footer>");
  });

  it("uses props.slots if children doesn't have the named slot", () => {
    const html = '<aside><slot name="sidebar">Empty</slot></aside>';
    const props = { slots: { sidebar: "<div>Sidebar content</div>" } };
    const output = Outlet(html, props);
    expect(output).toBe("<aside><div>Sidebar content</div></aside>");
  });

  it("uses fallback if named slot is missing in both children and slots", () => {
    const html = '<header><slot name="top">Default Top</slot></header>';
    const props = {};
    const output = Outlet(html, props);
    expect(output).toBe("<header>Default Top</header>");
  });

  it("works when fallback has multiple lines (multi-line fallback)", () => {
    const html = `
      <section>
        <slot name="main">
          <p>Loading...</p>
        </slot>
      </section>
    `;
    const props = {};
    const output = Outlet(html, props);
    expect(output).toContain("<p>Loading...</p>");
  });
  it("returns original HTML if no slots are present", () => {
    const html = "<div>No slots here</div>";
    const props = {};
    const output = Outlet(html, props);
    expect(output).toBe(html);
  });
  it("handles empty HTML input gracefully", () => {
    const html = "";
    const props = {};
    const output = Outlet(html, props);
    expect(output).toBe("");
  });
  it("handles HTML with no slots", () => {
    const html = "<div>Just some content</div>";
    const props = {};
    const output = Outlet(html, props);
    expect(output).toBe(html);

    expect(Outlet('<slot name="test">Default Fallback</slot>', {})).toContain(
      "Default Fallback"
    );
  });
  it("returns empty string if no HTML and no props", () => {
    const output = Outlet();
    expect(output).toBe("");
  });
  it("returns empty string if HTML is null", () => {
    const output = Outlet(null);
    expect(output).toBe("");

    expect(Outlet("<div>No slot here</div>", {})).toContain("No slot");
    expect(Outlet("<div><slot></slot></div>", {})).toContain("<div></div>");

    expect(
      Outlet('<slot>Default Fallback</slot>', {
        slots: { default: "Provided Values" },
      })
    ).toContain("Provided Values");

    expect(
      Outlet('<slot>Default Fallback</slot>', {
        slots: { },
      })
    ).toContain("Default Fallback");
  });
});
