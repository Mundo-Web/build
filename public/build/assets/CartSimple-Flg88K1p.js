import{j as e}from"./AboutHeader-CpM0iYLI.js";import"./index-B80Lgev0.js";import{C as m}from"./CartItemRow-DXgWN_5b.js";import{N as t}from"./Number2Currency-e57Tgsuk.js";import"./tippy-react.esm-CHhA99mn.js";import"./index-DO3Aws4m.js";const f=({data:l,cart:r,setCart:o})=>{const c=r.reduce((i,s)=>{const a=s.discount>0?Math.min(s.price,s.discount):s.price;return i+a*s.quantity},0),n=c*100/118;return e.jsx("section",{className:"bg-white",children:e.jsxs("div",{className:"max-w-6xl w-full mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-4",children:[e.jsx("div",{className:"md:col-span-3 lg:col-span-2 min-h-80",children:r.length>0?e.jsx("table",{className:"w-full",children:e.jsx("tbody",{children:r.map((i,s)=>e.jsx(m,{...i,setCart:o},s))})}):e.jsx("div",{className:"grid items-center justify-center h-full",children:e.jsxs("div",{children:[e.jsx("h1",{className:"text-xl font-bold text-center mb-2",children:"Ups!"}),e.jsx("p",{className:"text-center mb-4",children:"No hay productos en el carrito"}),e.jsxs("button",{href:l==null?void 0:l.url_catalog,className:"bg-primary p-2 px-4 rounded-full text-white block mx-auto",children:[e.jsx("i",{className:"mdi mdi-cart-plus me-1"}),"Agregar productos"]})]})})}),e.jsxs("div",{className:"md:col-span-2 lg:col-span-1 sticky top-10 h-max",children:[e.jsx("h2",{className:"font-semibold text-lg",children:"Resumen de la compra"}),e.jsx("hr",{className:"my-2"}),e.jsx("div",{children:e.jsxs("div",{className:"flex flex-col gap-5",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("p",{className:"font-normal",children:"SubTotal"}),e.jsxs("span",{children:["S/. ",t(n)]})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("p",{className:"font-normal",children:"IGV (18%)"}),e.jsxs("span",{children:["S/. ",t(c-n)]})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("p",{className:"font-semibold text-[20px]",children:"Total"}),e.jsxs("span",{className:"font-semibold text-[20px]",children:["S/. ",t(c)]})]}),e.jsx("button",{href:l==null?void 0:l.url_checkout,className:"text-white bg-primary w-full px-4 py-2 rounded-full cursor-pointer inline-block text-center",children:"Siguiente"})]})})]})]})})};export{f as default};