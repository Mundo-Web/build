var p=Object.defineProperty;var f=(l,r,s)=>r in l?p(l,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[r]=s;var c=(l,r,s)=>f(l,typeof r!="symbol"?r+"":r,s);import{j as o}from"./AboutSimple-Cf8x2fCZ.js";import{r as u}from"./index-BOnQTV8N.js";import{c as b}from"./ReactAppend-QR5TrZfj.js";import{B as g}from"./Base-BBEfqqc-.js";import{C as x}from"./CreateReactScript-d60iGIqA.js";import{T as h}from"./Table-hR1LHIgy.js";import{R as i}from"./ReactAppend-Vm5G2nof.js";import{D as v}from"./DxButton-DV0H-ZcL.js";import{S as y}from"./SwitchFormGroup-DXN0cwVk.js";import{S as m}from"./CartKuchara-D9l7c7at.js";import{B as w}from"./BasicRest-BML1C-ua.js";import{s as C}from"./server.browser-Bf4gQIc7.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./index-B6ujFmsw.js";import"./Global-Bz6gVLc5.js";import"./tippy-react.esm-DmkRJDEW.js";import"./index-pSueRYGM.js";/* empty css              */import"./Logout-BpuTJ_83.js";import"./main-B6F2O9-U.js";import"./___vite-browser-external_commonjs-proxy-DDYoOVPM.js";import"./MenuItemContainer-DcxtOi47.js";import"./index.esm-C48oHfFw.js";import"./index-ngrFHoWO.js";import"./CanAccess-D2C6GWbm.js";/* empty css               */import"./General-CE1RDd44.js";import"./LaravelSession-Dz9cpV3l.js";import"./BooleanLimit-D-OsQsek.js";import"./Modal-xDw9ufjg.js";import"./CardProductKatya-ncpmQ0JU.js";class D extends w{constructor(){super(...arguments);c(this,"path","admin/clients");c(this,"hasFiles",!1)}}const d=new D,j=({})=>{const l=u.useRef(),r=async({id:e,value:t})=>{const{isConfirmed:a}=await m.fire({title:t?"Activar cliente":"Desactivar cliente",text:`¿Estás seguro de ${t?"activar":"desactivar"} este cliente?`,icon:"question",showCancelButton:!0,confirmButtonText:"Sí, continuar",cancelButtonText:"Cancelar"});if(!a){$(l.current).dxDataGrid("instance").refresh();return}await d.boolean({id:e,field:"status",value:t})&&$(l.current).dxDataGrid("instance").refresh()},s=e=>{const t=new Date(e.created_at),a=t.toLocaleDateString("es-ES")+" "+t.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"});m.fire({title:"Detalles del Cliente",html:`
        <div style="text-align: left; max-width: 100%;">
          <form style="padding: 20px 0;">
            <div class="row">
              
              <!-- Columna Izquierda -->
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Nombre Completo</label>
                  <input type="text" class="form-control" value="${e.name} ${e.lastname||""}" readonly style="background-color: #f8f9fa;">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Email</label>
                  <input type="email" class="form-control" value="${e.email||""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Teléfono</label>
                  <input type="text" class="form-control" value="${e.phone?(e.phone_prefix||"+51")+" "+e.phone:""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                ${e.alternate_phone?`
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Teléfono Alternativo</label>
                  <input type="text" class="form-control" value="${e.alternate_phone}" readonly style="background-color: #f8f9fa;">
                </div>
                `:""}
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Tipo de Documento</label>
                  <input type="text" class="form-control" value="${e.document_type||""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
              </div>
              
              <!-- Columna Derecha -->
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Número de Documento</label>
                  <input type="text" class="form-control" value="${e.document_number||""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Dirección</label>
                  <input type="text" class="form-control" value="${e.address||""}" readonly style="background-color: #f8f9fa;" placeholder="No especificada">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Distrito</label>
                  <input type="text" class="form-control" value="${e.district||""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Provincia</label>
                  <input type="text" class="form-control" value="${e.province||""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Departamento</label>
                  <input type="text" class="form-control" value="${e.department||""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
              </div>
              
              <!-- Fila completa para campos adicionales -->
              <div class="col-12">
                ${e.reference?`
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Referencia</label>
                  <textarea class="form-control" readonly style="background-color: #f8f9fa; resize: none;" rows="2">${e.reference}</textarea>
                </div>
                `:""}
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Estado</label>
                      <input type="text" class="form-control ${e.status==1?"border-success":"border-danger"}" 
                             value="${e.status==1?"Activo":"Inactivo"}" readonly 
                             style="background-color: ${e.status==1?"#d4edda":"#f8d7da"}; 
                                    color: ${e.status==1?"#155724":"#721c24"}; 
                                    font-weight: 600;">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Fecha de Registro</label>
                      <input type="text" class="form-control" value="${a}" readonly style="background-color: #f8f9fa;">
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      `,width:"800px",showConfirmButton:!0,confirmButtonText:"Cerrar",confirmButtonColor:"#6c757d",allowOutsideClick:!0,allowEscapeKey:!0,customClass:{popup:"client-details-modal"},didOpen:()=>{const n=document.createElement("style");n.innerHTML=`
          .client-details-modal {
            border-radius: 8px !important;
          }
          .client-details-modal .swal2-title {
            color: #495057 !important;
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            margin-bottom: 10px !important;
          }
          .client-details-modal .swal2-html-container {
            margin: 0 !important;
            padding: 0 20px 20px 20px !important;
          }
          .client-details-modal .form-control:read-only {
            cursor: default !important;
          }
          .client-details-modal .form-label {
            font-size: 0.9rem !important;
          }
        `,document.head.appendChild(n)}})};return o.jsx(o.Fragment,{children:o.jsx(h,{gridRef:l,title:"Clientes",rest:d,toolBar:e=>{e.unshift({widget:"dxButton",location:"after",options:{icon:"refresh",hint:"Refrescar tabla",onClick:()=>$(l.current).dxDataGrid("instance").refresh()}})},columns:[{dataField:"id",caption:"ID",visible:!1},{dataField:"name",caption:"Cliente",width:"25%",cellTemplate:(e,{data:t})=>{i(e,o.jsxs("div",{children:[o.jsxs("strong",{children:[t.name," ",t.lastname||""]}),o.jsx("br",{}),o.jsx("small",{className:"text-muted",children:t.email})]}))}},{dataField:"phone",caption:"Teléfono",cellTemplate:(e,{data:t})=>{t.phone?i(e,o.jsxs("span",{children:[t.phone_prefix||"+51"," ",t.phone]})):i(e,o.jsx("span",{className:"text-muted",children:"- Sin teléfono -"}))}},{dataField:"document_number",caption:"Documento",cellTemplate:(e,{data:t})=>{t.document_number?i(e,o.jsx("div",{children:o.jsxs("span",{children:[t.document_type||"DOC",": ",t.document_number]})})):i(e,o.jsx("span",{className:"text-muted",children:"- Sin documento -"}))}},{dataField:"city",caption:"Ubicación",cellTemplate:(e,{data:t})=>{const a=[t.city,t.department].filter(Boolean).join(", ");a?i(e,o.jsx("span",{children:a})):i(e,o.jsx("span",{className:"text-muted",children:"- Sin ubicación -"}))}},{dataField:"created_at",caption:"Registro",dataType:"date",cellTemplate:(e,{data:t})=>{const a=new Date(t.created_at);e.html(C.renderToString(o.jsxs(o.Fragment,{children:[o.jsx("div",{children:a.toLocaleDateString("es-ES")}),o.jsx("small",{className:"text-muted",children:a.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})})]})))}},{dataField:"status",caption:"Estado",dataType:"boolean",width:"120px",cellTemplate:(e,{data:t})=>{i(e,o.jsx(y,{checked:t.status==1,onChange:a=>r({id:t.id,value:a.target.checked})}))}},{caption:"Acciones",cellTemplate:(e,{data:t})=>{e.css("text-overflow","unset"),e.append(v({className:"btn btn-xs btn-soft-info",title:"Ver detalles",icon:"fa fa-eye",onClick:()=>s(t)}))},allowFiltering:!1,allowExporting:!1}]})})};x((l,r)=>{b.createRoot(l).render(o.jsx(g,{...r,title:"Clientes",children:o.jsx(j,{...r})}))});
