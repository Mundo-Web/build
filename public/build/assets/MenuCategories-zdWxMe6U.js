import{j as i}from"./AboutSimple-Cf8x2fCZ.js";import{r as p}from"./index-BOnQTV8N.js";import{k as G,n as N,p as D,S as O,a as z}from"./BlogCarousel-CSSJauGD.js";import{N as $}from"./navigation-MWoTpsXy.js";import{f as W}from"./free-mode-Dn1BkxeO.js";/* empty css               */import"./BlogCarrusel-yPzlLR5S.js";/* empty css                  */import{t as F}from"./MobileMenu-Cn5ND-xm.js";import{C as V}from"./chevron-left-JcR9Fe4w.js";import{C as q}from"./chevron-right-Cug7tVUE.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./create-element-if-not-defined-CLdVNY0a.js";import"./main-iQpBVKTZ.js";import"./___vite-browser-external_commonjs-proxy-DDYoOVPM.js";import"./CardProductKatya-BPLqIfPk.js";import"./index-B8-haksW.js";import"./index-BLHw34Di.js";import"./BasicRest-tjV1jpAY.js";import"./BooleanLimit-D-OsQsek.js";import"./createLucideIcon-DfjclApS.js";function Z(P){let{swiper:e,extendParams:B,on:j,emit:f}=P;const S=G();B({mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarget:"container",thresholdDelta:null,thresholdTime:null,noMousewheelClass:"swiper-no-mousewheel"}}),e.mousewheel={enabled:!1};let b,y=N(),h;const m=[];function I(a){let o=0,r=0,s=0,n=0;return"detail"in a&&(r=a.detail),"wheelDelta"in a&&(r=-a.wheelDelta/120),"wheelDeltaY"in a&&(r=-a.wheelDeltaY/120),"wheelDeltaX"in a&&(o=-a.wheelDeltaX/120),"axis"in a&&a.axis===a.HORIZONTAL_AXIS&&(o=r,r=0),s=o*10,n=r*10,"deltaY"in a&&(n=a.deltaY),"deltaX"in a&&(s=a.deltaX),a.shiftKey&&!s&&(s=n,n=0),(s||n)&&a.deltaMode&&(a.deltaMode===1?(s*=40,n*=40):(s*=800,n*=800)),s&&!o&&(o=s<1?-1:1),n&&!r&&(r=n<1?-1:1),{spinX:o,spinY:r,pixelX:s,pixelY:n}}function _(){e.enabled&&(e.mouseEntered=!0)}function Y(){e.enabled&&(e.mouseEntered=!1)}function C(a){return e.params.mousewheel.thresholdDelta&&a.delta<e.params.mousewheel.thresholdDelta||e.params.mousewheel.thresholdTime&&N()-y<e.params.mousewheel.thresholdTime?!1:a.delta>=6&&N()-y<60?!0:(a.direction<0?(!e.isEnd||e.params.loop)&&!e.animating&&(e.slideNext(),f("scroll",a.raw)):(!e.isBeginning||e.params.loop)&&!e.animating&&(e.slidePrev(),f("scroll",a.raw)),y=new S.Date().getTime(),!1)}function E(a){const c=e.params.mousewheel;if(a.direction<0){if(e.isEnd&&!e.params.loop&&c.releaseOnEdges)return!0}else if(e.isBeginning&&!e.params.loop&&c.releaseOnEdges)return!0;return!1}function g(a){let c=a,t=!0;if(!e.enabled||a.target.closest(`.${e.params.mousewheel.noMousewheelClass}`))return;const l=e.params.mousewheel;e.params.cssMode&&c.preventDefault();let o=e.el;e.params.mousewheel.eventsTarget!=="container"&&(o=document.querySelector(e.params.mousewheel.eventsTarget));const r=o&&o.contains(c.target);if(!e.mouseEntered&&!r&&!l.releaseOnEdges)return!0;c.originalEvent&&(c=c.originalEvent);let s=0;const n=e.rtlTranslate?-1:1,u=I(c);if(l.forceToAxis)if(e.isHorizontal())if(Math.abs(u.pixelX)>Math.abs(u.pixelY))s=-u.pixelX*n;else return!0;else if(Math.abs(u.pixelY)>Math.abs(u.pixelX))s=-u.pixelY;else return!0;else s=Math.abs(u.pixelX)>Math.abs(u.pixelY)?-u.pixelX*n:-u.pixelY;if(s===0)return!0;l.invert&&(s=-s);let T=e.getTranslate()+s*l.sensitivity;if(T>=e.minTranslate()&&(T=e.minTranslate()),T<=e.maxTranslate()&&(T=e.maxTranslate()),t=e.params.loop?!0:!(T===e.minTranslate()||T===e.maxTranslate()),t&&e.params.nested&&c.stopPropagation(),!e.params.freeMode||!e.params.freeMode.enabled){const d={time:N(),delta:Math.abs(s),direction:Math.sign(s),raw:a};m.length>=2&&m.shift();const v=m.length?m[m.length-1]:void 0;if(m.push(d),v?(d.direction!==v.direction||d.delta>v.delta||d.time>v.time+150)&&C(d):C(d),E(d))return!0}else{const d={time:N(),delta:Math.abs(s),direction:Math.sign(s)},v=h&&d.time<h.time+500&&d.delta<=h.delta&&d.direction===h.direction;if(!v){h=void 0;let w=e.getTranslate()+s*l.sensitivity;const R=e.isBeginning,A=e.isEnd;if(w>=e.minTranslate()&&(w=e.minTranslate()),w<=e.maxTranslate()&&(w=e.maxTranslate()),e.setTransition(0),e.setTranslate(w),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses(),(!R&&e.isBeginning||!A&&e.isEnd)&&e.updateSlidesClasses(),e.params.loop&&e.loopFix({direction:d.direction<0?"next":"prev",byMousewheel:!0}),e.params.freeMode.sticky){clearTimeout(b),b=void 0,m.length>=15&&m.shift();const X=m.length?m[m.length-1]:void 0,H=m[0];if(m.push(d),X&&(d.delta>X.delta||d.direction!==X.direction))m.splice(0);else if(m.length>=15&&d.time-H.time<500&&H.delta-d.delta>=1&&d.delta<=6){const L=s>0?.8:.2;h=d,m.splice(0),b=D(()=>{e.destroyed||!e.params||e.slideToClosest(e.params.speed,!0,void 0,L)},0)}b||(b=D(()=>{if(e.destroyed||!e.params)return;const L=.5;h=d,m.splice(0),e.slideToClosest(e.params.speed,!0,void 0,L)},500))}if(v||f("scroll",c),e.params.autoplay&&e.params.autoplay.disableOnInteraction&&e.autoplay.stop(),l.releaseOnEdges&&(w===e.minTranslate()||w===e.maxTranslate()))return!0}}return c.preventDefault?c.preventDefault():c.returnValue=!1,!1}function k(a){let c=e.el;e.params.mousewheel.eventsTarget!=="container"&&(c=document.querySelector(e.params.mousewheel.eventsTarget)),c[a]("mouseenter",_),c[a]("mouseleave",Y),c[a]("wheel",g)}function M(){return e.params.cssMode?(e.wrapperEl.removeEventListener("wheel",g),!0):e.mousewheel.enabled?!1:(k("addEventListener"),e.mousewheel.enabled=!0,!0)}function x(){return e.params.cssMode?(e.wrapperEl.addEventListener(event,g),!0):e.mousewheel.enabled?(k("removeEventListener"),e.mousewheel.enabled=!1,!0):!1}j("init",()=>{!e.params.mousewheel.enabled&&e.params.cssMode&&x(),e.params.mousewheel.enabled&&M()}),j("destroy",()=>{e.params.cssMode&&M(),e.mousewheel.enabled&&x()}),Object.assign(e.mousewheel,{enable:M,disable:x})}const ve=({pages:P=[],items:e,data:B,visible:j=!1})=>{const[f,S]=p.useState([]),[b,y]=p.useState(0),[h,m]=p.useState(null),[I,_]=p.useState(!0),[Y,C]=p.useState(!1);p.useRef(null);const E=p.useRef(null),g=p.useRef(null),k={modules:[$,Z,W],spaceBetween:8,slidesPerView:"auto",freeMode:{enabled:!0,momentum:!0,momentumRatio:.5,momentumVelocityRatio:.5},mousewheel:{enabled:!0,forceToAxis:!0,sensitivity:.5},navigation:{prevEl:E.current,nextEl:g.current},onSwiper:t=>{m(t),setTimeout(()=>{E.current&&g.current&&(t.params.navigation.prevEl=E.current,t.params.navigation.nextEl=g.current,t.navigation.init(),t.navigation.update())},100)},onSlideChange:t=>{_(t.isBeginning),C(t.isEnd)},breakpoints:{320:{spaceBetween:4},768:{spaceBetween:8},1024:{spaceBetween:12}}};p.useEffect(()=>{const t=document.createElement("style");return t.textContent=`
            .categories-swiper {
                overflow: hidden !important;
                padding: 8px 0;
                margin: 0 40px;
            }
            
            .categories-swiper .swiper-slide {
                width: auto !important;
                flex-shrink: 0;
            }
            
            .swiper-nav-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .swiper-nav-btn:hover {
                background: rgba(255, 255, 255, 1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateY(-50%) scale(1.05);
            }
            
            .swiper-nav-btn.swiper-button-disabled {
                opacity: 0.3;
                cursor: not-allowed;
                pointer-events: none;
            }
            
            .swiper-nav-prev {
                left: 0;
            }
            
            .swiper-nav-next {
                right: 0;
            }
            
            @keyframes slideInFromBottom {
                from {
                    opacity: 0;
                    transform: translateY(12px) scale(0.995);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes shimmer {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }
            
            @keyframes pulse-glow {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
                }
                50% {
                    box-shadow: 0 0 20px 0 rgba(99, 102, 241, 0.1);
                }
            }
            
            .category-item {
                opacity: 0;
                transform: translateY(12px) scale(0.995);
                transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1);
                will-change: transform, opacity;
            }

            .category-item.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            .category-hover-effect {
                will-change: transform, box-shadow;
                backface-visibility: hidden;
                transform: translateZ(0);
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .category-hover-effect:hover {
                animation: pulse-glow 2s infinite;
                box-shadow: 
                    0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(99, 102, 241, 0.1),
                    0 0 20px rgba(99, 102, 241, 0.1);
            }
            
            .category-hover-effect:hover span {
                background: linear-gradient(
                    90deg,
                    currentColor 40%,
                    rgba(99, 102, 241, 0.8) 50%,
                    currentColor 60%
                );
                background-size: 200% 100%;
                background-clip: text;
                -webkit-background-clip: text;
                animation: shimmer 1.5s ease-in-out infinite;
            }
            
            .enhanced-underline {
                background: linear-gradient(90deg, 
                    rgba(99, 102, 241, 0.8) 0%, 
                    rgba(139, 92, 246, 0.8) 50%, 
                    rgba(99, 102, 241, 0.8) 100%
                );
                box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
            }
        `,document.head.appendChild(t),()=>{try{document.head.removeChild(t)}catch{}}},[]);const[M,x]=p.useState({}),a=p.useRef([]);p.useEffect(()=>{if(a.current.forEach(r=>clearTimeout(r)),a.current=[],!e||e.length===0){x({});return}const t=[...e].sort((r,s)=>r.name.localeCompare(s.name)),l={};t.forEach(r=>{const s=r.id??r.slug??r.name;l[s]=!1}),x(l);const o=r=>{if(r>=t.length)return;const s=t[r].id??t[r].slug??t[r].name,n=setTimeout(()=>{x(u=>({...u,[s]:!0})),o(r+1)},400);a.current.push(n)};return o(0),()=>{a.current.forEach(r=>clearTimeout(r)),a.current=[]}},[e]),p.useEffect(()=>{(async()=>{try{const l=await F.getTags();if(l!=null&&l.data){const o=l.data.filter(n=>n.promotional_status==="permanent"||n.promotional_status==="active").sort((n,u)=>n.promotional_status==="active"&&u.promotional_status!=="active"?-1:u.promotional_status==="active"&&n.promotional_status!=="active"?1:n.name.localeCompare(u.name));S(o);const r=o.filter(n=>n.promotional_status==="active").length,s=o.filter(n=>n.promotional_status==="permanent").length;if(r>0){const n=o.filter(u=>u.promotional_status==="active")}}}catch(l){console.error("Error fetching tags:",l)}})()},[]),p.useEffect(()=>{if(f.length>2&&window.innerWidth<1024){const t=setInterval(()=>{y(l=>{const o=l+2;return o>=f.length?0:o})},3e3);return()=>clearInterval(t)}},[f.length]);const c=window.innerWidth<1024;return f.length>0,i.jsx("nav",{className:" relative w-full md:block bg-secondary font-paragraph text-sm",children:i.jsx("div",{className:"px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full",children:i.jsx("div",{className:"flex items-center gap-4 lg:gap-6 text-sm w-full overflow-hidden",children:i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"flex items-center gap-4 w-full overflow-hidden",children:[i.jsx("div",{className:"flex-shrink-0",children:i.jsx("span",{className:"font-semibold customtext-neutral-dark",children:"Categorías:"})}),e&&e.length>0?i.jsxs("div",{className:"relative flex-1 overflow-hidden",children:[i.jsx("button",{ref:E,className:`swiper-nav-btn swiper-nav-prev ${I?"swiper-button-disabled":""}`,"aria-label":"Categoría anterior",children:i.jsx(V,{className:"w-4 h-4 text-gray-600"})}),i.jsx("div",{className:"",children:i.jsx(O,{...k,className:"categories-swiper",children:[...e].sort((t,l)=>t.name.localeCompare(l.name)).map((t,l)=>{const o=t.id??t.slug??t.name;return i.jsx(z,{children:i.jsx("div",{className:`category-item ${M[o]?"visible":""}`,onMouseEnter:r=>r.currentTarget.classList.add(""),onMouseLeave:r=>r.currentTarget.classList.remove(""),children:i.jsx("a",{href:`/catalogo?category=${t.slug}`,className:"relative font-medium text-gray-700 hover:customtext-primary transition-all duration-500 cursor-pointer px-4 py-2.5 rounded-lg   whitespace-nowrap transform hover:scale-110 hover:-translate-y-1  ",children:i.jsxs("span",{className:"relative",children:[t.name,i.jsx("span",{className:"absolute bottom-0 left-0 w-0 h-0.5 enhanced-underline transition-all duration-500 group-hover/item:w-full rounded-full"}),i.jsx("span",{className:"absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent group-hover/item:opacity-100 transition-opacity duration-700 rounded-lg"})]})})})},o)})})}),i.jsx("button",{ref:g,className:`swiper-nav-btn swiper-nav-next ${Y?"swiper-button-disabled":""}`,"aria-label":"Categoría siguiente",children:i.jsx(q,{className:"w-4 h-4 text-gray-600"})})]}):i.jsx("div",{className:"py-3",children:i.jsx("span",{className:"text-sm text-gray-500",children:"No hay categorías disponibles"})})]}),f.length>0&&i.jsx("div",{className:"flex items-center gap-4 lg:gap-4 text-sm",children:f.map((t,l)=>i.jsx("li",{className:"",children:i.jsxs("a",{href:`/catalogo?tag=${t.id}`,className:"font-medium rounded-full p-2 hover:brightness-105 cursor-pointer transition-all duration-300 relative flex items-center gap-2",style:{backgroundColor:t.background_color||"#3b82f6",color:t.text_color||"#ffffff"},title:t.description||t.name,children:[t.icon&&i.jsx("img",{src:`/storage/images/tag/${t.icon}`,alt:t.name,className:"w-4 h-4",onError:o=>o.target.src="/api/cover/thumbnail/null"}),t.name]})},t.id))})]})})})})};export{ve as default};
