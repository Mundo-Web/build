import{j as c}from"./AboutSimple-Cf8x2fCZ.js";import{r as v}from"./index-BOnQTV8N.js";import{h as z,n as M,i as H,j as X,S as G,a as O}from"./BlogCarousel-Bde9hmkj.js";import{N as V}from"./navigation-kKPDy6bA.js";/* empty css               */import"./BlogCarrusel-D7F5uf-O.js";import"./MenuCategories-C-cG8uYW.js";import{t as F}from"./MobileMenu-CelZvc7k.js";import{C as W}from"./chevron-left-JcR9Fe4w.js";import{C as q}from"./chevron-right-Cug7tVUE.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./create-element-if-not-defined-CnB0PJAE.js";import"./main-DKOTUah5.js";import"./___vite-browser-external_commonjs-proxy-DDYoOVPM.js";import"./BasicRest-BCYKfs4R.js";import"./index-DRg3WPTA.js";import"./index-C0Swrixi.js";import"./index-fNjTmf9T.js";import"./createLucideIcon-DfjclApS.js";function Z(_){let{swiper:e,extendParams:D,on:b,emit:w}=_;const P=z();D({mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarget:"container",thresholdDelta:null,thresholdTime:null,noMousewheelClass:"swiper-no-mousewheel"}}),e.mousewheel={enabled:!1};let E,S=M(),p;const u=[];function l(t){let r=0,s=0,n=0,o=0;return"detail"in t&&(s=t.detail),"wheelDelta"in t&&(s=-t.wheelDelta/120),"wheelDeltaY"in t&&(s=-t.wheelDeltaY/120),"wheelDeltaX"in t&&(r=-t.wheelDeltaX/120),"axis"in t&&t.axis===t.HORIZONTAL_AXIS&&(r=s,s=0),n=r*10,o=s*10,"deltaY"in t&&(o=t.deltaY),"deltaX"in t&&(n=t.deltaX),t.shiftKey&&!n&&(n=o,o=0),(n||o)&&t.deltaMode&&(t.deltaMode===1?(n*=40,o*=40):(n*=800,o*=800)),n&&!r&&(r=n<1?-1:1),o&&!s&&(s=o<1?-1:1),{spinX:r,spinY:s,pixelX:n,pixelY:o}}function N(){e.enabled&&(e.mouseEntered=!0)}function j(){e.enabled&&(e.mouseEntered=!1)}function x(t){return e.params.mousewheel.thresholdDelta&&t.delta<e.params.mousewheel.thresholdDelta||e.params.mousewheel.thresholdTime&&M()-S<e.params.mousewheel.thresholdTime?!1:t.delta>=6&&M()-S<60?!0:(t.direction<0?(!e.isEnd||e.params.loop)&&!e.animating&&(e.slideNext(),w("scroll",t.raw)):(!e.isBeginning||e.params.loop)&&!e.animating&&(e.slidePrev(),w("scroll",t.raw)),S=new P.Date().getTime(),!1)}function h(t){const m=e.params.mousewheel;if(t.direction<0){if(e.isEnd&&!e.params.loop&&m.releaseOnEdges)return!0}else if(e.isBeginning&&!e.params.loop&&m.releaseOnEdges)return!0;return!1}function T(t){let m=t,a=!0;if(!e.enabled||t.target.closest(`.${e.params.mousewheel.noMousewheelClass}`))return;const i=e.params.mousewheel;e.params.cssMode&&m.preventDefault();let r=e.el;e.params.mousewheel.eventsTarget!=="container"&&(r=document.querySelector(e.params.mousewheel.eventsTarget));const s=r&&r.contains(m.target);if(!e.mouseEntered&&!s&&!i.releaseOnEdges)return!0;m.originalEvent&&(m=m.originalEvent);let n=0;const o=e.rtlTranslate?-1:1,d=l(m);if(i.forceToAxis)if(e.isHorizontal())if(Math.abs(d.pixelX)>Math.abs(d.pixelY))n=-d.pixelX*o;else return!0;else if(Math.abs(d.pixelY)>Math.abs(d.pixelX))n=-d.pixelY;else return!0;else n=Math.abs(d.pixelX)>Math.abs(d.pixelY)?-d.pixelX*o:-d.pixelY;if(n===0)return!0;i.invert&&(n=-n);let B=e.getTranslate()+n*i.sensitivity;if(B>=e.minTranslate()&&(B=e.minTranslate()),B<=e.maxTranslate()&&(B=e.maxTranslate()),a=e.params.loop?!0:!(B===e.minTranslate()||B===e.maxTranslate()),a&&e.params.nested&&m.stopPropagation(),!e.params.freeMode||!e.params.freeMode.enabled){const f={time:M(),delta:Math.abs(n),direction:Math.sign(n),raw:t};u.length>=2&&u.shift();const C=u.length?u[u.length-1]:void 0;if(u.push(f),C?(f.direction!==C.direction||f.delta>C.delta||f.time>C.time+150)&&x(f):x(f),h(f))return!0}else{const f={time:M(),delta:Math.abs(n),direction:Math.sign(n)},C=p&&f.time<p.time+500&&f.delta<=p.delta&&f.direction===p.direction;if(!C){p=void 0;let k=e.getTranslate()+n*i.sensitivity;const A=e.isBeginning,$=e.isEnd;if(k>=e.minTranslate()&&(k=e.minTranslate()),k<=e.maxTranslate()&&(k=e.maxTranslate()),e.setTransition(0),e.setTranslate(k),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses(),(!A&&e.isBeginning||!$&&e.isEnd)&&e.updateSlidesClasses(),e.params.loop&&e.loopFix({direction:f.direction<0?"next":"prev",byMousewheel:!0}),e.params.freeMode.sticky){clearTimeout(E),E=void 0,u.length>=15&&u.shift();const R=u.length?u[u.length-1]:void 0,L=u[0];if(u.push(f),R&&(f.delta>R.delta||f.direction!==R.direction))u.splice(0);else if(u.length>=15&&f.time-L.time<500&&L.delta-f.delta>=1&&f.delta<=6){const Y=n>0?.8:.2;p=f,u.splice(0),E=H(()=>{e.destroyed||!e.params||e.slideToClosest(e.params.speed,!0,void 0,Y)},0)}E||(E=H(()=>{if(e.destroyed||!e.params)return;const Y=.5;p=f,u.splice(0),e.slideToClosest(e.params.speed,!0,void 0,Y)},500))}if(C||w("scroll",m),e.params.autoplay&&e.params.autoplay.disableOnInteraction&&e.autoplay.stop(),i.releaseOnEdges&&(k===e.minTranslate()||k===e.maxTranslate()))return!0}}return m.preventDefault?m.preventDefault():m.returnValue=!1,!1}function I(t){let m=e.el;e.params.mousewheel.eventsTarget!=="container"&&(m=document.querySelector(e.params.mousewheel.eventsTarget)),m[t]("mouseenter",N),m[t]("mouseleave",j),m[t]("wheel",T)}function g(){return e.params.cssMode?(e.wrapperEl.removeEventListener("wheel",T),!0):e.mousewheel.enabled?!1:(I("addEventListener"),e.mousewheel.enabled=!0,!0)}function y(){return e.params.cssMode?(e.wrapperEl.addEventListener(event,T),!0):e.mousewheel.enabled?(I("removeEventListener"),e.mousewheel.enabled=!1,!0):!1}b("init",()=>{!e.params.mousewheel.enabled&&e.params.cssMode&&y(),e.params.mousewheel.enabled&&g()}),b("destroy",()=>{e.params.cssMode&&g(),e.mousewheel.enabled&&y()}),Object.assign(e.mousewheel,{enable:g,disable:y})}function K(_){let{swiper:e,extendParams:D,emit:b,once:w}=_;D({freeMode:{enabled:!1,momentum:!0,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,momentumVelocityRatio:1,sticky:!1,minimumVelocity:.02}});function P(){if(e.params.cssMode)return;const p=e.getTranslate();e.setTranslate(p),e.setTransition(0),e.touchEventsData.velocities.length=0,e.freeMode.onTouchEnd({currentPos:e.rtl?e.translate:-e.translate})}function E(){if(e.params.cssMode)return;const{touchEventsData:p,touches:u}=e;p.velocities.length===0&&p.velocities.push({position:u[e.isHorizontal()?"startX":"startY"],time:p.touchStartTime}),p.velocities.push({position:u[e.isHorizontal()?"currentX":"currentY"],time:M()})}function S(p){let{currentPos:u}=p;if(e.params.cssMode)return;const{params:l,wrapperEl:N,rtlTranslate:j,snapGrid:x,touchEventsData:h}=e,I=M()-h.touchStartTime;if(u<-e.minTranslate()){e.slideTo(e.activeIndex);return}if(u>-e.maxTranslate()){e.slides.length<x.length?e.slideTo(x.length-1):e.slideTo(e.slides.length-1);return}if(l.freeMode.momentum){if(h.velocities.length>1){const s=h.velocities.pop(),n=h.velocities.pop(),o=s.position-n.position,d=s.time-n.time;e.velocity=o/d,e.velocity/=2,Math.abs(e.velocity)<l.freeMode.minimumVelocity&&(e.velocity=0),(d>150||M()-s.time>300)&&(e.velocity=0)}else e.velocity=0;e.velocity*=l.freeMode.momentumVelocityRatio,h.velocities.length=0;let g=1e3*l.freeMode.momentumRatio;const y=e.velocity*g;let t=e.translate+y;j&&(t=-t);let m=!1,a;const i=Math.abs(e.velocity)*20*l.freeMode.momentumBounceRatio;let r;if(t<e.maxTranslate())l.freeMode.momentumBounce?(t+e.maxTranslate()<-i&&(t=e.maxTranslate()-i),a=e.maxTranslate(),m=!0,h.allowMomentumBounce=!0):t=e.maxTranslate(),l.loop&&l.centeredSlides&&(r=!0);else if(t>e.minTranslate())l.freeMode.momentumBounce?(t-e.minTranslate()>i&&(t=e.minTranslate()+i),a=e.minTranslate(),m=!0,h.allowMomentumBounce=!0):t=e.minTranslate(),l.loop&&l.centeredSlides&&(r=!0);else if(l.freeMode.sticky){let s;for(let n=0;n<x.length;n+=1)if(x[n]>-t){s=n;break}Math.abs(x[s]-t)<Math.abs(x[s-1]-t)||e.swipeDirection==="next"?t=x[s]:t=x[s-1],t=-t}if(r&&w("transitionEnd",()=>{e.loopFix()}),e.velocity!==0){if(j?g=Math.abs((-t-e.translate)/e.velocity):g=Math.abs((t-e.translate)/e.velocity),l.freeMode.sticky){const s=Math.abs((j?-t:t)-e.translate),n=e.slidesSizesGrid[e.activeIndex];s<n?g=l.speed:s<2*n?g=l.speed*1.5:g=l.speed*2.5}}else if(l.freeMode.sticky){e.slideToClosest();return}l.freeMode.momentumBounce&&m?(e.updateProgress(a),e.setTransition(g),e.setTranslate(t),e.transitionStart(!0,e.swipeDirection),e.animating=!0,X(N,()=>{!e||e.destroyed||!h.allowMomentumBounce||(b("momentumBounce"),e.setTransition(l.speed),setTimeout(()=>{e.setTranslate(a),X(N,()=>{!e||e.destroyed||e.transitionEnd()})},0))})):e.velocity?(b("_freeModeNoMomentumRelease"),e.updateProgress(t),e.setTransition(g),e.setTranslate(t),e.transitionStart(!0,e.swipeDirection),e.animating||(e.animating=!0,X(N,()=>{!e||e.destroyed||e.transitionEnd()}))):e.updateProgress(t),e.updateActiveIndex(),e.updateSlidesClasses()}else if(l.freeMode.sticky){e.slideToClosest();return}else l.freeMode&&b("_freeModeNoMomentumRelease");(!l.freeMode.momentum||I>=l.longSwipesMs)&&(b("_freeModeStaticRelease"),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses())}Object.assign(e,{freeMode:{onTouchStart:P,onTouchMove:E,onTouchEnd:S}})}const ve=({pages:_=[],items:e,data:D,visible:b=!1})=>{const[w,P]=v.useState([]),[E,S]=v.useState(0),[p,u]=v.useState(null),[l,N]=v.useState(!0),[j,x]=v.useState(!1);v.useRef(null);const h=v.useRef(null),T=v.useRef(null),I={modules:[V,Z,K],spaceBetween:8,slidesPerView:"auto",freeMode:{enabled:!0,momentum:!0,momentumRatio:.5,momentumVelocityRatio:.5},mousewheel:{enabled:!0,forceToAxis:!0,sensitivity:.5},navigation:{prevEl:h.current,nextEl:T.current},onSwiper:a=>{u(a),setTimeout(()=>{h.current&&T.current&&(a.params.navigation.prevEl=h.current,a.params.navigation.nextEl=T.current,a.navigation.init(),a.navigation.update())},100)},onSlideChange:a=>{N(a.isBeginning),x(a.isEnd)},breakpoints:{320:{spaceBetween:4},768:{spaceBetween:8},1024:{spaceBetween:12}}};v.useEffect(()=>{const a=document.createElement("style");return a.textContent=`
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
        `,document.head.appendChild(a),()=>{try{document.head.removeChild(a)}catch{}}},[]);const[g,y]=v.useState({}),t=v.useRef([]);v.useEffect(()=>{if(t.current.forEach(s=>clearTimeout(s)),t.current=[],!e||e.length===0){y({});return}const a=[...e].sort((s,n)=>s.name.localeCompare(n.name)),i={};a.forEach(s=>{const n=s.id??s.slug??s.name;i[n]=!1}),y(i);const r=s=>{if(s>=a.length)return;const n=a[s].id??a[s].slug??a[s].name,o=setTimeout(()=>{y(d=>({...d,[n]:!0})),r(s+1)},400);t.current.push(o)};return r(0),()=>{t.current.forEach(s=>clearTimeout(s)),t.current=[]}},[e]),v.useEffect(()=>{(async()=>{try{console.log("Fetching active tags...");const i=await F.getTags();if(console.log("Tags response:",i),i!=null&&i.data){const r=i.data.filter(o=>o.promotional_status==="permanent"||o.promotional_status==="active").sort((o,d)=>o.promotional_status==="active"&&d.promotional_status!=="active"?-1:d.promotional_status==="active"&&o.promotional_status!=="active"?1:o.name.localeCompare(d.name));P(r),console.log("Active tags set:",r);const s=r.filter(o=>o.promotional_status==="active").length,n=r.filter(o=>o.promotional_status==="permanent").length;if(console.log(`🎯 Tags cargados: ${s} promocionales activos, ${n} permanentes`),s>0){const o=r.filter(d=>d.promotional_status==="active");console.log("🎉 Promociones activas:",o.map(d=>`${d.name} (${d.start_date} - ${d.end_date})`))}}}catch(i){console.error("Error fetching tags:",i)}})()},[]),v.useEffect(()=>{if(w.length>2&&window.innerWidth<1024){const a=setInterval(()=>{S(i=>{const r=i+2;return r>=w.length?0:r})},3e3);return()=>clearInterval(a)}},[w.length]);const m=window.innerWidth<1024;return w.length>0,c.jsx("nav",{className:" relative w-full md:block bg-secondary font-paragraph text-sm",children:c.jsx("div",{className:"px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full",children:c.jsx("div",{className:"flex items-center gap-4 lg:gap-6 text-sm w-full overflow-hidden",children:c.jsxs(c.Fragment,{children:[c.jsxs("div",{className:"flex items-center gap-4 w-full overflow-hidden",children:[c.jsx("div",{className:"flex-shrink-0",children:c.jsx("span",{className:"font-semibold customtext-neutral-dark",children:"Categorías:"})}),e&&e.length>0?c.jsxs("div",{className:"relative flex-1 overflow-hidden",children:[c.jsx("button",{ref:h,className:`swiper-nav-btn swiper-nav-prev ${l?"swiper-button-disabled":""}`,"aria-label":"Categoría anterior",children:c.jsx(W,{className:"w-4 h-4 text-gray-600"})}),c.jsx("div",{className:"",children:c.jsx(G,{...I,className:"categories-swiper",children:[...e].sort((a,i)=>a.name.localeCompare(i.name)).map((a,i)=>{const r=a.id??a.slug??a.name;return c.jsx(O,{children:c.jsx("div",{className:`category-item ${g[r]?"visible":""}`,onMouseEnter:s=>s.currentTarget.classList.add(""),onMouseLeave:s=>s.currentTarget.classList.remove(""),children:c.jsx("a",{href:`/catalogo?category=${a.slug}`,className:"relative font-medium text-gray-700 hover:customtext-primary transition-all duration-500 cursor-pointer px-4 py-2.5 rounded-lg   whitespace-nowrap transform hover:scale-110 hover:-translate-y-1  ",children:c.jsxs("span",{className:"relative",children:[a.name,c.jsx("span",{className:"absolute bottom-0 left-0 w-0 h-0.5 enhanced-underline transition-all duration-500 group-hover/item:w-full rounded-full"}),c.jsx("span",{className:"absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent group-hover/item:opacity-100 transition-opacity duration-700 rounded-lg"})]})})})},r)})})}),c.jsx("button",{ref:T,className:`swiper-nav-btn swiper-nav-next ${j?"swiper-button-disabled":""}`,"aria-label":"Categoría siguiente",children:c.jsx(q,{className:"w-4 h-4 text-gray-600"})})]}):c.jsx("div",{className:"py-3",children:c.jsx("span",{className:"text-sm text-gray-500",children:"No hay categorías disponibles"})})]}),w.length>0&&c.jsx("div",{className:"flex items-center gap-4 lg:gap-4 text-sm",children:w.map((a,i)=>c.jsx("li",{className:"",children:c.jsxs("a",{href:`/catalogo?tag=${a.id}`,className:"font-medium rounded-full p-2 hover:brightness-105 cursor-pointer transition-all duration-300 relative flex items-center gap-2",style:{backgroundColor:a.background_color||"#3b82f6",color:a.text_color||"#ffffff"},title:a.description||a.name,children:[a.icon&&c.jsx("img",{src:`/storage/images/tag/${a.icon}`,alt:a.name,className:"w-4 h-4",onError:r=>r.target.src="/api/cover/thumbnail/null"}),a.name]})},a.id))})]})})})})};export{ve as default};
