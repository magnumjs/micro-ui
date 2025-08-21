import diffHTML from "./diffHTML.js";
import bindEvents from "./bindEvents.js";
import { context, createChannelMap } from "./compose/context.js";
import getRef from "./get-refs.js";
import hydrateSlots from "./hydrateSlots.js";
let id = 1;

export const __VERSION__ = process.env.APP_VERSION || "";

function syncInstanceToAPI(instance, componentFn) {
  for (const key of Object.keys(instance)) {
    if (!(key in componentFn)) {
      Object.defineProperty(componentFn, key, {
        get() {
          return instance[key];
        },
        enumerable: true,
      });
    }
  }
}

let currentComponent = null;

export function createComponent(arg1, arg2 = {}) {
  let renderFn;
  let options = {};

  const ftype = typeof arg1;
  // Detect object-style usage
  if (
    ftype === "object" &&
    ftype !== "funcion" &&
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
  let contextUnsubs = [];
  const localBus = createChannelMap();

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
    setState,
    props,
    isMounted: () => mounted,
    _mountedChildren: [],
    _unmountCbs: [],
    _mountCbs: [],
    _beforeMountCbs: [], // <-- Add this line

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

    // local (component-scoped) events
    emit(event, payload) {
      localBus.emit(event, payload);
    },
    onEmit(event, fn) {
      const unsub = localBus.subscribe(event, fn);
      this.onUnmount(unsub);
      return unsub;
    },

    // global events passthrough (optional helpers)
    emitGlobal(event, payload) {
      context.emit(event, payload);
    },
    onEmitGlobal(event, fn) {
      const unsub = context.subscribe(event, fn);
      this.onUnmount(unsub);
      return unsub;
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
          componentFn._id + "-" + (componentFn.name || renderFn.name || "")
        );

        props = { ...props, ...initialProps };
        prevProps = { ...props };
        api.props = props;

        componentFn(props);

        // ✅ Automatically hydrate component instances passed to props.children or props.slots
        // hydrateSlots(componentFn, props, api, slots);

        // bindEvents(api, el, on, boundEvents); // ✅ ensure this.el is hydrated before context

        if (!_renderedNull) {
          mounted = true;
          onMount?.call(componentFn);
          for (const fn of this._mountCbs) { try { fn(); } catch (e) { console.error(e); } }
          this._mountCbs = [];
          setupContextListeners();
        }
      };

      // Execute onBeforeMount callbacks
      for (const fn of this._beforeMountCbs) {
        try {
          fn();
        } catch (e) {
          console.error(e);
        }
      }
      this._beforeMountCbs = [];

      runBeforeHook(onBeforeMount, proceed);
    },

    update(input = {}) {
      if (!mounted) return;
      const nextProps = input.props ? input.props : input;

      const newOn = nextProps.on;
      if (newOn && newOn !== on) {
        on = newOn;
      }

      const merged = { ...props, ...nextProps };
      prevProps = { ...props };
      props = merged;
      api.props = props;

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

        for (const fn of this._unmountCbs) { try { fn(); } catch (e) { console.error(e); } }
        this._unmountCbs = [];
        localBus.clear(); // clear local listeners


        boundEvents.forEach(({ node, type, listener }) => {
          node.removeEventListener(type, listener);
        });
        boundEvents = [];

        contextUnsubs.forEach((unsub) => unsub());
        contextUnsubs = [];

        mounted = false;
        onBeforeMountDone = false;
        _renderedNull = true;
        onUnmount?.call(api);

        if (api._resetInternal) api._resetInternal();
      };

      runBeforeHook(onBeforeUnmount, cleanup);
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

  api.action = function (e) {
    return e.target.closest("[data-action]")?.dataset.action || null;
  };

  function setupContextListeners() {
    contextUnsubs = [];
    Object.entries(on).forEach(([key, handler]) => {
      if (key.includes("::")) {
        const bound = handler.bind(api);
        const unsub = context.subscribe(key, bound);
        contextUnsubs.push(unsub);
      }
    });
  }

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
        runBeforeHook(onBeforeUnmount, () => {
          // Remove all child nodes, not just first
          el.innerHTML = "";
          boundEvents.forEach(({ node, type, listener }) => {
            node.removeEventListener(type, listener);
          });
          boundEvents = [];
          mounted = false;
          _renderedNull = true;
          onUnmount?.call(api);
        });
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
      bindEvents(api, el, on, boundEvents);
      onMount?.call(api);
      return;
    }

    diffHTML(el, html);
    hydrateSlots(componentFn, props, api, slots);

    //    console.log("Rendered HTML:", html, el === null ? "null" : el.outerHTML, el === componentFn.el, el.isConnected)

    bindEvents(api, el, on, boundEvents);

    if (mounted && onUpdate) {
      onUpdate.call(api, prevProps);
    }
    _renderedNull = false;
    return html;
  }

  function runBeforeHook(hook, next) {
    if (hook) {
      if (hook.length) hook.call(api, next);
      else Promise.resolve(hook.call(api)).then(next);
    } else {
      next();
    }
  }

  let lastHtml = "";
  // Create the callable component function
  function componentFn(props = {}) {
    currentComponent = componentFn;
    lastHtml = componentFn._render(props);
    currentComponent = null;
    return componentFn;
  }

  // Add toString method to componentFn

  componentFn.toString = function () {
    return lastHtml ? String(lastHtml) : "";
  };

  // Attach API methods
  Object.assign(componentFn, api);

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

  return componentFn;
}

export function renderList(
  array,
  renderFn,
  keyFn = (item) => item.id ?? item.key ?? item
) {
  return array
    .map((item, index) => {
      const key = keyFn(item, index);
      const inner = renderFn(item, index);
      // Only add data-key if inner is string and starts with a tag
      if (typeof inner === "string") {
        return inner.replace(
          /^<([a-zA-Z0-9-]+)/,
          `<$1 data-key="${String(key).replace(/"/g, "&quot;")}"`
        );
      }
      return inner;
    })
    .join("");
}

// Usage in composables:
export function useCurrentComponent() {
  return currentComponent;
}
