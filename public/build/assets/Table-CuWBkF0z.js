import{j as e}from"./AboutHeader-Bdo2C3ON.js";import{r as d}from"./index-DFv2mRv-.js";const c=({gridRef:a,rest:o,columns:s,toolBar:i,masterDetail:l,filterValue:n})=>(d.useEffect(()=>{DevExpress.localization.locale(navigator.language),$(a.current).dxDataGrid({language:"es",dataSource:{load:async r=>await o.paginate({...r,_token:$('[name="csrf_token"]').attr("content")})},onToolbarPreparing:r=>{const{items:t}=r.toolbarOptions;i(t)},remoteOperations:!0,columnResizingMode:"widget",allowColumnResizing:!0,allowColumnReordering:!0,columnAutoWidth:!0,scrollbars:"auto",filterPanel:{visible:!0},searchPanel:{visible:!0},headerFilter:{visible:!0,search:{enabled:!0}},height:"calc(100vh - 185px)",filterValue:n,rowAlternationEnabled:!0,showBorders:!0,filterRow:{visible:!0,applyFilter:"auto"},filterBuilderPopup:{visible:!1,position:{of:window,at:"top",my:"top",offset:{y:10}}},paging:{pageSize:10},pager:{visible:!0,allowedPageSizes:[5,10,25,50,100],showPageSizeSelector:!0,showInfo:!0,showNavigationButtons:!0},allowFiltering:!0,scrolling:{mode:"standard",useNative:!0,preloadEnabled:!0,rowRenderingMode:"standard"},columnChooser:{title:"Mostrar/Ocultar columnas",enabled:!0,mode:"select",search:{enabled:!0}},columns:s,masterDetail:l,onContentReady:(...r)=>{tippy(".tippy-here",{arrow:!0,animation:"scale"})}}).dxDataGrid("instance"),tippy(".dx-button",{arrow:!0})},[null]),e.jsx("div",{ref:a})),h=({title:a,gridRef:o,rest:s,columns:i,toolBar:l,masterDetail:n,filterValue:r=[],onRefresh:t})=>e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-12",children:e.jsxs("div",{className:"card",children:[typeof a=="object"?e.jsx("div",{className:"card-header",children:a}):"",e.jsxs("div",{className:"card-body",children:[typeof a!="object"?e.jsxs("h4",{className:"header-title",children:[e.jsx("div",{id:"header-title-options",className:"float-end"}),e.jsx("span",{id:"header-title-prefix"})," Lista de ",a," ",e.jsx("span",{id:"header-title-suffix"})]}):"",e.jsx(c,{gridRef:o,rest:s,columns:i.filter(Boolean),toolBar:l,masterDetail:n,filterValue:r,onRefresh:t})]})]})})});export{h as T};