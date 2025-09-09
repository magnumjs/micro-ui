export const CounterFunc = ({ state }) => {
  return `
    <button>
        Count: ${state.count}
    </button>`;
};

export const CounterSetup = {
  state: { count: 0 },
  on: {
    "click button"(){
      this.setState({ count: this.state.count + 1 });
    },
  },
};
