import Swal from "sweetalert2"
import html2string from "../../../Utils/html2string"
import HtmlContent from "../../../Utils/HtmlContent"
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency"
import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
// Add this with other imports at the top

const ProductDetailKuchara = ({ item, cart, setCart }) => {
  // Add this state near other states
  const [currentImage, setCurrentImage] = useState(item?.image);

  const quantityRef = useRef()
  const [quantity, setQuantity] = useState(1)

  const onAddClicked = () => {
    const newCart = structuredClone(cart)
    const index = newCart.findIndex((x) => x.id == item.id)
    if (index == -1) {
      newCart.push({ ...item, quantity: Number(quantity || 1) })
    } else {
      newCart[index].quantity++
    }
    setCart(newCart)

    Swal.fire({
      title: "Producto agregado",
      text: `Se agregó ${item.name} al carrito`,
      icon: "success",
      timer: 1500,
    })
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  return (
    <section className="w-full px-[5%] py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Columna izquierda - Imágenes */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square rounded-lg overflow-hidden">
            <img
              src={`/storage/images/item/${currentImage}`}
              alt={item?.name}
              className="w-full h-full object-cover object-center"
              data-aos="fade-up"
              data-aos-offset="150"
              onError={e => e.target.src = '/api/cover/thumbnail/null'}
            />
          </div>
          <Swiper
            slidesPerView="auto"
            spaceBetween={12}
            className="w-full"
          >
            <SwiperSlide className="!w-[80px]">
              <button
                onClick={() => setCurrentImage(item?.image)}
                className={`w-[80px] h-[80px] rounded-lg overflow-hidden border-2 ${currentImage === item?.image ? 'border-green-600' : 'border-gray-200'
                  }`}
              >
                <img
                  src={`/storage/images/item/${item?.image}`}
                  alt={item?.name}
                  className="w-full h-full object-cover object-center"
                  onError={e => e.target.src = '/api/cover/thumbnail/null'}
                />
              </button>
            </SwiperSlide>
            {item?.gallery?.map((image, index) => (
              <SwiperSlide key={index} className="!w-[80px]">
                <button
                  onClick={() => setCurrentImage(image)}
                  className={`w-[80px] h-[80px] rounded-lg overflow-hidden border-2 ${currentImage === image ? 'border-green-600' : 'border-gray-200'
                    }`}
                >
                  <img
                    src={`/storage/images/item/${image}`}
                    alt={`imagen-${index}`}
                    className="w-full h-full object-cover object-center"
                    onError={e => e.target.src = '/api/cover/thumbnail/null'}
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Columna derecha - Información del producto */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>SKU: {item?.sku || "N/A"}</span>
              <span className="text-green-600 font-medium">Disponibilidad: {item?.stock > 0 ? "En stock" : "Agotado"}</span>
            </div>

            <h1 className="font-bold font-title text-3xl text-green-700 leading-none my-4">{item?.name || "Sin nombre"}</h1>

            <div className="flex items-baseline gap-3 mt-2">
              {item?.discount && (
                <span className="text-gray-500 line-through text-lg">{CurrencySymbol()} {Number2Currency(item.price)}</span>
              )}
              <span className="font-bold text-3xl">{CurrencySymbol()} {Number2Currency(item?.final_price)}</span>
              {item?.discount && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-md">
                  -{Math.round(((item.price - item.final_price) / item.price) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="mt-2">
            <h3 className="font-medium text-lg mb-2">Descripción:</h3>
            <p className="text-gray-700">
              {item?.summary || html2string(item?.description).trim() || "Sin descripción"}
            </p>
          </div>

          {/* Contenido del producto */}
          {(item?.category || item?.subcategory || item?.brand) && (
            <div className="mt-2">
              <h3 className="font-medium text-lg mb-2">Contenido:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {item?.category && (
                  <li>
                    <span className="font-medium">{item.category.name}</span>
                  </li>
                )}
                {item?.subcategory && (
                  <li>
                    <span className="font-medium">{item.subcategory.name}</span>
                  </li>
                )}
                {item?.brand && (
                  <li>
                    <span className="font-medium">{item.brand.name}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* <div className="mt-4">
            <p className="text-gray-700 mb-2">
              Perfecto para quienes buscan calidad, sabor y productos directamente del productor.
            </p>
          </div> */}

          {/* Selector de cantidad */}
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity" className="font-medium">
                Cantidad
              </label>
              <div className="flex items-center">
                <div className="flex border border-gray-300 rounded-md">
                  <button type="button" onClick={decrementQuantity} className="px-3 py-2 border-r border-gray-300">
                    <i className="mdi mdi-minus" size={16} />
                  </button>
                  <input
                    id="quantity"
                    ref={quantityRef}
                    type="number"
                    className="w-16 text-center focus:outline-none"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                  />
                  <button type="button" onClick={incrementQuantity} className="px-3 py-2 border-l border-gray-300">
                    <i className="mdi mdi-plus" size={16} />
                  </button>
                </div>
                <span className="ml-3 text-gray-600">Máximo 10 unidades.</span>
              </div>
            </div>
          </div>

          {/* Información de envío */}
          {/* <div className="mt-2 bg-green-50 p-3 rounded-md flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
              <span>{CurrencySymbol()}</span>
            </div>
            <span className="text-green-700">
              Agrega {CurrencySymbol()} 100.00 para <strong>ENVÍO GRATIS</strong>
            </span>
          </div> */}

          {/* Botones de acción */}
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={onAddClicked}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <i className="mdi mdi-cart-plus" size={20} />
              <span>Agregar a mi carrito</span>
            </button>
            {/* <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center justify-center gap-2 transition-colors">
              <i className="mdi mdi-heart" size={20} />
              <span>Lista de favoritos</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Descripción completa */}
      {html2string(item?.description).trim() && (
        <div className="mt-12 border-t pt-8">
          <h2 className="font-bold text-2xl text-green-700 mb-4">Descripción completa</h2>
          <div className="text-gray-700 prose ql-editor">
            <HtmlContent html={item?.description} />
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetailKuchara