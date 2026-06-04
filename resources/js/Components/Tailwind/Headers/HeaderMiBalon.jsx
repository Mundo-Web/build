import React, { useState, useEffect, useRef } from "react";
import {
    ShoppingBag,
    Search,
    X,
    User as UserIcon,
    LogOut,
    Settings,
    Mail,
    Phone,
    Home,
    ShoppingCart,
    Menu as MenuIcon,
    ChevronRight,
} from "lucide-react";
import Global from "../../../Utils/Global";
import ProfileImage from "./Components/ProfileImage";
import Logout from "../../../Actions/Logout";
import CartModalMiBalon from "../Components/CartModalMiBalon";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import Tippy from "@tippyjs/react";
import SocialsRest from "../../../Actions/SocialsRest";

const SearchOverlay = ({ isOpen, onClose }) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const searchTimeoutRef = useRef(null);

    const fetchSearchSuggestions = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoadingSuggestions(true);
        try {
            const response = await fetch("/api/items/paginate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    take: 6,
                    skip: 0,
                    filter: [
                        ["name", "contains", query],
                        "or",
                        ["summary", "contains", query],
                        "or",
                        ["description", "contains", query],
                        "or",
                        ["sku", "contains", query],
                    ],
                    with: "category,brand",
                }),
            });

            if (!response.ok) throw new Error("Error en la búsqueda");
            const data = await response.json();

            if (data.status === 200 && Array.isArray(data.data)) {
                setSearchSuggestions(data.data);
                setShowSuggestions(data.data.length > 0);
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error("Error fetching search suggestions:", error);
            setSearchSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleSearchChange = (value) => {
        setSearchValue(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            fetchSearchSuggestions(value);
        }, 300);
    };

    const selectSuggestion = (suggestion) => {
        onClose();
        window.location.href = suggestion.slug
            ? `/product/${suggestion.slug}`
            : `/catalogo?search=${encodeURIComponent(suggestion.name)}`;
    };

    const highlightMatches = (text, query) => {
        if (!text || !query) return text;
        const words = query
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length >= 2);
        if (words.length === 0) return text;
        const pattern = new RegExp(
            `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
            "gi",
        );
        const parts = text.split(pattern);
        return parts.map((part, i) => {
            const isMatch = words.some((word) => part.toLowerCase() === word);
            return isMatch ? (
                <strong key={i} className="text-primary font-bold px-1">
                    {part}
                </strong>
            ) : (
                <span key={i}>{part}</span>
            );
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-neutral-dark/80 backdrop-blur-sm z-[100] flex justify-center items-start pt-20 px-4 md:px-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-3xl bg-[#f8f9fa] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden rounded-[2rem]"
                    >
                        {/* Header & Search Bar - Floating Style */}
                        <form
                            className="bg-white p-4 md:p-6 shadow-sm flex items-center justify-between rounded-b-3xl relative z-10"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchValue.trim()) {
                                    window.location.href = `/catalogo?search=${encodeURIComponent(searchValue.trim())}`;
                                }
                            }}
                        >
                            <div className="flex-1 flex items-center bg-gray-50 rounded-full px-5 py-3 md:py-4 border border-gray-100 focus-within:border-primary/50 focus-within:bg-white focus-within:shadow-md transition-all">
                                <Search
                                    size={24}
                                    className="text-primary mr-3"
                                    strokeWidth={2.5}
                                />
                                <input
                                    type="text"
                                    placeholder="Buscar equipamiento, balones..."
                                    className="w-full bg-transparent text-lg md:text-xl font-bold uppercase tracking-tight text-neutral-dark placeholder-gray-400 focus:outline-none"
                                    autoFocus
                                    value={searchValue}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                />
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-12 h-12 md:w-14 md:h-14 ml-4 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-danger transition-colors shadow-sm"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </form>

                        {/* Suggestions Container */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4 md:p-6">
                            {isLoadingSuggestions ? (
                                <div className="py-12 flex items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : searchSuggestions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion.id}
                                            onClick={() =>
                                                selectSuggestion(suggestion)
                                            }
                                            className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all text-left group"
                                        >
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                                                {suggestion.image ? (
                                                    <img
                                                        src={`/api/items/media/${suggestion.image}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        alt={suggestion.name}
                                                    />
                                                ) : (
                                                    <ShoppingBag
                                                        size={24}
                                                        className="text-gray-300"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                                                    {suggestion.category
                                                        ?.name || "Catálogo"}
                                                </p>
                                                <p className="font-bold uppercase tracking-tight text-neutral-dark text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                    {highlightMatches(
                                                        suggestion.name,
                                                        searchValue,
                                                    )}
                                                </p>
                                                <p className="font-black text-md mt-1 text-neutral-dark">
                                                    {CurrencySymbol()}{" "}
                                                    {Number(
                                                        suggestion.final_price,
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : searchValue.length >= 2 ? (
                                <div className="py-12 text-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                        <Search className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-lg font-bold uppercase tracking-tight text-gray-400">
                                        No encontramos resultados
                                    </p>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">
                                        BÚSQUEDAS POPULARES
                                    </p>
                                    <div className="flex flex-wrap gap-3 px-2">
                                        {[
                                            "Balón de Fútbol",
                                            "Guantes",
                                            "Chimpunes",
                                            "Entrenamiento",
                                            "Vóley",
                                            "Básquet",
                                        ].map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                    setSearchValue(tag);
                                                    handleSearchChange(tag);
                                                }}
                                                className="px-5 py-2.5 bg-white shadow-sm border border-gray-100 text-neutral-dark rounded-full text-xs font-bold tracking-wide hover:border-primary hover:text-primary hover:shadow-md transition-all active:scale-95"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const HeaderMiBalon = ({
    data,
    cart,
    setCart,
    pages,
    isUser,
    generals = [],
}) => {
    const [isFixed, setIsFixed] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [socials, setSocials] = useState([]);
    const socialsRest = new SocialsRest();

    const userMenuRef = useRef(null);

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const result = await socialsRest.paginate({
                    skip: 0,
                    take: 10,
                    status: 1,
                });
                if (result.data) setSocials(result.data);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };
        fetchSocials();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsFixed(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);

        const handleClickOutside = (e) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target)
            ) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (menuOpen || searchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [menuOpen, searchOpen]);

    const totalCount =
        cart?.reduce((acc, item) => Number(acc) + Number(item.quantity), 0) ||
        0;

    let isCustomer = false;
    let dashboardUrl = "/admin/home";

    if (isUser && Array.isArray(isUser.roles)) {
        const roleNames = isUser.roles.map((r) => r.name?.toLowerCase());
        isCustomer =
            !roleNames.includes("admin") &&
            !roleNames.includes("root") &&
            !roleNames.includes("seller") &&
            !roleNames.includes("provider");

        if (roleNames.includes("seller")) {
            dashboardUrl = "/seller/home";
        } else if (roleNames.includes("provider")) {
            dashboardUrl = "/provider/home";
        }
    }

    return (
        <>
            <header
                id={data?.element_id || null}
                className={`w-full left-0 z-50 transition-all duration-300 ease-in-out ${
                    isFixed
                        ? "fixed top-0 bg-primary shadow-xl py-4 md:py-5 border-b-2 border-secondary text-white"
                        : "relative py-4 md:py-5 bg-primary text-white border-b border-transparent"
                } ${data?.class || ""}`}
            >
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto flex items-center justify-between relative">
                    {/* Left: Mobile Menu & Logo */}
                    <div className="flex items-center gap-4 flex-1 lg:flex-none">
                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="lg:hidden p-2 text-white hover:text-secondary hover:bg-white/10 transition-colors rounded-md"
                        >
                            <MenuIcon size={28} strokeWidth={2.5} />
                        </button>

                        {/* Logo */}
                        <a href="/" className="group flex items-center">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className={`${isFixed ? "h-10 md:h-12" : "h-10 md:h-14"} object-contain transition-transform duration-300 group-hover:scale-105`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/img/logo-bk.svg";
                                }}
                            />
                        </a>
                    </div>

                    {/* Center: Desktop Navigation (Sporty & Clean) */}
                    <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
                        {pages
                            ?.filter((p) => p.menuable)
                            .map((page, i) => (
                                <a
                                    key={i}
                                    href={page.pseudo_path || page.path}
                                    className="relative text-[13px] font-bold uppercase tracking-widest text-white hover:text-secondary transition-colors group py-2"
                                >
                                    <span className="relative z-10">
                                        {page.name}
                                    </span>
                                    {/* Subtle underline effect using secondary */}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                                </a>
                            ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-1 lg:gap-4 flex-1 lg:flex-none">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 text-white hover:text-primary hover:bg-white rounded-full transition-colors"
                            aria-label="Buscar"
                        >
                            <Search size={22} strokeWidth={2} />
                        </button>
                        {/* Cart Trigger */}
                        <button
                            onClick={() => setCartModalOpen(true)}
                            className="relative p-2 text-white hover:text-primary hover:bg-white rounded-full transition-colors group"
                            aria-label="Carrito"
                        >
                            <ShoppingBag size={22} strokeWidth={2} />
                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full bg-secondary text-white shadow-sm">
                                    {totalCount}
                                </span>
                            )}
                        </button>

                        {/* User Section */}
                        <div
                            className="relative hidden md:block"
                            ref={userMenuRef}
                        >
                            {isUser ? (
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center bg-white gap-2 p-1 pr-3  rounded-full transition-colors"
                                >
                                    <ProfileImage
                                        uuid={isUser.uuid}
                                        name={isUser.name}
                                        className="w-8 h-8 rounded-full border border-white/30"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-wide text-neutral-dark max-w-[100px] truncate">
                                        {isUser.name}
                                    </span>
                                </button>
                            ) : (
                                <a
                                    href="/iniciar-sesion"
                                    className="p-2 text-white hover:text-secondary hover:bg-white/10 rounded-full transition-colors"
                                    aria-label="Iniciar Sesión"
                                >
                                    <UserIcon size={22} strokeWidth={2} />
                                </a>
                            )}

                            {/* Dropdown User */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-4 w-64 bg-white shadow-xl border border-gray-100 rounded-md overflow-hidden text-neutral-dark z-[60]"
                                    >
                                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">
                                                CUENTA
                                            </p>
                                            <p className="font-bold text-sm truncate">
                                                {isUser?.name}
                                            </p>
                                        </div>
                                        <div className="p-2 flex flex-col gap-1">
                                            {isCustomer ? (
                                                <>
                                                    <a
                                                        href="/profile"
                                                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 hover:text-secondary transition-colors"
                                                    >
                                                        <UserIcon size={16} />
                                                        <span className="text-xs font-bold tracking-wide">
                                                            Mi Perfil
                                                        </span>
                                                    </a>
                                                    <a
                                                        href="/customer/dashboard"
                                                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 hover:text-secondary transition-colors"
                                                    >
                                                        <ShoppingCart
                                                            size={16}
                                                        />
                                                        <span className="text-xs font-bold tracking-wide">
                                                            Mis Pedidos
                                                        </span>
                                                    </a>
                                                    <a
                                                        href="/account"
                                                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 hover:text-secondary transition-colors"
                                                    >
                                                        <Settings size={16} />
                                                        <span className="text-xs font-bold tracking-wide">
                                                            Ajustes
                                                        </span>
                                                    </a>
                                                </>
                                            ) : (
                                                <a
                                                    href={dashboardUrl}
                                                    className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 hover:text-secondary transition-colors"
                                                >
                                                    <Home size={16} />
                                                    <span className="text-xs font-bold tracking-wide">
                                                        Panel Central
                                                    </span>
                                                </a>
                                            )}
                                            <div className="h-px bg-gray-100 my-1"></div>
                                            <button
                                                onClick={Logout}
                                                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-red-50 hover:text-danger transition-colors text-neutral-dark"
                                            >
                                                <LogOut size={16} />
                                                <span className="text-xs font-bold tracking-wide">
                                                    Cerrar Sesión
                                                </span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed inset-0 bg-white z-[100] flex flex-col md:w-[400px] shadow-2xl border-r border-gray-200"
                    >
                        {/* Mobile Menu Header - Primary colored to match main header */}
                        <div className="flex justify-between items-center p-4 bg-primary text-white shadow-md z-10">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt="Logo"
                                className="h-8 object-contain"
                                onError={(e) => {
                                    e.target.src = "/assets/img/logo-bk.svg";
                                }}
                            />
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="p-2 text-white hover:text-secondary transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
                            <nav className="mb-10">
                                <motion.ul
                                    className="space-y-1"
                                    initial="closed"
                                    animate="open"
                                    variants={{
                                        open: {
                                            transition: {
                                                staggerChildren: 0.1,
                                                delayChildren: 0.1,
                                            },
                                        },
                                        closed: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                staggerDirection: -1,
                                            },
                                        },
                                    }}
                                >
                                    {pages
                                        ?.filter((p) => p.menuable)
                                        .map((page, i) => (
                                            <motion.li
                                                key={i}
                                                variants={{
                                                    open: { opacity: 1, x: 0 },
                                                    closed: {
                                                        opacity: 0,
                                                        x: -20,
                                                    },
                                                }}
                                            >
                                                <a
                                                    href={
                                                        page.pseudo_path ||
                                                        page.path
                                                    }
                                                    className="flex items-center justify-between py-4 border-b border-gray-100 text-xl font-bold uppercase tracking-tight text-neutral-dark hover:text-secondary transition-colors group"
                                                >
                                                    <span>{page.name}</span>
                                                    <ChevronRight
                                                        size={20}
                                                        className="text-gray-300 group-hover:text-secondary transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                                                    />
                                                </a>
                                            </motion.li>
                                        ))}
                                </motion.ul>
                            </nav>

                            <div className="pt-6">
                                <div className="grid grid-cols-1 gap-6 text-neutral-dark">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                                            CONTACTO DIRECTO
                                        </p>
                                        <div className="space-y-4">
                                            {generals
                                                .find(
                                                    (g) =>
                                                        g.correlative ===
                                                        "phone_contact",
                                                )
                                                ?.description?.split(",")
                                                .map((phone, idx) => (
                                                    <a
                                                        key={`phone-${idx}`}
                                                        href={`tel:${phone.trim()}`}
                                                        className="flex items-center gap-3 text-sm font-bold hover:text-secondary transition-colors"
                                                    >
                                                        <Phone
                                                            size={18}
                                                            className="text-gray-400"
                                                        />
                                                        {phone.trim()}
                                                    </a>
                                                ))}
                                            {(
                                                generals.find(
                                                    (g) =>
                                                        g.correlative ===
                                                        "email_contact",
                                                )?.description || ""
                                            )
                                                .split(",")
                                                .filter(Boolean)
                                                .map((email, idx) => (
                                                    <a
                                                        key={`email-${idx}`}
                                                        href={`mailto:${email.trim()}`}
                                                        className="flex items-center gap-3 text-sm hover:text-secondary transition-colors text-gray-600"
                                                    >
                                                        <Mail
                                                            size={18}
                                                            className="text-gray-400"
                                                        />
                                                        {email.trim()}
                                                    </a>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <div className="flex flex-wrap gap-3">
                                        {socials.length > 0
                                            ? socials.map((social, index) => (
                                                  <a
                                                      key={index}
                                                      href={social.link}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="w-10 h-10 bg-gray-50 text-neutral-dark rounded-full flex items-center justify-center transition-all hover:bg-secondary hover:text-white"
                                                      aria-label={social.name}
                                                  >
                                                      <i
                                                          className={
                                                              social.icon
                                                          }
                                                      ></i>
                                                  </a>
                                              ))
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SearchOverlay
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
            <CartModalMiBalon
                modalOpen={cartModalOpen}
                setModalOpen={setCartModalOpen}
                cart={cart}
                setCart={setCart}
                data={data}
            />

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-sm z-[90]"
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default HeaderMiBalon;
