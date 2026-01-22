import React, { useState, useEffect } from "react";
import Global from "../../../Utils/Global";
import { ChevronRight } from "lucide-react";
import TopBarAddress from "../TopBars/TopBarAddress";

const HeaderHuaillys = ({ data, pages, generals }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    // Efecto para manejar el scroll y hacer el header fixed
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsFixed(scrollPosition > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <section id={data?.element_id || null} className={`bg-secondary customtext-neutral-dark shadow-lg z-50 transition-all duration-300 ${
                isFixed 
                    ? 'fixed top-0 left-0 right-0 shadow-2xl backdrop-blur-sm bg-secondary/95' 
                    : 'relative'
            } ${data?.class || ""}`}>
                {/* TopBar Address */}
                <TopBarAddress data={data?.topbar || {}} />
                
                <header className="px-[5%] w-full 2xl:px-0 2xl:max-w-7xl mx-auto flex py-4 justify-between items-center">
                    {/* Logo Section - Izquierda en mobile y desktop */}
                    <a href="/" className="flex-shrink-0 lg:mr-auto">
                        <img
                            className={`h-12 md:h-20  object-contain object-left w-auto ${data?.class_logo || ""}`}
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/img/logo-bk.svg';
                            }}
                        />
                    </a>

                    {/* Desktop Navigation Menu - Lado derecho */}
                    <nav className={`hidden lg:flex items-center space-x-6 xl:space-x-8 font-title ${data?.class_menu || ""}`}>
                        {pages
                            .filter((x) => x.menuable)
                            .map((page, index) => {
                                const isActive = window.location.pathname === (page.pseudo_path || page.path) || 
                                               (window.location.pathname === '/' && (page.pseudo_path || page.path) === '/');
                                return (
                                    <a
                                        key={index}
                                        href={page.pseudo_path || page.path}
                                        className={`hover:customtext-neutral-dark font-title transition-all duration-200 text-sm md:text-base lg:text-2xl font-medium uppercase tracking-wide pb-1 border-b-2 hover:border-accent ${
                                            isActive 
                                                ? 'border-accent customtext-accent' 
                                                : 'border-transparent'
                                        } ${data?.class_link || ""}`}
                                    >
                                        {page.name}
                                    </a>
                                );
                            })}
                    </nav>

                    {/* Mobile Menu Button - Lado derecho en responsive */}
                    <button
                        className="lg:hidden customtext-neutral-dark hover:customtext-neutral-dark transition-colors  relative"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
                            <g>
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M16 18v2H5v-2h11zm5-7v2H3v-2h18zm-2-7v2H8V4h11z" />
                            </g>
                        </svg>
                    </button>
                </header>

             
            </section>

            {/* Espaciador cuando el header es fixed - incluye TopBar + Header */}
            {isFixed && <div className="h-28 md:h-32"></div>}

            {/* Animación CSS */}
            <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

         {/* Mobile Navigation Menu - Estilo App Mobile */}
                <div
                    className={`fixed z-[99999999] inset-0 bg-black/50 backdrop-blur-sm lg:hidden transition-all duration-300 ease-in-out  ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <nav
                        className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-secondary shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del menú mobile */}
                        <div className="px-6 py-6 border-b border-accent">
                            <div className="flex items-center justify-between">
                                <h2 className="customtext-neutral-dark font-title text-2xl font-bold uppercase">Menú</h2>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="customtext-neutral-dark hover:customtext-neutral-dark transition-colors"
                                >
                                    <i className="mdi mdi-close text-2xl"></i>
                                </button>
                            </div>
                        </div>

                        {/* Items del menú */}
                        <div className="px-4 py-6 font-title overflow-y-auto h-[calc(100%-88px)]">
                            <div className="flex font-title flex-col space-y-1">
                                {pages
                                    .filter((x) => x.menuable)
                                    .map((page, index) => (
                                        <a
                                            key={index}
                                            href={page.pseudo_path || page.path}
                                            className={`group font-title relative  customtext-neutral-dark hover:customtext-neutral-dark transition-all duration-200  py-4 px-4 rounded-lg hover:bg-white/5 uppercase flex items-center justify-between  ${data?.class_link_mobile || ""}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{
                                                animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none'
                                            }}
                                        >
                                            <span className="font-title text-xl">{page.name}</span>
                                          <ChevronRight  />
                                        </a>
                                    ))}
                            </div>
                        </div>
                    </nav>
                </div>
        </>
    );
};

export default HeaderHuaillys;
