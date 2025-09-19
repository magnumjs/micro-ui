import { createComponent } from '../../lib/reactive-core.js';

import { Card } from '../../lib/bcomps/Card.js';
import { describe, expect, xdescribe } from '@jest/globals';

describe('createComponent with unique key', () => {
  test('unique props.key creates a new instance', () => {
    const cardA = Card({ key: 'a', title: 'A' });
    const cardB = Card({ key: 'b', title: 'B' });
    expect(cardA.getId()).not.toBe(cardB.getId());
  });
});

describe('Card singleton isolation', () => {
  test('each Card() call does not pollute others (singleton)', () => {
    // Mount first card
    document.body.innerHTML = '';
    const card1 = Card({ title: 'First' });
    card1.mount(document.body);
    expect(document.body.querySelector('.card-header').textContent).toBe(
      'First',
    );
    // Mount second card with different props
    document.body.innerHTML = '';
    const card2 = Card({ title: 'Second' });
    card2.mount(document.body);
    expect(document.body.querySelector('.card-header').textContent).toBe(
      'Second',
    );
    // Remount first card, should still render its own props
    document.body.innerHTML = '';
    card1.mount(document.body);
    expect(document.body.querySelector('.card-header')).toBeNull();
    // Ensure card1 and card2 are the same instance (singleton)
    expect(card1).toBe(card2);
    card1.unmount();
    card2.unmount();
  });
  test('each Card() call when using a unique key props creates a unique instance', async () => {
    // Mount first card
    document.body.innerHTML = '';
    const card1 = Card({ title: 'First', key: 'card1' });

    card1.mount(document.body);

    await Promise.resolve();
    // console.log(document.body.innerHTML);
    expect(document.body.querySelector('.card-header').textContent).toBe(
      'First',
    );
    // Mount second card with different props
    document.body.innerHTML = '';
    const card2 = Card({ title: 'Second', key: 'card2' });
    card2.mount(document.body);
    expect(document.body.querySelector('.card-header').textContent).toBe(
      'Second',
    );
    // Remount first card, should still render its own props
    document.body.innerHTML = '';
    card1.mount(document.body);
    expect(document.body.querySelector('.card-header')).toBeNull();
    // Ensure card1 and card2 are the same instance (singleton)
    expect(card1).not.toBe(card2);
    card1.unmount();
    card2.unmount();
  });
});

describe('Card child instance distinction', () => {
  test('each Card used as a child in a parent is distinct', () => {
    document.body.innerHTML = '';
    // Parent component that renders two Card children with different props
    const Parent = createComponent(() => {
      return `
                <div>
                  ${Card({ title: 'Child 1' })}
                  ${Card({ title: 'Child 2' })}
                </div>
            `;
    });

    Parent.mount(document.body);

    const headers = Array.from(document.body.querySelectorAll('.card-header'));
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toBe('Child 1');
    expect(headers[1].textContent).toBe('Child 2');
    // Ensure the two Card instances are not the same
    const cards = Array.from(document.body.querySelectorAll('.card'));
    expect(cards[0]).not.toBe(cards[1]);
    Parent.unmount();
  });
});

describe('Card component', () => {
  it('renders with no props', () => {
    const card = Card();
    card.mount(document.body);
    expect(document.body.innerHTML).toContain('<div class="card " style="">');
    expect(document.body.querySelector('.card-body').innerHTML).toBe('');
    card.unmount();
  });

  it('renders with className and style', () => {
    const card = Card({ className: 'custom-class', style: 'color:red;' });
    card.mount(document.body);
    const el = document.body.querySelector('.card');
    expect(el.classList.contains('custom-class')).toBe(true);
    expect(el.getAttribute('style')).toBe('color:red;');
    card.unmount();
  });

  it('renders with title', () => {
    const card = Card({ title: 'Hello' });
    card.mount(document.body);
    expect(document.body.querySelector('.card-header').textContent).toBe(
      'Hello',
    );
    card.unmount();
  });

  it('renders with footer', () => {
    const card = Card({ footer: 'Footer here' });
    card.mount(document.body);
    expect(document.body.querySelector('.card-footer').textContent).toBe(
      'Footer here',
    );
    card.unmount();
  });

  it('renders with img', () => {
    const card = Card({ img: 'test.png' });
    card.mount(document.body);
    const img = document.body.querySelector('img.card-img-top');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('test.png');
    expect(img.getAttribute('alt')).toBe('');
    card.unmount();
  });

  it('renders with body string', () => {
    const card = Card({ body: 'Hello body' });
    card.mount(document.body);
    expect(document.body.querySelector('.card-body').innerHTML).toBe(
      'Hello body',
    );
    card.unmount();
  });

  it('renders with body as function', () => {
    const card = Card({ body: () => '<p>Dynamic body</p>' });
    card.mount(document.body);
    expect(document.body.querySelector('.card-body').innerHTML).toBe(
      '<p>Dynamic body</p>',
    );
    card.unmount();
  });

  it('matches full snapshot', () => {
    const card = Card({
      img: 'pic.png',
      title: 'Card title',
      body: () => 'Body fn',
      footer: 'Card footer',
      className: 'extra',
      style: 'border:1px solid black;',
    });
    card.mount(document.body);
    expect(document.body.innerHTML).toMatchInlineSnapshot(`
    "<div class="card extra" style="border:1px solid black;">
          <img src="pic.png" class="card-img-top" alt="">
          <div class="card-header">Card title</div>
          <div class="card-body">Body fn</div>
          <div class="card-footer">Card footer</div>
        </div>"
    `);
    card.unmount();
  });
});
