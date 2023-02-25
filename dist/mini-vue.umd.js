(function(u,i){typeof exports=="object"&&typeof module!="undefined"?i(exports):typeof define=="function"&&define.amd?define(["exports"],i):(u=typeof globalThis!="undefined"?globalThis:u||self,i(u.MiniVue={}))})(this,function(u){"use strict";function i(e,t){e.props=t||{}}const b=Object.assign,l=e=>typeof e=="object"&&e!==null,h=e=>{throw new Error(e)},I=e=>/^on[A-Z]/.test(e),T=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),S=e=>e.charAt(0).toUpperCase()+e.slice(1),g=e=>e.split("-").map(t=>S(t)).join(""),H=e=>e?`on${g(e)}`:"",w={$el:e=>e.vnode.el,$slots:e=>e.slots},M={get({_:e},t){const{setupState:n,props:o}=e;if(T(n,t))return n[t];if(T(o,t))return o[t];const r=w[t];if(r)return r(e)}};function D(e,t,...n){const{props:o}=e,r=H(t),c=o[r];c&&c(...n)}var s=(e=>(e[e.ELEMENT=1]="ELEMENT",e[e.STATEFUL_COMPONENT=2]="STATEFUL_COMPONENT",e[e.TEXT_CHILDREN=4]="TEXT_CHILDREN",e[e.ARRAY_CHILDREN=8]="ARRAY_CHILDREN",e[e.SLOT_CHILDREN=16]="SLOT_CHILDREN",e))(s||{});function P(e,t){e.vnode.shapeFlag&s.SLOT_CHILDREN&&j(t,e.slots)}function j(e,t){if(l(e))for(const n in e){const o=e[n];t[n]=r=>x(o(r))}}function x(e){return Array.isArray(e)?e:[e]}const $=new WeakMap;function v(e,t,n){const o=$.get(e);if(!o)throw new Error(`not found ${e}`);const r=o.get(t);if(!r)throw new Error(`not found ${t} in ${e}`);F(r)}function F(e){for(const t of e)t.scheduler?t.scheduler():t.run()}const U=a(),Y=N(),V=a(!0),z=N(!0),G=a(!0,!0);function a(e=!1,t=!1){return function(o,r){let c=Reflect.get(o,r);return r===d.IS_REACTIVE?!e:r===d.IS_READONLY?e:(t||l(c)&&(c=e?W(c):K(c)),c)}}function N(e=!1){return function(n,o,r){if(e)return console.warn(`${o} is readonly, target can not be set, ${n}`),!0;const c=Reflect.set(n,o,r);return v(n,o),c}}const X={get:U,set:Y},_={get:V,set:z},q=b({},_,{get:G});var d=(e=>(e.IS_REACTIVE="__v_isReactive__",e.IS_READONLY="__v_isReadonly__",e))(d||{});function K(e){return E(e,X)}function W(e){return E(e,_)}function Z(e){return E(e,q)}function E(e,t){return l(e)?new Proxy(e,t):(console.warn(`target ${e} is not a object`),e)}function B(e){const t={vnode:e,type:e.type,setupState:{},props:{},emit:()=>{},emits:[],slots:{}};return t.emit=D.bind(null,t),t}function J(e){i(e,e.vnode.props),P(e,e.vnode.children),Q(e)}function Q(e){const t=e.type,{setup:n}=t;if(n){R(e);const o=n(Z(e.props),{emit:e.emit});R(null),k(e,o)}e.proxy=new Proxy({_:e},M)}function k(e,t){typeof t=="object"&&(e.setupState=t),ee(e)}function ee(e){const t=e.type;t.render&&(e.render=t.render)}let C=null;function te(){return C}function R(e){C=e}const y=Symbol("Fragment"),L=Symbol("Text");function f(e,t,n){const o={type:e,props:t,children:n,el:null,shapeFlag:oe(e)};return typeof n=="string"?o.shapeFlag|=s.TEXT_CHILDREN:Array.isArray(n)?o.shapeFlag|=s.ARRAY_CHILDREN:o.shapeFlag&s.STATEFUL_COMPONENT&&l(o.children)&&(o.shapeFlag|=s.SLOT_CHILDREN),o}function ne(e){return f(L,{},e)}function oe(e){return typeof e=="string"?s.ELEMENT:s.STATEFUL_COMPONENT}function re(e,t){m(e,t)}function m(e,t){const{shapeFlag:n,type:o}=e;switch(o){case y:se(e,t);break;case L:ce(e,t);break;default:n&s.ELEMENT?ue(e,t):n&s.STATEFUL_COMPONENT&&fe(e,t);break}}function ce(e,t){const{children:n}=e,o=e.el=document.createTextNode(n);t.append(o)}function se(e,t){A(e,t)}function ue(e,t){ie(e,t)}function ie(e,t){const{children:n,props:o,shapeFlag:r}=e,c=document.createElement(e.type);e.el=c,n&&(r&s.TEXT_CHILDREN?c.textContent=n:r&s.ARRAY_CHILDREN&&A(e,c));for(const p in o){const O=o[p];if(I(p)){const me=p.slice(2).toLowerCase();c.addEventListener(me,O)}else c.setAttribute(p,O)}t.appendChild(c)}function A(e,t){e.children.forEach(n=>{m(n,t)})}function fe(e,t){le(e,t)}function le(e,t){const n=B(e);J(n),pe(n,e,t)}function pe(e,t,n){var c;const{proxy:o}=e,r=(c=e.render)==null?void 0:c.call(o);r&&m(r,n),t.el=r.el}function ae(e){return{mount(t){const n=f(e);let o;typeof t=="string"?o=document.querySelector(t):o=t,t||h(`can not find element ${t} on document`),re(n,o)}}}function de(e,t,n){return f(e,t,n)}function Ee(e,t,n){const o=e[t];if(o&&typeof o=="function")return f(y,{},o(n))}u.createApp=ae,u.createTextNode=ne,u.createVNode=f,u.getCurrentInstance=te,u.h=de,u.renderSlots=Ee,Object.defineProperties(u,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
