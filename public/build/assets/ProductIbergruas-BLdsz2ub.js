import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{S as c,a as d}from"./BlogCarousel-CSSJauGD.js";import{A as p}from"./autoplay-E5bqrXsF.js";import{E as m}from"./effect-coverflow-QgUCOmzG.js";/* empty css               */import"./ProductIbergruas-BAzozsdL.js";import{r as h}from"./index-BOnQTV8N.js";import{C as w}from"./chevron-right-Cug7tVUE.js";import"./index-yBjzXJbu.js";import"./create-shadow-G5h1hJ5Q.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./createLucideIcon-DfjclApS.js";const C=({items:l,data:r})=>{const[a,n]=h.useState(0),s=(l==null?void 0:l.filter(t=>t.visible))||[];return!s||s.length===0?null:e.jsxs("section",{className:"relative  py-16 bg-secondary overflow-hidden",children:[e.jsxs("div",{className:"relative mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-7xl",children:[(r==null?void 0:r.title)&&e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h2",{className:"text-3xl whitespace-pre-line md:text-4xl lg:text-5xl font-bold text-white mb-4",children:r.title}),(r==null?void 0:r.subtitle)&&e.jsx("p",{className:"text-lg md:text-xl customtext-neutral-dark max-w-2xl mx-auto",children:r.subtitle})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"hidden md:block absolute left-0 top-0 bottom-0 w-32 lg:w-48 z-10 pointer-events-none gradient-overlay-left"}),e.jsx("div",{className:"hidden md:block absolute right-0 top-0 bottom-0 w-32 lg:w-48 z-10 pointer-events-none gradient-overlay-right"}),e.jsx(c,{modules:[m,p],effect:"coverflow",grabCursor:!0,centeredSlides:!0,slidesPerView:"auto",spaceBetween:60,loop:s.length>3,autoplay:{delay:3500,disableOnInteraction:!1,pauseOnMouseEnter:!0},onSlideChange:t=>n(t.realIndex),coverflowEffect:{rotate:0,stretch:80,depth:200,modifier:1,slideShadows:!1},breakpoints:{320:{spaceBetween:40,coverflowEffect:{rotate:0,stretch:50,depth:150,modifier:1,slideShadows:!1}},768:{spaceBetween:60,coverflowEffect:{rotate:0,stretch:80,depth:200,modifier:1,slideShadows:!1}}},className:"coverflow-swiper",children:s.map((t,i)=>e.jsx(d,{children:e.jsx("a",{href:`/product/${t.slug}`,className:"block group relative transition-all duration-500",children:e.jsx("div",{className:"relative",children:e.jsx("img",{src:`/storage/images/item/${t.banner}`,alt:t.name,className:"w-full h-full object-contain transition-transform duration-700 group-hover:scale-105",onError:o=>{o.target.src="/api/cover/thumbnail/null"}})})})},t.id||i))}),s.length>1&&e.jsx("div",{className:"flex justify-center items-center mt-8 gap-3",children:s.map((t,i)=>e.jsx("button",{onClick:()=>{document.querySelector(".coverflow-swiper").swiper.slideToLoop(i)},className:`transition-all duration-300 ${i===a?"w-10 h-3 bg-primary rounded-full shadow-lg shadow-primary/50":"w-3 h-3 bg-white/50 rounded-full hover:bg-white/80 hover:scale-125"}`,"aria-label":`Ir al producto ${i+1}`},i))})]}),(r==null?void 0:r.link_catalog)&&e.jsx("div",{className:"text-center mt-12 hidden",children:e.jsxs("a",{href:r.link_catalog,className:"inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg",children:["Ver todos los productos",e.jsx(w,{className:"w-5 h-5"})]})})]}),e.jsx("style",{jsx:!0,children:`
                .coverflow-swiper {
                    padding: 90px 0;
                   
                }
                
                .coverflow-swiper .swiper-slide {
                    width: 300px;
                    height: auto;
                    transition: all 0.3s ease;
                }
                
                @media (min-width: 768px) {
                    .coverflow-swiper .swiper-slide {
                        width: 400px;
                    }
                }
                
                @media (min-width: 1024px) {
                    .coverflow-swiper .swiper-slide {
                        width: 500px;
                    }
                }
                
                /* Make center slide BIGGER */
                .coverflow-swiper .swiper-slide-active {
                    z-index: 10;
                    transform: scale(1.4) !important;
                }
                
                /* Side slides smaller and with opacity */
                .coverflow-swiper .swiper-slide:not(.swiper-slide-active) {
                    opacity: 0.4;
                }
                
                /* Gradient overlays */
                .gradient-overlay-left {
                    background: linear-gradient(to right, var(--bg-secondary, #1a1a1a) 0%, transparent 100%);
                }
                
                .gradient-overlay-right {
                    background: linear-gradient(to left, var(--bg-secondary, #1a1a1a) 0%, transparent 100%);
                }
            `})]})};export{C as default};
