import{j as t}from"./AboutHeader-Bdo2C3ON.js";import{r}from"./index-DFv2mRv-.js";import{S as i,a as s}from"./ProductList-C1xYOcEm.js";import{P as n}from"./pagination-BzMuvBpz.js";import{A as d}from"./autoplay-CXxwwNHA.js";import{A as m}from"./SliderBoxed-Deeju_QS.js";/* empty css               */import"./Strengths-D6M-zr6R.js";import{e as p}from"./em-BQTa4g5c.js";import"./HtmlContent-ux768mvo.js";const k=({sliders:a})=>(r.useEffect(()=>{m.init()},[]),t.jsx("section",{className:"bg-gradient-to-r from-[#c4b8d3] to-[#dbc8c9] md:px-[10%] md:py-[2.5%]",children:t.jsx(i,{modules:[d,n],autoplay:{delay:5e3,disableOnInteraction:!1},pagination:{clickable:!0},loop:!0,className:"banner-swiper",children:a.map((e,o)=>t.jsx(s,{children:t.jsxs("div",{className:"bg-[#907755] w-full px-[5%] py-[25%] md:px-[7.5%] md:py-[10%] [background-position:left] md:[background-position:center] md:rounded-3xl",style:{backgroundImage:`url('/api/sliders/media/${e.bg_image}')`,backgroundSize:"cover",backgroundPosition:"center"},children:[t.jsx("h1",{className:"text-2xl text-white w-2/3 lg:w-1/3","data-aos":"fade-down",children:p(e.name)}),t.jsx("p",{className:"text-white py-4 w-2/3 lg:w-1/3","data-aos":"fade-up",children:e.description}),e.button_text&&e.button_link&&t.jsx("a",{href:e.button_link,className:"bg-[#DAAD9A] text-white text-sm px-4 py-3 rounded border border-white inline-block uppercase","data-aos":"fade-up",children:e.button_text})]})},o))})}));export{k as default};