var oe=Object.defineProperty;var ie=(s,o,i)=>o in s?oe(s,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[o]=i;var G=(s,o,i)=>(ie(s,typeof o!="symbol"?o+"":o,i),i);import{j as e}from"./AboutHeader-CpM0iYLI.js";import{r as n}from"./index-B80Lgev0.js";import{c as le}from"./ReactAppend-CBRQCQGz.js";import{B as ce}from"./Base-C7IEbFAP.js";import{C as de}from"./CreateReactScript-wgaspG1d.js";import{M as ue}from"./Modal-Dbgjpj-3.js";import{I as v}from"./InputFormGroup-aFB8_JHY.js";import{R as y,D as K}from"./ReactAppend-BgTwyCLj.js";import{T as me}from"./TextareaFormGroup-BFYMlwZm.js";import{S as w}from"./SwitchFormGroup-DbO3fJgb.js";import{I as pe}from"./ImageFormGroup-GbTT8rfu.js";import{S as U}from"./SelectFormGroup-qFWtdfMk.js";import{S as fe}from"./sweetalert2.all-Dh0rZL5X.js";import{B as he}from"./BasicEditing-Co4zseXw.js";import{Q as xe}from"./QuillFormGroup-D7flic0d.js";import{r as S}from"./DxBox-CdMuSyGE.js";import{S as be}from"./SelectAPIFormGroup-B31O-cm_.js";import{N as X}from"./Number2Currency-e57Tgsuk.js";import"./index-DO3Aws4m.js";import"./Global-mC9lKANG.js";import"./tippy-react.esm-CHhA99mn.js";/* empty css              */import"./main-B2CtU6ez.js";import"./___vite-browser-external_commonjs-proxy-C9-083JZ.js";import"./MenuItemContainer-DGfKOLAz.js";import"./index.esm-Cu-mVv1q.js";/* empty css               */const ge=({gridRef:s,rest:o,columns:i,toolBar:p,masterDetail:h,filterValue:x,exportable:b,exportableName:g,customizeCell:j=()=>{},onRefresh:R=()=>{}})=>(n.useEffect(()=>{DevExpress.localization.locale(navigator.language),$(s.current).dxDataGrid({language:"es",dataSource:{load:async c=>{const d=await o.paginate({...c});return R(d),d}},onToolbarPreparing:c=>{const{items:d}=c.toolbarOptions;p(d)},remoteOperations:!0,columnResizingMode:"widget",allowColumnResizing:!0,allowColumnReordering:!0,columnAutoWidth:!0,scrollbars:"auto",filterPanel:{visible:!0},searchPanel:{visible:!0},headerFilter:{visible:!0,search:{enabled:!0}},height:"calc(100vh - 185px)",filterValue:x,export:{enabled:b},onExporting:function(c){var d=new ExcelJS.Workbook,F=d.addWorksheet("Main sheet");DevExpress.excelExporter.exportDataGrid({worksheet:F,component:c.component,customizeCell:function(m){j(m),m.excelCell.alignment={horizontal:"left",vertical:"top",...m.excelCell.alignment}},includeHiddenColumns:!0}).then(function(){d.xlsx.writeBuffer().then(function(m){saveAs(new Blob([m],{type:"application/octet-stream"}),`${g}.xlsx`)})})},rowAlternationEnabled:!0,showBorders:!0,filterRow:{visible:!0,applyFilter:"auto"},filterBuilderPopup:{visible:!1,position:{of:window,at:"top",my:"top",offset:{y:10}}},paging:{pageSize:10},pager:{visible:!0,allowedPageSizes:[5,10,25,50,100],showPageSizeSelector:!0,showInfo:!0,showNavigationButtons:!0},allowFiltering:!0,scrolling:{mode:"standard",useNative:!0,preloadEnabled:!0,rowRenderingMode:"standard"},columnChooser:{title:"Mostrar/Ocultar columnas",enabled:!0,mode:"select",search:{enabled:!0}},columns:i,masterDetail:h,onContentReady:(...c)=>{tippy(".tippy-here",{arrow:!0,animation:"scale"})}}).dxDataGrid("instance"),tippy(".dx-button",{arrow:!0})},[null]),e.jsx("div",{ref:s})),je=({title:s,gridRef:o,rest:i,columns:p,toolBar:h,masterDetail:x,filterValue:b=[],onRefresh:g,exportable:j,exportableName:R,customizeCell:c=()=>{}})=>e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-12",children:e.jsxs("div",{className:"card",children:[typeof s=="object"?e.jsx("div",{className:"card-header",children:s}):"",e.jsxs("div",{className:"card-body",children:[typeof s!="object"?e.jsxs("h4",{className:"header-title",children:[e.jsx("div",{id:"header-title-options",className:"float-end"}),e.jsx("span",{id:"header-title-prefix"})," Lista de ",s," ",e.jsx("span",{id:"header-title-suffix"})]}):"",e.jsx(ge,{gridRef:o,rest:i,columns:p.filter(Boolean),toolBar:h,masterDetail:x,filterValue:b,onRefresh:g,exportable:j,exportableName:R,customizeCell:c})]})]})})});class ve extends he{constructor(){super(...arguments);G(this,"path","admin/items");G(this,"hasFiles",!0)}}const N=new ve,ye=({icons:s,categories:o})=>{const i=n.useRef(),p=n.useRef(),h=n.useRef(),x=n.useRef(),b=n.useRef(),g=n.useRef(),j=n.useRef(),R=n.useRef(),c=n.useRef(),d=n.useRef(),F=n.useRef(),m=n.useRef(),P=n.useRef(),q=n.useRef(),M=n.useRef(),O=n.useRef(),[Y,z]=n.useState(!1),[_,k]=n.useState([""]),[J,D]=n.useState([""]),[Q,T]=n.useState([""]),[V,B]=n.useState([{icon:"",text:""}]),[Z,ee]=n.useState(null),W=a=>{a!=null&&a.id?z(!0):z(!1),$(p.current).modal("show")},te=async a=>{a.preventDefault();const t={id:h.current.value||void 0,category_id:x.current.value,name:b.current.value,summary:g.current.value,description:j.current.value,sessions:R.current.value,type:c.current.value,certificate:d.current.value,session_duration:F.current.value,long_duration:m.current.value,price:P.current.value,discount:q.current.value,students:M.current.value,audience:JSON.stringify(_.filter(Boolean)),requirements:JSON.stringify(J.filter(Boolean)),objectives:JSON.stringify(Q.filter(Boolean)),content:JSON.stringify(V.filter(u=>u.icon||u.text))},r=new FormData;for(const u in t)r.append(u,t[u]);const l=O.current.files[0];l&&r.append("image",l),await N.save(r)&&($(i.current).dxDataGrid("instance").refresh(),$(p.current).modal("hide"))},ae=async({id:a,value:t})=>{await N.boolean({id:a,field:"visible",value:t})&&$(i.current).dxDataGrid("instance").refresh()},C=async({id:a,field:t,value:r})=>{await N.boolean({id:a,field:t,value:r})&&$(i.current).dxDataGrid("instance").refresh()},re=async a=>{const{isConfirmed:t}=await fe.fire({title:"Eliminar curso",text:"¿Estás seguro de eliminar este curso?",icon:"warning",showCancelButton:!0,confirmButtonText:"Sí, eliminar",cancelButtonText:"Cancelar"});!t||!await N.delete(a)||$(i.current).dxDataGrid("instance").refresh()},E=(a,t,r)=>{r(l=>l.map((f,u)=>u===a?t:f))},A=a=>{a(t=>[...t,""])},I=(a,t)=>{t(r=>r.filter((l,f)=>f!==a))},H=(a,t,r)=>{B(l=>l.map((f,u)=>u===a?{...f,[t]:r}:f))},ne=()=>{B(a=>[...a,{icon:"",text:""}])},se=a=>{B(t=>t.filter((r,l)=>l!==a))},L=a=>$(S(e.jsx("span",{children:e.jsx("i",{className:`${a.id} me-1`})})));return e.jsxs(e.Fragment,{children:[e.jsx(je,{gridRef:i,title:"Items",rest:N,toolBar:a=>{a.unshift({widget:"dxButton",location:"after",options:{icon:"refresh",hint:"Refrescar tabla",onClick:()=>$(i.current).dxDataGrid("instance").refresh()}}),a.unshift({widget:"dxButton",location:"after",options:{icon:"plus",text:"Nuevo curso",hint:"Nuevo curso",onClick:()=>W()}})},exportable:!0,exportableName:"Items",columns:[{dataField:"id",caption:"ID",visible:!1},{dataField:"category.name",caption:"Categoría",width:"120px",cellTemplate:(a,{data:t})=>{var r,l;a.html(S(e.jsxs(e.Fragment,{children:[e.jsx("b",{children:(r=t.category)==null?void 0:r.name}),e.jsx("small",{className:"text-muted",children:(l=t.subcategory)==null?void 0:l.name})]})))}},{dataField:"subcategory.name",caption:"Subcategoría",visible:!1},{dataField:"brand.name",caption:"Marca",width:"120px"},{dataField:"name",caption:"Nombre",width:"40%",cellTemplate:(a,{data:t})=>{a.html(S(e.jsxs(e.Fragment,{children:[e.jsx("b",{children:t.name}),e.jsx("br",{}),e.jsx("span",{className:"truncate",children:t.summary})]})))}},{dataField:"price",caption:"Precio",dataType:"number",width:"75px",cellTemplate:(a,{data:t})=>{a.html(S(e.jsxs(e.Fragment,{children:[t.discount>0&&e.jsxs("small",{className:"d-block text-muted",style:{textDecoration:"line-through"},children:["S/.",X(t.price)]}),e.jsxs("span",{children:["S/.",X(t.discount>0?t.discount:t.price)]})]})))}},{dataField:"image",caption:"Imagen",width:"90px",allowFiltering:!1,cellTemplate:(a,{data:t})=>{y(a,e.jsx("img",{src:`/api/items/media/${t.image}`,style:{width:"80px",height:"48px",objectFit:"cover",objectPosition:"center",borderRadius:"4px"},onError:r=>r.target.src="/api/cover/thumbnail/null"}))}},{dataField:"is_new",caption:"Nuevo",dataType:"boolean",width:"80px",cellTemplate:(a,{data:t})=>{y(a,e.jsx(w,{checked:t.is_new,onChange:r=>C({id:t.id,field:"is_new",value:r.target.checked})}))}},{dataField:"offering",caption:"En oferta",dataType:"boolean",width:"80px",cellTemplate:(a,{data:t})=>{y(a,e.jsx(w,{checked:t.offering,onChange:r=>C({id:t.id,field:"offering",value:r.target.checked})}))}},{dataField:"recommended",caption:"Recomendado",dataType:"boolean",width:"80px",cellTemplate:(a,{data:t})=>{y(a,e.jsx(w,{checked:t.recommended,onChange:r=>C({id:t.id,field:"recommended",value:r.target.checked})}))}},{dataField:"featured",caption:"Destacado",dataType:"boolean",width:"80px",cellTemplate:(a,{data:t})=>{y(a,e.jsx(w,{checked:t.featured,onChange:r=>C({id:t.id,field:"featured",value:r.target.checked})}))}},{dataField:"visible",caption:"Visible",dataType:"boolean",width:"80px",cellTemplate:(a,{data:t})=>{y(a,e.jsx(w,{checked:t.visible,onChange:r=>ae({id:t.id,value:r.target.checked})}))}},{caption:"Acciones",width:"100px",cellTemplate:(a,{data:t})=>{a.css("text-overflow","unset"),a.append(K({className:"btn btn-xs btn-soft-primary",title:"Editar",icon:"fa fa-pen",onClick:()=>W(t)})),a.append(K({className:"btn btn-xs btn-soft-danger",title:"Eliminar",icon:"fa fa-trash",onClick:()=>re(t.id)}))},allowFiltering:!1,allowExporting:!1}]}),e.jsxs(ue,{modalRef:p,title:Y?"Editar curso":"Agregar curso",onSubmit:te,size:"lg",children:[e.jsxs("div",{className:"row",id:"principal-container",children:[e.jsx("input",{ref:h,type:"hidden"}),e.jsx(pe,{eRef:O,label:"Imagen",col:"col-md-6",aspect:1}),e.jsxs("div",{className:"col-md-6",children:[e.jsx(U,{eRef:x,label:"Categoría",required:!0,dropdownParent:"#principal-container",onChange:a=>ee(a.target.value),children:o.map((a,t)=>e.jsx("option",{value:a.id,children:a.name},t))}),e.jsx(be,{label:"Subcategoría",searchAPI:"/api/admin/subcategories/paginate",searchBy:"name",filter:["category_id","=",Z],dropdownParent:"#principal-container"}),e.jsx(v,{eRef:b,label:"Nombre",required:!0}),e.jsx(me,{eRef:g,label:"Resumen",rows:3,required:!0}),e.jsxs("div",{className:"row",children:[e.jsx(v,{eRef:P,label:"Precio",type:"number",col:"col-sm-6",step:"0.01",required:!0}),e.jsx(v,{eRef:q,label:"Descuento",type:"number",col:"col-sm-6",step:"0.01"})]})]})]}),e.jsx("hr",{className:"my-2"}),e.jsxs("div",{className:"row",id:"items-container",children:[e.jsx(v,{eRef:d,label:"Tipo certificado",col:"col-md-6",placeholder:"Físico y Virtual PDF",required:!0}),e.jsx(v,{eRef:M,label:"Estudiantes",type:"number",col:"col-md-2",required:!0}),e.jsx(v,{eRef:m,label:"Duración total (días)",placeholder:"30",col:"col-md-4"}),e.jsx(xe,{eRef:j,label:"Descripción"}),e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{className:"form-label",children:"¿A quién va dirigido?"}),_.map((a,t)=>e.jsxs("div",{className:"input-group mb-2",children:[e.jsx("input",{type:"text",className:"form-control",value:a,onChange:r=>E(t,r.target.value,k)}),e.jsx("button",{type:"button",className:"btn btn-outline-danger",onClick:()=>I(t,k),children:e.jsx("i",{className:"fa fa-trash"})})]},t)),e.jsx("button",{type:"button",className:"btn btn-outline-primary",onClick:()=>A(k),children:"Agregar Audiencia"})]}),e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{className:"form-label",children:"¿Cuáles son los requisitos?"}),J.map((a,t)=>e.jsxs("div",{className:"input-group mb-2",children:[e.jsx("input",{type:"text",className:"form-control",value:a,onChange:r=>E(t,r.target.value,D)}),e.jsx("button",{type:"button",className:"btn btn-outline-danger",onClick:()=>I(t,D),children:e.jsx("i",{className:"fa fa-trash"})})]},t)),e.jsx("button",{type:"button",className:"btn btn-outline-primary",onClick:()=>A(D),children:"Agregar Requisito"})]}),e.jsxs("div",{className:"col-md-12 mb-3",children:[e.jsx("label",{className:"form-label",children:"¿Qué aprenderas?"}),Q.map((a,t)=>e.jsxs("div",{className:"input-group mb-2",children:[e.jsx("input",{type:"text",className:"form-control",value:a,onChange:r=>E(t,r.target.value,T)}),e.jsx("button",{type:"button",className:"btn btn-outline-danger",onClick:()=>I(t,T),children:e.jsx("i",{className:"fa fa-trash"})})]},t)),e.jsx("button",{type:"button",className:"btn btn-outline-primary",onClick:()=>A(T),children:"Agregar Objetivo"})]}),e.jsxs("div",{className:"col-12 mb-3",children:[e.jsx("label",{className:"form-label",children:"Contenido"}),V.map((a,t)=>e.jsxs("div",{className:"input-group mb-2",style:{width:"100%"},children:[e.jsx(U,{className:"input-group-text",dropdownParent:"#items-container",onChange:r=>H(t,"icon",r.target.value),templateResult:L,templateSelection:L,noMargin:!0,children:s.map((r,l)=>e.jsx("option",{value:r.id,children:r.value},l))}),e.jsx("input",{type:"text",className:"form-control",placeholder:"Texto",value:a.text,onChange:r=>H(t,"text",r.target.value)}),e.jsx("button",{type:"button",className:"btn btn-outline-danger input-group-text",onClick:()=>se(t),children:e.jsx("i",{className:"fa fa-trash"})})]},t)),e.jsx("button",{type:"button",className:"btn btn-outline-primary",onClick:ne,children:"Agregar Contenido"})]})]})]})]})};de((s,o)=>{le(s).render(e.jsx(ce,{...o,title:"Items",children:e.jsx(ye,{...o})}))});