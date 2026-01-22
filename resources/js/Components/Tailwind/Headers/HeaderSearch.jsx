import React, { useState } from "react";
import Global from "../../../Utils/Global";
import CartModal from "../Components/CartModal";



const HeaderSimple = ({ data, cart, setCart, pages }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity);
  }, 0);

  return <>
    <section id={data?.element_id || null} className={`bg-white shadow-lg z-20 ${data?.class}`}>
      <header className="px-[5%] replace-max-w-here mx-auto flex p-4 justify-between items-center">
        <a href="/">
          <img className="h-10 aspect-[13/4] object-contain object-center w-auto" src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/img/logo-bk.svg';
          }} />
        </a>
        <button className="h-10 border rounded-xl w-1/3 text-start px-4 cursor-text hidden md:block">
          <i className="mdi mdi-magnify"></i> Buscar...
        </button>
        <div className="flex items-center gap-2">
          <button>
            <i className="mdi mdi-magnify text-4xl md:hidden"></i>
          </button>
          <button>
            <i className="mdi mdi-account-outline text-4xl"></i>
          </button>
          <button className="relative" onClick={() => setModalOpen(true)}>
            <span className="flex items-center justify-center absolute w-max px-1 h-4 min-w-4 right-0 top-0 bg-primary text-xs text-white rounded-full">
              <span>{totalCount}</span>
            </span>
            <i className="mdi mdi-cart-outline text-4xl"></i>
          </button>
        </div>
      </header>
      <hr />
      <menu className="flex mx-auto p-4 gap-6 items-center justify-center font-bold">
        {
          pages.filter(x => x.menuable).map((page, index) => {
            return <button href={page.pseudo_path || page.path} className="border-b-[3px] border-transparent hover:border-b-primary transition-all">{page.name}</button>
          })
        }
      </menu>
    </section>
    <CartModal data={data} cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} />
  </>

}

export default HeaderSimple