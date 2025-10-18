import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, Minus, MessageCircle, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import ItemsRest from "../../../Actions/ItemsRest";
import ProductInfiniteSlider from "../Products/ProductInfiniteSlider";
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
} from '@floating-ui/react';
import General from '../../../Utils/General';

const ProductDetailHuaillys = ({ item, data, setCart, cart, generals }) => {
    const itemsRest = new ItemsRest();
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    const [quantity, setQuantity] = useState(1);
    const [relationsItems, setRelationsItems] = useState([]);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isSpecificationsExpanded, setIsSpecificationsExpanded] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    // Referencias para Swiper
    const mainSwiperRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    // Estados para WhatsApp multi-asesor
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [whatsappAction, setWhatsappAction] = useState('quote'); // 'quote' o 'quote-mobile'

    // Obtener asesores de WhatsApp
    const whatsappAdvisors = General.whatsapp_advisors || [];

    // Configuración de Floating UI para botón desktop
    const { refs, floatingStyles, context } = useFloating({
        open: isAdvisorDropdownOpen && whatsappAction === 'quote',
        onOpenChange: (open) => {
            if (whatsappAction === 'quote') {
                setIsAdvisorDropdownOpen(open);
            }
        },
        placement: 'bottom-start',
        middleware: [
            offset(10),
            flip({
                fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
            }),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    // Configuración de Floating UI para botón mobile
    const { refs: refsMobile, floatingStyles: floatingStylesMobile, context: contextMobile } = useFloating({
        open: isAdvisorDropdownOpen && whatsappAction === 'quote-mobile',
        onOpenChange: (open) => {
            if (whatsappAction === 'quote-mobile') {
                setIsAdvisorDropdownOpen(open);
            }
        },
        placement: 'top-end',
        middleware: [
            offset(10),
            flip({
                fallbackPlacements: ['top-start', 'bottom-end', 'bottom-start'],
            }),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const clickMobile = useClick(contextMobile);
    const dismissMobile = useDismiss(contextMobile);
    const roleMobile = useRole(contextMobile);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

    const { getReferenceProps: getReferencePropsM, getFloatingProps: getFloatingPropsM } = useInteractions([
        clickMobile,
        dismissMobile,
        roleMobile,
    ]);

    // Actualizar vista del producto y cargar relacionados
    useEffect(() => {
        if (item?.id) {
            handleViewUpdate(item);
            productosRelacionados(item);
        }
    }, [item]);

    const handleViewUpdate = async (item) => {
        try {
            const request = { id: item?.id };
            await itemsRest.updateViews(request);
        } catch (error) {
            console.error('Error updating view:', error);
        }
    };

    const productosRelacionados = async (item) => {
        try {
            const request = { id: item?.id };
            const response = await itemsRest.productsRelations(request);

            if (response) {
                const relations = response;
                setRelationsItems(Object.values(relations));
            }
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    };

    // Manejar cambio de cantidad
    const handleChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, Math.min(10, value)));
    };

    // Funciones de WhatsApp multi-asesor
    const handleClickWhatsAppCotizar = (event) => {
        event?.preventDefault();
        event?.stopPropagation();
        setWhatsappAction('quote');

        if (whatsappAdvisors.length === 1) {
            const advisor = whatsappAdvisors[0];
            const message = encodeURIComponent(
                `¡Hola! Me gustaría hacer mi pedido de este producto:\n\n` +
                `📦 Producto: ${item?.name}\n` +
                `🔢 SKU: ${item?.sku}\n` +
                `📊 Cantidad: ${quantity}\n\n` +
                `¿Podrían enviarme más información?`
            );
            window.open(`https://wa.me/${advisor.phone}?text=${message}`, '_blank');
        } else if (whatsappAdvisors.length > 1) {
            setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen);
        }
    };

    const handleClickWhatsAppCotizarMobile = (event) => {
        event?.preventDefault();
        event?.stopPropagation();
        setWhatsappAction('quote-mobile');

        if (whatsappAdvisors.length === 1) {
            const advisor = whatsappAdvisors[0];
            const message = encodeURIComponent(
                `¡Hola! Me gustaría hacer mi pedido de este producto:\n\n` +
                `📦 Producto: ${item?.name}\n` +
                `🔢 SKU: ${item?.sku}\n` +
                `📊 Cantidad: ${quantity}\n\n` +
                `¿Podrían enviarme más información?`
            );
            window.open(`https://wa.me/${advisor.phone}?text=${message}`, '_blank');
        } else if (whatsappAdvisors.length > 1) {
            setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen);
        }
    };

    const handleAdvisorSelect = (advisor) => {
        const message = encodeURIComponent(
            `¡Hola! Me gustaría hacer mi pedido de este producto:\n\n` +
            `📦 Producto: ${item?.name}\n` +
            `🔢 SKU: ${item?.sku}\n` +
            `📊 Cantidad: ${quantity}\n\n` +
            `¿Podrían enviarme más información?`
        );

        window.open(`https://wa.me/${advisor.phone}?text=${message}`, '_blank');
        setIsAdvisorDropdownOpen(false);
    };

    // Formatear precio
    const formatPrice = (price) => {
        if (!price) return 'Consultar precio';
        return `S/. ${parseFloat(price).toFixed(2)}`;
    };

    // Calcular descuento
    const hasDiscount = item?.price && item?.final_price && parseFloat(item.price) > parseFloat(item.final_price);
    const discountPercentage = hasDiscount
        ? Math.round(((parseFloat(item.price) - parseFloat(item.final_price)) / parseFloat(item.price)) * 100)
        : 0;

    // Preparar imágenes para galería
    const allImages = [
        { url: item?.image, type: 'main', alt: 'Imagen principal' },
        ...(item?.images || []).filter((image, index, self) =>
            index === self.findIndex((img) => img.url === image.url)
        ).map((img, index) => ({
            url: img.url,
            type: 'gallery',
            index,
            alt: `Imagen ${index + 1}`
        }))
    ];

    return (
        <div className="bg-white min-h-screen font-paragraph">
            {/* Versión Mobile */}
            <div className="md:hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white shadow-sm z-20">
                    <div className="flex items-center p-4 gap-4 border-b">
                        <button onClick={() => window.history.back()} className="text-gray-600">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-lg font-bold flex-1 line-clamp-2 customtext-neutral-dark">{item?.name}</h1>
                    </div>
                </div>

                {/* Contenido Principal Mobile */}
                <div className="p-4 ">
                    {/* Carrusel Principal */}
                    <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                prevEl: navigationPrevRef.current,
                                nextEl: navigationNextRef.current,
                            }}
                            loop={allImages.length > 1}
                            onSwiper={(swiper) => {
                                mainSwiperRef.current = swiper;
                            }}
                            className="h-full"
                        >
                            {allImages.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img
                                            src={`/storage/images/item/${img.url || img}`}
                                            alt={img.alt}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Botones de navegación */}
                        {allImages.length > 1 && (
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
                        )}
                    </div>

                    {/* Información del Producto Mobile */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
                        <h2 className="text-4xl font-title  customtext-neutral-dark mb-2">{item?.name}</h2>


                        <div
                            className="prose max-w-none text-lg customtext-neutral-dark mb-4"
                            dangerouslySetInnerHTML={{ __html: item?.description }}
                        />

                        {/* Precio */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-3xl font-bold customtext-primary">
                                    {formatPrice(item?.final_price || item?.price)}
                                </div>
                                {hasDiscount && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm line-through text-gray-400">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {hasDiscount && (
                                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    -{discountPercentage}% OFF
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Especificaciones Mobile */}
                    {item?.specifications && item.specifications.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                            <button
                                onClick={() => setIsSpecificationsExpanded(!isSpecificationsExpanded)}
                                className="w-full p-4 flex justify-between items-center border-b"
                            >
                                <span className="font-medium customtext-neutral-dark">Detalle de producto</span>
                                <ChevronDown
                                    className={`transform transition-transform ${isSpecificationsExpanded ? "rotate-180" : ""}`}
                                />
                            </button>
                            {isSpecificationsExpanded && (
                                <div className="p-4">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {item.specifications.map((spec, i) => (
                                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                                                    <td className="py-2 px-3 font-semibold customtext-neutral-dark">{spec.title}</td>
                                                    <td className="py-2 px-3 text-gray-600">{spec.description || spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}


                </div>

                {/* Bottom Navigation Mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
                    <div className="flex gap-3 items-center">
                        {/* Selector de Cantidad */}
                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center"
                                disabled={quantity <= 1}
                            >
                                <Minus size={16} />
                            </button>
                            <div className="w-12 h-10 flex items-center justify-center">
                                <span className="font-bold">{quantity}</span>
                            </div>
                            <button
                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                className="w-10 h-10 flex items-center justify-center"
                                disabled={quantity >= 10}
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Botón Cotizar */}
                        <button
                            ref={refsMobile.setReference}
                            {...getReferencePropsM()}
                            onClick={(event) => handleClickWhatsAppCotizarMobile(event)}
                            className="flex-1 bg-primary text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="800px" height="800px" viewBox="0 0 32 32" version="1.1">
                                <title>whatsapp</title>
                                <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
                            </svg>
                            Hacer mi pedido
                        </button>
                    </div>
                </div>
            </div>

            {/* Versión Desktop */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Galería de Imágenes Desktop */}
                    <div className="space-y-4">
                        {/* Imagen Principal */}
                        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="aspect-square flex items-center justify-center ">
                                <img
                                    src={selectedImage.url ? `/storage/images/item/${selectedImage.url}` : '/api/cover/thumbnail/null'}
                                    alt={item?.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/api/cover/thumbnail/null';
                                    }}
                                />
                            </div>

                            {/* Badge de descuento */}
                            {hasDiscount && (
                                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                    -{discountPercentage}% OFF
                                </div>
                            )}
                        </div>

                        {/* Miniaturas */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${selectedImage.url === img.url ? 'border-primary scale-105' : 'border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={`/storage/images/item/${img.url}`}
                                            alt={img.alt}
                                            className="w-full h-full object-cover "
                                            onError={(e) => {
                                                e.target.src = '/api/cover/thumbnail/null';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información del Producto Desktop */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>

                            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-title font-bold customtext-neutral-dark mb-4">
                                {item?.name}
                            </h1>
                        </div>


                        <div className="prose prose-lg max-w-none customtext-neutral-dark" dangerouslySetInnerHTML={{ __html: item?.description || item?.summary }} />



                        {/* Precio Desktop */}
                        <div className="">
                            {hasDiscount && (
                                <div className="text-base customtext-neutral-dark font-semibold mb-2">
                                    Precio: <span className="line-through">{formatPrice(item.price)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <div className="text-4xl lg:text-5xl font-bold customtext-primary">
                                    {formatPrice(item?.final_price || item?.price)}
                                </div>
                                {hasDiscount && (
                                    <div className="bg-red-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                                        -{discountPercentage}%
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Especificaciones Principales */}
                        {item?.specifications && item.specifications.length > 0 && (
                            <div className="bg-secondary rounded-xl p-6">
                                <h3 className="font-bold text-xl customtext-neutral-dark mb-4">
                                    Detalle de producto
                                </h3>
                                <div className="space-y-2">
                                    {item.specifications.slice(0, 5).map((spec, index) => (
                                        <div key={index} className="flex items-start gap-3 text-sm">
                                            <div className="min-w-2 min-h-2 max-w-2 max-h-2 rounded-full bg-primary mt-2"></div>
                                            <div>
                                                <span className="font-bold customtext-neutral-dark">{spec.title}: </span>
                                                <span className="customtext-neutral-light">{spec.description || spec.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {item.specifications.length > 5 && (
                                    <button
                                        onClick={() => setIsSpecificationsExpanded(!isSpecificationsExpanded)}
                                        className="mt-4 customtext-primary font-semibold hover:underline flex items-center gap-2"
                                    >
                                        {isSpecificationsExpanded ? 'Ver menos' : 'Ver todas las especificaciones'}
                                        <ChevronDown className={`transform transition-transform ${isSpecificationsExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Selector de Cantidad Desktop */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="font-bold customtext-neutral-dark text-lg">Cantidad:</span>
                                <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="customtext-neutral-dark" size={20} />
                                    </button>
                                    <div className="w-16 h-12 flex items-center justify-center">
                                        <span className="customtext-neutral-dark font-bold text-xl">{quantity}</span>
                                    </div>
                                    <button
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                                        disabled={quantity >= 10}
                                    >
                                        <Plus className="customtext-neutral-dark" size={20} />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">Máximo 10 unidades</span>
                            </div>
                        </div>

                        {/* Botón Cotizar Desktop */}
                        <button
                            ref={refs.setReference}
                            {...getReferenceProps()}
                            onClick={(event) => handleClickWhatsAppCotizar(event)}
                            className="w-full bg-primary text-white py-4 px-6 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="800px" height="800px" viewBox="0 0 32 32" version="1.1">
                                <title>whatsapp</title>
                                <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
                            </svg>
                            Hacer mi pedido
                        </button>

                    </div>
                </div>




            </div>

            {/* Productos Relacionados */}
            {relationsItems && relationsItems.length > 0 && (
                <div className="mt-12 ">
                    <ProductInfiniteSlider
                        items={relationsItems}
                        data={{
                            title: "Productos Relacionados",
                            description: "Otros productos que podrían interesarte",
                            link_catalog: `/catalogo?category=${item?.category?.slug}`,
                            link_text: "Ver productos relacionados",
                            button_text: "Ordenar aquí"
                        }}
                        cart={cart}
                        setCart={setCart}
                    />
                </div>
            )}

            {/* Dropdown de Selección de Asesores */}
            {isAdvisorDropdownOpen && whatsappAdvisors.length > 1 && (
                <FloatingFocusManager 
                    context={whatsappAction === 'quote-mobile' ? contextMobile : context} 
                    modal={false}
                >
                    <div
                        ref={whatsappAction === 'quote-mobile' ? refsMobile.setFloating : refs.setFloating}
                        style={whatsappAction === 'quote-mobile' ? floatingStylesMobile : floatingStyles}
                        {...(whatsappAction === 'quote-mobile' ? getFloatingPropsM() : getFloatingProps())}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-[1000]"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white">
                            <h3 className="font-bold text-base">Elige un asesor</h3>
                            <p className="text-xs text-white mt-1">
                                ¿Con quién quieres hacer tu pedido?
                            </p>
                        </div>

                        {/* Lista de asesores */}
                        <div className="max-h-[400px] overflow-y-auto" style={{ minWidth: '280px', maxWidth: '320px' }}>
                            {whatsappAdvisors.map((advisor, index) => (
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
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386"/>
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </FloatingFocusManager>
            )}
        </div>
    );
};

export default ProductDetailHuaillys;
