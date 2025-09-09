// lib/Alert.js
import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';


/*


// In your Layout, Page, or anywhere:
${Alert({
  type: 'success',
  message: 'Profile updated successfully!',
  dismissible: true,
  className: 'mt-3',
  style: 'font-size:1.1em;',
  onClose: () => console.log('Alert closed!')
})}

*/

export const Alert = createComponent({
  on: {
    "click button"(ctx){
      ctx.event.target.parentNode.remove()
      ctx.props.onClose?.()
    }
  },
  render({ props: { type = 'info', message, dismissible = false, onClose, className = '', style = '' }, state, setState }) {
    return `
      <div class="alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${className}" style="${style}" role="alert">
        ${message}
        ${dismissible ? `
          <button type="button" class="btn-close" aria-label="Close"></button>
        ` : ''}
      </div>
    `;
  }
});



