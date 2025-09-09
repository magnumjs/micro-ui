/*!
 * @magnumjs/micro-ui v1.11.4
 * Author: Michael Glazer
 * Website: https://github.com/magnumjs/micro-ui#readme
 */
function f(){let r=new Map;return{subscribe(t,o){r.has(t)||r.set(t,new Set);let e=r.get(t);return e.add(o),()=>e.delete(o)},emit(t,o){let e=r.get(t);if(e)for(let s of e)s(o)},clear(){r.clear()}}}function p(r){let t=r,o=new Set;function e(n){typeof t=="object"&&t!==null&&typeof n=="object"&&n!==null&&!Array.isArray(t)&&!Array.isArray(n)?t={...t,...n}:t=typeof n=="function"?n(t):n,o.forEach(i=>i(t))}function s(n){return o.add(n),n(t),()=>o.delete(n)}function c(){return t}return{get:c,setState:e,getState:c,subscribe:s}}var u=f(),a=new Map;function l(r,t={}){if(!a.has(r)){let o=p(t),e={...o,emit(s,c){o.setState(c),u.emit(`${r}::${s}`,o.getState())},on(s,c){return u.subscribe(`${r}::${s}`,c)}};a.set(r,e)}return a.get(r)}l.clear=()=>a.clear();function d(r,t,o=e=>e.id??e.key??e){return r.map((e,s)=>{let c=o(e,s),n=t(e,s);return typeof n=="string"?n.replace(/^<([a-zA-Z0-9-]+)/,`<$1 data-key="${String(c).replace(/"/g,"&quot;")}"`):n}).join("")}export{u as context,f as createChannelMap,p as createState,d as renderList,l as shared};
//# sourceMappingURL=magnumjs-micro-ui-utils.esm.js.map
