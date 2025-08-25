export function syncInstanceToAPI(instance, componentFn) {
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
