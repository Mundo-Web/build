import{V as y}from"./index.esm-B502ZfUP.js";import{m as u}from"./main-BBbUrZUL.js";import{G as A}from"./Global-mC9lKANG.js";/* empty css               *//* empty css              */import{G as C}from"./General-3RJWnWe_.js";const k=d=>{y({resolve:l=>`/${l}.jsx`,setup:({el:l,props:g})=>{const s=g.initialPage.props;if(s!=null&&s.global)for(const o in s.global)A.set(o,s.global[o]);if(s!=null&&s.generals)for(const o in s.generals){const{correlative:e,description:a}=s.generals[o];C.set(e,a)}const p=(o,...e)=>{var t,c,m,f;const a=[];if(Array.isArray(o))for(const n of o)a.push(...e.map(i=>`${n}.${i}`));else a.push(...e.map(n=>`${o}.${n}`));if((c=(t=s==null?void 0:s.session)==null?void 0:t.permissions)!=null&&c.find(n=>a.includes(n.name)||n.name=="general.root"))return!0;const r=((m=s==null?void 0:s.session)==null?void 0:m.roles)??[];for(const n of r)if((f=n==null?void 0:n.permissions)!=null&&f.find(i=>a.includes(i.name)||i.name=="general.root"))return!0;return!1},h=(...o)=>{var r;const e=[];return Array.isArray(o)?e.push(...o):e.push(o),!!(((r=s==null?void 0:s.session)==null?void 0:r.roles)??[]).find(t=>e.includes(t.name))};u.FetchParams.headers={Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(u.Cookies.get("XSRF-TOKEN"))},d(l,{...s,can:p,hasRole:h})}})};export{k as C};