import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{S as n,a as p}from"./BlogCarousel-DCQ9UYu0.js";import{A as d}from"./autoplay-BjAsSK2h.js";import{E as m}from"./effect-coverflow-ywoDR-4I.js";/* empty css               */import"./ProductIbergruas-BRr3rBzd.js";import{r as w}from"./index-BOnQTV8N.js";import{C as h}from"./chevron-right-Cug7tVUE.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./createLucideIcon-DfjclApS.js";const k=({items:i,data:r})=>{const[a,c]=w.useState(0),t=(i==null?void 0:i.filter(s=>s.visible))||[];return!t||t.length===0?null:e.jsxs("section",{className:"relative bg-sections-color py-16 bg-secondary",children:[e.jsxs("div",{className:"relative mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-7xl",children:[(r==null?void 0:r.title)&&e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h2",{className:"text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4",children:r.title}),(r==null?void 0:r.subtitle)&&e.jsx("p",{className:"text-lg md:text-xl customtext-neutral-dark max-w-2xl mx-auto",children:r.subtitle})]}),e.jsxs("div",{className:"relative",children:[e.jsx(n,{modules:[m,d],effect:"coverflow",grabCursor:!0,centeredSlides:!0,slidesPerView:"auto",spaceBetween:60,loop:t.length>3,autoplay:{delay:3500,disableOnInteraction:!1,pauseOnMouseEnter:!0},onSlideChange:s=>c(s.realIndex),coverflowEffect:{rotate:0,stretch:80,depth:200,modifier:1,slideShadows:!1},breakpoints:{320:{spaceBetween:40,coverflowEffect:{rotate:0,stretch:50,depth:150,modifier:1,slideShadows:!1}},768:{spaceBetween:60,coverflowEffect:{rotate:0,stretch:80,depth:200,modifier:1,slideShadows:!1}}},className:"coverflow-swiper",children:t.map((s,l)=>e.jsx(p,{children:e.jsx("a",{href:`/product/${s.slug}`,className:"block group relative transition-all duration-500",children:e.jsx("div",{className:"relative",children:e.jsx("img",{src:`/api/items/media/${s.image}`,alt:s.name,className:"w-full h-full object-contain transition-transform duration-700 group-hover:scale-105",onError:o=>{o.target.src="/api/cover/thumbnail/null"}})})})},s.id||l))}),t.length>1&&e.jsx("div",{className:"flex justify-center items-center mt-8 gap-3",children:t.map((s,l)=>e.jsx("button",{onClick:()=>{document.querySelector(".coverflow-swiper").swiper.slideToLoop(l)},className:`transition-all duration-300 ${l===a?"w-10 h-3 bg-primary rounded-full shadow-lg shadow-primary/50":"w-3 h-3 bg-white/50 rounded-full hover:bg-white/80 hover:scale-125"}`,"aria-label":`Ir al producto ${l+1}`},l))})]}),(r==null?void 0:r.link_catalog)&&e.jsx("div",{className:"text-center mt-12",children:e.jsxs("a",{href:r.link_catalog,className:"inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg",children:["Ver todos los productos",e.jsx(h,{className:"w-5 h-5"})]})})]}),e.jsx("style",{jsx:!0,children:`
                .coverflow-swiper {
                    padding: 60px 0 40px;
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
                    transform: scale(1.3) !important;
                }
                
                /* Side slides smaller and with opacity */
                .coverflow-swiper .swiper-slide:not(.swiper-slide-active) {
                    opacity: 0.6;
                }
            `})]})};export{k as default};
