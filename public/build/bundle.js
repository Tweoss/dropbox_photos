var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function o(){return Object.create(null)}function i(e){e.forEach(n)}function a(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let s;function l(e,t){return s||(s=document.createElement("a")),s.href=t,e===s.href}function c(t,...n){if(null==t)return e;const o=t.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function d(e){let t;return c(e,(e=>t=e))(),t}function u(e,t,n){e.$$.on_destroy.push(c(t,n))}const m="undefined"!=typeof window;let h=m?()=>window.performance.now():()=>Date.now(),f=m?e=>requestAnimationFrame(e):e;const p=new Set;function _(e){p.forEach((t=>{t.c(e)||(p.delete(t),t.f())})),0!==p.size&&f(_)}function g(e,t){e.appendChild(t)}function v(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function w(e){const t=$("style");return function(e,t){g(e.head||e,t)}(v(e),t),t.sheet}function y(e,t,n){e.insertBefore(t,n||null)}function b(e){e.parentNode.removeChild(e)}function x(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function $(e){return document.createElement(e)}function k(e){return document.createTextNode(e)}function S(){return k(" ")}function E(){return k("")}function T(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function C(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function O(e,t,n,o){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,o?"important":"")}const z=new Map;let A,N=0;function j(e,t,n,o,i,a,r,s=0){const l=16.666/o;let c="{\n";for(let e=0;e<=1;e+=l){const o=t+(n-t)*a(e);c+=100*e+`%{${r(o,1-o)}}\n`}const d=c+`100% {${r(n,1-n)}}\n}`,u=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(d)}_${s}`,m=v(e),{stylesheet:h,rules:f}=z.get(m)||function(e,t){const n={stylesheet:w(t),rules:{}};return z.set(e,n),n}(m,e);f[u]||(f[u]=!0,h.insertRule(`@keyframes ${u} ${d}`,h.cssRules.length));const p=e.style.animation||"";return e.style.animation=`${p?`${p}, `:""}${u} ${o}ms linear ${i}ms 1 both`,N+=1,u}function L(e,t){const n=(e.style.animation||"").split(", "),o=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),i=n.length-o.length;i&&(e.style.animation=o.join(", "),N-=i,N||f((()=>{N||(z.forEach((e=>{const{stylesheet:t}=e;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.rules={}})),z.clear())})))}function R(e){A=e}function I(e){(function(){if(!A)throw new Error("Function called outside component initialization");return A})().$$.on_mount.push(e)}const P=[],U=[],K=[],D=[],M=Promise.resolve();let B=!1;function q(e){K.push(e)}const V=new Set;let Y,F=0;function H(){const e=A;do{for(;F<P.length;){const e=P[F];F++,R(e),J(e.$$)}for(R(null),P.length=0,F=0;U.length;)U.pop()();for(let e=0;e<K.length;e+=1){const t=K[e];V.has(t)||(V.add(t),t())}K.length=0}while(P.length);for(;D.length;)D.pop()();B=!1,V.clear(),R(e)}function J(e){if(null!==e.fragment){e.update(),i(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(q)}}function X(e,t,n){e.dispatchEvent(function(e,t,{bubbles:n=!1,cancelable:o=!1}={}){const i=document.createEvent("CustomEvent");return i.initCustomEvent(e,n,o,t),i}(`${t?"intro":"outro"}${n}`))}const G=new Set;let W;function Q(){W={r:0,c:[],p:W}}function Z(){W.r||i(W.c),W=W.p}function ee(e,t){e&&e.i&&(G.delete(e),e.i(t))}function te(e,t,n,o){if(e&&e.o){if(G.has(e))return;G.add(e),W.c.push((()=>{G.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}}const ne={duration:0};function oe(n,o,r){let s,l=o(n,r),c=!0;const d=W;function u(){const{delay:o=0,duration:a=300,easing:r=t,tick:u=e,css:m}=l||ne;m&&(s=j(n,1,0,a,o,r,m));const g=h()+o,v=g+a;q((()=>X(n,!1,"start"))),function(e){let t;0===p.size&&f(_),new Promise((n=>{p.add(t={c:e,f:n})}))}((e=>{if(c){if(e>=v)return u(0,1),X(n,!1,"end"),--d.r||i(d.c),!1;if(e>=g){const t=r((e-g)/a);u(1-t,t)}}return c}))}return d.r+=1,a(l)?(Y||(Y=Promise.resolve(),Y.then((()=>{Y=null}))),Y).then((()=>{l=l(),u()})):u(),{end(e){e&&l.tick&&l.tick(1,0),c&&(s&&L(n,s),c=!1)}}}const ie="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function ae(e){e&&e.c()}function re(e,t,o,r){const{fragment:s,on_mount:l,on_destroy:c,after_update:d}=e.$$;s&&s.m(t,o),r||q((()=>{const t=l.map(n).filter(a);c?c.push(...t):i(t),e.$$.on_mount=[]})),d.forEach(q)}function se(e,t){const n=e.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function le(e,t){-1===e.$$.dirty[0]&&(P.push(e),B||(B=!0,M.then(H)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function ce(t,n,a,r,s,l,c,d=[-1]){const u=A;R(t);const m=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:s,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(u?u.$$.context:[])),callbacks:o(),dirty:d,skip_bound:!1,root:n.target||u.$$.root};c&&c(m.root);let h=!1;if(m.ctx=a?a(t,n.props||{},((e,n,...o)=>{const i=o.length?o[0]:n;return m.ctx&&s(m.ctx[e],m.ctx[e]=i)&&(!m.skip_bound&&m.bound[e]&&m.bound[e](i),h&&le(t,e)),n})):[],m.update(),h=!0,i(m.before_update),m.fragment=!!r&&r(m.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);m.fragment&&m.fragment.l(e),e.forEach(b)}else m.fragment&&m.fragment.c();n.intro&&ee(t.$$.fragment),re(t,n.target,n.anchor,n.customElement),H()}R(u)}class de{$destroy(){se(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}class ue{constructor(e){this.path=e}async loadThumbnail(e,t="w64h64"){const n=await fetch("https://content.dropboxapi.com/2/files/get_thumbnail_v2",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Dropbox-API-Arg":`{"resource":{".tag":"path","path":"${this.path}"},"size":{".tag":"${t}"}}`}}),o=await n.blob();return URL.createObjectURL(o)}async loadImage(e){const t=await fetch("https://content.dropboxapi.com/2/files/download",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Dropbox-API-Arg":`{"path":"${this.path}"}`}}),n=await t.blob();return URL.createObjectURL(n)}async loadVideo(e,t){const n=await fetch("https://content.dropboxapi.com/2/files/download",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Dropbox-API-Arg":`{"path":"${t}"}`}}),o=await n.blob();return URL.createObjectURL(o)}}var me;!function(e){e.Image="Image",e.Video="video"}(me||(me={}));class he{constructor(e){this.dimensions=null,this.path=e}async init(e){const t=await fetch("https://api.dropboxapi.com/2/files/get_metadata",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({include_media_info:!0,path:this.path})}),n=await t.json();return this.name=n.name,this.last_modified=n.server_modified,this.time_taken=n.media_info.metadata.time_taken,this.dimensions=n.media_info.metadata.dimensions,"video"===n.media_info.metadata[".tag"]?(this.filetype=me.Video,this.duration=n.media_info.metadata.duration):"photo"===n.media_info.metadata[".tag"]&&(this.filetype=me.Image),this}}class fe{constructor(){this.is_selected=!1,this.metadata=null}async init(e,t){return this.metadata=await new he(t).init(e),this}set_live_video_data(e){this.live_video_metadata=e}}class pe{constructor(){this.entries=new Map}async valid_token_set(e,t){var n,o;const i=t||(null===(o=null===(n=e.split("#")[1])||void 0===n?void 0:n.split("&")[0])||void 0===o?void 0:o.split("=")[1]);return i?fetch("https://api.dropboxapi.com/2/check/user",{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify({})}).then((e=>{if(200==e.status)return this.access_token=i,!0})):Promise.resolve(!1)}redirect_to_auth(e){e.href=`https://www.dropbox.com/oauth2/authorize?client_id=nyma8gjtfb5kq8n&response_type=token&redirect_uri=${e.protocol}//${e.host+e.pathname}`}async build_index(e=""){let t=!0;for(;t;){const n=await fetch("https://api.dropboxapi.com/2/files/list_folder",{method:"POST",headers:{Authorization:`Bearer ${this.access_token}`,"Content-Type":"application/json"},body:JSON.stringify({path:e,recursive:!1})}),o=await n.json();t=o.has_more,await Promise.all(o.entries.map((async e=>(new fe).init(this.access_token,e.path_lower).then((t=>{this.entries.set(e.name,t)})))))}}collapse_index(){for(const[e,t]of this.entries)if(e.endsWith(".mov")){const n=this.entries.get(e.substring(0,e.length-4)+".JPG");n&&(n.set_live_video_data(t.metadata),this.entries.delete(e))}}get_sorted_permutation(){const e=[...this.entries.entries()].map((e=>[e[0],new Date(e[1].metadata.time_taken)]));return e.sort(((e,t)=>e[1].valueOf()-t[1].valueOf())),e.map((e=>e[0]))}get_sorted_event_array(){const e=this.get_sorted_permutation();let t=0,n=[],o=[];for(let r=0;r<e.length;r++){const s=e[r],l=this.entries.get(s);if(n[t]){const e=new Date(l.metadata.time_taken);i=e,a=o[t][0],Math.abs(i.getTime()-a.getTime())<288e5?(n[t].push(l),o[t].push(e)):(t+=1,n[t]=[l],o[t]=[new Date(l.metadata.time_taken)])}else n[t]=[l],o[t]=[new Date(l.metadata.time_taken)]}var i,a;return n}handle_keydown(e,t,n){var o;let i=t,a=!1;const r=e=>{e.preventDefault(),e.stopPropagation()};switch(e.key){case"ArrowLeft":0==i.entry_index?0!=i.event_index&&(i.event_index-=1,i.entry_index=n[i.event_index].length-1,a=!0):(i.entry_index-=1,a=!0),r(e);break;case"ArrowRight":i.entry_index==(null===(o=n[i.event_index])||void 0===o?void 0:o.length)-1?i.event_index!=n.length-1&&(i.event_index+=1,i.entry_index=0,a=!0):(i.entry_index+=1,a=!0),r(e);break;case"ArrowUp":i.file_info=!0,a=!0,r(e);break;case"ArrowDown":i.file_info=!1,a=!0,r(e);break;case" ":-1!=i.event_index&&-1!=i.entry_index&&(i.maximized=!i.maximized,a=!0,r(e));break;case"Escape":i.maximized&&(i.maximized=!1,a=!0,r(e))}return{new_store:i,updated:a}}}const _e=[];const ge=function(t,n=e){let o;const i=new Set;function a(e){if(r(t,e)&&(t=e,o)){const e=!_e.length;for(const e of i)e[1](),_e.push(e,t);if(e){for(let e=0;e<_e.length;e+=2)_e[e][0](_e[e+1]);_e.length=0}}}return{set:a,update:function(e){a(e(t))},subscribe:function(r,s=e){const l=[r,s];return i.add(l),1===i.size&&(o=n(a)||e),r(t),()=>{i.delete(l),0===i.size&&(o(),o=null)}}}}({event_index:-1,entry_index:-1,maximized:!1,file_info:!1});function ve(t){let n,o,a,r,s,c,d;return{c(){n=$("div"),o=$("img"),l(o.src,a=t[3])||C(o,"src",a),C(o,"alt",r=t[0].metadata.name),C(o,"class",s=(t[8].event_index==t[1]&&t[8].entry_index==t[2]?"selected":"")+" "+t[5].scale_class+" "+(t[4]?"maximized":"")+" svelte-1x37wnt"),O(o,"top",(t[4]?"0":t[5].top)+"%"),O(o,"left",(t[4]?"0":t[5].left)+"%"),C(n,"class","container svelte-1x37wnt")},m(e,i){y(e,n,i),g(n,o),t[11](o),c||(d=[T(o,"load",t[12],{once:!0}),T(o,"click",t[13]),T(o,"dblclick",t[14]),T(o,"touchstart",t[15]),T(o,"touchmove",t[16]),T(o,"touchend",t[17],{passive:!0})],c=!0)},p(e,[t]){8&t&&!l(o.src,a=e[3])&&C(o,"src",a),1&t&&r!==(r=e[0].metadata.name)&&C(o,"alt",r),310&t&&s!==(s=(e[8].event_index==e[1]&&e[8].entry_index==e[2]?"selected":"")+" "+e[5].scale_class+" "+(e[4]?"maximized":"")+" svelte-1x37wnt")&&C(o,"class",s),48&t&&O(o,"top",(e[4]?"0":e[5].top)+"%"),48&t&&O(o,"left",(e[4]?"0":e[5].left)+"%")},i:e,o:e,d(e){e&&b(n),t[11](null),c=!1,i(d)}}}function we(e,t,n){let o;u(e,ge,(e=>n(8,o=e)));let i,a,r,{ACCESS_TOKEN:s}=t,{image_entry:l}=t,{default_data:c=""}=t,{event_index:d}=t,{entry_index:m}=t,h=c,f=!1,p=!1;const _=new ue(l.metadata.path);let g={top:0,left:0,scale_class:""};const v=()=>{const e=l.metadata.dimensions;return e.height==e.width?{top:0,left:0,scale_class:""}:e.height>e.width?{top:0,left:100*(1-e.width/e.height)/2,scale_class:"width-auto"}:e.width>e.height?{top:100*(1-e.height/e.width)/2,left:0,scale_class:"height-auto"}:void 0},w=(e,t)=>{e[0].isIntersecting?a?n(3,h=a):_.loadThumbnail(s,"w256h256").then((e=>{a=e,!r&&URL.revokeObjectURL(r),n(3,h=a),n(5,g=v())})):!r&&_.loadThumbnail(s).then((e=>{r=e,n(3,h=r),n(5,g=v())}))};let y,b;I((()=>{y=new IntersectionObserver(w,{}),y.observe(b)})),ge.subscribe((e=>{f=e.event_index==d&&e.entry_index==m,e.maximized&&f?n(4,p=!0):n(4,p=!1),f&&b.scrollIntoView({behavior:"smooth",block:"center"}),(e.maximized&&Math.abs(e.event_index-d)<=1||f)&&(i?n(3,h=i):_.loadImage(s).then((e=>{i=e,n(3,h=i),n(5,g=v())})))}));let x={init:0,move:0};return e.$$set=e=>{"ACCESS_TOKEN"in e&&n(9,s=e.ACCESS_TOKEN),"image_entry"in e&&n(0,l=e.image_entry),"default_data"in e&&n(10,c=e.default_data),"event_index"in e&&n(1,d=e.event_index),"entry_index"in e&&n(2,m=e.entry_index)},[l,d,m,h,p,g,b,x,o,s,c,function(e){U[e?"unshift":"push"]((()=>{b=e,n(6,b)}))},()=>{URL.revokeObjectURL(h)},e=>{!p&&ge.update((e=>(e.event_index=d,e.entry_index=m,e)))},()=>{p?ge.update((e=>(e.maximized=!1,e))):ge.update((e=>(e.maximized=!0,e)))},e=>{p&&n(7,x.init=e.touches[0].clientY,x)},e=>{p&&n(7,x.move=e.touches[0].clientY,x)},()=>{if(!p)return;x.init-x.move<-30&&ge.update((e=>(e.maximized=!1,e)))}]}class ye extends de{constructor(e){super(),ce(this,e,we,ve,r,{ACCESS_TOKEN:9,image_entry:0,default_data:10,event_index:1,entry_index:2})}}function be(t){let n,o,a,r,s,c,d,u,m,h,f,p;return{c(){n=$("div"),o=$("video"),a=$("source"),s=k("\n        Sorry, your browser doesn't support embedded videos."),u=S(),m=$("i"),l(a.src,r=t[3])||C(a,"src",r),C(a,"type","video/mp4"),C(o,"poster",t[2]),C(o,"class",c=(t[4]?"selected":"")+" "+t[6].scale_class+" "+(t[5]?"maximized":"")+" svelte-2svk1m"),O(o,"top",(t[5]?"0":t[6].top)+"%"),O(o,"left",(t[5]?"0":t[6].left)+"%"),o.controls=d=t[5]||null,o.playsInline=!0,O(m,"top",t[6].top+"%"),O(m,"left",t[6].left+"%"),O(m,"color","lightgray"),C(m,"class",h=(t[7]?"fa fa-play-circle-o ":"")+" "+(t[5]?"hidden":"")+" svelte-2svk1m"),C(n,"class","container svelte-2svk1m")},m(e,i){y(e,n,i),g(n,o),g(o,a),g(o,s),t[12](o),g(n,u),g(n,m),f||(p=[T(o,"load",t[13],{once:!0}),T(o,"focus",t[14]),T(o,"mouseover",t[15]),T(o,"mouseleave",t[16]),T(o,"click",t[17]),T(o,"dblclick",t[18]),T(o,"touchstart",t[19]),T(o,"touchmove",t[20]),T(o,"touchend",t[21],{passive:!0})],f=!0)},p(e,[t]){8&t&&!l(a.src,r=e[3])&&C(a,"src",r),4&t&&C(o,"poster",e[2]),112&t&&c!==(c=(e[4]?"selected":"")+" "+e[6].scale_class+" "+(e[5]?"maximized":"")+" svelte-2svk1m")&&C(o,"class",c),96&t&&O(o,"top",(e[5]?"0":e[6].top)+"%"),96&t&&O(o,"left",(e[5]?"0":e[6].left)+"%"),32&t&&d!==(d=e[5]||null)&&(o.controls=d),64&t&&O(m,"top",e[6].top+"%"),64&t&&O(m,"left",e[6].left+"%"),160&t&&h!==(h=(e[7]?"fa fa-play-circle-o ":"")+" "+(e[5]?"hidden":"")+" svelte-2svk1m")&&C(m,"class",h)},i:e,o:e,d(e){e&&b(n),t[12](null),f=!1,i(p)}}}function xe(e,t,n){let o,i,a,{ACCESS_TOKEN:r}=t,{image_entry:s}=t,{default_data:l=""}=t,{event_index:c}=t,{entry_index:d}=t,u=l,m=null,h=!1,f=!1;const p=new ue(s.metadata.path);let _={top:0,left:0,scale_class:""};const g=()=>{const e=s.metadata.dimensions;return e.height==e.width?{top:0,left:0,scale_class:""}:e.height>e.width?{top:0,left:100*(1-e.width/e.height)/2,scale_class:"width-auto"}:e.width>e.height?{top:100*(1-e.height/e.width)/2,left:0,scale_class:"height-auto"}:void 0},v=(e,t)=>{e[0].isIntersecting?(i?n(2,u=i):p.loadThumbnail(r,"w640h480").then((e=>{i=e,n(2,u=i),n(6,_=g())})),!m&&p.loadVideo(r,s.live_video_metadata.path).then((e=>{n(3,m=e)}))):!a&&p.loadThumbnail(r).then((e=>{a=e,n(2,u=a),n(6,_=g())}))};let w,y;I((()=>{w=new IntersectionObserver(v,{root:void 0}),w.observe(y)})),ge.subscribe((e=>{n(4,h=e.event_index==c&&e.entry_index==d),e.maximized&&h?(n(5,f=!0),y.play()):n(5,f=!1),h&&(y.scrollIntoView({behavior:"smooth",block:"center"}),o?n(2,u=o):p.loadImage(r).then((e=>{o=e,n(2,u=o),n(6,_=g())})))}));let b={init:0,move:0};return e.$$set=e=>{"ACCESS_TOKEN"in e&&n(9,r=e.ACCESS_TOKEN),"image_entry"in e&&n(10,s=e.image_entry),"default_data"in e&&n(11,l=e.default_data),"event_index"in e&&n(0,c=e.event_index),"entry_index"in e&&n(1,d=e.entry_index)},[c,d,u,m,h,f,_,y,b,r,s,l,function(e){U[e?"unshift":"push"]((()=>{y=e,n(7,y)}))},()=>{URL.revokeObjectURL(m),URL.revokeObjectURL(u)},()=>{!f&&y.play()},()=>{!f&&y.play().then((()=>{}),(()=>{}))},()=>{f||(y.pause(),n(7,y.currentTime=0,y),y.load())},e=>{!f&&e.target==y&&ge.update((e=>(e.event_index=c,e.entry_index=d,e)))},()=>{f?ge.update((e=>(e.maximized=!1,e))):ge.update((e=>(e.maximized=!0,e)))},e=>{f&&n(8,b.init=e.touches[0].clientY,b)},e=>{f&&n(8,b.move=e.touches[0].clientY,b)},()=>{if(!f)return;b.init-b.move<-30&&ge.update((e=>(e.maximized=!1,e)))}]}class $e extends de{constructor(e){super(),ce(this,e,xe,be,r,{ACCESS_TOKEN:9,image_entry:10,default_data:11,event_index:0,entry_index:1})}}function ke(e,t,n){const o=e.slice();return o[4]=t[n],o[6]=n,o}function Se(t){let n,o;return{c(){n=$("img"),l(n.src,o="placeholder.png")||C(n,"src","placeholder.png"),C(n,"alt","placeholder")},m(e,t){y(e,n,t)},p:e,i:e,o:e,d(e){e&&b(n)}}}function Ee(e){let t,n,o,i;const a=[Ce,Te],r=[];function s(e,t){return e[4].live_video_metadata?0:1}return t=s(e),n=r[t]=a[t](e),{c(){n.c(),o=E()},m(e,n){r[t].m(e,n),y(e,o,n),i=!0},p(e,i){let l=t;t=s(e),t===l?r[t].p(e,i):(Q(),te(r[l],1,1,(()=>{r[l]=null})),Z(),n=r[t],n?n.p(e,i):(n=r[t]=a[t](e),n.c()),ee(n,1),n.m(o.parentNode,o))},i(e){i||(ee(n),i=!0)},o(e){te(n),i=!1},d(e){r[t].d(e),e&&b(o)}}}function Te(e){let t,n;return t=new ye({props:{ACCESS_TOKEN:e[0],image_entry:e[4],default_data:"./placeholder.png",event_index:e[2],entry_index:e[6]}}),{c(){ae(t.$$.fragment)},m(e,o){re(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.ACCESS_TOKEN=e[0]),2&n&&(o.image_entry=e[4]),4&n&&(o.event_index=e[2]),t.$set(o)},i(e){n||(ee(t.$$.fragment,e),n=!0)},o(e){te(t.$$.fragment,e),n=!1},d(e){se(t,e)}}}function Ce(e){let t,n;return t=new $e({props:{ACCESS_TOKEN:e[0],image_entry:e[4],default_data:"./placeholder.png",event_index:e[2],entry_index:e[6]}}),{c(){ae(t.$$.fragment)},m(e,o){re(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.ACCESS_TOKEN=e[0]),2&n&&(o.image_entry=e[4]),4&n&&(o.event_index=e[2]),t.$set(o)},i(e){n||(ee(t.$$.fragment,e),n=!0)},o(e){te(t.$$.fragment,e),n=!1},d(e){se(t,e)}}}function Oe(e){let t,n,o,i;const a=[Ee,Se],r=[];function s(e,t){return e[4].metadata.filetype==me.Image?0:1}return t=s(e),n=r[t]=a[t](e),{c(){n.c(),o=E()},m(e,n){r[t].m(e,n),y(e,o,n),i=!0},p(e,i){let l=t;t=s(e),t===l?r[t].p(e,i):(Q(),te(r[l],1,1,(()=>{r[l]=null})),Z(),n=r[t],n?n.p(e,i):(n=r[t]=a[t](e),n.c()),ee(n,1),n.m(o.parentNode,o))},i(e){i||(ee(n),i=!0)},o(e){te(n),i=!1},d(e){r[t].d(e),e&&b(o)}}}function ze(e){let t,n,o,i,a=e[1],r=[];for(let t=0;t<a.length;t+=1)r[t]=Oe(ke(e,a,t));const s=e=>te(r[e],1,1,(()=>{r[e]=null}));return{c(){t=$("div"),n=$("h2"),n.textContent=`${e[3]()}`,o=S();for(let e=0;e<r.length;e+=1)r[e].c();C(n,"class","timestamps svelte-16t62c2"),C(t,"class","svelte-16t62c2")},m(e,a){y(e,t,a),g(t,n),g(t,o);for(let e=0;e<r.length;e+=1)r[e].m(t,null);i=!0},p(e,[n]){if(7&n){let o;for(a=e[1],o=0;o<a.length;o+=1){const i=ke(e,a,o);r[o]?(r[o].p(i,n),ee(r[o],1)):(r[o]=Oe(i),r[o].c(),ee(r[o],1),r[o].m(t,null))}for(Q(),o=a.length;o<r.length;o+=1)s(o);Z()}},i(e){if(!i){for(let e=0;e<a.length;e+=1)ee(r[e]);i=!0}},o(e){r=r.filter(Boolean);for(let e=0;e<r.length;e+=1)te(r[e]);i=!1},d(e){e&&b(t),x(r,e)}}}function Ae(e,t,n){let{ACCESS_TOKEN:o}=t,{event_contents:i=[]}=t,{event_index:a}=t;return e.$$set=e=>{"ACCESS_TOKEN"in e&&n(0,o=e.ACCESS_TOKEN),"event_contents"in e&&n(1,i=e.event_contents),"event_index"in e&&n(2,a=e.event_index)},[o,i,a,()=>{let e=new Date(i[0].metadata.time_taken),t=new Date(i[i.length-1].metadata.time_taken);return e.setTime(e.getTime()+60*e.getTimezoneOffset()*1e3),t.setTime(t.getTime()+60*t.getTimezoneOffset()*1e3),1==i.length||i[0].metadata.time_taken==i[i.length-1].metadata.time_taken?e.toLocaleDateString("en-US",{dateStyle:"full"})+", "+e.getHours().toString().padStart(2,"0")+":"+e.getMinutes().toString().padStart(2,"0"):e.getDate()==t.getDate()&&e.getMonth()==t.getMonth()&&e.getFullYear()==t.getFullYear()?`${e.toLocaleString("en-US",{dateStyle:"full",timeStyle:"short",hour12:!1})}-${t.getHours().toString().padStart(2,"0")}:${t.getMinutes().toString().padStart(2,"0")}`:`${e.toLocaleString("en-US",{dateStyle:"full",timeStyle:"short",hour12:!1})}—${t.toLocaleString("en-US",{dateStyle:"full",timeStyle:"short",hour12:!1})}`}]}class Ne extends de{constructor(e){super(),ce(this,e,Ae,ze,r,{ACCESS_TOKEN:0,event_contents:1,event_index:2})}}function je(e){let t,n,o,i,a,r;return{c(){t=$("button"),n=k(e[1]),C(t,"class","svelte-16krlth")},m(o,s){y(o,t,s),g(t,n),i=!0,a||(r=T(t,"click",e[2]),a=!0)},p(e,t){(!i||2&t)&&function(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}(n,e[1])},i(e){i||(o&&o.end(1),i=!0)},o(n){o=oe(t,e[3],{duration:1e3}),i=!1},d(e){e&&b(t),e&&o&&o.end(),a=!1,r()}}}function Le(e){let t,n,o,a,r=e[0]&&je(e);return{c(){r&&r.c(),t=E()},m(i,s){r&&r.m(i,s),y(i,t,s),n=!0,o||(a=[T(window,"click",e[4]),T(window,"keydown",e[5])],o=!0)},p(e,[n]){e[0]?r?(r.p(e,n),1&n&&ee(r,1)):(r=je(e),r.c(),ee(r,1),r.m(t.parentNode,t)):r&&(Q(),te(r,1,1,(()=>{r=null})),Z())},i(e){n||(ee(r),n=!0)},o(e){te(r),n=!1},d(e){r&&r.d(e),e&&b(t),o=!1,i(a)}}}function Re(e,t,n){let o=!0;var i;i=navigator.userAgent||navigator.vendor,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(i)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(i.slice(0,4)))&&n(0,o=!1);let a="Interact to enable video!";const r=()=>{n(1,a="Enabled!"),n(0,o=!1)};return[o,a,r,function(e,{duration:t}){return{duration:t,css:e=>`\n                transform: scale(${function(e){const t=e-1;return t*t*t+1}(e)});\n                `}},e=>r(),e=>r()]}class Ie extends de{constructor(e){super(),ce(this,e,Re,Le,r,{})}}const{window:Pe}=ie;function Ue(e,t,n){const o=e.slice();return o[8]=t[n],o[10]=n,o}function Ke(e){let t,n;return t=new Ne({props:{ACCESS_TOKEN:e[3].access_token,event_contents:e[8],event_index:e[10]}}),{c(){ae(t.$$.fragment)},m(e,o){re(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.event_contents=e[8]),t.$set(o)},i(e){n||(ee(t.$$.fragment,e),n=!0)},o(e){te(t.$$.fragment,e),n=!1},d(e){se(t,e)}}}function De(e){let t;return{c(){t=$("div"),t.innerHTML="<p>HI</p>"},m(e,n){y(e,t,n)},d(e){e&&b(t)}}}function Me(e){let t,n,o,a,r,s,l,c,d,u,m;s=new Ie({});let h=e[0],f=[];for(let t=0;t<h.length;t+=1)f[t]=Ke(Ue(e,h,t));const p=e=>te(f[e],1,1,(()=>{f[e]=null}));let _=e[2].file_info&&De();return{c(){t=$("main"),n=$("link"),o=S(),a=$("h1"),a.textContent="🐟Photos🐈",r=S(),ae(s.$$.fragment),l=S();for(let e=0;e<f.length;e+=1)f[e].c();c=S(),_&&_.c(),C(n,"rel","stylesheet"),C(n,"href","https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"),C(a,"class","svelte-d9gu0h"),C(t,"class","svelte-d9gu0h")},m(i,h){y(i,t,h),g(t,n),g(t,o),g(t,a),g(t,r),re(s,t,null),g(t,l);for(let e=0;e<f.length;e+=1)f[e].m(t,null);g(t,c),_&&_.m(t,null),d=!0,u||(m=[T(Pe,"keydown",e[4]),T(Pe,"touchstart",e[5]),T(Pe,"touchmove",e[6]),T(Pe,"touchend",e[7])],u=!0)},p(e,[n]){if(9&n){let o;for(h=e[0],o=0;o<h.length;o+=1){const i=Ue(e,h,o);f[o]?(f[o].p(i,n),ee(f[o],1)):(f[o]=Ke(i),f[o].c(),ee(f[o],1),f[o].m(t,c))}for(Q(),o=h.length;o<f.length;o+=1)p(o);Z()}e[2].file_info?_||(_=De(),_.c(),_.m(t,null)):_&&(_.d(1),_=null)},i(e){if(!d){ee(s.$$.fragment,e);for(let e=0;e<h.length;e+=1)ee(f[e]);d=!0}},o(e){te(s.$$.fragment,e),f=f.filter(Boolean);for(let e=0;e<f.length;e+=1)te(f[e]);d=!1},d(e){e&&b(t),se(s),x(f,e),_&&_.d(),u=!1,i(m)}}}function Be(e,t,n){let o;u(e,ge,(e=>n(2,o=e)));let i=[],a=new pe;a.valid_token_set(window.location.href).then((e=>e?0:a.redirect_to_auth(window.location))).then((()=>{console.log(a),a.build_index("/photos").then((()=>{a.collapse_index(),n(0,i=a.get_sorted_event_array())}))}));let r={init:0,move:0};return[i,r,o,a,e=>{let{new_store:t,updated:n}=a.handle_keydown(e,d(ge),i);n&&ge.set(t)},e=>{n(1,r.init=e.touches[0].clientX,r)},e=>{n(1,r.move=e.touches[0].clientX,r)},()=>{const e=r.init-r.move,t=e=>{let{new_store:t,updated:n}=a.handle_keydown(new KeyboardEvent("keydown",{key:e}),d(ge),i);n&&ge.set(t)};e>100?t("ArrowRight"):e<-100&&t("ArrowLeft")}]}return new class extends de{constructor(e){super(),ce(this,e,Be,Me,r,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
