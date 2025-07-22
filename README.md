# 🧩 Micro UI - Reactive Component System
[![npm version](https://img.shields.io/npm/v/@magnumjs/micro-ui.svg)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![Build Status](https://github.com/magnumjs/micro-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/magnumjs/micro-ui/actions)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40magnumjs%2Fmicro-ui)
[![npm downloads](https://img.shields.io/npm/dw/@magnumjs/micro-ui)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/npm/@magnumjs/micro-ui/badge.svg)](https://snyk.io/test/npm/@magnumjs/micro-ui)

A minimalist reactive component library with support for state, props, named slots, refs, and DOM diffing.

## ✨ Features

- `createComponent()` with internal `state`, `setState`, and `refs`
- Props are read-only (passed in by parent)
- Declarative rendering using template strings or render functions
- Named and default slots (`<slot name="...">` and `data-slot="..."` support)
- Support for `this.refs` inside components
- Lifecycle hooks: `onMount`, `onUnmount`, `onBeforeMount`, `onBeforeUnmount`
- Diffing DOM updates for performance with `data-key="..."`
- Keyed list rendering with `renderList()` for efficient updates
- DOM caching when `render()` returns `null`
- Event binding via `on` option (e.g. `"click .btn"`)
- Full unit test coverage

## 🚀 Getting Started

```bash
npm i @magnumjs/micro-ui
```

```js
import { createComponent } from "@magnumjs/micro-ui";
```

## 🧬 Component Example

```js
const MyCard = createComponent(({ title = "", children }) => `
  <div class="card">
    <header data-slot="header">${title}</header>
    <main><slot></slot></main>
    <footer data-slot="footer">Default Footer</footer>
  </div>
`);
```

## ✅ Mounting & Updating

```js
MyCard.mount("#demo");
MyCard.update({
  children: {
    default: "<p>Hello world!</p>",
    footer: "<p>Custom footer here</p>"
  }
});
```

## 🔁 Internal State (DX)

Each component automatically has `this.state` and `this.setState`. Usage:

```js
const Counter = createComponent(function () {
  const count = this.state.count ?? 0;

  return `<button>Count: ${count}</button>`;
}, {
  onMount() {
    this.setState({ count: 0 });
  },
  on: {
    "click button"(e) {
      this.setState((s) => ({ count: s.count + 1 }));
    }
  }
});
```

## 🔌 Slots with Fallbacks

Named slots work with both `<slot name="x">` and `<div data-slot="x">`.

```js
const Card = createComponent(() => `
  <section>
    <header data-slot="title">Default Title</header>
    <main><slot></slot></main>
    <footer data-slot="footer">Default Footer</footer>
  </section>
`);
```
## 🔁 Lifecycle Hooks

```js
createComponent(
  () => "<p>Lifecycle</p>",
  {
    onBeforeMount() {
      // Called before initial mount (async supported)
    },
    onMount() {
      // Called after initial mount
    },
    onBeforeUnmount(next) {
      // Delay unmount with callback or Promise or just sync
      setTimeout(() => next(), 100);
    },
    onUnmount() {
      // Final cleanup logic
    }
  }
);
```
## 📖 [Core API Docs](./README-API.md)

## 🧩 [MicroUI Client Example](https://github.com/magnumjs/micro-ui-client)

## 🧱 API

### `createComponent(renderFn, options)`

```js
const Comp = createComponent(({ state, setState, props, refs }) => {
  return state.show ? \`
    <div data-ref="container">
      <span>${state.count}</span>
      <button data-ref="inc">+</button>
    </div>
  \` : null;
}, {
  state: { count: 0, show: true },
  on: {
    "click [data-ref='inc']": ({ setState, state }) => {
      setState({ count: state.count + 1 });
    }
  },
  onMount() {
    console.log("Mounted!");
  },
  onBeforeUnmount(cleanup) {
    console.log("Before unmount");
    cleanup();
  },
  onUnmount() {
    console.log("Unmounted!");
  }
});
```

### Instance Methods

- `Comp.mount(target)` — Mount to target container
- `Comp.update(nextProps)` — Update props and re-render
- `Comp.setState(nextState)` — Trigger state update
- `Comp.unmount()` — Cleanly unmount component

### `Comp.refs`
Auto-populated with `[data-ref="name"]` nodes after mount.

### DOM Caching on `null`
If `render()` returns `null`, the previous DOM is cached and restored if `render()` returns content again.

## 🔁 `renderList(array, renderFn, keyFn?)`

Renders keyed list efficiently:

```js
renderList(data, item => \`<li>${item.label}</li>\`, item => item.id);
```

Auto-wraps each root tag with `data-key` for DOM diffing.

## 🧪 Testing


## ✅ Example Test Case

```js
const Counter = createComponent(({ state, setState }) => {
  return \`
    <button data-ref="btn">${state.count}</button>
  \`;
}, {
  state: { count: 0 },
  on: {
    "click [data-ref='btn']": ({ state, setState }) => {
      setState({ count: state.count + 1 });
    }
  }
});
```

Mount and assert changes after click.

---

## 🤝 Contributing

Pull requests are welcome!

---

Built with ❤️ by developers who love simplicity.
