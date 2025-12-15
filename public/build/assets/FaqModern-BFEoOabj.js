import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{r as x}from"./index-BOnQTV8N.js";import{C as l}from"./chevron-down-uIVDLcM-.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./createLucideIcon-DfjclApS.js";const y=({data:t,faqs:i})=>{const[a,o]=x.useState(null),n=r=>{o(a===r?null:r)};return e.jsxs("section",{className:"py-12 lg:py-20 px-[5%] bg-gradient-to-br from-gray-50 via-white to-gray-50",children:[e.jsxs("div",{className:"mx-auto 2xl:max-w-7xl",children:[e.jsxs("div",{className:"text-center mb-12 lg:mb-16",children:[e.jsx("h1",{className:`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${(t==null?void 0:t.class_title)||"customtext-neutral-dark"}`,children:(t==null?void 0:t.title)||"Preguntas Frecuentes"}),(t==null?void 0:t.description)&&e.jsx("p",{className:`text-lg md:text-xl max-w-3xl mx-auto ${(t==null?void 0:t.class_description)||"text-gray-600"}`,children:t.description})]}),e.jsx("div",{className:"grid gap-4 lg:gap-6 max-w-5xl mx-auto",children:i.map((r,c)=>{const s=a===r.id;return e.jsxs("div",{className:`group relative bg-white rounded-2xl border-2 transition-all duration-500 ease-out overflow-hidden ${s?"border-primary shadow-2xl shadow-primary/20 scale-[1.02]":"border-gray-100 hover:border-primary/30 hover:shadow-lg hover:scale-[1.01]"}`,style:{animationDelay:`${c*80}ms`,animation:"fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",opacity:0},children:[e.jsxs("button",{onClick:()=>n(r.id),className:"w-full text-left p-6 lg:p-8 flex items-start gap-4 transition-all duration-300 ease-out",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:`text-lg lg:text-xl font-semibold mb-1 transition-all duration-300 ease-out ${s?"customtext-neutral-dark":"customtext-neutral-dark group-hover:text-primary group-hover:translate-x-1"}`,children:r.question}),e.jsx("p",{className:`text-sm customtext-neutral-light line-clamp-1 transition-all duration-300 ${s?"opacity-0 max-h-0":"opacity-100 max-h-10"}`,children:"Click para ver la respuesta"})]}),e.jsx("div",{className:`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ease-out ${s?"bg-gray-100imary rotate-180 scale-110":"bg-gray-100 group-hover:bg-primary/10 group-hover:scale-110"}`,children:e.jsx(l,{className:`w-5 h-5 transition-all duration-500 ease-out ${s?"text-primary":"text-gray-600 group-hover:text-primary"}`})})]}),e.jsx("div",{className:`transition-all duration-700 ease-out overflow-hidden ${s?"max-h-[1000px] opacity-100":"max-h-0 opacity-0"}`,children:e.jsx("div",{className:`px-6 lg:px-8 pb-6 lg:pb-8 transition-all duration-500 delay-100 ${s?"translate-y-0":"-translate-y-4"}`,children:e.jsx("div",{className:"pl-16",children:e.jsx("p",{className:`text-base lg:text-lg leading-relaxed transition-all duration-500 delay-200 ${s?"opacity-100 translate-y-0":"opacity-0 translate-y-2"} ${(t==null?void 0:t.class_faq_answer)||"customtext-neutral-dark"}`,children:r.answer})})})})]},r.id)})}),(t==null?void 0:t.show_contact_cta)&&e.jsx("div",{className:"mt-12 lg:mt-16 text-center",children:e.jsxs("div",{className:"bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12",children:[e.jsx("h3",{className:"text-2xl lg:text-3xl font-bold customtext-neutral-dark mb-4",children:"¿No encontraste lo que buscabas?"}),e.jsx("p",{className:"text-gray-600 mb-6 max-w-2xl mx-auto",children:"Nuestro equipo está listo para ayudarte con cualquier pregunta adicional"}),e.jsxs("a",{href:"/contacto",className:"inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl",children:["Contáctanos",e.jsx(l,{className:"w-5 h-5 rotate-[-90deg]"})]})]})})]}),e.jsx("style",{children:`
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    50% {
                        opacity: 0.5;
                        transform: translateY(10px) scale(0.98);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes pulse-subtle {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
            `})]})};export{y as default};
