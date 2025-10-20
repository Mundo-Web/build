import React, { useEffect } from "react";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import { Local } from "sode-extend-react";
import General from "../../../Utils/General";

const ThankSimple = ({ data, item }) => {
  const orderData = {
    orderCode: "#0123_45678",
    products: [
      {
        id: 1,
        name: "Producto 02",
        sku: "090824",
        quantity: 2,
        price: 19.0,
        subtotal: 38.0,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 2,
        name: "Producto 02",
        sku: "090824",
        quantity: 2,
        price: 19.0,
        subtotal: 38.0,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 3,
        name: "Producto 02",
        sku: "090824",
        quantity: 2,
        price: 19.0,
        subtotal: 38.0,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  }

  useEffect(() => {
    if (data['bool:send_whatsapp']) {
      const itemsList = item?.details.map(product => 
        `- ${product.name} (${product.quantity} unidades)`
      ).join('\n');
      
      const message = encodeURIComponent(
        `¡Hola! Acabo de realizar una compra con el código \`#${item?.code}\`.\n` +
        `Me gustaría confirmar los siguientes productos:\n${itemsList}\n` +
        `¿Podrían indicarme el tiempo estimado de entrega?`
      );
      
      const phoneNumber = General.get('phone_whatsapp');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-[5%]">

        {/* Mensaje de agradecimiento */}
        <div className="text-center mb-8">
          <p className="text-lg mb-2">Gracias por tu compra 🎉</p>
          <h1 className="text-3xl font-bold mb-2">Tu orden ha sido recibida</h1>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Código de pedido</p>
            <p className="font-medium">#{item?.code}</p>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {/* Encabezado de la tabla */}
          <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-medium">
            <div className="col-span-6">Producto</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-center">Precio</div>
            <div className="col-span-2 text-center">Sub Total</div>
          </div>

          {/* Productos */}
          {item?.details.map((item) => (
            <div key={item?.id} className="border-t border-gray-200 py-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6 flex items-center">
                  <div className="w-20 h-auto mr-3 relative">
                    <img
                      src={`/storage/images/item/${item?.image}`}
                      onError={(e) => e.target.src = "/assets/img/noimage/no_img.jpg"}
                      alt={item?.name}
                      fill
                      className="rounded-md aspect-[4/3] w-full h-auto object-cover object-center"
                    />
                  </div>
                  <div className="w-full">
                    <p className="font-medium">{item?.name}</p>
                    <p className="text-xs text-gray-500">SKU: {item?.sku}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center">{item?.quantity}</div>
                <div className="col-span-2 text-center">{CurrencySymbol()} {Number2Currency(item?.price)}</div>
                <div className="col-span-2 text-center">{CurrencySymbol()} {Number2Currency(item?.price * item?.quantity)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="grid gap-4 max-w-md mx-auto">
          <a href={data?.url_catalog ?? '/'} className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors text-center">
            Seguir Comprando
          </a>
          {/* <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-md transition-colors">
            Historial de compras
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default ThankSimple