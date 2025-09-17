// Ref helpers for micro-ui
// Includes setupRefs and any future ref utilities
import getRef from '../get-refs.js';

export function setupRefs(api) {
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
}
