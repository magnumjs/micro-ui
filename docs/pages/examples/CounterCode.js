export const CounterFunc = ({ state }) => {
  return `
    <div>
      <p data-testid="count-display">Count: ${state.count || 0}</p>
      <button data-testid="decrement-button">-</button>
      <button data-testid="increment-button">+</button>
      <button data-testid="reset-button">Reset</button>
    </div>
    `;
};

export const CounterSetup = {
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
