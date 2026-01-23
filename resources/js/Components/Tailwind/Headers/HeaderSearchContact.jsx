import React, { useState, useEffect, useRef } from "react";
import Global from "../../../Utils/Global";
import CartModal from "../Components/CartModal";
import General from "../../../Utils/General";
import ItemsRest from "../../../Actions/ItemsRest";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";

const itemsRest = new ItemsRest()

const HeaderSearchContact = ({ data, cart, setCart, pages }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
        setSearchModalOpen(false);
      }
    };

    if (searchModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchModalOpen]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      itemsRest.paginate({
        filter: [
          ['name', 'contains', searchQuery], 'or',
          ['summary', 'contains', searchQuery], 'or',
          ['description', 'contains', searchQuery]
        ]
      })
        .then(({ data }) => {
          if (!data) return setSearchResults([])
          setSearchResults(data)
        })
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery('')
  }, [searchModalOpen])

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity)
  }, 0)

  const totalPrice = cart.reduce((acc, item) => {
    const finalPrice = item.discount ? item.discount : item.price
    return acc + Number(item.quantity) * finalPrice
  }, 0)

  return (
    <>
      <section id={data?.element_id || null} className="bg-white shadow z-20 sticky top-0">
        <header className="px-[5%] mx-auto flex p-3 justify-between items-center">
          <a href="/" className="flex-shrink-0">
            <img
              className="h-12 aspect-[13/4] object-contain object-center w-auto"
              src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
              alt={Global.APP_NAME}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/img/logo-bk.svg';
              }}
            />
          </a>

          <div className="hidden md:flex relative flex-grow mx-8 max-w-xl">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full py-2 px-4 bg-accent rounded-full text-sm text-left text-gray-500 cursor-pointer hover:bg-accent/80 transition-colors"
            >
              Estoy buscando...
              <i className="mdi mdi-magnify float-end"></i>
            </button>
          </div>

          <div className="flex items-center gap-5">
            {
              General?.support_phone &&
              <a
                href={`//wa.me/${General?.support_phone?.keep('0-9')}`}
                className="hidden md:block text-right"
                target="_blank">
                <p className="text-xs font-medium">Haz tu pedido</p>
                <p className="text-sm font-bold">{General?.support_phone}</p>
              </a>
            }
            <button className="md:hidden" onClick={() => setSearchModalOpen(true)}>
              <i className="mdi mdi-magnify text-2xl"></i>
            </button>
            <button className="cursor-pointer" onClick={() => location.href = '/login'}>
              <i className="mdi mdi-account-outline text-2xl"></i>
            </button>
            {/* 
            <button className="hidden md:flex relative items-center">
              <i className="mdi mdi-heart-outline text-2xl"></i>
              <span className="flex items-center justify-center absolute w-5 h-5 -right-1 -top-1 bg-primary text-[10px] text-white rounded-full">
                0
              </span>
            </button> */}
            <button className="relative flex items-center" onClick={() => setModalOpen(true)}>
              <div className="relative">
                <i className="mdi mdi-cart-outline text-2xl"></i>
                <span className="flex items-center justify-center absolute w-5 h-5 -right-1 -top-1 bg-primary text-[10px] text-white rounded-full">
                  {totalCount}
                </span>
              </div>
              <div className="hidden md:block ml-2 text-left">
                <p className="text-xs font-medium">Tu carrito</p>
                <p className="text-sm font-bold">{CurrencySymbol()} {totalPrice.toFixed(2)}</p>
              </div>
            </button>
          </div>
        </header>
      </section>

      {/* Modal de búsqueda */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div ref={searchModalRef} className="bg-white w-full max-w-xl rounded-lg shadow-xl mx-4">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Estoy buscando (mínimo 2 caracteres)..."
                className="w-full p-3 px-4 bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i className="mdi mdi-close text-xl"></i>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {searchResults.map((result) => (
                <a
                  href={`/${data?.path_product}/${result.slug}`}
                  key={result.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex gap-2 items-center border-t"
                >
                  <img
                    src={`/storage/images/item/${result.image}`}
                    className="h-10 aspect-[4/3] rounded"
                    alt={result.name}
                    onError={e => e.target.src = '/api/cover/thumbnail/null'} />
                  <div className="w-[calc(100%-60px)]">
                    <h3 className="font-bold truncate w-full">{result.name}</h3>
                    <h3 className="text-nowrap text-sm font-bold">
                      {CurrencySymbol()} {Number2Currency(result.final_price)}
                      {result?.discount_percent > 0 && <span className="ms-1 line-through text-gray-500 font-normal text-xs">{result.price}</span>}
                    </h3>
                    <p className="text-sm text-gray-600">{result.summary}</p>
                  </div>
                </a>
              ))}

              {searchQuery.length > 2 && searchResults.length === 0 && (
                <div className="p-4 text-center text-gray-500 border-t">
                  No se encontraron resultados para "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CartModal data={data} cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

export default HeaderSearchContact;