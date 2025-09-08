# 📩 Micro UI - Reactive Component System

[![Docs: GitHub Pages](https://img.shields.io/badge/docs-github%20pages-blue)](https://magnumjs.github.io/micro-ui/)
[![npm version](https://img.shields.io/npm/v/@magnumjs/micro-ui.svg)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![Build Status](https://github.com/magnumjs/micro-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/magnumjs/micro-ui/actions)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40magnumjs%2Fmicro-ui)
[![npm downloads](https://img.shields.io/npm/dw/@magnumjs/micro-ui)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/npm/@magnumjs/micro-ui/badge.svg)](https://snyk.io/test/npm/@magnumjs/micro-ui)

A minimalist reactive component library with support for state, props, named slots, refs, DOM diffing, shared context, and declarative event bindings.

## ✨ Features

- `createComponent()` with internal `state`, `setState`, and `refs`
- Props are read-only (passed in by parent)
- Declarative rendering using template strings or render functions
- Named and default slots (`<slot name="...">` and `data-slot="..."` support)
- Support for `this.refs` and lazy `this.ref(name)` inside components
- Lifecycle hooks: `onMount`, `onUnmount`, `onBeforeMount`, `onBeforeUnmount`, `onUpdate`
- Diffing DOM updates for performance with `data-key="..."`
- Keyed list rendering with `renderList()` for efficient updates
- DOM caching when `render()` returns `null`
- Declarative event binding via `on` option (e.g. `"click .btn"`) and `data-action`
- Arguments support via `data-args` for cleaner templates
- Built-in `context` pub/sub with `shared()` stores
- Full unit test coverage

## 🚀 Getting Started

```bash
npm i @magnumjs/micro-ui
```

### 📄 PDF Guides

- [MicroUI Components, API, Dev .. ](docs/pdf/)

```js
import { createComponent } from "@magnumjs/micro-ui";

const ClickCounter = createComponent({
  state: {
    count: 0,
  },
  render() {
    this.handleClick = () => {
      this.setState({ count: ++this.state.count });
    };

    return `
      <button data-action-click="handleClick">
        Count: ${this.state.count}
      </button>`;
  },
});

ClickCounter.mount("#app");
```

[JSBin](https://output.jsbin.com/dodocoregi/?output)

## 🧩 Composability for Components

```js
const Parent = createComponent(
  ({ props }) => `
  <div>
    <slot></slot> <!-- Will auto-map to props.children.default -->
  </div>
`
);

const Child = createComponent(() => `<p>Hello</p>`);

Parent.mount({ children: Child });
```

[JSBin](https://jsbin.com/xopederaro/?output)

## 📡 Global Shared State with `shared()`

Create a shared state store with event-based updates:

```js
import { shared } from "@magnumjs/micro-ui/utils";

const auth = shared("auth", { user: null });

auth.subscribe(console.log); // Logs current and future state

auth.emit("login", { user: "Tova" }); // auto-merges into state
```

You can `on(event, fn)` to subscribe to specific events (e.g. `"login"`, `"logout"`).

```js
auth.on("logout", () => console.log("logged out"));
auth.emit("logout", { user: null });
```

## ⚡ Inline Actions with `data-action` and `data-args`

You can declaratively bind handlers in your template:

```js
const Demo = createComponent(
  () => `
  <button data-action="sayHello" data-args='{"name":"Tova"}'>Hi</button>
`,
  {
    on: {
      "click:sayHello"({ args }) {
        alert(`Hello, ${args[0]}!`);
      },
    },
  }
);
```

## 🧬 Component Example

```js
const MyCard = createComponent(
  ({ props: { title = "", children } }) => `
  <div class="card">
    <header data-slot="header">${title}</header>
    <main><slot></slot></main>
    <footer data-slot="footer">Default Footer</footer>
  </div>
`
);
```

## ✅ Mounting & Updating

```js
MyCard.mount("#demo");
MyCard.update({
  children: {
    default: "<p>Hello world!</p>",
    footer: "<p>Custom footer here</p>",
  },
});
```

## 🔁 Internal State (DX)

Each component automatically has `this.state` and `this.setState`. Usage:

```js
const Counter = createComponent(
  function () {
    const count = this.state.count ?? 0;

    return `<button>Count: ${count}</button>`;
  },
  {
    onMount() {
      this.setState({ count: 0 });
    },
    on: {
      "click button"(e) {
        this.setState((s) => ({ count: s.count + 1 }));
      },
    },
  }
);
```

## 🔌 Slots with Fallbacks

Named slots work with both `<slot name="x">` and `<div data-slot="x">`.

```js
const Card = createComponent(
  () => `
  <section>
    <header data-slot="title">Default Title</header>
    <main><slot></slot></main>
    <footer data-slot="footer">Default Footer</footer>
  </section>
`
);
```

## 🔁 Lifecycle Hooks

```js
createComponent(() => "<p>Lifecycle</p>", {
  onBeforeMount() {
    // Called before initial mount (async supported)
  },
  onMount() {
    // Called after initial mount
  },
  onUpdate(prevProps) {
    // Called after update render
  },
  onBeforeUnmount(next) {
    // Delay unmount with callback or Promise or just sync
    setTimeout(() => next(), 100);
  },
  onUnmount() {
    // Final cleanup logic
  },
});
```

## 📖 [Core API Docs](./README-API.md)

## 🧩 [MicroUI Client Example](https://github.com/magnumjs/micro-ui-client)

## 🧱 API

### `createComponent(renderFn, options)`

```js
// Object instance style: createComponent returns a component instance
const Comp = createComponent({
  render({ state }) {
    return state.show ? `
      <div data-ref="container">
        <span>${state.count}</span>
        <button data-ref="inc">+</button>
      </div>
    ` : null;
  },
  state: { count: 0, show: true },
  on: {
    "click [data-ref='inc']": ({ setState, state }) => {
      setState({ count: state.count + 1 });
    }
  },
  // Add lifecycle handlers directly on the instance
  onMount() {
    console.log("Mounted!");
  },
  onUpdate(prevProps) {
    console.log("Updated!");
  },
  onUnmount() {
    console.log("Unmounted!");
  }
});

// Instance can be called in literals, with toString override:
const html = `<section>${Comp({ show: true })}</section>`;

// Inline actions with data-action-event:
const Demo = createComponent({
  render() {
    return `<button data-action-click="sayHello" data-name="${}">Say Hi</button>`;
  },
  sayHello() {
    alert("Hello!");
  }
});

// Hooks: effect, state, context ..
// Compose your own hooks, e.g. useFetch
import { useEffect, useState, useContext } from "@magnumjs/micro-ui/hooks";

function useFetch(url) {
  const data = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(data.set);
  }, [url]);
  return data;
}
```

### Instance Methods

- `Comp.mount(target)` — Mount to target container
- `Comp.update(nextProps)` — Update props and re-render
- `Comp.setState(nextState)` — Trigger state update
- `Comp.unmount()` — Cleanly unmount component
- `Comp.renderFn()` — Returns the original component as String

### `Comp.el`

Auto-populated with the Parent `Node` after mount.

### `Comp.refs`

Auto-populated with `[data-ref="name"]` nodes after mount.

### `Comp.ref(name)`

Lazy accessor for a single ref. Returns null after unmount.

### `Comp.props`

Auto-populated with `props` from `Comp.update(nextProps)` before each render.

### `Comp.state`

Auto-populated with `state` after setState.

### DOM Caching on `null`

If `render()` returns `null`, the previous DOM is cached and restored if `render()` returns content again.

## 🔁 `renderList(array, renderFn, keyFn?)`

Renders keyed list efficiently:

```js
import { renderList } from "@magnumjs/micro-ui/utils";

renderList(
  data,
  (item) => `<li>${item.label}</li>`,
  (item) => item.id
);
```

Auto-wraps each root tag with `data-key` for DOM diffing.

## 🧪 Testing

## ✅ Example Test Case

```js
const Counter = createComponent(
  ({ state, setState }) => {
    return `
    <button data-ref="btn">${state.count}</button>
  `;
  },
  {
    state: { count: 0 },
    on: {
      "click [data-ref='btn']": ({ state, setState }) => {
        setState({ count: state.count + 1 });
      },
    },
  }
);
```

Mount and assert changes after click.

---

## 🤝 Contributing

Pull requests are welcome!

---

Built with ❤️ by developers who love simplicity.
