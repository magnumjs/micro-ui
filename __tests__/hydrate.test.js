import {createComponent} from "../lib/reactive-core.js";
import { jest } from "@jest/globals";
/**
 * @jest-environment jsdom
 */


describe('Parent component with named & default slots', () => {
  let log;
  beforeEach(() => {
    log = [];

  });

  afterEach(() => {
  });

  it('renders, updates, and toggles slots correctly', async () => {
    const Button = createComponent(() => {
      log.push('Button render');
      return `<button>Say Hello!</button>`;
    });

    const Child = createComponent(() => {
      return `<div>Child like</div>`;
    });

    const Parent = createComponent(({ state }) => {
      log.push('render', state.show);
      return `
        <div>
          <slot name="button">defaults...</slot>
          ${state.show ? `<slot>defaults</slot>` : `Loaded`}
        </div>
      `;
    }, {
      state: { show: false },
      on: {
        "click button"() {
          log.push('clicked');
          this.setState({ show: !this.state.show });
        }
      },
      onUpdate() {
        log.push('updated');
      },
      onMount() {
        log.push('mounted');
        this.setState({ show: true });
      }
    });

    // Mount with slots
    Parent.mount(document.body, {
      slots: {
        button: Button,
        default: Child
      }
    });

    // Initial render
    expect(document.body.innerHTML).toContain('Say Hello!');
    expect(document.body.innerHTML).toContain('Loaded');

    await new Promise(resolve => setTimeout(resolve, 0));

    // After onMount triggers state change to show default slot
    expect(document.body.innerHTML).toContain('Child like');
    expect(document.body.innerHTML).not.toContain('Loaded');

// console.log('Initial render complete', document.body.innerHTML);
    
    // Click button -> should toggle back to "Loaded"
    document.querySelector('button').click();

        await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.body.innerHTML).toContain('Loaded');
    expect(document.body.innerHTML).not.toContain('Child like');

    // Click again -> should toggle to child slot again
    document.querySelector('button').click();

        await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.body.innerHTML).toContain('Child like');

    // Verify console log calls (order may vary slightly)
    expect(log).toContain('mounted');
    expect(log).toContain('updated');
    expect(log).toContain('clicked');
  });
});


// describe('Parent/Child slot rendering with events', () => {
//   let root

//   beforeEach(() => {
//     document.body.innerHTML = ''
//     root = document.createElement('div')
//     document.body.appendChild(root)
//   })

//   test.only('renders named and default slots and updates on click', async () => {
//     const Button = createComponent(() => {
//       return `<button>Say Hello!</button>`
//     })

//     const Child = createComponent(() => {
//       return `<div>Child like</div>`
//     })

//     const Parent = createComponent(({ state }) => {
//       return `<div> 
//         <slot name="button">defaults...</slot>
//         ${state.show ? `<slot>defaults</slot>` : `Loaded`}
//       </div>`
//     }, {
//       on: {
//         'click button'() {
//           this.setState({ show: !this.state.show })
//         }
//       },
//       onMount() {
//         this.setState({ show: true })
//       }
//     })

//     // Mount with named slot only
//     Parent.mount(root, {
//       slots: { button: Button }
//     })

//     // Named slot should render Button
//     expect(root.querySelector('button')?.textContent).toBe('Say Hello!')
//     // Default slot should show "defaults" since props.children not given
//     //expect(root.innerHTML).toContain('defaults')

//     // Click the button
//     root.querySelector('button').click()

//     // After click, state.show should toggle false → "Loaded" in DOM
//     expect(root.innerHTML).toContain('Loaded')

//     // Update slots to include default Child component
//     Parent.update({
//       slots: { button: Button(), default: Child() }
//     })

//     await new Promise(resolve => setTimeout(resolve, 0))
//     // Default slot should now render Child
//     expect(root.innerHTML).toContain('Child like')
//   })
// })


// describe("hydrateSlots - slots variations", () => {
//   const Child = createComponent(() => `<div class="child">child</div>`);
//   const Extra = createComponent(() => `<span class="extra">extra</span>`);
//   let  el
//   let Parent

//   beforeEach(() => {
//      el = document.createElement("div");
//     document.body.appendChild(el);
//   });
//   afterEach(() => {
//     document.body.removeChild(el);
//     el.innerHTML = "";
//     Parent.unmount();
//     Extra.unmount();
//     Child.unmount();
//   });

//   test("slots: Child → renders as default slot", () => {
//     Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { slots: Child });
//     expect(el.innerHTML).toContain("child");
//   });

//   test("slots: () => Child() → renders as default slot", () => {
//     Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { slots: () => Child() });
//     expect(el.innerHTML).toContain("child");
//   });

//   test('slots: () => "<p>hi</p>" → renders HTML', () => {
//     Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { slots: () => `<p>hi</p>` });
//     expect(el.innerHTML).toContain("<p>hi</p>");
//   });

//   test("slots: { name: Child } → renders named slot", () => {
//     Parent = createComponent(() => `<slot name="extra"></slot>`);

//     Parent.mount(el, { slots: { extra: Child } });
//     expect(el.innerHTML).toContain("child");
//   });

//   test("props.children overrides default slot", () => {
//     Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { 
//       slots: Child,
//       children: `<p>override</p>`
//     });
//     expect(el.innerHTML).toContain("override");
//     expect(el.innerHTML).not.toContain("child");
//   });

//   test("slots: array of components and HTML", () => {
//     Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { 
//       slots: [Child, "<hr>", Extra] 
//     });
//     expect(el.innerHTML).toContain("child");
//     expect(el.innerHTML).toContain("<hr>");
//     expect(el.innerHTML).toContain("extra");
//   });
// });



// describe("hydrateSlots - slots variations", () => {
//   const Child = createComponent(() => `<div class="child">child</div>`);
//   let el

//   beforeEach(() => {
//     el = document.createElement("div");
//     document.body.appendChild(el);
//   });
//   afterEach(() => {
//     document.body.removeChild(el);
//     el.innerHTML = "";
//     Child.unmount();
//   });

//   test("slots: Child → renders as default slot", () => {
//     const Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { slots: Child });
//     expect(el.innerHTML).toContain("child");
//   });

//   test("slots: () => Child() → renders as default slot", () => {
//     const Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { slots: () => Child() });
//     expect(el.innerHTML).toContain("child");
//   });

//   test('slots: () => "<p>hi</p>" → renders HTML', () => {
//     const Parent = createComponent(() => `<slot></slot>`);

//     Parent.mount(el, { slots: () => `<p>hi</p>` });
//     expect(el.innerHTML).toContain("<p>hi</p>");
//   });

//   test("slots: { name: Child } → renders named slot", () => {
//     const Parent = createComponent(() => `<slot name="extra"></slot>`);

//     Parent.mount(el, { slots: { extra: Child } });
//     expect(el.innerHTML).toContain("child");
//   });
// });

