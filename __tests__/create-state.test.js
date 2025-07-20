/**
 * @jest-environment jsdom
 */

import { screen } from '@testing-library/dom';
import { createState } from '../lib/reactive-core.js';
import { createComponent } from '../lib/reactive-core.js';

describe('Reactive createState and createComponent', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-root"></div>';
    container = document.getElementById('test-root');
  });

  it('reactively updates when state changes during onBeforeMount', (done) => {
    const state = createState({ count: 0 });

    const Comp = createComponent(
      () => `<p data-testid="count">Count: ${state.get().count}</p>`,
      {
        onBeforeMount() {
          state.setState((prev) => ({ count: prev.count + 1 }));
        },
      }
    );

    // Subscribe before mount to capture state change
    const cleanup = state.subscribe(() => {
      Comp.update({});
    });

    Comp.mount(container);

    // Wait for reactivity to flush
    setTimeout(() => {
      const p = screen.getByTestId('count');
      expect(p.textContent).toBe('Count: 1');
      cleanup();
      done();
    }, 0);
  });
});
