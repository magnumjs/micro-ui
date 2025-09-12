import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';

export const CounterFunc = ({ state }) => {
  return `
    <div class="container-fluid">
      <h2 data-testid="count-display">Count: ${state.count || 0}</h2>
      <button class='btn btn-primary btn-lg' type='button' data-testid="decrement-button">-</button>
      <button class='btn btn-primary btn-lg' type='button' data-testid="increment-button">+</button>
      <button class='btn btn-primary btn-lg' type='button' data-testid="reset-button">Reset</button>
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

export const Counter = createComponent(CounterFunc, CounterSetup);

