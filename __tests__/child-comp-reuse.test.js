import { createComponent } from "../lib/reactive-core.js";

test("slot hydration should reuse same child instance (no new ids on parent updates)", () => {
  const ids = [];

  // Child that records its _id when first created/rendered
  const Child = createComponent({
    render() {

      // record id each time instance's render runs (constructor-time or render-time)
      ids.push(this._id);
      return `<div data-ref="child-input"><input /></div>`;
    },
  });

  // Parent that contains a slot placeholder, will get child instance passed via slots
  const Parent = createComponent({
    render() {
      // a slot anchor where hydrateSlots will inject the child
      return `<div><slot data-ref="child-slot" data-props=${JSON.stringify(this.props)}></slot></div>`;
    },
  });

  // Create a single child instance and place it into parent's slots (same reference)
  const childInstance = Child({}); // create instance once
  const parentInstance = Parent();

  const mount = document.createElement("div");
  document.body.appendChild(mount);

  // mount parent with the child instance as the default slot
  parentInstance.mount(mount, { slots: { default: childInstance } });

  // After the first mount, we should have one child id recorded
  expect(ids.length).toBeGreaterThanOrEqual(1);
  const firstId = ids[ids.length - 1];

  // Trigger several parent updates (simulate the "child updates props -> parent updates" loops)
  parentInstance.update({ foo: "a" });
  parentInstance.update({ foo: "b" });
  parentInstance.update({ foo: "c" });

  // After multiple updates, before the fix: the ids array may have new values (child remounted)
  // After our hydrateSlots patch, child should have been reused => no new child ids appended
  const uniqueIds = Array.from(new Set(ids));
  expect(uniqueIds.length).toBe(1); // <-- passes only after the hydrateSlots fix
  expect(uniqueIds[0]).toBe(firstId);
});


test("child component _id stays stable with keyed & non-keyed children", () => {
  const ids = [];

  const Child = createComponent({
    render({ props }) {
      ids.push(this._id);
      return `<input value="${props.value}">`;
    },
  });

  const Parent = createComponent({
    render({ props }) {
      return [
        Child({ value: props.value1 }),        // non-keyed
          Child({ value: props.value2, key: 'b' }) // keyed
      ];
    },
  });

  const container = document.createElement("div");
  Parent.mount(container, { value1: 1, value2: 10 });

  Parent.update({ value1: 2, value2: 11 });
  Parent.update({ value1: 3, value2: 12 });
  Parent.update({ value1: 4, value2: 13 });

  const uniqueIds = Array.from(new Set(ids));
  expect(uniqueIds.length).toBe(2); // one for non-keyed, one for keyed
});



// Attach a child into the parent via slots
test("hydrateSlots causes child to remount with new id", () => {

    // Minimal child
const Child = createComponent(function Child() {
  return `<input data-ref="input" />`;
});

// Parent that passes child via slots
const Parent = createComponent(function Parent(props) {
  return `
    <div>
      <slot name="body"></slot>
    </div>
  `;
});
  const parent = Parent({
    slots: {
      body: Child({})  // first child instance
    }
  });

  const root = document.createElement("div");
  parent.mount(root);

  const firstId = parent._mountedChildren[0]._id; // grab child id

  // trigger an update on parent (same slot)
  parent.update({
    slots: {
      body: Child({})  // looks same, but hydrateSlots treats as new
    }
  });

  const secondId = parent._mountedChildren[0]._id;
  // ❌ currently fails because ids differ
  expect(secondId).toBe(firstId);
});



test("child component should keep same id across parent re-renders", async () => {
  const ids = [];

  const Child = createComponent({
    render() {
      // Assign a unique id each time a new child instance is created
      if (!this.id) {
        this.id = Math.random().toString(36).slice(2);
        ids.push(this.id);
      } 
      return `<input value="x" />`;
    }
  });

  let parentApi;
  const Parent = createComponent({
    render(props) {
      return `<div><slot></slot></div>`;
    },
    onMount() {
      parentApi = this;
    }
  });

  const mount = document.createElement("div");
  Parent.mount(mount, {
    slots:  Child({key: 1232})
  });

  await Promise.resolve();


  expect(ids.length).toBe(1);

  // Force parent re-renders
  parentApi.update({ foo: "bar" });
  parentApi.update({ foo: "baz" });

  await Promise.resolve();
  // ❌ Before fix: ids.length > 1 (child recreated each render)
  // ✅ After fix: ids.length === 1 (child reused)
  expect(ids.length).toBe(1);
});

test("child input should not remount on parent re-renders", () => {
  let childMountCount = 0;

  const Child = createComponent({
    render() {
      return `<input data-ref="input" value="start" />`;
    },
    onMount() {
      childMountCount++;
    }
  });

  let parentApi;
  const Parent = createComponent({
    render(props) {
      return `<div><slot></slot></div>`;
    },
    onMount() {
      parentApi = this;
    }
  });

  const mount = document.createElement("div");
  Parent.mount(mount, {
    slots: {
      default: () => Child()
    }
  });

  expect(childMountCount).toBe(1);

  // Simulate child input updating parent
  parentApi.update({ foo: "bar" });
  parentApi.update({ foo: "baz" });

  // Before fix → childMountCount > 1 (bad: remounted each time)
  // After fix → childMountCount === 1 (good: still same child)
  expect(childMountCount).toBe(1);
});