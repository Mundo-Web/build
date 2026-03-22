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

const ProductDetailRainstar = ({
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
    const [deliveryPolicyModalOpen, setDeliveryPolicyModalOpen] =
        useState(false);
    const [variantsForSelectedGroup, setVariantsForSelectedGroup] = useState(
        [],
    );
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(item);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

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
                    popup: "rounded-none border-4 border-black font-black uppercase tracking-tight",
                    confirmButton:
                        "rounded-none border-4 border-black bg-black text-white hover:bg-white hover:text-neutral-dark transition-all",
                },
            });
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
            // First fallback to item selection
            setSelectedVariant(item);
            const initialAttributes = {};
            const itemAttrs = Array.isArray(item.attributes)
                ? item.attributes
                : Object.values(item.attributes || {});

            console.log("ProductDetailRainstar: Initial attributes", itemAttrs);

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
                    "ProductDetailRainstar: Fetching variants for",
                    item.agrupador,
                );
                setIsLoadingVariants(true);
                fetch(`/api/items/variants/${item.agrupador}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(
                            "ProductDetailRainstar: Variants API data",
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
                            "ProductDetailRainstar: Unique variants",
                            uniqueVariants,
                        );
                        setVariantsForSelectedGroup(uniqueVariants);

                        // Select the first variant by default if it's a group as requested
                        // Ensure we DON'T select the master item by default
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
                            "ProductDetailRainstar: Error fetching variants:",
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
        // Validation: The master item (container) should not be added to the cart
        if (product.is_master || (item.agrupador && product.id === item.id)) {
            Swal.fire({
                title: "Seleccione una variante",
                text: "Por favor, elija una de las opciones disponibles (color, talla, etc.) antes de agregar al carrito.",
                icon: "info",
                confirmButtonColor: "#000000",
                customClass: {
                    popup: "rounded-none border-4 border-black font-black uppercase tracking-tight",
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

    const handleZoomClick = () => {
        setIsZoomEnabled(!isZoomEnabled);
    };

    const handleMouseMove = (e) => {
        if (!isZoomEnabled) return;
        const { left, top, width, height } =
            imageRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPosition({ x, y });
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

    const rainstarSectionTitleClass =
        "text-sm font-bold tracking-widest border-b border-gray-100 pb-4 mb-8 flex items-center justify-between text-neutral-dark";
    const rainstarButtonClass =
        "w-full py-5 text-sm font-bold tracking-widest transition-all duration-300 rounded-none border border-neutral-dark active:scale-[0.98]";
    const rainstarPrimaryBtn = `${rainstarButtonClass} bg-primary text-white hover:bg-primary/90 uppercase`;
    const rainstarSecondaryBtn = `${rainstarButtonClass} bg-white text-neutral-dark hover:bg-gray-50 border-gray-200 uppercase`;

    const generalSpecifications = (
        Array.isArray(currentProduct?.specifications) &&
        currentProduct.specifications.length > 0
            ? currentProduct.specifications
            : Array.isArray(item?.specifications)
              ? item.specifications
              : []
    ).filter((s) => s.type === "general" || !s.type);

    console.log("ProductDetailRainstar: Rendering with group", group);

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
                                currentProduct?.image || item?.image,
                                ...(Array.isArray(currentProduct?.images)
                                    ? currentProduct.images
                                    : Object.values(
                                          currentProduct?.images || {},
                                      )),
                                ...(Array.isArray(item?.images)
                                    ? item.images
                                    : Object.values(item?.images || {})),
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
                                            className={`aspect-[3/4] border p-1 bg-white cursor-pointer transition-all ${isActive ? "border-neutral-dark" : "border-gray-100 hover:border-neutral-dark/30"}`}
                                        >
                                            <img
                                                src={`/storage/images/item/${imgUrl}`}
                                                className="w-full h-full object-cover object-top"
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
                            className="flex-1 border border-gray-100 p-2 bg-white group overflow-hidden relative"
                        >
                            <div
                                ref={imageRef}
                                className="aspect-[3/4] bg-white cursor-zoom-in relative overflow-hidden"
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
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut",
                                        }}
                                        src={`/storage/images/item/${activeImage?.url || activeImage || currentProduct?.image}`}
                                        alt={currentProduct?.name || item?.name}
                                        className={`w-full h-full object-cover object-top transition-transform duration-300 ease-out ${isZoomEnabled ? "scale-150" : "scale-100"}`}
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
                                            className="bg-white/80 backdrop-blur-md text-neutral-dark p-3 hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100"
                                        >
                                            <Share2 className="w-5 h-5 stroke-[1.5]" />
                                        </button>
                                    )}
                                    {!isZoomEnabled && (
                                        <div className="bg-primary text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
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
                                <span className="text-sm font-bold tracking-wider text-neutral-dark/60">
                                    {currentProduct?.brand?.name ||
                                        currentProduct?.category?.name ||
                                        "COLECCIÓN PREMIUM"}
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-neutral-dark">
                                    <TextWithHighlight
                                        text={currentProduct?.name}
                                    />
                                </h1>
                                <p className="text-sm font-medium tracking-normal text-neutral-dark/40 border-l border-neutral-dark/20 pl-4">
                                    Código: {currentProduct?.sku}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 py-4">
                                <span className="text-5xl font-black tracking-tighter text-neutral-dark">
                                    {CurrencySymbol()}{" "}
                                    {currentProduct?.final_price}
                                </span>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                    <div className="flex flex-col">
                                        <span className="text-xl text-neutral-dark/30 line-through font-bold leading-none">
                                            {CurrencySymbol()}{" "}
                                            {currentProduct?.price}
                                        </span>
                                        <span className="text-sm font-bold tracking-tighter text-primary">
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
                                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest animate-pulse">
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
                                                <h3 className="text-sm font-bold tracking-wider text-neutral-dark/60">
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
                                                                    className={`px-6 py-3 text-sm font-bold tracking-wider transition-all border
                                                                ${isSelected ? "bg-primary text-white border-neutral-dark shadow-md" : isAvailable ? "bg-white text-neutral-dark border-gray-100 hover:border-neutral-dark" : "bg-gray-50 text-neutral-dark/20 border-gray-50 cursor-not-allowed line-through opacity-50"}
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
                            <div className="space-y-8 pt-12">
                                <div className="flex items-center justify-between border-b border-black/5 pb-8">
                                    <span className="text-sm font-bold tracking-wider text-neutral-dark">
                                        Cantidad
                                    </span>
                                    <div className="flex items-center gap-12">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="text-2xl font-light hover:text-primary transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-bold w-6 text-center text-neutral-dark">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(10, quantity + 1),
                                                )
                                            }
                                            className="text-2xl font-light hover:text-primary transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            onAddClicked(currentProduct);
                                            window.location.href = "/cart";
                                        }}
                                        className={rainstarPrimaryBtn}
                                    >
                                        Comprar ahora
                                    </button>
                                    <button
                                        onClick={() =>
                                            onAddClicked(currentProduct)
                                        }
                                        className={rainstarSecondaryBtn}
                                    >
                                        Al Carrito
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Specifications & Description */}
                    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-24 mt-20 border-t border-black/5 pt-20">
                        <section>
                            <h2 className={rainstarSectionTitleClass}>
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
                            <h2 className={rainstarSectionTitleClass}>
                                <span>02 Especificaciones</span>
                                <Plus size={14} className="opacity-20" />
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {generalSpecifications.length > 0 ? (
                                    generalSpecifications.map((spec, i) => (
                                        <div
                                            key={i}
                                            className="border-b border-gray-100 pb-4 flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-[9px] font-bold text-gray-300 w-4">
                                                    {(i + 1)
                                                        .toString()
                                                        .padStart(2, "0")}
                                                </span>
                                                <span className="text-sm font-bold tracking-wider text-neutral-dark">
                                                    {spec.title ||
                                                        "Característica"}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium tracking-normal text-neutral-dark group-hover:text-neutral-dark transition-colors">
                                                {spec.description || spec.value}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm font-bold tracking-wider text-neutral-dark/20">
                                        No hay especificaciones disponibles.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Policy Section */}
                    <div className="col-span-12">
                        <div
                            onClick={() => setDeliveryPolicyModalOpen(true)}
                            className="bg-gray-50 text-neutral-dark py-20 px-12 flex items-center justify-between cursor-pointer group border border-gray-100 hover:border-neutral-dark hover:bg-white transition-all duration-500"
                        >
                            <div className="flex items-center gap-12">
                                <Truck className="w-16 h-16 stroke-[1] text-neutral-dark/40 group-hover:text-primary transition-colors" />
                                <div>
                                    <h4 className="text-5xl font-black tracking-tighter text-neutral-dark">
                                        Políticas de Envío
                                    </h4>
                                    <p className="text-sm font-bold tracking-wider text-neutral-dark/40 mt-2">
                                        Condiciones de entrega y tiempos a nivel
                                        nacional
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-bold tracking-widest hidden group-hover:block transition-all opacity-0 group-hover:opacity-100">
                                    DETALLES
                                </span>
                                <ChevronRight className="w-10 h-10 transform group-hover:translate-x-4 transition-transform stroke-[1]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-12 pb-24">
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-8 px-2">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <span className="text-sm font-bold tracking-wider text-neutral-dark/60 block">
                                        ID: {currentProduct?.sku}
                                    </span>
                                    <span className="text-sm font-bold tracking-wider text-neutral-dark">
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
                            <h1 className="text-3xl font-black tracking-tighter leading-[0.9] mb-6 text-neutral-dark">
                                {currentProduct?.name}
                            </h1>
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black tracking-tighter text-neutral-dark">
                                    {CurrencySymbol()}{" "}
                                    {currentProduct?.final_price}
                                </span>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                    <span className="text-lg text-neutral-dark/20 line-through font-bold">
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
                                <h3 className="text-sm font-bold tracking-wider text-neutral-dark/60">
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
                                                onClick={() =>
                                                    handleAttributeSelect(
                                                        attrData.name,
                                                        val,
                                                    )
                                                }
                                                className={`px-6 py-3 text-sm font-bold tracking-wider border transition-all ${isSelected ? "bg-primary text-white border-neutral-dark shadow-sm" : "bg-white text-neutral-dark border-gray-100"}`}
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
                            <h2 className="text-sm font-bold tracking-widest mb-6 text-neutral-dark/60">
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
                            <h2 className="text-sm font-bold tracking-widest mb-6 text-neutral-dark/60">
                                02 / ESPECIFICACIONES
                            </h2>
                            <div className="space-y-4">
                                {generalSpecifications.map((spec, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center border-b border-gray-50 pb-4"
                                    >
                                        <span className="text-sm font-bold tracking-wider text-neutral-dark">
                                            {spec.title || "Factor"}
                                        </span>
                                        <span className="text-sm font-bold text-neutral-dark/40 text-right">
                                            {spec.description || spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div
                        onClick={() => setDeliveryPolicyModalOpen(true)}
                        className="border border-gray-100 py-8 flex justify-between items-center bg-gray-50 mx-2 active:bg-white transition-colors"
                    >
                        <div className="flex items-center gap-6">
                            <Truck className="w-8 h-8 stroke-[1] text-neutral-dark/60" />
                            <span className="text-sm font-bold tracking-wider text-neutral-dark">
                                Política de Envío
                            </span>
                        </div>
                        <ChevronRight className="w-6 h-6 stroke-[1] text-neutral-dark/40" />
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-dark p-6 grid grid-cols-2 gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={() => onAddClicked(currentProduct)}
                            className={rainstarSecondaryBtn}
                        >
                            Carrito
                        </button>
                        <button
                            onClick={() => {
                                onAddClicked(currentProduct);
                                window.location.href = "/cart";
                            }}
                            className={rainstarPrimaryBtn}
                        >
                            Pagar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals - Rainstar Styled */}
            <ReactModal
                isOpen={deliveryPolicyModalOpen}
                onRequestClose={() => setDeliveryPolicyModalOpen(false)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none"
                overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            >
                <div className="bg-white p-12 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] rounded-none border border-gray-100">
                    <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-6">
                            <Truck className="w-10 h-10 stroke-[1] text-neutral-dark/40" />
                            <h2 className="text-3xl font-black tracking-tighter text-neutral-dark">
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
                    <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-p:font-medium prose-p:tracking-widest prose-p:text-sm prose-p:leading-relaxed text-neutral-dark">
                        <div
                            dangerouslySetInnerHTML={{ __html: deliveryPolicy }}
                        />
                    </div>
                    <button
                        onClick={() => setDeliveryPolicyModalOpen(false)}
                        className="mt-16 w-full py-5 bg-primary text-white font-bold tracking-widest text-sm hover:bg-primary/90 transition-colors uppercase"
                    >
                        Entendido
                    </button>
                </div>
            </ReactModal>

            {/* Float WhatsApp */}
            {advisors.length > 0 && (
                <div className="fixed bottom-8 right-8 z-[80] flex flex-col items-end gap-4 scale-75 md:scale-100">
                    <AnimatePresence>
                        {isAdvisorDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-white border-4 border-neutral-dark p-6 mb-2 min-w-[280px] shadow-[15px_15px_0px_0px_rgba(0,0,0,0.1)]"
                            >
                                <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b-2 border-neutral-dark pb-4">
                                    Consultar con Asesor
                                </h4>
                                <div className="space-y-3">
                                    {advisors.map((adv, idx) => (
                                        <a
                                            key={idx}
                                            href={`https://api.whatsapp.com/send?phone=${adv.phone}&text=${encodeURIComponent(`¡Hola! Tengo dudas sobre: ${currentProduct?.name}`)}`}
                                            target="_blank"
                                            className="flex items-center gap-4 p-4 border-2 border-transparent hover:border-neutral-dark hover:bg-gray-50 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-black text-sm uppercase">
                                                {adv.name?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold tracking-tight group-hover:italic">
                                                {adv.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() =>
                            setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)
                        }
                        className="w-20 h-20 bg-primary text-white flex items-center justify-center border-4 border-neutral-dark shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] hover:bg-white hover:text-neutral-dark transition-all active:translate-y-2 active:shadow-none"
                    >
                        <MessageCircle className="w-10 h-10" />
                    </button>
                </div>
            )}

            {/* Cart Modal - Rainstar Styled */}
            <CartModalRainstar
                cart={cart}
                data={data}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </main>
    );
};

export default ProductDetailRainstar;
