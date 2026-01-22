import Tippy from "@tippyjs/react";
import React, { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";

const HeaderContact = ({ items, data, generals = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleMenu = (event) => {
    if (event.target.closest('.menu-toggle')) {
      setIsOpen(!isOpen)
    } else {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <header id={data?.element_id || null} className="sticky top-0 w-screen z-40">
      <div className={`flex justify-between items-center bg-gray-600 ${!isOpen && location.pathname == '/' && 'bg-opacity-80'} text-white ps-[5%] border-b`}>
        <div className="py-4">
          <a href="/">
            <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-8 aspect-[13/4] object-contain object-center" onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/img/logo-bk.svg';
            }} />
          </a>
        </div>
        <div className="flex">
          <button
            onClick={toggleMenu}
            className="text-white h-16 px-8 border-x menu-toggle"
            aria-label="Toggle menu"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
          <button className="hidden md:block bg-primary text-black px-8 font-bold" onClick={e => location.href = '/contact'}>
            CONVERSEMOS
            <i className="fa fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
      <div
        ref={menuRef}
        className={`fixed inset-0 bg-gray-600 text-white z-40 transform ${isOpen ? 'translate-y-16' : '-translate-y-full'} transition-transform duration-300 ease-in-out border-t p-[5%] h-[calc(100vh-64px)] md:h-max overflow-y-auto`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col">
              <a href="/" className="text-lg font-bold mb-4 hover:text-primary" onClick={() => setIsOpen(false)}>
                Inicio
              </a>
              <a href="/courses" className="text-lg font-bold mb-4 hover:text-primary" onClick={() => setIsOpen(false)}>
                Cursos y talleres
              </a>
              <a href="/about" className="text-lg font-bold mb-4 hover:text-primary" onClick={() => setIsOpen(false)}>
                Nosotros
              </a>
            </div>
            <div className="flex flex-col">
              <a href="/blog" className="text-lg font-bold mb-4 hover:text-primary" onClick={() => setIsOpen(false)}>
                Blog
              </a>
              <a href="/contact" className="text-lg font-bold mb-4 hover:text-primary" onClick={() => setIsOpen(false)}>
                Contacto
              </a>
            </div>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div>
              <p className="mb-4 text-lg">{generals.find(x => x.correlative == 'support_phone')?.description}</p>
              <p className="mb-4 text-lg">{generals.find(x => x.correlative == 'support_email')?.description}</p>
              <p className="mb-4 text-lg">{generals.find(x => x.correlative == 'opening_hours')?.description}</p>
            </div>
            <div>
              <p className="mb-4">
                {generals.find(x => x.correlative == 'address')?.description}
              </p>
              <div className="flex gap-4 mt-4">
                {
                  items.map((item, index) => {
                    return <Tippy key={index} content={`Ver ${item.name} en ${item.description}`}>
                      <a href={item.link} className="text-2xl" onClick={() => setIsOpen(false)}>
                        <i className={`fab ${item.icon}`}></i>
                      </a>
                    </Tippy>
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <button className="bg-primary text-black px-4 py-2 rounded mt-8 font-bold block md:hidden" onClick={() => location.href = '/contact'}>
          CONVERSEMOS
          <i className="fa fa-arrow-right ms-2"></i>
        </button>
      </div>
    </header>
  )
};

export default HeaderContact