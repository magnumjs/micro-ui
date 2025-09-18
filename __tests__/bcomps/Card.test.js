import { Card } from '../../lib/bcomps/Card.js';
import { describe, expect } from '@jest/globals';

describe("Card component", () => {
  it("renders with no props", () => {
    const card = Card();
    card.mount(document.body);
    expect(document.body.innerHTML).toContain('<div class="card " style="">');
    expect(document.body.querySelector(".card-body").innerHTML).toBe("");
    card.unmount();
  });

  it("renders with className and style", () => {
    const card = Card({ className: "custom-class", style: "color:red;" });
    card.mount(document.body);
    const el = document.body.querySelector(".card");
    expect(el.classList.contains("custom-class")).toBe(true);
    expect(el.getAttribute("style")).toBe("color:red;");
    card.unmount();
  });

  it("renders with title", () => {
    const card = Card({ title: "Hello" });
    card.mount(document.body);
    expect(document.body.querySelector(".card-header").textContent).toBe("Hello");
    card.unmount();
  });

  it("renders with footer", () => {
    const card = Card({ footer: "Footer here" });
    card.mount(document.body);
    expect(document.body.querySelector(".card-footer").textContent).toBe("Footer here");
    card.unmount();
  });

  it("renders with img", () => {
    const card = Card({ img: "test.png" });
    card.mount(document.body);
    const img = document.body.querySelector("img.card-img-top");
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("test.png");
    expect(img.getAttribute("alt")).toBe("");
    card.unmount();
  });

  it("renders with body string", () => {
    const card = Card({ body: "Hello body" });
    card.mount(document.body);
    expect(document.body.querySelector(".card-body").innerHTML).toBe("Hello body");
    card.unmount();
  });

  it("renders with body as function", () => {
    const card = Card({ body: () => "<p>Dynamic body</p>" });
    card.mount(document.body);
    expect(document.body.querySelector(".card-body").innerHTML).toBe("<p>Dynamic body</p>");
    card.unmount();
  });

  it("matches full snapshot", () => {
    const card = Card({
      img: "pic.png",
      title: "Card title",
      body: () => "Body fn",
      footer: "Card footer",
      className: "extra",
      style: "border:1px solid black;",
    });
    card.mount(document.body);
    expect(document.body.innerHTML).toMatchInlineSnapshot(`
    "<div class="card extra" style="border:1px solid black;">
          <img src="pic.png" class="card-img-top" alt="">
          <div class="card-header">Card title</div>
          <div class="card-body">Body fn</div>
          <div class="card-footer">Card footer</div>
        </div>"
    `);
    card.unmount();
  });
});

