var L=Object.defineProperty;var Q=(n,s,l)=>s in n?L(n,s,{enumerable:!0,configurable:!0,writable:!0,value:l}):n[s]=l;var C=(n,s,l)=>(Q(n,typeof s!="symbol"?s+"":s,l),l);import{j as r}from"./AboutHeader-Bdo2C3ON.js";import{r as o}from"./index-DFv2mRv-.js";import{c as J}from"./ReactAppend-CwiwA4iz.js";import{B as Y}from"./Base-BVOp-QEp.js";import{C as K}from"./CreateReactScript-BWpReUmk.js";import{M as U}from"./Modal-C9s5p_Ex.js";import{I as S}from"./InputFormGroup-DbvUCzmO.js";import{R as v,D as I}from"./ReactAppend-CASuQb7V.js";import{T as X}from"./TextareaFormGroup-Bau8EUyr.js";import{S as j}from"./SwitchFormGroup-CHRdLToT.js";import{I as G}from"./ImageFormGroup-CE4HITZ8.js";import{S as P}from"./SelectFormGroup-BNbGIIOT.js";import{S as Z}from"./ProductCard-FwiEcsI0.js";import{B as ee}from"./BasicEditing-Ce9hwHaI.js";import{Q as re}from"./QuillFormGroup-Clg8_RT2.js";import{r as k}from"./DxBox-PA__dqjs.js";import{S as M}from"./SelectAPIFormGroup-c6ZjfFd9.js";import{N as A}from"./Number2Currency-e57Tgsuk.js";import{S as _}from"./SetSelectValue-UxyCmHse.js";import"./index-DgyC5pTR.js";import"./Global-mC9lKANG.js";import"./tippy-react.esm-BVvHiWwH.js";/* empty css              */import"./main-BBbUrZUL.js";import"./___vite-browser-external_commonjs-proxy-BQdpDcDf.js";import"./MenuItemContainer-xrd2f-pb.js";import"./index.esm-B502ZfUP.js";/* empty css               */import"./General-3RJWnWe_.js";const te=({gridRef:n,rest:s,columns:l,toolBar:m,masterDetail:d,filterValue:p,exportable:f,exportableName:h,customizeCell:g=()=>{},onRefresh:x=()=>{}})=>(o.useEffect(()=>{DevExpress.localization.locale(navigator.language),$(n.current).dxDataGrid({language:"es",dataSource:{load:async a=>{const c=await s.paginate({...a});return x(c),c}},onToolbarPreparing:a=>{const{items:c}=a.toolbarOptions;m(c)},remoteOperations:!0,columnResizingMode:"widget",allowColumnResizing:!0,allowColumnReordering:!0,columnAutoWidth:!0,scrollbars:"auto",filterPanel:{visible:!0},searchPanel:{visible:!0},headerFilter:{visible:!0,search:{enabled:!0}},height:"calc(100vh - 185px)",filterValue:p,export:{enabled:f},onExporting:function(a){var c=new ExcelJS.Workbook,w=c.addWorksheet("Main sheet");DevExpress.excelExporter.exportDataGrid({worksheet:w,component:a.component,customizeCell:function(u){g(u),u.excelCell.alignment={horizontal:"left",vertical:"top",...u.excelCell.alignment}},includeHiddenColumns:!0}).then(function(){c.xlsx.writeBuffer().then(function(u){saveAs(new Blob([u],{type:"application/octet-stream"}),`${h}.xlsx`)})})},rowAlternationEnabled:!0,showBorders:!0,filterRow:{visible:!0,applyFilter:"auto"},filterBuilderPopup:{visible:!1,position:{of:window,at:"top",my:"top",offset:{y:10}}},paging:{pageSize:10},pager:{visible:!0,allowedPageSizes:[5,10,25,50,100],showPageSizeSelector:!0,showInfo:!0,showNavigationButtons:!0},allowFiltering:!0,scrolling:{mode:"standard",useNative:!0,preloadEnabled:!0,rowRenderingMode:"standard"},columnChooser:{title:"Mostrar/Ocultar columnas",enabled:!0,mode:"select",search:{enabled:!0}},columns:l,masterDetail:d,onContentReady:(...a)=>{tippy(".tippy-here",{arrow:!0,animation:"scale"})}}).dxDataGrid("instance"),tippy(".dx-button",{arrow:!0})},[null]),r.jsx("div",{ref:n})),ie=({title:n,gridRef:s,rest:l,columns:m,toolBar:d,masterDetail:p,filterValue:f=[],onRefresh:h,exportable:g,exportableName:x,customizeCell:a=()=>{}})=>r.jsx("div",{className:"row",children:r.jsx("div",{className:"col-12",children:r.jsxs("div",{className:"card",children:[typeof n=="object"?r.jsx("div",{className:"card-header",children:n}):"",r.jsxs("div",{className:"card-body",children:[typeof n!="object"?r.jsxs("h4",{className:"header-title",children:[r.jsx("div",{id:"header-title-options",className:"float-end"}),r.jsx("span",{id:"header-title-prefix"})," Lista de ",n," ",r.jsx("span",{id:"header-title-suffix"})]}):"",r.jsx(te,{gridRef:s,rest:l,columns:m.filter(Boolean),toolBar:d,masterDetail:p,filterValue:f,onRefresh:h,exportable:g,exportableName:x,customizeCell:a})]})]})})});class ne extends ee{constructor(){super(...arguments);C(this,"path","admin/items");C(this,"hasFiles",!0)}}const y=new ne,se=({categories:n,brands:s})=>{const l=o.useRef(),m=o.useRef(),d=o.useRef(),p=o.useRef(),f=o.useRef(),h=o.useRef(),g=o.useRef(),x=o.useRef(),a=o.useRef(),c=o.useRef(),w=o.useRef(),u=o.useRef(),R=o.useRef(),F=o.useRef(),[z,T]=o.useState(!1),[q,O]=o.useState(null),D=e=>{var t,i;e!=null&&e.id?T(!0):T(!1),d.current.value=(e==null?void 0:e.id)||"",$(p.current).val((e==null?void 0:e.category_id)||null).trigger("change"),_(f.current,(t=e==null?void 0:e.subcategory)==null?void 0:t.id,(i=e==null?void 0:e.subcategory)==null?void 0:i.name),$(h.current).val((e==null?void 0:e.brand_id)||null).trigger("change"),g.current.value=(e==null?void 0:e.name)||"",x.current.value=(e==null?void 0:e.summary)||"",a.current.value=(e==null?void 0:e.price)||0,c.current.value=(e==null?void 0:e.discount)||0,_(w.current,(e==null?void 0:e.tags)??[],"id","name"),u.current.value=null,R.current.value=null,u.image.src=`/api/items/media/${(e==null?void 0:e.banner)??"undefined"}`,R.image.src=`/api/items/media/${(e==null?void 0:e.image)??"undefined"}`,F.editor.root.innerHTML=(e==null?void 0:e.description)??"",$(m.current).modal("show")},V=async e=>{e.preventDefault();const t={id:d.current.value||void 0,category_id:p.current.value,subcategory_id:f.current.value,brand_id:h.current.value,name:g.current.value,summary:x.current.value,price:a.current.value,discount:c.current.value,tags:$(w.current).val(),description:F.current.value},i=new FormData;for(const E in t)i.append(E,t[E]);const b=R.current.files[0];b&&i.append("image",b);const B=u.current.files[0];B&&i.append("banner",B),await y.save(i)&&($(l.current).dxDataGrid("instance").refresh(),$(m.current).modal("hide"))},W=async({id:e,value:t})=>{await y.boolean({id:e,field:"visible",value:t})&&$(l.current).dxDataGrid("instance").refresh()},N=async({id:e,field:t,value:i})=>{await y.boolean({id:e,field:t,value:i})&&$(l.current).dxDataGrid("instance").refresh()},H=async e=>{const{isConfirmed:t}=await Z.fire({title:"Eliminar curso",text:"¿Estás seguro de eliminar este curso?",icon:"warning",showCancelButton:!0,confirmButtonText:"Sí, eliminar",cancelButtonText:"Cancelar"});!t||!await y.delete(e)||$(l.current).dxDataGrid("instance").refresh()};return r.jsxs(r.Fragment,{children:[r.jsx(ie,{gridRef:l,title:"Items",rest:y,toolBar:e=>{e.unshift({widget:"dxButton",location:"after",options:{icon:"refresh",hint:"Refrescar tabla",onClick:()=>$(l.current).dxDataGrid("instance").refresh()}}),e.unshift({widget:"dxButton",location:"after",options:{icon:"plus",text:"Nuevo curso",hint:"Nuevo curso",onClick:()=>D()}})},exportable:!0,exportableName:"Items",columns:[{dataField:"id",caption:"ID",visible:!1},{dataField:"category.name",caption:"Categoría",width:"120px",cellTemplate:(e,{data:t})=>{var i,b;e.html(k(r.jsxs(r.Fragment,{children:[r.jsx("b",{className:"d-block",children:(i=t.category)==null?void 0:i.name}),r.jsx("small",{className:"text-muted",children:(b=t.subcategory)==null?void 0:b.name})]})))}},{dataField:"subcategory.name",caption:"Subcategoría",visible:!1},{dataField:"brand.name",caption:"Marca",width:"120px"},{dataField:"name",caption:"Nombre",width:"300px",cellTemplate:(e,{data:t})=>{e.html(k(r.jsxs(r.Fragment,{children:[r.jsx("b",{children:t.name}),r.jsx("br",{}),r.jsx("span",{className:"truncate",children:t.summary})]})))}},{dataField:"final_price",caption:"Precio",dataType:"number",width:"75px",cellTemplate:(e,{data:t})=>{e.html(k(r.jsxs(r.Fragment,{children:[t.discount>0&&r.jsxs("small",{className:"d-block text-muted",style:{textDecoration:"line-through"},children:["S/.",A(t.price)]}),r.jsxs("span",{children:["S/.",A(t.discount>0?t.discount:t.price)]})]})))}},{dataField:"image",caption:"Imagen",width:"90px",allowFiltering:!1,cellTemplate:(e,{data:t})=>{v(e,r.jsx("img",{src:`/api/items/media/${t.image}`,style:{width:"80px",height:"48px",objectFit:"cover",objectPosition:"center",borderRadius:"4px"},onError:i=>i.target.src="/api/cover/thumbnail/null"}))}},{dataField:"is_new",caption:"Nuevo",dataType:"boolean",width:"80px",cellTemplate:(e,{data:t})=>{v(e,r.jsx(j,{checked:t.is_new,onChange:i=>N({id:t.id,field:"is_new",value:i.target.checked})}))}},{dataField:"offering",caption:"En oferta",dataType:"boolean",width:"80px",cellTemplate:(e,{data:t})=>{v(e,r.jsx(j,{checked:t.offering,onChange:i=>N({id:t.id,field:"offering",value:i.target.checked})}))}},{dataField:"recommended",caption:"Recomendado",dataType:"boolean",width:"80px",cellTemplate:(e,{data:t})=>{v(e,r.jsx(j,{checked:t.recommended,onChange:i=>N({id:t.id,field:"recommended",value:i.target.checked})}))}},{dataField:"featured",caption:"Destacado",dataType:"boolean",width:"80px",cellTemplate:(e,{data:t})=>{v(e,r.jsx(j,{checked:t.featured,onChange:i=>N({id:t.id,field:"featured",value:i.target.checked})}))}},{dataField:"visible",caption:"Visible",dataType:"boolean",width:"80px",cellTemplate:(e,{data:t})=>{v(e,r.jsx(j,{checked:t.visible,onChange:i=>W({id:t.id,value:i.target.checked})}))}},{caption:"Acciones",width:"100px",cellTemplate:(e,{data:t})=>{e.css("text-overflow","unset"),e.append(I({className:"btn btn-xs btn-soft-primary",title:"Editar",icon:"fa fa-pen",onClick:()=>D(t)})),e.append(I({className:"btn btn-xs btn-soft-danger",title:"Eliminar",icon:"fa fa-trash",onClick:()=>H(t.id)}))},allowFiltering:!1,allowExporting:!1}]}),r.jsxs(U,{modalRef:m,title:z?"Editar curso":"Agregar curso",onSubmit:V,size:"lg",children:[r.jsxs("div",{className:"row",id:"principal-container",children:[r.jsx("input",{ref:d,type:"hidden"}),r.jsxs("div",{className:"col-md-6",children:[r.jsx(P,{eRef:p,label:"Categoría",required:!0,dropdownParent:"#principal-container",onChange:e=>O(e.target.value),children:n.map((e,t)=>r.jsx("option",{value:e.id,children:e.name},t))}),r.jsx(M,{eRef:f,label:"Subcategoría",searchAPI:"/api/admin/subcategories/paginate",searchBy:"name",filter:["category_id","=",q],dropdownParent:"#principal-container"}),r.jsx(P,{eRef:h,label:"Marca",required:!0,dropdownParent:"#principal-container",children:s.map((e,t)=>r.jsx("option",{value:e.id,children:e.name},t))}),r.jsx(S,{eRef:g,label:"Nombre",required:!0}),r.jsx(X,{eRef:x,label:"Resumen",rows:3,required:!0}),r.jsxs("div",{className:"row",children:[r.jsx(S,{eRef:a,label:"Precio",type:"number",col:"col-sm-6",step:"0.01",required:!0}),r.jsx(S,{eRef:c,label:"Descuento",type:"number",col:"col-sm-6",step:"0.01"})]}),r.jsx(M,{id:"tags",eRef:w,searchAPI:"/api/admin/tags/paginate",searchBy:"name",label:"Tags",dropdownParent:"#principal-container",tags:!0,multiple:!0})]}),r.jsx("div",{className:"col-md-6",children:r.jsxs("div",{className:"row",children:[r.jsx(G,{eRef:u,label:"Banner",aspect:2/1,col:"col-12"}),r.jsx(G,{eRef:R,label:"Imagen",aspect:1,col:"col-lg-6 col-md-12 col-sm-6"}),r.jsxs("div",{className:"col-lg-6 col-md-12 col-sm-6",children:[r.jsx("input",{id:"input-item-gallery",type:"file",multiple:!0,accept:"image/",hidden:!0}),r.jsxs("div",{style:{position:"relative"},children:[r.jsx("span",{className:"form-label d-block mb-1",htmlFor:"input-item-gallery",children:"Galería"}),r.jsxs("button",{className:"btn btn-white rounded-pill btn-xs",style:{position:"absolute",top:"50%",transform:"translateY(-50%)",right:0},children:[r.jsx("i",{className:"mdi mdi-plus"}),"Agregar"]})]}),r.jsx("div",{className:"w-100 bg-primary",style:{aspectRatio:1}})]})]})})]}),r.jsx("hr",{className:"my-1"}),r.jsx(re,{eRef:F,label:"Descripcion"})]})]})};K((n,s)=>{J(n).render(r.jsx(Y,{...s,title:"Items",children:r.jsx(se,{...s})}))});