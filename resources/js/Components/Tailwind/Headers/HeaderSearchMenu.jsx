import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import { Search} from "lucide-react";

const HeaderSearchMenu = ({
  items,
  data,
  cart,
  setCart,
  isUser,
  pages,
  generals = [], }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity);
  }, 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  return (
    <header className="w-full">
      <div className="px-primary mx-auto py-4 font-paragraph customtext-primary text-base font-semibold">
        <div className="flex items-center justify-between gap-4 ">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-14  object-contain object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/img/logo-bk.svg';
              }} />
          </a>

          <ul className="list-none flex gap-4 text-lg">
            {pages.map((page, index) => (
              page.menuable && ( // Simplified conditional rendering
                <li key={index} className="py-3">
                  <a href={page.path} className="hover:customtext-primary cursor-pointer transition-all duration-300 pr-6  ">
                    {page.name}
                  </a>
                </li>
              )
            ))}
          </ul>

          {/* Search Bar */}
          <div className="flex justify-end">
            <div className="relative w-80 ">
              <input
                type="search"
                placeholder="Buscar productos"
                value={search} // Vincula el valor del input al estado
                onChange={(e) => setSearch(e.target.value)} // Actualiza el estado cuando el usuario escribe
                className="w-full pr-14 py-4  pl-4 border rounded-full focus:ring-0 focus:outline-none placeholder:customtext-primary "
              />
              <a
                href={search.trim() ? `/catalogo?search=${encodeURIComponent(search)}` : "#"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg"
                aria-label="Buscar"
              >
                <Search />
              </a>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
export default HeaderSearchMenu;
