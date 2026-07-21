import React, { useState, useEffect } from "react";
import Global from "../../../Utils/Global";
import { Menu, X, ChevronRight } from "lucide-react";

const HeaderFimesac = ({ data, pages, generals = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    // Dynamic sticky effect on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                id={data?.element_id || null}
                className={`bg-white sticky top-0 z-50 border-b border-slate-200 transition-all duration-300 ${
                    isFixed ? "shadow-md py-1" : "py-2"
                } ${data?.class || ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <a href="/" className="flex items-center gap-3">
                                <img
                                    src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                    alt={Global.APP_NAME}
                                    className="h-16 object-contain object-left w-auto"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://www.fimesac.com/wp-content/uploads/2021/07/logo-fimesac5-300x123.png";
                                    }}
                                />
                            </a>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-6">
                            {pages
                                .filter((x) => x.menuable)
                                .map((page, index) => {
                                    const isActive =
                                        window.location.pathname === (page.pseudo_path || page.path) ||
                                        (window.location.pathname === "/" &&
                                            (page.pseudo_path || page.path) === "/");
                                    return (
                                        <a
                                            key={index}
                                            href={page.pseudo_path || page.path}
                                            className={`text-sm font-medium transition-colors uppercase tracking-widest ${
                                                isActive
                                                    ? "text-primary"
                                                    : "text-neutral-dark hover:text-primary"
                                            }`}
                                        >
                                            {page.name}
                                        </a>
                                    );
                                })}
                            <div className="ml-8 pl-8 border-l border-slate-200">
                                <a href="/contacto">
                                    <button className="inline-flex items-center justify-center font-display font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 uppercase tracking-widest text-sm h-12 px-6 bg-primary text-white hover:bg-accent shadow-sm hover:shadow-md">
                                        Contactar Ventas
                                    </button>
                                </a>
                            </div>
                        </nav>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-neutral-dark hover:text-primary p-2 focus:outline-none focus:bg-slate-100 transition-colors rounded-md"
                            >
                                {isOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg left-0 right-0 z-50">
                        <div className="px-4 py-4 space-y-2">
                            {pages
                                .filter((x) => x.menuable)
                                .map((page, index) => {
                                    const isActive =
                                        window.location.pathname === (page.pseudo_path || page.path) ||
                                        (window.location.pathname === "/" &&
                                            (page.pseudo_path || page.path) === "/");
                                    return (
                                        <a
                                            key={index}
                                            href={page.pseudo_path || page.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-4 py-3 text-base font-medium font-display transition-colors border-l-2 ${
                                                isActive
                                                    ? "text-primary border-primary bg-blue-50/50"
                                                    : "text-neutral-dark border-transparent hover:text-primary hover:bg-slate-50 hover:border-slate-300"
                                            }`}
                                        >
                                            {page.name}
                                        </a>
                                    );
                                })}
                            <div className="pt-4 mt-4 border-t border-slate-100">
                                <a href="/contacto" onClick={() => setIsOpen(false)}>
                                    <button className="w-full justify-between inline-flex items-center justify-center font-display font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 uppercase tracking-widest text-sm h-12 px-6 bg-primary text-white hover:bg-slate-800">
                                        Contactar Ventas
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default HeaderFimesac;
