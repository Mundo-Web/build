import React from "react"

const ProductDetailSimple = React.lazy(() => import('./ProductDetails/ProductDetailSimple'))

const ProductDetail = ({ which, item, cart, setCart }) => {
  const getProductDetail = () => {
    switch (which) {
      case 'ProductDetailSimple':
        return <ProductDetailSimple item={item} cart={cart} setCart={setCart}/>
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getProductDetail()
}

export default ProductDetail