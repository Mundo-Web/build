import{j as a}from"./AboutHeader-Bdo2C3ON.js";import"./index-DFv2mRv-.js";import{N as d}from"./Number2Currency-e57Tgsuk.js";import{i as t}from"./tippy-react.esm-BVvHiWwH.js";import{S as h}from"./ProductCard-FwiEcsI0.js";const N=({cart:n,item:s,setCart:o})=>{var r;const x=l=>{const e=structuredClone(n),c=e.findIndex(i=>i.id==l.id);c==-1?e.push({...l,quantity:1}):e[c].quantity++,o(e),h.fire({title:"Producto agregado",text:`Se agregó ${l.name} al carrito`,icon:"success",timer:1500})},p=n==null?void 0:n.find(l=>l.id==(s==null?void 0:s.id)),u=(s==null?void 0:s.discount)>0?s==null?void 0:s.discount:s==null?void 0:s.price;return s?a.jsxs("div",{className:"w-full ",children:[a.jsx("img",{src:`/api/items/media/${s==null?void 0:s.image}`,alt:s==null?void 0:s.name,className:"border w-full object-cover mb-4 aspect-square rounded-3xl shadow-lg"}),(s==null?void 0:s.category)&&a.jsx("h3",{className:"line-clamp-1 h-8",children:(r=s==null?void 0:s.category)==null?void 0:r.name}),a.jsx("h2",{className:"text-2xl w-full line-clamp-1 font-bold mb-2",children:s==null?void 0:s.name}),a.jsx("p",{className:"line-clamp-3 h-[72px] opacity-80 mb-4",children:s==null?void 0:s.description}),a.jsxs("div",{className:"flex justify-between items-end",children:[a.jsxs("div",{className:"h-[52px] flex flex-col items-start justify-end",children:[a.jsx("span",{className:"text-sm block opacity-80 line-through",children:(s==null?void 0:s.discount)>0?a.jsxs(a.Fragment,{children:["S/. ",d(s==null?void 0:s.price)]}):""}),a.jsxs("span",{className:"text-2xl font-bold",children:["S/. ",d(u)]})]}),a.jsx(t,{content:"Agregar al carrito",children:a.jsx("button",{className:"bg-primary text-white text-lg px-3 py-1 rounded disabled:cursor-not-allowed disabled:opacity-80",disabled:p,onClick:()=>x(s),children:a.jsx("i",{className:"mdi mdi-cart-plus"})})})]})]}):a.jsxs("div",{className:"w-full ",children:[a.jsx("figure",{className:"w-full mb-4 aspect-square rounded-3xl shadow-lg bg-gray-200 animate-pulse"}),a.jsx("h3",{className:"line-clamp-1 h-8 animate-pulse bg-gray-200 w-32"}),a.jsx("h2",{className:"text-2xl w-full line-clamp-1 font-bold mb-2 h-8 animate-pulse bg-gray-200"}),a.jsx("p",{className:"line-clamp-3 h-[72px] opacity-80 mb-4 animate-pulse bg-gray-200"}),a.jsxs("div",{className:"flex justify-between items-end",children:[a.jsxs("div",{className:"h-[52px] flex flex-col items-start justify-end",children:[a.jsx("span",{className:"text-sm block opacity-80 line-through h-5 animate-pulse bg-gray-200 w-16"}),a.jsx("span",{className:"text-2xl font-bold h-8 w-28 animate-pulse bg-gray-200"})]}),a.jsx("figure",{className:"text-lg px-3 py-1 rounded disabled:cursor-not-allowed disabled:opacity-80 animate-pulse bg-gray-200 text-gray-200",children:"xD"})]})]})};export{N as P};