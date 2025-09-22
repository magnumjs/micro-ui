// core/render.js
// Extracted render logic from createComponent for reuse and clarity

import { cacheNodes, restoreNodes } from './cacheNodes.js';
import { cleanupDomAndEvents } from './domHelpers.js';
import bindEvents from '../bindEvents.js';
import hydrateSlots from '../hydrateSlots.js';
import hydrateActions from '../hydrateActions.js';
import diffHTML from '../diffHTML.js';
import { runNamedBeforeHook } from './hooks.js';

export function doRender({
  internals,
  api,
  componentFn,
  slots,
  runBeforeHook,
    runNamedHook,
}) {
  return function render(currentProps) {
    internals.props = { ...api.props, ...currentProps };
    api.props = internals.props;

    if (!internals.el || internals.el.isConnected === false) {
      //console.warn("Component root element is not connected to the DOM, skipping render:", componentFn._id, componentFn.renderFn())
      //return;
    }

    //TODO: if already mounted add shallow check for change to props and short-circuit if none

    const html = api.render(internals.props);

    if (internals.mounted && (html === null || html === '')) {
      if (
        !internals.renderedNull &&
        internals.el &&
        internals.el.hasChildNodes()
      ) {
        internals.cachedNode = cacheNodes(internals.el);
          runNamedBeforeHook('onBeforeUnmount', () => {
            internals.boundEvents = cleanupDomAndEvents(
              internals.el,
              internals.boundEvents,
            );
            internals.mounted = false;
            internals.renderedNull = true;
            runNamedHook('onUnmount', undefined, true, componentFn);
          }, api);
      } else {
        internals.renderedNull = true;
      }
      return;
    }

    if (internals.renderedNull && internals.cachedNode) {
      restoreNodes(internals.el);
      internals.cachedNode = null;
      internals.renderedNull = false;
      internals.mounted = true;
      bindEvents(
        componentFn,
        internals.el,
        componentFn.on,
        internals.boundEvents,
      );
        runNamedHook('onMount', undefined, false, componentFn);
      return;
    }

    diffHTML(internals.el, html);

    hydrateSlots(componentFn, internals.props, api, slots);
    hydrateActions(componentFn, internals.el);

    bindEvents(
      componentFn,
      internals.el,
      componentFn.on,
      internals.boundEvents,
    );

    if (internals.mounted) {
        runNamedHook('onUpdate', internals.prevProps, false, componentFn);
    }

    internals.renderedNull = false;
    return html;
  };
}
