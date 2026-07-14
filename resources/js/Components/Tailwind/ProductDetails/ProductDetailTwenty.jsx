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
    Quote,
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
import CartModalSelector from "../Components/CartModalSelector";
import ProductSwiperTwenty from "../Products/ProductSwiperTwenty";

const WhatsAppIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
    </svg>
);

const ProductDetailTwenty = ({
    item,
    data,
    setCart,
    cart,
    generals,
    favorites,
    setFavorites,
    onViewUpdate,
}) => {
    const itemsRest = new ItemsRest();
    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedSpecificationMain, setExpanded] = useState(false);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [whatsappAction, setWhatsappAction] = useState("consult"); // 'consult' o 'quote'
    const [deliveryPolicyModalOpen, setDeliveryPolicyModalOpen] =
        useState(false);
    const [variantsForSelectedGroup, setVariantsForSelectedGroup] = useState(
        [],
    );
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(item);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [showAllSpecs, setShowAllSpecs] = useState(false);
    const [relationsItems, setRelationsItems] = useState([]);

    const productosRelacionados = async (item) => {
        try {
            const request = {
                id: item?.id,
                related_filter: data?.related_filter || 'category',
                related_limit: data?.related_limit || 10
            };
            const response = await itemsRest.productsRelations(request);
            if (!response) return;
            setRelationsItems(Object.values(response));
        } catch (error) {
            return;
        }
    };

    // Zoom State
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const imageRef = useRef(null);

    // Merge parent item's brand/category as fallback — child variants often
    // don't carry these fields, causing them to flash and disappear.
    const currentProduct = selectedVariant
        ? {
            ...selectedVariant,
            brand: selectedVariant.brand || item?.brand,
            category: selectedVariant.category || item?.category,
        }
        : item;
    const advisors = General.whatsapp_advisors || [];

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: currentProduct?.name,
                    text: currentProduct?.description?.replace(/<[^>]*>/g, ""),
                    url: window.location.href,
                })
                .catch(() => {
                    // Fallback
                });
        } else {
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                title: "Enlace copiado",
                text: "El enlace del producto ha sido copiado al portapapeles.",
                icon: "success",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "rounded-none border-4 border-white bg-black text-white uppercase tracking-tight font-mono text-xs",
                    confirmButton:
                        "rounded-none border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-all font-mono text-xs py-2 px-4",
                },
            });
        }
    };

    const handleWhatsAppClick = (actionType) => {
        setWhatsappAction(actionType);
        const message = actionType === "quote"
            ? `¡Hola! Me gustaría cotizar este producto: ${currentProduct?.name}\n\nCantidad: ${quantity} unidades\n\n¿Podrían enviarme más información y precios?`
            : `¡Hola! Tengo dudas sobre: ${currentProduct?.name}`;

        if (advisors && advisors.length > 1) {
            setIsAdvisorDropdownOpen(true);
        } else {
            const defaultPhone = generals?.find(
                (g) => g.correlative === "phone_whatsapp"
            )?.description;
            const phone = advisors?.[0]?.phone || defaultPhone;
            if (phone) {
                window.open(
                    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
                    "_blank"
                );
            } else {
                Swal.fire({
                    title: "WhatsApp no disponible",
                    text: "No se ha configurado un número de contacto.",
                    icon: "warning",
                    confirmButtonColor: "#000000",
                    customClass: {
                        popup: "rounded-none border-4 border-white bg-black text-white uppercase tracking-tight font-mono text-xs",
                        confirmButton: "rounded-none border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-all font-mono text-xs py-2 px-4"
                    }
                });
            }
        }
    };

    const deliveryPolicy =
        generals?.find((g) => g.correlative === "delivery_policy")
            ?.description || "Políticas de envío no disponibles.";

    useEffect(() => {
        if (currentProduct?.image) {
            setActiveImage(currentProduct.image);
        }
    }, [currentProduct?.id]);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
            setSelectedVariant(item);

            // Notifica la vista del producto al padre
            if (onViewUpdate) onViewUpdate(item);

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
                    .catch((err) => {
                        console.error("ProductDetailTwenty: Error fetching variants:", err);
                        setVariantsForSelectedGroup([item]);
                    })
                    .finally(() => setIsLoadingVariants(false));
            } else {
                setVariantsForSelectedGroup([item]);
            }
        }
    }, [item]);

    const onAddClicked = (product) => {
        const hasMultipleVariants = variantsForSelectedGroup.length > 1;
        const totalRequiredAttributes = group?.allAttributes?.length || 0;
        const totalSelectedAttributes = Object.keys(selectedAttributes).length;

        if (
            (hasMultipleVariants &&
                (totalSelectedAttributes < totalRequiredAttributes ||
                    product.id === item.id)) ||
            product.is_master
        ) {
            Swal.fire({
                title: "Seleccione las opciones",
                text: "Por favor, seleccione todas las opciones disponibles (color, talla, etc.) antes de continuar.",
                icon: "info",
                confirmButtonColor: "#000000",
                customClass: {
                    popup: "rounded-none border-4 border-white bg-black text-white uppercase tracking-tight font-mono text-xs",
                    confirmButton:
                        "rounded-none border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-all font-mono text-xs py-2 px-4",
                },
            });
            return;
        }

        const newCart = [...cart];
        const index = newCart.findIndex((x) => x.id === product.id);
        if (index === -1) {
            newCart.push({ ...product, quantity });
        } else {
            newCart[index].quantity += quantity;
        }
        setCart(newCart);
        setModalOpen(true);
    };

    const handleAttributeSelect = (attrName, valueData) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attrName]: valueData,
        }));
        if (valueData.item) {
            setSelectedVariant(valueData.item);
        }
    };

    const isValueAvailable = (attrName, valueToCheck, group) => {
        return group.variants.some((variant) => {
            const variantAttrs = Array.isArray(variant.attributes)
                ? variant.attributes
                : Object.values(variant.attributes || {});

            const hasThisValue = variantAttrs?.some((attr) => {
                const name = attr.name || attr.slug;
                const value = attr.pivot?.value || attr.value;
                return name === attrName && value === valueToCheck;
            });

            if (!hasThisValue) return false;

            for (const [selectedAttrName, selectedValueData] of Object.entries(
                selectedAttributes,
            )) {
                if (selectedAttrName === attrName) continue;
                const hasSelectedAttr = variantAttrs?.some((attr) => {
                    const name = attr.name || attr.slug;
                    const value = attr.pivot?.value || attr.value;
                    return (
                        name === selectedAttrName &&
                        value === selectedValueData.value
                    );
                });
                if (!hasSelectedAttr) return false;
            }
            return true;
        });
    };

    const findBestMatchingVariant = (attrName, valueData, group) => {
        const candidates = group.variants.filter((v) => {
            const vAttrs = Array.isArray(v.attributes)
                ? v.attributes
                : Object.values(v.attributes || {});
            return vAttrs?.some(
                (a) =>
                    (a.name || a.slug) === attrName &&
                    (a.pivot?.value || a.value) === valueData.value,
            );
        });

        if (candidates.length === 0) return null;

        const scoredCandidates = candidates.map((v) => {
            let score = 0;
            const vAttrs = Array.isArray(v.attributes)
                ? v.attributes
                : Object.values(v.attributes || {});

            Object.entries(selectedAttributes).forEach(([selName, selData]) => {
                if (selName === attrName) return;
                const matches = vAttrs?.some(
                    (a) =>
                        (a.name || a.slug) === selName &&
                        (a.pivot?.value || a.value) === selData.value,
                );
                if (matches) score++;
            });
            return { variant: v, score };
        });

        scoredCandidates.sort((a, b) => b.score - a.score);
        return scoredCandidates[0].variant;
    };

    const handleZoomClick = (e) => {
        if (!isZoomEnabled && e && imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
            });
        }
        setIsZoomEnabled(!isZoomEnabled);
    };

    const handleMouseMove = (e) => {
        if (!isZoomEnabled) return;
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
            });
        }
    };

    const handleMouseLeave = () => {
        setIsZoomEnabled(false);
    };

    const group =
        variantsForSelectedGroup.length > 0
            ? {
                variants: variantsForSelectedGroup,
                allAttributes: Array.from(
                    new Set(
                        variantsForSelectedGroup.flatMap((v) => {
                            const vAttrs = Array.isArray(v.attributes)
                                ? v.attributes
                                : Object.values(v.attributes || {});
                            return vAttrs.map((a) => a.name || a.slug);
                        }),
                    ),
                ).map((name) => {
                    const values = [];
                    variantsForSelectedGroup.forEach((v) => {
                        const vAttrs = Array.isArray(v.attributes)
                            ? v.attributes
                            : Object.values(v.attributes || {});
                        const attr = vAttrs.find(
                            (a) => (a.name || a.slug) === name,
                        );
                        if (attr) {
                            const value = attr.pivot?.value || attr.value;
                            if (!values.find((val) => val.value === value)) {
                                values.push({ value, itemId: v.id, item: v });
                            }
                        }
                    });
                    return {
                        name,
                        attribute: variantsForSelectedGroup
                            .map((v) =>
                                Array.isArray(v.attributes)
                                    ? v.attributes
                                    : Object.values(v.attributes || {}),
                            )
                            .flat()
                            .find((a) => (a.name || a.slug) === name),
                        values,
                    };
                }),
            }
            : null;

    const twentySectionTitleClass =
        "text-xl md:text-2xl font-title uppercase text-white border-b border-white/10 pb-4 mb-6 flex items-center justify-between";
    const twentyButtonClass =
        "w-full py-4 text-sm font-title uppercase tracking-widest transition-all duration-300 rounded-none active:scale-[0.98]";
    const twentyPrimaryBtn = `${twentyButtonClass} bg-white text-black hover:bg-neutral-200 border-2 border-white`;
    const twentySecondaryBtn = `${twentyButtonClass} border-2 border-white/20 bg-black text-white hover:border-white`;
    const twentyWhatsappBtn = `${twentyButtonClass} bg-[#25D366] text-black hover:bg-[#25D366]/90 flex items-center justify-center gap-2 font-bold`;
    const hasValidPrice =
        (currentProduct?.final_price && parseFloat(currentProduct.final_price) > 0) ||
        (currentProduct?.price && parseFloat(currentProduct.price) > 0);

    const generalSpecifications = (
        Array.isArray(currentProduct?.specifications) &&
            currentProduct.specifications.length > 0
            ? currentProduct.specifications
            : Array.isArray(item?.specifications)
                ? item.specifications
                : []
    ).filter((s) => s.type === "general" || !s.type);

    return (
        <main className="bg-primary min-h-screen text-white py-16 px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto 2xl:max-w-7xl">
                {/* Desktop View */}
                <article
                    itemScope={true}
                    itemType="https://schema.org/Product"
                    className="hidden md:grid grid-cols-12 gap-8 lg:gap-12"
                >
                    {/* Left Column: Images */}
                    <div className="col-span-12 lg:col-span-7 flex gap-6">
                        {/* Gallery Thumbnails */}
                        <div className="w-20 space-y-4 shrink-0">
                            {[
                                currentProduct?.image,
                                ...(Array.isArray(currentProduct?.images)
                                    ? currentProduct.images
                                    : Object.values(
                                        currentProduct?.images || {},
                                    )),
                            ]
                                .filter((img, idx, self) => {
                                    const url = img?.url || img;
                                    return (
                                        url &&
                                        self.findIndex(
                                            (i) => (i?.url || i) === url,
                                        ) === idx
                                    );
                                })
                                .map((img, i) => {
                                    const imgUrl = img?.url || img;
                                    const isActive =
                                        (activeImage?.url || activeImage) ===
                                        imgUrl;
                                    return (
                                        <div
                                            key={i}
                                            role="button"
                                            aria-label={`Ver imagen ${i + 1} de ${currentProduct?.name || 'producto'}`}
                                            onClick={() =>
                                                setActiveImage(imgUrl)
                                            }
                                            className={`aspect-square border p-1 bg-black cursor-pointer transition-all rounded-none ${isActive ? "border-white" : "border-white/10 hover:border-white/40"}`}
                                        >
                                            <img
                                                src={`/storage/images/item/${imgUrl}`}
                                                alt={`${currentProduct?.name || item?.name || 'Producto'} - Vista ${i + 1}`}
                                                className="w-full h-full object-contain object-top"
                                                onError={(e) =>
                                                    (e.target.src = "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 border aspect-square max-h-min border-white/10 p-2 bg-black overflow-hidden relative rounded-none hover:border-white/30 transition-colors duration-500"
                        >
                            <div
                                ref={imageRef}
                                className="aspect-square bg-black cursor-zoom-in relative overflow-hidden rounded-none"
                                onClick={handleZoomClick}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={
                                            activeImage?.url ||
                                            activeImage ||
                                            currentProduct?.image
                                        }
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: isZoomEnabled ? 1.5 : 1,
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                        src={`/storage/images/item/${activeImage?.url || activeImage || currentProduct?.image}`}
                                        alt={currentProduct?.name || item?.name || "Imagen principal del producto"}
                                        itemProp="image"
                                        className="w-full h-full object-contain object-top"
                                        style={
                                            isZoomEnabled
                                                ? {
                                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                }
                                                : {}
                                        }
                                        onError={(e) =>
                                            (e.target.src = "/api/cover/thumbnail/null")
                                        }
                                    />
                                </AnimatePresence>

                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    {!isZoomEnabled && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare();
                                            }}
                                            className="bg-black/80 text-white p-3 hover:bg-white hover:text-black transition-all border border-white/10 rounded-none"
                                        >
                                            <Share2 className="w-5 h-5 stroke-[1.5]" />
                                        </button>
                                    )}
                                    {!isZoomEnabled && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setZoomPosition({ x: 50, y: 50 });
                                                setIsZoomEnabled(true);
                                            }}
                                            className="bg-white text-black p-3 rounded-none opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <ZoomIn className="w-5 h-5 stroke-[1.5]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Info */}
                    <section className="col-span-12 lg:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-3">
                                <span itemProp="brand" itemScope={true} itemType="https://schema.org/Brand" className="text-xs font-mono uppercase tracking-widest text-white/50 block">
                                    <span itemProp="name">{currentProduct?.brand?.name ||
                                        currentProduct?.category?.name}</span>
                                </span>
                                <h1 itemProp="name" className={`text-4xl lg:text-6xl font-title  text-white ${data?.class_title || ""}`}>
                                    <TextWithHighlight
                                        text={currentProduct?.name}
                                        className="font-title"

                                    />
                                </h1>
                                <p className="text-xs font-mono tracking-wider text-white/40">
                                    SKU: <span itemProp="sku">{currentProduct?.sku}</span>
                                </p>
                            </div>

                            <div itemProp="offers" itemScope={true} itemType="https://schema.org/Offer" className="flex items-center gap-6 py-2 border-y border-white/10">
                                <meta itemProp="priceCurrency" content="PEN" />
                                <link itemProp="availability" href={currentProduct?.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                                <span className="text-5xl uppercase text-white">
                                    {CurrencySymbol()}{" "}
                                    <span itemProp="price" content={currentProduct?.final_price || currentProduct?.price}>{currentProduct?.final_price}</span>
                                </span>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg text-white/30 line-through font-mono leading-none">
                                                {CurrencySymbol()}{" "}
                                                {currentProduct?.price}
                                            </span>
                                            <span className="text-xs bg-white text-black font-mono font-bold px-2 py-0.5 rounded-none">
                                                -{Number(currentProduct?.discount_percent).toFixed(0)}% OFF
                                            </span>
                                        </div>
                                    )}
                            </div>

                            {/* Variants Selection */}
                            {isLoadingVariants ? (
                                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest animate-pulse text-white/50">
                                    <div className="w-2 h-2 bg-white rounded-none"></div>
                                    Actualizando Variantes...
                                </div>
                            ) : (
                                group?.allAttributes?.length > 0 && (
                                    <div className="space-y-6">
                                        {group.allAttributes.map((attrData) => (
                                            <div
                                                key={attrData.name}
                                                className="space-y-3"
                                            >
                                                <h3 className="text-xs font-mono uppercase tracking-wider text-white/50">
                                                    {attrData.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {attrData.values.map(
                                                        (val, idx) => {
                                                            const isSelected =
                                                                selectedAttributes[
                                                                    attrData.name
                                                                ]?.value === val.value;
                                                            const isAvailable =
                                                                attrData.attribute?.is_parent ||
                                                                isValueAvailable(
                                                                    attrData.name,
                                                                    val.value,
                                                                    group,
                                                                );
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    disabled={!isAvailable}
                                                                    onClick={() => {
                                                                        const matching =
                                                                            findBestMatchingVariant(
                                                                                attrData.name,
                                                                                val,
                                                                                group,
                                                                            );
                                                                        if (matching) {
                                                                            setSelectedVariant(matching);
                                                                            const newAttrs = {};
                                                                            matching.attributes?.forEach((a) => {
                                                                                newAttrs[a.name || a.slug] = {
                                                                                    value: a.pivot?.value || a.value,
                                                                                    item: matching,
                                                                                };
                                                                            });
                                                                            setSelectedAttributes(newAttrs);
                                                                        } else {
                                                                            handleAttributeSelect(attrData.name, val);
                                                                        }
                                                                    }}
                                                                    className={`px-4 py-2.5 rounded-none text-xs font-mono uppercase transition-all border
                                                                        ${isSelected ? "bg-white text-black border-white" : isAvailable ? "bg-black text-white border-white/20 hover:border-white" : "bg-neutral-900 text-white/20 border-white/5 cursor-not-allowed line-through opacity-40"}
                                                                    `}
                                                                >
                                                                    {val.value}
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}

                            {/* Purchase Actions */}
                            <div className="space-y-6 pt-4">
                                {hasValidPrice && (
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                                            Cantidad
                                        </span>
                                        <div className="flex items-center gap-8 border border-white/10 px-4 py-1.5 font-mono">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="text-lg font-bold hover:text-white/60 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm w-4 text-center text-white">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                className="text-lg font-bold hover:text-white/60 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {(() => {
                                    const hasMultipleVariants = variantsForSelectedGroup.length > 1;
                                    const totalRequiredAttributes = group?.allAttributes?.length || 0;
                                    const totalSelectedAttributes = Object.keys(selectedAttributes).length;
                                    const isFullySelected = !(
                                        (hasMultipleVariants &&
                                            (totalSelectedAttributes < totalRequiredAttributes ||
                                                currentProduct.id === item.id)) ||
                                        currentProduct.is_master
                                    );

                                    const showBuy = data?.buyButton !== false && hasValidPrice;
                                    const showCart = data?.cartButton !== false && hasValidPrice;
                                    const showWhatsApp = data?.show_whatsapp === true;
                                    const whatsappType = data?.quoteButton === true ? "quote" : "consult";

                                    return (
                                        <div className="space-y-4">
                                            {(showBuy || showCart) && (
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    {showBuy && (
                                                        <button
                                                            disabled={!isFullySelected}
                                                            onClick={() => {
                                                                onAddClicked(currentProduct);
                                                                if (isFullySelected) {
                                                                    window.location.href = "/cart";
                                                                }
                                                            }}
                                                            className={`${twentyPrimaryBtn} ${!isFullySelected ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        >
                                                            Comprar ahora
                                                        </button>
                                                    )}
                                                    {showCart && (
                                                        <button
                                                            disabled={!isFullySelected}
                                                            onClick={() => onAddClicked(currentProduct)}
                                                            className={`${twentySecondaryBtn} ${!isFullySelected ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        >
                                                            Al Carrito
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {showWhatsApp && (
                                                <button
                                                    onClick={() => handleWhatsAppClick(whatsappType)}
                                                    className={twentyWhatsappBtn}
                                                >
                                                    <WhatsAppIcon className="w-5 h-5" />
                                                    <span>
                                                        {whatsappType === "quote"
                                                            ? "Solicitar Cotización"
                                                            : "WhatsApp de Contacto"}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </section>

                    {/* Specifications & Description — only render sections with content */}
                    {(() => {
                        const hasDesc = !!(currentProduct?.description || item?.description);
                        const hasSpecs = generalSpecifications.length > 0;
                        // Don't render the whole block if neither section has content
                        if (!hasDesc && !hasSpecs) return null;
                        // When only one section exists it should span full width
                        const colClass = (hasDesc && hasSpecs)
                            ? "grid-cols-1 lg:grid-cols-2"
                            : "grid-cols-1";
                        return (
                            <div className={`col-span-12 grid ${colClass} gap-12 border-t border-white/10 pt-10 mt-6`}>
                                {/* Description */}
                                {hasDesc && (
                                    <section className="text-left">
                                        <h2 className={twentySectionTitleClass}>
                                            <span>01 / Descripción</span>
                                            <Plus size={14} className="opacity-40" />
                                        </h2>
                                        <div
                                            itemProp="description"
                                            className="text-sm font-mono leading-relaxed text-white/70 prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-white"
                                            dangerouslySetInnerHTML={{
                                                __html: currentProduct?.description || item?.description,
                                            }}
                                        />
                                    </section>
                                )}

                                {/* Specifications */}
                                {hasSpecs && (
                                    <section className="text-left">
                                        <h2 className={twentySectionTitleClass}>
                                            <span>{hasDesc ? "02" : "01"} / Especificaciones</span>
                                            <Plus size={14} className="opacity-40" />
                                        </h2>
                                        <div className="grid grid-cols-1 gap-3">
                                            {generalSpecifications.slice(0, 10).map((spec, i) => (
                                                <div
                                                    key={i}
                                                    className="border-b border-white/5 pb-3.5 flex items-center justify-between font-mono"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-white/30 w-4">
                                                            {(i + 1).toString().padStart(2, "0")}
                                                        </span>
                                                        <span className="text-xs uppercase text-white/60">
                                                            {spec.title || "Característica"}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs uppercase text-white">
                                                        {spec.description || spec.value}
                                                    </span>
                                                </div>
                                            ))}

                                            <AnimatePresence>
                                                {showAllSpecs && generalSpecifications.length > 10 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden grid grid-cols-1 gap-3"
                                                    >
                                                        {generalSpecifications.slice(10).map((spec, i) => (
                                                            <div
                                                                key={i + 10}
                                                                className="border-b border-white/5 pb-3.5 flex items-center justify-between font-mono"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[10px] text-white/30 w-4">
                                                                        {(i + 11).toString().padStart(2, "0")}
                                                                    </span>
                                                                    <span className="text-xs uppercase text-white/60">
                                                                        {spec.title || "Característica"}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs uppercase text-white">
                                                                    {spec.description || spec.value}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {generalSpecifications.length > 10 && (
                                                <button
                                                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                                                    className="mt-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                                                >
                                                    <span>
                                                        {showAllSpecs
                                                            ? "Ver menos especificaciones"
                                                            : "Ver más especificaciones"}
                                                    </span>
                                                    <motion.div
                                                        animate={{ rotate: showAllSpecs ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown size={10} />
                                                    </motion.div>
                                                </button>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>
                        );
                    })()}

                    {/* Policy Section */}
                    {data?.showDeliveryPolicy !== false && (
                        <div className="col-span-12 mt-6">
                            <div
                                onClick={() => setDeliveryPolicyModalOpen(true)}
                                className="bg-black text-white py-10 px-8 flex items-center justify-between cursor-pointer border border-white/10 hover:border-white transition-all duration-500 rounded-none text-left"
                            >
                                <div className="flex items-center gap-8">
                                    <Truck className="w-12 h-12 stroke-[1] text-white/40" />
                                    <div>
                                        <h4 className="text-2xl font-title uppercase text-white">
                                            Políticas de Envío
                                        </h4>
                                        <p className="text-xs font-mono uppercase tracking-wider text-white/40 mt-1">
                                            Entregas seguras y tiempos estimados
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-mono tracking-widest hidden sm:block">
                                        DETALLES
                                    </span>
                                    <ChevronRight className="w-8 h-8 transform group-hover:translate-x-2 transition-transform stroke-[1]" />
                                </div>
                            </div>
                        </div>
                    )}
                </article>

                {/* Mobile View */}
                <div className="md:hidden space-y-10 pb-20 text-left">
                    <div className="space-y-6">
                        <div className="border-b border-white/10 pb-6 px-2">
                            <div className="flex justify-between items-start mb-3">
                                <div className="space-y-1">
                                    <span className="text-xs font-mono tracking-wider text-white/40 block">
                                        SKU: {currentProduct?.sku}
                                    </span>
                                    <span className="text-xs font-mono uppercase tracking-widest text-white/60">
                                        {currentProduct?.brand?.name || "PREMIUM"}
                                    </span>
                                </div>
                                <button
                                    onClick={handleShare}
                                    aria-label="Compartir producto"
                                    className="p-3 bg-neutral-900 border border-white/10 text-white rounded-none"
                                >
                                    <Share2 className="w-4 h-4 stroke-[1.5]" />
                                </button>
                            </div>
                            <h2 className="text-3xl font-title uppercase tracking-normal leading-[1] mb-4 text-white">
                                {currentProduct?.name}
                            </h2>
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-title uppercase text-white">
                                    {CurrencySymbol()}{" "}
                                    {currentProduct?.final_price}
                                </span>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                        <span className="text-base text-white/30 line-through font-mono">
                                            {CurrencySymbol()}{" "}
                                            {currentProduct?.price}
                                        </span>
                                    )}
                            </div>
                        </div>

                        {/* Slider Mobile */}
                        <div className="border border-white/10 p-2 bg-black rounded-none">
                            <Swiper
                                modules={[Pagination, Navigation, Autoplay]}
                                pagination={{ clickable: true }}
                                grabCursor={true}
                                autoplay={{
                                    delay: 4000,
                                    disableOnInteraction: false,
                                }}
                                className="aspect-[3/4]"
                            >
                                {[
                                    currentProduct?.image,
                                    ...(Array.isArray(currentProduct?.images)
                                        ? currentProduct.images
                                        : Object.values(
                                            currentProduct?.images || {},
                                        )),
                                ].map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <img
                                            src={`/storage/images/item/${img?.url || img}`}
                                            alt={`${currentProduct?.name || item?.name || 'Producto'} - imagen ${i + 1}`}
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) =>
                                                (e.target.src = "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    {/* Attributes selection Mobile */}
                    <div className="space-y-6 px-2">
                        {group?.allAttributes?.map((attrData) => (
                            <div key={attrData.name} className="space-y-3">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-white/50">
                                    {attrData.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {attrData.values.map((val, idx) => {
                                        const isSelected =
                                            selectedAttributes[attrData.name]?.value === val.value;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    const matching =
                                                        findBestMatchingVariant(
                                                            attrData.name,
                                                            val,
                                                            group,
                                                        );
                                                    if (matching) {
                                                        setSelectedVariant(matching);
                                                        const newAttrs = {};
                                                        const mAttrs =
                                                            Array.isArray(matching.attributes)
                                                                ? matching.attributes
                                                                : Object.values(matching.attributes || {});
                                                        mAttrs.forEach((a) => {
                                                            newAttrs[a.name || a.slug] = {
                                                                value: a.pivot?.value || a.value,
                                                                item: matching,
                                                            };
                                                        });
                                                        setSelectedAttributes(newAttrs);
                                                    } else {
                                                        handleAttributeSelect(attrData.name, val);
                                                    }
                                                }}
                                                className={`px-4 py-2.5 rounded-none text-xs font-mono uppercase border transition-all ${isSelected ? "bg-white text-black border-white" : "bg-black text-white border-white/20"}`}
                                            >
                                                {val.value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-10 px-2 border-t border-white/10 pt-10">
                        <section>
                            <h2 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
                                01 / DESCRIPCIÓN
                            </h2>
                            <div
                                itemProp="description"
                                className="text-xs font-mono leading-relaxed text-white/70 prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: currentProduct?.description,
                                }}
                            />
                        </section>
                        <section>
                            <h2 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
                                02 / ESPECIFICACIONES
                            </h2>
                            <div className="space-y-3.5">
                                {generalSpecifications.map((spec, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center border-b border-white/5 pb-3 font-mono"
                                    >
                                        <span className="text-xs text-white/60">
                                            {spec.title || "Factor"}
                                        </span>
                                        <span className="text-xs text-white text-right">
                                            {spec.description || spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {data?.showDeliveryPolicy !== false && (
                        <div
                            onClick={() => setDeliveryPolicyModalOpen(true)}
                            className="border border-white/10 py-6 flex justify-between items-center bg-black mx-2 active:bg-neutral-900 transition-colors"
                        >
                            <div className="flex items-center gap-4 pl-4">
                                <Truck className="w-8 h-8 stroke-[1] text-white/60" />
                                <span className="text-xs font-mono uppercase tracking-wider text-white">
                                    Política de Envío
                                </span>
                            </div>
                            <ChevronRight className="w-6 h-6 stroke-[1] text-white/40 pr-4" />
                        </div>
                    )}

                    {/* Mobile Floating Drawer Actions */}
                    {(() => {
                        const showBuy = data?.buyButton !== false && hasValidPrice;
                        const showCart = data?.cartButton !== false && hasValidPrice;
                        const showWhatsApp = data?.show_whatsapp === true;
                        const whatsappType = data?.quoteButton === true ? "quote" : "consult";

                        if (!showBuy && !showCart && !showWhatsApp) return null;

                        return (
                            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/20 p-4 flex flex-col gap-2">
                                {(showBuy || showCart) && (
                                    <div className="flex gap-2">
                                        {showCart && (
                                            <button
                                                onClick={() => onAddClicked(currentProduct)}
                                                className={`${twentySecondaryBtn} !py-3 !text-xs flex-1`}
                                            >
                                                Carrito
                                            </button>
                                        )}
                                        {showBuy && (
                                            <button
                                                onClick={() => {
                                                    onAddClicked(currentProduct);
                                                    window.location.href = "/cart";
                                                }}
                                                className={`${twentyPrimaryBtn} !py-3 !text-xs flex-1`}
                                            >
                                                Pagar
                                            </button>
                                        )}
                                    </div>
                                )}
                                {showWhatsApp && (
                                    <button
                                        onClick={() => handleWhatsAppClick(whatsappType)}
                                        className={`${twentyWhatsappBtn} !py-3 !text-xs`}
                                    >
                                        <WhatsAppIcon className="w-4 h-4" />
                                        <span>
                                            {whatsappType === "quote"
                                                ? "Solicitar Cotización"
                                                : "WhatsApp"}
                                        </span>
                                    </button>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* Related Products Carousel */}
                {relationsItems.length > 0 && (
                    <div className="mt-16 mb-8 w-full border-t border-white/10 pt-16">
                        <ProductSwiperTwenty
                            data={{
                                ...data,
                                title: data?.related_title || "También *te puede* interesar",
                                description: data?.related_description,
                                class_title: data?.related_class_title || "font-title text-3xl md:text-7xl  text-white mb-8 text-center sm:text-left",
                                class_container: data?.related_class_container || "bg-transparent !py-0",
                                loop: data?.related_loop,
                                autoplay: data?.related_autoplay,
                                type_card_product: data?.related_type_card_product || "CardProductTwenty",
                                type_modal_cart: data?.type_modal_cart,
                            }}
                            items={relationsItems}
                            cart={cart}
                            setCart={setCart}
                        />
                    </div>
                )}
            </div>

            {/* Modals - Twenty Styled */}
            <ReactModal
                isOpen={deliveryPolicyModalOpen}
                onRequestClose={() => setDeliveryPolicyModalOpen(false)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none font-mono"
                overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-md z-[90]"
            >
                <div className="bg-black p-8 md:p-12 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] rounded-none border-2 border-white/20 text-left">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-4">
                            <Truck className="w-8 h-8 stroke-[1] text-white/40" />
                            <h2 className="text-xl uppercase tracking-wider text-white">
                                Política de Envío
                            </h2>
                        </div>
                        <button
                            onClick={() => setDeliveryPolicyModalOpen(false)}
                            className="hover:text-white/60 transition-colors"
                        >
                            <X className="w-5 h-5 stroke-[1]" />
                        </button>
                    </div>
                    <div className="prose prose-invert max-w-none text-xs leading-relaxed text-white/70">
                        <div dangerouslySetInnerHTML={{ __html: deliveryPolicy }} />
                    </div>
                    <button
                        onClick={() => setDeliveryPolicyModalOpen(false)}
                        className="mt-8 w-full py-4 bg-white text-black font-title uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors rounded-none"
                    >
                        Entendido
                    </button>
                </div>
            </ReactModal>

            {/* Cart Modal - Dynamic */}
            <CartModalSelector
                type_modal_cart="CartModalMiBalon"
                cart={cart}
                data={data}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </main>
    );
};

export default ProductDetailTwenty;
