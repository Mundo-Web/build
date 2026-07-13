import React from "react"



const MenuSimple = React.lazy(() => import('./Menu/MenuSimple'))
const MenuMicjc = React.lazy(() => import('./Menu/MenuMicjc'))
const MenuMultivet = React.lazy(() => import('./Menu/MenuMultivet'))
const MenuBananaLab = React.lazy(() => import('./Menu/MenuBananaLab'))
const MenuExpertFarma = React.lazy(() => import('./Menu/MenuExpertFarma'))
const MenuCategories = React.lazy(() => import('./Menu/MenuCategories'))
const MenuKatya = React.lazy(() => import('./Menu/MenuKatya'))
const MenuTwenty = React.lazy(() => import('./Menu/MenuTwenty'))
const Menu = ({ data, which, items, generals = [], cart, setCart, pages }) => {
  const getMenu = () => {
    switch (which) {

      case 'MenuSimple':
        return <MenuSimple data={data} items={items} cart={cart} setCart={setCart} pages={pages} />
      case 'MenuMicjc':
        return <MenuMicjc data={data} items={items} cart={cart} setCart={setCart} pages={pages} />
      case 'MenuMultivet':
        return <MenuMultivet data={data} items={items} cart={cart} setCart={setCart} pages={pages} generals={generals} />
        case 'MenuBananaLab':
          return <MenuBananaLab data={data} items={items} cart={cart} setCart={setCart} pages={pages} />
      
      case 'MenuExpertFarma':
        return <MenuExpertFarma data={data} items={items} cart={cart} setCart={setCart} pages={pages} generals={generals} />
      case 'MenuCategories':
        return <MenuCategories data={data} items={items} pages={pages} visible={data?.showCategories} />
      case 'MenuKatya':
        return <MenuKatya data={data} items={items} pages={pages} visible={data?.showCategories} />
      case 'MenuTwenty':
        return <MenuTwenty data={data} items={items} cart={cart} setCart={setCart} pages={pages} />
    
          default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getMenu()
}

export default Menu;