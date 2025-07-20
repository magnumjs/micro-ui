# 🧩 Micro UI - Reactive Component System
[![npm version](https://img.shields.io/npm/v/@magnumjs/micro-ui.svg)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![Build Status](https://github.com/magnumjs/micro-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/magnumjs/micro-ui/actions)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40magnumjs%2Fmicro-ui)
[![npm downloads](https://img.shields.io/npm/dw/@magnumjs/micro-ui)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/npm/@magnumjs/micro-ui/badge.svg)](https://snyk.io/test/npm/@magnumjs/micro-ui)

A minimalist reactive component library with support for state, props, named slots, refs, and DOM diffing.

## ✨ Features

- Reactive `state` and `setState` per component
- Props are read-only (passed in by parent)
- Named and default slots (`<slot name="...">` and `data-slot="..."` support)
- Support for `this.refs` inside components
- Lifecycle hooks: `onBeforeMount`, `onMount`, `onBeforeUnmount`, `onUnmount`
- Diffing DOM updates for performance with `data-key="..."`
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
MyCard.mountTo("#demo");
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
  events: {
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

## 🧪 Testing

Run all tests with coverage:

```bash
npm test
```

Check coverage in HTML:

```bash
open coverage/index.html
```

## 📁 Folder Structure

- `lib/` – core rendering engine
- `components/` – reusable UI components
- `example/` – live demos and docs
- `__tests__/` – Jest unit tests


---

## 🤝 Contributing

Pull requests are welcome!

---

Built with ❤️ by developers who love simplicity.
