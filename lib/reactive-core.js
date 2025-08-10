import Outlet from "./outlet.js";
import diffHTML from "./diffHTML.js";
import bindEvents from "./bindEvents.js";
export * from "./context.js";
import { context } from "./context.js";
import injectSlotContent from "./injectSlotContent.js";
import getRef from "./get-refs.js";

let id = 0;

export function createComponent(
  renderFn,
  {
    state: initialState = {},
    on = {},
    onMount,
    onUnmount,
    onBeforeMount,
    onBeforeUnmount,
    onUpdate,
  } = {}
) {
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

    mount(targetOrSelector, initialProps = {}) {
      if (mounted || onBeforeMountDone) return;

      let target =
        typeof targetOrSelector === "string"
          ? document.querySelector(targetOrSelector)
          : targetOrSelector;

      if (!target) throw new Error(`No element matches: ${targetOrSelector}`);

      const proceed = () => {
        onBeforeMountDone = true;
        el = target;

        props = { ...props, ...initialProps };
        prevProps = { ...props };
        api.props = props;

        componentFn(props);

        // ✅ Automatically hydrate component instances passed to props.children or props.slots
        let slotEntries = {
          ...(props.slots || {}),
        };

        if(typeof props.children ==='function' && props.children.mount) {
          slotEntries.children = props.children;
        } else {
          slotEntries = {...slotEntries, ...(props.children || {})}
        }

        Object.entries(slotEntries).forEach(([key, value]) => {
          const ntarget = componentFn.refs[key];

          if (!ntarget || value == null) return;
          injectSlotContent(ntarget, value);
        });

        bindEvents(api, el, on, boundEvents); // ✅ ensure this.el is hydrated before context

        if (!_renderedNull) {
          mounted = true;
          onMount?.call(componentFn);
          setupContextListeners();
          // syncInstanceToAPI(api, componentFn);
        }
      };

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

      if (mounted) {
        html = Outlet(html, props);
      }

      if (html) {
        html = new String(html);
        html._id = componentFn._id;
      }

      return html;
    },

    _resetInternal: () => {
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
    return getRef(this.el, name)
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
    props = currentProps;
    api.props = props;

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
          // syncInstanceToAPI(api, componentFn)
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
      // syncInstanceToAPI(api, componentFn);
      return;
    }

    _renderedNull = false;

    diffHTML(el, html);

    bindEvents(api, el, on, boundEvents);

    if (mounted && onUpdate) {
      onUpdate.call(api, prevProps);
    }
    // syncInstanceToAPI(api, componentFn);
  }

  function runBeforeHook(hook, next) {
    if (hook) {
      if (hook.length) hook.call(api, next);
      else Promise.resolve(hook.call(api)).then(next);
    } else {
      next();
    }
  }

  // Create the callable component function
  function componentFn(props = {}) {
    componentFn._render(props);
    // syncInstanceToAPI(api, componentFn);
    return componentFn;
  }

  // Attach API methods
  Object.assign(componentFn, api);

  // Dynamically attach instance-backed getters
  ["el", "props", "state", "setState"].forEach((key) => {
    Object.defineProperty(componentFn, key, {
      get() {
        return api[key];
      },
      enumerable: true,
    });
  });
  componentFn._render = render;
  componentFn.render = api.render;
  componentFn._id = id++;
  return componentFn;
}

// function syncInstanceToAPI(instance, componentFn) {
//   for (const key of Object.keys(instance)) {
//     if (!(key in componentFn)) {
//       Object.defineProperty(componentFn, key, {
//         get() {
//           return instance[key];
//         },
//         enumerable: true,
//       });
//     }
//   }
// }

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
