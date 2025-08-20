import { createComponent } from "../lib/reactive-core.js";
import { shared } from "../lib/compose/context.js";
import { withState } from "../lib/compose/withState.js";

describe("withState composable: shared and local state across multiple components", () => {
  beforeEach(() => {
    shared.clear();
    document.body.innerHTML = "";
  });

  test("multiple components share state with key", async () => {
    let renderA = 0,
      renderB = 0;
    let apiA, apiB;
    const CompA = createComponent(
      () => {
        renderA++;
        apiA = withState(0, "count");
        return `<button id='a'>CountA: ${apiA[0]()}</button>`;
      },
      {
        on: {
          "click #a"() {
            apiA[1]((c) => c + 1);
          },
        },
      }
    );
    const CompB = createComponent(
      () => {
        renderB++;
        apiB = withState(0, "count");
        return `<button id='b'>CountB: ${apiB[0]()}</button>`;
      },
      {
        on: {
          "click #b"() {
            apiB[1]((c) => c + 1);
          },
        },
      }
    );
    document.body.innerHTML = `<div id='appA'></div><div id='appB'></div>`;
    CompA.mount("#appA");
    CompB.mount("#appB");
    expect(document.querySelector("#a").textContent).toBe("CountA: 0");
    expect(document.querySelector("#b").textContent).toBe("CountB: 0");
    // Simulate click on A
    document.querySelector("#a").click();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.querySelector("#a").textContent).toBe("CountA: 1");
    expect(document.querySelector("#b").textContent).toBe("CountB: 1");
    // Simulate click on B
    document.querySelector("#b").click();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.querySelector("#a").textContent).toBe("CountA: 2");
    expect(document.querySelector("#b").textContent).toBe("CountB: 2");
  });

  test("multiple components have isolated state without key", async () => {
    let renderA = 0,
      renderB = 0;
    let apiA, apiB;
    const CompA = createComponent(
      () => {
        renderA++;
        apiA = withState(0);
        return `<button id='a'>CountA: ${apiA[0]()}</button>`;
      },
      {
        on: {
          "click #a"() {
            apiA[1]((c) => c + 1);
          },
        },
      }
    );
    const CompB = createComponent(
      () => {
        renderB++;
        apiB = withState(0);
        return `<button id='b'>CountB: ${apiB[0]()}</button>`;
      },
      {
        on: {
          "click #b"() {
            apiB[1]((c) => c + 1);
          },
        },
      }
    );
    document.body.innerHTML = `<div id='appA'></div><div id='appB'></div>`;
    CompA.mount("#appA");
    CompB.mount("#appB");
    expect(document.querySelector("#a").textContent).toBe("CountA: 0");
    expect(document.querySelector("#b").textContent).toBe("CountB: 0");
    // Simulate click on A
    document.querySelector("#a").click();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.querySelector("#a").textContent).toBe("CountA: 1");
    expect(document.querySelector("#b").textContent).toBe("CountB: 0");
    // Simulate click on B
    document.querySelector("#b").click();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.querySelector("#a").textContent).toBe("CountA: 1");
    expect(document.querySelector("#b").textContent).toBe("CountB: 1");
  });
});
