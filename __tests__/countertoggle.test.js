import { createComponent } from "../lib/reactive-core.js";
import { useState, useEffect } from "../lib/hooks/index.js";

test("CounterWithToggle handles refs, events, and lifecycle", async () => {
  const logs = [];

  const CounterWithToggle = createComponent({
    render() {
      const [count, setCount] = useState(0);

      const setVisible = this.props.setVisible;
      const visible = this.props.visible;
      // Events
      this.addEvent("click button[ref=btn]", () => {
        logs.push("button clicked");
        setCount((c) => c + 1);
      });
      this.addEvent("click button[ref=toggle]", () =>{
        setVisible((v) => !v);

      });

      // Effect for tracking count
      useEffect(() => {
        logs.push(`count=${count}`);
      }, [count]);
      return visible
        ? `<div>
            <button ref="btn">${count}</button>
            <button ref="toggle">Toggle</button>
          </div>`
        : null;
    },
    onMount() {
      logs.push("onMount");
    },
    onUpdate(prevProps) {
      logs.push("onUpdate");
    },
    onBeforeUnmount() {
      logs.push("onBeforeUnmount");
    },
    onUnmount() {
      logs.push("onUnmount");
    },
  });

  const ParentContainer = createComponent({
    render() {
      const [visible, setVisible] = useState(true);

      ParentContainer.setVisible = setVisible; // Expose for testing
      //   CounterWithToggle.update({ visible, setVisible });

      return `<div>
      <h1>Parent</h1>
      <slot ref="child"> ${CounterWithToggle({ visible, setVisible })} </slot>
    </div>`;
    },
  });

  ParentContainer.mount(document.body);

  // Mount
  //const container = document.createElement("div");
  //CounterWithToggle.mount(container);
  //await Promise.resolve();

  // Initial checks
  expect(document.body.querySelector("button[ref=btn]").textContent).toBe("0");
  expect(logs).toContain("onMount");
  expect(logs).toContain("count=0");

  // Click count button
  document.body.querySelector("button[ref=btn]").click();

  expect(document.body.querySelector("button[ref=btn]").textContent).toBe("1");
  expect(logs).toContain("count=1");

  // Toggle visibility (should unmount inner DOM but not destroy component instance)
  document.body.querySelector("button[ref=toggle]").click();
  await Promise.resolve();
  expect(document.body.querySelector("button[ref=toggle]")).toBeNull();
  expect(logs).toContain("onBeforeUnmount");
  expect(logs).toContain("onUnmount");

  // Toggle back (remount inner DOM)
   CounterWithToggle.update({key:1}); // triggers re-render with visible=false still?
  ParentContainer.setVisible(true); // 👈 restore slot
  await Promise.resolve();
  CounterWithToggle.update();
  expect(document.body.querySelector("button[ref=btn]").textContent).toBe("1");
});
