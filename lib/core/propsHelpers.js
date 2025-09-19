// Props and state helpers for micro-ui
// Includes merging, syncing, and shallow equality checks

// Merge new props, update prevProps, and sync api.props
// export function mergeAndSyncProps({ props, prevProps, api, newProps }) {
//   props = { ...props, ...newProps };
//   prevProps = { ...props };
//   api.props = props;
//   return { props, prevProps };
// }

// Shallow equality check for objects (used for props/state short-circuiting)
export function shallowEqual(objA, objB) {
  if (objA === objB) return true;
  if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object') return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (objA[keysA[i]] !== objB[keysA[i]]) return false;
  }
  return true;
}


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


// (Optional) Compare two HTML object strings by joining their values
// export function compareHtmlObjectStrings(html1, html2) {
//   return html1 && html2 && Object.values(html1).join('') === Object.values(html2).join('');
// }
