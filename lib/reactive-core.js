import { cleanupDomAndEvents } from "./core/domCleanup.js";

import diffHTML from "./diffHTML.js";
import bindEvents from "./bindEvents.js";
import hydrateSlots from "./hydrateSlots.js";
import hydrateActions from "./hydrateActions.js";

import { runHook } from "./core/runHook.js";
import { runBeforeHook } from "./core/runBeforeHook.js";
import { syncInstanceToAPI } from "./core/syncInstanceToAPI.js";
import { restoreActiveElement, captureSelection } from "./core/restoreFocus.js";
import { getChildInstance, __cloneFromTemplate } from "./core/getChildInstance.js";
import { resetInternal } from "./core/resetInternal.js";
import { registerLifecycleHooks } from "./core/registerLifecycleHooks.js";
import { unmountComponent } from "./core/unmountComponent.js";
import { setupRefs } from "./core/setupRefs.js";

import { setComponentRootAttr, setComponentKeyAttr } from "./core/componentAttrs.js";
import { renderComponent } from "./core/renderComponent.js";
import { mergeAndSyncProps } from "./core/mergeAndSyncProps.js";

let idCounter = 1;

export const __VERSION__ = process.env.APP_VERSION || "";
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

// --- INTERNAL: clone a component from a frozen template (no mount yet) ---


export function createComponent(arg1, arg2 = {}) {
  const isObj =
    typeof arg1 === "object" && arg1 !== null && !Array.isArray(arg1);
  const renderFn = isObj ? arg1.render : arg1;
  const options = isObj ? { ...arg1, render: undefined } : { ...arg2 };

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
    ...custom
  } = options;

  let el = null;
  let mounted = false;
  let props = {};
  let prevProps = {};
  let scheduledRenderProps = null;
  let onBeforeMountDone = false;
  let boundEvents = [];
  let state = initialState;
  let _cachedNode = null;
  let _renderedNull = false;
  const originalInitialState = { ...initialState };
  let renderScheduled = false;

  const setState = (next) => {
    state = typeof next === "function" ? next(state) : { ...state, ...next };
    if (!renderScheduled) {
      renderScheduled = true;
      scheduledRenderProps = { ...props };
      queueMicrotask(() => {
        renderScheduled = false;
        componentFn(scheduledRenderProps);
        scheduledRenderProps = null;
      });
    }
  };

  const api = {
    refs: {},
    on() { },
    setState,
    props,
    _childCallCache: {}, // per-parent render-order child instance cache
    _childCallIndex: 0, // increments every time a child() is called during this render
    isMounted: () => mounted,
    _renderIndex: 0,
    _mountedChildren: [],
    _unmountCbs: [],
    _mountCbs: [],
    _beforeMountCbs: [],
    _updateCbs: [],
    _beforeUnmountCbs: [],
    _beforeRenderCbs: [],

    // runtime-attachable mount
    onMount(fn) {
      if (fn) this._mountCbs.push(fn);
    },
    // runtime-attachable cleanup
    onUnmount(fn) {
      if (fn) this._unmountCbs.push(fn);
    },
    // runtime-attachable before mount
    onBeforeMount(fn) {
      if (fn) this._beforeMountCbs.push(fn);
    },
    onBeforeUnmount(fn) {
      if (fn) this._beforeUnmountCbs.push(fn);
    },
    // runtime-attachable before mount
    onUpdate(fn) {
      if (fn) this._updateCbs.push(fn);
    },
    // runtime-attachable before html processing post renderFn call
    onBeforeRender(fn) {
      if (fn) this._beforeRenderCbs.push(fn);
    },

    addEvent(key, handler) {
      this.on[key] = handler;
    },

    mount(targetOrSelector, initialProps = {}) {
      if (mounted || onBeforeMountDone) {
        //  console.log("Component already mounted or mounting in progress", componentFn._id);
        return;
      }
      let target =
        typeof targetOrSelector === "string"
          ? document.querySelector(targetOrSelector)
          : targetOrSelector;

      if (!target) throw new Error(`No element matches: ${targetOrSelector}`);

      const proceed = () => {
        onBeforeMountDone = true;
        el = target;
        setComponentRootAttr(el, componentFn, renderFn);
  ({ props, prevProps } = mergeAndSyncProps({ props, prevProps, api, newProps: initialProps }));
        el._componentInstance = componentFn;
        setComponentKeyAttr(el, props.key);
        componentFn(props);
        if (!_renderedNull) {
          mounted = true;
          runHook(api._mountCbs, undefined, false, componentFn);
        }
      };

      // Execute onBeforeMount callbacks
      runBeforeHook(api._beforeMountCbs, proceed, componentFn);
    },

    update(input = {}) {
      if (!mounted) return;
      const nextProps = input.props || input;
      if (nextProps.on) Object.assign(this.on, nextProps.on);

      prevProps = { ...props };
      props = { ...props, ...nextProps };
      api.props = props;

      // reset data-key if props.key changes
      if (props.key !== prevProps.key) {
        setComponentKeyAttr(el, props.key);
      }

      componentFn(props);
    },

    render(newProps = {}) {
      return renderComponent({
        renderFn,
        componentFn,
        api,
        state,
        setState,
        props,
        newProps
      });
    },

    _resetInternal: () => {
      resetInternal(api, originalInitialState, {
        _cachedNode,
        _renderedNull,
        el,
        mounted,
        onBeforeMountDone,
        boundEvents,
        props,
        prevProps,
        state
      });
    },

    unmount() {
      if (!mounted || !el) return;

      const cleanup = () => {
        const result = unmountComponent({
          el,
          _cachedNode,
          boundEvents,
          mounted,
          onBeforeMountDone,
          _renderedNull,
          api,
          componentFn,
          runHook,
          unregisterComponent
        });
        _cachedNode = result._cachedNode;
        boundEvents = result.boundEvents;
        mounted = result.mounted;
        onBeforeMountDone = result.onBeforeMountDone;
        _renderedNull = result._renderedNull;
      };

      runBeforeHook(api._beforeUnmountCbs, cleanup, api);
    },

    get renderFn() {
      return renderFn;
    },
    get el() {
      return el;
    },
    get state() {
      return state;
    },
  };

  // Register option lifecycles into arrays
  registerLifecycleHooks(api, { onMount, onUnmount, onBeforeMount, onBeforeUnmount, onUpdate, onBeforeRender });

  api.onBeforeRender(captureSelection);  // snapshot before diff
  api.onUpdate(restoreActiveElement);    // restore after diff

  // overrides defaults
  Object.assign(api.on, on);

  // Setup refs and ref proxy
  setupRefs(api);

  function render(currentProps) {
    props = { ...api.props, ...currentProps };
    api.props = props;

    if (!el || el.isConnected === false) {
      //console.warn("Component root element is not connected to the DOM, skipping render:", componentFn._id, componentFn.renderFn())
      //return;
    }

    const html = api.render(props);

    if (html === null || html === "") {
      if (!_renderedNull && el && el.firstChild) {
        const realNode = el.firstChild;
        _cachedNode = realNode.cloneNode(true);
        runBeforeHook(
          api._beforeUnmountCbs,
          () => {
            boundEvents = cleanupDomAndEvents(el, boundEvents);
            mounted = false;
            _renderedNull = true;
            runHook(api._unmountCbs, undefined, true, componentFn);
          },
          api
        );
      } else {
        _renderedNull = true;
      }
      return;
    }

    if (_renderedNull && _cachedNode) {
      el.appendChild(_cachedNode);
      _cachedNode = null;
      _renderedNull = false;
      mounted = true;
      bindEvents(componentFn, el, componentFn.on, boundEvents);
      runHook(api._mountCbs, undefined, false, componentFn);
      return;
    }



    diffHTML(el, html);

    hydrateSlots(componentFn, props, api, slots);
    hydrateActions(componentFn, el);

    bindEvents(componentFn, el, componentFn.on, boundEvents);

    if (mounted) {
      runHook(api._updateCbs, prevProps, false, componentFn);
    }

    _renderedNull = false;
    return html;
  }

  let lastHtml = "";
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
        __cloneFromTemplate
      });
      return inst;
    }
    // Normal top-level render of THIS component
    currentComponent = componentFn;
    componentFn._renderIndex = 0;
    componentFn._childCallIndex = 0; // Ensure reset before any child calls
    componentFn._prevProps = props;

    lastHtml = componentFn._render(props);
    currentComponent = null;
    return componentFn;
  }

  // Add toString method to componentFn

  componentFn.toString = function () {
    // If we haven't produced HTML yet, emit a placeholder wrapper so the parent
    // can locate and mount this instance by ID.
    // But only when within a parent component
    if (
      !lastHtml ||
      (String(lastHtml) === "" &&
        !componentFn.isMounted() &&
        currentComponent !== null &&
        currentComponent._id !== componentFn._id)
    ) {
      return String(componentFn._id);
    }
    return lastHtml ? String(lastHtml) : "";
  };

  // Attach API methods
  Object.assign(componentFn, api, custom);

  // Dynamically attach instance-backed getters
  ["el", "props", "state", "setState"].forEach((key) => {
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
    options: { ...options, state: { ...originalInitialState } },
  });

  componentFn.clone = function (initialProps = {}) {
    // Reuse the same internal clone logic
    const clone = __cloneFromTemplate(componentFn, initialProps);
    return clone;
  };

  return componentFn;
}

// Usage in composables:
export function useCurrentComponent() {
  return currentComponent;
}
