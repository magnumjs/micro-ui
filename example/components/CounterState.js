import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const Counter = createComponent(
  function ({ props: {initial = 0 }}) {
    return `<button id="increment">Count: ${this.state.count ?? initial}</button>`;
  },
  {
    onMount() {
      this.setState({ count: this.props.initial });
    },
    on: {
      'click #increment': function () {
        this.setState((s) => ({ count: s.count + 1 }));
      },
    },
  }
);
