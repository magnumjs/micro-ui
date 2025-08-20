import { createComponent } from "../lib/reactive-core.js";
import { withState } from "../lib/compose/withState.js";

describe("withState composable integration with component", () => {
  function useCounter(initial = 0) {
    const [getCount, setCount] = withState(initial);
    return { getCount, setCount };
  }

  test("component re-renders on state update", async () => {
    let renderCount = 0;
    let counterApi;
    const Counter = createComponent(() => {
      renderCount++;
      if (!counterApi) counterApi = useCounter(0); // Only initialize once
      return `<span>${counterApi.getCount()}</span>`;
    });
    document.body.innerHTML = `<div id="app"></div>`;
    Counter.mount("#app");
    expect(document.querySelector("#app span").textContent).toBe("0");
    expect(renderCount).toBe(1);
    counterApi.setCount(5);
    await Promise.resolve();
    console.log('after set to 5', document.body.innerHTML);
    expect(document.querySelector("#app span").textContent).toBe("5");
    expect(renderCount).toBe(2);
    counterApi.setCount(x => x + 1);
    await Promise.resolve();
    expect(document.querySelector("#app span").textContent).toBe("6");
    expect(renderCount).toBe(3);
  });
});
