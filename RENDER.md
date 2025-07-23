### ✅ `renderComponent()` API for Micro UI Library

`renderComponent()` is a helper designed to allow **manual rendering of child components** inside a parent component's `render` function, while still respecting:

* Lifecycle hooks (`onMount`, `onBeforeUnmount`, `onUnmount`, `onUpdate`)
* `null` return handling with DOM caching
* `this.refs`, `this.setState`, and event binding

---

### 📦 Usage

```js
const Child = createComponent(function ({ state, setState }) {
  if (!state.visible) return null;
  return `<div>Hello from child!</div>`;
}, {
  state: { visible: true },
  onMount() { console.log("Child mounted"); },
  onBeforeUnmount() { console.log("Child before unmount"); },
  onUnmount() { console.log("Child unmounted"); }
});

const Parent = createComponent(function ({ state, setState }) {
  return `
    <div>
      <button data-ref="toggle">Toggle</button>
      ${renderComponent(Child, { visible: state.showChild })}
    </div>
  `;
}, {
  state: { showChild: true },
  on: {
    'click [data-ref="toggle"]'(e) {
      this.setState({ showChild: !this.state.showChild });
    },
  }
});
```

---

### ✅ Features

* Automatically tracks the child's mount/unmount state
* Reuses DOM via `null` caching (like React's fragment null behavior)
* Works even if the child was never mounted directly
* Safe to call repeatedly
* Will auto-mount on first `renderComponent` call, and re-render when props change

---

### 📌 When to Use

Use `renderComponent()` if:

* You want to conditionally show/hide child components from inside a parent
* You don’t want the parent to return `null`, but child can return `null`
* You want full lifecycle tracking for child components

---

### ⚠️ Notes

* You should **not** call `.mount()` or `.render()` manually on the child
* Props passed via `renderComponent(Component, props)` get merged with internal state
* You must still return **valid HTML** from the parent. `renderComponent()` returns a string, or `""` if null.
* This does **not interfere** with the parent component's own null return logic (caching still works there too)

---

### 🧪 Testing Example

```js
const Child = createComponent(...) // same as above
const Parent = createComponent(...)

Parent.mount(container);

// Toggle child visibility via state
Parent.setState({ showChild: false });
expect(container.textContent).not.toContain("Hello from child!");

Parent.setState({ showChild: true });
expect(container.textContent).toContain("Hello from child!");

// Child lifecycle should trigger properly
expect(lifecycleLog).toEqual([
  "Child mounted",
  "Child before unmount",
  "Child unmounted",
  "Child mounted"
]);
```

---

### ✅ DX Summary

* Keep child logic encapsulated
* No need for parent to track manual mounting
* Lifecycle-safe
* Easy to test
* `renderComponent()` is composable and nestable

---

