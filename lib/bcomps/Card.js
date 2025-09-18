// --- Card ---
import { createComponent } from "../reactive-core.js";

export const Card = createComponent(({ props }) => {
  const { title, text, imageUrl, linkUrl, buttonText, className} = props;
  const body = typeof props.body === 'function' ? props.body() : (props.body || '');
  return `
    <div class="card ${className || ''}" style="${props.style || ''}">
      ${props.img ? `<img src="${props.img}" class="card-img-top" alt="">` : ''}
      ${props.title ? `<div class="card-header">${props.title}</div>` : ''}
      <div class="card-body">${body}</div>
      ${props.footer ? `<div class="card-footer">${props.footer}</div>` : ''}
    </div>
  `;
});
