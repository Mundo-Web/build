import React, { useEffect, useRef, useState } from "react";
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
    Truck,
    X,
    ZoomIn,
    MessageCircle,
    FileText,
    Download,
    CheckCircle,
    Shield,
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Pagination, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import General from "../../../Utils/General";
import ReactModal from "react-modal";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import CartModalRainstar from "../Components/CartModalRainstar";
import CardProductFimesac from "../Products/Components/CardProductFimesac";

const ProductDetailFimesac = ({
    item,
    data,
    setCart,
    cart,
    generals,
    favorites,
    setFavorites,
}) => {
    const itemsRest = new ItemsRest();
    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedSpecificationMain, setExpanded] = useState(false);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [deliveryPolicyModalOpen, setDeliveryPolicyModalOpen] = useState(false);
    const [variantsForSelectedGroup, setVariantsForSelectedGroup] = useState([]);
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(item);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [relationsItems, setRelationsItems] = useState([]);
    const [isPdfDropdownOpen, setIsPdfDropdownOpen] = useState(false);

    const currentProduct = selectedVariant
        ? {
            ...selectedVariant,
            brand: selectedVariant.brand || item?.brand,
            category: selectedVariant.category || item?.category,
        }
        : item;

    const isOutOfStock =
        !currentProduct?.stock_unlimited &&
        (currentProduct?.stock <= 0 || !currentProduct?.stock);

    useEffect(() => {
        const maxQty = currentProduct?.stock_unlimited ? 99 : currentProduct?.stock || 0;
        if (maxQty <= 0) {
            setQuantity(0);
        } else if (quantity > maxQty) {
            setQuantity(maxQty);
        } else if (quantity === 0) {
            setQuantity(1);
        }
    }, [currentProduct?.id]);

    // Zoom State
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const imageRef = useRef(null);

    const advisors = General.whatsapp_advisors || [];

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: currentProduct?.name,
                    text: currentProduct?.description?.replace(/<[^>]*>/g, ""),
                    url: window.location.href,
                })
                .catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                title: "Enlace copiado",
                text: "El enlace del producto ha sido copiado al portapapeles.",
                icon: "success",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "rounded-none border-4 border-black font-black uppercase",
                    confirmButton:
                        "rounded-none border-4 border-black bg-black text-white hover:bg-white hover:text-neutral-dark transition-all",
                },
            });
        }
    };

    const deliveryPolicy =
        generals?.find((g) => g.correlative === "delivery_policy")
            ?.description || "Políticas de envío no disponibles.";

    const productosRelacionados = async (item) => {
        try {
            const request = {
                id: item?.id,
                related_filter: data?.related_filter || "category",
                related_limit: data?.related_limit || 4,
            };
            const response = await itemsRest.productsRelations(request);
            if (!response) return;
            setRelationsItems(Object.values(response));
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if (currentProduct?.image) {
            setActiveImage(currentProduct.image);
        }
    }, [currentProduct?.id]);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
            setSelectedVariant(item);
            const initialAttributes = {};
            const itemAttrs = Array.isArray(item.attributes)
                ? item.attributes
                : Object.values(item.attributes || {});

            if (itemAttrs.length > 0) {
                itemAttrs.forEach((attr) => {
                    const attrName = attr.name || attr.slug;
                    const value = attr.pivot?.value || attr.value;
                    if (value) {
                        initialAttributes[attrName] = {
                            value,
                            itemId: item.id,
                            item: item,
                        };
                    }
                });
            }
            setSelectedAttributes(initialAttributes);

            if (item.agrupador) {
                setIsLoadingVariants(true);
                fetch(`/api/items/variants/${item.agrupador}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const variantsData = Array.isArray(data)
                            ? data
                            : Object.values(data || {});
                        const allVariants = [item, ...variantsData];
                        const uniqueVariants = Array.from(
                            new Map(allVariants.map((v) => [v.id, v])).values(),
                        );
                        setVariantsForSelectedGroup(uniqueVariants);

                        const sellableVariants = uniqueVariants.filter(
                            (v) => !v.is_master && v.id !== item.id,
                        );

                        if (sellableVariants.length > 0 && item.is_master) {
                            const first = sellableVariants[0];
                            setSelectedVariant(first);
                            const newAttrs = {};
                            const firstAttrs = Array.isArray(first.attributes)
                                ? first.attributes
                                : Object.values(first.attributes || {});

                            if (firstAttrs.length > 0) {
                                firstAttrs.forEach((a) => {
                                    const aName = a.name || a.slug;
                                    const aVal = a.pivot?.value || a.value;
                                    if (aVal) {
                                        newAttrs[aName] = {
                                            value: aVal,
                                            itemId: first.id,
                                            item: first,
                                        };
                                    }
                                });
                            }
                            setSelectedAttributes(newAttrs);
                        }
                    })
                    .catch(() => {
                        setVariantsForSelectedGroup([item]);
                    })
                    .finally(() => setIsLoadingVariants(false));
            } else {
                setVariantsForSelectedGroup([item]);
            }
        }
    }, [item]);

    // Lógica para agrupador de atributos
    const groupVariantsByAttributes = () => {
        if (!variantsForSelectedGroup || variantsForSelectedGroup.length === 0)
            return null;

        const attributeValuesMap = {};

        variantsForSelectedGroup.forEach((variant) => {
            const attrs = Array.isArray(variant.attributes)
                ? variant.attributes
                : Object.values(variant.attributes || {});

            attrs.forEach((attr) => {
                const attrName = attr.name || attr.slug;
                const value = attr.pivot?.value || attr.value;

                if (attrName && value) {
                    if (!attributeValuesMap[attrName]) {
                        attributeValuesMap[attrName] = new Map();
                    }
                    if (!attributeValuesMap[attrName].has(value)) {
                        attributeValuesMap[attrName].set(value, {
                            value,
                            itemId: variant.id,
                            item: variant,
                        });
                    }
                }
            });
        });

        const allAttributes = Object.keys(attributeValuesMap).map((attrName) => ({
            name: attrName,
            options: Array.from(attributeValuesMap[attrName].values()),
        }));

        return { allAttributes };
    };

    const group = groupVariantsByAttributes();

    const handleAttributeSelect = (attrName, option) => {
        const newSelected = {
            ...selectedAttributes,
            [attrName]: option,
        };
        setSelectedAttributes(newSelected);

        const matchingVariant = variantsForSelectedGroup.find((variant) => {
            const attrs = Array.isArray(variant.attributes)
                ? variant.attributes
                : Object.values(variant.attributes || {});

            return Object.entries(newSelected).every(([selectedName, selectedOpt]) => {
                return attrs.some((a) => {
                    const aName = a.name || a.slug;
                    const aVal = a.pivot?.value || a.value;
                    return aName === selectedName && aVal === selectedOpt.value;
                });
            });
        });

        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
        }
    };

    const onAddClicked = (product) => {
        const hasMultipleVariants = variantsForSelectedGroup.length > 1;
        const totalRequiredAttributes = group?.allAttributes?.length || 0;
        const totalSelectedAttributes = Object.keys(selectedAttributes).length;

        if (
            hasMultipleVariants &&
            (totalSelectedAttributes < totalRequiredAttributes || product.is_master)
        ) {
            Swal.fire({
                title: "Selección incompleta",
                text: "Por favor selecciona todas las opciones disponibles antes de agregar al carrito.",
                icon: "warning",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "rounded-none border-4 border-black font-black uppercase",
                    confirmButton:
                        "rounded-none border-4 border-black bg-black text-white hover:bg-white hover:text-neutral-dark transition-all",
                },
            });
            return;
        }

        if (!cart || !setCart) {
            Swal.fire({
                title: "Error",
                text: "No se puede acceder al carrito.",
                icon: "error",
                customClass: {
                    popup: "rounded-none border-4 border-black font-black uppercase",
                    confirmButton: "rounded-none border-4 border-black bg-black text-white",
                },
            });
            return;
        }

        if (!product.stock_unlimited) {
            const currentStock = product.stock || 0;
            if (currentStock <= 0) {
                Swal.fire({
                    title: "Producto agotado",
                    text: "Este producto se encuentra agotado.",
                    icon: "error",
                    customClass: {
                        popup: "rounded-none border-4 border-black font-black uppercase",
                        confirmButton: "rounded-none border-4 border-black bg-black text-white",
                    },
                });
                return;
            }
            if (currentStock < quantity) {
                Swal.fire({
                    title: "Stock insuficiente",
                    text: `Stock disponible: ${currentStock} unidades.`,
                    icon: "warning",
                    customClass: {
                        popup: "rounded-none border-4 border-black font-black uppercase",
                        confirmButton: "rounded-none border-4 border-black bg-black text-white",
                    },
                });
                return;
            }
        }

        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product?.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: quantity });
        } else {
            if (!product.stock_unlimited) {
                const currentStock = product.stock || 0;
                const newQty = newCart[index].quantity + quantity;
                if (newQty > currentStock) {
                    Swal.fire({
                        title: "Límite de stock alcanzado",
                        text: `Stock disponible: ${currentStock}. Ya tienes ${newCart[index].quantity} en el carrito.`,
                        icon: "warning",
                        customClass: {
                            popup: "rounded-none border-4 border-black font-black uppercase",
                            confirmButton: "rounded-none border-4 border-black bg-black text-white",
                        },
                    });
                    return;
                }
            }
            newCart[index].quantity += quantity;
        }
        setCart(newCart);
        setModalOpen(true);
    };

    const handleAdvisorClick = (advisor) => {
        const phone = advisor.phone?.replace(/[^0-9]/g, "");
        if (!phone) return;
        const msg = encodeURIComponent(
            `Hola ${advisor.name || ""}, me interesa el producto: ${currentProduct?.name || item?.name} (${window.location.href})`,
        );
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
        setIsAdvisorDropdownOpen(false);
    };

    const handleSingleAdvisorClick = () => {
        const phone = (advisors[0]?.phone || generals?.find((g) => g.correlative === "phone_whatsapp")?.description || "").replace(/[^0-9]/g, "");
        if (!phone) return;
        const msg = encodeURIComponent(
            `Hola, me interesa solicitar cotización de: ${currentProduct?.name || item?.name} (${window.location.href})`,
        );
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    };

    // Zoom handlers
    const handleZoomClick = () => {
        setIsZoomEnabled(!isZoomEnabled);
    };

    const handleMouseMove = (e) => {
        if (!isZoomEnabled || !imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseLeave = () => {
        if (isZoomEnabled) {
            setIsZoomEnabled(false);
        }
    };

    const generalSpecifications = (
        Array.isArray(currentProduct?.specifications) && currentProduct.specifications.length > 0
            ? currentProduct.specifications
            : Array.isArray(item?.specifications)
                ? item.specifications
                : []
    ).filter((s) => s.type === "general" || !s.type);

    const pdfFiles = (
        Array.isArray(currentProduct?.pdf) && currentProduct.pdf.length > 0
            ? currentProduct.pdf
            : Array.isArray(item?.pdf)
                ? item.pdf
                : []
    );

    return (
        <main id={data?.element_id || null} className="bg-white min-h-screen text-neutral-dark py-12 px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto 2xl:max-w-7xl">
                {/* Product Layout Grid */}
                <article
                    itemScope={true}
                    itemType="https://schema.org/Product"
                    className="grid grid-cols-12 gap-8 lg:gap-12"
                >
                    {/* Left Column: Images Gallery */}
                    <div className="col-span-12 lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
                        {/* Gallery Thumbnails */}
                        <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-y-auto max-h-[520px] pb-2 md:pb-0 w-full md:w-20">
                            {[
                                currentProduct?.image || item?.image,
                                ...(Array.isArray(currentProduct?.images)
                                    ? currentProduct.images
                                    : Object.values(currentProduct?.images || {})),
                                ...(Array.isArray(item?.images)
                                    ? item.images
                                    : Object.values(item?.images || {})),
                            ]
                                .filter((img, idx, self) => {
                                    const url = img?.url || img;
                                    return (
                                        url &&
                                        self.findIndex((i) => (i?.url || i) === url) === idx
                                    );
                                })
                                .map((img, i) => {
                                    const imgUrl = img?.url || img;
                                    const isActive = (activeImage?.url || activeImage) === imgUrl;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setActiveImage(imgUrl)}
                                            className={`w-20 md:w-full aspect-square border p-1 bg-white cursor-pointer transition-all shrink-0 ${isActive
                                                ? "border-primary ring-1 ring-primary"
                                                : "border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${imgUrl}`}
                                                className="w-full h-full object-contain"
                                                alt="thumb"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Main Image Container */}
                        <div className="flex-1 border border-gray-100 p-4 bg-white relative group">
                            <div
                                ref={imageRef}
                                className="aspect-square bg-white cursor-zoom-in relative overflow-hidden flex items-center justify-center"
                                onClick={handleZoomClick}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImage?.url || activeImage || currentProduct?.image}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        src={`/storage/images/item/${activeImage?.url || activeImage || currentProduct?.image}`}
                                        alt={currentProduct?.name || item?.name}
                                        itemProp="image"
                                        className={`w-full h-full object-contain transition-transform duration-300 ${isZoomEnabled ? "scale-150" : "scale-100"
                                            }`}
                                        style={
                                            isZoomEnabled
                                                ? {
                                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                }
                                                : {}
                                        }
                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                    />
                                </AnimatePresence>

                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare();
                                        }}
                                        className="bg-white/90 backdrop-blur-sm text-neutral-dark p-2.5 hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-200"
                                        title="Compartir"
                                    >
                                        <Share2 className="w-4 h-4 stroke-[2]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Specs & CTAs */}
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                        {/* Category Badge */}
                        {currentProduct?.category?.name && (
                            <div className="inline-block bg-neutral-dark text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                {currentProduct.category.name}
                            </div>
                        )}

                        {/* Title */}
                        <h1
                            itemProp="name"
                            className="text-3xl md:text-4xl lg:text-5xl font-black text-neutral-dark tracking-tight leading-tight"
                        >
                            {currentProduct?.name || item?.name}
                        </h1>

                        {/* Description / Summary */}
                        {currentProduct?.description && (
                            <div
                                className="text-neutral-600 text-base md:text-lg font-paragraph leading-relaxed prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: currentProduct.description }}
                            />
                        )}

                        {/* Specifications Box (Datos Técnicos) */}
                        {generalSpecifications.length > 0 && (
                            <div className="border border-gray-200 bg-gray-50/50 rounded-none overflow-hidden">
                                <div className="bg-gray-100/80 px-5 py-3 border-b border-gray-200">
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-dark">
                                        DATOS TÉCNICOS
                                    </span>
                                </div>
                                <div className="p-5 space-y-3">
                                    {generalSpecifications.map((spec, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-sm">
                                            <span className="w-1.5 h-1.5 bg-neutral-dark mt-2 shrink-0" />
                                            <div className="flex-1">
                                                {spec.title && (
                                                    <span className="font-bold text-neutral-dark uppercase text-xs tracking-wider me-2">
                                                        {spec.title}:
                                                    </span>
                                                )}
                                                <span className="text-neutral-700 font-medium">
                                                    {spec.description || spec.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Display if present */}
                        {(currentProduct?.final_price > 0 || currentProduct?.price > 0) && (
                            <div className="flex items-baseline gap-3 pt-2">
                                <span className="text-3xl font-black text-primary">
                                    {CurrencySymbol()} {currentProduct?.final_price || currentProduct?.price}
                                </span>
                                {currentProduct?.price > currentProduct?.final_price && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {CurrencySymbol()} {currentProduct.price}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Action Buttons: PDF Fichas (Arriba) + WhatsApp Cotización (Abajo - Full Width) */}
                        <div className="flex flex-col gap-3 pt-4 w-full">
                            {/* Especificaciones / Fichas Técnicas PDF */}
                            {pdfFiles.length > 0 && (
                                <div className="relative w-full">
                                    {pdfFiles.length === 1 ? (
                                        <a
                                            href={`/storage/images/item/${pdfFiles[0].url || pdfFiles[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3.5 px-4 bg-gray-50 text-neutral-dark border border-gray-300 hover:bg-neutral-dark hover:text-white font-bold text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>ESPECIFICACIONES PDF</span>
                                        </a>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setIsPdfDropdownOpen(!isPdfDropdownOpen)}
                                                className="w-full py-3.5 px-4 bg-gray-50 text-neutral-dark border border-gray-300 hover:bg-neutral-dark hover:text-white font-bold text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>ESPECIFICACIONES PDF</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isPdfDropdownOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            {isPdfDropdownOpen && (
                                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 shadow-xl z-50 p-2 space-y-1">
                                                    <p className="text-xs font-bold text-gray-400 px-3 py-1 uppercase">Documentos Disponibles:</p>
                                                    {pdfFiles.map((pdf, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={`/storage/images/item/${pdf.url || pdf}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full text-left px-3 py-2 text-sm font-bold text-neutral-dark hover:bg-gray-100 flex items-center justify-between transition-colors"
                                                        >
                                                            <span className="truncate me-2">
                                                                {pdf.name || (typeof pdf === "string" ? pdf.split("/").pop() : `Ficha ${idx + 1}`)}
                                                            </span>
                                                            <FileText className="w-4 h-4 text-red-600 shrink-0" />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Cotizar por WhatsApp (Full Width) */}
                            <div className="relative w-full">
                                {advisors.length > 1 ? (
                                    <>
                                        <button
                                            onClick={() => setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)}
                                            className="w-full py-4 px-6 bg-primary text-white hover:bg-primary/90 font-bold text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.99]"
                                        >
                                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                            </svg>
                                            <span>SOLICITAR UNA COTIZACIÓN AHORA</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isAdvisorDropdownOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {isAdvisorDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl z-50 p-2 space-y-1">
                                                <p className="text-xs font-bold text-gray-400 px-3 py-1 uppercase">Selecciona un asesor:</p>
                                                {advisors.map((adv, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAdvisorClick(adv)}
                                                        className="w-full text-left px-3 py-2 text-sm font-bold text-neutral-dark hover:bg-gray-100 flex items-center justify-between transition-colors"
                                                    >
                                                        <span>{adv.name || `Asesor ${idx + 1}`}</span>
                                                        <svg className="w-4 h-4 fill-green-600 shrink-0" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={handleSingleAdvisorClick}
                                        className="w-full py-5 px-6 bg-primary text-white hover:bg-primary/90 font-bold text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.99]"
                                    >
                                        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                        </svg>
                                        <span>SOLICITAR UNA COTIZACIÓN AHORA</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Products Section */}
                {relationsItems.length > 0 && (
                    <section className="mt-20 pt-16 border-t border-gray-200">
                        <div className="mb-10 text-left">

                            <h2 className="text-3xl md:text-5xl font-black text-neutral-dark tracking-tight">
                                Productos Relacionados
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
                            {relationsItems.map((relProduct, index) => (
                                <CardProductFimesac
                                    key={relProduct.id || index}
                                    product={relProduct}
                                    data={data}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Cart Modal */}
            <CartModalRainstar
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                item={currentProduct}
                cart={cart}
                setCart={setCart}
            />
        </main>
    );
};

export default ProductDetailFimesac;
