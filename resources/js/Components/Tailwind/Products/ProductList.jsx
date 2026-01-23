import React from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../Components/ProductCard";

const ProductList = ({cart, setCart, data, items }) => {
  return <div className="bg-gray-50"  id={data?.element_id || null}>
    <div className="px-[5%] replace-max-w-here w-full mx-auto  py-[5%] md:py-[2.5%]">
      {
        (data?.title || data?.description || data?.link_catalog) &&
        <div className="flex flex-wrap justify-between mb-[2%]">
          {
            data?.title || data?.description &&
            <div>
              {
                data?.title &&
                <h1 className="text-2xl font-bold mb-[2%]">{data?.title}</h1>
              }
              {
                data?.description &&
                <p className="text-sm mb-[3%]">{data?.description}</p>
              }
            </div>
          }
          {
            data?.link_catalog &&
            <button href={data?.link_catalog} className="text-primary font-bold">
              <span>Ver todos los productos</span>
              <i className="mdi mdi-arrow-top-right"></i>
            </button>
          }
        </div>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[5px] sm:gap-[10px] md:gap-[15px] lg:gap-5">
        {
          items.map((item, index) => {
            return <ProductCard key={index} cart={cart} setCart={setCart} data={data} item={item} />
          })
        }
      </div>
    </div>
  </div>
}

export default ProductList