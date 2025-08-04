import { createComponent } from "../lib/reactive-core";
import { jest, describe, test, expect } from "@jest/globals";

describe("bindEvents colon syntax and wildcard", () => {
  test("binds event using colon syntax and wildcard", () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const clickSpy = jest.fn();
    const actionSpy = jest.fn();

    const Demo = createComponent(() => `
      <div>
        <button data-action="save" id="saveBtn">Save</button>
        <button data-action="delete" id="deleteBtn">Delete</button>
      </div>
    `, {
      on: {
        "click:save": actionSpy, // colon syntax
        "* *"(e) { clickSpy(e); } // wildcard event and target
      }
    });

    Demo.mount("#app");

    // Colon syntax: only fires for save button
    document.getElementById("saveBtn").click();
    expect(actionSpy).toHaveBeenCalledTimes(1);

    document.getElementById("deleteBtn").click();
    expect(actionSpy).toHaveBeenCalledTimes(1); // Should not fire for delete

    // Wildcard event: fires for both buttons
    document.getElementById("saveBtn").click();
    document.getElementById("deleteBtn").click();
    expect(clickSpy).toHaveBeenCalledTimes(4);
  });
});