import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import {
    CircleUser,
    DoorClosed,
    Search,
    ShoppingCart,
    XIcon,
    User,
    Settings,
    CreditCard,
    Home,
} from "lucide-react";
import CartModalSelector from "../Components/CartModalSelector";
import Logout from "../../../Actions/Logout";
import MobileMenu from "./Components/MobileMenu";
import ProfileImage from "./Components/ProfileImage";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import TopBar from "../TopBar";
import Menu from "../Menu";

// HeaderTwenty: bg-primary, text-white, sin bordes redondeados (estilo Twenty streetwear)
const HeaderTwenty = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    generals = [],
}) => {
    const phoneWhatsappObj = generals.find(
        (item) => item.correlative === "phone_whatsapp"
    );
    const messageWhatsappObj = generals.find(
        (item) => item.correlative === "message_whatsapp"
    );

    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
    const messageWhatsapp = messageWhatsappObj?.description ?? null;

    // Twenty: siempre dark, siempre sin rounded
    const isDark = true;
    const roundedNull = true;

    const [modalOpen, setModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [searchMobile, setSearchMobile] = useState(false);
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const suggestionItemsRef = useRef([]);

    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const mobileSearchInputRef = useRef(null);
    const desktopSearchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const suggestionRefs = useRef([]);

    const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);

    const shouldHideMobileSearch = () => {
        try {
            const currentPath = window.location.pathname || '';
            return ['/cart', '/checkout'].some(route => currentPath.includes(route));
        } catch {
            return false;
        }
    };

    const fetchSearchSuggestions = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setIsLoadingSuggestions(true);
        try {
            const response = await fetch('/api/items/paginate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify({
                    take: 8, skip: 0,
                    filter: [['name', 'contains', query], 'or', ['summary', 'contains', query], 'or', ['description', 'contains', query], 'or', ['sku', 'contains', query]],
                    requireTotalCount: false,
                    with: 'category,brand'
                })
            });
            if (!response.ok) throw new Error('Error en la búsqueda');
            const data = await response.json();
            if (data.status === 200 && Array.isArray(data.data)) {
                setSearchSuggestions(data.data);
                setShowSuggestions(data.data.length > 0);
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        } catch {
            setSearchSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setSelectedSuggestionIndex(-1);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => fetchSearchSuggestions(value), 300);
    };

    const clearSuggestions = () => {
        setShowSuggestions(false);
        setSearchSuggestions([]);
        setSelectedSuggestionIndex(-1);
    };

    const selectSuggestion = (suggestion) => {
        if (!suggestion) return;
        setShowSuggestions(false);
        setSearchMobile(false);
        const url = suggestion.slug ? `/product/${suggestion.slug}` : `/catalogo?search=${encodeURIComponent(suggestion.name)}`;
        window.location.href = url;
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
            if (searchRef.current && !searchRef.current.contains(event.target) && !search.trim()) setSearchMobile(false);
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                !desktopSearchInputRef.current?.contains(event.target) &&
                !mobileSearchInputRef.current?.contains(event.target)) clearSuggestions();
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [search]);

    useEffect(() => {
        const handleScroll = () => setIsFixed(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                if (showSuggestions) clearSuggestions();
                else if (searchMobile) { setSearchMobile(false); setSearch(""); }
            }
        };
        if (searchMobile || showSuggestions) document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [searchMobile, showSuggestions]);

    useEffect(() => {
        return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
    }, []);

    useEffect(() => {
        if (selectedSuggestionIndex >= 0 && suggestionRefs.current[selectedSuggestionIndex] && suggestionsRef.current) {
            suggestionRefs.current[selectedSuggestionIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedSuggestionIndex]);

    const menuVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
        exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
    };

    const menuItems = [
        { icon: <User size={16} />, label: "Mi Perfil", href: "/profile" },
        { icon: <ShoppingCart size={16} />, label: "Mis Pedidos", href: "/customer/dashboard" },
        { icon: <Settings size={16} />, label: "Configuración", href: "/account" },
        { icon: <DoorClosed size={16} />, label: "Cerrar Sesión", onClick: Logout }
    ];

    function scrollToSuggestion(index) {
        const container = suggestionsRef.current;
        const el = suggestionItemsRef.current[index];
        if (!container || !el) return;
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        if (elRect.top < containerRect.top) container.scrollTop -= (containerRect.top - elRect.top);
        else if (elRect.bottom > containerRect.bottom) container.scrollTop += (elRect.bottom - containerRect.bottom);
    }

    const handleKeyDown = (e) => {
        if (!showSuggestions || searchSuggestions.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => { const next = prev < searchSuggestions.length - 1 ? prev + 1 : prev; setTimeout(() => scrollToSuggestion(next), 0); return next; });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => { const next = prev > 0 ? prev - 1 : 0; setTimeout(() => scrollToSuggestion(next), 0); return next; });
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) selectSuggestion(searchSuggestions[selectedSuggestionIndex]);
                else if (search.trim()) handleFormSubmit(e);
                break;
            case 'Escape': setShowSuggestions(false); break;
            default: break;
        }
    };

    const SearchSuggestions = ({ suggestions, isLoading, onSelect, selectedIndex }) => {
        if (!showSuggestions) return null;
        const highlightMatches = (text, searchQuery) => {
            if (!text || !searchQuery) return text;
            const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(w => w.length >= 2);
            const pattern = new RegExp(`(${searchWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
            const parts = text.split(pattern);
            return parts.map((part, index) => {
                const isMatch = searchWords.some(word => part.toLowerCase() === word);
                if (isMatch) return <strong key={index} className="font-bold text-white">{part}</strong>;
                return <span key={index}>{part}</span>;
            });
        };
        return (
            <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 border border-white/20 shadow-lg z-[60] max-h-80 overflow-y-auto mt-1 rounded-none bg-black text-white"
            >
                {isLoading ? (
                    <div className="p-4 text-center text-white/70">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Buscando...
                        </div>
                    </div>
                ) : suggestions.length > 0 ? (
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={suggestion.id} ref={el => suggestionItemsRef.current[index] = el}>
                                <button
                                    data-suggestion-button
                                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setTimeout(() => onSelect(suggestion), 0); }}
                                    className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center gap-3 hover:bg-white/10 ${index === selectedIndex ? 'bg-primary border-l-4 border-white' : ''}`}
                                    type="button"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-white/10">
                                        {suggestion.image ? (
                                            <img src={`/api/items/media/${suggestion.image}`} alt={suggestion.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/40"><Search size={16} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate text-white">{highlightMatches(suggestion.name, search)}</div>
                                        {suggestion.category && <div className="text-sm truncate text-white/60">{suggestion.category.name}</div>}
                                        {suggestion.final_price > 0 && <div className="text-sm font-semibold text-white">{CurrencySymbol()} {parseFloat(suggestion.final_price).toFixed(2)}</div>}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-white/60">No se encontraron productos</div>
                )}
            </motion.div>
        );
    };

    let isCustomer = false;
    let dashboardUrl = '/admin/home';
    if (isUser && Array.isArray(isUser.roles)) {
        const roleNames = isUser.roles.map(r => r.name?.toLowerCase());
        isCustomer = !roleNames.includes('admin') && !roleNames.includes('root') && !roleNames.includes('provider');
        if (roleNames.includes('provider')) dashboardUrl = '/provider/home';
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        clearSuggestions();
        if (search.trim()) window.location.href = `/catalogo?search=${encodeURIComponent(search.trim())}`;
        return false;
    };

    const handleMobileSearch = (event) => {
        event.preventDefault();
        clearSuggestions();
        if (search.trim()) { setSearchMobile(false); window.location.href = `/catalogo?search=${encodeURIComponent(search.trim())}`; }
        return false;
    };

    // Twenty bg: bg-primary siempre
    const bgHeader = data?.backgroundColor || 'bg-primary';

    return (
        <header id={data?.element_id || null} className="relative w-full z-[100]">
            {data?.type_topbar && data.type_topbar !== 'none' && (
                <div className="w-full transition-all duration-300">
                    <TopBar which={data.type_topbar} data={data} items={items} generals={generals} cart={cart} setCart={setCart} isUser={isUser} pages={pages} />
                </div>
            )}

            <div className={`w-full transition-all duration-300 ${isFixed ? 'fixed top-0 left-0 right-0 shadow-lg z-[100]' : 'relative z-[100]'} ${bgHeader}`}>
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 font-paragraph text-white">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 z-[51]">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className={`h-14 object-contain object-center ${data?.class_logo || ""}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/logo-bk.svg"; }}
                            />
                        </a>

                        {data?.showLoginCart && (
                            <div className="flex gap-8 lg:hidden">
                                <div className={`${searchMobile ? "hidden" : "flex"} items-center gap-4`}>
                                    {isUser ? (
                                        <div ref={menuRef} className="relative">
                                            <button aria-label="user" className="flex items-center gap-2 transition-all duration-300 relative group text-white hover:text-white/80" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                                <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                                    {isUser.uuid ? (
                                                        <div className="relative">
                                                            <ProfileImage uuid={isUser.uuid} name={isUser.name} lastname={isUser.lastname} className="!w-6 !h-6 rounded-none object-cover border-2 border-white" classCircleUser="text-white border-white" />
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white border-2 border-primary rounded-full animate-pulse"><div className="w-full h-full bg-white rounded-full animate-ping opacity-75 absolute"></div><div className="w-full h-full bg-white rounded-full"></div></div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <CircleUser className="text-white border-white border-2 rounded-none" width="1.5rem" />
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white border-2 border-primary rounded-full animate-pulse"><div className="w-full h-full bg-white rounded-full animate-ping opacity-75 absolute"></div><div className="w-full h-full bg-white rounded-full"></div></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {isMenuOpen && (
                                                    <motion.div initial="hidden" animate="visible" exit="exit" variants={menuVariants} className="absolute z-50 top-full -left-20 border border-white/20 shadow-xl mt-2 w-48 rounded-none bg-black text-white">
                                                        <div className="p-4">
                                                            <ul className="space-y-3">
                                                                {isCustomer ? (
                                                                    menuItems.map((item, index) => (
                                                                        <li key={index}>
                                                                            {item.onClick ? (
                                                                                <button aria-label="menu-items" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setTimeout(() => item.onClick(), 150); }} className="flex w-full items-center gap-3 text-sm transition-all duration-300 p-2 rounded-none text-white hover:bg-white/10">
                                                                                    {item.icon}<span>{item.label}</span>
                                                                                </button>
                                                                            ) : (
                                                                                <a href={item.href} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-sm transition-all duration-300 p-2 rounded-none text-white hover:bg-white/10">
                                                                                    {item.icon}<span>{item.label}</span>
                                                                                </a>
                                                                            )}
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <>
                                                                        <li><a href={dashboardUrl} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-sm transition-all duration-300 p-2 rounded-none text-white hover:bg-white/10"><Home size={16} /><span>Dashboard</span></a></li>
                                                                        <li><button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setTimeout(() => Logout(), 150); }} className="flex w-full items-center gap-3 text-sm transition-all duration-300 p-2 rounded-none text-white hover:bg-white/10"><DoorClosed size={16} /><span>Cerrar Sesión</span></button></li>
                                                                    </>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <a href="/iniciar-sesion" aria-label={`Iniciar Sesión - ${Global.APP_NAME}`} className="flex items-center text-white">
                                            <CircleUser className="text-white" width="1.5rem" />
                                        </a>
                                    )}

                                    <button aria-label="" onClick={() => setModalOpen(true)} className="flex items-center relative text-white">
                                        <ShoppingCart width="1.5rem" />
                                        <span className="absolute -right-2 -top-2 inline-flex items-center justify-center w-4 h-4 bg-white text-primary rounded-none text-[8px] font-bold">{totalCount}</span>
                                    </button>
                                </div>
                                <button aria-label="Menú" onClick={() => setOpenMenu(!openMenu)} className="flex md:hidden items-center justify-center bg-white/20 border border-white/30 w-auto h-auto p-2 text-white fill-white transition-all duration-300 rounded-none">
                                    {!openMenu ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M10 5H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 12H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 19H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : <XIcon />}
                                </button>
                            </div>
                        )}

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:block relative w-full max-w-xl mx-auto">
                            <form onSubmit={handleFormSubmit} role="search">
                                <input
                                    ref={desktopSearchInputRef}
                                    type="search"
                                    name="search"
                                    placeholder={`${data?.input_search_placeholder || 'Estoy buscando...'}`}
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => { if (search.trim().length >= 2) fetchSearchSuggestions(search); }}
                                    className="w-full pr-14 py-4 pl-4 border font-paragraph font-normal text-sm focus:ring-0 focus:outline-none rounded-none bg-transparent text-white border-white/40 placeholder:text-white/60 focus:border-white"
                                    enterKeyHint="search"
                                    inputMode="search"
                                    autoComplete="on"
                                    role="searchbox"
                                    aria-label={`${data?.input_search_placeholder || 'Estoy buscando...'}`}
                                />
                                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-white hover:scale-105 transition-all duration-300 rounded-none bg-white/20 hover:bg-white/30" aria-label="Buscar">
                                    <Search />
                                </button>
                            </form>
                            <AnimatePresence>
                                <SearchSuggestions suggestions={searchSuggestions} isLoading={isLoadingSuggestions} onSelect={selectSuggestion} selectedIndex={selectedSuggestionIndex} />
                            </AnimatePresence>
                        </div>

                        {/* Account and Cart - Desktop */}
                        {data?.showLoginCart ? (
                            <div className="hidden md:flex items-center gap-4 relative text-sm text-white">
                                <div ref={menuRef}>
                                    {isUser ? (
                                        <button aria-label="user" className="flex items-center gap-2 pr-6 transition-all duration-300 relative group text-white hover:text-white/80" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                            <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                                {isUser.uuid ? (
                                                    <div className="relative">
                                                        <ProfileImage uuid={isUser.uuid} name={isUser.name} lastname={isUser.lastname} className="w-8 h-8 rounded-none object-cover border-2 border-white" classCircleUser="text-white border-white" />
                                                        <div className="absolute -bottom-[-0.115rem] -right-0.5 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full animate-pulse"><div className="w-full h-full bg-white rounded-full animate-ping opacity-75 absolute"></div><div className="w-full h-full bg-white rounded-full"></div></div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <CircleUser className="text-white border-white border-2 rounded-none" />
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full animate-pulse"><div className="w-full h-full bg-white rounded-full animate-ping opacity-75 absolute"></div><div className="w-full h-full bg-white rounded-full"></div></div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="hidden md:inline  text-sm uppercase">{isUser.name}</span>
                                        </button>
                                    ) : (
                                        <a href="/iniciar-sesion" aria-label={`Iniciar Sesión - ${Global.APP_NAME}`} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-300">
                                            <CircleUser className="text-white" />
                                            <span className="hidden md:inline  text-sm uppercase">Iniciar Sesión</span>
                                        </a>
                                    )}

                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div initial="hidden" animate="visible" exit="exit" variants={menuVariants} className="absolute z-[100] top-full left-0 bg-black shadow-xl border border-white/20 rounded-none w-48 mt-2">
                                                <div className="p-4">
                                                    <ul className="space-y-4">
                                                        {isCustomer ? (
                                                            menuItems.map((item, index) => (
                                                                <li key={index}>
                                                                    {item.onClick ? (
                                                                        <button aria-label="menu-items" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setTimeout(() => item.onClick(), 150); }} className="flex w-full items-center gap-3 text-white text-sm hover:bg-white/10 transition-all duration-300 p-2 rounded-none">
                                                                            {item.icon}<span>{item.label}</span>
                                                                        </button>
                                                                    ) : (
                                                                        <a href={item.href} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-white text-sm hover:bg-white/10 transition-all duration-300 p-2 rounded-none">
                                                                            {item.icon}<span>{item.label}</span>
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <li><a href={dashboardUrl} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-white text-sm hover:bg-white/10 transition-all duration-300 p-2 rounded-none"><Home size={16} /><span>Dashboard</span></a></li>
                                                                <li><button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setTimeout(() => Logout(), 150); }} className="flex w-full items-center gap-3 text-white text-sm hover:bg-white/10 transition-all duration-300 p-2 rounded-none"><DoorClosed size={16} /><span>Cerrar Sesión</span></button></li>
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button aria-label="cart" onClick={() => setModalOpen(true)} className="flex items-center gap-2 relative transition-colors duration-300 text-white hover:text-white/80">
                                    <ShoppingCart />
                                    <span className="hidden md:inline  text-sm uppercase">Mi Carrito</span>
                                    <span className="absolute -right-6 -top-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-sans bg-white text-primary rounded-none font-bold">{totalCount}</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <a aria-label="primary-button" className="bg-white text-primary hidden lg:block px-6 py-2.5 font-bold hover:bg-white/90 transition-colors duration-300 rounded-none uppercase  text-sm"
                                    target="_blank" rel="noopener noreferrer"
                                    href={phoneWhatsapp && messageWhatsapp ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneWhatsapp)}&text=${encodeURIComponent(messageWhatsapp)}` : "#"}>
                                    Haz tu pedido
                                </a>
                                <div className="md:hidden relative w-full max-w-xl mx-auto">
                                    {!searchMobile ? (
                                        <button aria-label="Buscar" onClick={() => { setSearchMobile(true); setTimeout(() => { if (mobileSearchInputRef.current) mobileSearchInputRef.current.focus(); }, 100); }} className="flex items-center justify-end w-full px-0 py-3">
                                            <Search className="text-white" size={28} />
                                        </button>
                                    ) : (
                                        <div className="relative w-full">
                                            <form onSubmit={handleMobileSearch} role="search">
                                                <input ref={mobileSearchInputRef} type="search" name="search" placeholder={`${data?.input_search_placeholder || 'Buscar productos'}`} value={search} onChange={(e) => handleSearchChange(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => { if (search.trim().length >= 2) fetchSearchSuggestions(search); }}
                                                    className="w-full pr-14 py-4 pl-4 border focus:ring-0 focus:outline-none rounded-none bg-transparent text-white border-white/40 placeholder:text-white/60 focus:border-white"
                                                    autoFocus enterKeyHint="search" inputMode="search" autoComplete="off" role="searchbox"
                                                    onBlur={() => { setTimeout(() => { if (!search.trim() && !showSuggestions) setSearchMobile(false); }, 200); }}
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                                    <button type="button" onClick={() => { setSearch(""); clearSuggestions(); setSearchMobile(false); }} className="p-2 bg-white/20 text-white rounded-none hover:bg-white/30 transition-colors" aria-label="Cerrar búsqueda"><XIcon size={16} /></button>
                                                    <button type="submit" className="p-2 text-primary bg-white transition-colors rounded-none" aria-label="Buscar"><Search size={16} /></button>
                                                </div>
                                            </form>
                                            <AnimatePresence>
                                                <SearchSuggestions suggestions={searchSuggestions} isLoading={isLoadingSuggestions} onSelect={selectSuggestion} selectedIndex={selectedSuggestionIndex} />
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {data?.mobileSearch && !shouldHideMobileSearch() && (
                        <div className="block md:hidden mt-6 space-y-4">
                            <div className="w-full relative">
                                <form onSubmit={handleMobileSearch} role="search" className="relative w-full">
                                    <input type="search" name="search" placeholder={`${data?.input_search_placeholder || 'Buscar productos'}`} value={search} onChange={(e) => handleSearchChange(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => { if (search.trim().length >= 2) fetchSearchSuggestions(search); }}
                                        className="w-full pr-14 py-3 font-paragraph font-normal pl-4 border focus:ring-0 focus:outline-none rounded-none bg-transparent text-white border-white/40 placeholder:text-white/60"
                                        enterKeyHint="search" inputMode="search" autoComplete="off" role="searchbox"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary bg-white transition-colors rounded-none" aria-label="Buscar"><Search size={18} /></button>
                                </form>
                                <AnimatePresence>
                                    <SearchSuggestions suggestions={searchSuggestions} isLoading={isLoadingSuggestions} onSelect={selectSuggestion} selectedIndex={selectedSuggestionIndex} />
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {openMenu && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="lg:hidden bg-black text-white shadow-lg w-full min-h-screen absolute z-10 top-20">
                            <MobileMenu search={search} setSearch={setSearch} pages={pages} items={items} onClose={() => setOpenMenu(!openMenu)} data={data} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {data?.type_menu && data.type_menu !== 'none' && (
                    <Menu which={data.type_menu} data={data} items={items} generals={generals} cart={cart} setCart={setCart} isUser={isUser} pages={pages} />
                )}
            </div>

            <CartModalSelector
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </header>
    );
};

export default HeaderTwenty;
