import { useEffect, useRef, useState } from "react";
import {
    ShoppingCart,
    Store,
    Home,
    Phone,
    CircleUserRound,
    ChevronDown,
    CheckSquare,
    Plus,
    ChevronUp,
    CircleCheckIcon,
    ChevronLeft,
    Share2,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";

import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";
import ProductInfinite from "../Products/ProductInfinite";
import CartModal from "../Components/CartModal";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Grid, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductNavigationSwiperPaani from "../Products/ProductNavigationSwiperPaani";
import ProductBananaLab from "../Products/ProductBananaLab";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import General from "../../../Utils/General";
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    FloatingFocusManager,
} from "@floating-ui/react";



const ProductDetailDental = ({ item, data, setCart, cart, generals, favorites, setFavorites }) => {

    const itemsRest = new ItemsRest();

    // Función para formatear números con separadores de miles
    const formatPrice = (price) => {
        return Number(price).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    const [quantity, setQuantity] = useState(1);
    const handleChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        setQuantity(value);
    };
    /*ESPECIFICACIONES */
    const [isExpanded, setIsExpanded] = useState(false);

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: quantity });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        /*   Swal.fire({
               title: "Producto agregado",
               text: `Se agregó ${product.name} al carrito`,
               icon: "success",
               timer: 1500,
           });*/
        setModalOpen(!modalOpen);
        setTimeout(() => setModalOpen(false), 3000);
    };

    const [relationsItems, setRelationsItems] = useState([]);
    const inCart = cart?.find((x) => x.id == item?.id);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);

            handleViewUpdate(item);
        }
    }, [item]); // Agregar `item` como dependencia
    const handleViewUpdate = async (item) => {
        try {
            const request = {
                id: item?.id,
            };
            const response = await itemsRest.updateViews(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }
        } catch (error) {
            return;
        }
    };


    const productosRelacionados = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                id: item?.id,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.productsRelations(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const relations = response;

            setRelationsItems(Object.values(relations));
        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };

    const [expandedSpecificationMain, setExpanded] = useState(false);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [whatsappAction, setWhatsappAction] = useState(null); // 'consult' o 'quote'

    // Swiper Refs
    const mainSwiperRef = useRef(null);
    const thumbSwiperRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    // Obtener asesores de WhatsApp
    const advisors = General.whatsapp_advisors || [];

    // Floating UI setup para posicionamiento inteligente (botón cotizar)
    const { refs, floatingStyles, context } = useFloating({
        open: isAdvisorDropdownOpen,
        onOpenChange: setIsAdvisorDropdownOpen,
        placement: 'bottom-start',
        middleware: [
            offset(10),
            flip({
                fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
                padding: 8,
            }),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

    // Floating UI setup para el link "clic aquí" (consultas)
    const { 
        refs: refsConsult, 
        floatingStyles: floatingStylesConsult, 
        context: contextConsult 
    } = useFloating({
        open: isAdvisorDropdownOpen && whatsappAction === 'consult',
        onOpenChange: (open) => {
            if (whatsappAction === 'consult') {
                setIsAdvisorDropdownOpen(open);
            }
        },
        placement: 'bottom-start',
        middleware: [
            offset(10),
            flip({
                fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
                padding: 8,
            }),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const clickConsult = useClick(contextConsult);
    const dismissConsult = useDismiss(contextConsult);
    const roleConsult = useRole(contextConsult);

    const { getReferenceProps: getReferencePropsConsult, getFloatingProps: getFloatingPropsConsult } = useInteractions([
        clickConsult,
        dismissConsult,
        roleConsult,
    ]);

    const handleClickWhatsApp = (event) => {
        const message = `¡Hola! Tengo dudas sobre este producto: ${item?.name}`;
        
        if (advisors.length === 0) return;
        
        if (advisors.length === 1) {
            // Un solo asesor, abrir directo
            const advisor = advisors[0];
            window.open(`https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(message)}`, '_blank');
        } else {
            // Múltiples asesores, mostrar dropdown
            setWhatsappAction('consult');
            setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen);
        }
    };

    const handleClickWhatsAppCotizar = (event) => {
        const message = `¡Hola! Me gustaría cotizar este producto: ${item?.name}`;
        
        if (advisors.length === 0) return;
        
        if (advisors.length === 1) {
            // Un solo asesor, abrir directo
            const advisor = advisors[0];
            window.open(`https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(message)}`, '_blank');
        } else {
            // Múltiples asesores, mostrar dropdown
            setWhatsappAction('quote');
            setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen);
        }
    };

    const handleAdvisorSelect = (advisor) => {
        const message = whatsappAction === 'quote' 
            ? `¡Hola! Me gustaría cotizar este producto: ${item?.name}`
            : `¡Hola! Tengo dudas sobre este producto: ${item?.name}`;
        
        window.open(`https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(message)}`, '_blank');
        setIsAdvisorDropdownOpen(false);
    };
    // Animaciones
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    const slideUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // Debug: Verificar el valor de especification_tec
    console.log("data?.especification_tec:", data?.especification_tec);

    return (
        <>
            {/* Versión Mobile */}
            <div className="md:hidden  min-h-screen font-paragraph">
                {/* Header Estilo App */}
                <div className="sticky top-0 bg-white shadow-sm z-20">
                    <div className="flex items-center p-4 gap-4 border-b">
                        {/* <button onClick={() => window.history.back()} className="text-gray-600">
                            <ChevronLeft size={24} />
                        </button>*/}
                        <h1 className="text-lg font-bold flex-1 line-clamp-5">{item?.name}</h1>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="p-4 pb-10">
                    {/* Carrusel Principal */}
                    <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden shadow-lg">
                        <Swiper
                            ref={mainSwiperRef}
                            modules={[Navigation, Pagination]}
                            navigation={{
                                prevEl: navigationPrevRef.current,
                                nextEl: navigationNextRef.current,
                            }}
                            pagination={{
                                clickable: true,
                                renderBullet: (_, className) =>
                                    `<span class="${className} !w-2 !h-2 !bg-white/50 !mx-1"></span>`,
                            }}
                            loop={true}
                            onSwiper={(swiper) => {
                                mainSwiperRef.current = swiper;
                            }}
                            className="h-full"
                        >
                            {[item?.image, ...item?.images]
                                .filter((image, index, self) =>
                                    index === self.findIndex((img) => img?.url === image?.url)
                                )
                                .map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={`/storage/images/item/${img?.url || img}`}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>

                        {/* Botones de navegación */}
                        <div className="absolute top-1/2 w-full flex justify-between px-2 transform -translate-y-1/2 z-10">
                            <button
                                ref={navigationPrevRef}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:scale-110 transition-transform"
                            >
                                <ChevronLeft className="text-gray-800" size={20} />
                            </button>
                            <button
                                ref={navigationNextRef}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:scale-110 transition-transform"
                            >
                                <ChevronRight className="text-gray-800" size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Sección de Precio */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-3xl font-bold customtext-primary">
                                    {CurrencySymbol()} {formatPrice(item?.final_price)}
                                    <span className="ml-2 text-sm line-through text-gray-400">
                                        {CurrencySymbol()} {formatPrice(item?.price)}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">SKU: {item?.sku}</div>
                            </div>
                            <div className="bg-secondary customtext-primary px-3 py-1 rounded-full text-sm">
                                {Number(item?.discount_percent).toFixed(0)}% OFF
                            </div>
                        </div>
                    </div>



                    {/* Acordeones */}
                    <div className="space-y-2">


                        {/* Descripción */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="border-b">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="w-full p-4 flex justify-between items-center"
                                >
                                    <span className="font-medium">Descripción del producto</span>
                                    <ChevronDown
                                        className={`transform transition-transform ${isExpanded ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                            </div>
                            {isExpanded && (
                                <div className="p-4">
                                    <div dangerouslySetInnerHTML={{ __html: item?.description }} />
                                    <ul className="list-disc pl-5 mt-2">
                                        {item?.features?.map((feature, i) => (
                                            <li key={i} className="text-sm">{feature.feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        {/* Especificaciones */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="border-b">
                                <button
                                    onClick={() => setExpanded(!expandedSpecificationMain)}
                                    className="w-full p-4 flex justify-between items-center"
                                >
                                    <span className="font-medium">Características</span>
                                    <ChevronDown
                                        className={`transform transition-transform ${expandedSpecificationMain ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                            </div>
                            {expandedSpecificationMain && (
                                <div className="p-4">
                                    {item?.features.map((spec, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm mb-2">
                                            <CheckCircle2 className="min-w-4 min-h-4 max-w-4 max-h-4 mt-0.5 customtext-primary" />
                                            <span>{spec.feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>


                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[99]">
                    <div className="p-4 flex gap-4">
                        <button 
                            ref={refs.setReference}
                            {...getReferenceProps()}
                            onClick={(event) => { handleClickWhatsAppCotizar(event); }} 
                            className="flex-1 bg-primary text-white py-3 rounded-full font-medium active:scale-95 transition-transform"
                        >
                            Quiero Cotizar
                        </button>

                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto py-12  hidden md:block font-paragraph">
                <div className="bg-white rounded-xl  ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Images and Delivery Options */}
                        <div className="space-y-6">


                            {/* Product Images */}
                            <div className="flex gap-6">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() =>
                                            setSelectedImage({
                                                url: item?.image,
                                                type: "main",
                                            })
                                        }
                                        className={`w-16 h-16  rounded-xl p-2 border-2 ${selectedImage.url === item?.image
                                            ? "border-primary "
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <img
                                            src={`/storage/images/item/${item?.image}`}
                                            alt={item?.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </button>
                                    {item?.images.filter((image, index, self) =>
                                        index === self.findIndex((img) => img.url === image.url) // Filtra duplicados
                                    ).map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage({
                                                    url: image.url,
                                                    type: "gallery",
                                                })
                                            }
                                            className={`w-16 h-16 border-2 rounded-xl p-2 ${selectedImage.url === image.url
                                                ? "border-primary"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${image.url}`}
                                                alt={`${item?.name} Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1">
                                    <img
                                        src={
                                            selectedImage.type === "main"
                                                ? `/storage/images/item/${selectedImage?.url}`
                                                : `/storage/images/item/${selectedImage?.url}`
                                        }
                                        onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                        }
                                        alt={item?.name}
                                        className="w-full min-h-[600px] max-h-[600px] rounded-xl object-cover"
                                    />
                                </div>
                            </div>


                            <div className="flex lg:hidden gap-8 border-b-2 pb-8">
                                {/* Price Section */}
                                <div className=" w-full ">
                                    {item?.discount > 0 && item?.discount < item?.price && (
                                        <p className="text-sm customtext-primary mb-1">
                                            Precio:{" "}
                                            <span className="line-through line-clamp-1">
                                                {CurrencySymbol()} {formatPrice(item?.price)}
                                            </span>
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 ">
                                        <span className="text-[40px] font-bold line-clamp-1">
                                            {CurrencySymbol()} {formatPrice(item?.final_price)}
                                        </span>
                                        {item?.discount > 0 && item?.discount < item?.price && (
                                            <span className="bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl">
                                                -
                                                {Number(
                                                    item?.discount_percent
                                                ).toFixed(1)}
                                                %
                                            </span>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div className="mt-4">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center space-x-4 customtext-primary text-sm">
                                                <span className="">
                                                    Cantidad
                                                </span>
                                                <div className="relative flex items-center border rounded-md px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={quantity}
                                                        onChange={handleChange}
                                                        min="1"
                                                        max="10"
                                                        className="w-10 py-1 customtext-neutral-dark text-center bg-transparent outline-none appearance-none"
                                                    />
                                                </div>
                                                <span className="">
                                                    Máximo 10 unidades.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={() => {
                                            onAddClicked(item);

                                        }}
                                        className="w-full bg-primary text-white py-3 font-bold shadow-lg rounded-xl hover:opacity-90 transition-all duration-300 mt-4"
                                    >
                                        Quiero Cotizar
                                    </button>
                                </div>
                            </div>

                            {/* Specifications - Mobile */}
                            <div className="block lg:hidden flex-1 w-full ">
                                <div className="bg-[#F7F9FB] rounded-lg p-6">
                                    <h3 className="font-medium text-sm mb-4">
                                        Especificaciones principales
                                    </h3>
                                    <ul
                                        className={`space-y-2  customtext-primary mb-4 transition-all duration-300 ${expandedSpecificationMain
                                            ? "max-h-full"
                                            : "max-h-24 overflow-hidden"
                                            }`}
                                        style={{ listStyleType: "disc" }}
                                    >
                                        {item?.specifications.map(
                                            (spec, index) =>
                                                spec.type === "principal" && (
                                                    <li
                                                        key={index}
                                                        className="flex gap-2"
                                                    >
                                                        <CircleCheckIcon className="customtext-primary" />
                                                        {spec.description}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                    <button
                                        className="customtext-primary text-sm font-semibold hover:underline flex items-center gap-1 transition-all duration-300"
                                        onClick={() =>
                                            setExpanded(
                                                !expandedSpecificationMain
                                            )
                                        }
                                    >
                                        {expandedSpecificationMain
                                            ? "Ver menos"
                                            : "Ver más especificaciones"}
                                        {expandedSpecificationMain ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Especificaciones Técnicas - Solo en Desktop si data?.especification_tec === "left" */}
                            {data?.especification_tec === "left" && (
                                <div className="hidden lg:block flex-1 w-full">
                                    <div className="bg-gray-100 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-4 customtext-neutral-dark">
                                            Especificaciones Técnicas
                                        </h3>
                                        <ul
                                            className="space-y-2 customtext-primary mb-4 transition-all duration-300 max-h-full overflow-hidden"
                                            style={{ listStyleType: "disc" }}
                                        >
                                            {item?.specifications.filter(spec => spec.type === "general").length > 0 ? (
                                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                                <th className="px-4 py-3 text-left text-sm font-semibold customtext-neutral-dark w-1/3">
                                                                    Especificación
                                                                </th>
                                                                <th className="px-4 py-3 text-left text-sm font-semibold customtext-neutral-dark w-2/3">
                                                                    Detalle
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item?.specifications.map(
                                                                (spec, index) =>
                                                                    spec.type === "general" && (
                                                                        <tr
                                                                            key={index}
                                                                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                                                                        >
                                                                            <td className="px-4 py-3 text-sm font-medium customtext-neutral-dark align-top">
                                                                                {spec?.title || "Característica"}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm customtext-primary">
                                                                                {spec?.description}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p className="text-sm">No hay especificaciones técnicas disponibles</p>
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}





                        </div>

                        {/* Right Column - Product Info */}
                        <div className="hidden md:block font-paragraph">
                            {/* Brand and Title */}
                            <div className="mb-4">

                                {/* SKU and Availability */}
                                <div className="font-paragraph flex customtext-primary items-center gap-8 text-sm mb-6">


                                    <span className="customtext-primary text-sm">
                                        SKU:{" "}
                                        <span className="customtext-neutral-dark font-medium">
                                            {item?.sku}
                                        </span>
                                    </span>
                                    <span className="ustomtext-neutral-light text-sm">
                                        Disponibilidad:{" "}
                                        <span className="customtext-neutral-dark  font-medium">
                                            {item?.stock > 0
                                                ? "En stock"
                                                : "Agotado"}
                                        </span>
                                    </span>
                                </div>

                                <h1 className="customtext-neutral-dark text-[60px] font-title font-bold mt-2">
                                    {item?.name}
                                </h1>
                            </div>


                            <div className="flex flex-col gap-8 pb-8">
                                {/* Price Section */}
                                <div className=" w-full ">
                                    <div className="flex gap-8">
                                        <div>
                                            {item?.discount > 0 && item?.discount < item?.price && (
                                                <p className="text-sm customtext-primary mb-1 font-bold">
                                                    Precio:{" "}
                                                    <span className="line-through">
                                                        {CurrencySymbol()} {formatPrice(item?.price)}
                                                    </span>
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 relative customtext-neutral-dark font-extrabold">
                                                <span className="text-[40px] font-bold ">
                                                    {CurrencySymbol()} {formatPrice(item?.final_price)}
                                                </span>

                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            {item?.discount > 0 && item?.discount < item?.price && (
                                                <span className=" bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl">
                                                    -
                                                    {Number(
                                                        item?.discount_percent
                                                    ).toFixed(0)}
                                                    %
                                                </span>)}
                                        </div>
                                    </div>



                                </div>
                                {/* */}
                             
                                    {data?.badge_category && (
 <p className="customtext-primary text-sm">
                                        Categoría:{" "}
                                        <span className="customtext-neutral-dark font-medium">
                                            {item?.category?.name}
                                        </span>
                                    </p>
                                    )}
                                   {data?.badge_brand && (    <p className="customtext-primary text-sm">
                                        Marca:{" "}
                                        <span className="customtext-neutral-dark font-medium">
                                            {item?.brand?.name}
                                        </span>
                                    </p>
)
                                   }

                                
                            
                                {/* Descripción */}
                                {item?.description && (
                                    <> <h3 className="text-xl font-semibold customtext-neutral-dark mb-4">
                                    Descripción
                                </h3>
                                <div
                                    className="customtext-neutral-dark"
                                    dangerouslySetInnerHTML={{
                                        __html: item?.description,
                                    }}
                                ></div></>)}
                               
                                {/* Características - Siempre visible */}
                                <div className="flex-1 w-full ">
                                    <div className="bg-secondary rounded-xl p-6">
                                        <h3 className="font-bold text-lg mb-4 customtext-neutral-dark">
                                            Características
                                        </h3>
                                        <ul
                                            className={`space-y-2  customtext-primary mb-4 transition-all duration-300 ${expandedSpecificationMain
                                                ? "max-h-full"
                                                : "max-h-full overflow-hidden"
                                                }`}
                                            style={{ listStyleType: "disc" }}
                                        >
                                            {item?.specifications.map(
                                                (spec, index) =>
                                                    spec.type ===
                                                    "principal" && (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <CircleCheckIcon className="customtext-primary min-h-4 min-w-4 max-h-4 max-w-4 mt-1" />



                                                            {spec?.description}

                                                        </li>
                                                    )
                                            )}

                                        </ul>

                                    </div>
                                </div>

                                {/* Especificaciones Técnicas - Solo si NO es "left" */}
                                {data?.especification_tec !== "left" && (
                                    <div className="flex-1 w-full ">
                                        <div className="bg-gray-100 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-4 customtext-neutral-dark">
                                            Especificaciones Técnicas
                                        </h3>
                                        <ul
                                            className={`space-y-2  customtext-primary mb-4 transition-all duration-300 ${expandedSpecificationMain
                                                ? "max-h-full"
                                                : "max-h-full overflow-hidden"
                                                }`}
                                            style={{ listStyleType: "disc" }}
                                        >

                                            {item?.specifications.filter(spec => spec.type === "general").length > 0 ? (
                                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                                <th className="px-4 py-3 text-left text-sm font-semibold customtext-neutral-dark w-1/3">
                                                                    Especificación
                                                                </th>
                                                                <th className="px-4 py-3 text-left text-sm font-semibold customtext-neutral-dark w-2/3">
                                                                    Detalle
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item?.specifications.map(
                                                                (spec, index) =>
                                                                    spec.type === "general" && (
                                                                        <tr
                                                                            key={index}
                                                                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                                                                        >
                                                                            <td className="px-4 py-3 text-sm font-medium customtext-neutral-dark align-top">
                                                                                {spec?.title || "Característica"}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm customtext-primary">
                                                                                {spec?.description}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p className="text-sm">No hay especificaciones técnicas disponibles</p>
                                                </div>
                                            )}
                                        </ul>

                                        </div>
                                    </div>
                                )}

                                {/* Add to Cart */}
                                <button
                                    ref={refs.setReference}
                                    {...getReferenceProps()}
                                    onClick={(event) => {
                                        handleClickWhatsAppCotizar(event);
                                    }}
                                    className="w-full bg-primary text-lg text-white py-3 2xl:py-4 font-bold shadow-lg rounded-full hover:opacity-90 transition-all duration-300 mt-4"
                                >
                                    Cotizar este producto
                                </button>

                            </div>
                            {/* Whatsapp */}
                            <motion.div
                                variants={slideUp}
                                className="w-full mt-5"
                            >
                                <motion.div
                                    className="bg-secondary flex flex-row rounded-xl p-5 gap-3"
                                    whileHover={{ y: -2 }}
                                >
                                    <img
                                        src="/assets/img/whatsapp.svg"
                                        onError={(e) =>
                                        (e.target.src =
                                            "assets/img/noimage/no_imagen_circular.png")
                                        }
                                        className="w-12 h-12 object-contain"
                                        loading="lazy"
                                    />
                                    <div className="customtext-neutral-dark cursor-pointer font-paragraph text-base 2xl:text-lg font-semibold">
                                        <p>
                                            ¿Tienes dudas sobre este producto?
                                            Haz{" "}
                                            <a
                                                ref={refsConsult.setReference}
                                                {...getReferencePropsConsult()}
                                                className="underline"
                                                onClick={(event) => handleClickWhatsApp(event)}
                                            >
                                                clic aquí
                                            </a>{" "}
                                            y chatea con nosotros por WhatsApp
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>

                        </div>
                    </div>
                </div>

            </div>
            {relationsItems.length > 0 && (
                <ProductBananaLab
                    data={
                       data}
                    items={relationsItems.slice(0, 4)}
                    cart={cart}
                    setCart={setCart}
                    favorites={favorites}
                    setFavorites={setFavorites}
                    textcolor="customtext-neutral-dark"
                />)}
            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />

            {/* Dropdown de Selección de Asesores */}
            {isAdvisorDropdownOpen && advisors.length > 1 && (
                <FloatingFocusManager context={whatsappAction === 'consult' ? contextConsult : context} modal={false}>
                    <div
                        ref={whatsappAction === 'consult' ? refsConsult.setFloating : refs.setFloating}
                        style={whatsappAction === 'consult' ? floatingStylesConsult : floatingStyles}
                        {...(whatsappAction === 'consult' ? getFloatingPropsConsult() : getFloatingProps())}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-[1000]"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white">
                            <h3 className="font-bold text-base">Elige un asesor</h3>
                            <p className="text-xs text-white  mt-1">
                                {whatsappAction === 'quote' ? '¿Con quién quieres cotizar?' : '¿Con quién quieres hablar?'}
                            </p>
                        </div>

                        {/* Lista de asesores */}
                        <div className="max-h-[400px] overflow-y-auto" style={{ minWidth: '280px', maxWidth: '320px' }}>
                            {advisors.map((advisor, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAdvisorSelect(advisor)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                                >
                                    {/* Foto del asesor */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                                            {advisor.photo ? (
                                                <img
                                                    src={`/assets/resources/${advisor.photo}`}
                                                    alt={advisor.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/assets/img/placeholder-user.png';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-bold">
                                                    {advisor.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info del asesor */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {advisor.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {advisor.position || 'Asesor'}
                                        </p>
                                    </div>

                                    {/* Icono de WhatsApp */}
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </FloatingFocusManager>
            )}
        </>
    );
}
export default ProductDetailDental;