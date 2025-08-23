import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const MenuScraping = ({ pages = [], items }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const menuRef = useRef(null)

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

        <nav className="bg-secondary font-font-secondary font-normal text-sm" >
            <div className="px-primary mx-auto ">
                <ul className="flex items-center gap-6 text-sm" ref={menuRef}>
                    <li className="relative py-3" >
                        <button className="customtext-neutral-dark flex items-center gap-2 hover:customtext-primary  pr-6 transition-colors duration-300 relative before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-[1px] before:bg-[#262624]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            Categorías
                            {isMenuOpen ?
                                <i className="mdi mdi-chevron-up"></i>
                                :
                                <i className="mdi mdi-chevron-down"></i>}
                        </button>
                        {isMenuOpen && (
                            <div className="absolute z-50 top-12 left-0 bg-white shadow-xl border-t rounded-xl transition-all duration-500 ease-in-out min-w-[900px] w-auto ">
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                        {items.map((category, index) => (
                                            <div key={index}>
                                                <h3 className="customtext-neutral-dark font-bold text-sm mb-3 cursor-pointer hover:customtext-primary transition-colors duration-300 ">{category.name}</h3>
                                                <ul className="space-y-2">
                                                    {category.subcategories.map((item, itemIndex) => (
                                                        <li key={itemIndex}>
                                                            <a href="#" className=" customtext-neutral-dark text-sm hover:customtext-primary transition-colors duration-300 cursor-pointer">
                                                                {item.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                    {pages.map((page, index) => (
                        page.menuable && ( // Simplified conditional rendering
                            <li key={index} className="py-3">
                                <a href={page.path} className="hover:customtext-primary cursor-pointer transition-all duration-300 pr-6 relative before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-[1px] before:bg-[#262624]">
                                    {page.name}
                                </a>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </nav >
    )
}
export default MenuScraping;