export function createState(initial) {
  let state = initial;
  const subs = new Set();

  function setState(next) {
    state = typeof next === 'function' ? next(state) : { ...state, ...next };
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

  return { get, setState, subscribe };
}

export function createComponent(renderFn, { onMount, onDestroy, events = {} } = {}) {
  let el = null;
  let mounted = false;
  let props = {};
  let lastHTML = '';

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
        render(props);
      }
    },

    render(newProps = {}) {
      props = { ...props, ...newProps };
      return typeof renderFn === 'function' ? renderFn(props) : renderFn;
    },

     get renderFn() {
      return renderFn;
    },
    destroy() {
      if (!mounted || !el) return;
      onDestroy?.call(api);
      el.innerHTML = '';
      mounted = false;
    },

    get el() {
      return el;
    },

    get props() {
      return props;
    },
  };

  function render(currentProps) {
    props = currentProps;
    const html = api.render(props);
    const replaced = diffHTML(html);
    bindEvents(replaced);
  }

  function diffHTML(newHTML) {
    if (!el) return false;

    const temp = document.createElement('div');
    temp.innerHTML = newHTML;

    const newChildren = Array.from(temp.children);
    const oldChildren = Array.from(el.children);

    const newKeys = newChildren.map((child) => child.dataset.key);
    const oldKeyMap = new Map(oldChildren.map((child) => [child.dataset.key, child]));

    // Clear container
    el.innerHTML = '';

    for (const newChild of newChildren) {
      const key = newChild.dataset.key;
      if (key && oldKeyMap.has(key)) {
        const existing = oldKeyMap.get(key);
        existing.innerHTML = newChild.innerHTML; // shallow update
        el.appendChild(existing);
      } else {
        el.appendChild(newChild);
      }
    }

    return true;
  }

function bindEvents() {
  if (!el || !events) return;

  const root = el.firstElementChild;
  if (!root) return;

  Object.entries(events).forEach(([key, handler]) => {
    const [eventType, selector] = key.split(' ');
    if (!eventType) return;

    // Remove existing bound
    if (handler._bound) {
      root.removeEventListener(eventType, handler._bound);
    }

    const bound = (e) => {
      const match = selector ? e.target.closest(selector) : e.target;
      if (match && root.contains(match)) {
        console.log(`[reactive-core] Event triggered: ${eventType} on`, match);
        handler.call(api, e);
      }
    };

    handler._bound = bound;
    root.addEventListener(eventType, bound);
  });
}


  return api;
}

export function renderList(array, renderFn, keyFn = (item) => item.id ?? item.key ?? item) {
  return array
    .map((item, index) => {
      const key = keyFn(item, index);
      return `<div data-key="${key}">${renderFn(item, index)}</div>`;
    })
    .join('');
}
