var D=Object.defineProperty;var B=(s,r,n)=>r in s?D(s,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[r]=n;var d=(s,r,n)=>(B(s,typeof r!="symbol"?r+"":r,n),n);import{j as i}from"./AboutHeader-Bdo2C3ON.js";import{r as o}from"./index-DFv2mRv-.js";import{c as E}from"./ReactAppend-CwiwA4iz.js";import{B as k}from"./Base-CgImSi2x.js";import{C as y}from"./CreateReactScript-D-eDfVKV.js";import{T as I}from"./Table-CuWBkF0z.js";import{M as G}from"./Modal-C9s5p_Ex.js";import{I as h}from"./InputFormGroup-Di7UVG_e.js";import{R as v,D as w}from"./ReactAppend-CASuQb7V.js";import{T as j}from"./TextareaFormGroup-Bau8EUyr.js";import{S as _}from"./SwitchFormGroup-CHRdLToT.js";import{B as N}from"./BasicEditing-Ce9hwHaI.js";import{I as q}from"./ImageFormGroup-CE4HITZ8.js";import{S as M}from"./ProductCard-FwiEcsI0.js";import"./index-DgyC5pTR.js";import"./Global-mC9lKANG.js";import"./tippy-react.esm-BVvHiWwH.js";/* empty css              */import"./main-BBbUrZUL.js";import"./___vite-browser-external_commonjs-proxy-BQdpDcDf.js";import"./MenuItemContainer-xrd2f-pb.js";import"./index.esm-B502ZfUP.js";/* empty css               */class A extends N{constructor(){super(...arguments);d(this,"path","admin/sliders");d(this,"hasFiles",!0)}}const u=new A,L=()=>{const s=o.useRef(),r=o.useRef(),n=o.useRef(),a=o.useRef(),m=o.useRef(),c=o.useRef(),f=o.useRef(),p=o.useRef();o.useRef(),o.useRef();const[T,x]=o.useState(!1),b=e=>{e!=null&&e.id?x(!0):x(!1),n.current.value=(e==null?void 0:e.id)??"",a.current.value=(e==null?void 0:e.name)??"",m.current.value=(e==null?void 0:e.description)??"",c.current.value=null,c.image.src=`/api/sliders/media/${e==null?void 0:e.bg_image}`,f.current.value=(e==null?void 0:e.button_text)??"",p.current.value=(e==null?void 0:e.button_link)??"",$(r.current).modal("show")},F=async e=>{e.preventDefault();const t={id:n.current.value||void 0,name:a.current.value,description:m.current.value,button_text:f.current.value,button_link:p.current.value},l=new FormData;for(const g in t)l.append(g,t[g]);const R=c.current.files[0];R&&l.append("bg_image",R),await u.save(l)&&($(s.current).dxDataGrid("instance").refresh(),$(r.current).modal("hide"))},S=async({id:e,value:t})=>{await u.boolean({id:e,field:"visible",value:t})&&$(s.current).dxDataGrid("instance").refresh()},C=async e=>{const{isConfirmed:t}=await M.fire({title:"Eliminar slider",text:"¿Estas seguro de eliminar este slider?",icon:"warning",showCancelButton:!0,confirmButtonText:"Si, eliminar",cancelButtonText:"Cancelar"});!t||!await u.delete(e)||$(s.current).dxDataGrid("instance").refresh()};return i.jsxs(i.Fragment,{children:[i.jsx(I,{gridRef:s,title:"Sliders",rest:u,toolBar:e=>{e.unshift({widget:"dxButton",location:"after",options:{icon:"refresh",hint:"Refrescar tabla",onClick:()=>$(s.current).dxDataGrid("instance").refresh()}}),e.unshift({widget:"dxButton",location:"after",options:{icon:"plus",text:"Nuevo slider",hint:"Nuevo slider",onClick:()=>b()}})},columns:[{dataField:"id",caption:"ID",visible:!1},{dataField:"name",caption:"Titulo",width:"75%"},{dataField:"bg_image",caption:"Imagen",width:"90px",cellTemplate:(e,{data:t})=>{v(e,i.jsx("img",{src:`/api/sliders/media/${t.bg_image}`,style:{width:"80px",height:"48px",objectFit:"cover",objectPosition:"center",borderRadius:"4px"},onError:l=>l.target.src="/api/cover/thumbnail/null"}))}},{dataField:"visible",caption:"Visible",dataType:"boolean",cellTemplate:(e,{data:t})=>{$(e).empty(),v(e,i.jsx(_,{checked:t.visible==1,onChange:()=>S({id:t.id,value:!t.visible})}))}},{caption:"Acciones",cellTemplate:(e,{data:t})=>{e.css("text-overflow","unset"),e.append(w({className:"btn btn-xs btn-soft-primary",title:"Editar",icon:"fa fa-pen",onClick:()=>b(t)})),e.append(w({className:"btn btn-xs btn-soft-danger",title:"Eliminar",icon:"fa fa-trash",onClick:()=>C(t.id)}))},allowFiltering:!1,allowExporting:!1}]}),i.jsx(G,{modalRef:r,title:T?"Editar slider":"Agregar slider",onSubmit:F,size:"md",children:i.jsxs("div",{className:"row",id:"sliders-container",children:[i.jsx("input",{ref:n,type:"hidden"}),i.jsx(q,{eRef:c,label:"Imagen",col:"col-12"}),i.jsx(j,{eRef:a,label:"Titulo",col:"col-12",rows:2,required:!0}),i.jsx(j,{eRef:m,label:"Descripción",rows:3}),i.jsx(h,{eRef:f,label:"Texto botón primario",col:"col-sm-6",required:!0}),i.jsx(h,{eRef:p,label:"URL botón primario",col:"col-sm-6",required:!0})]})})]})};y((s,r)=>{E(s).render(i.jsx(k,{...r,title:"Sliders",children:i.jsx(L,{...r})}))});