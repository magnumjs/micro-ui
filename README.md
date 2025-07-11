# ⚛️ Reactive Component Framework

A minimal reactive UI framework inspired by Vue, React, and Svelte — with zero dependencies and a beautiful, built-in documentation viewer.

---

## ✨ Features

- 🔁 Reactive state management (`createState`)
- 🧩 Declarative component system (`createComponent`)
- 🎯 Event binding via selectors (`events: { 'click .btn': fn }`)
- 🧠 Lifecycle hooks (`onMount`, `onDestroy`)
- 🎛️ Reactive props with automatic re-rendering
- 🧱 Child component slots
- 🧵 DOM diffing with keyed list rendering
- 🧽 Built-in helpers to mount/unmount on demand (`mountTo`)
- 📚 Auto-generated interactive documentation with Prettier formatting

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
```

---

## 🛠 Usage Example

### Counter Component

```js
import { createComponent } from './lib/reactive-core.js';

export const Counter = createComponent(
  ({ count = 0 }) => \`
    <div>
      <p>Count: \${count}</p>
      <button id="decrement">-</button>
      <button id="increment">+</button>
    </div>
  \`,
  {
    events: {
      'click #increment': function () {
        this.update({ count: this.props.count + 1 });
      },
      'click #decrement': function () {
        this.update({ count: this.props.count - 1 });
      },
    },
  }
);
```

Mount it in your app:

```js
Counter.mountTo('#app');
Counter.update({ count: 0 });
```

---

## 🧪 Testing

Jest is used for unit testing with `jsdom`:

```bash
npm test
```

Tests live under `__tests__/`.

---

## 📖 Docs

The `example/docs/` directory contains an auto-generated documentation UI with:

- Live interactive demos
- Prettified source code (via Prettier)
- Step-by-step API breakdown

Start the docs server:

```bash
npm start
```

---

## 🔧 Components

- `WelcomeCard`
- `AuthCard`
- `Counter`
- `TodoList`

All can be found in [`example/components/`](./example/components).

---

## 🧩 API

### `createComponent(templateFn, options)`

- `templateFn(props)` → HTML string
- `options.events` → event delegation map
- `options.onMount` / `onDestroy` → lifecycle hooks

### `createState(initialState)`

- `.get()` → current state
- `.setState(next)` → updates state
- `.subscribe(fn)` → listen to changes

### `renderList(array, renderFn, keyFn)`

For keyed list rendering and patching.

---

## ✨ Built-in Helpers

- `Component.mountTo(selector)` → mount component to a DOM node
- `Component.update(newProps)` → update props and re-render
- `Component.destroy()` → remove from DOM
- `Component.el` → direct DOM reference
- `Component.props` → current props

---

## 🧼 Formatting

Prettier runs in the browser to auto-format code in documentation:

```js
import prettier from 'prettier/standalone';
import babelParser from 'prettier/parser-babel';

const formatted = prettier.format(rawCode, {
  parser: 'babel',
  plugins: [babelParser],
});
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