import { createComponent } from "../lib/reactive-core";

describe("api.action", () => {
  test("returns data-action value from event target", () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const Demo = createComponent(() => `
      <button data-action="save" id="saveBtn">Save</button>
      <button data-action="delete" id="deleteBtn">Delete</button>
    `);

    Demo.mount("#app");
    const saveBtn = document.getElementById("saveBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    // Simulate event for save button
    const saveEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(saveEvent, "target", { value: saveBtn });
    expect(Demo.action(saveEvent)).toBe("save");

    // Simulate event for delete button
    const deleteEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(deleteEvent, "target", { value: deleteBtn });
    expect(Demo.action(deleteEvent)).toBe("delete");

    // Simulate event for element without data-action
    const div = document.createElement("div");
    const divEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(divEvent, "target", { value: div });
    expect(Demo.action(divEvent)).toBeNull();
  });
});