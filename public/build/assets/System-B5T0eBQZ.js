var ne=Object.defineProperty;var te=(s,r,t)=>r in s?ne(s,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[r]=t;var D=(s,r,t)=>(te(s,typeof r!="symbol"?r+"":r,t),t);import{j as e}from"./AboutHeader-Bdo2C3ON.js";import{r as u}from"./index-DFv2mRv-.js";import{c as re}from"./ReactAppend-CwiwA4iz.js";import{C as ie}from"./CreateReactScript-D-eDfVKV.js";import{i as W}from"./tippy-react.esm-BVvHiWwH.js";import{m as R}from"./main-BBbUrZUL.js";import{B as le}from"./BasicEditing-Ce9hwHaI.js";import{S as V}from"./SwitchFormGroup-CHRdLToT.js";import{G as Q}from"./Global-mC9lKANG.js";import{S as X}from"./SortByAfterField-BaS5rBg8.js";import{I as q}from"./InputFormGroup-Di7UVG_e.js";import{M as L}from"./Modal-C9s5p_Ex.js";import{S as z}from"./SelectFormGroup-BrarcXCi.js";import{S as ae}from"./SetSelectValue-UxyCmHse.js";import{a as ce,M as U}from"./MenuItemContainer-xrd2f-pb.js";import{M as oe}from"./Modal-41duzYEO.js";import"./index-DgyC5pTR.js";import"./index.esm-B502ZfUP.js";import"./___vite-browser-external_commonjs-proxy-BQdpDcDf.js";/* empty css               *//* empty css              */class A extends le{constructor(){super(...arguments);D(this,"path","admin/system");D(this,"savePage",async(t={})=>{try{const{status:i,result:l}=await R.Fetch(`/api/${this.path}/page`,{method:"POST",body:JSON.stringify(t)});if(!i)throw new Error((l==null?void 0:l.message)||"Ocurrio un error inesperado");return l.data??[]}catch(i){return R.Notify.add({icon:"/assets/img/icon.svg",title:"Error",body:i.message,type:"danger"}),null}});D(this,"updateOrder",async t=>{try{const{status:i,result:l}=await R.Fetch(`/api/${this.path}/order`,{method:"PATCH",body:JSON.stringify(t)});if(!i)throw new Error((l==null?void 0:l.message)??"Ocurrio un error inesperado");return!0}catch(i){R.Notify.add({icon:"/assets/img/icon.svg",title:"Error",body:i.message,type:"danger"})}});D(this,"deletePage",async t=>{try{const{status:i,result:l}=await R.Fetch(`/api/${this.path}/page/${t}`,{method:"DELETE"});if(!i)throw new Error((l==null?void 0:l.message)||"Ocurrio un error inesperado");return l.data??!0}catch(i){return R.Notify.add({icon:"/assets/img/icon.svg",title:"Error",body:i.message,type:"danger"}),!1}});D(this,"exportBK",async()=>{try{const{status:t,result:i}=await R.Fetch(`/api/${this.path}/backup`);if(!t)throw new Error((i==null?void 0:i.message)||"Ocurrio un error inesperado");return i}catch(t){return R.Notify.add({icon:"/assets/img/icon.svg",title:"Error",body:t.message,type:"danger"}),null}});D(this,"importBK",async t=>{try{const i=await fetch(`/api/${this.path}/backup`,{method:"POST",headers:{"X-Xsrf-Token":decodeURIComponent(R.Cookies.get("XSRF-TOKEN"))},body:t}),l=JSON.parseable(await i.text());if(!i.ok)throw new Error((l==null?void 0:l.message)||"Ocurrio un error inesperado");return l??!0}catch(i){return R.Notify.add({icon:"/assets/img/icon.svg",title:"Error",body:i.message,type:"danger"}),null}})}}const J=(s="")=>{s=s.replace(/[^a-zA-Z0-9_{}]/g,"");const r=/{([^}]+)}/g,t=[];let i;for(;(i=r.exec(s))!==null;)t.push(i[1]);return t},me=(s,r)=>{const t=new RegExp(`[${r}]+$`,"g");return s.replace(t,"")},T=new A,ue=s=>{const{id:r,name:t,path:i,extends_base:l=!1,menuable:m=!1,setPages:c,onSEOClicked:h,onParamsClicked:x}=s,[a,j]=u.useState(!1),[P,w]=u.useState(!1),[C,E]=u.useState(!1),[O,f]=u.useState(!1),b=async n=>{if(t===n.target.value)return j(!1);T.savePage({id:r,name:n.target.value})&&(j(!1),c(d=>d.map(p=>p.id===r?{...p,name:n.target.value}:p)))},v=async n=>{if(i===n.target.value)return w(!1);const o=n.target.value;let d=structuredClone(o);const p=s.using??{model:null,field:null,with:[]};for(const S in J(o))d=d.replace(`{${S}}`,"").replace(`{${S}?}`,""),p[S]=p[S]??{};const g=me(d,"/");T.savePage({id:r,path:o,pseudo_path:g,using:Object.keys(p).length>0?p:void 0})&&(w(!1),c(S=>S.map(k=>k.id===r?{...k,path:n.target.value}:k)))},M=async n=>{E(!0);const o=n.target.checked,d=T.savePage({id:r,extends_base:o});E(!1),d&&c(p=>p.map(g=>g.id===r?{...g,extends_base:o}:g))},_=async n=>{f(!0);const o=n.target.checked,d=T.savePage({id:r,menuable:o});f(!1),d&&c(p=>p.map(g=>g.id===r?{...g,menuable:o}:g))},N=async n=>{await T.deletePage(n.id)&&(c(d=>d.filter(p=>p.id!=n.id)),$('[data-bs-toggle="tab"]').removeClass("active"),$(".tab-pane").removeClass("active"),$("#base-template-link").addClass("active"),$("#base-template").addClass("active"))},y=J(i);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"dropdown float-end",children:[e.jsx("a",{href:"#",className:"dropdown-toggle arrow-none card-drop","data-bs-toggle":"dropdown","aria-expanded":"false",children:e.jsx("i",{className:"mdi mdi-dots-vertical"})}),e.jsxs("div",{className:"dropdown-menu dropdown-menu-end",children:[e.jsxs("button",{className:"dropdown-item",onClick:()=>h(s),children:[e.jsx("i",{className:"mdi mdi-cloud-search-outline me-1"}),"Editar SEO"]}),y.length>0&&e.jsxs("button",{className:"dropdown-item",onClick:()=>x(s),children:[e.jsx("i",{className:"mdi mdi-code-braces me-1"}),"Parámetros"]}),e.jsx("div",{className:"dropdown-divider"}),e.jsxs("button",{className:"dropdown-item",onClick:()=>N(s),children:[e.jsx("i",{className:"mdi mdi-trash-can-outline me-1"}),"Eliminar página"]})]})]}),e.jsxs("div",{children:[a?e.jsx("input",{className:"form-control form-control-sm mb-1",defaultValue:t,onBlur:b,autoFocus:!0}):e.jsx(W,{content:"Editar nombre",placement:"left",children:e.jsx("h4",{className:"header-title mb-1 d-block",onClick:()=>j(!0),style:{minWidth:"200px",cursor:"pointer"},children:t||"Sin nombre"})}),P?e.jsx("input",{className:"form-control form-control-sm mb-1",defaultValue:i,style:{minHeight:27,fieldSizing:"content"},onBlur:v,autoFocus:!0}):e.jsx(W,{content:"Editar ruta",placement:"left",children:e.jsx("small",{className:"text-muted d-block mb-1",onClick:()=>w(!0),style:{minWidth:"200px",cursor:"pointer"},children:i||"Sin ruta"})})]}),e.jsxs("div",{className:"row",children:[e.jsx(V,{label:"Extiende de base",col:"col-lg-6 col-md-12 col-sm-6",checked:l,onChange:M,disabled:C}),e.jsx(V,{label:"Mostrar en menu",col:"col-lg-6 col-md-12 col-sm-6",checked:m,onChange:_,disabled:O})]})]})},ee=({col:s,label:r,eRef:t,placeholder:i,required:l=!1,rows:m=3,value:c,onChange:h})=>e.jsxs("div",{className:`form-group ${s} mb-2`,children:[e.jsxs("label",{htmlFor:"",children:[r," ",l&&e.jsx("b",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{ref:t,className:"form-control",placeholder:i,required:l,rows:m,defaultValue:c,style:{minHeight:m*27,fieldSizing:"content"},onChange:h})]}),de=new A,he=({dataLoaded:s,setDataLoaded:r,modalRef:t})=>{const i=u.useRef(null),l=u.useRef(null),m=u.useRef(null),c=async h=>{h.preventDefault(),await de.savePage({id:s.id,description:l.current.value,keywords:$(m.current).val()})&&(r(null),$(t.current).modal("hide"))};return u.useEffect(()=>{i.current.value=`${s==null?void 0:s.name} | ${Q.APP_NAME}`,l.current.value=(s==null?void 0:s.description)??"",ae(m.current,(s==null?void 0:s.keywords)??[])},[s]),e.jsx(L,{modalRef:t,title:`Editar SEO - ${s==null?void 0:s.name}`,size:"sm",onSubmit:c,children:e.jsxs("div",{id:"seo-container",children:[e.jsx(q,{eRef:i,label:"Título",disabled:!0}),e.jsx(ee,{eRef:l,label:"Descripción",rows:2}),e.jsx(z,{eRef:m,label:"Palabras clave",tags:!0,multiple:!0,dropdownParent:"#seo-container"})]})})},Y=({className:s,system:r,component:t,onComponentClicked:i,onDeleteClicked:l,onEditDataClicked:m})=>{var x;const c=(t==null?void 0:t.options)??[],h=c.find(a=>a.id==r.value);return e.jsxs("div",{className:`dropdown ${s}`,"data-id":r.id,children:[e.jsxs("div",{className:"btn btn-light dropdown-toggle text-truncate w-100 text-start",type:"button",id:`dd-${r.id}`,"data-bs-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"true",children:[e.jsx("i",{className:"mdi mdi-chevron-down ms-1 float-end"}),e.jsxs("span",{className:"handle-sortable",style:{cursor:"move"},children:[e.jsx("i",{className:"fa fa-ellipsis-v"}),e.jsx("i",{className:"fa fa-ellipsis-v"})]}),e.jsx("span",{className:"ms-1",children:r.name})]}),e.jsxs("div",{className:"dropdown-menu","aria-labelledby":`dd-${r.id}`,"data-popper-placement":"bottom-start",children:[c.length>1&&e.jsxs(e.Fragment,{children:[c.filter(a=>a.id!=r.value).map(a=>e.jsxs("button",{className:"dropdown-item",onClick:()=>i({...r,name:`${t.name} - ${a.name}`,value:a.id}),children:[t.name," - ",a.name]})),e.jsx("div",{className:"dropdown-divider"})]}),(((x=h==null?void 0:h.using)==null?void 0:x.filters)||(h==null?void 0:h.data))&&e.jsxs("button",{className:"dropdown-item",onClick:()=>m(r,h),children:[e.jsx("i",{className:"mdi mdi-pencil me-1"}),"Configurar datos"]}),e.jsxs("button",{className:"dropdown-item",onClick:()=>l(r),children:[e.jsx("i",{className:"mdi mdi-trash-can-outline me-1"}),"Eliminar"]})]})]})},pe=new A,fe=({dataLoaded:s,setDataLoaded:r,setSystems:t,modalRef:i})=>{var x,a,j,P,w,C,E,O,f,b,v,M,_;const[l,m]=u.useState((s==null?void 0:s.data)||{}),c={};c.model=u.useRef(null),c.filters=u.useRef(null);const h=async N=>{N.preventDefault();const y=await pe.save({id:s.id,data:l,filters:$(c.filters.current).val()});y&&(r(null),$(i.current).modal("hide"),t(n=>n.map(o=>o.id==s.id?y.data:o)))};return u.useEffect(()=>{var y,n,o;const N={};(y=s==null?void 0:s.component)==null||y.data.forEach(d=>{var p;N[d]=((p=s==null?void 0:s.data)==null?void 0:p[d])??""}),m(N),c.model.current.value=((o=(n=s==null?void 0:s.component)==null?void 0:n.using)==null?void 0:o.model)??"",$(c.filters.current).val((s==null?void 0:s.filters)??[]).trigger("change")},[s]),e.jsxs(L,{modalRef:i,title:s==null?void 0:s.name,onSubmit:h,children:[e.jsxs("ul",{className:"nav nav-tabs nav-bordered",children:[e.jsx("li",{className:"nav-item",hidden:!((a=(x=s==null?void 0:s.component)==null?void 0:x.data)!=null&&a.length),children:e.jsx("a",{href:"#tab-info","data-bs-toggle":"tab","aria-expanded":"true",className:"nav-link active",children:"Información"})}),e.jsx("li",{className:"nav-item",hidden:!((P=(j=s==null?void 0:s.component)==null?void 0:j.using)!=null&&P.filters),children:e.jsx("a",{href:"#tab-db","data-bs-toggle":"tab","aria-expanded":"true",className:"nav-link",children:"Base de datos"})})]}),e.jsxs("div",{className:"tab-content",children:[e.jsx("div",{className:"tab-pane active",id:"tab-info",hidden:!((C=(w=s==null?void 0:s.component)==null?void 0:w.data)!=null&&C.length),children:(O=(E=s==null?void 0:s.component)==null?void 0:E.data)==null?void 0:O.map((N,y)=>e.jsx(ee,{label:N,value:l[N]??"",rows:1,onChange:n=>m({...l,[N]:n.target.value})},y))}),e.jsxs("div",{className:"tab-pane show",id:"tab-db",children:[e.jsx(q,{eRef:c.model,label:"Modelo",disabled:!0}),e.jsx(z,{eRef:c.filters,label:"Filtros",multiple:!0,dropdownParent:"#tab-db",hidden:!((b=(f=s==null?void 0:s.component)==null?void 0:f.using)!=null&&b.filters),children:(_=(M=(v=s==null?void 0:s.component)==null?void 0:v.using)==null?void 0:M.filters)==null?void 0:_.map((N,y)=>e.jsx("option",{value:N,children:N},y))})]})]})]})},Z=new A,xe=({components:s,onClick:r})=>e.jsx("div",{className:"left-side-menu top-0 pt-2",children:e.jsxs("div",{"data-simplebar":!0,className:"h-100",children:[e.jsx("div",{id:"sidebar-menu",className:"show",children:e.jsxs("ul",{id:"side-menu",children:[e.jsx("li",{className:"menu-title",children:"Lista de componentes"}),s.filter(t=>t.options.length>0).map((t,i)=>e.jsx(ce,{title:t.name,children:t.options.map((l,m)=>e.jsx(U,{name:l.name,icon:l.image,onClick:()=>{const c=$(".tab-pane:visible .components-container > div").last().data("id");r({name:`${t.name} - ${l.name}`,component:t.id,value:l.id,after_component:c})},children:l.name},m))},i)),e.jsx("li",{className:"menu-title",children:"Sistema de respaldo"}),e.jsx(U,{icon:"mdi mdi-cloud-download",onClick:async()=>{const t=await Z.exportBK(),i=new Blob([JSON.stringify(t)],{type:"application/json"}),l=URL.createObjectURL(i),m=document.createElement("a");m.href=l,m.download="backup.json",document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(l)},children:"Exportar Backup"}),e.jsx("input",{type:"file",id:"file-input",accept:"application/json",style:{display:"none"},onChange:async t=>{const i=t.target.files[0];if(t.target.value=null,i){const l=new FormData;if(l.append("backup",i),!await Z.importBK(l))return;location.reload()}}}),e.jsx(U,{icon:"mdi mdi-backup-restore",onClick:()=>{document.getElementById("file-input").click()},children:"Importar Backup"})]})}),e.jsx("div",{className:"clearfix"})]})}),be=({page:s,param:r,models:t,setUsing:i,setPages:l})=>{var C,E,O;const m=u.useRef(),c=u.useRef(),h=u.useRef(),x=s==null?void 0:s.using,[a,j]=u.useState(null),P=f=>{const b=m.current.value,v=t.find(M=>M.name==b)??null;j(v)};u.useEffect(()=>{var f;$(m.current).val((f=x==null?void 0:x[r])==null?void 0:f.model).trigger("change")},[r]),u.useEffect(()=>{var f,b;i(v=>({...v,[r]:{...v[r],model:(a==null?void 0:a.name)??null}})),$(c.current).val(((f=x==null?void 0:x[r])==null?void 0:f.field)??null).trigger("change"),$(h.current).val(((b=x==null?void 0:x[r])==null?void 0:b.relations)??[]).trigger("change")},[a]);const w=`${r}-container`;return e.jsxs("div",{id:w,className:"row",children:[e.jsxs("label",{className:"form-label",children:["Parámetro ",e.jsx("code",{children:r})]}),e.jsx(z,{eRef:m,label:"Modelo",col:"col-md-6",dropdownParent:`#${w}`,onChange:P,children:t.map((f,b)=>e.jsx("option",{value:f.name,children:f.name},b))}),e.jsx(z,{eRef:c,label:"Campo",col:"col-md-6",dropdownParent:`#${w}`,onChange:f=>{i(b=>({...b,[r]:{...b[r],field:f.target.value}}))},children:(C=a==null?void 0:a.fields)==null?void 0:C.map((f,b)=>e.jsx("option",{children:f},b))}),e.jsx("div",{hidden:(((E=a==null?void 0:a.relations)==null?void 0:E.length)??0)==0,children:e.jsx(z,{eRef:h,label:"Relaciones",multiple:!0,dropdownParent:`#${w}`,onChange:f=>{const b=$(f.target).val();i(v=>({...v,[r]:{...v[r],relations:b}}))},children:(O=a==null?void 0:a.relations)==null?void 0:O.map((f,b)=>e.jsx("option",{children:f},b))})})]})},ge=new A,je=({dataLoaded:s,setDataLoaded:r,setPages:t,modalRef:i,models:l})=>{const m=J((s==null?void 0:s.path)??""),[c,h]=u.useState({}),x=async a=>{a.preventDefault();const j=await ge.savePage({id:s.id,using:c});j&&(r(null),t(j),$(i.current).modal("hide"))};return u.useEffect(()=>{h((s==null?void 0:s.using)??{})},[s]),e.jsx(oe,{modalRef:i,title:`Editar parámetros de URL - ${s==null?void 0:s.name}`,onSubmit:x,onClose:()=>r(null),children:m.map((a,j)=>e.jsx(be,{page:s,param:a,models:l,using:c,setUsing:h,setPages:t},j))})},G=new A,ve=({systems:s,pages:r,components:t,models:i})=>{const l=u.useRef(null),m=u.useRef(null),c=u.useRef(null),[h,x]=u.useState(s),[a,j]=u.useState(r),[P,w]=u.useState(!1),[C,E]=u.useState(null),[O,f]=u.useState(null),b=async()=>{w(!0);const n=await G.savePage();n&&(w(!1),j(n))},v=async n=>{const d=$(".tab-pane:visible").data("id")??null;n.page_id=d;const p=await G.save(n);if(!p)return;const g=p.data;x(B=>B.some(k=>k.id===g.id)?B.map(k=>k.id===g.id?g:k):[...B,g])},M=async n=>{await G.delete(n.id)&&x(d=>d.filter(p=>p.id!=n.id))};u.useEffect(()=>{document.title=`Sistema | ${Q.APP_NAME}`},[null]),u.useEffect(()=>{const n=$("iframe:visible");n&&($(n).removeAttr("src"),$(n).attr("src",n.data("path")))},[h,a]);const _=async n=>{E(n),$(l.current).modal("show")},N=async n=>{E(n),$(m.current).modal("show")},y=async(n,o)=>{f({...n,component:o}),$(c.current).modal("show")};return u.useEffect(()=>{[...$(".components-container")].forEach(o=>{$(o).sortable({connectWith:".components-container",handle:".handle-sortable",forcePlaceholderSize:!0,update:async function(d,p){const g=[...$(o).children()],B={};if(g.forEach(S=>{const k=$(S).data("id"),F=$(S).prev().data("id")??null,I=h.find(H=>H.id==k);(I==null?void 0:I.after_component)!==F&&(B[k]=F)}),Object.keys(B).length>0){if(!await G.updateOrder(B))return;x(k=>{const F=[...k];return Object.entries(B).forEach(([I,H])=>{const K=F.findIndex(se=>se.id==I);K!==-1&&(F[K]={...F[K],after_component:H})}),F})}}}).disableSelection()})},[a,h]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{id:"wrapper",children:[e.jsx(xe,{components:t,onClick:v}),e.jsx("div",{className:"content-page mt-2 pb-3",style:{height:"max-content"},children:e.jsx("div",{className:"content mt-2",children:e.jsxs("div",{className:"container-fluid",children:[e.jsx("button",{className:"button-menu-mobile d-lg-none d-md-block position-absolute ",style:{zIndex:1,border:"none",borderRadius:"0 50% 50% 0",backgroundColor:"#fff",color:"#343a40",top:"50%",left:"0",transform:"translateY(-50%)",padding:"24px 0px 20px 6px ",fontWeight:"bold"},children:"〉"}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-12",children:e.jsx("div",{className:"card mb-0",children:e.jsxs("div",{className:"card-body",style:{height:"calc(100vh - 48px)"},children:[e.jsxs("ul",{className:"nav nav-tabs nav-bordered flex-nowrap",style:{overflowX:"auto",overflowY:"hidden"},children:[e.jsx("li",{className:"nav-item",children:e.jsx("a",{id:"base-template-link",href:"#base-template","data-bs-toggle":"tab","aria-expanded":"false",className:"nav-link active h-100",children:"Base"})}),a.map((n,o)=>e.jsx("li",{className:"nav-item",children:e.jsxs("a",{href:`#page-${n.id}`,"data-bs-toggle":"tab","aria-expanded":"false",className:"nav-link h-100",style:{whiteSpace:"nowrap"},children:[n.name,e.jsx("small",{className:"d-block text-muted",style:{fontWeight:"normal"},children:n.path})]})},o)),e.jsx("li",{className:"nav-item d-flex justify-content-center align-items-center px-2",children:e.jsx(W,{content:"Agregar página",children:e.jsx("button",{className:"nav-link btn btn-xs btn-white rounded-pill",onClick:b,disabled:P,children:P?e.jsx("i",{className:"mdi mdi-loading mdi-spin"}):e.jsx("i",{className:"mdi mdi-plus"})})})})]}),e.jsxs("div",{className:"tab-content",children:[e.jsx("div",{className:"tab-pane active",id:"base-template",children:e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-4",children:e.jsx("div",{className:"d-flex flex-column gap-2 components-container","data-page-id":null,children:X(h).filter(n=>n.page_id==null).map(n=>{const o=t.find(d=>d.id==n.component);if(o==null||o.options,n.component=="content")return e.jsxs("button",{"data-id":n.id,className:"btn btn-light text-truncate w-100 text-start",type:"button",children:[e.jsx("i",{className:"fa fa-ellipsis-v"}),e.jsx("i",{className:"fa fa-ellipsis-v"}),e.jsx("span",{className:"ms-1",children:n.name})]});{const d=t.find(p=>p.id==n.component);return e.jsx(Y,{className:"",system:n,component:d,onComponentClicked:v,onDeleteClicked:M,onEditDataClicked:y},n.id)}})})}),e.jsx("div",{className:"col-md-8",children:e.jsx("iframe",{src:"/base-template","data-path":"/base-template",className:"w-100 h-100 border",style:{minHeight:"calc(100vh - 185px)",borderRadius:"4px"}})})]})}),a.map((n,o)=>e.jsx("div",{className:"tab-pane",id:`page-${n.id}`,"data-id":n.id,children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx(ue,{...n,models:i,setPages:j,onSEOClicked:_,onParamsClicked:N}),e.jsx("hr",{className:"my-2"}),e.jsx("div",{className:"d-flex flex-column gap-2 components-container","data-page-id":n.id,children:X(h).filter(d=>d.page_id==n.id).map(d=>{const p=t.find(g=>g.id==d.component);return e.jsx(Y,{className:"",system:d,component:p,onComponentClicked:v,onDeleteClicked:M,onEditDataClicked:y},d.id)})})]}),e.jsx("div",{className:"col-md-8",children:e.jsx("iframe",{src:(n==null?void 0:n.pseudo_path)||n.path,"data-path":(n==null?void 0:n.pseudo_path)||n.path,className:"w-100 h-100 border",style:{minHeight:"calc(100vh - 185px)",borderRadius:"4px"}})})]})},o))]})]})})})})]})})})]}),e.jsx(he,{dataLoaded:C,setDataLoaded:E,modalRef:l}),e.jsx(je,{dataLoaded:C,setDataLoaded:E,setPages:j,modalRef:m,models:i}),e.jsx(fe,{dataLoaded:O,setDataLoaded:f,setSystems:x,modalRef:c})]})};ie((s,r)=>{re(s).render(e.jsx(ve,{...r}))});