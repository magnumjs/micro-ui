import { createComponent } from '../reactive-core';
// Helper for child instance caching logic in createComponent
export function getChildInstance({ parent, componentFn, props }) {
  if (parent._childCallIndex == null) parent._childCallIndex = 0;
  if (!parent._childCallCache) parent._childCallCache = {};
  // Use a composite cache key: key + component id for keyed, index + component id for non-keyed
  let cacheKey;
  if (props.key != null) {
    cacheKey = `key:${props.key}|comp:${componentFn._id}`;
  } else {
    cacheKey = `idx:${parent._childCallIndex++}|comp:${componentFn._id}`;
  }
  let inst = parent._childCallCache[cacheKey];

  if (!inst || inst._templateSource !== componentFn) {
    inst = __cloneFromTemplate(componentFn, props);
    inst._isChild = true;
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

// --- INTERNAL: clone a component from a frozen template (no mount yet) ---

export function __cloneFromTemplate(sourceComp, initialProps = {}) {
  const tpl = sourceComp._frozenTemplate;
  const clone = createComponent(tpl.renderFn, tpl.options);
  clone._initialProps = { ...initialProps };
  clone._templateSource = sourceComp;
  // Reset internal state to the original template
  clone._resetInternal();
  // Set initial props
  clone.setProps(initialProps);

  return clone;
}
