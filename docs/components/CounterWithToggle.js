import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

const CounterWithToggle = createComponent(function () {
  const { show } = this.state;

  if (!show) return null;

  return `<div data-ref="box">Counter is visible</div>`;
}, {
  onMount() {
    console.log("✅ Mounted");
  },
  onBeforeUnmount() {
    console.log("👋 Before unmount");
  },
  onUnmount() {
    console.log("🧼 Unmounted");
  },
});

// Example usage:
const app = document.getElementById("app");
CounterWithToggle.mount(app);

// Initial state
CounterWithToggle.setState({ show: true });

// After 2 seconds, unmount
setTimeout(() => {
  CounterWithToggle.setState({ show: false });
}, 2000);

// After 4 seconds, remount
setTimeout(() => {
  CounterWithToggle.setState({ show: true });
}, 4000);
