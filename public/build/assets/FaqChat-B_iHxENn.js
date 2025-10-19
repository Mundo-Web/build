import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{r as d}from"./index-BOnQTV8N.js";import{M as x}from"./message-circle-t1YvztHi.js";import{S as m}from"./search-BQ59Robe.js";import{c as g}from"./createLucideIcon-DfjclApS.js";import{U as y}from"./user-BZB1h7Cv.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=g("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]),C=({data:r,faqs:o})=>{const[i,u]=d.useState(null),[t,p]=d.useState(""),n=s=>{u(i===s?null:s)},c=o.filter(s=>{var l;return s.question.toLowerCase().includes(t.toLowerCase())||((l=s.answer)==null?void 0:l.toLowerCase().includes(t.toLowerCase()))});return e.jsxs("section",{className:"py-12 lg:py-20 px-[5%] bg-gray-50",children:[e.jsxs("div",{className:"mx-auto 2xl:max-w-6xl",children:[e.jsxs("div",{className:"text-center mb-8 lg:mb-12",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full mb-4",children:[e.jsx(x,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm font-medium",children:"Chat de Ayuda"})]}),e.jsx("h1",{className:`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${(r==null?void 0:r.class_title)||"customtext-neutral-dark"}`,children:(r==null?void 0:r.title)||"¿En qué podemos ayudarte?"}),(r==null?void 0:r.description)&&e.jsx("p",{className:`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${(r==null?void 0:r.class_description)||"text-gray-600"}`,children:r.description}),e.jsxs("div",{className:"max-w-2xl mx-auto relative",children:[e.jsx(m,{className:"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"}),e.jsx("input",{type:"text",placeholder:"Buscar pregunta...",value:t,onChange:s=>p(s.target.value),className:"w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"})]})]}),e.jsxs("div",{className:"bg-white rounded-3xl shadow-2xl p-6 lg:p-8 max-w-4xl mx-auto",children:[e.jsxs("div",{className:"flex items-center gap-3 pb-6 border-b border-gray-200 mb-6",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-primary flex items-center justify-center",children:e.jsx(h,{className:"w-6 h-6 text-white"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold text-lg",children:"Asistente Virtual"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Siempre disponible para ayudarte"})]}),e.jsx("div",{className:"ml-auto",children:e.jsxs("span",{className:"inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full",children:[e.jsx("span",{className:"w-2 h-2 bg-green-600 rounded-full animate-pulse"}),"En línea"]})})]}),e.jsx("div",{className:"space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar",children:c.length>0?c.map((s,l)=>{const a=i===s.id;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-end gap-3 cursor-pointer group",onClick:()=>n(s.id),style:{animation:`slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${l*.12}s forwards`,opacity:0},children:[e.jsx("div",{className:`max-w-[80%] bg-primary text-white rounded-2xl rounded-tr-md p-4 shadow-lg transition-all duration-500 ease-out ${a?"scale-105 shadow-2xl shadow-primary/30":"group-hover:scale-105 group-hover:shadow-xl"}`,children:e.jsx("p",{className:"font-medium",children:s.question})}),e.jsx("div",{className:`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ${a?"scale-110 shadow-xl":"group-hover:scale-105"}`,children:e.jsx(y,{className:"w-5 h-5 text-white"})})]}),e.jsx("div",{className:`transition-all duration-700 ease-out ${a?"max-h-[500px] opacity-100 translate-y-0 scale-100":"max-h-0 opacity-0 -translate-y-8 scale-95 overflow-hidden"}`,children:e.jsxs("div",{className:`flex gap-3 transition-all duration-500 delay-100 ${a?"translate-x-0":"-translate-x-4"}`,children:[e.jsx("div",{className:`w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-500 ${a?"scale-110 rotate-12":""}`,children:e.jsx(h,{className:`w-5 h-5 text-primary transition-transform duration-500 ${a?"rotate-[-12deg]":""}`})}),e.jsxs("div",{className:"max-w-[80%] bg-gray-50 rounded-2xl rounded-tl-md p-4 shadow-md",children:[e.jsx("p",{className:`leading-relaxed transition-all duration-500 delay-200 ${a?"opacity-100 translate-y-0":"opacity-0 translate-y-2"} ${(r==null?void 0:r.class_faq_answer)||"text-gray-700"}`,children:s.answer}),e.jsxs("div",{className:`flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 transition-all duration-500 delay-300 ${a?"opacity-100 translate-y-0":"opacity-0 translate-y-2"}`,children:[e.jsx("span",{className:"text-xs text-gray-500",children:"¿Fue útil esta respuesta?"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{className:"text-xs px-3 py-1 rounded-full bg-white hover:bg-green-50 hover:text-green-600 transition-all duration-300 border border-gray-200 hover:border-green-300 hover:scale-105 hover:shadow-md",children:"👍 Sí"}),e.jsx("button",{className:"text-xs px-3 py-1 rounded-full bg-white hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-gray-200 hover:border-red-300 hover:scale-105 hover:shadow-md",children:"👎 No"})]})]})]})]})})]},s.id)}):e.jsxs("div",{className:"text-center py-12",children:[e.jsx("div",{className:"w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx(m,{className:"w-10 h-10 text-gray-400"})}),e.jsx("p",{className:"text-gray-500 text-lg",children:"No se encontraron preguntas que coincidan con tu búsqueda"})]})}),!t&&e.jsxs("div",{className:"mt-6 pt-6 border-t border-gray-200",children:[e.jsx("p",{className:"text-sm text-gray-500 mb-3",children:"Preguntas sugeridas:"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:o.slice(0,3).map(s=>e.jsxs("button",{onClick:()=>n(s.id),className:"text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 border border-gray-200 hover:border-primary hover:scale-105 hover:shadow-lg",children:[s.question.substring(0,40),"..."]},s.id))})]})]}),(r==null?void 0:r.show_contact_cta)&&e.jsxs("div",{className:"mt-8 text-center",children:[e.jsx("p",{className:"text-gray-600 mb-4",children:"¿Necesitas más ayuda?"}),e.jsxs("a",{href:"/contacto",className:"inline-flex items-center gap-2 bg-white hover:bg-primary text-primary hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-primary",children:[e.jsx(x,{className:"w-5 h-5"}),"Hablar con un humano"]})]})]}),e.jsx("style",{children:`
                @keyframes slideInRight {
                    0% {
                        opacity: 0;
                        transform: translateX(40px) scale(0.9);
                    }
                    60% {
                        opacity: 0.8;
                        transform: translateX(-5px) scale(1.02);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 10px;
                    transition: background 0.3s ease;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                }
                
                @keyframes pulse-dot {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.7;
                    }
                }
            `})]})};export{C as default};
