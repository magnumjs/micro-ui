import { doRender } from './core/render.js';
// --- DOM helpers ---
import {
  unmountComponent,
  setComponentKeyAttr,
  setComponentRootAttr,
} from './core/domHelpers.js';

// --- Diff/render ---
import { renderComponent } from './core/renderComponent.js';


// --- Lifecycle hooks ---
import {
  runHook,
  runBeforeHook,
  registerLifecycleHooks,
} from './core/hooks.js';

// --- Focus/selection helpers ---
import { restoreActiveElement, captureSelection } from './core/restoreFocus.js';

// --- Child instance helpers ---
import {
  getChildInstance,
  __cloneFromTemplate,
} from './core/getChildInstance.js';

// --- Reset internals ---
import { resetInternal } from './core/resetInternal.js';

// --- Ref helpers ---
import { setupRefs } from './core/refHelpers.js';

// --- Internals (state, props, etc) ---
import { createInternals } from './core/internals.js';

let idCounter = 1;

export const __VERSION__ = process.env.APP_VERSION || '';
export const globalComponentRegistry = new Map();
export function registerComponent(inst) {
  if (inst._id) globalComponentRegistry.set(inst._id, inst);
}
export function unregisterComponent(inst) {
  if (inst._id) globalComponentRegistry.delete(inst._id);
}
export function getComponentById(id) {
  return globalComponentRegistry.get(id);
}

let currentComponent = null;

export function createComponent(arg1, arg2 = {}) {
  const isObj =
    typeof arg1 === 'object' && arg1 !== null && !Array.isArray(arg1);
  const renderFn = isObj ? arg1.render : arg1;
  const options = isObj ? { ...arg1, render: undefined } : { ...arg2 };

  // local per component key registry for top-level keyed instances
  const localKeyRegistry = new Map();

  let {
    state: initialState = {},
    on = {},
    slots = {},
    onMount,
    onUnmount,
    onBeforeMount,
    onBeforeUnmount,
    onUpdate,
    onBeforeRender,
    ...custom // attach anything else to the componentFn
  } = options;

  const { internals, setState, isetProps } = createInternals(
    initialState,
    componentFn,
  );

  // Use internals.originalInitialState and internals.lastHtml throughout

  // Unified setters from internals.js
  function setProps(nextProps = {}) {
    isetProps(api, nextProps);
  }

  const api = {
    refs: {},
    on() {},
    setState,
    setProps,
    props: internals.props,
    _childCallCache: {}, // per-parent render-order child instance cache
    _childCallIndex: 0, // increments every time a child() is called during this render
    isMounted: () => internals.mounted,
    _renderIndex: 0,
    _mountedChildren: [],

    addEvent(key, handler) {
      this.on[key] = handler;
    },

    mount(targetOrSelector, initialProps = {}) {
      if (internals.mounted || internals.onBeforeMountDone) {
        return;
      }

      let target =
        typeof targetOrSelector === 'string'
          ? document.querySelector(targetOrSelector)
          : targetOrSelector;

      if (!target) throw new Error(`No element matches: ${targetOrSelector}`);

      const proceed = () => {
        componentFn._lifecycleState = 'mounting';
        internals.onBeforeMountDone = true;
        internals.el = target;
        setComponentRootAttr(internals.el, componentFn, renderFn);

        internals.props = { ...internals.props, ...initialProps };
        internals.prevProps = { ...internals.props };
        setProps(internals.props);
        internals.el._componentInstance = componentFn;
        setComponentKeyAttr(internals.el, internals.props.key);

        componentFn(internals.props);
        if (!internals.renderedNull) {
          internals.mounted = true;
          runHook(api._onMountCbs, undefined, false, componentFn);
        }
        if (internals.props.key) {
          localKeyRegistry.set(internals.props.key, componentFn);
        }
        componentFn._lifecycleState = 'mounted';
      };

      runBeforeHook(api._onBeforeMountCbs, proceed, componentFn);
    },

    update(input = {}) {
      if (!internals.mounted) return;
      const nextProps = input.props || input;
      if (nextProps.on) Object.assign(this.on, nextProps.on);
      setProps(nextProps);
      if (internals.props.key !== internals.prevProps.key) {
        setComponentKeyAttr(internals.el, internals.props.key);
      }
      componentFn(internals.props);
    },

    render(newProps = {}) {
      return renderComponent({
        renderFn,
        componentFn,
        api,
        state: internals.state,
        setState,
        props: internals.props,
        newProps,
      });
    },

    _resetInternal: () => {
      resetInternal(api, internals.originalInitialState, {
        _cachedNode: internals.cachedNode,
        _renderedNull: internals.renderedNull,
        el: internals.el,
        mounted: internals.mounted,
        onBeforeMountDone: internals.onBeforeMountDone,
        boundEvents: internals.boundEvents,
        props: internals.props,
        prevProps: internals.prevProps,
        state: internals.state,
      });
    },

    unmount() {
      if (!internals.mounted || !internals.el) return;
      const cleanup = () => {
        const result = unmountComponent({
          el: internals.el,
          _cachedNode: internals.cachedNode,
          boundEvents: internals.boundEvents,
          mounted: internals.mounted,
          onBeforeMountDone: internals.onBeforeMountDone,
          _renderedNull: internals.renderedNull,
          api,
          componentFn,
          runHook,
          unregisterComponent,
        });
        internals.cachedNode = result._cachedNode;
        internals.boundEvents = result.boundEvents;
        internals.mounted = result.mounted;
        internals.onBeforeMountDone = result.onBeforeMountDone;
        internals.renderedNull = result._renderedNull;
        if (internals.props.key && localKeyRegistry.has(internals.props.key)) {
          localKeyRegistry.delete(internals.props.key);
        }
      };
      runBeforeHook(api._onBeforeUnmountCbs, cleanup, api);
    },

    get renderFn() {
      return renderFn;
    },
    get el() {
      return internals.el;
    },
    get state() {
      return internals.state;
    },
  };

  // Register option lifecycles into arrays
  registerLifecycleHooks(api, {
    onMount,
    onUnmount,
    onBeforeMount,
    onBeforeUnmount,
    onUpdate,
    onBeforeRender,
  });

  api.onBeforeRender(captureSelection); // snapshot before diff
  api.onUpdate(restoreActiveElement); // restore after diff

  // overrides defaults
  Object.assign(api.on, on);

  // Setup refs and ref proxy
  setupRefs(api);

  const render = doRender({
    internals,
    api,
    componentFn,
    slots,
    runBeforeHook,
    runHook,
  });

  // Create the callable component function
  function componentFn(props = {}) {
    // If we are inside ANOTHER component's render, this is a child call.
    if (
      !componentFn._fromSlotHydration &&
      currentComponent &&
      currentComponent !== componentFn
    ) {
      // Child call inside parent render
      const parent = currentComponent;
      // Use helper for child instance caching logic
      const inst = getChildInstance({
        parent,
        componentFn,
        props,
      });
      return inst;
    }

    if (
      !currentComponent &&
      !componentFn._isChild &&
      props &&
      props.key &&
      !componentFn.isKeyedClone &&
      componentFn.getCurrentLifecycleState() !== 'mounting'
    ) {
      let pinst;
      if (!localKeyRegistry.has(props.key)) {
        pinst = componentFn.clone(props);
        pinst.isKeyedClone = true;
        localKeyRegistry.set(props.key, pinst);
      } else {
        pinst = localKeyRegistry.get(props.key);
        pinst._prevProps = { ...props };
        pinst.update(props);
      }
      return pinst;
    }

    // Normal top-level render of THIS component
    currentComponent = componentFn;
    componentFn._renderIndex = 0;
    componentFn._childCallIndex = 0; // Ensure reset before any child calls
    componentFn._prevProps = props;

    internals.lastHtml = componentFn._render(props);
    currentComponent = null;
    return componentFn;
  }

  // get current lifecycle state
  // "idle", "mounting", "rendering", "updating", "unmounting"
  componentFn.getCurrentLifecycleState = () => componentFn._lifecycleState;

  // Add toString method to componentFn
  componentFn.toString = function () {
    // If we haven't produced HTML yet, emit a placeholder wrapper so the parent
    // can locate and mount this instance by ID.
    // But only when within a parent component
    if (
      !internals.lastHtml ||
      (String(internals.lastHtml) === '' &&
        !componentFn.isMounted() &&
        currentComponent !== null &&
        currentComponent._id !== componentFn._id)
    ) {
      return String(componentFn._id);
    }
    return internals.lastHtml ? String(internals.lastHtml) : '';
  };

  // Attach API methods
  Object.assign(componentFn, api, custom);

  // Dynamically attach instance-backed getters
  ['el', 'props', 'state', 'setState'].forEach((key) => {
    Object.defineProperty(componentFn, key, {
      get() {
        return api[key];
      },
      enumerable: true,
      configurable: false,
    });
  });

  componentFn._render = render;
  componentFn.render = api.render;
  componentFn._id = idCounter++;
  componentFn.getId = () => componentFn._id;
  registerComponent(componentFn); // <-- auto register

  // Freeze a template of the original definition so we can clone later
  componentFn._frozenTemplate = Object.freeze({
    renderFn,
    // use the original options shape but ensure state is not aliased
    options: { ...options, state: { ...internals.originalInitialState } },
  });

  // Reuse the same internal clone logic
  componentFn.clone = (initialProps = {}) =>
    __cloneFromTemplate(componentFn, initialProps);

  return componentFn;
}

// Usage in composables:
export function useCurrentComponent() {
  return currentComponent;
}
