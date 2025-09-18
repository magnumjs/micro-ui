// micro-ui-bootstrap-starter.js
import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';

// --- Box ---
// Usage: Box({ className: "p-4 border rounded bg-light", style: "", content: "..." })
export const Box = createComponent(({ props }) => {
   const className = [
      "p-3",
      "border",
      "rounded",
      "shadow-sm",
      props.className || "" // allow custom overrides
    ].join(" ");

  const style = props.style || "";
  const content = typeof props.content === 'function' ? props.content() : (props.content || '');
  return `<div class='${className}' style='${style}'>${content}</div>`;
});

// --- Layout Components ---
export const Container = createComponent(({ props }) => {
  const cls = props.fluid ? "container-fluid" : "container";
  const content = typeof props.content === 'function' ? props.content() : (props.content || '');
  return `<div class="${cls} ${props.className || ''}">${content}</div>`;
});

export const Row = createComponent(({ props }) => {
  const content = typeof props.content === 'function' ? props.content() : (props.content || '');
  return `<div class="row ${props.className || ''}">${content}</div>`;
});

export const Col = createComponent(({ props }) => {
  const size = props.cols ? `col-${props.cols}` : "col";
  const content = typeof props.content === 'function' ? props.content() : (props.content || '');
  return `<div class="${size} ${props.className || ''}">${content}</div>`;
});

// --- Button ---
export const Button = createComponent(({ props }) => {
  const variant = props.variant || "primary";
  const size = props.size ? `btn-${props.size}` : "";
  const disabled = props.disabled ? "disabled" : "";
  const label = typeof props.label === 'function' ? props.label() : (props.label || 'Button');
  return `<button class="btn btn-${variant} ${size}" ${disabled}>${label}</button>`;
});

// --- Card ---
export const Card = createComponent(({ props }) => {
  const { title, text, imageUrl, linkUrl, buttonText } = props;
  const body = typeof props.body === 'function' ? props.body() : (props.body || '');
  return `
    <div class="card ${props.className || ''}" style="${props.style || ''}">
      ${props.img ? `<img src="${props.img}" class="card-img-top" alt="">` : ''}
      ${props.title ? `<div class="card-header">${props.title}</div>` : ''}
      <div class="card-body">${body}</div>
      ${props.footer ? `<div class="card-footer">${props.footer}</div>` : ''}
    </div>
  `;
});

// --- Alert ---
export const Alert = createComponent({
  render({ props }) {
    const type = props.type || "info";
    const dismissible = props.dismissible ? "alert-dismissible fade show" : "";
    const message = typeof props.message === 'function' ? props.message() : (props.message || 'Alert message');
    return `
      <div class="alert alert-${type} ${dismissible}" role="alert">
        ${message}
        ${props.dismissible ? `<button type="button" class="btn-close" data-bs-dismiss="alert"></button>` : ''}
      </div>
    `;
  },
  onMount() {
    if (this.props.onClose && typeof this.props.onClose === 'function') {
      this.el.addEventListener('closed.bs.alert', this.props.onClose);
    }
  }
});

// --- Modal ---
export const Modal = createComponent(({ props }) => {
  const body = typeof props.body === 'function' ? props.body() : (props.body || '');
  return `
    <div class="modal fade ${props.show ? 'show d-block' : ''}" tabindex="-1">
      <div class="modal-dialog ${props.size ? 'modal-' + props.size : ''}">
        <div class="modal-content">
          ${props.title ? `<div class="modal-header"><h5 class="modal-title">${props.title}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>` : ''}
          <div class="modal-body">${body}</div>
          ${props.footer ? `<div class="modal-footer">${props.footer}</div>` : ''}
        </div>
      </div>
    </div>
  `;
});

// --- Accordion ---
export const Accordion = createComponent(({ props }) => {
  const items = props.items || [];
  return `
    <div class="accordion" id="${props.id || 'accordionExample'}">
      ${items.map((item, i) => {
        const content = typeof item.content === 'function' ? item.content() : item.content;
        return `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading${i}">
              <button class="accordion-button ${i !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}">
                ${item.title}
              </button>
            </h2>
            <div id="collapse${i}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" data-bs-parent="#${props.id || 'accordionExample'}">
              <div class="accordion-body">${content}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
});

// --- Spinner ---
export const Spinner = createComponent(({ props }) => {
  const label = typeof props.label === 'function' ? props.label() : (props.label || 'Loading...');
  return `<div class="spinner-border text-${props.color || 'primary'}" role="status">
    <span class="visually-hidden">${label}</span>
  </div>`;
});


// --- Flexible Grid ---
// Usage:
// BootstrapGrid({
//   containerClass: "container",
//   rows: [
//     { rowClass: "row", columns: [ { className: "col-md-6", content: "Left" }, { className: "col-md-6", content: "Right" } ] }
//   ]
// })
export const BootstrapGrid = createComponent(({ props }) => {
  const containerClass = props.containerClass || "container";
  const rows = props.rows || [];
  return `<div class='${containerClass}'>${
    rows.map(row => `
      <div class='${row.rowClass || "row"}'>${
        row.columns.map(col => `<div class='${col.className || "col"}'>${col.content || ""}</div>`).join("")
      }</div>
    `).join("")
  }</div>`;
});
