import{j as e}from"./AboutHeader-Bdo2C3ON.js";import{r as o}from"./index-DFv2mRv-.js";import{R as u}from"./index-B7NCnfQQ.js";import{i as w}from"./tippy-react.esm-BVvHiWwH.js";import{G as f}from"./Global-mC9lKANG.js";import{H as v}from"./HtmlContent-ux768mvo.js";import{S as y}from"./ProductCard-FwiEcsI0.js";import{S}from"./SubscriptionsRest-MOsjBW5C.js";import{G as c}from"./General-3RJWnWe_.js";import"./index-DgyC5pTR.js";import"./index-Cevqm-zP.js";import"./BasicEditing-Ce9hwHaI.js";import"./main-BBbUrZUL.js";import"./___vite-browser-external_commonjs-proxy-BQdpDcDf.js";u.setAppElement("#app");const _=new S,L=({socials:h=[],generals:m=[],pages:b=[]})=>{const i=o.useRef(),[j,n]=o.useState(null),[d,x]=o.useState(),g=async s=>{s.preventDefault(),x(!0);const l={email:i.current.value},t=await _.save(l);x(!1),t&&(y.fire({title:"¡Éxito!",text:`Te has suscrito correctamente al blog de ${f.APP_NAME}.`,icon:"success",confirmButtonText:"Ok"}),i.current.value=null)},a={terms_conditions:"Términos y condiciones",privacy_policy:"Políticas de privacidad",delivery_policy:"Políticas de envío",saleback_policy:"Políticas de devolucion y cambio"};return e.jsxs(e.Fragment,{children:[e.jsx("footer",{className:"font-poppins bg-primary text-white",children:e.jsxs("div",{className:"px-[5%] replace-max-w-here mx-auto px-4 py-[5%] md:py-[2.5%]",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:justify-center",children:[e.jsxs("div",{className:"lg:col-span-3 w-full flex flex-col gap-10",children:[e.jsx("div",{children:e.jsx("a",{href:"/",children:e.jsx("img",{src:`/assets/resources/logo.png?v=${crypto.randomUUID()}`,alt:f.APP_NAME,className:"w-full aspect-[13/4] object-contain object-center"})})}),e.jsx("nav",{children:e.jsxs("ul",{className:"flex flex-col gap-3 text-base font-normal",children:[e.jsxs("li",{className:"flex flex-row items-start gap-2",children:[e.jsx("i",{className:"mdi mdi-map-marker"}),e.jsx("span",{children:c.get("address")})]}),e.jsxs("li",{className:"flex flex-row gap-2",children:[e.jsx("i",{className:"mdi mdi-email"}),e.jsx("span",{className:"text-wrap break-all",children:c.get("support_email")})]}),e.jsxs("li",{className:"flex flex-row gap-2",children:[e.jsx("i",{className:"mdi mdi-whatsapp"}),e.jsx("span",{children:c.get("support_phone")})]})]})})]}),e.jsxs("div",{className:"lg:col-span-3 w-full flex flex-col gap-5",children:[e.jsx("h3",{className:"font-bold text-lg",children:"Términos Legales"}),e.jsx("nav",{children:e.jsx("ul",{className:"flex flex-col gap-3 text-base font-normal",children:Object.keys(a).map((s,l)=>{const t=a[s];if(m.findIndex(r=>r.correlative==s)!=-1)return e.jsx("li",{className:"flex flex-row gap-2",children:e.jsx("button",{className:"text-start",onClick:()=>n(s),children:t})},l)})})}),e.jsx("a",{href:"https://juguetesludicos.mundoweb.pe/libro-de-reclamaciones",children:e.jsx("img",{className:"w-28",src:"https://juguetesludicos.mundoweb.pe/images/img/reclamaciones.png"})})]}),e.jsxs("div",{className:"lg:col-span-2 w-full flex flex-col gap-5",children:[e.jsx("h3",{className:"font-bold text-lg",children:"Menú"}),e.jsx("nav",{children:e.jsx("ul",{className:"flex flex-col gap-3 text-base font-normal",children:b.filter(s=>s.menuable).map((s,l)=>e.jsx("li",{className:"flex flex-row gap-2",children:e.jsx("button",{className:"border-b-[3px] border-transparent hover:border-b-white transition-all",href:s.pseudo_path||s.path,children:s.name})}))})})]}),e.jsxs("div",{className:"lg:col-span-4 w-full flex flex-col gap-5",children:[e.jsx("h3",{className:"text-2xl font-bold",children:"Suscríbete a nuestro blog"}),e.jsx("p",{className:"font-normal text-base",children:"Mantente actualizado sobre las últimas noticias y ofertas."}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("form",{onSubmit:g,className:"flex flex-col md:flex-row md:justify-start md:items-center gap-3",children:[e.jsx("div",{className:"w-full",children:e.jsx("input",{required:"",name:"email",type:"email",ref:i,className:"ring-0 focus:ring-0 border-transparent focus:border-transparent bg-white px-5 py-3 rounded-xl w-full text-textPrimary outline-none",placeholder:"info@mail.com",disabled:d})}),e.jsx("div",{className:"flex justify-center items-center w-full md:w-auto",children:e.jsx("button",{type:"submit",className:"font-helveticaBold text-base text-white border border-white py-3 px-3 rounded-xl w-full md:w-auto text-center",disabled:d,children:"Suscribirme"})})]}),e.jsx("p",{className:"font-helveticaLight text-text12 text-white",children:"Al suscribirse, acepta nuestra Política de privacidad y brinda su consentimiento para recibir actualizaciones de nuestra empresa."})]})]})]}),e.jsxs("div",{className:"mt-5 flex flex-col md:flex-row justify-center md:justify-between items-center gap-5 mx-auto",children:[e.jsx("div",{className:"flex flex-col md:flex-row gap-2",children:e.jsxs("p",{className:"font-normal",children:["Copyright © ",e.jsx("a",{target:"_blank",href:"http://mundoweb.pe/",className:"font-bold",children:"2024 Mundo Web"}),". Reservados todos los derechos"]})}),e.jsx("div",{className:"flex flex-wrap gap-2 pb-5",children:h.map((s,l)=>e.jsx(w,{content:`Ver ${s.name} en ${s.description}`,children:e.jsx("button",{href:s.link,className:`text-xl bg-transparent bg-white text-primary ${s.icon} w-10 h-10 pt-0.5 text-center rounded-full`})},l))})]})]})}),Object.keys(a).map((s,l)=>{var r;const t=a[s],p=((r=m.find(N=>N.correlative==s))==null?void 0:r.description)??"";return e.jsxs(u,{isOpen:j===s,onRequestClose:()=>n(null),contentLabel:t,className:"absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow-lg w-[95%] max-w-4xl my-8",overlayClassName:"fixed inset-0 bg-black bg-opacity-50 z-50",children:[e.jsx("button",{onClick:()=>n(null),className:"float-right text-gray-500 hover:text-gray-900",children:"Cerrar"}),e.jsx("h2",{className:"text-2xl font-bold mb-4",children:t}),e.jsx(v,{className:"prose",html:p})]},l)})]})};export{L as default};