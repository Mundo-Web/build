import{j as e}from"./AboutHeader-Bdo2C3ON.js";import"./index-DFv2mRv-.js";import{S as m,a as n}from"./ProductList-C1xYOcEm.js";import{P as i}from"./pagination-BzMuvBpz.js";import{A as x}from"./autoplay-CXxwwNHA.js";/* empty css               */import"./Strengths-D6M-zr6R.js";import{e as a}from"./em-BQTa4g5c.js";const d="/build/testimonieImage.png",v=({testimonies:c,background:r="#fbbf24",details:t})=>e.jsxs("section",{className:"grid md:grid-cols-5 gap-8",style:{backgroundColor:r},children:[e.jsx("div",{className:"col-span-full md:col-span-2 w-full flex items-center justify-center order-last md:order-first",children:e.jsx("div",{className:"relative flex grow justify-center md:justify-start p-[5%] pb-0 md:p-0 md:px-[5%]  md:h-[calc(100%+64px)] md:-mt-16",children:e.jsx("img",{src:d,alt:"testimony",className:"object-contain object-center md:object-left-bottom lg:object-bottom w-full max-w-md",style:{aspectRatio:1.125},onError:s=>s.target.src="/assets/resources/cover-404.svg"})})}),e.jsxs("div",{className:"col-span-full md:col-span-3 p-[5%] w-full flex flex-col items-center order-first md:order-last",children:[e.jsxs("div",{className:"flex flex-col justify-center items-center max-w-full text-center md:text-left",children:[(t==null?void 0:t["testimonies.title"])&&e.jsx("h2",{className:"text-3xl md:text-4xl font-bold tracking-tighter leading-tight text-gray-900",children:a(t==null?void 0:t["testimonies.title"])}),(t==null?void 0:t["testimonies.description"])&&e.jsx("div",{className:"mt-2 text-sm leading-5 text-center text-gray-700",children:a(t==null?void 0:t["testimonies.description"])})]}),e.jsx(m,{modules:[x,i],autoplay:{delay:3e3,disableOnInteraction:!1},pagination:{clickable:!0},spaceBetween:20,className:"mt-8 w-full",children:c.map((s,l)=>e.jsxs(n,{className:"text-center",children:[e.jsx("div",{className:"text-lg font-medium text-gray-900",children:a(s.description)}),e.jsxs("div",{className:"flex flex-col mt-4 items-center",children:[s.image&&e.jsx("img",{src:`/api/testimonies/media/${s.image}`,alt:"testimony",className:"w-16 h-16 object-cover object-center rounded-full",onError:o=>o.target.src=`https://ui-avatars.com/api/?name=${s.name}&color=7F9CF5&background=EBF4FF`}),e.jsxs("div",{className:"text-base font-semibold leading-6 text-gray-900 mt-2",children:[e.jsxs("span",{className:"text-pink-600",children:[s.name,","]})," ",s.country]})]})]},l))})]})]}),y=({info:c,isAbout:r=!1})=>{const t=[e.jsx("img",{src:"/assets/resources/about.png",backgroundSize:"contain",className:"lg:col-span-2 flex relative self-stretch my-auto rounded-none object-contain object-center aspect-[1.064]",aspectRatio:1.064,noWebp:!1,onError:s=>s.target.src="/assets/resources/cover-404.svg"}),e.jsxs("div",{className:"lg:col-span-3 flex flex-col justify-center self-stretch my-auto",children:[e.jsx("div",{className:"text-xl md:text-2xl lg:text-4xl not-italic  text-[#2B384F] max-md:max-w-full",children:a(c)}),!r&&e.jsxs("a",{href:"/about",className:"flex gap-2 justify-center items-center self-start px-6 py-4 mt-10 text-base font-medium tracking-normal leading-none text-white uppercase rounded-3xl bg-[color:var(--Woodsmoke-800,#2E405E)] max-md:px-5",children:[e.jsx("div",{className:"self-stretch my-auto",children:"sobre nosotros"}),e.jsx("i",{className:"mdi mdi-arrow-top-right shrink-0 self-stretch my-auto w-6"})]})]})];return e.jsx("section",{className:`p-[5%] grid md:grid-cols-2 lg:grid-cols-5 gap-16 w-full ${r&&"bg-slate-100"}`,children:r?t.reverse().map(s=>s):t.map(s=>s)})};export{v as T,y as W};