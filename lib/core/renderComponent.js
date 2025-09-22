import { runNamedHook } from './hooks.js';
// Helper to handle the core logic of rendering a component instance
import { syncInstanceToAPI } from "./propsHelpers.js";

/**
 * Renders the component: runs renderFn, beforeRender hooks, short-circuits if unchanged, syncs API, returns html.
 * @param {Object} params - All required context for rendering
 * @param {Function|String} params.renderFn - The render function or string
 * @param {Object} params.componentFn - The component function (for .call and _id)
 * @param {Object} params.api - The component API object
 * @param {Object} params.state - The current state
 * @param {Function} params.setState - The setState function
 * @param {Object} params.props - The current props
 * @param {Object} params.newProps - The new props to merge in
 * @returns {String|Object} The rendered HTML (String object with _id) or null
 */
export function renderComponent({ renderFn, componentFn, api, state, setState, props, newProps }) {
  props = { ...props, ...newProps };
  api.props = props;


  let phtml =
    typeof renderFn === "function"
      ? renderFn.call(componentFn, {
        state,
        setState,
        props,
        refs: api.refs,
      })
      : renderFn;

  let html = runNamedHook('onBeforeRender', phtml, false, componentFn);

  if (html) {
    html = new String(html);
    html._id = componentFn._id;
    html.toFragment = () => {
      const tpl = document.createElement("template");
      tpl.innerHTML = html;
      return tpl.content;
    };
  }

  syncInstanceToAPI(api, componentFn);
  return html;
}