/*!
 * @magnumjs/micro-ui v1.10.0
 * Author: Michael Glazer
 * Website: https://github.com/magnumjs/micro-ui#readme
 */
function f(){let e=new Map;return{subscribe(t,r){e.has(t)||e.set(t,new Set);let o=e.get(t);return o.add(r),()=>o.delete(r)},emit(t,r){let o=e.get(t);if(o)for(let n of o)n(r)},clear(){e.clear()}}}function l(e){let t=e,r=new Set;function o(s){typeof t=="object"&&t!==null&&typeof s=="object"&&s!==null&&!Array.isArray(t)&&!Array.isArray(s)?t={...t,...s}:t=typeof s=="function"?s(t):s,r.forEach(u=>u(t))}function n(s){return r.add(s),s(t),()=>r.delete(s)}function c(){return t}return{get:c,setState:o,getState:c,subscribe:n}}var i=f(),a=new Map;function p(e,t={}){if(!a.has(e)){let r=l(t),o={...r,emit(n,c){r.setState(c),i.emit(`${e}::${n}`,r.getState())},on(n,c){return i.subscribe(`${e}::${n}`,c)}};a.set(e,o)}return a.get(e)}p.clear=()=>a.clear();export{i as context,f as createChannelMap,l as createState,p as shared};
//# sourceMappingURL=magnumjs-micro-ui-utils.esm.js.map
