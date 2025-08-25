import { createComponent } from "../lib/reactive-core.js";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("Lifecycle Hooks: onBeforeMount and onBeforeUnmount", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  test("onBeforeMount with next callback delays mount", (done) => {
    const logs = [];

    const Comp = createComponent(() => `<p>Hello</p>`, {
      onBeforeMount(next) {
        logs.push("before-mount start");
        setTimeout(() => {
          logs.push("before-mount done");
          next();
        }, 100);
      },
      onMount() {
        logs.push("mounted");
        expect(container.innerHTML).toContain("Hello");
        expect(logs).toEqual([
          "before-mount start",
          "before-mount done",
          "mounted",
        ]);
        done();
      },
    });

    Comp.mount(container);
  });
  test("onBeforeMount with sync callback mounts immediately", () => {
    const logs = [];

    const Comp = createComponent(() => `<p>Hello</p>`, {
      onBeforeMount() {
        logs.push("before-mount");
      },
      onMount() {
        logs.push("mounted");
        expect(container.innerHTML).toContain("Hello");
        expect(logs).toEqual(["before-mount", "mounted"]);
      },
    });

    Comp.mount(container);
  });
  test("onBeforeUnmount with sync callback unmounts immediately", () => {
    const logs = [];

    const Comp = createComponent(() => `<p>Goodbye</p>`, {
      onBeforeUnmount() {
        logs.push("before-unmount");
      },
      onUnmount() {
        logs.push("destroyed");
        expect(container.innerHTML).toBe("");
        expect(logs).toEqual(["before-unmount", "destroyed"]);
      },
    });

    Comp.mount(container);
    Comp.unmount(); // triggers onBeforeUnmount and onUnmount
  });

  test("onBeforeUnmount with next callback delays unmount", (done) => {
    const logs = [];

    const Comp = createComponent(() => `<p>Bye</p>`, {
      onBeforeUnmount(next) {
        logs.push("before-unmount start");
        setTimeout(() => {
          logs.push("before-unmount done");
          next();
        }, 100);
      },
      onUnmount() {
        logs.push("destroyed");
        expect(container.innerHTML).toBe("");
        expect(logs).toEqual([
          "before-unmount start",
          "before-unmount done",
          "destroyed",
        ]);
        done();
      },
    });

    Comp.mount(container);
    Comp.unmount(); // triggers async onBeforeUnmount
  });

  test("onBeforeMount as promise works", async () => {
    const Comp = createComponent(() => `<div>Test</div>`, {
      onBeforeMount: () =>
        new Promise((resolve) => {
          setTimeout(resolve, 50);
        }),
    });

    const spy = jest.spyOn(Comp, "_render");

    Comp.mount(container);

    await new Promise((r) => setTimeout(r, 70));
    expect(container.innerHTML).toContain("Test");
    expect(spy).toHaveBeenCalled();
  });

  test("onBeforeUnmount as promise works", (done) => {
    const Comp = createComponent(() => `<div>Test</div>`, {
      onBeforeUnmount: () =>
        new Promise((resolve) => {
          setTimeout(resolve, 50);
        }),
      onUnmount() {
        expect(container.innerHTML).toBe("");
        done();
      },
    });

    Comp.mount(container);
    Comp.unmount(); // triggers async onBeforeUnmount
  });

  test("onBeforeMount proceeds synchronously", (done) => {
    let proceedCalled = false;

    const Comp = createComponent(() => `<div>Checking...</div>`, {
      onBeforeMount(proceed) {
        proceedCalled = true;
        proceed();
      },
      onMount() {
        expect(proceedCalled).toBe(true);
        done();
      },
    });

    Comp.mount(document.body);
  });

  test("skips mount if onBeforeMount does not call proceed", () => {
    const Comp = createComponent(() => `<div>Should not render</div>`, {
      onBeforeMount(next) {
        // no proceed
      },
    });

    Comp.mount(document.body);

    expect(document.body.innerHTML).not.toContain("Should not render");
  });


test("onUnmount error is caught and logged", () => {
  const logs = [];
  const error = new Error("Unmount error");
  const originalConsoleError = console.error;
  console.error = (e) => logs.push(e);

  const Comp = createComponent(() => `<div>Unmount error</div>`, {
    onUnmount() {
      throw error;
    },
  });

  Comp.mount(document.body);
  Comp.unmount();

  expect(logs).toContain(error);

  console.error = originalConsoleError; // restore
});

});
