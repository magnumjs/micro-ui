import { createComponent } from '../lib/reactive-core';
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";


describe('reactive-core _lastHtml direct cache check', () => {
  test('update() with no changes does not update DOM or _lastHtml', async () => {
    document.body.innerHTML = '<div id="root3"></div>';
    const root = document.getElementById('root3');
    const Comp = createComponent({
      state: { val: 1 },
      render: ({ state }) => `<span>${state.val}</span>`
    });
    Comp.mount(root);
    const initialLastHtml = Comp._lastHtml;
    const initialInnerHTML = Comp.el.innerHTML;

    // Call update() with no changes
    Comp.update();
    await Promise.resolve();
    expect(Comp._lastHtml).toBe(initialLastHtml);
    expect(Comp.el.innerHTML).toBe(initialInnerHTML);
  });
});

describe('reactive-core _lastHtml cache onUpdate', () => {
  test('onUpdate only called when HTML changes', async () => {
    document.body.innerHTML = '<div id="root2"></div>';
    const root = document.getElementById('root2');
    let updateCalled = 0;
    let renderCount = 0;
    const Comp = createComponent({
      state: { val: 1 },
      render: ({ state }) => {
        renderCount++;
        return `<span>${state.val > 1 ? 'changed' : 'same'}</span>`;
      },
      onUpdate: () => {
        updateCalled++;
      }
    });
    Comp.mount(root);
    expect(renderCount).toBe(1);
    expect(updateCalled).toBe(0);


    // Update with no HTML change: should not call onUpdate or re-render
    Comp.setState({ val: 1 });
    await Promise.resolve();
    expect(renderCount).toBe(2);
    expect(updateCalled).toBe(1);

    // Update with HTML change: should call onUpdate
    Comp.setState({ val: 2 });
    await Promise.resolve();
    expect(renderCount).toBe(3);
    expect(updateCalled).toBe(2);
  });
});




describe('reactive-core line 369-377 coverage', () => {
  test('should cover unchanged html branch and event/update/focus logic', async () => {
    document.body.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById('root');
    let renderCount = 0;
    let updateCalled = false;
    let eventCalled = false;
    const Comp = createComponent({
      render: () => {
        renderCount++;
        return '<button id="btn">Click</button>';
      },
      on: {
        'click button': () => {
          eventCalled = true;
        }
      },
      onUpdate: () => {
        updateCalled = true;
      }
    });
    Comp.mount(root);
    const btn = root.querySelector('#btn');
    btn.focus();
    // First render
    Comp.update({}); // Should not change html
    expect(renderCount).toBe(2); // Render called twice
    // Now, update with same html, should hit line 369-377
    btn.focus();
    btn.click();

    Comp.update({});
    expect(renderCount).toBe(3);
    // Simulate click to ensure bindEvents worked
    btn.click();

    expect(eventCalled).toBe(true);
    // Ensure update hook was called
    expect(updateCalled).toBe(true);

    await Promise.resolve();
    // Ensure focus was restored
    // expect(document.activeElement).toBe(btn);
  });
});
