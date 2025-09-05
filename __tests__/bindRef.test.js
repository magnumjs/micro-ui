/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("this.ref() behavior", () => {
  let component;

  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;

    const Demo = createComponent(
      () => {
        return `
        <input type="text" data-ref="input" class="input-field" name="email" />
        <button id="submitBtn">Submit</button>
      `;
      },
      {
        onMount() {
          component = this;
        },
      }
    );

    Demo.mount("#app");
  });

  test("can access element via data-ref by name", () => {
    const el = component.ref("input");
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.getAttribute("data-ref")).toBe("input");
  });

  test("can access element by full selector (e.g. .class)", () => {
    const el = component.ref(".input-field");
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.classList.contains("input-field")).toBe(true);
  });

  test("can access element by attribute selector", () => {
    const el = component.ref("[name=email]");
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.getAttribute("name")).toBe("email");
  });

  test("can access element by ID selector", () => {
    const el = component.ref("#submitBtn");
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.id).toBe("submitBtn");
  });

  // test("returns null for missing element", () => {
  //   expect(component.ref("missingRef")).toBeNull(); // valid ref name, not present
  //   expect(() => component.ref(".input-not-exist")).toThrow(/ref\(\) invalid selector/); // invalid selector, should throw
  //   expect(() => component.ref("#input-not-exist")).toThrow(/ref\(\) invalid selector/); // invalid selector, should throw
  //   expect(() => component.ref("#.input-not-exist")).toThrow(/ref\(\) invalid selector/); // invalid selector, should throw
  // });
  test("returns null and warns for invalid selector", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    expect(component.ref("missingRef")).toBeNull(); // valid ref name, not present

    component.ref(".input-not-exist");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/ref\(\) invalid selector/)
    );

    component.ref("#input-not-exist");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/ref\(\) invalid selector/)
    );

    component.ref("#.input-not-exist");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/ref\(\) invalid selector/)
    );

    warnSpy.mockRestore();
  });
});
