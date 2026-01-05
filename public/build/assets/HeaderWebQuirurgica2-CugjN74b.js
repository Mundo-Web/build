import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{r as n}from"./index-BOnQTV8N.js";import{G as $}from"./Global-Bz6gVLc5.js";import{C as w}from"./chevron-down-uIVDLcM-.js";import{X as S}from"./x-fof_H3Vv.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./createLucideIcon-DfjclApS.js";const A=({data:s,items:o,pages:d,generals:E=[],isUser:C})=>{const[a,j]=n.useState(!1),[i,c]=n.useState(!1),[h,N]=n.useState(!1),[u,k]=n.useState(!0),[p,f]=n.useState(null),[g,m]=n.useState(null),b=n.useRef(null),v=n.useRef(null);n.useEffect(()=>{N((()=>{const l=window.location.pathname;return l==="/"||l==="/home"||l==="/inicio"})())},[]);const I=(()=>{const t=o&&o.length>0?{type:"services_root",data:o}:null,l=(d||[]).filter(x=>x.menuable).map(x=>({type:"page",data:x})),r=[];return t&&r.push(t),r.push(...l),r})();return n.useEffect(()=>{const t=()=>{j(window.scrollY>20)};return window.addEventListener("scroll",t),()=>window.removeEventListener("scroll",t)},[]),n.useEffect(()=>(i?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[i]),n.useEffect(()=>{function t(l){b.current&&!b.current.contains(l.target)&&c(!1),v.current&&!v.current.contains(l.target)&&(f(null),m(null))}return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]),e.jsxs(e.Fragment,{children:[e.jsx("nav",{className:`w-full top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${h?`fixed ${a?"bg-primary backdrop-blur-xl py-5":"bg-transparent py-8"}`:`${a?"fixed bg-primary py-5":"relative bg-primary py-5"}`}`,style:{boxShadow:a?"0 1px 3px 0 rgba(0, 0, 0, 0.02)":"none",borderBottom:a?"1px solid rgba(0, 0, 0, 0.03)":"none"},children:e.jsx("div",{className:"max-w-[1400px] mx-auto px-8 lg:px-16",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("a",{href:"/",className:"flex items-center gap-4 group relative z-50",children:e.jsx("img",{src:`/assets/resources/logo.png?v=${crypto.randomUUID()}`,alt:$.APP_NAME,className:`${(s==null?void 0:s.logoWidth)||"w-48"} object-contain transition-all duration-500`,onError:t=>{t.target.onerror=null,t.target.src="/assets/img/logo-bk.svg"}})}),e.jsxs("div",{className:"hidden lg:flex items-center gap-8",ref:v,children:[e.jsxs("div",{className:"relative",onMouseEnter:()=>f("services"),onMouseLeave:()=>{f(null),m(null)},children:[e.jsxs("button",{className:`flex items-center gap-2 text-white font-light text-lg tracking-tight hover:text-white/80 transition-colors py-2 ${p==="services"?"text-white/80":""}`,children:["Servicios",e.jsx(w,{className:`w-4 h-4 transition-transform duration-300 ${p==="services"?"rotate-180":""}`})]}),p==="services"&&o&&o.length>0&&e.jsx("div",{className:"absolute top-full left-0 pt-2 w-64 animate-fadeIn",children:e.jsx("div",{className:"bg-white -xl shadow-xl overflow-visible border border-gray-100",children:e.jsx("div",{className:"py-2",children:o.map(t=>e.jsxs("div",{className:"relative",onMouseEnter:()=>m(t.id),onMouseLeave:()=>m(null),children:[e.jsxs("div",{className:`px-4 py-2.5 text-secondary font-light text-lg cursor-pointer transition-all duration-200 flex items-center justify-between group ${g===t.id?"bg-primary/10 text-primary":"hover:bg-primary/5"}`,children:[e.jsx("span",{children:t.alias||t.name}),t.services&&t.services.length>0&&e.jsx(w,{className:`min-w-4 min-h-4 max-w-4 max-h-4 -rotate-90 transition-all duration-200 ${g===t.id?"text-primary translate-x-0.5":"text-gray-400 group-hover:text-primary"}`})]}),g===t.id&&t.services&&t.services.length>0&&e.jsx("div",{className:"absolute left-full top-0 pl-2 w-72 z-50",children:e.jsx("div",{className:"bg-white -xl shadow-2xl border border-gray-100 overflow-hidden animate-slideInRight",children:e.jsx("div",{className:" max-h-[400px] overflow-y-auto custom-scrollbar",children:t.services.map((l,r)=>e.jsx("a",{href:`/servicio/${l.slug}`,className:"block px-4 py-3 text-neutral-dark font-light text-lg hover:bg-primary hover:text-white transition-all duration-200 ",style:{animation:`fadeInStagger 0.15s ease-out ${r*.03}s both`},children:l.name},l.id))})})})]},t.id))})})})]}),d&&d.filter(t=>t.menuable).map(t=>e.jsx("a",{href:t.path,className:"text-white font-light text-lg tracking-tight hover:text-white/80 transition-colors",children:t.name},t.id)),(s==null?void 0:s.ctaText)&&(s==null?void 0:s.ctaLink)&&e.jsx("a",{href:s.ctaLink,className:`px-6 py-3 bg-white -full text-primary text-sm font-semibold tracking-wide hover:bg-secondary hover:text-white transition-all duration-300 ${(s==null?void 0:s.class_cta_button)||""}`,style:{letterSpacing:"0.03em"},children:s.ctaText})]}),e.jsx("button",{onClick:()=>c(!i),className:"lg:hidden relative z-50 w-11 h-11 flex items-center justify-center transition-all duration-500 group","aria-label":"Toggle menu",children:e.jsxs("div",{className:"relative w-6 h-6",children:[e.jsx("span",{className:`absolute left-0 top-1.5 w-6 transition-all duration-500 ease-out ${i?"rotate-45 top-2.5 w-6":""} bg-white`,style:{height:"2px"}}),e.jsx("span",{className:`absolute left-0 top-2.5 w-6 transition-all duration-500 ease-out ${i?"opacity-0 scale-0":"opacity-100 scale-100"} bg-white`,style:{height:"2px"}}),e.jsx("span",{className:`absolute left-0 top-3.5 w-6 transition-all duration-500 ease-out ${i?"-rotate-45 top-2.5 w-6":""} bg-white`,style:{height:"2px"}})]})})]})})}),i&&e.jsx("div",{className:"lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-500",onClick:()=>c(!1)}),e.jsxs("div",{ref:b,className:`lg:hidden fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white transition-all duration-700 ease-out ${i?"translate-x-0":"translate-x-full"}`,style:{boxShadow:i?"-4px 0 24px rgba(0, 0, 0, 0.04)":"none",zIndex:100},children:[e.jsx("button",{onClick:()=>c(!1),className:"absolute top-8 right-8 w-11 h-11 flex items-center justify-center hover:bg-slate-50 -full transition-all duration-300 group cursor-pointer","aria-label":"Cerrar menú",style:{animation:i?"slideIn 0.3s ease-out 0.2s both":"none",zIndex:1e3},children:e.jsx(S,{className:"w-7 h-7 text-secondary group-hover:text-neutral-light transition-colors pointer-events-none"})}),e.jsxs("div",{className:"flex flex-col h-full pt-32 pb-12 px-12",children:[e.jsxs("div",{className:"flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-2",children:[I.map((t,l)=>{if(t.type==="services_root")return e.jsxs("div",{className:"mb-0",children:[e.jsxs("button",{onClick:()=>k(!u),className:"w-full flex items-center justify-between py-5 text-left text-secondary font-light text-xl tracking-tight group hover:text-primary transition-colors border-b border-gray-100",style:{animation:i?"slideIn 0.4s ease-out 0.1s both":"none"},children:[e.jsx("span",{className:"font-light",children:"Servicios"}),e.jsx(w,{className:`w-6 h-6 transition-transform duration-300 ${u?"rotate-180 text-primary":"text-gray-400"}`})]}),e.jsx("div",{className:`overflow-hidden transition-all duration-500 ease-in-out ${u?"max-h-[2000px] opacity-100 mt-4":"max-h-0 opacity-0"}`,children:e.jsx("div",{className:"pl-4 space-y-8   ml-1",children:t.data.map((r,x)=>e.jsxs("div",{className:"relative",children:[e.jsx("h4",{className:"text-secondary font-light text-lg mb-3 block",children:r.alias||r.name}),e.jsxs("div",{className:"space-y-2 ml-2",children:[r.services&&r.services.map((y,M)=>e.jsx("a",{href:`/servicio/${y.slug}`,onClick:()=>c(!1),className:"block py-1 text-[15px] font-light text-neutral-light hover:text-primary hover:bg-primary/5 transition-all duration-300 -md px-2 -ml-2",children:y.name},y.id)),(!r.services||r.services.length===0)&&e.jsx("span",{className:"text-sm text-gray-300 italic px-2",children:"Sin servicios disponibles"})]})]},r.id))})})]},"services-root");if(t.type==="page"){const r=t.data;return e.jsx("a",{href:r.path,onClick:()=>c(!1),className:"block w-full text-left py-4 text-secondary font-light text-xl lg:text-xl tracking-tight hover:text-primary hover:translate-x-1 transition-all duration-300 border-b border-gray-50",style:{animation:i?`slideIn 0.4s ease-out ${l*.06+.2}s both`:"none",letterSpacing:"-0.01em"},children:r.name},`page-${r.id}`)}return null}),"                    "]}),(s==null?void 0:s.ctaText)&&(s==null?void 0:s.ctaLink)&&e.jsx("a",{href:s.ctaLink,className:"w-full px-8 py-4 bg-primary -full text-white text-[13px] font-light tracking-wide hover:bg-secondary transition-all duration-500 mt-8 text-center block",style:{animation:i?"slideIn 0.4s ease-out 0.5s both":"none",letterSpacing:"0.05em"},children:s.ctaText}),(s==null?void 0:s.footerText)&&e.jsx("div",{className:"mt-8 pt-8",style:{borderTop:"1px solid rgba(0, 0, 0, 0.04)"},children:e.jsx("p",{className:"text-[11px] text-neutral-light font-light text-center tracking-wide",style:{letterSpacing:"0.05em"},children:s.footerText})})]})]}),e.jsx("style",{children:`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeInStagger {
                    from {
                        opacity: 0;
                        transform: translateX(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.25s ease-out;
                }
                
                /* Custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `})]})};export{A as default};
