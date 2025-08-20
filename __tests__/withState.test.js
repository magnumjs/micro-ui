import { withState } from "../lib/compose/withState.js";

describe("withState composable", () => {
  test("local state: getter and setter", () => {
    const [get, set] = withState(1);
    expect(get()).toBe(1);
    set(2);
    expect(get()).toBe(2);
    set(x => x + 3);
    expect(get()).toBe(5);
  });

  test("shared state: getter and setter", () => {
    const [getA, setA] = withState(10, "sharedKey");
    const [getB, setB] = withState(0, "sharedKey");
    expect(getA()).toBe(10); // initial value
    setA(20);
    expect(getB()).toBe(20); // shared value
    setB(x => x + 5);
    expect(getA()).toBe(25);
  });
});
