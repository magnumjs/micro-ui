import diffHTML from '../lib/diffHTML';

describe('diffHTML keyed input node reuse', () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-root"></div>';
    container = document.getElementById('test-root');
  });

  function render(value) {
    const html = `<div data-key='parent'><input id='input' data-key='myinput' value='${value}' /><p>Echo: ${value}</p></div>`;
    diffHTML(container, html);
  }

  test('input node is reused and keeps focus after patch', async () => {
    render('');
    let input = container.querySelector('#input');
    input.focus();
    expect(document.activeElement).toBe(input);

    // Simulate input event and patch
    render('hello');
    let afterNode = container.querySelector('#input');
    // console.log('same input node after first patch?', input === afterNode);
    expect(afterNode).toBe(input);
    expect(document.activeElement).toBe(afterNode);
    expect(container.textContent).toContain('Echo: hello');

    // Simulate another input event and patch again
    render('hello1');
    let afterNode2 = container.querySelector('#input');
    // console.log('same input node after second patch?', afterNode === afterNode2);
    expect(afterNode2).toBe(afterNode);
    expect(document.activeElement).toBe(afterNode2);
    expect(container.textContent).toContain('Echo: hello1');
  });
});
