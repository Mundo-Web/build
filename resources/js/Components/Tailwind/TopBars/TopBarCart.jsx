import { useContext, useEffect, useRef, useState } from "react";
import General from "../../../Utils/General";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import { CircleUser, DoorClosed, ShoppingCart } from "lucide-react";
import Logout from "../../../Actions/Logout";
import CartModal from "../Components/CartModal";
import { hasRole } from "../../../Utils/CreateReactScript";
import AnimatedCintillo from "../Components/AnimatedCintillo";
import useCintillos from "../../../Hooks/useCintillos";

const TopBarCart = ({ data, cart, setCart, isUser, items }) => {
    const sectionRef = useRef(null);
    const { hasActiveCintillos } = useCintillos();

    useEffect(() => {
        if (sectionRef.current) {
            adjustTextColor(sectionRef.current); // Llama a la función
        }
    }, []);
    const [modalOpen, setModalOpen] = useState(false);

    const totalCount = cart.reduce((acc, item) => {
        return Number(acc) + Number(item.quantity);
    }, 0);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [search, setSearch] = useState("");

    return (
        <section
            ref={sectionRef}
            className="font-semibold text-lg bg-primary text-white font-paragraph"
        >
            <div className="px-[5%] 2xl:max-w-7xl 2xl:px-0 mx-auto replace-max-w-here  py-2 flex flex-wrap justify-end md:justify-between items-center gap-2">
                {/* Solo mostrar el párrafo del cintillo si hay cintillos activos */}
                {hasActiveCintillos && (
                    <p className="hidden md:block">
                        <AnimatedCintillo />
                    </p>
                )}
                <p className="hidden md:block text-xs">{data?.title}</p>

                {/* Account and Cart */}
                <div className="flex items-center gap-4 relative ">
                    {isUser ? (
                        <button
                            className="flex items-center gap-2 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="hidden md:inline">
                                Hola, {isUser.name}
                            </span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.78256 17.1112C6.68218 17.743 3.79706 19.0331 5.55429 20.6474C6.41269 21.436 7.36872 22 8.57068 22H15.4293C16.6313 22 17.5873 21.436 18.4457 20.6474C20.2029 19.0331 17.3178 17.743 16.2174 17.1112C13.6371 15.6296 10.3629 15.6296 7.78256 17.1112Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15.5 10C15.5 11.933 13.933 13.5 12 13.5C10.067 13.5 8.5 11.933 8.5 10C8.5 8.067 10.067 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10Z" stroke="currentColor" stroke-width="1.5" />
                                <path d="M2.854 16C2.30501 14.7664 2 13.401 2 11.9646C2 6.46129 6.47715 2 12 2C17.5228 2 22 6.46129 22 11.9646C22 13.401 21.695 14.7664 21.146 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            </svg>

                        </button>
                    ) : (
                        <a
                            href="/iniciar-sesion"
                            className="flex items-center gap-2 "
                        >
                            <span className="hidden md:inline">
                                Iniciar Sesión
                            </span>
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.78256 17.1112C6.68218 17.743 3.79706 19.0331 5.55429 20.6474C6.41269 21.436 7.36872 22 8.57068 22H15.4293C16.6313 22 17.5873 21.436 18.4457 20.6474C20.2029 19.0331 17.3178 17.743 16.2174 17.1112C13.6371 15.6296 10.3629 15.6296 7.78256 17.1112Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15.5 10C15.5 11.933 13.933 13.5 12 13.5C10.067 13.5 8.5 11.933 8.5 10C8.5 8.067 10.067 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10Z" stroke="currentColor" stroke-width="1.5" />
                                <path d="M2.854 16C2.30501 14.7664 2 13.401 2 11.9646C2 6.46129 6.47715 2 12 2C17.5228 2 22 6.46129 22 11.9646C22 13.401 21.695 14.7664 21.146 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </a>
                    )}
                    {isMenuOpen && (
                        <div className="fixed sm:absolute font-paragraph customtext-primary z-50 top-10 md:top-5 left-1/2 right-0 bg-white shadow-xl border-t rounded-xl transition-all duration-300 ease-in-out w-40 sm:w-40 sm:mt-2 sm:left-auto sm:right-auto">
                            <div className="p-4">
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href={hasRole('Root', 'Admin') ? '/admin/home' : "/customer/dashboard"}
                                            className="flex items-center gap-2 text-sm transition-colors duration-300 cursor-pointer"
                                        >
                                            <CircleUser height="1rem" />
                                            <span>{hasRole('Root', 'Admin') ? 'Dashboard' : 'Mis pedidos'}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            onClick={Logout}
                                            className="flex items-center gap-2 text-sm transition-colors duration-300 cursor-pointer"
                                        >
                                            <DoorClosed
                                                className="customtext-primary"
                                                height="1rem"
                                            />
                                            <span>Cerrar sesión</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2  relative"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.87289 17.0194L2.66933 9.83981C2.48735 8.75428 2.39637 8.21152 2.68773 7.85576C2.9791 7.5 3.51461 7.5 4.58564 7.5H19.4144C20.4854 7.5 21.0209 7.5 21.3123 7.85576C21.6036 8.21152 21.5126 8.75428 21.3307 9.83981L20.1271 17.0194C19.7282 19.3991 19.5287 20.5889 18.7143 21.2945C17.9 22 16.726 22 14.3782 22H9.62182C7.27396 22 6.10003 22 5.28565 21.2945C4.47127 20.5889 4.27181 19.3991 3.87289 17.0194Z" stroke="currentColor" stroke-width="1.5"/>
<path d="M17.5 7.5C17.5 4.46243 15.0376 2 12 2C8.96243 2 6.5 4.46243 6.5 7.5" stroke="currentColor" stroke-width="1.5"/>
</svg>


                        <span className="absolute -right-2 -top-2 inline-flex items-center justify-center w-4 h-4  bg-white customtext-primary rounded-full text-[8px]">
                            {totalCount}
                        </span>
                    </button>
                </div>
            </div>
            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </section>
    );
};

export default TopBarCart;
