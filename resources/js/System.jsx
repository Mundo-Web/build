import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from './Utils/CreateReactScript';

import TopBar from './Components/Tailwind/TopBar';
import Header from './Components/Tailwind/Header';
import Footer from './Components/Tailwind/Footer';
import SortByAfterField from './Utils/SortByAfterField';
import Slider from './Components/Tailwind/Slider';
import Product from './Components/Tailwind/Product';
import Banner from './Components/Tailwind/Banner';
import Category from './Components/Tailwind/Category';
import Cart from './Components/Tailwind/Cart';
import Step from './Components/Tailwind/Step';
import { Local } from 'sode-extend-react';
import Global from './Utils/Global';
import ItemsRest from './Actions/ItemsRest';
import Filter from './Components/Tailwind/Filter';
import ProductDetail from './Components/Tailwind/ProductDetail';
import Contact from './Components/Tailwind/Contact';
import Frame from './Components/Tailwind/Frame';
import Checkout from './Components/Tailwind/Checkout';

const itemsRest = new ItemsRest();

const System = ({ page, pages, params, filteredData = {}, systems, generals = [], systemItems = {} }) => {

  const getItems = (itemsId) => {
    return systemItems[itemsId] ?? []
  }

  const [cart, setCart] = useState(Local.get(`${Global.APP_CORRELATIVE}_cart`) ?? []);

  useEffect(() => {
    Local.set(`${Global.APP_CORRELATIVE}_cart`, cart);
  }, [cart])

  useEffect(() => {
    itemsRest.verifyStock(cart.map(x => x.id))
      .then(items => {
        const newCart = items.map(item => {
          const found = cart.find(x => x.id == item.id)
          if (!found) return
          found.price = item.price
          found.discount = item.discount
          found.name = item.name
          return found
        })
        setCart(newCart)
      })
  }, [null])

  const getSystem = ({ component, value, data, itemsId, visible }) => {

    if (visible == 0) return <></>

    switch (component) {
      case 'top_bar':
        return <TopBar data={data} which={value} items={getItems(itemsId)} />
      case 'header':
        return <Header data={data} which={value} items={getItems(itemsId)} cart={cart} setCart={setCart} pages={pages} />
      case 'content':
        if (!page.id) {
          return <div className='h-80 w-full bg-gray-300 flex items-center justify-center'>
            <div>- Tu contenido aquí -</div>
          </div>
        } else if (page.extends_base) {
          const contentSystems = SortByAfterField(systems).filter(x => Boolean(x.page_id))
          return contentSystems.map(content => getSystem(content))
        }
        break
      case 'filter':
        return <Filter which={value} data={data} category={filteredData.Category} subcategory={filteredData.SubCategory} cart={cart} setCart={setCart} />
      case 'product':
        return <Product which={value} data={data} items={getItems(itemsId)} cart={cart} setCart={setCart} />
      case 'category':
        return <Category which={value} data={data} items={getItems(itemsId)} />
      case 'slider':
        return <Slider which={value} data={data} sliders={getItems(itemsId)} />
      case 'banner':
        return <Banner which={value} data={data} />
      case 'step':
        return <Step which={value} data={data} />
      case 'product-detail':
        return <ProductDetail which={value} item={filteredData.Item ?? {}} cart={cart} setCart={setCart} />
      case 'cart':
        return <Cart which={value} data={data} cart={cart} setCart={setCart} />
      case 'checkout':
        return <Checkout which={value} cart={cart} setCart={setCart}/>
      case 'contact':
        return <Contact which={value} data={data} />
      case 'frame':
        return <Frame which={value} data={data} />
      case 'footer':
        return <Footer which={value} items={getItems(itemsId)} pages={pages} generals={generals} />
    }
  }

  const systemsSorted = SortByAfterField(systems).filter(x => page.extends_base ? !x.page_id : true)

  return (
    <main className='text-textPrimary'>
      {systemsSorted.map((system) => getSystem(system))}
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<System {...properties} />);
})