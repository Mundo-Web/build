var g=Object.defineProperty;var f=(r,s,a)=>s in r?g(r,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[s]=a;var c=(r,s,a)=>(f(r,typeof s!="symbol"?s+"":s,a),a);import{j as t}from"./AboutHeader-Bdo2C3ON.js";import{r as p}from"./index-DFv2mRv-.js";import{c as x}from"./ReactAppend-CwiwA4iz.js";import{B as h}from"./Base-CgImSi2x.js";import{C as j}from"./CreateReactScript-D-eDfVKV.js";import{B as b}from"./BasicEditing-Ce9hwHaI.js";import"./index-DgyC5pTR.js";import"./Global-mC9lKANG.js";import"./tippy-react.esm-BVvHiWwH.js";/* empty css              */import"./main-BBbUrZUL.js";import"./___vite-browser-external_commonjs-proxy-BQdpDcDf.js";import"./MenuItemContainer-xrd2f-pb.js";import"./index.esm-B502ZfUP.js";/* empty css               */class y extends b{constructor(){super(...arguments);c(this,"path","admin/gallery");c(this,"hasFiles",!0)}}function v(r){return r.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-")}const N=new y,C=({images:r=[]})=>{const[s,a]=p.useState(r.map(e=>(e.uuid=crypto.randomUUID(),e)));p.useEffect(()=>{$(".image-popup").magnificPopup({type:"image",closeOnContentClick:!0,mainClass:"mfp-fade",gallery:{enabled:!0,navigateByImgClick:!0,preload:[0,1]}})},[null]);const d=async e=>{var m;const o=((m=e.target.files)==null?void 0:m[0])??null;if(!o)return;e.target.value=null;const i=e.target.name,n=new FormData;n.append("image",o),n.append("name",i),await N.save(n)&&a(u=>u.map(l=>(l.src==i&&(l.uuid=crypto.randomUUID()),l)))};return t.jsx("div",{className:"port",children:t.jsx("div",{className:"row portfolioContainer",children:s.map((e,o)=>{const i=v(e.name);return t.jsx("div",{className:"col-xl-3 col-lg-4 col-md-6 natural personal",children:t.jsxs("div",{className:"gal-detail thumb",children:[t.jsxs("div",{style:{position:"relative"},children:[t.jsx("img",{src:`/assets/resources/${e.src}?v=${e.uuid}`,className:"thumb-img img-fluid",alt:"work-thumbnail",onError:n=>n.target.src="/assets/resources/cover-404.svg",style:{aspectRatio:e.aspect,objectFit:e.fit,objectPosition:"center",width:"100%"}}),t.jsxs("div",{className:"d-flex px-2 py-1 justify-content-center gap-1",style:{backgroundColor:"rgba(0, 0, 0, .25)",position:"absolute",bottom:0,width:"100%",borderRadius:"0 0 3px 3px"},children:[t.jsxs("a",{href:`/assets/resources/${e.src}`,className:"btn btn-xs btn-primary image-popup",title:e.name,children:[t.jsx("i",{className:"mdi mdi-eye me-1"}),"Abrir"]}),t.jsx("input",{type:"file",name:e.src,id:`image-${i}`,onChange:d,hidden:!0,accept:"image/*"}),t.jsxs("label",{htmlFor:`image-${i}`,className:"btn btn-xs btn-dark",children:[t.jsx("i",{className:"mdi mdi-image-edit me-1"}),"Cambiar"]})]})]}),t.jsxs("div",{className:"text-center",children:[t.jsx("h4",{children:e.name}),t.jsx("p",{className:"font-13 text-muted mb-2",children:e.description})]})]})},o)})})})};j((r,s)=>{x(r).render(t.jsx(h,{...s,title:"Galeria",children:t.jsx(C,{...s})}))});