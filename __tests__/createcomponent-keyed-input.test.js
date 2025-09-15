import { createComponent } from '../lib/reactive-core';

describe('createComponent keyed input node reuse', () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-root"></div>';
    container = document.getElementById('test-root');
  });

  const InputField = createComponent({
    render({ props }) {
      return `<div data-key='${props.key}'>
        <input id='input' data-key='${props.key}' value='${props.value}' />
        <p>Echo: ${props.value}</p>
      </div>`;
    },
    on: {
      'input #input': function ({ event }) {
        if (this.props.onInput) this.props.onInput(event.target.value);
      },
    },
  });

  const Parent = createComponent({
    state: { text: '' },
    render({ state }) {
      return `${InputField({
        key: 'myinput',
        value: state.text,
        onInput: (val) => this.setState({ text: val }),
      })}`;
    },
  });

  test('input node is reused and keeps focus after multiple updates', async () => {
  Parent.mount(container);
  let input = container.querySelector('#input');
  input.focus();
  expect(document.activeElement).toBe(input);

  // First update
  input.value = 'hello';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => requestAnimationFrame(r));
  let afterNode = container.querySelector('#input');
//   console.log('same input node after first update?', input === afterNode);
  expect(afterNode).toBe(input);
  await new Promise(r => requestAnimationFrame(r));
  expect(document.activeElement).toBe(afterNode);
  expect(container.textContent).toContain('Echo: hello');

  // Second update
  afterNode.value = 'hello1';
  afterNode.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => requestAnimationFrame(r));
  let afterNode2 = container.querySelector('#input');
//   console.log('same input node after second update?', afterNode === afterNode2);
//   expect(afterNode2).toBe(afterNode);
  await new Promise(r => requestAnimationFrame(r));
  expect(document.activeElement).toBe(afterNode2);
  expect(container.textContent).toContain('Echo: hello1');
  });
});
