// Home.js


import { createComponent } from '//unpkg.com/@magnumjs/micro-ui';

const Counter = createComponent({
  state: { count: 0 },
  render({ state }) {
    return `<button class='btn btn-primary btn-lg' type='button'>Count: <span>${state.count}</span></button>`;
  },
  on: {
    "click button"(ctx) {
      ctx.setState({ count: ctx.state.count + 1 });
    }
  }
});

// Usage:
//Counter.mount(document.getElementById('counter-demo'));

export const Home = `
  <div class="container py-5">
    <div class="row align-items-center">
      <div class="col-md-7">
        <h1 class="display-4 fw-bold mb-3">MicroUI: The Tiny, Reactive, Composable UI Library</h1>
        <p class="lead mb-4">Build modern web apps with <span class="text-primary">declarative slots</span>, <span class="text-success">keyed lists</span>, <span class="text-warning">reactive props</span>, and <span class="text-info">lifecycle actions</span>—all in a single, tiny package.</p>
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item">⚡ <b>Ultra-lightweight:</b> ~3KB gzipped</li>
          <li class="list-group-item">🔗 <b>Composable actions:</b> Functions for state, events, and effects</li>
          <li class="list-group-item">🔄 <b>Reactive state & lifecycles:</b> Automatic updates and hooks</li>
          <li class="list-group-item">🎯 <b>Declarative slots & keyed lists:</b> Intuitive, flexible rendering</li>
        </ul>
        <div class="alert alert-success mt-4">
          <b>Try it now:</b> Click the counter below to see MicroUI in action!
        </div>
      </div>
      <div class="col-md-5 text-center">
        <div id="micro-demo" class="p-4 border rounded shadow-sm bg-light">
          <h4 class="mb-3">MicroUI Counter Demo</h4>
          <div id="counter-demo"></div>
        </div>
      </div>
      <div data-comp="${Counter}"></div>
    </div>
  </div>
`;