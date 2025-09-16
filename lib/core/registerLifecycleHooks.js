// Registers lifecycle hooks from options into the api
export function registerLifecycleHooks(api, options) {
  const { onMount, onUnmount, onBeforeMount, onBeforeUnmount, onUpdate, onBeforeRender } = options;
  if (onMount) api.onMount(onMount);
  if (onUnmount) api.onUnmount(onUnmount);
  if (onBeforeMount) api.onBeforeMount(onBeforeMount);
  if (onBeforeUnmount) api.onBeforeUnmount(onBeforeUnmount);
  if (onUpdate) api.onUpdate(onUpdate);
  if (onBeforeRender) api.onBeforeRender(onBeforeRender);
}
