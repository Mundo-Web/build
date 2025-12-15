import React from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import Swal from "sweetalert2";
import { Autoplay } from "swiper/modules";

const ProductSlider = ({ data, items = [], cart, setCart }) => {

  if (items.length == 0) return null

  const onAddClicked = (product) => {
    const newCart = structuredClone(cart)
    const index = newCart.findIndex(x => x.id == product.id)
    if (index == -1) {
      newCart.push({ ...product, quantity: 1 })
    } else {
      newCart[index].quantity++
    }
    setCart(newCart)

    Swal.fire({
      title: 'Producto agregado',
      text: `Se agregó ${product.name} al carrito`,
      icon: 'success',
      timer: 3000,
    })
  }

  return <div className="px-[5%] replace-max-w-here w-full mx-auto py-4" style={{
    backgroundColor: data?.background_color,
    color: data?.text_color,
  }}>
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      modules={[Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      loop={true}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="grid grid-cols-2 gap-[5%] items-center">
            <div className="flex gap-2 items-center">
              <img src={`/storage/images/item/${item.image}`} className="w-[60px] h-[60px] rounded aspect-square" alt={item.name} />
              <h4 className="font-title font-bold text-2xl line-clamp-2 leading-tight max-h-[60px]">{item.name}</h4>
            </div>
            <div className="grid grid-cols-2 items-center">
              <span className="text-2xl block w-full text-center font-medium">{CurrencySymbol()} {Number2Currency(item.price)}</span>
              <button className="rounded-full w-max py-2 px-4 text-sm ms-auto" style={{
                backgroundColor: 'rgba(0,0,0,.25)'
              }} onClick={() => onAddClicked(item)}>
                Agregar al carrito
                <i className="mdi mdi-cart-outline ms-1"></i>
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
}

export default ProductSlider