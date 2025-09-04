import diffHTML from "./diffHTML.js";
import bindEvents from "./bindEvents.js";
import getRef from "./get-refs.js";
import hydrateSlots from "./hydrateSlots.js";
import hydrateActions from "./hydrateActions.js";
import { runHook } from "./reactive-core-helpers/runHook.js";
import { runBeforeHook } from "./reactive-core-helpers/runBeforeHook.js";
import { syncInstanceToAPI } from "./reactive-core-helpers/syncInstanceToAPI.js";
let id = 1;

export const __VERSION__ = process.env.APP_VERSION || "";

export const globalComponentRegistry = new Map();

export function registerComponent(instance) {
  if (!instance._id) return;
  //   instance._id = `comp-${Math.random().toString(36).slice(2)}`;
  globalComponentRegistry.set(instance._id, instance);
}

export function unregisterComponent(instance) {
  if (instance._id) globalComponentRegistry.delete(instance._id);
}

export function getComponentById(id) {
  return globalComponentRegistry.get(id);
}

let currentComponent = null;

// --- INTERNAL: clone a component from a frozen template (no mount yet) ---
function __cloneFromTemplate(sourceComp, initialProps = {}) {
  const tpl = sourceComp._frozenTemplate;
  // Rebuild a fresh callable component from the same render + options
  // merge these initialProps with the instance props
  const clone = createComponent(tpl.renderFn, tpl.options);
  // Stash initial props to apply on first mount/update
  clone._initialProps = initialProps;
  // clone.props = { ...initialProps };
  // For debugging / safety, remember who produced this clone
  clone._templateSource = sourceComp;

  // console.log("Cloning component:", clone.props);

  return clone;
}

export function createComponent(arg1, arg2 = {}) {
  let renderFn;
  let options = {};

  const ftype = typeof arg1;
  // Detect object-style usage
  if (
    ftype === "object" &&
    ftype !== "function" &&
    arg1 !== null &&
    !Array.isArray(arg1)
  ) {
    renderFn = arg1.render;
    options = { ...arg1 };
    delete options.render; // avoid duplicate
  } else {
    // Old signature: createComponent(renderFn, options)
    renderFn = arg1;
    options = arg2 || {};
  }

  let {
    state: initialState = {},
    on = {},
    slots = {},
    onMount,
    onUnmount,
    onBeforeMount,
    onBeforeUnmount,
    onUpdate,
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
    on: function (event, handler) {
      if (event && handler) {
        const id = `h${componentFn._renderIndex++}`; // stable per render cycle
        componentFn.addEvent(`${event} [data-ref=${id}]`, handler);
        return `data-ref="${id}"`;
      }
    },
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

    // runtime-attachable mount
    onMount(fn) {
      if (typeof fn === "function") this._mountCbs.push(fn);
    },
    // runtime-attachable cleanup
    onUnmount(fn) {
      if (typeof fn === "function") this._unmountCbs.push(fn);
    },
    // runtime-attachable before mount
    onBeforeMount(fn) {
      if (typeof fn === "function") this._beforeMountCbs.push(fn);
    },
    onBeforeUnmount(fn) {
      if (typeof fn === "function") this._beforeUnmountCbs.push(fn);
    },
    // runtime-attachable before mount
    onUpdate(fn) {
      if (typeof fn === "function") this._updateCbs.push(fn);
    },

    addEvent(key, handler) {
      if (!api.on[key]) api.on[key] = handler;
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

        if (props.key) {
          el.setAttribute("data-key", props.key);
        }

        componentFn(props);

        // ✅ Automatically hydrate component instances passed to props.children or props.slots
        // hydrateSlots(componentFn, props, api, slots);

        //bindEvents(api, el, on, api._boundEvents); // Ensure `on` from options is passed correctly

        if (!_renderedNull) {
          mounted = true;
          //onMount?.call(componentFn);
          runHook(api._mountCbs, undefined, false, componentFn);
        }
      };

      // Execute onBeforeMount callbacks
      //runHook(api._beforeMountCbs);

      runBeforeHook(api._beforeMountCbs, proceed, componentFn);
    },

    update(input = {}) {
      if (!mounted) return;
      const nextProps = input.props ? input.props : input;

      const newOn = nextProps.on;
      if (newOn) {
        Object.assign(api.on, newOn);
      }

      const merged = { ...props, ...nextProps };
      prevProps = { ...props };
      props = merged;
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
      let html =
        typeof renderFn === "function"
          ? renderFn.call(api, { state, setState, props, refs: api.refs })
          : renderFn;

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
        // onUnmount?.call(api);

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
            // onUnmount?.call(api);
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
      // onMount?.call(api);
      runHook(api._mountCbs, undefined, false, componentFn);
      return;
    }

    diffHTML(el, html);
    hydrateSlots(componentFn, props, api, slots);
    hydrateActions(componentFn, el);
    //    console.log("Rendered HTML:", html, el === null ? "null" : el.outerHTML, el === componentFn.el, el.isConnected)

    bindEvents(componentFn, el, componentFn.on, boundEvents);

    if (mounted) {
      // onUpdate.call(api, prevProps);
      runHook(api._updateCbs, prevProps, false, componentFn);
    }

    _renderedNull = false;
    return html;
  }

  let lastHtml = "";
  // Create the callable component function
  function componentFn(props = {}) {
    // console.log("caller", componentFn._fromSlotHydration, props, componentFn._id);
    // if (props._fromSlotHydration) {
    //   // console.log('slot hydration call, skip child logic', props);
    // } else {
    //   // console.log('normal call', props);
    // }
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
        // console.log("Child component detected:", componentFn._id, currentComponent._id, props);
        inst = __cloneFromTemplate(componentFn, props);
        inst._prevProps = { ...props };

        inst.toString = () => {
          // return inst._id
          return `<div data-comp="${inst._id}"></div>`;
        };
        parent._childCallCache[cacheKey] = inst;
      } else {
        // console.log("Reusing existing child instance:", inst._id, props, inst.isMounted());

        // Always update child instance with latest props
        inst._prevProps = { ...props };
        inst.update(props);
      }

      // if props.key then add to el data-key

      return inst;
    }
    // Normal top-level render of THIS component
    currentComponent = componentFn;
    componentFn._renderIndex = 0;
    componentFn._childCallIndex = 0;
    componentFn._prevProps = props;
    // console.log('call render for', componentFn._id, props);
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
      //return `<div data-comp="${componentFn._id}"></div>`;
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
  componentFn._id = id++;
  componentFn.getId = () => componentFn._id;
  registerComponent(componentFn); // <-- auto register

  // Freeze a template of the original definition so we can clone later
  componentFn._frozenTemplate = Object.freeze({
    renderFn,
    // use the original options shape but ensure state is not aliased
    options: { ...options, state: { ...originalInitialState } },
  });

  return componentFn;
}


// Usage in composables:
export function useCurrentComponent() {
  return currentComponent;
}
