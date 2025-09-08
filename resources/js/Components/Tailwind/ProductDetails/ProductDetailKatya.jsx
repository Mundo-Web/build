import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Share2,
    MessageCircle,
    Star,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Plus,
    Minus,
    ShoppingCart,
    Zap,
    Eye,
    Package,
    Truck,
    Shield,
    Award,
    Clock,
    Info,
    CheckCircle2,
    XCircle,
    Quote,
    ZoomIn,
    ZoomOut,
    X,
    CheckCircle
} from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { toast } from "sonner";
import ItemsRest from "../../../Actions/ItemsRest";
import ProductInfinite from "../Products/ProductInfinite";
import ProductMultivet from "../Products/ProductMultivet";

const ProductDetailKatya = ({ item, data, setCart, cart, generals, favorites, setFavorites }) => {
    const itemsRest = new ItemsRest();
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    // Estados para zoom de imagen
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    const [quantity, setQuantity] = useState(1);
    const [relationsItems, setRelationsItems] = useState([]);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isSpecificationsExpanded, setIsSpecificationsExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Referencias para medir contenido
    const descriptionRef = useRef(null);
    const specificationsRef = useRef(null);
    const [needsDescriptionExpand, setNeedsDescriptionExpand] = useState(false);
    const [needsSpecificationsExpand, setNeedsSpecificationsExpand] = useState(false);

    // Modal para imagen ampliada
    const [modalOpen, setModalOpen] = useState(false);

    // Referencias para Swiper
    const mainSwiperRef = useRef(null);
    const thumbSwiperRef = useRef(null);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    // Obtener datos de WhatsApp de generals
    const phone_whatsapp = generals?.find(
        (general) => general.correlative === "phone_whatsapp"
    );

    const numeroWhatsApp = phone_whatsapp?.description;

    // Verificar si está en favoritos
    useEffect(() => {
        if (favorites && item) {
            setIsFavorite(favorites.some(fav => fav.id === item.id));
        }
    }, [favorites, item]);

    // Actualizar vista del producto y cargar relacionados
    useEffect(() => {
        if (item?.id) {
            handleViewUpdate(item);
            productosRelacionados(item);
        }
    }, [item]);

    // Verificar si se necesita expansión de contenido
    useEffect(() => {
        const checkContentExpansion = () => {
            if (descriptionRef.current) {
                const isOverflowing = descriptionRef.current.scrollHeight > 150;
                setNeedsDescriptionExpand(isOverflowing);
            }
            if (specificationsRef.current) {
                const isOverflowing = specificationsRef.current.scrollHeight > 150;
                setNeedsSpecificationsExpand(isOverflowing);
            }
        };

        const timer = setTimeout(checkContentExpansion, 100);
        return () => clearTimeout(timer);
    }, [item, item?.specifications]); // Agregar item.specifications como dependencia

    // Funciones para manejar el zoom
    const handleZoomClick = () => {
        if (isZoomEnabled) {
            setIsZoomEnabled(false);
            setZoomPosition({ x: 50, y: 50 });
        } else {
            setIsZoomEnabled(true);
        }
    };

    const handleMouseDown = (e) => {
        if (isZoomEnabled) {
            setIsDragging(true);
            setLastMousePosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e) => {
        if (isZoomEnabled && !isDragging) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y))
            });
        } else if (isDragging && isZoomEnabled) {
            const deltaX = e.clientX - lastMousePosition.x;
            const deltaY = e.clientY - lastMousePosition.y;

            setZoomPosition(prev => ({
                x: Math.max(0, Math.min(100, prev.x - (deltaX / 3))),
                y: Math.max(0, Math.min(100, prev.y - (deltaY / 3)))
            }));

            setLastMousePosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Eventos globales para drag
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isZoomEnabled, lastMousePosition]);

    const handleViewUpdate = async (item) => {
        try {
            await itemsRest.viewUpdate(item.id);
        } catch (error) {
            console.error('Error updating view:', error);
        }
    };

    const productosRelacionados = async (item) => {
        try {
            console.log('Buscando productos relacionados para item:', item.id);

            // Preparar la solicitud como en ProductDetailB.jsx
            const request = {
                id: item?.id,
            };

            // Llamar al backend para verificar el combo (usando el mismo método que ProductDetailB)
            const response = await itemsRest.productsRelations(request);
            console.log('Respuesta de productos relacionados:', response);

            // Verificar si la respuesta es válida
            if (!response) {
                console.log('No se encontró respuesta de productos relacionados');
                setRelationsItems([]);
                return;
            }

            // Actualizar el estado con los productos asociados (como en ProductDetailB)
            const relations = response;
            const relationsArray = Object.values(relations);

            console.log('Productos relacionados encontrados:', relationsArray);
            setRelationsItems(relationsArray);

        } catch (error) {
            console.error('Error fetching related products:', error);
            setRelationsItems([]);
        }
    };

    // Manejar cambio de cantidad
    const handleChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, value));
    };

    // Funciones de WhatsApp
    const mensajeWhatsAppCotizar = encodeURIComponent(
        `¡Hola! Me gustaría cotizar este producto para mi mascota: ${item?.name}\n\nCantidad: ${quantity} unidades\n\n¿Podrían enviarme más información y precios?`
    );

    const mensajeWhatsAppConsulta = encodeURIComponent(
        `¡Hola! Tengo consultas sobre este producto: ${item?.name}\n\n¿Me pueden ayudar con más información?`
    );

    const linkWhatsAppCotizar = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsAppCotizar}`;
    const linkWhatsAppConsulta = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsAppConsulta}`;

    const handleClickWhatsAppCotizar = () => {
        window.open(linkWhatsAppCotizar, '_blank');
    };

    const handleClickWhatsAppConsulta = () => {
        window.open(linkWhatsAppConsulta, '_blank');
    };

    // Función para agregar al carrito (desde ProductDetailB)
    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product?.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: quantity });
        } else {
            newCart[index].quantity += quantity;
        }
        setCart(newCart);

        // Opcional: Mostrar notificación de éxito
        // Puedes descomentar esto si tienes Swal o una librería de notificaciones
        /*
        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${product?.name} al carrito`,
            icon: "success",
            timer: 1500,
        });
        */

        console.log(`Producto ${product?.name} agregado al carrito con cantidad: ${quantity}`);
    };

    // Manejar favoritos
    const toggleFavorite = () => {
        if (setFavorites && favorites) {
            const newFavorites = isFavorite
                ? favorites.filter(fav => fav.id !== item.id)
                : [...favorites, item];

            setFavorites(newFavorites);
            setIsFavorite(!isFavorite);

            toast.success(
                isFavorite ? "Producto eliminado de favoritos" : "Producto agregado a favoritos",
                {
                    description: item?.name,
                    duration: 2000,
                }
            );
        }
    };

    // Formatear precio
    const formatPrice = (price) => {
        if (!price) return 'Consultar precio';
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(price);
    };

    // Renderizar estrellas
    const renderStars = (rating) => {
        const numRating = parseFloat(rating) || 0;
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(numRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    // Calcular descuento
    const hasDiscount = item?.price && item?.final_price && parseFloat(item.price) > parseFloat(item.final_price);
    const discountPercentage = hasDiscount
        ? Math.round(((parseFloat(item.price) - parseFloat(item.final_price)) / parseFloat(item.price)) * 100)
        : 0;

    // Verificar si el producto está en el carrito
    const inCart = cart?.find((x) => x.id == item?.id);
    const cartQuantity = inCart?.quantity || 0;

    // Preparar imágenes para galería (siguiendo estructura de ProductDetailB)
    const allImages = [
        { url: item?.image, type: 'main', alt: 'Imagen principal' },
        ...(item?.images || []).filter((image, index, self) =>
            index === self.findIndex((img) => img.url === image.url) // Filtra duplicados como en ProductDetailB
        ).map((img, index) => ({
            url: img.url,
            type: 'gallery',
            index,
            alt: `Imagen ${index + 1}`
        }))
    ];

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">


            <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Galería de imágenes */}
                    <div className="space-y-3 lg:space-y-4">
                        {/* Imagen principal */}
                        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                            <div
                                className={`aspect-square flex items-center justify-center p-4 lg:p-8 relative ${isZoomEnabled ? 'cursor-zoom-out' : 'cursor-zoom-in'
                                    }`}
                                onClick={handleZoomClick}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <img
                                    ref={imageRef}
                                    src={selectedImage.url ? `/storage/images/item/${selectedImage.url}` : '/api/cover/thumbnail/null'}
                                    alt={item?.name || 'Producto'}
                                    className={`w-full h-full object-contain transition-transform duration-300 ${isZoomEnabled ? 'scale-150' : 'scale-100'
                                        }`}
                                    style={isZoomEnabled ? {
                                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                    } : {}}
                                    onError={(e) => {
                                        e.target.src = '/api/cover/thumbnail/null';
                                    }}
                                />

                                {/* Indicador de zoom */}
                                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-2 rounded text-sm">
                                    {isZoomEnabled ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 right-4 space-y-2">


                                {item?.is_new && (
                                    <div className="bg-accent customtext-primary px-3 py-2 rounded-full text-sm font-bold">
                                        ¡Nuevo!
                                    </div>
                                )}
                            </div>

                            {/* Botones de acción */}
                            <div className="absolute bottom-4 right-4 flex space-x-2">


                                <button
                                    onClick={() => {
                                        navigator.share?.({
                                            title: item?.name,
                                            text: item?.description,
                                            url: window.location.href
                                        }) || navigator.clipboard.writeText(window.location.href);
                                        toast.success("Enlace copiado al portapapeles");
                                    }}
                                    className="w-10 h-10 bg-secondary  backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                                >
                                    <Share2 className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Miniaturas */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${selectedImage.url === img.url ? 'border-primary' : 'border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={`/storage/images/item/${img.url}`}
                                            alt={img.alt}
                                            className="w-full h-full object-contain p-2"
                                            onError={(e) => {
                                                e.target.src = '/api/cover/thumbnail/null';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Precio Mobile - Debajo de la galería */}
                    <div className="lg:hidden ">
                        <div className="text-start">
                            <div className="text-3xl sm:text-4xl font-bold font-title customtext-neutral-dark">
                                {formatPrice(item?.final_price || item?.price)}
                            </div>
                            {hasDiscount && (
                                <div className="flex items-center justify-start space-x-2 mt-2">
                                    <span className="text-base customtext-neutral-light line-through">
                                        {formatPrice(item.price)}
                                    </span>
                                    <span className="bg-red-100 customtext-secondary px-2 py-1 rounded-full text-xs font-bold">
                                        Ahorras {formatPrice(parseFloat(item.price) - parseFloat(item.final_price))}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
                        {/* Header con categoría y marca */}
                        <div className="flex flex-row text-sm items-center  gap-8">
                            {item?.sku && (
                                <span><span className="font-bold">SKU:</span> {item?.sku}</span>
                            )}
                            {item?.stock && (
                                <span><span className="font-bold">Disponibilidad:</span> {item?.stock > 0 ? 'En stock' : 'Agotado'}</span>
                            )}

                        </div>

                        {/* Título y rating */}
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-5xl font-title font-semibold customtext-neutral-dark mb-3">
                                {item?.name}
                            </h1>

                            <div className="flex items-center space-x-4 mb-4">
                                {item?.rating && (
                                    <div className="flex items-center space-x-1">
                                        {renderStars(item.rating)}
                                        <span className="text-sm text-gray-600 ml-2">
                                            ({parseFloat(item.rating).toFixed(1)})
                                        </span>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Precio - Desktop */}
                        <div className="hidden lg:block bg-white ">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    {hasDiscount && (
                                        <div className="flex text-sm customtext-neutral-dark font-semibold items-center space-x-2 mt-1">
                                            Precio: {" "}
                                            <span className="  line-through">
                                                {formatPrice(item.price)}
                                            </span>

                                        </div>
                                    )}
                                    <div className="text-4xl flex items-center gap-4 font-bold font-title customtext-neutral-dark">
                                        {formatPrice(item?.final_price || item?.price)}
                                        {hasDiscount && (
                                            <div className="bg-secondary text-white px-3 py-2 rounded-full text-base  font-medium">
                                                -{discountPercentage}%
                                            </div>
                                        )}
                                    </div>

                                </div>

                            </div>

                        </div>


                        <div className=" customtext-neutral-dark">
                            <p className="font-bold">Descripción:</p>

                            <div
                                ref={descriptionRef}
                                className={`prose max-w-none customtext-neutral-light transition-all duration-300 `}
                                dangerouslySetInnerHTML={{
                                    __html: item?.description || '<p>Sin descripción disponible.</p>'
                                }}
                            />

                        </div>


                        {/* Especificaciones Técnicas */}
                        {item?.specifications && Array.isArray(item.specifications) && item.specifications.length > 0 && (
                            <div className="">

                                <div
                                    ref={specificationsRef}
                                    className={`space-y-3 transition-all duration-300 ${isSpecificationsExpanded ? '' : 'max-h-40 overflow-hidden'
                                        }`}
                                >
                                    {item.specifications.map(
                                        (spec, index) =>
                                            spec.type === "general" && (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 text-sm"
                                                >
                                                    <CheckCircle className="customtext-secondary w-4 h-4 flex-shrink-0" />
                                                    <span className="font-bold customtext-neutral-dark">
                                                        {spec.title || 'Especificación'}:
                                                    </span>
                                                    <span className="customtext-neutral-light">
                                                        {spec.description || spec.value || 'No especificado'}
                                                    </span>
                                                </div>
                                            )
                                    )}
                                </div>
                                {needsSpecificationsExpand && (
                                    <button
                                        onClick={() => setIsSpecificationsExpanded(!isSpecificationsExpanded)}
                                        className="mt-4 customtext-secondary hover:customtext-neutral-dark font-medium transition-colors flex items-center gap-2 text-sm"
                                    >
                                        {isSpecificationsExpanded ? 'Ver menos' : 'Ver más características'}
                                        <ChevronRight
                                            className={`w-4 h-4 transform transition-transform ${isSpecificationsExpanded ? 'rotate-90' : ''
                                                }`}
                                        />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Precio - Desktop */}
                        <div className="hidden lg:block bg-white">
                            <div className="flex items-center justify-between mb-4">

                                {/* Selector de Cantidad Desktop */}
                                <div className="space-y-4 mt-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold customtext-neutral-dark">Cantidad</span>
                                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm active:scale-95 transition-all duration-200 customtext-neutral-dark font-bold text-xl"
                                                disabled={quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <div className="w-16 h-10 flex items-center justify-center">
                                                <span className="customtext-neutral-dark font-bold text-lg">
                                                    {quantity}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm active:scale-95 transition-all duration-200 customtext-neutral-dark font-bold text-xl"
                                                disabled={quantity >= 10}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Botones de acción Desktop */}
                            <div className="space-y-3 mt-6">
                                <button
                                    onClick={() => onAddClicked(item)}
                                    className={`w-full py-4 px-6 rounded-full font-bold flex items-center justify-center space-x-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl transform duration-500 ${inCart
                                            ? 'bg-secondary text-white'
                                            : 'bg-primary customtext-neutral-dark'
                                        }`}
                                >
                                    <span>
                                        {inCart ? `En carrito (${cartQuantity})` : 'Agregar al carrito'}
                                    </span>
                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.5 16H15.7632C20.2508 16 20.9333 13.1808 21.761 9.06908C21.9998 7.88311 22.1192 7.29013 21.8321 6.89507C21.545 6.5 20.9947 6.5 19.8941 6.5H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M8.5 16L5.87873 3.51493C5.65615 2.62459 4.85618 2 3.93845 2H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M9.38 16H8.96857C7.60522 16 6.5 17.1513 6.5 18.5714C6.5 18.8081 6.6842 19 6.91143 19H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11 22C11.8284 22 12.5 21.3284 12.5 20.5C12.5 19.6716 11.8284 19 11 19C10.1716 19 9.5 19.6716 9.5 20.5C9.5 21.3284 10.1716 22 11 22Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M18 22C18.8284 22 19.5 21.3284 19.5 20.5C19.5 19.6716 18.8284 19 18 19C17.1716 19 16.5 19.6716 16.5 20.5C16.5 21.3284 17.1716 22 18 22Z" stroke="currentColor" stroke-width="1.5" />
                                    </svg>
                                </button>

                                {/* Botón de WhatsApp para consultas */}
                                <button
                                    onClick={handleClickWhatsAppConsulta}
                                    className="w-full bg-green-600 text-white py-4 px-6 rounded-full font-bold flex items-center justify-center space-x-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl transform duration-500"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                    </svg>
                                    <span>Consultar por WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Productos relacionados */}
                {console.log('RelationsItems en render:', relationsItems)}
                {relationsItems && relationsItems.length > 0 && (
                    <ProductInfinite
                        items={relationsItems}
                        data={{
                            title: "Productos relacionados",
                            description: "Descubre otros productos cuidadosamente seleccionados que complementan perfectamente tu compra. Nuestra selección incluye productos de alta calidad de las mejores marcas veterinarias para el cuidado integral de tu mascota.",
                            link_catalog: "/catalogo",
                            class_content: "",
                            class_header: "",
                            type_card: "katya",
                            swiper: {
                                slidesPerView: 1,
                                grid: {
                                    fill: 'row',
                                    rows: 1,
                                },
                                breakpoints: {
                                    640: { slidesPerView: 2, spaceBetween: 15 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    1024: { slidesPerView: 4, spaceBetween: 20 },
                                    1280: { slidesPerView: 4, spaceBetween: 20 },
                                }
                            },
                            class_button: "bg-secondary text-white hover:bg-accent hover:customtext-primary",
                        }}
                        setCart={setCart}
                        cart={cart}
                    />
                )}
            </div>

            {/* Botón Flotante Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
                <div className="flex items-center gap-3">
                    {/* Selector de Cantidad Mobile */}
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm active:scale-95 transition-all duration-200 customtext-neutral-dark font-bold text-lg"
                            disabled={quantity <= 1}
                        >
                            −
                        </button>
                        <div className="w-12 h-8 flex items-center justify-center">
                            <span className="customtext-neutral-dark font-bold text-sm">
                                {quantity}
                            </span>
                        </div>
                        <button
                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm active:scale-95 transition-all duration-200 customtext-neutral-dark font-bold text-lg"
                            disabled={quantity >= 10}
                        >
                            +
                        </button>
                    </div>

                    {/* Botón de Agregar al Carrito Mobile */}
                    <button
                        onClick={() => onAddClicked(item)}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 ${inCart
                                ? 'bg-primary customtext-neutral-dark'
                                : 'bg-primary customtext-neutral-dark hover:bg-accent'
                            }`}
                    >
                        <svg width="20" height="19" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 16H15.7632C20.2508 16 20.9333 13.1808 21.761 9.06908C21.9998 7.88311 22.1192 7.29013 21.8321 6.89507C21.545 6.5 20.9947 6.5 19.8941 6.5H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M8.5 16L5.87873 3.51493C5.65615 2.62459 4.85618 2 3.93845 2H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M9.38 16H8.96857C7.60522 16 6.5 17.1513 6.5 18.5714C6.5 18.8081 6.6842 19 6.91143 19H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M11 22C11.8284 22 12.5 21.3284 12.5 20.5C12.5 19.6716 11.8284 19 11 19C10.1716 19 9.5 19.6716 9.5 20.5C9.5 21.3284 10.1716 22 11 22Z" stroke="currentColor" stroke-width="1.5" />
                            <path d="M18 22C18.8284 22 19.5 21.3284 19.5 20.5C19.5 19.6716 18.8284 19 18 19C17.1716 19 16.5 19.6716 16.5 20.5C16.5 21.3284 17.1716 22 18 22Z" stroke="currentColor" stroke-width="1.5" />
                        </svg>
                        <span className="text-sm">
                            {inCart ? `En carrito (${cartQuantity})` : 'Agregar al Carrito'}
                        </span>
                    </button>

                    {/* Botón de WhatsApp Mobile - más pequeño */}
                    <button
                        onClick={handleClickWhatsAppConsulta}
                        className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all shadow-lg active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Modal para imagen ampliada */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-4xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <img
                                src={selectedImage.url ? `/storage/images/item/${selectedImage.url}` : '/api/cover/thumbnail/null'}
                                alt={item?.name}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onError={(e) => {
                                    e.target.src = '/api/cover/thumbnail/null';
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetailKatya;
