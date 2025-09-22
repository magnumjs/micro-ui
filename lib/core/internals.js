// Helper to create originalInitialState, lastHtml, and localKeyRegistry for a component instance
// (Moved helpers into internals object)
// Removed createComponentInstanceHelpers function
import { shallowEqual } from './propsHelpers.js';

export function createInternals(initialState = {}, componentFn) {
  const internals = {
    el: null,
    mounted: false,
    props: {},
    prevProps: {},
    scheduledRenderProps: null,
    onBeforeMountDone: false,
    boundEvents: [],
    state: initialState,
    cachedNode: null,
    renderedNull: false,
    renderScheduled: false,
    // Added helpers to internals
    originalInitialState: { ...initialState },
    lastHtml: '',
    localKeyRegistry: new Map(),
  };


function setState(next) {
  const prevState = { ...internals.state };
  internals.state =
    typeof next === 'function'
      ? next(internals.state)
      : { ...internals.state, ...next };

  if (!shallowEqual(internals.state, prevState) && !internals.renderScheduled) {
    internals.renderScheduled = true;
    internals.scheduledRenderProps = { ...internals.props };
    queueMicrotask(() => {
      internals.renderScheduled = false;
      componentFn(internals.scheduledRenderProps);
      internals.scheduledRenderProps = null;
    });
  }
}

function isetProps(api, nextProps = {}) {
  internals.prevProps = { ...internals.props };
  internals.props = { ...internals.props, ...nextProps };
  if (api) api.props = internals.props;
}


  return { internals, setState, isetProps };
}

