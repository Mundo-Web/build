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
    FileText,
    Download,
    Package,
    ShieldCheck,
    Lock,
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
import ProductSwiperMiBalon from "../Products/ProductSwiperMiBalon";

const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
    </svg>
);

const ProductDetailMicjc = ({
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
    const [selectedVariant, setSelectedVariant] = useState(item);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [showAllSpecs, setShowAllSpecs] = useState(false);
    const [relationsItems, setRelationsItems] = useState([]);
    const [isPdfDropdownOpen, setIsPdfDropdownOpen] = useState(false);
    const [deliveryPolicyModalOpen, setDeliveryPolicyModalOpen] = useState(false);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [whatsappAction, setWhatsappAction] = useState("consult");
    const [variantsForSelectedGroup, setVariantsForSelectedGroup] = useState([]);
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [mobileDescOpen, setMobileDescOpen] = useState(false);
    const [mobileSpecsOpen, setMobileSpecsOpen] = useState(false);

    // Current Product Resolution
    const currentProduct = selectedVariant
        ? {
            ...selectedVariant,
            brand: selectedVariant.brand || item?.brand,
            category: selectedVariant.category || item?.category,
        }
        : item;

    // Zoom State
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const imageRef = useRef(null);

    const isOutOfStock = !currentProduct?.stock_unlimited && (currentProduct?.stock <= 0 || !currentProduct?.stock);
    const hasDiscount = Number(currentProduct?.price) > Number(currentProduct?.final_price) && Number(currentProduct?.final_price) > 0;
    const discountPercent = Number(currentProduct?.discount_percent || 0).toFixed(0);

    const pdfFiles = (() => {
        const rawPdf = currentProduct?.pdf || item?.pdf;
        if (!rawPdf) return [];
        let raw = rawPdf;
        if (typeof raw === "string") {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) raw = parsed;
                else raw = [parsed];
            } catch (e) {
                raw = [{ url: raw, name: currentProduct?.name || item?.name || "Ficha Técnica" }];
            }
        }
        if (Array.isArray(raw)) {
            return raw.filter(Boolean).map((p, idx) => {
                if (typeof p === "string") {
                    return { url: p, name: p.split("/").pop() || `Ficha ${idx + 1}` };
                }
                return p;
            });
        }
        return [];
    })();

    useEffect(() => {
        const maxQty = currentProduct?.stock_unlimited ? 99 : (currentProduct?.stock || 0);
        if (maxQty <= 0) {
            setQuantity(0);
        } else if (quantity > maxQty) {
            setQuantity(maxQty);
        } else if (quantity === 0) {
            setQuantity(1);
        }
    }, [currentProduct?.id]);

    const productosRelacionados = async (prod) => {
        try {
            const request = {
                id: prod?.id,
                related_filter: data?.related_filter || "category_id",
                related_limit: data?.related_limit || 10,
            };
            const response = await itemsRest.productsRelations(request);
            if (!response) return;
            setRelationsItems(Object.values(response));
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
        }
    }, [item?.id]);

    // Zoom Handlers
    const handleZoomClick = (e) => {
        if (!isZoomEnabled) {
            const { left, top, width, height } = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setZoomPosition({ x, y });
            setIsZoomEnabled(true);
        } else {
            setIsZoomEnabled(false);
        }
    };

    const handleMouseMove = (e) => {
        if (!isZoomEnabled) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseLeave = () => {
        if (isZoomEnabled) {
            setIsZoomEnabled(false);
        }
    };

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
                    popup: "rounded-2xl border border-gray-100 shadow-xl font-title",
                    confirmButton: "bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-title uppercase ",
                },
            });
        }
    };

    const advisors = General.whatsapp_advisors || [];

    const handleWhatsAppClick = (actionType) => {
        setWhatsappAction(actionType);
        const message = actionType === "quote"
            ? `¡Hola! Me gustaría cotizar este producto: ${currentProduct?.name}\n\nCódigo: ${currentProduct?.sku}\nCantidad: ${quantity} unidades\n\n¿Podrían enviarme más información y disponibilidad?`
            : `¡Hola! Tengo una consulta sobre este producto: ${currentProduct?.name} (Código: ${currentProduct?.sku})`;

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
            }
        }
    };

    // Attribute Selection Logic
    useEffect(() => {
        const itemAttrs = Array.isArray(item?.attributes)
            ? item.attributes
            : Object.values(item?.attributes || {});
        if (itemAttrs.length > 0) {
            const initialSelected = {};
            itemAttrs.forEach((attr) => {
                const attrName = attr.name || attr.slug;
                const attrVal = attr.pivot?.value || attr.value;
                if (attrName && attrVal) {
                    initialSelected[attrName] = {
                        value: attrVal,
                        item: item,
                    };
                }
            });
            setSelectedAttributes(initialSelected);
        }
    }, [item]);

    // Grouping & Variants
    const group = item?.group || null;

    useEffect(() => {
        const fetchVariants = async () => {
            if (group?.name) {
                setIsLoadingVariants(true);
                try {
                    const response = await itemsRest.byGroup(group.name);
                    const variantsData = Array.isArray(response)
                        ? response
                        : response?.data || [];
                    const uniqueVariants = [];
                    const seenIds = new Set();
                    variantsData.forEach((v) => {
                        if (v && !seenIds.has(v.id)) {
                            seenIds.add(v.id);
                            uniqueVariants.push(v);
                        }
                    });
                    setVariantsForSelectedGroup(uniqueVariants);
                } catch (error) {
                    setVariantsForSelectedGroup([]);
                } finally {
                    setIsLoadingVariants(false);
                }
            }
        };
        fetchVariants();
    }, [group?.name]);

    const handleAttributeSelect = (attributeName, valueObj) => {
        const newSelected = {
            ...selectedAttributes,
            [attributeName]: {
                value: valueObj.value,
                item: currentProduct,
            },
        };
        setSelectedAttributes(newSelected);

        if (variantsForSelectedGroup.length > 0) {
            const matchingVariant = variantsForSelectedGroup.find((v) => {
                const vAttrs = Array.isArray(v.attributes)
                    ? v.attributes
                    : Object.values(v.attributes || {});
                return Object.entries(newSelected).every(([attrName, selObj]) => {
                    const found = vAttrs.find((a) => (a.name || a.slug) === attrName);
                    return found && (found.pivot?.value || found.value) === selObj.value;
                });
            });

            if (matchingVariant) {
                setSelectedVariant(matchingVariant);
                if (matchingVariant.image) {
                    setActiveImage(matchingVariant.image);
                }
            }
        }
    };

    const onAddClicked = (product) => {
        if (!product) return;
        const newCart = structuredClone(cart || []);
        const index = newCart.findIndex((x) => x.id === product.id);
        const qtyToAdd = Math.max(1, quantity);

        if (index === -1) {
            newCart.push({ ...product, quantity: qtyToAdd });
        } else {
            newCart[index].quantity += qtyToAdd;
        }

        setCart(newCart);
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 3000);
    };

    const hasValidPrice = Number(currentProduct?.final_price || currentProduct?.price) > 0;
    const deliveryPolicy = generals?.find((g) => g.correlative === "delivery_policy")?.description || "Envíos a nivel nacional rápidos y seguros.";

    // Medios de pago desde Base de Datos (Generals)
    const paymentMethodsTitle = generals?.find((g) => g.correlative === "payment_methods_title")?.description || General?.payment_methods_title || "Contamos con múltiples medios de pago";
    const paymentMethodsFromDb = (() => {
        const raw = generals?.find((g) => g.correlative === "payment_methods")?.description || General?.payment_methods;
        if (!raw) return null;
        if (Array.isArray(raw)) return raw.filter((p) => p.enabled !== false);
        if (typeof raw === "string") {
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed.filter((p) => p.enabled !== false) : null;
            } catch (e) {
                return null;
            }
        }
        return null;
    })();

    // Fallback de Medios de Pago por Defecto si no están configurados en DB
    const defaultPaymentMethods = [
        { name: "Visa", icon: "/assets/img/banks/visa.png", type: "image" },
        { name: "Yape", icon: "/assets/img/banks/yape.png", type: "image" },
        { name: "Mastercard", icon: "/assets/img/banks/mastercard.png", type: "image" },
        { name: "BCP", icon: "/assets/img/banks/bcp.svg", type: "image" },
        { name: "BBVA", icon: "/assets/img/banks/bbva.svg", type: "image" },
        { name: "Interbank", icon: "/assets/img/banks/interbank.svg", type: "image" },
        { name: "Scotiabank", icon: "", type: "text" },
        { name: "Plin", icon: "/assets/img/banks/plin.png", type: "image" },
    ];

    const activePaymentMethods = (paymentMethodsFromDb && paymentMethodsFromDb.length > 0)
        ? paymentMethodsFromDb
        : defaultPaymentMethods;

    const generalSpecifications = (
        Array.isArray(currentProduct?.specifications) && currentProduct.specifications.length > 0
            ? currentProduct.specifications
            : Array.isArray(item?.specifications)
                ? item.specifications
                : []
    ).filter((s) => s.type === "general" || !s.type);

    return (
        <main className="bg-white min-h-screen text-neutral-dark py-6 lg:py-14">
            <div className="px-primary 2xl:px-0 mx-auto 2xl:max-w-7xl">

                {/* Desktop View */}
                <article
                    itemScope={true}
                    itemType="https://schema.org/Product"
                    className="hidden md:grid grid-cols-12 gap-8 lg:gap-12"
                >
                    {/* Left Column: Gallery */}
                    <div className="col-span-12 lg:col-span-7 flex gap-5">
                        {/* Thumbnails list */}
                        <div className="w-20 lg:w-24 space-y-3 shrink-0">
                            {[
                                currentProduct?.image,
                                ...(Array.isArray(currentProduct?.images)
                                    ? currentProduct.images
                                    : Object.values(currentProduct?.images || {})),
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
                                    const isActive = (activeImage?.url || activeImage || currentProduct?.image) === imgUrl;
                                    return (
                                        <div
                                            key={i}
                                            role="button"
                                            onClick={() => setActiveImage(imgUrl)}
                                            className={`aspect-square border p-1 bg-white cursor-pointer transition-all rounded-xl ${isActive
                                                ? "border-primary ring-2 ring-primary/20 shadow-xs"
                                                : "border-gray-200 hover:border-neutral-light"
                                                }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${imgUrl}`}
                                                alt={`${currentProduct?.name || "Producto"} - Vista ${i + 1}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Main Image View */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 border border-gray-200 aspect-square max-h-min p-4 bg-white group overflow-hidden relative rounded-2xl shadow-2xs"
                        >
                            <div
                                ref={imageRef}
                                className="aspect-square bg-white cursor-zoom-in relative overflow-hidden rounded-xl"
                                onClick={handleZoomClick}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImage?.url || activeImage || currentProduct?.image}
                                        initial={{ opacity: 0, scale: 1.02 }}
                                        animate={{
                                            opacity: 1,
                                            scale: isZoomEnabled ? 1.6 : 1,
                                        }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.25 }}
                                        src={`/storage/images/item/${activeImage?.url || activeImage || currentProduct?.image}`}
                                        alt={currentProduct?.name || "Imagen principal del producto"}
                                        itemProp="image"
                                        className="w-full h-full object-contain"
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
                                    {!isZoomEnabled && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare();
                                            }}
                                            aria-label="Compartir producto"
                                            className="bg-white text-neutral-light p-2.5 hover:text-primary transition-all shadow-xs border border-gray-200 rounded-full"
                                        >
                                            <Share2 className="w-4 h-4 stroke-[1.5]" />
                                        </button>
                                    )}
                                    {!isZoomEnabled && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setZoomPosition({ x: 50, y: 50 });
                                                setIsZoomEnabled(true);
                                            }}
                                            className="bg-primary text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                                        >
                                            <ZoomIn className="w-4 h-4 stroke-[1.5]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Exact structure as image */}
                    <section className="col-span-12 lg:col-span-5 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            {/* 1. Header: ONLY SKU */}
                            <div className="text-sm font-semibold text-neutral-light uppercase ">
                                SKU: <span itemProp="sku" className="font-bold text-neutral-dark">{currentProduct?.sku || "N/A"}</span>
                            </div>

                            {/* 2. OFERTA Badge (if discount) */}
                            {hasDiscount && (
                                <div>
                                    <span className="bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase  inline-block">
                                        OFERTA
                                    </span>
                                </div>
                            )}

                            {/* 3. Product Title */}
                            <h1
                                itemProp="name"
                                className={`text-xl lg:text-2xl font-medium text-neutral-dark  ${data?.class_title || ""}`}
                            >
                                <TextWithHighlight
                                    text={currentProduct?.name}
                                    color="bg-primary text-white"
                                />
                            </h1>

                            {/* 4. Price Row (Electric blue price + line-through + AHORRA %) */}
                            <div
                                itemProp="offers"
                                itemScope={true}
                                itemType="https://schema.org/Offer"
                                className="flex items-end flex-wrap gap-2 pt-1 pb-1"
                            >
                                <meta itemProp="priceCurrency" content="PEN" />
                                <link
                                    itemProp="availability"
                                    href={!isOutOfStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
                                />

                                <span className="text-2xl lg:text-3xl font-bold text-neutral-dark ">
                                    {CurrencySymbol()}{" "}
                                    <span itemProp="price" content={currentProduct?.final_price || currentProduct?.price}>
                                        {currentProduct?.final_price || currentProduct?.price}
                                    </span>
                                </span>

                                {hasDiscount && (
                                    <>
                                        <span className="text-base text-neutral-light line-through font-semibold ml-2">
                                            {CurrencySymbol()} {currentProduct?.price}
                                        </span>
                                        <span className="bg-danger text-white text-xs font-bold px-2.5 py-2 rounded-full uppercase ml-2  leading-none">
                                            AHORRA {discountPercent}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* 5. Stock status (● En stock (+10) / ● Agotado) */}
                            <div className="flex items-center gap-2">
                                {!isOutOfStock ? (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-success ">
                                        <span className="w-2.5 h-2.5 bg-success rounded-full inline-block"></span>
                                        <span>
                                            En stock {currentProduct?.stock_unlimited ? "(+10)" : (currentProduct?.stock > 10 ? "(+10)" : `(${currentProduct?.stock || 1})`)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-danger ">
                                        <span className="w-2.5 h-2.5 bg-danger rounded-full inline-block"></span>
                                        <span>Agotado</span>
                                    </div>
                                )}
                            </div>

                            {/* Variants Selection (if grouped) */}
                            {isLoadingVariants ? (
                                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-light animate-pulse py-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    Cargando Variantes...
                                </div>
                            ) : (
                                group?.allAttributes?.length > 0 && (
                                    <div className="space-y-3 py-2 border-y border-gray-100">
                                        {group.allAttributes.map((attrData) => (
                                            <div key={attrData.name} className="space-y-1.5">
                                                <h3 className="text-xs font-bold uppercase  text-neutral-light">
                                                    {attrData.name}:
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {attrData.values.map((val, idx) => {
                                                        const isSelected = selectedAttributes[attrData.name]?.value === val.value;
                                                        return (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handleAttributeSelect(attrData.name, val)}
                                                                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase  transition-all border ${isSelected
                                                                    ? "bg-primary text-white border-primary shadow-xs"
                                                                    : "bg-white text-neutral-light border-gray-300 hover:border-primary hover:text-primary"
                                                                    }`}
                                                            >
                                                                {val.value}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}

                            {/* 6. Quantity + Single Add to Cart Button (Misma Fila - Rounded Full) */}
                            <div className="pt-2">
                                {isOutOfStock ? (
                                    <button
                                        disabled
                                        className="w-full h-[48px] bg-gray-200 text-gray-500 font-bold text-base rounded-full cursor-not-allowed border border-gray-300 flex items-center justify-center opacity-80"
                                    >
                                        Agotado
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        {/* Quantity Selector box */}
                                        <div className="border border-gray-300 rounded-full flex items-center justify-between px-4 h-[48px] w-28 md:w-32 bg-white text-neutral-light font-semibold shadow-2xs shrink-0 select-none">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1 || isOutOfStock}
                                                className="text-gray-500 hover:text-neutral-dark text-xl font-bold px-1.5  transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                -
                                            </button>
                                            <span className="text-base font-bold w-6 text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.min(
                                                            currentProduct?.stock_unlimited ? 99 : (currentProduct?.stock || 1),
                                                            quantity + 1
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    quantity >= (currentProduct?.stock_unlimited ? 99 : (currentProduct?.stock || 1)) ||
                                                    isOutOfStock
                                                }
                                                className="text-gray-500 hover:text-neutral-dark text-xl font-bold px-1.5  transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Single "Agregar al carrito" Button */}
                                        <button
                                            type="button"
                                            onClick={() => onAddClicked(currentProduct)}
                                            className="flex-1 h-[48px] bg-primary hover:bg-[#0044aa] text-white font-semibold text-base px-6 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                                        >
                                            <span>Agregar al carrito</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 7. WhatsApp Button */}
                            {data?.show_whatsapp !== false && (
                                <button
                                    type="button"
                                    onClick={() => handleWhatsAppClick(data?.quoteButton ? "quote" : "consult")}
                                    className="w-full h-[48px] bg-success hover:bg-success text-white font-bold text-sm md:text-base uppercase  px-6 rounded-full flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
                                >
                                    <WhatsAppIcon className="w-6 h-6" />
                                    <span>
                                        {data?.quoteButton ? "SOLICITAR COTIZACIÓN" : "CONSULTAR POR WHATSAPP"}
                                    </span>
                                </button>
                            )}

                            {/* 8. Dual Shipping Info Box */}
                            <div className="bg-white rounded-xl  grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                                {/* Envío a Lima */}
                                <div className="flex items-start gap-3 border p-3 rounded-xl">



                                    <svg className="h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M11.9998 14H12.9998C14.0998 14 14.9998 13.1 14.9998 12V2H5.99976C4.49976 2 3.18977 2.82999 2.50977 4.04999" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 17C2 18.66 3.34 20 5 20H6C6 18.9 6.9 18 8 18C9.1 18 10 18.9 10 20H14C14 18.9 14.9 18 16 18C17.1 18 18 18.9 18 20H19C20.66 20 22 18.66 22 17V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L18.58 6.01001C18.22 5.39001 17.56 5 16.84 5H15V12C15 13.1 14.1 14 13 14H12" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 12V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L22 12Z" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 8H8" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 11H6" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 14H4" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-neutral-dark">
                                            Envío a Lima
                                        </span>
                                        <span className="text-xs font-medium text-neutral-light">
                                            Recíbelo hoy
                                        </span>
                                    </div>
                                </div>

                                {/* Envío a Provincias */}
                                <div className="flex items-start gap-3 border p-3 rounded-xl">

                                    <svg className="w-6 h-6 text-primary shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0909 2.54877C17.5385 2.23946 16.9504 2.20831 16.3288 2.286C15.7383 2.3598 15.02 2.54651 14.1567 2.7709L12.1384 3.2954C11.2755 3.51963 10.557 3.70634 10.0072 3.92891C9.4292 4.16293 8.92943 4.47736 8.60526 5.02195C8.27903 5.56998 8.24664 6.15584 8.32794 6.76777C8.40459 7.34473 8.59805 8.04488 8.82853 8.87901L9.37108 10.8429C9.60161 11.6775 9.79499 12.3775 10.0259 12.9139C10.271 13.4835 10.5985 13.9684 11.1541 14.2795C11.7064 14.5888 12.2945 14.62 12.9162 14.5423C13.5066 14.4685 14.225 14.2818 15.0882 14.0574L17.1066 13.5329C17.9695 13.3086 18.688 13.1219 19.2377 12.8994C19.8157 12.6653 20.3155 12.3509 20.6397 11.8063C20.9659 11.2583 20.9983 10.6724 20.917 10.0605C20.8403 9.48355 20.6469 8.7834 20.4164 7.94926L19.8738 5.98536C19.6433 5.1508 19.4499 4.45076 19.2191 3.91434C18.9739 3.34477 18.6465 2.85989 18.0909 2.54877ZM14.485 4.2354C15.4099 3.99503 16.0331 3.83463 16.5148 3.77442C16.9764 3.71673 17.1974 3.7676 17.358 3.85754C17.5154 3.94567 17.6656 4.09931 17.8413 4.50734C18.0265 4.93768 18.1937 5.53684 18.442 6.43548L18.9564 8.29754C19.2048 9.19641 19.3687 9.79611 19.4301 10.2581C19.4883 10.6968 19.4362 10.8956 19.3508 11.0391C19.2633 11.186 19.1047 11.3349 18.6748 11.509C18.2271 11.6903 17.605 11.8535 16.6798 12.0939L14.76 12.5929C13.835 12.8333 13.2118 12.9937 12.7301 13.0539C12.2685 13.1116 12.0476 13.0607 11.8869 12.9707C11.7296 12.8826 11.5793 12.729 11.4037 12.3209C11.2185 11.8906 11.0512 11.2914 10.8029 10.3928L10.2885 8.53074C10.0402 7.63187 9.87625 7.03217 9.81487 6.57022C9.75658 6.13148 9.80876 5.93269 9.89418 5.78921C9.98164 5.64227 10.1402 5.49334 10.5701 5.31928C11.0179 5.138 11.64 4.97476 12.5651 4.73434L14.485 4.2354Z" fill="#0151fc"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.2007 4.72469C2.80157 4.61396 2.38823 4.84775 2.27749 5.24688C2.16675 5.64602 2.40054 6.05936 2.79968 6.17009L4.50338 6.64278C4.92898 6.76086 5.24592 7.08236 5.35419 7.47427L7.3055 14.5374C7.23053 14.5521 7.1556 14.5692 7.0808 14.5887C5.10375 15.1025 3.89563 17.0913 4.43836 19.0558C4.97848 21.0108 7.03215 22.1384 9.00137 21.6266C10.7247 21.1788 11.8638 19.6102 11.7683 17.9139L20.1888 15.7256C20.5897 15.6214 20.8303 15.2119 20.7261 14.811C20.6219 14.4101 20.2124 14.1696 19.8115 14.2738L11.3734 16.4667C10.8651 15.4794 9.93146 14.7927 8.86688 14.5562L6.80003 7.07483C6.5469 6.1586 5.82129 5.45177 4.9044 5.19738L3.2007 4.72469ZM7.45809 16.0404C8.66981 15.7255 9.88575 16.4288 10.198 17.5589C10.5076 18.6796 9.82797 19.862 8.62408 20.1748C7.41235 20.4897 6.19641 19.7864 5.8842 18.6563C5.5746 17.5357 6.25419 16.3533 7.45809 16.0404Z" fill="#0151fc"></path> </g></svg>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-neutral-dark">
                                            Envío a Provincias
                                        </span>
                                        <span className="text-xs font-normal text-neutral-light">
                                            Llega entre: 1 a 3 Días
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 9. Payment Methods Box */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-2xs">
                                <h4 className="text-xs font-bold text-neutral-light">
                                    {paymentMethodsTitle}
                                </h4>
                                <div className="flex items-center flex-wrap gap-4">
                                    {activePaymentMethods.map((method, idx) => {
                                        const hasIcon = Boolean(method.icon);
                                        const iconUrl = method.icon
                                            ? (method.icon.startsWith("http") || method.icon.startsWith("/")
                                                ? method.icon
                                                : `/assets/resources/${method.icon}`)
                                            : null;

                                        return (
                                            <div
                                                key={idx}
                                                title={method.name}
                                                className="  bg-white   flex items-center justify-center shadow-2xs hover:border-gray-300 transition-colors"
                                            >
                                                {hasIcon ? (
                                                    <img
                                                        src={iconUrl}
                                                        alt={method.name}
                                                        className="h-3 object-contain"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = "inline-block";
                                                        }}
                                                    />
                                                ) : null}
                                                <span
                                                    className={`text-[10px] font-bold uppercase text-gray-700 tracking-tight ${hasIcon ? "hidden" : "inline-block"
                                                        }`}
                                                >
                                                    {method.nameText || method.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 10. Compra Protegida Box */}
                            <div className="  p-3 flex gap-2   text-xs text-neutral-light ">
                                <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 21V23M16 21C15.447 21 15 20.553 15 20C15 19.447 15.447 19 16 19C16.553 19 17 19.447 17 20C17 20.553 16.553 21 16 21ZM18 13H11V6C11 3.238 13.238 1 16 1C18.762 1 21 3.238 21 6V13H26C26.594 13 27 13.469 27 14V20C27 26.075 22.075 31 16 31C9.925 31 5 26.075 5 20V14C5 13.437 5.453 13 6 13H8" stroke="#0151fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                <span>
                                    <strong className="text-primary font-semibold">Compra Protegida.</strong> Recibe el producto que esperabas o te devolvemos tu dinero.
                                </span>
                            </div>

                            {/* 11. Descargables y Fichas Técnicas (PDF) */}
                            {pdfFiles.length > 0 && (
                                <div className="pt-1">
                                    {pdfFiles.length === 1 ? (
                                        <a
                                            href={`/storage/images/item/${pdfFiles[0].url || pdfFiles[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-light hover:text-primary transition-colors group cursor-pointer"
                                        >
                                            <span className="underline underline-offset-4 decoration-gray-300 group-hover:decoration-primary">
                                                {pdfFiles[0].name ? (pdfFiles[0].name.length > 40 ? `${pdfFiles[0].name.slice(0, 40)}...` : pdfFiles[0].name) : "Descargar Ficha Técnica"}
                                            </span>
                                            <Download className="w-3.5 h-3.5 text-neutral-light group-hover:text-primary transition-colors shrink-0" />
                                        </a>
                                    ) : (
                                        <div className="space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => setIsPdfDropdownOpen(!isPdfDropdownOpen)}
                                                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-light hover:text-primary transition-colors group cursor-pointer focus:outline-none"
                                            >
                                                <span className="underline underline-offset-4 decoration-gray-300 group-hover:decoration-primary">
                                                    Descargables y Fichas Técnicas
                                                </span>
                                                <ChevronDown
                                                    className={`w-3.5 h-3.5 text-neutral-light group-hover:text-primary transition-transform duration-200 ${isPdfDropdownOpen ? "rotate-180 text-primary" : ""
                                                        }`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {isPdfDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-2 border-t border-gray-100">
                                                            {pdfFiles.map((pdf, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="py-2 border-b border-gray-50 flex items-center justify-between group hover:bg-gray-50 px-1 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-2 min-w-0 flex-1 me-3">
                                                                        <span className="text-[10px] text-neutral-light ">
                                                                            {(idx + 1).toString().padStart(2, "0")}
                                                                        </span>
                                                                        <span className="text-xs font-medium text-neutral-light group-hover:text-primary transition-colors truncate">
                                                                            {pdf.name || (typeof pdf === "string" ? pdf.split("/").pop() : `Documento ${idx + 1}`)}
                                                                        </span>
                                                                    </div>
                                                                    <a
                                                                        href={`/storage/images/item/${pdf.url || pdf}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline shrink-0"
                                                                    >
                                                                        <span>Descargar</span>
                                                                        <Download className="w-3.5 h-3.5" />
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </section>

                    {/* Specifications & Description Full Width Section */}
                    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-200 pt-10 mt-6">
                        {/* Description */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-neutral-dark flex items-center justify-between pb-3 border-b border-gray-200">
                                <span>01 Descripción</span>
                                <Plus size={16} className="text-neutral-light" />
                            </h2>
                            <div
                                itemProp="description"
                                className="text-sm  prose prose-neutral max-w-none text-neutral-light"
                                dangerouslySetInnerHTML={{
                                    __html: currentProduct?.description || item?.description || "No hay descripción disponible.",
                                }}
                            />
                        </section>

                        {/* Specifications */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-neutral-dark flex items-center justify-between pb-3 border-b border-gray-200">
                                <span>02 Especificaciones</span>
                                <Plus size={16} className="text-neutral-light" />
                            </h2>
                            <div className="space-y-2">
                                {generalSpecifications.length > 0 ? (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                                <tbody className="divide-y divide-gray-100">
                                                    {(showAllSpecs ? generalSpecifications : generalSpecifications.slice(0, 10)).map((spec, i) => (
                                                        <tr
                                                            key={i}
                                                            className="hover:bg-gray-50/70 transition-colors group"
                                                        >
                                                            <th
                                                                scope="row"
                                                                className="py-2.5 pr-4 font-medium text-neutral-light w-2/5 align-middle text-left"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] text-neutral-light opacity-80">
                                                                        {(i + 1).toString().padStart(2, "0")}
                                                                    </span>
                                                                    <span className="group-hover:text-primary transition-colors capitalize">
                                                                        {spec.title || spec.name || "Característica"}
                                                                    </span>
                                                                </div>
                                                            </th>
                                                            <td className="py-2.5 pl-4 font-semibold text-neutral-dark text-right sm:text-left align-middle">
                                                                {spec.description || spec.value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {generalSpecifications.length > 10 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAllSpecs(!showAllSpecs)}
                                                className="text-xs font-semibold text-primary hover:underline pt-2 flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span>{showAllSpecs ? "Ver menos especificaciones" : "Ver más especificaciones"}</span>
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllSpecs ? "rotate-180" : ""}`} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-neutral-light py-2">
                                        No hay especificaciones adicionales registradas.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Delivery Policy Full Banner */}
                    {data?.showDeliveryPolicy !== false && (
                        <div className="col-span-12 mt-4">
                            <div
                                onClick={() => setDeliveryPolicyModalOpen(true)}
                                className="bg-gray-50 text-neutral-light py-8 px-6 flex items-center justify-between cursor-pointer group border border-gray-200 hover:border-primary/40 hover:bg-white transition-all duration-300 rounded-2xl"
                            >
                                <div className="flex items-center gap-6">
                                    <Truck className="w-10 h-10 stroke-[1.5] text-primary" />
                                    <div>
                                        <h4 className="text-xl font-bold text-neutral-dark group-hover:text-primary transition-colors">
                                            Políticas de Envío
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Condiciones de entrega y tiempos de cobertura a nivel nacional
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold uppercase  text-primary hidden group-hover:block transition-all">
                                        VER DETALLES
                                    </span>
                                    <ChevronRight className="w-6 h-6 text-neutral-light group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    )}
                </article>

                {/* Mobile View */}
                <div className="md:hidden space-y-5 ">
                    {/* 1. Header Info (ONLY SKU) */}
                    <div className="flex justify-between items-start">
                        <div className="text-xs font-medium text-neutral-light">
                            SKU: <span className="font-bold text-neutral-dark">{currentProduct?.sku || "N/A"}</span>
                        </div>
                        <button
                            onClick={handleShare}
                            aria-label="Compartir producto"
                            className="p-2 bg-gray-100 rounded-full text-neutral-light active:scale-90 transition-transform cursor-pointer"
                        >
                            <Share2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                    </div>

                    {/* 2. OFERTA Badge */}
                    {hasDiscount && (
                        <div>
                            <span className="bg-danger text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                                Oferta
                            </span>
                        </div>
                    )}

                    {/* 3. Title */}
                    <h1 className="text-lg font-semibold text-neutral-dark ">
                        {currentProduct?.name}
                    </h1>

                    {/* Image Swiper */}
                    <div className="border border-gray-200 rounded-xl p-2 bg-white shadow-2xs">
                        <Swiper
                            modules={[Pagination, Navigation, Autoplay]}
                            pagination={{ clickable: true }}
                            grabCursor={true}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            className="aspect-square rounded-lg"
                        >
                            {[
                                currentProduct?.image,
                                ...(Array.isArray(currentProduct?.images)
                                    ? currentProduct.images
                                    : Object.values(currentProduct?.images || {})),
                            ].map((img, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        src={`/storage/images/item/${img?.url || img}`}
                                        alt={`${currentProduct?.name || "Producto"} - imagen ${i + 1}`}
                                        className="w-full h-full object-contain"
                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* 4. Price */}
                    <div className="flex items-end flex-wrap gap-2">
                        <span className="text-2xl font-bold text-primary">
                            {CurrencySymbol()} {currentProduct?.final_price || currentProduct?.price}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-sm text-neutral-light line-through font-semibold">
                                    {CurrencySymbol()} {currentProduct?.price}
                                </span>
                                <span className="bg-danger text-white text-[10px] font-medium px-3 py-0.5 rounded-full">
                                    Ahorra {discountPercent}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* 5. Stock */}
                    <div className="flex items-center gap-2">
                        {!isOutOfStock ? (
                            <div className="flex items-center gap-2 text-xs font-semibold text-success ">
                                <span className="w-2 h-2 bg-success rounded-full inline-block"></span>
                                <span>
                                    En stock {currentProduct?.stock_unlimited ? "(+10)" : (currentProduct?.stock > 10 ? "(+10)" : `(${currentProduct?.stock || 1})`)}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-semibold text-danger ">
                                <span className="w-2 h-2 bg-danger rounded-full inline-block"></span>
                                <span>Agotado</span>
                            </div>
                        )}
                    </div>

                    {/* Variants Mobile */}
                    {group?.allAttributes?.length > 0 && (
                        <div className="space-y-2 py-2 border-y border-gray-100">
                            {group.allAttributes.map((attrData) => (
                                <div key={attrData.name} className="space-y-1">
                                    <h3 className="text-xs font-semibold text-neutral-light">
                                        {attrData.name}:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {attrData.values.map((val, idx) => {
                                            const isSelected = selectedAttributes[attrData.name]?.value === val.value;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAttributeSelect(attrData.name, val)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${isSelected
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-white text-neutral-light border-gray-300"
                                                        }`}
                                                >
                                                    {val.value}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 6. Quantity + Add to cart Mobile */}
                    <div>
                        {isOutOfStock ? (
                            <button
                                disabled
                                className="w-full h-[46px] bg-gray-200 text-gray-500 font-bold text-sm rounded-full cursor-not-allowed border border-gray-300 flex items-center justify-center opacity-80"
                            >
                                Agotado
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="border border-gray-300 rounded-full flex items-center justify-between px-3 h-[46px] w-28 bg-white text-neutral-light font-semibold shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="text-gray-500 text-lg font-bold  px-1"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-bold w-5 text-center">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity(
                                                Math.min(
                                                    currentProduct?.stock_unlimited ? 99 : (currentProduct?.stock || 1),
                                                    quantity + 1
                                                )
                                            )
                                        }
                                        className="text-gray-500 text-lg font-bold  px-1"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => onAddClicked(currentProduct)}
                                    className="flex-1 h-[46px] bg-primary text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
                                >
                                    <span>Agregar al carrito</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 7. WhatsApp Button Mobile */}
                    {data?.show_whatsapp !== false && (
                        <button
                            onClick={() => handleWhatsAppClick(data?.quoteButton ? "quote" : "consult")}
                            className="w-full h-[48px] bg-success text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                            <WhatsAppIcon className="w-5 h-5" />
                            <span>{data?.quoteButton ? "Solicitar cotización" : "Consultar por WhatsApp"}</span>
                        </button>
                    )}

                    {/* 8. Dual Shipping Box Mobile */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-3 shadow-2xs">
                        {/* Envío a Lima */}
                        <div className="flex items-center gap-3">
                            <svg className="h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M11.9998 14H12.9998C14.0998 14 14.9998 13.1 14.9998 12V2H5.99976C4.49976 2 3.18977 2.82999 2.50977 4.04999" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 17C2 18.66 3.34 20 5 20H6C6 18.9 6.9 18 8 18C9.1 18 10 18.9 10 20H14C14 18.9 14.9 18 16 18C17.1 18 18 18.9 18 20H19C20.66 20 22 18.66 22 17V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L18.58 6.01001C18.22 5.39001 17.56 5 16.84 5H15V12C15 13.1 14.1 14 13 14H12" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 12V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L22 12Z" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 8H8" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 11H6" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 14H4" stroke="#0151fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-dark">Envío a Lima</span>
                                <span className="text-xs font-medium text-neutral-light">Recíbelo hoy</span>
                            </div>
                        </div>
                        {/* Envío a Provincias */}
                        <div className="border-t border-gray-100 pt-2.5 flex items-center gap-3">
                            <svg className="w-6 h-6 text-primary shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0909 2.54877C17.5385 2.23946 16.9504 2.20831 16.3288 2.286C15.7383 2.3598 15.02 2.54651 14.1567 2.7709L12.1384 3.2954C11.2755 3.51963 10.557 3.70634 10.0072 3.92891C9.4292 4.16293 8.92943 4.47736 8.60526 5.02195C8.27903 5.56998 8.24664 6.15584 8.32794 6.76777C8.40459 7.34473 8.59805 8.04488 8.82853 8.87901L9.37108 10.8429C9.60161 11.6775 9.79499 12.3775 10.0259 12.9139C10.271 13.4835 10.5985 13.9684 11.1541 14.2795C11.7064 14.5888 12.2945 14.62 12.9162 14.5423C13.5066 14.4685 14.225 14.2818 15.0882 14.0574L17.1066 13.5329C17.9695 13.3086 18.688 13.1219 19.2377 12.8994C19.8157 12.6653 20.3155 12.3509 20.6397 11.8063C20.9659 11.2583 20.9983 10.6724 20.917 10.0605C20.8403 9.48355 20.6469 8.7834 20.4164 7.94926L19.8738 5.98536C19.6433 5.1508 19.4499 4.45076 19.2191 3.91434C18.9739 3.34477 18.6465 2.85989 18.0909 2.54877ZM14.485 4.2354C15.4099 3.99503 16.0331 3.83463 16.5148 3.77442C16.9764 3.71673 17.1974 3.7676 17.358 3.85754C17.5154 3.94567 17.6656 4.09931 17.8413 4.50734C18.0265 4.93768 18.1937 5.53684 18.442 6.43548L18.9564 8.29754C19.2048 9.19641 19.3687 9.79611 19.4301 10.2581C19.4883 10.6968 19.4362 10.8956 19.3508 11.0391C19.2633 11.186 19.1047 11.3349 18.6748 11.509C18.2271 11.6903 17.605 11.8535 16.6798 12.0939L14.76 12.5929C13.835 12.8333 13.2118 12.9937 12.7301 13.0539C12.2685 13.1116 12.0476 13.0607 11.8869 12.9707C11.7296 12.8826 11.5793 12.729 11.4037 12.3209C11.2185 11.8906 11.0512 11.2914 10.8029 10.3928L10.2885 8.53074C10.0402 7.63187 9.87625 7.03217 9.81487 6.57022C9.75658 6.13148 9.80876 5.93269 9.89418 5.78921C9.98164 5.64227 10.1402 5.49334 10.5701 5.31928C11.0179 5.138 11.64 4.97476 12.5651 4.73434L14.485 4.2354Z" fill="#0151fc"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.2007 4.72469C2.80157 4.61396 2.38823 4.84775 2.27749 5.24688C2.16675 5.64602 2.40054 6.05936 2.79968 6.17009L4.50338 6.64278C4.92898 6.76086 5.24592 7.08236 5.35419 7.47427L7.3055 14.5374C7.23053 14.5521 7.1556 14.5692 7.0808 14.5887C5.10375 15.1025 3.89563 17.0913 4.43836 19.0558C4.97848 21.0108 7.03215 22.1384 9.00137 21.6266C10.7247 21.1788 11.8638 19.6102 11.7683 17.9139L20.1888 15.7256C20.5897 15.6214 20.8303 15.2119 20.7261 14.811C20.6219 14.4101 20.2124 14.1696 19.8115 14.2738L11.3734 16.4667C10.8651 15.4794 9.93146 14.7927 8.86688 14.5562L6.80003 7.07483C6.5469 6.1586 5.82129 5.45177 4.9044 5.19738L3.2007 4.72469ZM7.45809 16.0404C8.66981 15.7255 9.88575 16.4288 10.198 17.5589C10.5076 18.6796 9.82797 19.862 8.62408 20.1748C7.41235 20.4897 6.19641 19.7864 5.8842 18.6563C5.5746 17.5357 6.25419 16.3533 7.45809 16.0404Z" fill="#0151fc"></path> </g></svg>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-dark">Envío a Provincias</span>
                                <span className="text-xs font-normal text-neutral-light">Llega entre: 1 a 3 Días</span>
                            </div>
                        </div>
                    </div>

                    {/* 9. Payment Methods Mobile */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                        <h4 className="text-sm font-bold text-neutral-light">
                            {paymentMethodsTitle}
                        </h4>
                        <div className="flex items-center flex-wrap gap-1.5">
                            {activePaymentMethods.map((method, idx) => {
                                const hasIcon = Boolean(method.icon);
                                const iconUrl = method.icon
                                    ? (method.icon.startsWith("http") || method.icon.startsWith("/")
                                        ? method.icon
                                        : `/assets/resources/${method.icon}`)
                                    : null;

                                return (
                                    <div
                                        key={idx}
                                        title={method.name}
                                        className="h-7 px-2 bg-white flex items-center justify-center shadow-2xs"
                                    >
                                        {hasIcon ? (
                                            <img
                                                src={iconUrl}
                                                alt={method.name}
                                                className="h-3.5 max-w-[50px] object-contain"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    if (e.target.nextSibling) e.target.nextSibling.style.display = "inline-block";
                                                }}
                                            />
                                        ) : null}
                                        <span
                                            className={`text-[9px] font-semibold text-gray-700 tracking-tight ${hasIcon ? "hidden" : "inline-block"
                                                }`}
                                        >
                                            {method.nameText || method.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 10. Compra Protegida Box Mobile*/}
                    <div className="flex gap-1 text-[9px] text-neutral-light">
                        <svg className="w-3 h-3 text-primary shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 21V23M16 21C15.447 21 15 20.553 15 20C15 19.447 15.447 19 16 19C16.553 19 17 19.447 17 20C17 20.553 16.553 21 16 21ZM18 13H11V6C11 3.238 13.238 1 16 1C18.762 1 21 3.238 21 6V13H26C26.594 13 27 13.469 27 14V20C27 26.075 22.075 31 16 31C9.925 31 5 26.075 5 20V14C5 13.437 5.453 13 6 13H8" stroke="#0151fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <span>
                            <strong className="text-primary font-semibold">Compra Protegida.</strong> Recibe el producto que esperabas o te devolvemos tu dinero.
                        </span>
                    </div>

                    {/* Descargables Mobile */}
                    {pdfFiles.length > 0 && (
                        <div className="space-y-2 py-2 border-b border-gray-100">
                            <h3 className="underline underline-offset-4 decoration-gray-300 group-hover:decoration-primary font-bold text-xs">
                                Descargables y Fichas Técnicas
                            </h3>
                            <div className="space-y-1.5">
                                {pdfFiles.map((pdf, idx) => (
                                    <div
                                        key={idx}
                                        className="py-1.5 border-b border-gray-50 flex items-center justify-between"
                                    >
                                        <span className="text-xs font-medium text-neutral-light truncate max-w-[70%]">
                                            {pdf.name || (typeof pdf === "string" ? pdf.split("/").pop() : `Ficha ${idx + 1}`)}
                                        </span>
                                        <a
                                            href={`/storage/images/item/${pdf.url || pdf}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-primary flex items-center gap-1"
                                        >
                                            <span>Descargar</span>
                                            <Download className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description Mobile - Collapsible */}
                    <div className="pt-2 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setMobileDescOpen(!mobileDescOpen)}
                            className="w-full py-2.5 flex items-center justify-between text-left text-neutral-dark group cursor-pointer"
                        >
                            <h3 className="text-base font-bold">
                                01 Descripción
                            </h3>
                            <ChevronDown
                                className={`w-4 h-4 text-neutral-light transition-transform duration-200 ${mobileDescOpen ? "rotate-180 text-primary" : ""
                                    }`}
                            />
                        </button>
                        {mobileDescOpen && (
                            <div
                                itemProp="description"
                                className="text-xs text-neutral-light pt-1 pb-3 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: currentProduct?.description || item?.description || "No hay descripción disponible.",
                                }}
                            />
                        )}
                    </div>

                    {/* Specifications Mobile - Collapsible & Borderless Table */}
                    <div className="pt-2 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setMobileSpecsOpen(!mobileSpecsOpen)}
                            className="w-full py-2.5 flex items-center justify-between text-left text-neutral-dark group cursor-pointer"
                        >
                            <h3 className="text-base font-bold">
                                02 Especificaciones
                            </h3>
                            <ChevronDown
                                className={`w-4 h-4 text-neutral-light transition-transform duration-200 ${mobileSpecsOpen ? "rotate-180 text-primary" : ""
                                    }`}
                            />
                        </button>
                        {mobileSpecsOpen && (
                            <div className="pt-1 pb-3">
                                {generalSpecifications.length > 0 ? (
                                    <div className="overflow-hidden">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <tbody className="divide-y divide-gray-100">
                                                {generalSpecifications.map((spec, i) => (
                                                    <tr
                                                        key={i}
                                                        className="hover:bg-gray-50/50"
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="py-2 pr-3 font-medium text-neutral-light w-2/5 align-middle text-left"
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[10px] text-neutral-light opacity-80">
                                                                    {(i + 1).toString().padStart(2, "0")}
                                                                </span>
                                                                <span className="capitalize">
                                                                    {spec.title || spec.name || "Característica"}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <td className="py-2 pl-3 font-semibold text-neutral-dark text-right align-middle">
                                                            {spec.description || spec.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-xs text-neutral-light py-1">
                                        No hay especificaciones registradas.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Bottom Fixed Bar (Solo se muestra cuando hay stock) */}
                    {!isOutOfStock && (
                        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 flex items-center gap-2 shadow-2xl">
                            <div className="flex items-center gap-2 w-full">
                                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 bg-white text-neutral-light font-semibold gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="text-base font-bold px-1"
                                    >
                                        -
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity(
                                                Math.min(
                                                    currentProduct?.stock_unlimited ? 99 : (currentProduct?.stock || 1),
                                                    quantity + 1
                                                )
                                            )
                                        }
                                        className="text-base font-bold px-1"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => onAddClicked(currentProduct)}
                                    className="flex-1 bg-primary text-white font-semibold text-xs py-2.5 px-3 rounded-full text-center shadow-xs active:scale-95 transition-all"
                                >
                                    Agregar al carrito
                                </button>
                                {data?.show_whatsapp !== false && (
                                    <button
                                        onClick={() => handleWhatsAppClick(data?.quoteButton ? "quote" : "consult")}
                                        className="p-2.5 bg-success text-white rounded-full flex items-center justify-center shadow-xs active:scale-95 transition-all"
                                        aria-label="WhatsApp"
                                    >
                                        <WhatsAppIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>


            </div>
            {/* Related Products Swiper */}
            {relationsItems.length > 0 && (
                <div className="mt-14 mb-8 w-full border-t border-gray-200 pt-12">
                    <ProductSwiperMiBalon
                        data={{
                            ...data,
                            title: data?.related_title || "Productos Relacionados",
                            description: data?.related_description,
                            class_title: data?.related_class_title || "text-2xl font-bold text-neutral-dark mb-6 text-center",
                            class_container: data?.related_class_container || "bg-transparent !py-0",
                            loop: data?.related_loop,
                            autoplay: data?.related_autoplay,
                            type_card_product: data?.related_type_card_product || "CardProductMicjc",
                            type_modal_cart: data?.type_modal_cart,
                        }}
                        items={relationsItems}
                        cart={cart}
                        setCart={setCart}
                    />
                </div>
            )}
            {/* Delivery Policy Modal */}
            <ReactModal
                isOpen={deliveryPolicyModalOpen}
                onRequestClose={() => setDeliveryPolicyModalOpen(false)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none"
                overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            >
                <div className="bg-white p-6 md:p-8 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh] rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <Truck className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold text-neutral-dark">
                                Políticas de Envío
                            </h2>
                        </div>
                        <button
                            onClick={() => setDeliveryPolicyModalOpen(false)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-neutral-light"
                        >
                            <X className="w-5 h-5 stroke-[1.5]" />
                        </button>
                    </div>
                    <div className="prose prose-neutral max-w-none text-xs  text-neutral-light">
                        <div dangerouslySetInnerHTML={{ __html: deliveryPolicy }} />
                    </div>
                    <button
                        onClick={() => setDeliveryPolicyModalOpen(false)}
                        className="mt-6 w-full py-3 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-[#0044aa] transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </ReactModal>

            {/* Cart Modal Selector */}
            <CartModalSelector
                type_modal_cart={data?.type_modal_cart || "CartModalMiBalon"}
                cart={cart}
                data={data}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </main>
    );
};

export default ProductDetailMicjc;
