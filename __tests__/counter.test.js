/**
 * @jest-environment jsdom
 */
import { screen, fireEvent } from "@testing-library/dom";
import { createComponent } from "../lib/reactive-core";

const CounterFunc = ({ state }) => {
  return `
    <div class="container-fluid">
      <h2 data-testid="count-display">Count: ${state.count || 0}</h2>
      <button class='btn btn-primary btn-lg' type='button' data-testid="decrement-button">-</button>
      <button class='btn btn-primary btn-lg' type='button' data-testid="increment-button">+</button>
      <button class='btn btn-primary btn-lg' type='button' data-testid="reset-button">Reset</button>
    </div>
    `;
};

const CounterSetup = {
  state: { count: 0 },
  on: {
    "click [data-testid='increment-button']"(){
      this.setState({ count: this.state.count + 1 });
    },
    "click [data-testid='decrement-button']"(){
      this.setState({ count: this.state.count - 1 });
    },
    "click [data-testid='reset-button']"(){
      this.setState({ count: 0 });
    }
  },
};

const Counter = createComponent(CounterFunc, CounterSetup);

document.body.innerHTML = '<div id="test-root"></div>';

describe("Counter Component", () => {
  beforeEach(() => {
    Counter.mount("#test-root");
  });

  afterEach(() => {
    Counter.unmount();
    Counter.setState({ count: 0 }); // resets for next test
  });

  it("renders initial count", () => {
    expect(screen.getByTestId("count-display").textContent).toContain(
      "Count: 0"
    );
  });

  it("increments the count on + click", async () => {
    const incrementBtn = await screen.findByTestId("increment-button");
    fireEvent.click(incrementBtn);
    await Promise.resolve(); // wait for async update
    expect(screen.getByTestId("count-display").textContent).toContain(
      "Count: 1"
    );
  });

  it("decrements the count on - click", async () => {
    const decrementBtn = await screen.findByTestId("decrement-button");
    fireEvent.click(decrementBtn);
    await Promise.resolve(); // wait for async update
    expect(screen.getByTestId("count-display").textContent).toContain(
      "Count: -1"
    );
  });

  it("resets the count on reset click", async () => {
    // manually bump count before testing reset
    Counter.setState({ count: 5 });
    await Promise.resolve(); // wait for async update
    expect(screen.getByTestId("count-display").textContent).toContain(
      "Count: 5"
    );

    const resetBtn = await screen.findByTestId("reset-button");
    fireEvent.click(resetBtn);
    await Promise.resolve(); // wait for async update
    expect(screen.getByTestId("count-display").textContent).toContain(
      "Count: 0"
    );
  });
});
