var k=Object.defineProperty;var R=(n,s,o)=>s in n?k(n,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[s]=o;var w=(n,s,o)=>R(n,typeof s!="symbol"?s+"":s,o);import{j as i}from"./AboutSimple-Cf8x2fCZ.js";import{r as h}from"./index-BOnQTV8N.js";import{c as j}from"./ReactAppend-QR5TrZfj.js";import{B as T}from"./Base-C1Y36PX1.js";import{B as D}from"./BasicRest-BML1C-ua.js";import{T as E}from"./Table-Cv1BshIS.js";import{D as F}from"./DxButton-DV0H-ZcL.js";import{C as I}from"./CreateReactScript-Bqovr-Zn.js";import{R as c}from"./ReactAppend-Vm5G2nof.js";import{S as d}from"./ProductCard-D9l7c7at.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./index-B6ujFmsw.js";import"./Global-CazroCzF.js";import"./tippy-react.esm-DmkRJDEW.js";import"./index-pSueRYGM.js";/* empty css              */import"./Logout-BpuTJ_83.js";import"./main-B6F2O9-U.js";import"./___vite-browser-external_commonjs-proxy-DDYoOVPM.js";import"./MenuItemContainer-DcxtOi47.js";import"./index.esm-C48oHfFw.js";import"./index-ngrFHoWO.js";import"./CanAccess-BlvzCYjQ.js";import"./CardProductKatya-ncpmQ0JU.js";import"./BooleanLimit-D-OsQsek.js";import"./Modal-xDw9ufjg.js";/* empty css               */import"./General-apRuNwp7.js";import"./LaravelSession-Dz9cpV3l.js";class A extends D{constructor(){super(...arguments);w(this,"path","admin/bookings")}async confirm(o){return await this.post(`/api/admin/bookings/${o}/confirm`)}async complete(o){return await this.post(`/api/admin/bookings/${o}/complete`)}async cancel(o,l){return await this.post(`/api/admin/bookings/${o}/cancel`,l)}async noShow(o){return await this.post(`/api/admin/bookings/${o}/no-show`)}}const f=new A,M=()=>{const n=h.useRef(),[s,o]=h.useState("all"),l=t=>{const e=new Date(t),a=String(e.getDate()).padStart(2,"0"),r=String(e.getMonth()+1).padStart(2,"0"),m=e.getFullYear();return`${a}/${r}/${m}`},b=t=>{const e=new Date(t),a=String(e.getDate()).padStart(2,"0"),r=String(e.getMonth()+1).padStart(2,"0"),m=e.getFullYear(),p=String(e.getHours()).padStart(2,"0"),g=String(e.getMinutes()).padStart(2,"0");return`${a}/${r}/${m} ${p}:${g}`},C=()=>{const t=[];return s!=="all"&&t.push(["status","=",s]),{filters:JSON.stringify(t),orderBy:"check_in",orderDirection:"desc"}};h.useEffect(()=>{n.current&&$(n.current).dxDataGrid("instance").refresh()},[s]);const y=t=>{var p,g,x,v;const e="modal-booking-details",a=t.guest_info?JSON.parse(t.guest_info):{},r={pending:'<span class="badge badge-warning">Pendiente</span>',confirmed:'<span class="badge badge-success">Confirmada</span>',cancelled:'<span class="badge badge-danger">Cancelada</span>',completed:'<span class="badge badge-info">Completada</span>',no_show:'<span class="badge badge-secondary">No Show</span>'},m=`
      <div class="modal fade" id="${e}" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="mdi mdi-calendar-check mr-2"></i>
                Detalles de la Reserva #${(p=t.id)==null?void 0:p.substring(0,8)}
              </h5>
              <button type="button" class="close text-white" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-12">
                  <div class="alert alert-light border">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Estado:</strong> ${r[t.status]||t.status}
                      </div>
                      <div>
                        <strong>Código de Reserva:</strong> <code>${t.booking_code||"N/A"}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <h6 class="text-primary"><i class="mdi mdi-bed-double mr-1"></i> Información de la Habitación</h6>
                  <table class="table table-sm">
                    <tr>
                      <td><strong>Habitación:</strong></td>
                      <td>${((g=t.item)==null?void 0:g.name)||"N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Tipo:</strong></td>
                      <td>${((x=t.item)==null?void 0:x.room_type)||"N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Check-in:</strong></td>
                      <td><i class="mdi mdi-calendar-arrow-right text-success"></i> ${l(t.check_in)}</td>
                    </tr>
                    <tr>
                      <td><strong>Check-out:</strong></td>
                      <td><i class="mdi mdi-calendar-arrow-left text-danger"></i> ${l(t.check_out)}</td>
                    </tr>
                    <tr>
                      <td><strong>Noches:</strong></td>
                      <td>${t.nights} noche${t.nights!==1?"s":""}</td>
                    </tr>
                  </table>
                </div>

                <div class="col-md-6">
                  <h6 class="text-primary"><i class="mdi mdi-account-multiple mr-1"></i> Información de Huéspedes</h6>
                  <table class="table table-sm">
                    <tr>
                      <td><strong>Total de Huéspedes:</strong></td>
                      <td>${t.guests} persona${t.guests!==1?"s":""}</td>
                    </tr>
                    <tr>
                      <td><strong>Adultos:</strong></td>
                      <td>${t.adults}</td>
                    </tr>
                    <tr>
                      <td><strong>Niños:</strong></td>
                      <td>${t.children}</td>
                    </tr>
                    ${a.name?`
                    <tr>
                      <td><strong>Nombre:</strong></td>
                      <td>${a.name}</td>
                    </tr>
                    `:""}
                    ${a.email?`
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>${a.email}</td>
                    </tr>
                    `:""}
                    ${a.phone?`
                    <tr>
                      <td><strong>Teléfono:</strong></td>
                      <td>${a.phone}</td>
                    </tr>
                    `:""}
                  </table>
                </div>
              </div>

              <div class="row mt-3">
                <div class="col-12">
                  <h6 class="text-primary"><i class="mdi mdi-currency-usd mr-1"></i> Información de Pago</h6>
                  <table class="table table-sm">
                    <tr>
                      <td><strong>Precio Base (por noche):</strong></td>
                      <td>S/ ${Number(t.base_price||0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td><strong>Total:</strong></td>
                      <td class="text-success"><strong>S/ ${Number(t.total_price||0).toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                      <td><strong>ID de Venta:</strong></td>
                      <td><a href="/admin/sales?id=${t.sale_id}" target="_blank">${(v=t.sale_id)==null?void 0:v.substring(0,8)}</a></td>
                    </tr>
                  </table>
                </div>
              </div>

              ${t.special_requests?`
              <div class="row mt-3">
                <div class="col-12">
                  <h6 class="text-primary"><i class="mdi mdi-note-text mr-1"></i> Solicitudes Especiales</h6>
                  <div class="alert alert-light border">
                    ${t.special_requests}
                  </div>
                </div>
              </div>
              `:""}

              ${t.cancellation_reason?`
              <div class="row mt-3">
                <div class="col-12">
                  <h6 class="text-danger"><i class="mdi mdi-alert-circle mr-1"></i> Razón de Cancelación</h6>
                  <div class="alert alert-danger">
                    ${t.cancellation_reason}
                  </div>
                </div>
              </div>
              `:""}

              <div class="row mt-3">
                <div class="col-12">
                  <small class="text-muted">
                    <strong>Creado:</strong> ${b(t.created_at)}
                    ${t.updated_at?` | <strong>Actualizado:</strong> ${b(t.updated_at)}`:""}
                  </small>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="btn-group mr-auto" role="group">
                ${t.status==="pending"?`
                  <button type="button" class="btn btn-success" id="btn-confirm-booking" data-booking-id="${t.id}">
                    <i class="mdi mdi-check-circle mr-1"></i> Confirmar
                  </button>
                `:""}
                ${t.status==="confirmed"?`
                  <button type="button" class="btn btn-info" id="btn-complete-booking" data-booking-id="${t.id}">
                    <i class="mdi mdi-check-all mr-1"></i> Marcar como Completada
                  </button>
                `:""}
                ${["pending","confirmed"].includes(t.status)?`
                  <button type="button" class="btn btn-danger" id="btn-cancel-booking" data-booking-id="${t.id}">
                    <i class="mdi mdi-close-circle mr-1"></i> Cancelar Reserva
                  </button>
                `:""}
              </div>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                <i class="mdi mdi-close mr-1"></i> Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;c(m,"modal-booking-details"),$(`#${e}`).modal("show"),$(`#${e}`).on("hidden.bs.modal",function(){$(this).remove()}),$("#btn-confirm-booking").on("click",function(){const u=$(this).data("booking-id");B(u)}),$("#btn-complete-booking").on("click",function(){const u=$(this).data("booking-id");S(u)}),$("#btn-cancel-booking").on("click",function(){const u=$(this).data("booking-id");_(u)})},B=async t=>{if((await d.fire({title:"Confirmar Reserva",text:"¿Estás seguro de confirmar esta reserva?",icon:"question",showCancelButton:!0,confirmButtonColor:"#28a745",cancelButtonColor:"#6c757d",confirmButtonText:"Sí, confirmar",cancelButtonText:"Cancelar"})).isConfirmed)try{(await f.confirm(t)).status&&(d.fire({icon:"success",title:"¡Confirmada!",text:"La reserva ha sido confirmada correctamente",timer:2e3,showConfirmButton:!1}),$(".modal").modal("hide"),$(n.current).dxDataGrid("instance").refresh())}catch{d.fire({icon:"error",title:"Error",text:"Error al confirmar la reserva"})}},S=async t=>{if((await d.fire({title:"Completar Reserva",text:"¿El huésped ya ha hecho el check-out?",icon:"question",showCancelButton:!0,confirmButtonColor:"#17a2b8",cancelButtonColor:"#6c757d",confirmButtonText:"Sí, completar",cancelButtonText:"Cancelar"})).isConfirmed)try{(await f.complete(t)).status&&(d.fire({icon:"success",title:"¡Completada!",text:"La reserva ha sido marcada como completada",timer:2e3,showConfirmButton:!1}),$(".modal").modal("hide"),$(n.current).dxDataGrid("instance").refresh())}catch{d.fire({icon:"error",title:"Error",text:"Error al completar la reserva"})}},_=async t=>{const{value:e}=await d.fire({title:"Cancelar Reserva",input:"textarea",inputLabel:"Razón de la cancelación",inputPlaceholder:"Ingresa la razón de la cancelación...",inputAttributes:{"aria-label":"Razón de cancelación"},showCancelButton:!0,confirmButtonColor:"#dc3545",cancelButtonColor:"#6c757d",confirmButtonText:"Sí, cancelar reserva",cancelButtonText:"No cancelar",inputValidator:a=>{if(!a)return"Debes ingresar una razón para la cancelación"}});if(e)try{(await f.cancel(t,{reason:e})).status&&(d.fire({icon:"success",title:"¡Cancelada!",text:"La reserva ha sido cancelada correctamente",timer:2e3,showConfirmButton:!1}),$(".modal").modal("hide"),$(n.current).dxDataGrid("instance").refresh())}catch{d.fire({icon:"error",title:"Error",text:"Error al cancelar la reserva"})}},N=t=>{const e={pending:"badge-warning",confirmed:"badge-success",cancelled:"badge-danger",completed:"badge-info",no_show:"badge-secondary"},a={pending:"Pendiente",confirmed:"Confirmada",cancelled:"Cancelada",completed:"Completada",no_show:"No Show"};return{badge:e[t]||"badge-secondary",label:a[t]||t}};return i.jsx(E,{gridRef:n,title:"Reservas",rest:f,restParams:C(),toolBar:t=>{t.unshift({widget:"dxButton",location:"before",options:{text:"Todas",type:s==="all"?"default":"normal",stylingMode:s==="all"?"contained":"outlined",onClick:()=>o("all")}},{widget:"dxButton",location:"before",options:{text:"Pendientes",type:s==="pending"?"default":"normal",stylingMode:s==="pending"?"contained":"outlined",onClick:()=>o("pending")}},{widget:"dxButton",location:"before",options:{text:"Confirmadas",type:s==="confirmed"?"default":"normal",stylingMode:s==="confirmed"?"contained":"outlined",onClick:()=>o("confirmed")}},{widget:"dxButton",location:"before",options:{text:"Completadas",type:s==="completed"?"default":"normal",stylingMode:s==="completed"?"contained":"outlined",onClick:()=>o("completed")}},{widget:"dxButton",location:"before",options:{text:"Canceladas",type:s==="cancelled"?"default":"normal",stylingMode:s==="cancelled"?"contained":"outlined",onClick:()=>o("cancelled")}}),t.unshift({widget:"dxButton",location:"after",options:{icon:"refresh",hint:"Refrescar tabla",onClick:()=>$(n.current).dxDataGrid("instance").refresh()}})},columns:[{dataField:"id",caption:"ID",visible:!1},{dataField:"booking_code",caption:"Código",width:"12%",cellTemplate:(t,{data:e})=>{var a;c(t,i.jsx("code",{children:e.booking_code||((a=e.id)==null?void 0:a.substring(0,8))}))}},{dataField:"item.name",caption:"Habitación",width:"18%",cellTemplate:(t,{data:e})=>{var a,r;c(t,i.jsxs("div",{children:[i.jsx("strong",{children:((a=e.item)==null?void 0:a.name)||"N/A"}),i.jsx("div",{className:"small text-muted",children:((r=e.item)==null?void 0:r.room_type)||""})]}))}},{dataField:"check_in",caption:"Check-in / Check-out",width:"18%",cellTemplate:(t,{data:e})=>{c(t,i.jsxs("div",{children:[i.jsxs("div",{className:"small",children:[i.jsx("i",{className:"mdi mdi-calendar-arrow-right text-success mr-1"}),l(e.check_in)]}),i.jsxs("div",{className:"small",children:[i.jsx("i",{className:"mdi mdi-calendar-arrow-left text-danger mr-1"}),l(e.check_out)]}),i.jsxs("div",{className:"small text-muted",children:[e.nights," noche",e.nights!==1?"s":""]})]}))}},{dataField:"guests",caption:"Huéspedes",width:"12%",cellTemplate:(t,{data:e})=>{c(t,i.jsxs("div",{className:"text-center",children:[i.jsxs("div",{children:[i.jsx("i",{className:"mdi mdi-account-multiple text-primary"})," ",e.guests]}),i.jsxs("div",{className:"small text-muted",children:[e.adults," adulto",e.adults!==1?"s":"",e.children>0&&`, ${e.children} niño${e.children!==1?"s":""}`]})]}))}},{dataField:"total_price",caption:"Total",width:"12%",cellTemplate:(t,{data:e})=>{c(t,i.jsxs("strong",{className:"text-success",children:["S/ ",Number(e.total_price||0).toFixed(2)]}))}},{dataField:"status",caption:"Estado",width:"12%",cellTemplate:(t,{data:e})=>{const{badge:a,label:r}=N(e.status);c(t,i.jsx("span",{className:`badge ${a}`,children:r}))}},{caption:"Acciones",cellTemplate:(t,{data:e})=>{t.css("text-overflow","unset"),t.append(F({className:"btn btn-xs btn-soft-primary",title:"Ver Detalles",icon:"fa fa-eye",onClick:()=>y(e)}))},allowFiltering:!1,allowExporting:!1}]})};I((n,s)=>{j.createRoot(n).render(i.jsx(T,{...s,title:"Reservas",children:i.jsx(M,{...s})}))});
