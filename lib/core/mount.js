// core/mount.js
// Extracted mount logic from createComponent for reuse and clarity
import { LIFECYCLE_STATE } from './hooks.js';

export function doMount({
  internals,
  componentFn,
  renderFn,
  setProps,
  setComponentRootAttr,
  setComponentKeyAttr,
  runNamedHook,
  runNamedBeforeHook,
  api,
  localKeyRegistry,
}) {
  return function mount(targetOrSelector, initialProps = {}) {
    if (internals.mounted || internals.onBeforeMountDone) {
      return;
    }

    let target =
      typeof targetOrSelector === 'string'
        ? document.querySelector(targetOrSelector)
        : targetOrSelector;

    if (!target) throw new Error(`No element matches: ${targetOrSelector}`);

    const proceed = () => {
      componentFn._lifecycleState = LIFECYCLE_STATE.MOUNTING;
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
        runNamedHook('onMount', undefined, false, componentFn);
      }
      if (internals.props.key) {
        localKeyRegistry.set(internals.props.key, componentFn);
      }
      componentFn._lifecycleState = LIFECYCLE_STATE.MOUNTED;
    };

    runNamedBeforeHook('onBeforeMount', proceed, componentFn);
  };
}
