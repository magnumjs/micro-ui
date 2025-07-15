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
  { onMount, onDestroy, events = {} } = {}
) {
  let el = null;
  let mounted = false;
  let props = {};
  let lastHTML = "";

  const api = {
    mount(target) {
      if (mounted) return;
      el = target;
      mounted = true;
      render(props);
      onMount?.call(api);
    },

    mountTo(selector) {
      const target = document.querySelector(selector);
      if (!target) throw new Error(`No element matches selector: ${selector}`);
      api.mount(target);
    },

    update(nextProps = {}) {
      if (!mounted) return;
      const changed = Object.keys(nextProps).some(
        (key) => nextProps[key] !== props[key]
      );

      if (changed) {
        props = { ...props, ...nextProps };
        api.props = props; // ✅ Keep api.props up-to-date for event handlers
        render(props);
      }
    },

    render(newProps = {}) {
      props = { ...props, ...newProps };
      api.props = props; // ✅ Same here for initial mount
      let html = typeof renderFn === "function" ? renderFn(props) : renderFn;

      if (typeof html === "string" && html.includes("<slot></slot>")) {
        html = html.replace("<slot></slot>", props.children ?? "");
      }
      if (html === lastHTML) return null; // No change
      return html;
    },

    get renderFn() {
      return renderFn;
    },
    destroy() {
      if (!mounted || !el) return;
      onDestroy?.call(api);
      el.innerHTML = "";
      mounted = false;
    },

    get el() {
      return el;
    },

    // props will now just be a normal property on api
  };

  function render(currentProps) {
    props = currentProps;
    const html = api.render(props);
    if (html === null) return; // ✅ skip rendering
    const replaced = diffHTML(html);
    bindEvents(replaced);
  }

  function diffHTML(newHTML) {
    if (!el) return false;

    const temp = document.createElement("div");
    temp.innerHTML = newHTML;

    const newChildren = Array.from(temp.children);
    const newKeyed = new Map();
    const oldKeyed = new Map();

    // Index new keyed nodes
    for (const child of newChildren) {
      const key = child.dataset.key;
      if (key) newKeyed.set(key, child);
    }

    // Index old keyed nodes
    for (const oldChild of Array.from(el.children)) {
      const key = oldChild.dataset.key;
      if (key) oldKeyed.set(key, oldChild);
    }

    // Clear container to reinsert in correct order
    el.innerHTML = "";

    for (const newChild of newChildren) {
      const key = newChild.dataset.key;
      if (key && oldKeyed.has(key)) {
        const existing = oldKeyed.get(key);
        // Shallow update content
        if (existing.innerHTML !== newChild.innerHTML) {
          existing.innerHTML = newChild.innerHTML;
        }
        el.appendChild(existing);
        oldKeyed.delete(key);
      } else {
        el.appendChild(newChild);
      }
    }

    // Remove stale nodes
    for (const leftover of oldKeyed.values()) {
      leftover.remove();
    }

    return true;
  }

  function bindEvents() {
    if (!el || !events) return;

    const root = el.firstElementChild;
    if (!root) return;

    Object.entries(events).forEach(([key, handler]) => {
      const [eventType, selector] = key.split(" ");
      if (!eventType) return;

      // Remove existing bound
      if (handler._bound) {
        root.removeEventListener(eventType, handler._bound);
      }

      const bound = (e) => {
        const match = selector ? e.target.closest(selector) : e.target;
        if (match && root.contains(match)) {
          handler.call(api, e);
        }
      };

      handler._bound = bound;
      root.addEventListener(eventType, bound);
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
      const hasWrapper =
        typeof inner === "string" && !inner.trim().startsWith("<div");
      return hasWrapper
        ? `<div data-key="${key}">${inner}</div>`
        : inner.replace(/^<div/, `<div data-key="${key}"`);
    })
    .join("");
}
