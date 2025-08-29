/*!
 * @magnumjs/micro-ui v1.7.0
 * Author: Michael Glazer
 * Website: https://github.com/magnumjs/micro-ui#readme
 */
function f(){let e=new Map;return{subscribe(t,r){e.has(t)||e.set(t,new Set);let n=e.get(t);return n.add(r),()=>n.delete(r)},emit(t,r){let n=e.get(t);if(n)for(let o of n)o(r)},clear(){e.clear()}}}function l(e){let t=e,r=new Set;function n(s){typeof t=="object"&&t!==null&&typeof s=="object"&&s!==null&&!Array.isArray(t)&&!Array.isArray(s)?t={...t,...s}:t=typeof s=="function"?s(t):s,r.forEach(u=>u(t))}function o(s){return r.add(s),s(t),()=>r.delete(s)}function c(){return t}return{get:c,setState:n,getState:c,subscribe:o}}var i=f(),a=new Map;function p(e,t={}){if(!a.has(e)){let r=l(t),n={...r,emit(o,c){r.setState(c),i.emit(`${e}::${o}`,r.getState())},on(o,c){return i.subscribe(`${e}::${o}`,c)}};a.set(e,n)}return a.get(e)}p.clear=()=>a.clear();export{i as context,f as createChannelMap,l as createState,p as shared};
//# sourceMappingURL=magnumjs-micro-ui-context.esm.js.map
