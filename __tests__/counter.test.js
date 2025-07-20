/**
 * @jest-environment jsdom
 */
import { screen, fireEvent } from '@testing-library/dom';
import { Counter } from '../example/components/Counter.js';

describe('Counter Component', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-root"></div>';
    // container = document.getElementById('test-root');
    Counter.mountTo('#test-root');
    Counter.update({ count: 0 });
  });

  afterEach(() => {
    Counter.unmount();
    Counter.reset();
  });

  it('renders initial count', () => {
    expect(screen.getByTestId('count-display').textContent).toContain('Count: 0');
  });

  it('increments the count on + click', async () => {
    const incrementBtn = await screen.findByTestId('increment-button');
    fireEvent.click(incrementBtn);

    expect(screen.getByTestId('count-display').textContent).toContain('Count: 1');
  });

  it('decrements the count on - click', async () => {
    const decrementBtn = await screen.findByTestId('decrement-button');
    fireEvent.click(decrementBtn);

    expect(screen.getByTestId('count-display').textContent).toContain('Count: -1');
  });

  it('resets the count on reset click', async () => {
    Counter.update({ count: 5 });
    const resetBtn = await screen.findByTestId('reset-button');
    fireEvent.click(resetBtn);

    expect(screen.getByTestId('count-display').textContent).toContain('Count: 0');
  });
});
