import{j as e}from"./AboutHeader-Bdo2C3ON.js";import{r as p}from"./index-DFv2mRv-.js";import{R as t}from"./index-B7NCnfQQ.js";import{i as x}from"./tippy-react.esm-BVvHiWwH.js";import{H as h}from"./HtmlContent-ux768mvo.js";import"./index-DgyC5pTR.js";import"./index-Cevqm-zP.js";t.setAppElement("#app");const b=({socials:o=[],terms:i={},footerLinks:n=[]})=>{const[c,a]=p.useState(!1),d=()=>a(!0),r=()=>a(!1),s={};return n.forEach(l=>{s[l.correlative]=l.description}),e.jsxs(e.Fragment,{children:[e.jsxs("footer",{className:"px-[5%] py-[10%] md:px-[10%] md:py-[7.5%] lg:py-[5%] text-white relative grid grid-cols-3 md:grid-cols-2 gap-x-4 gap-y-6 text-sm bg-primary",children:[e.jsxs("div",{className:"col-span-2 flex flex-col gap-4 md:flex-row-reverse items-start justify-evenly md:col-span-1",children:[e.jsxs("ul",{className:"flex flex-col gap-2",children:[s.whatsapp&&e.jsx("li",{children:e.jsx("a",{href:`//wa.me/${s.whatsapp}`,children:"Conversemos"})}),e.jsx("li",{children:e.jsx("a",{href:"/faqs",children:"Preguntas frecuentes"})}),e.jsx("li",{children:e.jsx("span",{className:"cursor-pointer",onClick:d,children:"Términos y condiciones"})}),s["customer-complaints"]&&e.jsx("li",{children:e.jsx("a",{href:s["customer-complaints"],children:"Libro de reclamaciones"})})]}),e.jsx("img",{src:"/assets/img/logo-default.pnng",alt:"Trasciende Logo",className:"h-8 w-max"})]}),e.jsxs("div",{className:"col-span-1 flex flex-col gap-4 md:flex-row items-start justify-evenly md:col-span-1",children:[e.jsxs("ul",{className:"flex flex-col gap-2",children:[s.phone&&e.jsx("li",{children:e.jsx("a",{href:`tel:${s.phone}`,children:"Teléfono"})}),s.email&&e.jsx("li",{children:e.jsx("a",{href:`mailto:${s.email}`,children:"Mail"})}),s.whatsapp&&e.jsx("li",{children:e.jsx("a",{href:`//wa.me/${s.whatsapp}`,children:"WhatsApp"})})]}),e.jsx("div",{className:"flex flex-wrap items-end justify-start gap-2",children:o.map((l,m)=>e.jsx(x,{content:`Ver ${l.name} en ${l.description}`,children:e.jsx("a",{href:l.link,className:`text-xl bg-transparent border border-white text-white ${l.icon} w-8 h-8 pt-0.5 text-center rounded-full`})},m))})]})]}),e.jsxs(t,{isOpen:c,onRequestClose:r,contentLabel:"Términos y condiciones",className:"absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow-lg w-[95%] max-w-2xl my-8 outline-none h-[90vh]",overlayClassName:"fixed inset-0 bg-black bg-opacity-50 z-50",children:[e.jsx("button",{onClick:r,className:"float-right text-gray-500 hover:text-gray-900",children:"Cerrar"}),e.jsx("h2",{className:"text-xl font-bold mb-4",children:"Políticas de privacidad y condiciones de uso"}),e.jsx(h,{className:"prose h-[calc(90vh-120px)] lg:h-[calc(90vh-90px)] overflow-auto",html:i.description})]})]})};export{b as default};