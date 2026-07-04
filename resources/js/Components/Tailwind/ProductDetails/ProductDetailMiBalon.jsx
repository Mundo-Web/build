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
import CartModalMiBalon from "../Components/CartModalMiBalon";
import ProductSwiperMiBalon from "../Products/ProductSwiperMiBalon";
const WhatsAppIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
    </svg>
);

const ProductDetailMiBalon = ({
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

    const currentProduct = selectedVariant || item;
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
                    // Fallback in case of error (like user cancelling)
                });
        } else {
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                title: "Enlace copiado",
                text: "El enlace del producto ha sido copiado al portapapeles.",
                icon: "success",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: "rounded-none border-4 border-black  uppercase tracking-tight",
                    confirmButton:
                        "rounded-none border-4 border-black bg-black text-white hover:bg-white hover:text-neutral-dark transition-all",
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
                        popup: "rounded-none border-4 border-black uppercase tracking-tight",
                        confirmButton: "rounded-none border-4 border-black bg-black text-white hover:bg-white hover:text-neutral-dark transition-all"
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
            // First fallback to item selection
            setSelectedVariant(item);
            const initialAttributes = {};
            const itemAttrs = Array.isArray(item.attributes)
                ? item.attributes
                : Object.values(item.attributes || {});

            console.log("ProductDetailMiBalon: Initial attributes", itemAttrs);

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
                console.log(
                    "ProductDetailMiBalon: Fetching variants for",
                    item.agrupador,
                );
                setIsLoadingVariants(true);
                fetch(`/api/items/variants/${item.agrupador}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(
                            "ProductDetailMiBalon: Variants API data",
                            data,
                        );
                        const variantsData = Array.isArray(data)
                            ? data
                            : Object.values(data || {});
                        const allVariants = [item, ...variantsData];
                        const uniqueVariants = Array.from(
                            new Map(allVariants.map((v) => [v.id, v])).values(),
                        );
                        console.log(
                            "ProductDetailMiBalon: Unique variants",
                            uniqueVariants,
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
                        console.error(
                            "ProductDetailMiBalon: Error fetching variants:",
                            err,
                        );
                        setVariantsForSelectedGroup([item]);
                    })
                    .finally(() => setIsLoadingVariants(false));
            } else {
                setVariantsForSelectedGroup([item]);
            }
        }
    }, [item]);

    const onAddClicked = (product) => {
        // Only enforce variant selection if there are multiple variants to choose from
        const hasMultipleVariants = variantsForSelectedGroup.length > 1;
        const totalRequiredAttributes = group?.allAttributes?.length || 0;
        const totalSelectedAttributes = Object.keys(selectedAttributes).length;

        // Validation: If it's a group with multiple options, all attributes must be selected
        // OR the resulting product must not be a master item
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
                    popup: "rounded-none border-4 border-black  uppercase tracking-tight",
                    confirmButton:
                        "rounded-none border-4 border-black bg-black text-white hover:bg-white hover:text-neutral-dark transition-all",
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
        // Removed the setTimeout to keep the cart modal open as per typical side-cart behavior
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

    const mibalonSectionTitleClass =
        "text-2xl font-title uppercase text-neutral-dark border-b border-gray-200 pb-4 mb-8 flex items-center justify-between";
    const mibalonButtonClass =
        "w-full py-5 text-lg font-title   transition-all duration-300 rounded-full  active:scale-[0.98]";
    const mibalonPrimaryBtn = `${mibalonButtonClass} bg-primary text-white hover:bg-neutral-dark hover:border-neutral-dark uppercase`;
    const mibalonSecondaryBtn = `${mibalonButtonClass} border border-neutral-dark bg-white text-neutral-dark hover:bg-gray-50 border-gray-200 uppercase`;
    const mibalonWhatsappBtn = `${mibalonButtonClass} bg-[#25D366] text-white hover:bg-[#25D366] border border-[#25D366] hover:border-[#25D366] uppercase flex items-center justify-center gap-2`;
    const mibalonQuoteBtn = `${mibalonButtonClass} bg-neutral-dark text-white hover:bg-black border border-neutral-dark hover:border-black uppercase flex items-center justify-center gap-2`;
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

    console.log("ProductDetailMiBalon: Rendering with group", group);

    return (
        <main className="bg-white min-h-screen text-neutral-dark py-16 px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto 2xl:max-w-7xl">
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-12">
                    {/* Left Column: Images */}
                    <div className="col-span-12 lg:col-span-7 flex gap-6">
                        {/* Gallery Thumbnails on the side */}
                        <div className="w-24 space-y-4 shrink-0">
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
                                            onClick={() =>
                                                setActiveImage(imgUrl)
                                            }
                                            className={`aspect-square border p-1 bg-white cursor-pointer transition-all rounded-xl ${isActive ? "border-primary ring-2 ring-primary" : "border-gray-100 hover:border-primary/50"}`}
                                        >
                                            <img
                                                src={`/storage/images/item/${imgUrl}`}
                                                className="w-full h-full object-contain object-top"
                                                onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 border aspect-square max-h-min border-gray-100 p-2 bg-white group overflow-hidden relative rounded-[2rem] shadow-sm"
                        >
                            <div
                                ref={imageRef}
                                className="aspect-square bg-white cursor-zoom-in relative overflow-hidden rounded-[1.5rem]"
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
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{
                                            opacity: 1,
                                            scale: isZoomEnabled ? 1.5 : 1,
                                        }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut",
                                        }}
                                        src={`/storage/images/item/${activeImage?.url || activeImage || currentProduct?.image}`}
                                        alt={currentProduct?.name || item?.name}
                                        className="w-full h-full object-contain object-top"
                                        style={
                                            isZoomEnabled
                                                ? {
                                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                }
                                                : {}
                                        }
                                        onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
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
                                            className="bg-white/80 backdrop-blur-md text-primary p-3 hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100 rounded-full"
                                        >
                                            <Share2 className="w-5 h-5 stroke-[1.5]" />
                                        </button>
                                    )}
                                    {!isZoomEnabled && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setZoomPosition({
                                                    x: 50,
                                                    y: 50,
                                                });
                                                setIsZoomEnabled(true);
                                            }}
                                            className="bg-primary text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                                        >
                                            <ZoomIn className="w-5 h-5 stroke-[1.5]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="col-span-12 lg:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <span className="text-sm   text-neutral-dark/60">
                                    {currentProduct?.brand?.name ||
                                        currentProduct?.category?.name ||
                                        "COLECCIÓN PREMIUM"}
                                </span>
                                <h1 className={` text-4xl md:text-5xl lg:text-6xl font-title uppercase tracking-tight leading-[1] text-neutral-dark ${data?.class_title}`}>
                                    <TextWithHighlight
                                        text={currentProduct?.name}
                                        className="font-title"
                                        color="bg-neutral-dark"
                                    />
                                </h1>
                                <p className="text-sm font-medium tracking-normal text-neutral-dark/40 border-l border-neutral-dark/20 pl-4">
                                    Código: {currentProduct?.sku}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 py-4">
                                <span className="text-5xl font-title uppercase  text-neutral-dark">
                                    {CurrencySymbol()}{" "}
                                    {currentProduct?.final_price}
                                </span>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                        <div className="flex flex-col">
                                            <span className="text-xl text-neutral-dark/30 line-through  leading-none">
                                                {CurrencySymbol()}{" "}
                                                {currentProduct?.price}
                                            </span>
                                            <span className="text-sm  tracking-tighter text-primary">
                                                AHORRA{" "}
                                                {Number(
                                                    currentProduct?.discount_percent,
                                                ).toFixed(0)}
                                                %
                                            </span>
                                        </div>
                                    )}
                            </div>

                            {/* Variants Selection */}
                            {isLoadingVariants ? (
                                <div className="flex items-center gap-2 text-sm  uppercase tracking-widest animate-pulse">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                    Actualizando Variantes...
                                </div>
                            ) : (
                                group?.allAttributes?.length > 0 && (
                                    <div className="space-y-8">
                                        {group.allAttributes.map((attrData) => (
                                            <div
                                                key={attrData.name}
                                                className="space-y-4"
                                            >
                                                <h3 className="text-sm   text-neutral-dark/60">
                                                    {attrData.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {attrData.values.map(
                                                        (val, idx) => {
                                                            const isSelected =
                                                                selectedAttributes[
                                                                    attrData
                                                                        .name
                                                                ]?.value ===
                                                                val.value;
                                                            const isAvailable =
                                                                attrData
                                                                    .attribute
                                                                    ?.is_parent ||
                                                                isValueAvailable(
                                                                    attrData.name,
                                                                    val.value,
                                                                    group,
                                                                );
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    disabled={
                                                                        !isAvailable
                                                                    }
                                                                    onClick={() => {
                                                                        const matching =
                                                                            findBestMatchingVariant(
                                                                                attrData.name,
                                                                                val,
                                                                                group,
                                                                            );
                                                                        if (
                                                                            matching
                                                                        ) {
                                                                            setSelectedVariant(
                                                                                matching,
                                                                            );
                                                                            const newAttrs =
                                                                                {};
                                                                            matching.attributes?.forEach(
                                                                                (
                                                                                    a,
                                                                                ) => {
                                                                                    newAttrs[
                                                                                        a.name ||
                                                                                        a.slug
                                                                                    ] =
                                                                                    {
                                                                                        value:
                                                                                            a
                                                                                                .pivot
                                                                                                ?.value ||
                                                                                            a.value,
                                                                                        item: matching,
                                                                                    };
                                                                                },
                                                                            );
                                                                            setSelectedAttributes(
                                                                                newAttrs,
                                                                            );
                                                                        } else {
                                                                            handleAttributeSelect(
                                                                                attrData.name,
                                                                                val,
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`px-6 py-3 rounded-full text-sm   transition-all border
                                                                ${isSelected ? "bg-primary text-white border-primary shadow-md" : isAvailable ? "bg-white text-neutral-dark border-gray-200 hover:border-primary hover:text-primary" : "bg-gray-50 text-neutral-dark/20 border-gray-50 cursor-not-allowed line-through opacity-50"}
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
                            <div className="space-y-8">
                                {hasValidPrice && (
                                    <div className="flex items-center justify-between border-b border-black/5 pb-8">
                                        <span className="text-sm   text-neutral-dark">
                                            Cantidad
                                        </span>
                                        <div className="flex items-center gap-12">
                                            <button
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(1, quantity - 1),
                                                    )
                                                }
                                                className="text-2xl font-medium hover:text-primary   transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg  w-6 text-center text-neutral-dark">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.min(10, quantity + 1),
                                                    )
                                                }
                                                className="text-2xl font-medium hover:text-primary transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {(() => {
                                    const hasMultipleVariants =
                                        variantsForSelectedGroup.length > 1;
                                    const totalRequiredAttributes =
                                        group?.allAttributes?.length || 0;
                                    const totalSelectedAttributes =
                                        Object.keys(selectedAttributes).length;
                                    const isFullySelected = !(
                                        (hasMultipleVariants &&
                                            (totalSelectedAttributes <
                                                totalRequiredAttributes ||
                                                currentProduct.id ===
                                                item.id)) ||
                                        currentProduct.is_master
                                    );

                                    // buyButton y cartButton: default true (aparecen a menos que el admin los desactive)
                                    const showBuy = data?.buyButton !== false && hasValidPrice;
                                    const showCart = data?.cartButton !== false && hasValidPrice;
                                    // show_whatsapp y quoteButton: default false (solo aparecen si el admin los activa)
                                    // show_whatsapp muestra/oculta el botón único de WhatsApp
                                    // quoteButton determina si el mensaje es de cotización o consulta
                                    const showWhatsApp = data?.show_whatsapp === true;
                                    const whatsappType = data?.quoteButton === true ? "quote" : "consult";

                                    return (
                                        <div className="space-y-4">
                                            {(showBuy || showCart) && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {showBuy && (
                                                        <button
                                                            disabled={!isFullySelected}
                                                            onClick={() => {
                                                                onAddClicked(
                                                                    currentProduct,
                                                                );
                                                                if (isFullySelected) {
                                                                    window.location.href =
                                                                        "/cart";
                                                                }
                                                            }}
                                                            className={`${mibalonPrimaryBtn} ${!isFullySelected ? "opacity-50 cursor-not-allowed hover:bg-primary hover:border-neutral-dark" : ""}`}
                                                        >
                                                            Comprar ahora
                                                        </button>
                                                    )}
                                                    {showCart && (
                                                        <button
                                                            disabled={!isFullySelected}
                                                            onClick={() =>
                                                                onAddClicked(currentProduct)
                                                            }
                                                            className={`${mibalonSecondaryBtn} ${!isFullySelected ? "opacity-50 cursor-not-allowed hover:bg-white hover:border-gray-200" : ""}`}
                                                        >
                                                            Al Carrito
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {showWhatsApp && (
                                                <button
                                                    onClick={() => handleWhatsAppClick(whatsappType)}
                                                    className={mibalonWhatsappBtn}
                                                >
                                                    <WhatsAppIcon className="w-5 h-5" />
                                                    <span>
                                                        {whatsappType === "quote"
                                                            ? "Solicitar Cotización"
                                                            : "Contactar por WhatsApp"}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </div>

                    {/* Specifications & Description */}
                    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-24  border-t border-black/5 pt-10">
                        <section>
                            <h2 className={mibalonSectionTitleClass}>
                                <span>01 Descripción</span>
                                <Plus size={14} className="opacity-20" />
                            </h2>
                            <div
                                className="text-base font-normal leading-relaxed prose prose-neutral max-w-none text-neutral-dark/80"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        currentProduct?.description ||
                                        item?.description,
                                }}
                            />
                        </section>
                        <section>
                            <h2 className={mibalonSectionTitleClass}>
                                <span>02 Especificaciones</span>
                                <Plus size={14} className="opacity-20" />
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {generalSpecifications.length > 0 ? (
                                    <>
                                        {/* Primeros 10 siempre visibles */}
                                        {generalSpecifications.slice(0, 10).map((spec, i) => (
                                            <div
                                                key={i}
                                                className="border-b border-gray-100 pb-4 flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[9px] text-gray-300 w-4">
                                                        {(i + 1).toString().padStart(2, "0")}
                                                    </span>
                                                    <span className="text-sm text-neutral-dark">
                                                        {spec.title || "Característica"}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium tracking-normal text-neutral-dark">
                                                    {spec.description || spec.value}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Especificaciones extra (>10) con animación */}
                                        <AnimatePresence>
                                            {showAllSpecs && generalSpecifications.length > 10 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                                    className="overflow-hidden grid grid-cols-1 gap-4"
                                                >
                                                    {generalSpecifications.slice(10).map((spec, i) => (
                                                        <div
                                                            key={i + 10}
                                                            className="border-b border-gray-100 pb-4 flex items-center justify-between group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[9px] text-gray-300 w-4">
                                                                    {(i + 11).toString().padStart(2, "0")}
                                                                </span>
                                                                <span className="text-sm text-neutral-dark">
                                                                    {spec.title || "Característica"}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-medium tracking-normal text-neutral-dark">
                                                                {spec.description || spec.value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Botón Ver más / Ver menos */}
                                        {generalSpecifications.length > 10 && (
                                            <button
                                                onClick={() => setShowAllSpecs(!showAllSpecs)}
                                                className="mt-2 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-dark hover:text-neutral-dark transition-colors group w-fit"
                                            >
                                                <span>
                                                    {showAllSpecs
                                                        ? "Ver menos características"
                                                        : `Ver más características`}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: showAllSpecs ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ChevronDown size={12} className="opacity-50 group-hover:opacity-100" />
                                                </motion.div>
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-neutral-dark/20">
                                        No hay especificaciones disponibles.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Policy Section */}
                    {data?.showDeliveryPolicy !== false && (
                        <div className="col-span-12">
                            <div
                                onClick={() => setDeliveryPolicyModalOpen(true)}
                                className="bg-[#F7F9FB] text-neutral-dark py-12 px-8 flex items-center justify-between cursor-pointer group border border-gray-100 hover:border-primary/30 hover:bg-white transition-all duration-500 rounded-[2rem]"
                            >
                                <div className="flex items-center gap-12">
                                    <Truck className="w-16 h-16 stroke-[1] text-neutral-dark/40 group-hover:text-primary transition-colors" />
                                    <div>
                                        <h4 className="text-3xl lg:text-4xl font-title uppercase text-neutral-dark group-hover:text-primary transition-colors">
                                            Políticas de Envío
                                        </h4>
                                        <p className="text-sm   text-neutral-dark/40 mt-2">
                                            Condiciones de entrega y tiempos a nivel
                                            nacional
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm  tracking-widest hidden group-hover:block transition-all opacity-0 group-hover:opacity-100">
                                        DETALLES
                                    </span>
                                    <ChevronRight className="w-10 h-10 transform group-hover:translate-x-4 transition-transform stroke-[1]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-12 pb-24">
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-8 px-2">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <span className="text-sm   text-neutral-dark/60 block">
                                        ID: {currentProduct?.sku}
                                    </span>
                                    <span className="text-sm   text-neutral-dark">
                                        {currentProduct?.brand?.name ||
                                            "PREMIUM"}
                                    </span>
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="p-3 bg-gray-50 rounded-full text-neutral-dark active:scale-90 transition-transform"
                                >
                                    <Share2 className="w-5 h-5 stroke-[1.5]" />
                                </button>
                            </div>
                            <h2 className="text-3xl  tracking-tighter leading-[0.9] mb-6 text-neutral-dark">
                                {currentProduct?.name}
                            </h2>
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl  tracking-tighter text-neutral-dark">
                                    {CurrencySymbol()}{" "}
                                    {currentProduct?.final_price}
                                </span>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                        <span className="text-lg text-neutral-dark/20 line-through ">
                                            {CurrencySymbol()}{" "}
                                            {currentProduct?.price}
                                        </span>
                                    )}
                            </div>
                        </div>

                        <div className="border border-gray-100 p-2 bg-white">
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
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    <div className="space-y-10 px-2">
                        {group?.allAttributes?.map((attrData) => (
                            <div key={attrData.name} className="space-y-4">
                                <h3 className="text-sm   text-neutral-dark/60">
                                    {attrData.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {attrData.values.map((val, idx) => {
                                        const isSelected =
                                            selectedAttributes[attrData.name]
                                                ?.value === val.value;
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
                                                        setSelectedVariant(
                                                            matching,
                                                        );
                                                        const newAttrs = {};
                                                        const mAttrs =
                                                            Array.isArray(
                                                                matching.attributes,
                                                            )
                                                                ? matching.attributes
                                                                : Object.values(
                                                                    matching.attributes ||
                                                                    {},
                                                                );
                                                        mAttrs.forEach((a) => {
                                                            newAttrs[
                                                                a.name || a.slug
                                                            ] = {
                                                                value:
                                                                    a.pivot
                                                                        ?.value ||
                                                                    a.value,
                                                                item: matching,
                                                            };
                                                        });
                                                        setSelectedAttributes(
                                                            newAttrs,
                                                        );
                                                    } else {
                                                        handleAttributeSelect(
                                                            attrData.name,
                                                            val,
                                                        );
                                                    }
                                                }}
                                                className={`px-6 py-3 text-sm   border transition-all ${isSelected ? "bg-primary text-white border-neutral-dark shadow-sm" : "bg-white text-neutral-dark border-gray-100"}`}
                                            >
                                                {val.value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-12 px-2 border-t border-gray-100 pt-12">
                        <section>
                            <h2 className="text-sm  tracking-widest mb-6 text-neutral-dark/60">
                                01 / DESCRIPCIÓN
                            </h2>
                            <div
                                className="text-sm font-medium tracking-[0.1em] leading-loose text-neutral-dark"
                                dangerouslySetInnerHTML={{
                                    __html: currentProduct?.description,
                                }}
                            />
                        </section>
                        <section>
                            <h2 className="text-sm  tracking-widest mb-6 text-neutral-dark/60">
                                02 / ESPECIFICACIONES
                            </h2>
                            <div className="space-y-4">
                                {generalSpecifications.map((spec, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center border-b border-gray-50 pb-4"
                                    >
                                        <span className="text-sm   text-neutral-dark">
                                            {spec.title || "Factor"}
                                        </span>
                                        <span className="text-sm  text-neutral-dark/40 text-right">
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
                            className="border border-gray-100 py-8 flex justify-between items-center bg-gray-50 mx-2 active:bg-white transition-colors"
                        >
                            <div className="flex items-center gap-6">
                                <Truck className="w-8 h-8 stroke-[1] text-neutral-dark/60" />
                                <span className="text-sm   text-neutral-dark">
                                    Política de Envío
                                </span>
                            </div>
                            <ChevronRight className="w-6 h-6 stroke-[1] text-neutral-dark/40" />
                        </div>
                    )}

                    {(() => {
                        const showBuy = data?.buyButton !== false && hasValidPrice;
                        const showCart = data?.cartButton !== false && hasValidPrice;
                        const showWhatsApp = data?.show_whatsapp === true;
                        const whatsappType = data?.quoteButton === true ? "quote" : "consult";

                        if (!showBuy && !showCart && !showWhatsApp) return null;

                        return (
                            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-dark p-4 flex flex-col gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                                {(showBuy || showCart) && (
                                    <div className="flex gap-2">
                                        {showCart && (
                                            <button
                                                onClick={() => onAddClicked(currentProduct)}
                                                className={`${mibalonSecondaryBtn} !py-3 !text-sm flex-1`}
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
                                                className={`${mibalonPrimaryBtn} !py-3 !text-sm flex-1`}
                                            >
                                                Pagar
                                            </button>
                                        )}
                                    </div>
                                )}
                                {showWhatsApp && (
                                    <button
                                        onClick={() => handleWhatsAppClick(whatsappType)}
                                        className={`${mibalonWhatsappBtn} !py-3 !text-sm`}
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

                {/* Productos Relacionados */}
                {relationsItems.length > 0 && (
                    <div className="mt-16 mb-8 w-full border-t border-gray-100 pt-16">
                        <ProductSwiperMiBalon
                            data={{ 
                                ...data, 
                                title: data?.related_title || "También te puede interesar", 
                                description: data?.related_description,
                                class_title: data?.related_class_title || "text-3xl font-title uppercase text-neutral-dark mb-8 text-center",
                                class_container: data?.related_class_container || "bg-transparent !py-0",
                                loop: data?.related_loop,
                                autoplay: data?.related_autoplay,
                                type_card_product: data?.related_type_card_product,
                            }}
                            items={relationsItems}
                            cart={cart}
                            setCart={setCart}
                        />
                    </div>
                )}
            </div>

            {/* Modals - Mi Balon Styled */}
            <ReactModal
                isOpen={deliveryPolicyModalOpen}
                onRequestClose={() => setDeliveryPolicyModalOpen(false)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none"
                overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            >
                <div className="bg-white p-12 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] rounded-[2rem] border border-gray-100">
                    <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-6">
                            <Truck className="w-10 h-10 stroke-[1] text-neutral-dark/40" />
                            <h2 className="text-3xl  tracking-tighter text-neutral-dark">
                                Política de Envío
                            </h2>
                        </div>
                        <button
                            onClick={() => setDeliveryPolicyModalOpen(false)}
                            className="hover:opacity-50 transition-opacity"
                        >
                            <X className="w-6 h-6 stroke-[1]" />
                        </button>
                    </div>
                    <div className="prose prose-neutral max-w-none prose-headings: prose-p:font-medium prose-p:tracking-widest prose-p:text-sm prose-p:leading-relaxed text-neutral-dark">
                        <div
                            dangerouslySetInnerHTML={{ __html: deliveryPolicy }}
                        />
                    </div>
                    <button
                        onClick={() => setDeliveryPolicyModalOpen(false)}
                        className="mt-16 w-full py-5 bg-primary text-white font-bold  rounded-full tracking-widest text-sm hover:bg-primary/90 transition-colors uppercase"
                    >
                        Entendido
                    </button>
                </div>
            </ReactModal>



            {/* Cart Modal - Mi Balon Styled */}
            <CartModalMiBalon
                cart={cart}
                data={data}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </main>
    );
};

export default ProductDetailMiBalon;
