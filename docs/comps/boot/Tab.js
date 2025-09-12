// lib/comps/Tab.js
import { createComponent } from '@magnumjs/micro-ui';
// Assumes Bootstrap JS is loaded globally, or import if bundling


export const Tab = createComponent({
  onMount() {
     if (!window.bootstrap || !window.bootstrap.Popover) {
      console.error(
        "Bootstrap JS is not loaded. Please include Bootstrap's JavaScript for Popover to work."
      );
      return;
    }

    const button =  this.el.querySelector('button');

    this.tab = new window.bootstrap.Tab(button, this.props.options || {});

    if (this.props.onShow) button.addEventListener('show.bs.tab', this.props.onShow);
    if (this.props.onHide) button.addEventListener('hide.bs.tab', this.props.onHide);
  },
  onUnmount() {
    this.tab?.dispose && this.tab.dispose();
  },
  render({ props }) {
    return `<button ref="trigger" type="button" class="btn btn-outline-primary" data-bs-toggle="tab" data-bs-target="${props.target || ''}" role="tab">${props.label || 'Tab'}</button>`;
  }
});


/*

import { Tab } from '@magnumjs/micro=ui/comps/Tab';

const tab = Tab({
  label: 'Profile',
  target: '#profile-tab',
  options: {
   // Bootstrap Tab options 
},
  onShow: () => console.log('Tab shown!'),
  onHide: () => console.log('Tab hidden!')
});
// Add within a tab list in your component or HTML
<div class="nav nav-tabs" role="tablist">
  <div data-comp="${tab}" data-props='{"label":"Home","target":"#home-tab"}'></div>
  <div data-comp="${tab}" data-props='{"label":"Profile","target":"#profile-tab"}'></div>
</div>

*/