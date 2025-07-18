import { createComponent } from "../lib/reactive-core";

export const Counter = createComponent(
  function ({ initial = 0 }) {
    return `<button id="increment">Count: ${this.state.count}</button>`;
  },
  {
    onMount() {
      this.setState({ count: this.props.initial });
    },
    events: {
      'click #increment': function () {
        this.setState((s) => ({ count: s.count + 1 }));
      },
    },
  }
);
