import { createComponent } from "../lib/reactive-core.js";
import { shared } from "../lib/compose/context.js";
import { withState } from "../lib/compose/withState.js";


describe("withState composable: multiple state slots and sibling components", () => {
  beforeEach(() => {
    shared.clear();
  });
  test("multiple withState calls in one component are independent", async () => {
    let renderCount = 0;
    let api;
    const Comp = createComponent(() => {
      renderCount++;
      if (!api) {
        api = {
          a: withState(1, "a"),
          b: withState(2, "b"),
          c: withState(3), // default key
        };
      }
      return `<span>${api.a[0]()},${api.b[0]()},${api.c[0]()}</span>`;
    });
    document.body.innerHTML = `<div id="app"></div>`;
    Comp.mount("#app");
    expect(document.querySelector("#app span").textContent).toBe("1,2,3");
    api.a[1](10);
    api.b[1](20);
    api.c[1](30);
    await Promise.resolve();
    await Promise.resolve();
    expect(document.querySelector("#app span").textContent).toBe("10,20,30");
    expect(renderCount).toBe(4);
  });

  test("sibling components have isolated state", async () => {
    let renderA = 0,
      renderB = 0;
    let apiA, apiB;
    const CompA = createComponent(() => {
      renderA++;
      if (!apiA) apiA = withState(100, "a");
      return `<span id='a'>${apiA[0]()}</span>`;
    });
    const CompB = createComponent(() => {
      renderB++;
      if (!apiB) apiB = withState(200, "b");
      return `<span id='b'>${apiB[0]()}</span>`;
    });
    document.body.innerHTML = `<div id="app1"></div><div id="app2"></div>`;
    CompA.mount("#app1");
    CompB.mount("#app2");
    expect(document.querySelector("#a").textContent).toBe("100");
    expect(document.querySelector("#b").textContent).toBe("200");
    apiA[1](111);
    apiB[1](222);
    await Promise.resolve();
    await Promise.resolve();
    expect(document.querySelector("#a").textContent).toBe("111");
    expect(document.querySelector("#b").textContent).toBe("222");
    expect(renderA).toBe(2);
    expect(renderB).toBe(2);
  });
});
