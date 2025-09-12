import React from "react"
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency"
import Tippy from "@tippyjs/react"
import Swal from "sweetalert2"

const ProductCard = ({ data, cart, item, setCart }) => {
  const onAddClicked = (item) => {
    const newCart = structuredClone(cart)
    const index = newCart.findIndex(x => x.id == item.id)
    if (index == -1) {
      newCart.push({ ...item, quantity: 1 })
    } else {
      newCart[index].quantity++
    }
    setCart(newCart)

    Swal.fire({
      title: 'Producto agregado',
      text: `Se agregó ${item.name} al carrito`,
      icon: 'success',
      timer: 1500,
    })
  }

  const inCart = cart?.find(x => x.id == item?.id)
  const finalPrice = item?.discount > 0 ? item?.discount : item?.price

  if (!item) return <div className="w-full ">
    <figure className="w-full mb-4 aspect-square rounded-3xl shadow-lg bg-gray-200 animate-pulse" />
    <h3 className="line-clamp-1 h-8 animate-pulse bg-gray-200 w-32"></h3>
    <h2 className="text-2xl w-full line-clamp-1 font-bold mb-2 h-8 animate-pulse bg-gray-200"></h2>
    <p className="line-clamp-3 h-[72px] opacity-80 mb-4 animate-pulse bg-gray-200"></p>
    <div className="flex justify-between items-end">
      <div className="h-[52px] flex flex-col items-start justify-end">
        <span className="text-sm block opacity-80 line-through h-5 animate-pulse bg-gray-200 w-16"></span>
        <span className="text-2xl font-bold h-8 w-28 animate-pulse bg-gray-200"></span>
      </div>
      <figure className="text-lg px-3 py-1 rounded disabled:cursor-not-allowed disabled:opacity-80 animate-pulse bg-gray-200 text-gray-200">{"xD"}</figure>
    </div>
  </div>

  return <div className="w-full relative">
    <img
      src={`/storage/images/item/${item?.image}`}
      alt={item?.name}
      className="border w-full object-cover mb-4 aspect-square rounded-2xl shadow-lg"
      onError={e => e.target.src = '/api/cover/thumbnail/null'}
    />
    {
      item?.tags &&
      <div className="absolute top-2 left-2 flex flex-col gap-1 text-xs font-bold">
        {item?.tags?.map((tag, index) => {
          return <span className="px-2 py-1 bg-secondary text-textPrimary rounded">{tag.name}</span>
        })}
      </div>
    }
    {
      item?.category &&
      <h3 className="line-clamp-1 h-8">{item?.category?.name}</h3>
    }
    <a href={`/${data?.path}/${item.slug}`}>
      <h2 className="text-2xl w-full line-clamp-2 h-16 font-bold mb-2">{item?.name}</h2>
    </a>
    {
      data?.['bool:show_summary'] !== false &&
      <p className="line-clamp-3 h-[72px] opacity-80 mb-4">{item?.summary}</p>
    }
    <div className="flex justify-between items-end">
      <div className="h-[52px] flex flex-col items-start justify-end">
        <span className="text-sm block opacity-80 line-through">{item?.discount > 0 ? <>{CurrencySymbol()} {Number2Currency(item?.price)}</> : ''}</span>
        <span className="text-2xl font-bold customtext-primary">{CurrencySymbol()} {Number2Currency(finalPrice)}</span>
      </div>
      <Tippy content='Agregar al carrito'>
        <button className="bg-primary text-white text-lg px-3 py-1 rounded disabled:cursor-not-allowed disabled:opacity-80" disabled={inCart} onClick={() => onAddClicked(item)}>
          <i className="mdi mdi-cart-plus"></i>
        </button>
      </Tippy>
    </div>
  </div>
}

export default ProductCard