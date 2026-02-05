import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import { Search, ChevronRight, XIcon } from "lucide-react";
import MobileMenuSF from "./Components/MobileMenuSF";
import TopBar from "../TopBar";
import LiveSearchBar from "./Components/LiveSearchBar";
import { motion, AnimatePresence } from "framer-motion";

const HeaderSearchMenuSF = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    headerPosts,
    contacts,
    generals = [],
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState(false);
    const [menuLevel, setMenuLevel] = useState("main"); // main, categories, subcategories
    const [selectedCategory, setSelectedCategory] = useState(null);
    const menuRef = useRef(null);

    // Efecto para controlar el overflow del body
    useEffect(() => {
        if (openMenu) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        // Limpieza al desmontar el componente
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [openMenu]);

    const getContact = (correlative) => {
        return (
            contacts.find((contact) => contact.correlative === correlative)
                ?.description || ""
        );
    };

    const totalCount = cart.reduce((acc, item) => {
        return Number(acc) + Number(item.quantity);
    }, 0);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setMenuLevel("subcategories");
    };

    const handleBackClick = () => {
        if (menuLevel === "subcategories") {
            setMenuLevel("categories");
        } else if (menuLevel === "categories") {
            setMenuLevel("main");
        }
    };

    const handleMainMenuItemClick = (itemId) => {
        if (itemId === "categories") {
            setMenuLevel("categories");
        }
    };

    const renderMenuItems = () => {
        if (menuLevel === "main") {
            return (
                <nav className="space-y-1">
                    <div className="pb-2 border-b border-gray-100">
                        <button
                            className="w-full text-left py-3 px-2 text-lg font-semibold text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-300 flex justify-between items-center"
                            onClick={() =>
                                handleMainMenuItemClick("categories")
                            }
                        >
                            <span>Categorías</span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {pages.map(
                        (page, index) =>
                            page.menuable &&
                            (page.name !== "Blogs" ||
                                headerPosts.length > 0) && (
                                <div key={index} className="py-1">
                                    <a
                                        href={page.path}
                                        className="block py-3 px-2 text-lg font-medium text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-300"
                                        onClick={() => setOpenMenu(false)}
                                    >
                                        {page.name}
                                    </a>
                                </div>
                            ),
                    )}
                </nav>
            );
        } else if (menuLevel === "categories") {
            return (
                <div className="space-y-1">
                    <div className="pb-4 border-b border-gray-100 mb-4">
                        <button
                            onClick={handleBackClick}
                            className="flex items-center gap-2 py-2 px-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            <h3 className="text-lg font-semibold text-gray-800 px-2">
                                Categorías
                            </h3>
                        </button>
                    </div>
                    <div className="h-80 max-h-80 overflow-y-auto">
                        {items && items.length > 0 ? (
                            items.map((category) => (
                                <div key={category.id} className="py-1">
                                    <div className="flex  items-center justify-between py-3 px-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-300">
                                        <a
                                            href={`/catalogo?category=${category.slug}`}
                                            className="flex-1"
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            {category.name}
                                        </a>
                                        {category.subcategories &&
                                            category.subcategories.length >
                                                0 && (
                                                <button
                                                    onClick={() =>
                                                        handleCategoryClick(
                                                            category.name,
                                                        )
                                                    }
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-4 text-center text-gray-500">
                                No hay categorías disponibles
                            </div>
                        )}
                    </div>
                </div>
            );
        } else if (menuLevel === "subcategories" && selectedCategory) {
            const selectedSubcategory = items.find(
                (category) => category.name === selectedCategory,
            );

            return (
                <div className="space-y-1">
                    <div className="pb-4 border-b border-gray-100 mb-4">
                        <button
                            onClick={handleBackClick}
                            className="flex items-center gap-2 py-2 px-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            Volver a Categorías
                        </button>
                        <h3 className="text-lg font-semibold text-gray-800 px-2">
                            {selectedCategory}
                        </h3>
                    </div>

                    {selectedSubcategory &&
                    selectedSubcategory.subcategories &&
                    selectedSubcategory.subcategories.length > 0 ? (
                        selectedSubcategory.subcategories.map(
                            (subcat, index) => (
                                <div key={index} className="py-1">
                                    <a
                                        href={`/catalogo?subcategory=${subcat.slug}`}
                                        className="block py-3 px-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-300"
                                        onClick={() => setOpenMenu(false)}
                                    >
                                        {subcat.name}
                                    </a>
                                </div>
                            ),
                        )
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            No hay subcategorías disponibles
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <header
            id={data?.element_id || "main-header"}
            className="sticky top-0 w-full z-[50] bg-white font-paragraph"
        >
            {/* TopBar */}
            <TopBar
                data={data}
                which={data?.type_topbar || "TopBarCart"}
                items={generals}
                cart={cart}
                setCart={setCart}
                isUser={isUser}
                pages={pages}
            />

            {/* Navigation Bar */}
            <div className="w-full border-b border-gray-100">
                <div className="flex justify-between w-full px-[5%] py-2 lg:py-4 mx-auto replace-max-w-here 2xl:max-w-7xl 2xl:px-0">
                    <nav className="flex h-[80px] items-center justify-between gap-10 w-full">
                        {/* Mobile hamburger button - Icono más moderno */}
                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            className="lg:hidden flex items-center justify-center bg-primary rounded-xl w-auto h-auto p-2 text-white transition-all duration-300 hover:scale-105"
                            aria-label="Toggle menu"
                        >
                            {!openMenu ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M10 5H20"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4 12H20"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4 19H14"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : (
                                <XIcon className="h-8 w-8" />
                            )}
                        </button>

                        {/* Logo */}
                        <div className="flex justify-center items-center">
                            <a href="/" className="flex items-center gap-2">
                                <img
                                    src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                    alt={Global.APP_NAME}
                                    className="h-20 lg:h-20 object-contain object-center"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/assets/img/logo-bk.svg";
                                    }}
                                />
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center justify-center flex-1">
                            <ul className="flex items-center gap-8 font-gilroy_regular font-semibold text-lg">
                                {pages.map(
                                    (page, index) =>
                                        page.menuable &&
                                        (page.name !== "Blogs" ||
                                            headerPosts.length > 0) && (
                                            <li key={index}>
                                                <a
                                                    href={page.path}
                                                    className="hover:text-primary cursor-pointer transition-all duration-300"
                                                >
                                                    {page.name}
                                                </a>
                                            </li>
                                        ),
                                )}
                            </ul>
                        </nav>

                        {/* Desktop Search */}
                        <div className="hidden lg:flex">
                            <LiveSearchBar
                                search={search}
                                setSearch={setSearch}
                            />
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu con Overlay y Animación */}
            <AnimatePresence>
                {openMenu && (
                    <>
                        {/* Menu Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden bg-white border-b border-gray-200 shadow-xl z-40 relative"
                            ref={menuRef}
                        >
                            <div className="px-[5%] py-6 max-h-[70vh] overflow-y-auto">
                                {/* Mobile Search */}
                                <div className="mb-6">
                                    <LiveSearchBar
                                        search={search}
                                        setSearch={setSearch}
                                    />
                                </div>

                                {/* Mobile Navigation with Categories */}
                                {renderMenuItems()}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
export default HeaderSearchMenuSF;
