import React, { useState, useEffect, useRef } from "react";
import {
    ShoppingBag,
    Search,
    X,
    Minus,
    Plus,
    User as UserIcon,
    LogOut,
    Settings,
    ChevronRight,
    Mail,
    Phone,
    Home,
    ShoppingCart,
} from "lucide-react";
import Global from "../../../Utils/Global";
import ProfileImage from "./Components/ProfileImage";
import Logout from "../../../Actions/Logout";
import CartModal from "../Components/CartModal";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import Tippy from "@tippyjs/react";
import SocialsRest from "../../../Actions/SocialsRest";
import CartModalRainstar from "../Components/CartModalRainstar";

const SearchOverlay = ({ isOpen, onClose }) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const searchTimeoutRef = useRef(null);
    const suggestionsRef = useRef(null);

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
                <strong key={i} className="text-primary font-black">
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
                    className="fixed inset-0 bg-white backdrop-blur-md z-[100] flex flex-col items-center justify-start pt-32 px-6"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-10 right-10 p-2 hover:rotate-90 transition-transform duration-500"
                    >
                        <X size={32} strokeWidth={1} />
                    </button>

                    <div className="w-full max-w-4xl">
                        <form
                            className="relative group mb-12"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchValue.trim()) {
                                    window.location.href = `/catalogo?search=${encodeURIComponent(searchValue.trim())}`;
                                }
                            }}
                        >
                            <input
                                type="text"
                                placeholder="¿QUÉ ESTÁS BUSCANDO?"
                                className="w-full bg-transparent border-b-[3px] border-black py-8 text-3xl md:text-6xl font-black uppercase tracking-tighter placeholder-gray-200 focus:outline-none transition-colors focus:border-primary"
                                autoFocus
                                value={searchValue}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                            />
                            <button
                                type="submit"
                                className="absolute right-0 bottom-10 text-sm font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors"
                            >
                                Buscar
                            </button>
                        </form>

                        {/* Suggestions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
                            {isLoadingSuggestions ? (
                                <div className="col-span-full py-12 flex items-center justify-center gap-3 text-neutral-light">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        Buscando...
                                    </span>
                                </div>
                            ) : searchSuggestions.length > 0 ? (
                                searchSuggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        onClick={() =>
                                            selectSuggestion(suggestion)
                                        }
                                        className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-all text-left group"
                                    >
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            {suggestion.image ? (
                                                <img
                                                    src={`/api/items/media/${suggestion.image}`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt={suggestion.name}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Search size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-light mb-1">
                                                {suggestion.category?.name ||
                                                    "Producto"}
                                            </p>
                                            <p className="font-black uppercase tracking-tighter truncate text-lg">
                                                {highlightMatches(
                                                    suggestion.name,
                                                    searchValue,
                                                )}
                                            </p>
                                            <p className="text-primary font-bold">
                                                {CurrencySymbol()}{" "}
                                                {Number(
                                                    suggestion.final_price,
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : searchValue.length >= 2 ? (
                                <div className="col-span-full py-12 text-center text-neutral-light">
                                    <p className="text-xs font-bold uppercase tracking-widest">
                                        No se encontraron resultados
                                    </p>
                                </div>
                            ) : (
                                <div className="col-span-full hidden">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-light mb-8 italic">
                                        Explora Tendencias:
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            "Nuevos",
                                            "Ofertas",
                                            "Best Sellers",
                                            "Premium",
                                        ].map((tag) => (
                                            <a
                                                key={tag}
                                                href={`/catalogo?search=${tag}`}
                                                className="px-6 py-3 rounded-full border border-gray-100 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                            >
                                                {tag}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const HeaderSticky = ({
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
        const handleScroll = () => setIsFixed(window.scrollY > 20);
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
            !roleNames.includes("provider");

        if (roleNames.includes("provider")) {
            dashboardUrl = "/provider/home";
        }
    }

    return (
        <>
            <header
                id={data?.element_id || null}
                className={`w-full left-0 z-50 transition-all duration-300 ease-in-out ${
                    isFixed
                        ? "fixed top-0 bg-white shadow-sm py-6 border-b border-gray-100 text-black"
                        : "relative py-6 bg-transparent text-black"
                } ${data?.class || ""}`}
            >
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl  mx-auto  flex items-center justify-between relative">
                    {/* Menu Trigger */}
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="group flex items-center gap-3 transition-colors"
                        >
                            <div className="flex flex-col gap-1.5 w-6">
                                <span className="h-0.5 w-full bg-current transition-all group-hover:w-4"></span>
                                <span className="h-0.5 w-full bg-current transition-all group-hover:w-6"></span>
                            </div>
                        </button>
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="hidden md:block hover:opacity-100 opacity-70 transition-opacity"
                        >
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Logo Central */}
                    <a
                        href="/"
                        className="absolute left-1/2 -translate-x-1/2 transition-transform duration-500 hover:scale-105"
                    >
                        <img
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            className="h-12 object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/logo-bk.svg";
                            }}
                        />
                    </a>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-6 flex-1">
                        {/* User Section */}
                        <div className="relative" ref={userMenuRef}>
                            {isUser ? (
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-2 group"
                                >
                                    <ProfileImage
                                        uuid={isUser.uuid}
                                        name={isUser.name}
                                        className="w-8 h-8 rounded-full border-2 border-black transition-colors"
                                    />
                                    <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest">
                                        {isUser.name}
                                    </span>
                                </button>
                            ) : (
                                <a
                                    href="/iniciar-sesion"
                                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                                >
                                    <UserIcon size={22} strokeWidth={1.5} />
                                    <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest">
                                        Iniciar Sesión
                                    </span>
                                </a>
                            )}

                            {/* Dropdown User */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-4 w-64 bg-white shadow-2xl rounded-2xl overflow-hidden text-black z-[60]"
                                    >
                                        <div className="p-6 bg-gray-50 border-b border-gray-100 text-center">
                                            <p className="text-[10px] uppercase tracking-widest text-neutral-light font-bold mb-1">
                                                Bienvenido
                                            </p>
                                            <p className="font-black uppercase tracking-tighter truncate">
                                                {isUser?.name}
                                            </p>
                                        </div>
                                        <div className="p-2">
                                            {isCustomer ? (
                                                <>
                                                    <a
                                                        href="/profile"
                                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                                                    >
                                                        <UserIcon
                                                            size={18}
                                                            className="text-neutral-light group-hover:text-black"
                                                        />
                                                        <span className="text-xs font-bold uppercase tracking-widest">
                                                            Mi Perfil
                                                        </span>
                                                    </a>
                                                    <a
                                                        href="/customer/dashboard"
                                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                                                    >
                                                        <ShoppingCart
                                                            size={18}
                                                            className="text-neutral-light group-hover:text-black"
                                                        />
                                                        <span className="text-xs font-bold uppercase tracking-widest">
                                                            Mis Pedidos
                                                        </span>
                                                    </a>
                                                    <a
                                                        href="/account"
                                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                                                    >
                                                        <Settings
                                                            size={18}
                                                            className="text-neutral-light group-hover:text-black"
                                                        />
                                                        <span className="text-xs font-bold uppercase tracking-widest">
                                                            Configuración
                                                        </span>
                                                    </a>
                                                </>
                                            ) : (
                                                <a
                                                    href={dashboardUrl}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                                                >
                                                    <Home
                                                        size={18}
                                                        className="text-neutral-light group-hover:text-black"
                                                    />
                                                    <span className="text-xs font-bold uppercase tracking-widest">
                                                        Dashboard
                                                    </span>
                                                </a>
                                            )}
                                            <button
                                                onClick={Logout}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors group text-red-500"
                                            >
                                                <LogOut size={18} />
                                                <span className="text-xs font-bold uppercase tracking-widest">
                                                    Cerrar Sesión
                                                </span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search Mobile */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="md:hidden"
                        >
                            <Search size={22} strokeWidth={1.5} />
                        </button>

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setCartModalOpen(true)}
                            className="relative group p-1"
                        >
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full bg-black text-white">
                                    {totalCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 200,
                        }}
                        className="fixed inset-0 bg-white z-[100] flex flex-col"
                    >
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-10 right-10 p-2 hover:rotate-90 transition-transform duration-500"
                        >
                            <X size={32} strokeWidth={1} />
                        </button>

                        <div className="px-primary 2xl:px-0 2xl:max-w-7xl w-full  mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 h-full relative">
                            {/* Navigation Section */}
                            <nav className="flex flex-col justify-center">
                                <motion.ul
                                    className="space-y-6"
                                    initial="closed"
                                    animate="open"
                                    variants={{
                                        open: {
                                            transition: {
                                                staggerChildren: 0.1,
                                                delayChildren: 0.2,
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
                                        .filter((p) => p.menuable)
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
                                                    className="relative text-5xl md:text-8xl font-black uppercase tracking-tighter hover:text-primary transition-all inline-block group py-2 overflow-hidden"
                                                >
                                                    <span className="relative z-10">
                                                        {page.name}
                                                    </span>
                                                    {/* Animated Underline Effect */}
                                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-black transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                                                </a>
                                            </motion.li>
                                        ))}
                                </motion.ul>
                            </nav>

                            {/* Information and Social Section */}
                            <div className="hidden md:flex flex-col justify-center border-l border-gray-100 pl-20 h-full">
                                <div className="space-y-16">
                                    {/* Dynamic Info Grid */}
                                    <div className="grid grid-cols-1 gap-12">
                                        <div className="grid grid-cols-2 gap-12">
                                            <div className="group">
                                                <p className="text-sm font-bold uppercase tracking-widest text-neutral-light mb-4 flex items-center gap-2">
                                                    Horarios
                                                </p>
                                                <p className="text-xs text-neutral-light font-bold leading-relaxed whitespace-pre-line group-hover:text-black transition-colors">
                                                    {generals.find(
                                                        (g) =>
                                                            g.correlative ===
                                                            "opening_hours",
                                                    )?.description ||
                                                        "Lunes a Sábado\n9:00 AM - 8:00 PM"}
                                                </p>
                                            </div>

                                            <div className="group">
                                                <p className="text-sm font-bold uppercase tracking-widest text-neutral-light mb-4 flex items-center gap-2">
                                                    Atención Directa
                                                </p>
                                                <div className="space-y-3">
                                                    {(
                                                        generals.find(
                                                            (g) =>
                                                                g.correlative ===
                                                                "email_contact",
                                                        )?.description ||
                                                        "ayuda@rainstarstore.com"
                                                    )
                                                        .split(",")
                                                        .map((email, idx) => (
                                                            <a
                                                                key={`email-${idx}`}
                                                                href={`mailto:${email.trim()}`}
                                                                className="flex items-center gap-3 text-xs text-neutral-light font-bold group-hover:text-black transition-colors hover:text-primary w-fit"
                                                            >
                                                                <Mail
                                                                    size={14}
                                                                    className="text-primary flex-shrink-0"
                                                                />
                                                                {email.trim()}
                                                            </a>
                                                        ))}
                                                    {generals
                                                        .find(
                                                            (g) =>
                                                                g.correlative ===
                                                                "phone_contact",
                                                        )
                                                        ?.description?.split(
                                                            ",",
                                                        )
                                                        .map((phone, idx) => (
                                                            <a
                                                                key={`phone-${idx}`}
                                                                href={`tel:${phone.trim()}`}
                                                                className="flex items-center gap-3 text-xs text-neutral-light font-bold group-hover:text-black transition-colors hover:text-primary w-fit"
                                                            >
                                                                <Phone
                                                                    size={14}
                                                                    className="text-primary flex-shrink-0"
                                                                />
                                                                {phone.trim()}
                                                            </a>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Refined Social Icon Grid */}
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-neutral-light mb-8">
                                            Síguenos en Redes
                                        </p>
                                        <div className="flex flex-wrap gap-6">
                                            {socials.length > 0 ? (
                                                socials.map((social, index) => (
                                                    <Tippy
                                                        key={index}
                                                        content={social.name}
                                                    >
                                                        <div className="relative">
                                                            <a
                                                                href={
                                                                    social.link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-12 h-12 rounded-full  flex items-center justify-center text-xl transition-all duration-300 transform hover:bg-primary hover:text-white hover:scale-110 active:scale-95"
                                                            >
                                                                <i
                                                                    className={
                                                                        social.icon
                                                                    }
                                                                ></i>
                                                            </a>
                                                        </div>
                                                    </Tippy>
                                                ))
                                            ) : (
                                                <div className="flex gap-4">
                                                    <span className="text-[10px] font-bold uppercase border-b border-black pb-1">
                                                        Instagram
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase border-b border-black pb-1">
                                                        Facebook
                                                    </span>
                                                </div>
                                            )}
                                        </div>
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
            <CartModalRainstar
                modalOpen={cartModalOpen}
                setModalOpen={setCartModalOpen}
                cart={cart}
                setCart={setCart}
                data={data}
            />
        </>
    );
};

export default HeaderSticky;
