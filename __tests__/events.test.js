/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js";
import { fireEvent, screen } from "@testing-library/dom";

describe("createComponent supports both 'on' and 'events' options", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    container = null;
  });

  test("binds events using 'on'", () => {
    let clicked = false;

    const Comp = createComponent(
      () => `<button data-testid="btn">Click Me</button>`,
      {
        on: {
          "click [data-testid='btn']": () => {
            clicked = true;
          },
        },
      }
    );

    Comp.mount(container);

    fireEvent.click(screen.getByTestId("btn"));
    expect(clicked).toBe(true);
  });

  test("updates events via update({ on })", () => {
    let clicked = false;

    const Comp = createComponent(
      () => `<button data-testid="btn">Click Me</button>`
    );

    Comp.mount(container);

    Comp.update({
      on: {
        "click [data-testid='btn']": () => {
          clicked = true;
        },
      },
    });

    fireEvent.click(screen.getByTestId("btn"));
    expect(clicked).toBe(true);
  });

});
