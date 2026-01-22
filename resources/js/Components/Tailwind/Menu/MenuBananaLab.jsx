import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MenuBananaLab = ({ pages = [], items, data }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
                setOpenCategory(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCategory = (categoryId) => {
        setOpenCategory(openCategory === categoryId ? null : categoryId);
    };

    return (
        <nav id={data?.element_id || null} className="hidden md:block  font-paragraph font-normal text-sm py-4">
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto flex justify-between">
                <ul className="flex items-center gap-6 text-sm" ref={menuRef}>
                   
                {items.map((category) => (
                        <li key={category.id} className="relative py-3 group">
                            <div className="flex items-center gap-1 hover:customtext-primary">
                                <a
                                    href={`/catalogo?category=${category.slug}`}
                                    className=" cursor-pointer transition-all duration-300 pr-2 relative "
                                >
                                    {category.name}
                                </a>
                                {category.subcategories.length > 0 && (
                                    <button 
                                        onClick={() => toggleCategory(category.id)}
                                        className="customtext-netrual-dark hover:text-primary"
                                    >
                                        {openCategory === category.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                )}
                            </div>
                            
                            {/* Submenú de subcategorías */}
                            {openCategory === category.id && category.subcategories.length > 0 && (
                                <div className="absolute z-40 top-full left-0 bg-white shadow-md rounded-md py-2 min-w-[200px]">
                                    <ul className="space-y-2 px-4 py-2">
                                        {category.subcategories.map((subcategory) => (
                                            <li key={subcategory.id}>
                                                <a
                                                    href={`/catalogo?subcategory=${subcategory.slug}`}
                                                    className="customtext-neutral-dark text-sm hover:customtext-primary transition-colors duration-300 cursor-pointer block py-1"
                                                >
                                                    {subcategory.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className=" flex gap-4"><button className="bg-primary  text-white rounded-full px-6 py-3 font-medium">Lo nuevo</button> <button className="bg-primary  text-white rounded-full px-6 py-3 font-medium">Mes del amor</button></div>
            </div>
        </nav>
    );
};
export default MenuBananaLab;
