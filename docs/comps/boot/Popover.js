// lib/comps/Popover.js
//import { createComponent } from '//unpkg.com/@magnumjs/micro-ui';
// Import Bootstrap JS (assumes it's loaded globally, or use import if bundling)

// e.g. import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// //unpkg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css
// //unpkg.com/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
// import "//unpkg.com/bootstrap"

import { createComponent } from '@magnumjs/micro-ui';

export const Popover = createComponent({
  onMount() {
    if (!window.bootstrap || !window.bootstrap.Popover) {
      console.error(
        "Bootstrap JS is not loaded. Please include Bootstrap's JavaScript for Popover to work."
      );
      return;
    }

    // Find the target element (could be a ref, or the root)
    const button =  this.el.querySelector('button');
    // Create Bootstrap Popover instance
    this.popover = new window.bootstrap.Popover(button, this.props.options || {});
    // Optionally expose instance methods/events

    if (this.props.onShow)
      button.addEventListener('show.bs.popover', this.props.onShow);
    if (this.props.onHide)
      button.addEventListener('hide.bs.popover', this.props.onHide);
  },
  onUnmount() {
    this.popover?.dispose();
  },
  render({ props }) {
    // Use a ref for the trigger element
    return `<button ref="trigger" type="button" class="btn btn-secondary" data-bs-toggle="popover" title="${
      props.title || ''
    }" data-bs-content="${props.content || ''}">
      ${props.label || 'Show Popover'}
    </button>`;
  },
});


/*

import { Popover } from '@magnumjs/micro-ui/comps/Popover';


// add component within existing component or directly to DOM
// Example Parent Component
const ParentComponent = () => {

    const pop = Popover({
        title: 'Popover Title',
        content: 'Popover body content',
        label: 'Click Me',
        options: { placement: 'right', trigger: 'click' },
        onShow: () => console.log('Popover shown!'),
        onHide: () => console.log('Popover hidden!')
    });

  return `
    <div>
      <h1>My App</h1>
      <div id="infopop">${pop}</div>
    </div>
  `;
}; 

// Mount ParentComponent
ParentComponent.mount('#someContainer');
*/