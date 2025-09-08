# ⚛️ MicroUI - Reactive Component Framework (RCF)

[![npm version](https://img.shields.io/npm/v/@magnumjs/micro-ui.svg)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![Build Status](https://github.com/magnumjs/micro-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/magnumjs/micro-ui/actions)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40magnumjs%2Fmicro-ui)
[![npm downloads](https://img.shields.io/npm/dw/@magnumjs/micro-ui)](https://www.npmjs.com/package/@magnumjs/micro-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/npm/@magnumjs/micro-ui/badge.svg)](https://snyk.io/test/npm/@magnumjs/micro-ui)

A tiny reactive UI library with components, state management, and DOM diffing — no build step required.

---

## ✨ Features

- ✅ Declarative component creation with `createComponent`
- ⚡ Reactive global state with `createState`
- 🧠 DOM diffing with keyed list support
- 🧩 `<slot></slot>` and named slot support
- 🔁 `renderList` with smart diffing and reordering
- 🎯 `this.refs` for easy DOM node access
- ⚙️ Lifecycle hooks: `onMount`, `onDestroy`
- 📦 Zero dependencies, no build tools

---

## 📦 Getting Started

```bash
git clone https://github.com/magnumjs/micro-ui.git
cd micro-ui
npm install
```

To start the dev server (for docs and examples):

```bash
npm start
Demo running at http://localhost:3000
```

## To consume the library as a client see this repo

[GitHub MicroUI Client](https://github.com/magnumjs/micro-ui-client) or [NPM](https://www.npmjs.com/package/@magnumjs/micro-ui)

---

## 🛠 Usage Example

Install the library

```bash
npm install @magnumjs/micro-ui
```

### Counter Component

```js
import { createComponent } from "@magnumjs/micro-ui";
import { createState } from "@magnumjs/micro-ui/utils";

const state = createState({ count: 0 });

const Counter = createComponent(
  ({ props: { count = 0 }}) => `
    <div>
      <p>Count: ${count}</p>
      <button id="decrement">-</button>
      <button id="increment">+</button>
    </div>
  `,
  {
    on: {
      "click #increment": function () {
        state.setState({ count: state.count + 1 });
      },
      "click #decrement": function () {
        state.setState({ count: state.count - 1 });
      },
    },
  }
);
```

Mount it in your app:

```js
Counter.mount("#app");

state.subscribe(({ count }) => {
  Counter.update({ count });
});
```

### Browser install

```js
<script src="//unpkg.com/@magnumjs/micro-ui?browser"></script>
```

```js
const { createComponent, createState } = MicroUI;

const Hello = createComponent(() => `<h1>Hello World</h1>`);
Hello.mount("#app");
```

[JS Bin](https://jsbin.com/zozocohuti/?output)

---

## 🧪 Testing

Jest is used for unit testing with `jsdom`:

```bash
npm test
```

Tests live under `__tests__/`.

---

## 📖 Docs

The `docs/` directory contains an auto-generated documentation UI with:

- Live interactive demos
- Prettified source code (via Prism)
- Step-by-step API breakdown

Start the docs server:

```bash
npm start
Demo running at http://localhost:3000
```

---

## 🔧 Components

- `WelcomeCard`
- `AuthCard`
- `Counter`
- `TodoList`

All can be found in [`docs/components/`](./docs/components).

---

## 🧩 Named Slots

```js
const Card = createComponent(
  ({ props: { title, children, slots = {} }}) => `
  <div class="card">
    <header>${title}</header>
    <slot>default content</slot>
    <slot name="footer">Default Footer</footer>
  </div>
`
);
```

```js
const Card = createComponent(
  ({ props: { title, children, slots = {} }}) => `
  <div class="card">
    <header>${title}</header>
    <main>${slots.default ?? children}</main>
    <footer>${slots.footer ?? ""}</footer>
  </div>
`
);
```

**Usage:**

```js
Card.update({
  title: "Hello",
  slots: {
    default: "<p>This is the main content</p>",
    footer: "<small>Footer info</small>",
  },
});
```

[JS Bin](https://jsbin.com/bisafiyaga/edit?js,output)

---

## 🔁 renderList + diffHTML

```js
import { renderList } from "@magnumjs/micro-ui";

const List = createComponent(
  ({ props: { items }}) => `
  <ul>
    ${renderList(
      items,
      (item) => `<li>${item.text}</li>`,
      (item) => item.id
    )}
  </ul>
`
);
```

When `items` change, DOM is updated in-place using keys for performance.

---

## 🔍 Using this.refs

Refs give you easy access to named DOM nodes using `data-ref="name"`.

```js
const Login = createComponent(
  () => `
  <form>
    <input type="text" data-ref="username" />
    <button data-ref="submit">Login</button>
  </form>
`,
  {
    onMount() {
      this.refs.submit.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Username:", this.refs.username.value);
      });
    },
  }
);
```

[JSBin](https://jsbin.com/jimapayahu/edit?js,output)

---

## 🧩 API

### `createComponent(templateFn, options)`

- `templateFn({props, state, setState, refs})` → HTML string
- `options.on` → event delegation map
- `options.onMount` / `onUnmount` / `onBeforeMount` / `onBeforeUnmount` → lifecycle hooks

### `createState(initialState)`

- `.getState()` → current state
- `.setState(next)` → updates state
- `.subscribe(fn)` → listen to changes

### `renderList(array, renderFn, keyFn)`

For keyed list rendering and patching.
Smart keyed list renderer. Keys are used in data-key="..." for diffing.

---

## ✨ Built-in Helpers

- `Component.mount(domElement | selector)` → mount component to a DOM node OR DOM selector
- `Component.update(newProps)` → update props and re-render
- `Component.render(newProps)` → render String for DOM
- `Component.unmount()` → remove from DOM
- `Component.renderFn` → String of Component Function
- `Component.el` → direct DOM reference
- `Component.props` → current props
- `Component.refs` → current DOmNode references
- `Component.state` → current DOmNode state

---

## 🧼 Formatting

Prism runs in the browser to auto-format code in documentation:

```js
<pre class="line-numbers">
  <code class="language-js">${escapeCode(LoggedIn.renderFn.toString())}</code>
</pre>
```

---

## 📂 Project Structure

```
example/
├── components/
│   ├── Counter.js
│   ├── AuthCard.js
│   └── ...
├── docs/
│   ├── index.html
│   ├── docs.js
│   └── generated/
│       └── *.code.html
├── app.js
lib/
├── reactive-core.js
tests/
├── counter.test.js
└── ...
```

---

## 🧠 Inspiration

Inspired by:

- Reactivity from **Vue**
- Component ergonomics from **React**
- Simplicity of **Svelte**

---

## 📜 License

MIT — Build freely, learn deeply!
