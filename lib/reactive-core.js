import diffHTML from "./diffHTML.js";
import bindEvents from "./bindEvents.js";
import getRef from "./get-refs.js";
import hydrateSlots from "./hydrateSlots.js";
import hydrateActions from "./hydrateActions.js";
import { runHook } from "./reactive-core-helpers/runHook.js";
import { runBeforeHook } from "./reactive-core-helpers/runBeforeHook.js";
import { syncInstanceToAPI } from "./reactive-core-helpers/syncInstanceToAPI.js";

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
function __cloneFromTemplate(sourceComp, initialProps = {}) {
  const tpl = sourceComp._frozenTemplate;
  const clone = createComponent(tpl.renderFn, tpl.options);
  clone._initialProps = initialProps;
  clone._templateSource = sourceComp;
  return clone;
}

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
    on() {},
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
        // console.log("Mounting component", componentFn._id, el);
        // Mark this as a component root for event isolation
        el.setAttribute(
          "data-comp-root",
          componentFn._id + "-" + (renderFn.name || "")
        );

        props = { ...props, ...initialProps };
        prevProps = { ...props };
        api.props = props;

        // Attach the component instance for ref lookups
        el._componentInstance = componentFn;

        if (props.key) el.setAttribute("data-key", props.key);

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
        el.setAttribute("data-key", props.key);
      }

      componentFn(props);
    },

    render(newProps = {}) {
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

      let html = runHook(api._beforeRenderCbs, phtml, false, componentFn);

      if (html) {
        html = new String(html);
        html._id = componentFn._id;
      }

      syncInstanceToAPI(api, componentFn);
      return html;
    },

    _resetInternal: () => {
      api._mountedChildren.forEach((child) => {
        if (child && typeof child.unmount === "function") {
          child.unmount();
        }
      });
      api._mountedChildren = [];
      _cachedNode = null;
      _renderedNull = false;
      el = null; // <-- Add this line
      mounted = false;
      onBeforeMountDone = false;
      boundEvents = [];
      props = {};
      prevProps = {};
      state = { ...originalInitialState };
    },

    unmount() {
      if (!mounted || !el) return;

      const cleanup = () => {
        if (el.firstChild) {
          _cachedNode = el.firstChild.cloneNode(true);
          el.removeChild(el.firstChild);
        }

        runHook(api._unmountCbs, undefined, true, componentFn);

        boundEvents.forEach(({ node, type, listener }) => {
          node.removeEventListener(type, listener);
        });
        boundEvents = [];

        mounted = false;
        onBeforeMountDone = false;
        _renderedNull = true;

        unregisterComponent(componentFn); // <-- remove from registry
        if (api._resetInternal) api._resetInternal();
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
  if (onMount) api.onMount(onMount);
  if (onUnmount) api.onUnmount(onUnmount);
  if (onBeforeMount) api.onBeforeMount(onBeforeMount);
  if (onBeforeUnmount) api.onBeforeUnmount(onBeforeUnmount);
  if (onUpdate) api.onUpdate(onUpdate);
  if (onBeforeRender) api.onBeforeRender(onBeforeRender);

  // overrides defaults
  Object.assign(api.on, on);

  api.ref = function (name) {
    return getRef(this.el, name);
  };

  api.refs = new Proxy(
    {},
    {
      get(_, key) {
        return api.ref(key);
      },
    }
  );

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
            // Remove all child nodes, not just first
            el.innerHTML = "";
            boundEvents.forEach(({ node, type, listener }) => {
              node.removeEventListener(type, listener);
            });
            boundEvents = [];
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
      // Short-circuit: if called from slot hydration, just return instance

      // Child call inside parent render
      const parent = currentComponent;
      if (parent._childCallIndex == null) parent._childCallIndex = 0;
      if (!parent._childCallCache) parent._childCallCache = {};
      const cacheKey = props.key != null ? props.key : parent._childCallIndex++;
      let inst = parent._childCallCache[cacheKey];
      if (!inst || inst._templateSource !== componentFn) {
        inst = __cloneFromTemplate(componentFn, props);
        inst._prevProps = { ...props };

        inst.toString = () => {
          return `<div data-comp="${inst._id}"></div>`;
        };
        parent._childCallCache[cacheKey] = inst;
      } else {
        // Always update child instance with latest props
        inst._prevProps = { ...props };
        inst.update(props);
      }

      return inst;
    }
    // Normal top-level render of THIS component
    currentComponent = componentFn;
    componentFn._renderIndex = 0;
    componentFn._childCallIndex = 0;
    componentFn._prevProps = props;

    // Reset child call index for this render pass
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
