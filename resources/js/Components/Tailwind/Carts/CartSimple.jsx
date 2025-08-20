import React from "react";
import Number2Currency from "../../../Utils/Number2Currency";
import CartItemRow from "../Components/CartItemRow";

const CartSimple = ({ data, cart, setCart }) => {

  const totalPrice = cart.reduce((acc, item) => {
    let finalPrice;
    
    if (item.type === 'combo') {
      // Para combos, usar directamente el precio del combo
      finalPrice = item.discount > 0 ? Math.min(item.price, item.discount) : item.price;
    } else {
      // Para items individuales, aplicar descuentos si existen
      finalPrice = item.discount > 0 ? Math.min(item.price, item.discount) : item.price;
    }
    
    return acc + (finalPrice * item.quantity);
  }, 0);

  const subTotal = (totalPrice * 100) / 118

  return <section className="bg-white">
    <div className="px-[5%] replace-max-w-here w-full mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-4">
      <div className="md:col-span-3 lg:col-span-2 min-h-80">
        {
          cart.length > 0
            ? <table className="w-full">
              <tbody>
                {
                  cart.map((item, index) => {
                    return <CartItemRow key={index} {...item} setCart={setCart} />
                  })
                }
              </tbody>
            </table>
            : <div className="grid items-center justify-center h-full">
              <div>
                <h1 className="text-xl font-bold text-center mb-2">Ups!</h1>
                <p className="text-center mb-4">No hay productos en el carrito</p>
                <button href={data?.url_catalog} className="bg-primary p-2 px-4 rounded-full text-white block mx-auto">
                  <i className="mdi mdi-cart-plus me-1"></i>
                  Agregar productos
                </button>
              </div>
            </div>
        }
      </div>
      <div className="md:col-span-2 lg:col-span-1 sticky top-10 h-max">
        <h2 className="font-semibold text-lg">
          Resumen de la compra
        </h2>
        <hr className="my-2" />
        <div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <p className="font-normal">SubTotal</p>
              <span>S/. {Number2Currency(subTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-normal">IGV (18%)</p>
              <span>S/. {Number2Currency(totalPrice - subTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[20px]">Total</p>
              <span className="font-semibold text-[20px]">S/. {Number2Currency(totalPrice)}</span>
            </div>
            <button href={data?.url_checkout} className="text-white bg-primary w-full px-4 py-2 rounded-full cursor-pointer inline-block text-center">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  </section>
}

export default CartSimple