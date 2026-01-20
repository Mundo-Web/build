import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{r as d}from"./index-BOnQTV8N.js";import{c as ke}from"./ReactAppend-QR5TrZfj.js";import{B as Ce}from"./Base-CHWft3X0.js";import{C as we}from"./CreateReactScript-C-lKJ7Gs.js";import{m as g}from"./main-B6F2O9-U.js";import{S as l}from"./CartKuchara-D9l7c7at.js";import{C as Se,N as De}from"./Number2Currency-ld0bFawA.js";import{M as U}from"./Modal-xDw9ufjg.js";import{D as E}from"./index.es-6yWvxdWu.js";import"./SearchWidget-D7iHOckK.js";import{i as z}from"./tippy-react.esm-DmkRJDEW.js";/* empty css              */import{e as O}from"./es-QTeD0CGG.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./index-B6ujFmsw.js";import"./Global-Bz6gVLc5.js";import"./Logout-BpuTJ_83.js";import"./MenuItemContainer-DcxtOi47.js";import"./index.esm-C48oHfFw.js";import"./index-ngrFHoWO.js";import"./___vite-browser-external_commonjs-proxy-DDYoOVPM.js";import"./CanAccess-UkN68hbD.js";/* empty css               */import"./General-CE1RDd44.js";import"./LaravelSession-Dz9cpV3l.js";import"./BooleanLimit-D-OsQsek.js";import"./floating-ui.react-h8x3UwNO.js";import"./floating-ui.dom-CID5cQpR.js";import"./index-pSueRYGM.js";import"./format-B6vr9H0z.js";const _e=({rooms:H=[]})=>{var oe;const C=d.useRef(),B=d.useRef(),[K,le]=d.useState(new Date),[W,re]=d.useState([]),[I,J]=d.useState(!1),[o,R]=d.useState(null),[b,de]=d.useState(null),[me,G]=d.useState(!1),[w,V]=d.useState(null),[S,Z]=d.useState(null),[Q,ee]=d.useState(""),[T,M]=d.useState(!0),A=d.useRef(),[a,p]=d.useState({fullname:"",email:"",phone:"",phone_prefix:"+51",document_type:"dni",document:"",guests:1,nights:1,check_in:new Date,check_out:new Date(new Date().setDate(new Date().getDate()+1)),special_requests:"",payment_method:"efectivo"}),[pe,se]=d.useState(!1),[ae,F]=d.useState(0),h=async(s=K)=>{J(!0);try{const t=s.toISOString().split("T")[0],c=await(await fetch(`/api/admin/room-availability/summary?date=${t}`,{headers:{Accept:"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))}})).json();c.status===200&&re(c.data.rooms||[])}catch(t){console.error("Error al cargar resumen:",t)}J(!1)};d.useEffect(()=>{h()},[]),d.useEffect(()=>{o&&a.nights>0&&F(a.nights*Number((o==null?void 0:o.price)||0))},[a.nights]);const he=s=>{le(s),h(s)},xe=s=>{const t={available:{bg:"#28a745",text:"#ffffff",label:"Disponible",icon:"mdi-check-circle"},occupied:{bg:"#dc3545",text:"#ffffff",label:"Ocupada",icon:"mdi-bed"},reserved:{bg:"#ffc107",text:"#000000",label:"Reservada",icon:"mdi-clock"},cleaning:{bg:"#fd7e14",text:"#ffffff",label:"En Limpieza",icon:"mdi-broom"},maintenance:{bg:"#6c757d",text:"#ffffff",label:"Mantenimiento",icon:"mdi-tools"},full:{bg:"#17a2b8",text:"#ffffff",label:"Sin disponibilidad",icon:"mdi-information"}};return t[s]||t.available},v=async s=>{R(s),G(!0),$(C.current).modal("show");try{const t=new Date,i=new Date;i.setMonth(i.getMonth()+3);const n=await(await fetch(`/api/admin/room-availability/${s.id}/calendar?start_date=${t.toISOString().split("T")[0]}&end_date=${i.toISOString().split("T")[0]}`,{headers:{Accept:"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))}})).json();n.status===200&&de(n.data)}catch(t){console.error("Error al cargar calendario:",t)}G(!1)},ue=s=>{R(s),V(new Date),Z(new Date),ee(""),M(!0),$(B.current).modal("show")},fe=s=>{R(s);const t=new Date,i=new Date;i.setDate(i.getDate()+1),p({fullname:"",email:"",phone:"",phone_prefix:"+51",document_type:"dni",document:"",guests:1,nights:1,check_in:t,check_out:i,special_requests:"",payment_method:"efectivo"}),F(Number((s==null?void 0:s.price)||0)),$(A.current).modal("show")},ge=async()=>{if(!w||!S){l.fire("Error","Selecciona las fechas","error");return}try{const t=await(await fetch(`/api/admin/room-availability/${o.id}/block`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))},body:JSON.stringify({start_date:w.toISOString().split("T")[0],end_date:S.toISOString().split("T")[0],block:T,reason:Q})})).json();t.status===200?(l.fire("¡Éxito!",t.message,"success"),$(B.current).modal("hide"),h(),b&&v(o)):l.fire("Error",t.message,"error")}catch{l.fire("Error","Error al procesar la solicitud","error")}},be=async s=>{var t,i;if(s&&s.preventDefault&&s.preventDefault(),console.log("🔍 Iniciando registro de ocupación..."),!a.fullname||!a.document)return await l.fire("Error","Complete todos los campos obligatorios (Nombre y N° Documento)","error"),!1;if(a.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email))return await l.fire("Error","Ingrese un email válido","error"),!1;se(!0);try{console.log("📤 Enviando datos al servidor...");const c=await fetch("/api/admin/bookings/direct-register",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))},body:JSON.stringify({room_id:o.id,fullname:a.fullname,email:a.email||null,phone:a.phone,phone_prefix:a.phone_prefix,document_type:a.document_type,document:a.document,guests:a.guests,nights:a.nights,check_in:moment(a.check_in).format("YYYY-MM-DD"),check_out:moment(a.check_out).format("YYYY-MM-DD"),special_requests:a.special_requests,payment_method:a.payment_method,total_price:ae})});console.log("📥 Respuesta recibida:",c.status);const n=await c.json();if(console.log("📊 Resultado parseado:",n),n.status===200)return console.log("✅ Registro exitoso!"),await l.fire({icon:"success",title:"¡Registro exitoso!",html:`
            <p>Habitación ocupada correctamente</p>
            <p><strong>Código de reserva:</strong> ${((i=(t=n.data)==null?void 0:t.sale)==null?void 0:i.code)||""}</p>
          `,confirmButtonText:"Aceptar"}),$(A.current).modal("hide"),h(),!0;{console.log("❌ Error en el registro:",n);let r=n.message||"Error al registrar la ocupación";return n.errors&&(r=Object.values(n.errors).flat().join("<br>")),await l.fire({icon:"error",title:"Error en el registro",html:r,confirmButtonText:"Aceptar"}),!1}}catch(c){return console.error("💥 Error al registrar:",c),await l.fire({icon:"error",title:"Error de conexión",text:"No se pudo conectar con el servidor. Verifique su conexión.",confirmButtonText:"Aceptar"}),!1}finally{se(!1)}},je=async s=>{if((await l.fire({title:"Check-In",html:`
        <p>¿Confirmar el check-in del huésped?</p>
        <small class="text-muted">Fecha y hora: ${new Date().toLocaleString("es-PE")}</small>
      `,icon:"question",showCancelButton:!0,confirmButtonColor:"#28a745",cancelButtonColor:"#6c757d",confirmButtonText:'<i class="mdi mdi-check-circle"></i> Confirmar Check-In',cancelButtonText:"Cancelar"})).isConfirmed)try{const c=await(await fetch(`/api/admin/bookings/${s}/confirm`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))}})).json();c.status?(l.fire({icon:"success",title:"¡Check-In Realizado!",text:"El huésped ha hecho el check-in correctamente",timer:2e3,showConfirmButton:!1}),o&&await v(o),h()):l.fire("Error",c.message||"Error al realizar check-in","error")}catch{l.fire("Error","Error al procesar la solicitud","error")}},te=async s=>{if((await l.fire({title:"Check-Out",html:`
        <p>¿Confirmar el check-out del huésped?</p>
        <small class="text-muted">Fecha y hora: ${new Date().toLocaleString("es-PE")}</small>
        <div class="alert alert-info mt-3 mb-0">
          <i class="mdi mdi-information"></i>
          La habitación pasará a estado de <strong>limpieza</strong>
        </div>
      `,icon:"question",showCancelButton:!0,confirmButtonColor:"#17a2b8",cancelButtonColor:"#6c757d",confirmButtonText:'<i class="mdi mdi-check-all"></i> Confirmar Check-Out',cancelButtonText:"Cancelar"})).isConfirmed)try{const c=await(await fetch(`/api/admin/bookings/${s}/complete`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))}})).json();c.status?(l.fire({icon:"success",title:"¡Check-Out Realizado!",html:`
            <p>La reserva ha sido completada correctamente</p>
            <div class="alert alert-warning mt-2">
              <i class="mdi mdi-broom"></i> Habitación en proceso de limpieza
            </div>
          `,timer:2500,showConfirmButton:!1}),o&&await v(o),h()):l.fire("Error",c.message||"Error al realizar check-out","error")}catch{l.fire("Error","Error al procesar la solicitud","error")}},ie=async s=>{const{value:t}=await l.fire({title:"Cancelar Reserva",input:"textarea",inputLabel:"Razón de la cancelación",inputPlaceholder:"Ej: Cliente solicitó cancelación, cambio de planes, etc.",inputAttributes:{"aria-label":"Razón de cancelación"},showCancelButton:!0,confirmButtonColor:"#dc3545",cancelButtonColor:"#6c757d",confirmButtonText:'<i class="mdi mdi-close-circle"></i> Cancelar Reserva',cancelButtonText:"No cancelar",inputValidator:i=>{if(!i)return"Debes ingresar una razón para la cancelación"}});if(t)try{const c=await(await fetch(`/api/admin/bookings/${s}/cancel`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))},body:JSON.stringify({reason:t})})).json();c.status?(l.fire({icon:"success",title:"¡Reserva Cancelada!",text:"La reserva ha sido cancelada correctamente",timer:2e3,showConfirmButton:!1}),o&&await v(o),h()):l.fire("Error",c.message||"Error al cancelar la reserva","error")}catch{l.fire("Error","Error al procesar la solicitud","error")}},Ne=async s=>{if((await l.fire({title:"Finalizar Limpieza",html:`
        <p>¿Confirmar que la limpieza ha sido completada?</p>
        <div class="alert alert-success mt-3 mb-0">
          <i class="mdi mdi-check-circle"></i>
          La habitación quedará <strong>disponible</strong> para nuevas reservas
        </div>
      `,icon:"question",showCancelButton:!0,confirmButtonColor:"#28a745",cancelButtonColor:"#6c757d",confirmButtonText:'<i class="mdi mdi-check-all"></i> Limpieza Completada',cancelButtonText:"Cancelar"})).isConfirmed)try{const c=await(await fetch(`/api/admin/room-availability/${s}/complete-cleaning`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))},body:JSON.stringify({date:new Date().toISOString().split("T")[0]})})).json();c.status===200?(l.fire({icon:"success",title:"¡Limpieza Completada!",text:"La habitación está disponible nuevamente",timer:2e3,showConfirmButton:!1}),h(),$(C.current).hasClass("show")&&o&&v(o)):l.fire("Error",c.message||"Error al completar limpieza","error")}catch{l.fire("Error","Error al procesar la solicitud","error")}},ye=async s=>{if((await l.fire({title:"Marcar como No Show",text:"¿El huésped no se presentó para el check-in?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6c757d",cancelButtonColor:"#17a2b8",confirmButtonText:'<i class="mdi mdi-account-off"></i> Marcar No Show',cancelButtonText:"Cancelar"})).isConfirmed)try{const c=await(await fetch(`/api/admin/bookings/${s}/no-show`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Xsrf-Token":decodeURIComponent(g.Cookies.get("XSRF-TOKEN"))}})).json();c.status?(l.fire({icon:"info",title:"Marcada como No Show",text:"La reserva ha sido marcada como no show",timer:2e3,showConfirmButton:!1}),o&&await v(o),h()):l.fire("Error",c.message||"Error al marcar como no show","error")}catch{l.fire("Error","Error al procesar la solicitud","error")}},ve=()=>{if(!b)return null;const{availability:s,bookings:t}=b;console.log("📅 DEBUG CALENDARIO:",{totalBookings:t==null?void 0:t.length,bookings:t==null?void 0:t.map(n=>{var r;return{id:n.id,check_in:n.check_in,check_out:n.check_out,status:n.status,guest:(r=n.sale)==null?void 0:r.name}}),availabilityDates:s==null?void 0:s.slice(0,5).map(n=>n.date)});const i={};t==null||t.forEach(n=>{const r=n.check_in.split(" ")[0],x=n.check_out.split(" ")[0],[j,N,m]=r.split("-"),[y,P,L]=x.split("-"),ne=new Date(parseInt(j),parseInt(N)-1,parseInt(m)),X=new Date(parseInt(y),parseInt(P)-1,parseInt(L));let u=new Date(ne);for(;u<=X;){const Y=u.getFullYear(),q=String(u.getMonth()+1).padStart(2,"0"),k=String(u.getDate()).padStart(2,"0"),f=`${Y}-${q}-${k}`;i[f]||(i[f]=[]),i[f].push(n),u.setDate(u.getDate()+1)}}),console.log("🗓️ MAPA DE BOOKINGS POR FECHA:",{totalDates:Object.keys(i).length,dates:Object.keys(i).slice(0,10),sampleBooking:i[Object.keys(i)[0]]});const c={};return s==null||s.forEach(n=>{const r=n.date.split("T")[0],[x,j,N]=r.split("-"),m=new Date(parseInt(x),parseInt(j)-1,parseInt(N)),y=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}`;c[y]||(c[y]=[]),c[y].push({...n,date:r,bookings:i[r]||[]})}),console.log("📊 DÍAS CON BOOKINGS:",{totalDays:Object.values(c).flat().length,daysWithBookings:Object.values(c).flat().filter(n=>n.bookings.length>0).length,sample:Object.values(c).flat().slice(0,5).map(n=>({date:n.date,bookings:n.bookings.length,statuses:n.bookings.map(r=>r.status)}))}),Object.entries(c).map(([n,r])=>{const[x,j]=n.split("-"),N=new Date(x,j-1).toLocaleDateString("es-PE",{month:"long",year:"numeric"});return e.jsxs("div",{className:"mb-4",children:[e.jsx("h5",{className:"text-capitalize mb-3",children:N}),e.jsx("div",{className:"d-flex flex-wrap gap-1",children:r.map(m=>{const[y,P,L]=m.date.split("-"),X=new Date(parseInt(y),parseInt(P)-1,parseInt(L)).getDate(),u=m.is_blocked;m.bookings.length>0;const Y=m.bookings.some(_=>_.status==="confirmed"),q=m.bookings.some(_=>_.status==="pending");let k="#28a745",f="#ffffff",D="Disponible";return u?(k="#6c757d",f="#ffffff",D="Mantenimiento"):Y?(k="#dc3545",f="#ffffff",D="Ocupada"):q?(k="#ffc107",f="#000000",D="Reservada"):m.available_rooms===0&&(k="#ffc107",f="#000000",D="Sin disponibilidad"),e.jsxs("div",{className:"text-center rounded p-2 d-flex align-items-center justify-content-center position-relative",style:{width:"45px",height:"45px",backgroundColor:k,color:f,cursor:"pointer",fontSize:"14px",fontWeight:"bold",border:"1px solid rgba(0,0,0,0.1)"},title:`${m.date}
${D}${m.bookings.map(_=>{var ce;return`
👤 ${((ce=_.sale)==null?void 0:ce.name)||"Cliente"}`}).join("")}`,children:[X,u&&e.jsx("i",{className:"mdi mdi-tools position-absolute",style:{fontSize:"10px",top:"2px",right:"2px"}})]},m.date)})})]},n)})};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-12",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-4",children:[e.jsxs("h4",{className:"header-title mb-0",children:[e.jsx("i",{className:"mdi mdi-calendar-check mr-2"}),"Disponibilidad de Habitaciones"]}),e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"small text-muted mb-1 d-block",children:"Fecha de consulta:"}),e.jsx(E,{selected:K,onChange:he,locale:O,dateFormat:"dd/MM/yyyy",className:"form-control form-control-sm"})]}),e.jsxs("button",{className:"btn btn-primary btn-sm",onClick:()=>h(),disabled:I,children:[e.jsx("i",{className:"mdi mdi-refresh mr-1"}),I?"Cargando...":"Actualizar"]})]})]}),e.jsxs("div",{className:"d-flex gap-3 mb-4 flex-wrap",children:[e.jsxs("span",{className:"badge px-3 py-2",style:{backgroundColor:"#28a745",color:"#ffffff"},children:[e.jsx("i",{className:"mdi mdi-check-circle mr-1"})," Disponible"]}),e.jsxs("span",{className:"badge px-3 py-2",style:{backgroundColor:"#dc3545",color:"#ffffff"},children:[e.jsx("i",{className:"mdi mdi-bed mr-1"})," Ocupada"]}),e.jsxs("span",{className:"badge px-3 py-2",style:{backgroundColor:"#ffc107",color:"#000000"},children:[e.jsx("i",{className:"mdi mdi-clock mr-1"})," Reservada"]}),e.jsxs("span",{className:"badge px-3 py-2",style:{backgroundColor:"#fd7e14",color:"#ffffff"},children:[e.jsx("i",{className:"mdi mdi-broom mr-1"})," En Limpieza"]}),e.jsxs("span",{className:"badge px-3 py-2",style:{backgroundColor:"#6c757d",color:"#ffffff"},children:[e.jsx("i",{className:"mdi mdi-tools mr-1"})," Mantenimiento"]})]}),e.jsx("div",{className:"row",children:W.map(s=>{const t=xe(s.status);return e.jsx("div",{className:"col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4",children:e.jsxs("div",{className:"room-card",style:{"--status-color":t.bg,"--status-text":t.text},children:[e.jsxs("div",{className:"room-status-badge",style:{backgroundColor:t.bg},children:[e.jsx("i",{className:`mdi ${t.icon}`}),e.jsx("span",{children:t.label})]}),e.jsx("div",{className:"room-header",children:e.jsxs("div",{className:"room-title-section",children:[e.jsx("div",{className:"room-icon-badge",style:{backgroundColor:`${t.bg}15`,color:t.bg},children:e.jsx("i",{className:"mdi mdi-bed"})}),e.jsx("h5",{className:"room-name",children:s.name})]})}),e.jsxs("div",{className:"room-body",children:[e.jsxs("div",{className:"room-quick-info",children:[e.jsxs("div",{className:"info-pill",children:[e.jsx("i",{className:"mdi mdi-account-multiple"}),e.jsxs("span",{children:[s.max_occupancy||s.capacity," personas"]})]}),e.jsxs("div",{className:"info-pill info-pill-price",children:[e.jsx("i",{className:"mdi mdi-cash-multiple"}),e.jsxs("span",{children:["S/ ",Number(s.price).toFixed(2)]})]})]}),s.active_booking&&e.jsxs("div",{className:"room-booking-info",children:[e.jsxs("div",{className:"booking-header",children:[e.jsx("i",{className:"mdi mdi-account-circle"}),e.jsx("span",{className:"booking-label",children:"Huésped Actual"})]}),e.jsxs("div",{className:"booking-details",children:[e.jsx("div",{className:"guest-name",children:s.active_booking.guest_name||"N/A"}),e.jsxs("div",{className:"checkout-date",children:[e.jsx("i",{className:"mdi mdi-calendar-export"}),moment(s.active_booking.check_out).format("DD/MM/YYYY")]})]})]}),e.jsxs("div",{className:"room-actions-icons",children:[s.status==="available"&&e.jsx(z,{content:"Ocupar Ahora",placement:"top",children:e.jsx("button",{className:"room-icon-btn room-icon-btn-success",onClick:()=>fe(s),children:e.jsx("i",{className:"mdi mdi-account-plus mdi-24px"})})}),s.status==="occupied"&&s.active_booking&&e.jsx(z,{content:"Check-Out",placement:"top",children:e.jsx("button",{className:"room-icon-btn room-icon-btn-info",onClick:()=>te(s.active_booking.id),children:e.jsx("i",{className:"mdi mdi-logout mdi-24px"})})}),s.status==="cleaning"&&e.jsx(z,{content:"Limpieza Completada",placement:"top",children:e.jsx("button",{className:"room-icon-btn room-icon-btn-success",onClick:()=>Ne(s.id),children:e.jsx("i",{className:"mdi mdi-check-all mdi-24px"})})}),e.jsx(z,{content:"Ver Calendario",placement:"top",children:e.jsx("button",{className:"room-icon-btn room-icon-btn-secondary",onClick:()=>v(s),children:e.jsx("i",{className:"mdi mdi-calendar mdi-24px"})})}),e.jsx(z,{content:"Mantenimiento",placement:"top",children:e.jsx("button",{className:"room-icon-btn room-icon-btn-warning",onClick:()=>ue(s),children:e.jsx("i",{className:"mdi mdi-tools mdi-24px"})})})]})]})]})},s.id)})}),e.jsx("style",{children:`
                .room-card {
                  background: white;
                  border-radius: 12px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                  transition: all 0.2s ease;
                  height: 100%;
                  position: relative;
                  overflow: hidden;
                  border: 1px solid #e8e8e8;
                  display: flex;
                  flex-direction: column;
                }
                
                .room-card:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                }
                
                .room-status-badge {
                  position: absolute;
                  top: 10px;
                  right: 10px;
                  padding: 4px 10px;
                  border-radius: 12px;
                  font-size: 10px;
                  font-weight: 600;
                  color: white;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                  z-index: 1;
                }
                
                .room-status-badge i {
                  font-size: 12px;
                }
                
                .room-header {
                  padding: 16px 120px 16px 16px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  border-bottom: 1px solid #f0f0f0;
                }
                
                .room-title-section {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  flex: 1;
                }
                
                .room-icon-badge {
                  width: 36px;
                  height: 36px;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  flex-shrink: 0;
                }
                
                .room-name {
                  margin: 0;
                  font-size: 1.1rem;
                  font-weight: 700;
                  color: #2d3748;
                }
                
                .room-body {
                  padding: 14px;
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                }
                
                .room-quick-info {
                  margin-bottom: 10px;
                  display: flex;
                  gap: 8px;
                  flex-wrap: wrap;
                }
                
                .info-pill {
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                  padding: 6px 12px;
                  border-radius: 12px;
                  font-size: 12px;
                  color: #4a5568;
                  font-weight: 600;
                  border: 1px solid #e2e8f0;
                }
                
                .info-pill i {
                  font-size: 16px;
                  color: #4299e1;
                }
                
                .info-pill span {
                  font-weight: 600;
                }
                
                .info-pill-price {
                  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                  border-color: #28a745;
                }
                
                .info-pill-price i {
                  color: #28a745;
                }
                
                .info-pill-price span {
                  color: #155724;
                  font-weight: 700;
                }
                
                .room-booking-info {
                  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                  border-radius: 10px;
                  padding: 10px 12px;
                  margin-bottom: 10px;
                  border: 1px solid #e2e8f0;
                }
                
                .booking-header {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  margin-bottom: 8px;
                  padding-bottom: 6px;
                  border-bottom: 1px solid #e2e8f0;
                }
                
                .booking-header i {
                  font-size: 16px;
                  color: #4299e1;
                }
                
                .booking-label {
                  font-size: 11px;
                  font-weight: 600;
                  text-transform: uppercase;
                  color: #4a5568;
                  letter-spacing: 0.5px;
                }
                
                .booking-details {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap: 8px;
                }
                
                .guest-name {
                  font-size: 13px;
                  font-weight: 600;
                  color: #2d3748;
                  flex: 1;
                  min-width: 0;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                
                .checkout-date {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 12px;
                  color: #dc3545;
                  font-weight: 600;
                  flex-shrink: 0;
                }
                
                .checkout-date i {
                  font-size: 14px;
                }
                
                .room-actions-icons {
                  display: flex;
                  gap: 6px;
                  justify-content: center;
                  flex-wrap: wrap;
                  margin-top: auto;
                  padding-top: 10px;
                }
                
                .room-icon-btn {
                  width: 40px;
                  height: 40px;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .room-icon-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .room-icon-btn-success {
                  background: #28a745;
                  color: white;
                }
                
                .room-icon-btn-success:hover {
                  background: #218838;
                }
                
                .room-icon-btn-info {
                  background: #17a2b8;
                  color: white;
                }
                
                .room-icon-btn-info:hover {
                  background: #138496;
                }
                
                .room-icon-btn-secondary {
                  background: #f7fafc;
                  color: #4a5568;
                  border: 1px solid #e2e8f0;
                }
                
                .room-icon-btn-secondary:hover {
                  background: #edf2f7;
                  border-color: #cbd5e0;
                }
                
                .room-icon-btn-warning {
                  background: #ffc107;
                  color: #000;
                }
                
                .room-icon-btn-warning:hover {
                  background: #e0a800;
                }
              `}),W.length===0&&!I&&e.jsxs("div",{className:"text-center text-muted py-5",children:[e.jsx("i",{className:"mdi mdi-bed-empty mdi-48px"}),e.jsx("p",{className:"mt-2",children:"No hay habitaciones registradas"})]})]})})})}),e.jsx(U,{modalRef:C,title:`Calendario - ${(o==null?void 0:o.name)||""}`,size:"xl",hideButtonSubmit:!0,children:me?e.jsxs("div",{className:"text-center py-5",children:[e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Cargando..."})}),e.jsx("p",{className:"mt-2",children:"Cargando calendario..."})]}):e.jsxs("div",{children:[e.jsxs("div",{className:"d-flex gap-2 mb-3 flex-wrap justify-content-center",children:[e.jsxs("span",{className:"badge px-2 py-1",style:{backgroundColor:"#28a745",color:"#ffffff",fontSize:"11px"},children:[e.jsx("i",{className:"mdi mdi-check-circle mr-1"})," Disponible"]}),e.jsxs("span",{className:"badge px-2 py-1",style:{backgroundColor:"#dc3545",color:"#ffffff",fontSize:"11px"},children:[e.jsx("i",{className:"mdi mdi-bed mr-1"})," Ocupado"]}),e.jsxs("span",{className:"badge px-2 py-1",style:{backgroundColor:"#ffc107",color:"#000000",fontSize:"11px"},children:[e.jsx("i",{className:"mdi mdi-clock mr-1"})," Reservado"]}),e.jsxs("span",{className:"badge px-2 py-1",style:{backgroundColor:"#6c757d",color:"#ffffff",fontSize:"11px"},children:[e.jsx("i",{className:"mdi mdi-tools mr-1"})," Mantenimiento"]})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-5",children:e.jsx("div",{className:"border rounded p-3",style:{backgroundColor:"#f8f9fa",maxHeight:"600px",overflowY:"auto"},children:((oe=b==null?void 0:b.bookings)==null?void 0:oe.length)>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3 sticky-top bg-light py-2 px-2 rounded",style:{top:0,zIndex:1},children:[e.jsxs("h6",{className:"mb-0 font-weight-bold",children:[e.jsx("i",{className:"mdi mdi-account-group mx-2 text-primary"}),"Reservas"]}),e.jsx("span",{className:"badge badge-primary badge-pill",children:b.bookings.length})]}),b.bookings.map(s=>{var c,n,r,x,j,N;const i=(m=>({pending:{badge:"badge-warning",label:"Pendiente",color:"#f1b44c",bg:"#fff3cd",icon:"mdi-clock-outline"},confirmed:{badge:"badge-success",label:"Confirmada",color:"#28a745",bg:"#d4edda",icon:"mdi-check-circle"},cancelled:{badge:"badge-danger",label:"Cancelada",color:"#dc3545",bg:"#f8d7da",icon:"mdi-close-circle"},completed:{badge:"badge-info",label:"Completada",color:"#17a2b8",bg:"#d1ecf1",icon:"mdi-checkbox-marked-circle"},no_show:{badge:"badge-secondary",label:"No Show",color:"#6c757d",bg:"#e2e3e5",icon:"mdi-account-off"}})[m]||{badge:"badge-secondary",label:m||"Sin estado",color:"#6c757d",bg:"#e2e3e5",icon:"mdi-help-circle"})(s.status);return e.jsx("div",{className:"card mb-3 shadow-sm",style:{borderLeft:`4px solid ${i.color}`,transition:"all 0.2s ease"},children:e.jsxs("div",{className:"card-body p-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"rounded-circle d-flex align-items-center justify-content-center mr-2",style:{width:"40px",height:"40px",backgroundColor:i.bg,color:i.color},children:e.jsx("i",{className:`mdi ${i.icon} mdi-24px`})}),e.jsxs("div",{className:"mx-2",children:[e.jsxs("h6",{className:"mb-0 font-weight-bold",children:[(c=s.sale)==null?void 0:c.name," ",(n=s.sale)==null?void 0:n.lastname]}),e.jsxs("small",{className:"text-muted",children:["#",((r=s.sale)==null?void 0:r.code)||"N/A"]})]})]}),e.jsx("span",{className:"badge px-2 py-1",style:{backgroundColor:i.bg,color:i.color,fontWeight:"600",fontSize:"11px",letterSpacing:"0.5px"},children:i.label.toUpperCase()})]}),e.jsxs("div",{className:"mb-2 pb-2 border-bottom",children:[e.jsxs("div",{className:"d-flex align-items-center mb-1",children:[e.jsx("i",{className:"mdi mdi-email text-muted mx-2"}),e.jsx("small",{className:"text-truncate",style:{maxWidth:"250px"},children:(x=s.sale)==null?void 0:x.email})]}),e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("i",{className:"mdi mdi-phone text-muted mx-2"}),e.jsxs("small",{children:[((j=s.sale)==null?void 0:j.phone_prefix)||""," ",((N=s.sale)==null?void 0:N.phone)||"N/A"]})]})]}),e.jsx("div",{className:"mb-3",children:e.jsxs("div",{className:"row text-center",children:[e.jsx("div",{className:"col-5",children:e.jsxs("div",{className:"p-2 rounded",style:{backgroundColor:"#e7f5ec"},children:[e.jsx("i",{className:"mdi mdi-login text-success d-block mb-1"}),e.jsx("small",{className:"d-block text-muted",style:{fontSize:"10px"},children:"CHECK-IN"}),e.jsx("strong",{className:"d-block",style:{fontSize:"13px"},children:new Date(s.check_in).toLocaleDateString("es-PE",{day:"2-digit",month:"short"})})]})}),e.jsx("div",{className:"col-2 d-flex align-items-center justify-content-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"mdi mdi-arrow-right text-muted"}),e.jsxs("small",{className:"d-block text-muted",children:[s.nights,"n"]})]})}),e.jsx("div",{className:"col-5",children:e.jsxs("div",{className:"p-2 rounded",style:{backgroundColor:"#ffeaea"},children:[e.jsx("i",{className:"mdi mdi-logout text-danger d-block mb-1"}),e.jsx("small",{className:"d-block text-muted",style:{fontSize:"10px"},children:"CHECK-OUT"}),e.jsx("strong",{className:"d-block",style:{fontSize:"13px"},children:new Date(s.check_out).toLocaleDateString("es-PE",{day:"2-digit",month:"short"})})]})})]})}),e.jsxs("div",{className:"d-flex justify-content-around mb-3 py-2",style:{backgroundColor:"#f8f9fa",borderRadius:"4px"},children:[e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"mdi mdi-account-multiple text-primary"}),e.jsxs("small",{className:"d-block",children:[s.guests||1," huésped",(s.guests||1)>1?"es":""]})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"mdi mdi-cash-multiple text-success"}),e.jsxs("small",{className:"d-block",children:[Se()," ",De(s.total_price||0)]})]})]}),e.jsxs("div",{className:"d-flex gap-2 flex-wrap",children:[s.status==="pending"&&e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"btn btn-sm btn-success flex-fill",onClick:()=>je(s.id),title:"Check-In",children:[e.jsx("i",{className:"mdi mdi-login mr-1"})," Check-In"]}),e.jsx("button",{className:"btn btn-sm btn-outline-danger",onClick:()=>ie(s.id),title:"Cancelar",children:e.jsx("i",{className:"mdi mdi-close"})})]}),s.status==="confirmed"&&e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"btn btn-sm btn-info flex-fill",onClick:()=>te(s.id),title:"Check-Out",children:[e.jsx("i",{className:"mdi mdi-logout mr-1"})," Check-Out"]}),e.jsx("button",{className:"btn btn-sm btn-outline-secondary",onClick:()=>ye(s.id),title:"No Show",children:e.jsx("i",{className:"mdi mdi-account-off"})}),e.jsx("button",{className:"btn btn-sm btn-outline-danger",onClick:()=>ie(s.id),title:"Cancelar",children:e.jsx("i",{className:"mdi mdi-close"})})]}),["completed","cancelled","no_show"].includes(s.status)&&e.jsxs("div",{className:"text-center w-100 py-2 text-muted",children:[e.jsx("i",{className:"mdi mdi-information-outline mr-1"}),"Reserva finalizada"]})]})]})},s.id)})]}):e.jsxs("div",{className:"text-center text-muted py-5",children:[e.jsx("i",{className:"mdi mdi-calendar-blank mdi-48px"}),e.jsx("p",{className:"mt-2",children:"No hay reservas en este período"})]})})}),e.jsx("div",{className:"col-md-7",children:e.jsxs("div",{className:"border rounded p-2",style:{maxHeight:"600px",overflowY:"auto"},children:[e.jsxs("h6",{className:"mb-3 sticky-top bg-white py-2",style:{top:0,zIndex:1},children:[e.jsx("i",{className:"mdi mdi-calendar mr-1"}),"Vista de Calendario"]}),ve()]})})]})]})}),e.jsxs(U,{modalRef:B,title:`Mantenimiento - ${(o==null?void 0:o.name)||""}`,size:"md",buttonSubmit:"Aplicar",onSubmit:ge,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Acción"}),e.jsxs("div",{className:"d-flex gap-3",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{type:"radio",className:"form-check-input",id:"blockAction",checked:T,onChange:()=>M(!0)}),e.jsxs("label",{className:"form-check-label",htmlFor:"blockAction",children:[e.jsx("i",{className:"mdi mdi-tools mr-1 text-warning"}),"Poner en mantenimiento"]})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{type:"radio",className:"form-check-input",id:"unblockAction",checked:!T,onChange:()=>M(!1)}),e.jsxs("label",{className:"form-check-label",htmlFor:"unblockAction",children:[e.jsx("i",{className:"mdi mdi-check mr-1 text-success"}),"Finalizar mantenimiento"]})]})]})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Fecha inicio"}),e.jsx(E,{selected:w,onChange:s=>V(s),selectsStart:!0,startDate:w,endDate:S,minDate:new Date,locale:O,dateFormat:"dd/MM/yyyy",className:"form-control"})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Fecha fin"}),e.jsx(E,{selected:S,onChange:s=>Z(s),selectsEnd:!0,startDate:w,endDate:S,minDate:w||new Date,locale:O,dateFormat:"dd/MM/yyyy",className:"form-control"})]})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Razón (opcional)"}),e.jsx("textarea",{className:"form-control",rows:"3",value:Q,onChange:s=>ee(s.target.value),placeholder:"Ej: Mantenimiento, limpieza profunda, evento privado..."})]}),e.jsxs("div",{className:"alert alert-warning",children:[e.jsx("i",{className:"mdi mdi-information mr-1"}),T?"Las fechas en mantenimiento no estarán disponibles para reservas.":"Al finalizar el mantenimiento, las fechas volverán a estar disponibles."]})]}),e.jsxs(U,{modalRef:A,title:`Registrar Ocupación - ${(o==null?void 0:o.name)||""}`,size:"xl",buttonSubmit:pe?"Procesando...":"Registrar Ocupación",onSubmit:be,children:[e.jsx("div",{className:"bg-light border-bottom p-3 mb-4",style:{margin:"-1rem -1rem 1.5rem -1rem"},children:e.jsxs("div",{className:"d-flex align-items-center justify-content-between",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"bg-white rounded-circle p-2 mr-3",style:{width:"48px",height:"48px",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("i",{className:"mdi mdi-account-plus mdi-24px text-primary"})}),e.jsxs("div",{children:[e.jsx("h5",{className:"mb-1",children:"Registro Presencial de Huésped"}),e.jsx("small",{className:"text-muted",children:"Complete la información para ocupar la habitación inmediatamente"})]})]}),e.jsxs("span",{className:"badge badge-primary badge-lg px-3 py-2",children:[e.jsx("i",{className:"mdi mdi-bed mr-1"}),o==null?void 0:o.name]})]})}),e.jsxs("div",{className:"mb-5",children:[e.jsxs("h6",{className:"text-uppercase text-muted mb-4",style:{fontSize:"12px",fontWeight:"600",letterSpacing:"1px"},children:[e.jsx("i",{className:"mdi mdi-account-circle mr-2"}),"1. Información del Huésped"]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-8",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:["Nombre Completo ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"text",className:"form-control",value:a.fullname,onChange:s=>p({...a,fullname:s.target.value}),placeholder:"Ej: Juan Pérez García"})]})}),e.jsx("div",{className:"col-md-4",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:["Email ",e.jsx("small",{className:"text-muted",children:"(opcional)"})]}),e.jsx("input",{type:"email",className:"form-control",value:a.email,onChange:s=>p({...a,email:s.target.value}),placeholder:"ejemplo@correo.com"})]})})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-4",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:["Teléfono ",e.jsx("small",{className:"text-muted",children:"(opcional)"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("select",{className:"form-control",style:{maxWidth:"120px"},value:a.phone_prefix,onChange:s=>p({...a,phone_prefix:s.target.value}),children:e.jsx("option",{value:"+51",children:"🇵🇪 +51"})}),e.jsx("input",{type:"tel",className:"form-control",value:a.phone,onChange:s=>{const t=s.target.value.replace(/[^0-9]/g,"");p({...a,phone:t})},pattern:"[0-9]*",inputMode:"numeric",placeholder:"987654321",maxLength:"15"})]})]})}),e.jsx("div",{className:"col-md-4",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:["Tipo de Documento ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-control",value:a.document_type,onChange:s=>p({...a,document_type:s.target.value,document:""}),children:[e.jsx("option",{value:"dni",children:"DNI (8 dígitos)"}),e.jsx("option",{value:"ce",children:"Carnet de Extranjería"}),e.jsx("option",{value:"pasaporte",children:"Pasaporte"}),e.jsx("option",{value:"ruc",children:"RUC (11 dígitos)"})]})]})}),e.jsx("div",{className:"col-md-4",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:["N° de Documento ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"text",className:"form-control",value:a.document,onChange:s=>{let t=s.target.value;const i=a.document_type;i==="dni"?t=t.replace(/[^0-9]/g,"").slice(0,8):i==="ruc"?t=t.replace(/[^0-9]/g,"").slice(0,11):i==="ce"?t=t.replace(/[^a-zA-Z0-9]/g,"").toUpperCase().slice(0,12):i==="pasaporte"&&(t=t.replace(/[^a-zA-Z0-9]/g,"").toUpperCase().slice(0,20)),p({...a,document:t})},placeholder:a.document_type==="dni"?"8 dígitos numéricos":a.document_type==="ruc"?"11 dígitos numéricos":a.document_type==="ce"?"Alfanumérico (máx. 12)":"Alfanumérico (máx. 20)",maxLength:a.document_type==="dni"?8:a.document_type==="ruc"?11:a.document_type==="ce"?12:20,required:!0}),e.jsxs("small",{className:"text-muted d-block mt-1",children:[a.document_type==="dni"&&`${a.document.length}/8 dígitos`,a.document_type==="ruc"&&`${a.document.length}/11 dígitos`,a.document_type==="ce"&&`${a.document.length}/12 caracteres`,a.document_type==="pasaporte"&&`${a.document.length}/20 caracteres`]})]})})]})]}),e.jsx("hr",{className:"my-4"}),e.jsxs("div",{className:"mb-5",children:[e.jsxs("h6",{className:"text-uppercase text-muted mb-4",style:{fontSize:"12px",fontWeight:"600",letterSpacing:"1px"},children:[e.jsx("i",{className:"mdi mdi-calendar-check mr-2"}),"2. Detalles de la Estadía"]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-3",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:[e.jsx("i",{className:"mdi mdi-calendar-import text-success mr-1"}),"Fecha Check-In"]}),e.jsx(E,{selected:a.check_in,onChange:s=>{if(p({...a,check_in:s}),a.check_out){const t=Math.ceil((a.check_out-s)/864e5);p(i=>({...i,nights:t>0?t:1}))}},minDate:new Date,locale:O,dateFormat:"dd/MM/yyyy",className:"form-control"})]})}),e.jsx("div",{className:"col-md-3",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:[e.jsx("i",{className:"mdi mdi-calendar-export text-danger mr-1"}),"Fecha Check-Out"]}),e.jsx(E,{selected:a.check_out,onChange:s=>{if(p({...a,check_out:s}),a.check_in){const t=Math.ceil((s-a.check_in)/864e5);p(i=>({...i,nights:t>0?t:1}))}},minDate:a.check_in||new Date,locale:O,dateFormat:"dd/MM/yyyy",className:"form-control"})]})}),e.jsx("div",{className:"col-md-3",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:[e.jsx("i",{className:"mdi mdi-weather-night mr-1"}),"N° de Noches"]}),e.jsx("input",{type:"number",className:"form-control text-center",min:"1",value:a.nights,onChange:s=>{const t=parseInt(s.target.value)||1,i=new Date(a.check_in);i.setDate(i.getDate()+t),p({...a,nights:t,check_out:i})},style:{fontWeight:"bold"}})]})}),e.jsx("div",{className:"col-md-3",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:[e.jsx("i",{className:"mdi mdi-account-multiple mr-1"}),"N° de Huéspedes"]}),e.jsx("input",{type:"number",className:"form-control text-center",min:"1",max:(o==null?void 0:o.capacity)||10,value:a.guests,onChange:s=>p({...a,guests:parseInt(s.target.value)||1}),style:{fontWeight:"bold"}}),e.jsxs("small",{className:"text-muted d-block mt-2",children:["Máx: ",(o==null?void 0:o.capacity)||0]})]})})]})]}),e.jsx("hr",{className:"my-4"}),e.jsxs("div",{className:"mb-5",children:[e.jsxs("h6",{className:"text-uppercase text-muted mb-4",style:{fontSize:"12px",fontWeight:"600",letterSpacing:"1px"},children:[e.jsx("i",{className:"mdi mdi-cash-multiple mr-2"}),"3. Pago y Observaciones"]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-4",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:[e.jsx("i",{className:"mdi mdi-credit-card mr-1"}),"Método de Pago"]}),e.jsxs("select",{className:"form-control",value:a.payment_method,onChange:s=>p({...a,payment_method:s.target.value}),children:[e.jsx("option",{value:"efectivo",children:"Efectivo"}),e.jsx("option",{value:"tarjeta",children:"Tarjeta"}),e.jsx("option",{value:"transferencia",children:"Transferencia"}),e.jsx("option",{value:"yape",children:"Yape"}),e.jsx("option",{value:"plin",children:"Plin"})]})]})}),e.jsx("div",{className:"col-md-8",children:e.jsxs("div",{className:"form-group mb-4",children:[e.jsxs("label",{className:"font-weight-bold mb-2",children:[e.jsx("i",{className:"mdi mdi-message-text mr-1"}),"Solicitudes Especiales"]}),e.jsx("textarea",{className:"form-control",rows:"3",value:a.special_requests,onChange:s=>p({...a,special_requests:s.target.value}),placeholder:"Ej: Cama extra, cuna para bebé, late check-out, alergias alimentarias..."})]})})]})]}),e.jsx("hr",{className:"my-4"}),e.jsx("div",{className:"bg-light border rounded p-4",children:e.jsxs("div",{className:"row align-items-center",children:[e.jsxs("div",{className:"col-md-5",children:[e.jsxs("h6",{className:"text-uppercase text-muted mb-3",style:{fontSize:"12px",fontWeight:"600",letterSpacing:"1px"},children:[e.jsx("i",{className:"mdi mdi-calculator mr-2"}),"Total a Pagar"]}),e.jsxs("div",{className:"input-group",style:{height:"60px"},children:[e.jsx("div",{className:"input-group-prepend",children:e.jsx("span",{className:"input-group-text bg-success text-white font-weight-bold",style:{fontSize:"1.5rem",width:"60px",justifyContent:"center"},children:"S/"})}),e.jsx("input",{type:"number",className:"form-control",min:"0",step:"0.01",value:ae,onChange:s=>F(parseFloat(s.target.value)||0),placeholder:"0.00",style:{fontSize:"1.25rem",fontWeight:"bold",color:"#28a745"}})]}),e.jsxs("small",{className:"text-muted d-block mt-2",children:[e.jsx("i",{className:"mdi mdi-pencil mr-1"}),"Editable según negociación con el cliente"]})]}),e.jsx("div",{className:"col-md-1 text-center d-none d-md-block",children:e.jsx("i",{className:"mdi mdi-arrow-right mdi-36px text-muted"})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card mb-0 shadow-sm",children:[e.jsx("div",{className:"card-header bg-white py-3",children:e.jsx("h6",{className:"mb-0 font-weight-bold text-dark",children:"Desglose del Precio"})}),e.jsx("div",{className:"card-body",children:e.jsx("table",{className:"table table-borderless mb-0",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"py-2",children:e.jsx("span",{className:"text-muted",children:"Precio por noche:"})}),e.jsx("td",{className:"text-right py-2",children:e.jsxs("strong",{className:"text-dark",children:["S/ ",Number((o==null?void 0:o.price)||0).toFixed(2)]})})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"py-2",children:e.jsx("span",{className:"text-muted",children:"Número de noches:"})}),e.jsx("td",{className:"text-right py-2",children:e.jsxs("strong",{className:"text-dark",children:["× ",a.nights]})})]}),e.jsxs("tr",{className:"border-top",children:[e.jsx("td",{className:"py-3",children:e.jsx("strong",{className:"text-dark",children:"Precio sugerido:"})}),e.jsx("td",{className:"text-right py-3",children:e.jsxs("h5",{className:"mb-0 text-success font-weight-bold",children:["S/ ",(a.nights*Number((o==null?void 0:o.price)||0)).toFixed(2)]})})]})]})})})]})})]})})]})]})};we((H,C)=>{ke.createRoot(H).render(e.jsx(Ce,{...C,title:"Disponibilidad de Habitaciones",children:e.jsx(_e,{...C})}))});
