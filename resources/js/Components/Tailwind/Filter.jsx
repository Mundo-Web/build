import React from "react"

const FilterSimple = React.lazy(() => import('./Filters/FilterSimple'))

const Filter = ({ which, data, category, subcategory, cart, setCart }) => {
  const getFilter = () => {
    switch (which) {
      case 'FilterSimple':
        return <FilterSimple data={data} category={category} subcategory={subcategory} cart={cart} setCart={setCart} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFilter()
}

export default Filter