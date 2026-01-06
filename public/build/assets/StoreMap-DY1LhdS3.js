import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{r as n}from"./index-BOnQTV8N.js";import{L as I,G as O,M as V,I as z}from"./esm-CTRYOAnL.js";import{S as B,a as E}from"./BlogCarousel-CSSJauGD.js";import{N as A}from"./navigation-MWoTpsXy.js";import{P as G}from"./pagination-pES01fIc.js";/* empty css               */import"./BlogCarrusel-yPzlLR5S.js";import"./Strengths-B42DHEXW.js";import{G as S}from"./Global-Bz6gVLc5.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./index-pSueRYGM.js";import"./index-B6ujFmsw.js";import"./create-element-if-not-defined-CLdVNY0a.js";const T=["places"],ie=({data:r,stores:M=[]})=>{var k,F;const[t,d]=n.useState(null),[$,h]=n.useState({lat:-12.046374,lng:-77.042793}),[w,a]=n.useState(6),[j,P]=n.useState(!1),[y,u]=n.useState(!1),N=n.useRef(null),l=M.filter(s=>s.visible&&s.latitude&&s.longitude&&!isNaN(parseFloat(s.latitude))&&!isNaN(parseFloat(s.longitude)));n.useEffect(()=>{if(l.length>0&&!t&&!y)if(l.length===1)h({lat:parseFloat(l[0].latitude),lng:parseFloat(l[0].longitude)}),a(15);else{const s=l.reduce((o,b)=>o+parseFloat(b.latitude),0)/l.length,i=l.reduce((o,b)=>o+parseFloat(b.longitude),0)/l.length;h({lat:s,lng:i});const c=l.map(o=>parseFloat(o.latitude)),m=l.map(o=>parseFloat(o.longitude)),C=Math.max(...c)-Math.min(...c),x=Math.max(...m)-Math.min(...m),p=Math.max(C,x);p>10?a(5):p>5?a(6):p>2?a(7):p>1?a(8):p>.5?a(10):a(12)}},[l,t,y]);const _=s=>({tienda_principal:"Tienda Principal",tienda:"Tienda",oficina:"Oficina",almacen:"Almacén",showroom:"Showroom",otro:"Otro"})[s]||"No especificado",f=s=>{if(!s)return null;try{return typeof s=="string"?JSON.parse(s):s}catch{return null}},L="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",g=s=>{var x;d(s),u(!1);const i=parseFloat(s.latitude),c=parseFloat(s.longitude),m=((x=N.current)==null?void 0:x.getZoom())||w;h({lat:i+.005*(15/m),lng:c})},v=({store:s,isSelected:i,onClick:c})=>e.jsxs("div",{onClick:()=>c(s),className:`group cursor-pointer rounded-none overflow-hidden transition-all duration-300 h-full ${i?"ring-4 ring-primary shadow-2xl  scale-[1.02]":"hover:shadow-lg hover:scale-[1.01]"}`,style:{aspectRatio:"4/5"},children:[e.jsx("div",{className:"relative h-1/2 bg-gradient-to-br from-white/20 to-white/5 overflow-hidden",children:s.image?e.jsx("img",{src:`/storage/images/store/${s.image}`,alt:s.name,className:"w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",onError:m=>{m.target.style.display="none"}}):e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx("div",{className:`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${i?"bg-primary":"bg-white/20 group-hover:bg-white/30"}`,children:e.jsx("i",{className:`fas fa-map-marker-alt text-3xl ${i?"text-white":"customtext-primary"}`})})})}),e.jsxs("div",{className:"h-1/2 bg-secondary/95 backdrop-blur-sm p-4 flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsx("h4",{className:`font-bold text-lg mb-2 line-clamp-2 transition-colors ${i?"customtext-primary":"text-white"}`,children:s.name}),e.jsxs("p",{className:"text-sm text-white/70 line-clamp-2 flex items-start gap-2",children:[e.jsx("i",{className:"fas fa-location-dot text-xs customtext-primary flex-shrink-0 mt-1"}),e.jsx("span",{children:s.address})]})]}),e.jsxs("div",{className:"space-y-2",children:[s.phone&&e.jsxs("p",{className:"text-sm text-white/60 flex items-center gap-2",children:[e.jsx("i",{className:"fas fa-phone text-xs customtext-primary flex-shrink-0"}),e.jsx("span",{children:s.phone})]}),e.jsxs("button",{className:`w-full py-2.5  px-4 rounded-none text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${i?"bg-primary text-white":"bg-white/10 text-white hover:bg-primary hover:text-white"}`,children:[e.jsx("i",{className:"fas fa-map"}),e.jsx("span",{children:i?"Seleccionado":"Ver en mapa"})]})]})]})]}),R=()=>l.length===0?null:l.length>4?e.jsx("div",{className:"py-10",children:e.jsxs("div",{className:"relative max-w-7xl mx-auto px-primary 2xl:px-0",children:[e.jsx(B,{modules:[A,G],spaceBetween:20,slidesPerView:1.2,centeredSlides:!1,navigation:!0,pagination:{clickable:!0},breakpoints:{480:{slidesPerView:2,spaceBetween:16},640:{slidesPerView:2.5,spaceBetween:20},768:{slidesPerView:3,spaceBetween:20},1024:{slidesPerView:3.5,spaceBetween:24},1280:{slidesPerView:4,spaceBetween:24}},className:"store-cards-swiper !pb-14",children:l.map(i=>e.jsx(E,{className:"h-auto !flex",children:e.jsx(v,{store:i,isSelected:(t==null?void 0:t.id)===i.id,onClick:g})},i.id))}),e.jsx("style",{children:`
                        .store-cards-swiper .swiper-slide {
                            height: auto;
                        }
                        .store-cards-swiper .swiper-button-next,
                        .store-cards-swiper .swiper-button-prev {
                            background: rgba(255,255,255,0.15);
                            backdrop-filter: blur(8px);
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            border: 1px solid rgba(255,255,255,0.2);
                            transition: all 0.3s ease;
                        }
                        .store-cards-swiper .swiper-button-next:hover,
                        .store-cards-swiper .swiper-button-prev:hover {
                            background: var(--color-primary, #FF0000);
                            border-color: var(--color-primary, #FF0000);
                        }
                        .store-cards-swiper .swiper-button-next:after,
                        .store-cards-swiper .swiper-button-prev:after {
                            font-size: 16px;
                            font-weight: bold;
                            color: white;
                        }
                        .store-cards-swiper .swiper-pagination-bullet {
                            background: rgba(255,255,255,0.4);
                            opacity: 1;
                            width: 10px;
                            height: 10px;
                        }
                        .store-cards-swiper .swiper-pagination-bullet-active {
                            background: var(--color-primary, #FF0000);
                            width: 28px;
                            border-radius: 5px;
                        }
                    `})]})}):e.jsx("div",{className:"py-10",children:e.jsx("div",{className:"max-w-7xl mx-auto px-primary 2xl:px-0",children:e.jsx("div",{className:"grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5",children:l.map(i=>e.jsx(v,{store:i,isSelected:(t==null?void 0:t.id)===i.id,onClick:g},i.id))})})});return e.jsxs("section",{className:`bg-secondary ${(r==null?void 0:r.class_container)||""}`,children:[e.jsx("style",{children:`
                .gm-style-iw-c {
                    padding: 0 !important;
                    background: none !important;
                    box-shadow: none !important;
                    border-radius: 8px !important;
                }
                .gm-style-iw-d {
                    overflow: visible !important; /* Permitir overflow para que el div interno maneje el scroll */
                    max-height: none !important;
                }
                .gm-style .gm-style-iw-t::after {
                    display: none !important;
                }
                /* Ocultar botón de cerrar por defecto de Google Maps */
                .gm-ui-hover-effect {
                    display: none !important;
                }
                
                /* Custom Scrollbar para el InfoWindow */
                .store-info-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .store-info-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                }
                .store-info-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }
                .store-info-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}),e.jsxs("div",{className:"w-full",children:[((r==null?void 0:r.title)||(r==null?void 0:r.description))&&e.jsxs("div",{className:"text-center pt-12 pb-8 max-w-7xl mx-auto px-primary 2xl:px-0",children:[(r==null?void 0:r.title)&&e.jsx("h2",{className:`text-3xl md:text-4xl font-bold mb-4 ${(r==null?void 0:r.class_title)||"text-white"}`,children:r==null?void 0:r.title}),(r==null?void 0:r.description)&&e.jsx("p",{className:`text-lg max-w-3xl mx-auto ${(r==null?void 0:r.class_description)||"text-white/70"}`,children:r==null?void 0:r.description})]}),(r==null?void 0:r.stored_cards)&&R(),l.length>0?e.jsx("div",{className:"w-full relative",children:e.jsx(I,{googleMapsApiKey:S.GMAPS_API_KEY,libraries:T,onLoad:()=>P(!0),children:e.jsxs(O,{mapContainerStyle:{width:"100%",height:"80vh",minHeight:"600px"},center:$,zoom:w,onLoad:s=>N.current=s,onDragStart:()=>u(!0),onZoomChanged:()=>u(!0),options:{streetViewControl:!0,mapTypeControl:!0,fullscreenControl:!0,zoomControl:!0,gestureHandling:"cooperative",styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]},children:[j&&l.map(s=>e.jsx(V,{position:{lat:parseFloat(s.latitude),lng:parseFloat(s.longitude)},onClick:()=>g(s),title:s.name,icon:{path:L,fillColor:S.APP_COLOR_PRIMARY||"#FF0000",fillOpacity:1,strokeWeight:1,strokeColor:"#FFFFFF",rotation:0,scale:2.5,anchor:new window.google.maps.Point(12,24)}},s.id)),j&&t&&e.jsx(z,{position:{lat:parseFloat(t.latitude),lng:parseFloat(t.longitude)},onCloseClick:()=>d(null),options:{pixelOffset:new window.google.maps.Size(0,-50),maxWidth:320},children:e.jsxs("div",{className:"bg-secondary text-white rounded-lg overflow-hidden shadow-xl store-info-scroll relative",style:{minWidth:"280px",maxHeight:"400px",overflowY:"auto"},children:[e.jsx("button",{onClick:()=>d(null),className:"absolute top-2 right-2 z-50 w-8 h-8 flex items-center justify-center bg-secondary rounded-full shadow-md hover:opacity-90 transition-opacity text-white border border-white/20","aria-label":"Cerrar",children:e.jsx("i",{className:"fas fa-times"})}),t.image&&e.jsxs("div",{className:"relative h-40 w-full flex-shrink-0",children:[e.jsx("img",{src:`/storage/images/store/${t.image}`,alt:t.name,className:"w-full h-full object-cover",onError:s=>s.target.style.display="none"}),e.jsx("div",{className:"absolute top-2 left-2",children:e.jsx("span",{className:"inline-block px-2 py-1 text-xs font-bold rounded bg-white customtext-primary shadow-sm",children:_(t.type)})})]}),e.jsxs("div",{className:"p-4 pt-2",children:[e.jsx("h3",{className:`font-bold text-lg mb-3 customtext-primary ${t.image?"":"pr-8"}`,children:t.name}),e.jsxs("p",{className:"text-sm mb-2 flex items-start",children:[e.jsx("i",{className:"fas fa-map-marker-alt mt-1 mr-2 customtext-primary flex-shrink-0"}),e.jsx("span",{className:"opacity-90",children:t.address})]}),t.phone&&e.jsxs("p",{className:"text-sm mb-2 flex items-center",children:[e.jsx("i",{className:"fas fa-phone mr-2 customtext-primary flex-shrink-0"}),e.jsx("a",{href:`tel:${t.phone}`,className:"hover:text-white hover:underline opacity-90 transition-opacity",children:t.phone})]}),t.email&&e.jsxs("p",{className:"text-sm mb-2 flex items-center",children:[e.jsx("i",{className:"fas fa-envelope mr-2 customtext-primary flex-shrink-0"}),e.jsx("a",{href:`mailto:${t.email}`,className:"hover:text-white hover:underline opacity-90 transition-opacity truncate",children:t.email})]}),t.description&&e.jsx("p",{className:"text-sm opacity-80 mb-3 mt-3 pt-3 border-t border-white/10",children:t.description}),t.manager&&e.jsxs("p",{className:"text-sm mb-2 opacity-90",children:[e.jsx("i",{className:"fas fa-user mr-2 customtext-primary"}),e.jsx("strong",{children:"Encargado:"})," ",t.manager]}),t.business_hours&&e.jsxs("div",{className:"mt-3 pt-3 border-t border-white/10",children:[e.jsxs("p",{className:"text-xs font-bold customtext-primary mb-2 flex items-center",children:[e.jsx("i",{className:"fas fa-clock mr-2"}),"Horarios de atención"]}),e.jsxs("div",{className:"space-y-1",children:[(k=f(t.business_hours))==null?void 0:k.slice(0,3).map((s,i)=>e.jsxs("p",{className:"text-xs opacity-80",children:[e.jsxs("strong",{className:"text-white",children:[s.day,":"]})," ",s.closed?"Cerrado":`${s.open} - ${s.close}`]},i)),((F=f(t.business_hours))==null?void 0:F.length)>3&&e.jsxs("p",{className:"text-xs customtext-primary font-semibold mt-1",children:["+ ",f(t.business_hours).length-3," días más"]})]})]}),e.jsxs("div",{className:"mt-4 flex flex-col gap-2",children:[t.link&&e.jsxs("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",className:"w-full py-2 px-4 rounded text-center text-sm font-semibold border border-white/20 hover:bg-white/10 transition-colors customtext-primary",children:[e.jsx("i",{className:"fas fa-external-link-alt mr-2"}),"Más información"]}),e.jsxs("a",{href:`https://www.google.com/maps/dir/?api=1&destination=${t.latitude},${t.longitude}`,target:"_blank",rel:"noopener noreferrer",className:`w-full py-2 px-4 rounded text-center text-sm font-bold transition-colors shadow-lg ${(r==null?void 0:r.class_button)||"bg-white customtext-primary hover:bg-gray-100"}`,children:[e.jsx("i",{className:"fas fa-directions mr-2"}),"Cómo llegar"]})]})]})]})})]})})}):e.jsxs("div",{className:"text-center py-12 px-primary",children:[e.jsx("i",{className:"fas fa-map-marked-alt text-6xl customtext-neutral-light mb-4"}),e.jsx("p",{className:"text-xl customtext-neutral-light",children:"No hay ubicaciones disponibles en este momento"})]})]})]})};export{ie as default};
