import Outlet from "./outlet.js";
import diffHTML from "./diffHTML.js";

export function createState(initial) {
  let state = initial;
  const subs = new Set();

  function setState(next) {
    state = typeof next === "function" ? next(state) : { ...state, ...next };
    subs.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    subs.add(fn);
    fn(state);
    return () => subs.delete(fn);
  }

  function get() {
    return state;
  }

  return { get, setState, getState: get, subscribe };
}

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

  const setState = (next) => {
    state = typeof next === "function" ? next(state) : { ...state, ...next };
    if (!renderScheduled) {
      renderScheduled = true;
      scheduledRenderProps = { ...props };
      queueMicrotask(() => {
        renderScheduled = false;
        render(scheduledRenderProps);
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

        render(props);

        if (!_renderedNull) {
          mounted = true;
          onMount?.call(api);
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

      render(props);
    },

    render(newProps = {}) {
      props = { ...props, ...newProps };
      api.props = props;
      let html =
        typeof renderFn === "function"
          ? renderFn.call(api, { state, setState, props, refs: api.refs })
          : renderFn;
      html = Outlet(html, props);
      return html;
    },

    _resetInternal: () => {
      _cachedNode = null;
      _renderedNull = false;
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

  function render(currentProps) {
    props = currentProps;
    api.props = props;

    const html = api.render(props);

    if (html === null || html === "") {
      if (!_renderedNull && el && el.firstChild) {
        const realNode = el.firstChild;
        _cachedNode = realNode.cloneNode(true);
        runBeforeHook(onBeforeUnmount, () => {
          if (el.contains(realNode)) {
            el.removeChild(realNode);
          }
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
      bindEvents();
      onMount?.call(api);
      return;
    }

    _renderedNull = false;

    diffHTML(el, html);
    api.refs = {};

    if (el) {
      el.querySelectorAll("[data-ref]").forEach((node) => {
        api.refs[node.dataset.ref] = node;
      });
    }

    bindEvents();

    if (mounted && onUpdate) {
      onUpdate.call(api, prevProps);
    }
  }

  function runBeforeHook(hook, next) {
    if (hook) {
      if (hook.length) hook.call(api, next);
      else Promise.resolve(hook.call(api)).then(next);
    } else {
      next();
    }
  }

  function bindEvents() {
    if (!el || !on) return;
    const root = el.firstElementChild;
    if (!root) return;

    Object.entries(on).forEach(([key, handler]) => {
      const [eventType, selector] = key.split(" ");
      if (!eventType) return;

      const bound = (e) => {
        const match = selector ? e.target.closest(selector) : e.target;
        if (match && root.contains(match)) {
          handler.call(api, {
            event: e,
            state,
            setState,
            props,
            refs: api.refs,
          });
        }
      };

      const marker = `__microBound_${eventType}_${selector || "root"}`;

      if (!root[marker]) {
        root.addEventListener(eventType, bound);
        root[marker] = true;
        boundEvents.push({ node: root, type: eventType, listener: bound });
      }
    });
  }

  return api;
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
