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
import { Navigation, Pagination, Thumbs } from "swiper/modules";
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
    const imageRef = useRef(null);

    const advisors = General.whatsapp_advisors || [];
    const deliveryPolicy =
        generals?.find((g) => g.correlative === "delivery_policy")
            ?.description || "Políticas de envío no disponibles.";

    useEffect(() => {
        if (item?.id) {
            handleViewUpdate(item);
            // First fallback to item selection
            setSelectedVariant(item);
            const initialAttributes = {};
            if (item.attributes && item.attributes.length > 0) {
                item.attributes.forEach((attr) => {
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
                        const allVariants = [item, ...data];
                        const uniqueVariants = Array.from(
                            new Map(allVariants.map((v) => [v.id, v])).values(),
                        );
                        setVariantsForSelectedGroup(uniqueVariants);

                        // Select the first variant by default if it's a group as requested
                        // Ensure we DON'T select the master item by default
                        const sellableVariants = uniqueVariants.filter(
                            (v) => !v.is_master && v.id !== item.id,
                        );

                        if (sellableVariants.length > 0) {
                            const first = sellableVariants[0];
                            setSelectedVariant(first);
                            const newAttrs = {};
                            if (first.attributes) {
                                first.attributes.forEach((a) => {
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
                        console.error("Error fetching variants:", err);
                        setVariantsForSelectedGroup([item]);
                    })
                    .finally(() => setIsLoadingVariants(false));
            } else {
                setVariantsForSelectedGroup([item]);
            }
        }
    }, [item]);

    const handleViewUpdate = async (item) => {
        try {
            await itemsRest.updateViews({ id: item?.id });
        } catch (error) {
            console.error("Error updating views:", error);
        }
    };

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
                        "rounded-none border-4 border-black bg-black text-white hover:bg-white hover:text-black transition-all",
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
            const hasThisValue = variant.attributes?.some((attr) => {
                const name = attr.name || attr.slug;
                const value = attr.pivot?.value || attr.value;
                return name === attrName && value === valueToCheck;
            });

            if (!hasThisValue) return false;

            for (const [selectedAttrName, selectedValueData] of Object.entries(
                selectedAttributes,
            )) {
                if (selectedAttrName === attrName) continue;
                const hasSelectedAttr = variant.attributes?.some((attr) => {
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
        const candidates = group.variants.filter((v) =>
            v.attributes?.some(
                (a) =>
                    (a.name || a.slug) === attrName &&
                    (a.pivot?.value || a.value) === valueData.value,
            ),
        );

        if (candidates.length === 0) return null;

        const scoredCandidates = candidates.map((v) => {
            let score = 0;
            Object.entries(selectedAttributes).forEach(([selName, selData]) => {
                if (selName === attrName) return;
                const matches = v.attributes?.some(
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

    const currentProduct = selectedVariant || item;

    const group =
        variantsForSelectedGroup.length > 0
            ? {
                  variants: variantsForSelectedGroup,
                  allAttributes: Array.from(
                      new Set(
                          variantsForSelectedGroup.flatMap((v) =>
                              v.attributes?.map((a) => a.name || a.slug),
                          ),
                      ),
                  ).map((name) => {
                      const values = [];
                      variantsForSelectedGroup.forEach((v) => {
                          const attr = v.attributes?.find(
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
                          attribute:
                              variantsForSelectedGroup[0].attributes?.find(
                                  (a) => (a.name || a.slug) === name,
                              ),
                          values,
                      };
                  }),
              }
            : null;

    const rainstarSectionTitleClass =
        "text-xl md:text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6 flex items-center gap-4";
    const rainstarButtonClass =
        "w-full py-5 text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 rounded-none border-4 border-black active:translate-y-1 active:shadow-none";
    const rainstarPrimaryBtn = `${rainstarButtonClass} bg-black text-white hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]`;
    const rainstarSecondaryBtn = `${rainstarButtonClass} bg-white text-black hover:bg-black hover:text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]`;

    const generalSpecifications = (
        Array.isArray(currentProduct?.specifications) &&
        currentProduct.specifications.length > 0
            ? currentProduct.specifications
            : Array.isArray(item?.specifications)
              ? item.specifications
              : []
    ).filter((s) => s.type === "general" || !s.type);

    return (
        <main className="bg-white min-h-screen text-black py-16 px-4 md:px-6 2xl:px-0">
            <div className="container mx-auto 2xl:max-w-7xl">
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-12">
                    {/* Left Column: Images */}
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative border-4 border-black p-4 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] group overflow-hidden"
                        >
                            <div
                                ref={imageRef}
                                className="aspect-[3/4] bg-white cursor-zoom-in relative overflow-hidden"
                                onClick={handleZoomClick}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <img
                                    src={`/storage/images/item/${currentProduct?.image || item?.image}`}
                                    alt={currentProduct?.name || item?.name}
                                    className={`w-full h-full object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 ${isZoomEnabled ? "scale-150" : "scale-100"}`}
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
                                {!isZoomEnabled && (
                                    <div className="absolute top-4 right-4 bg-black text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-4 gap-4">
                            {[
                                currentProduct?.image || item?.image,
                                ...(currentProduct?.images ||
                                    item?.images ||
                                    []),
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
                                .slice(0, 4)
                                .map((img, i) => (
                                    <div
                                        key={i}
                                        className="aspect-[3/4] border-4 border-black p-2 bg-white cursor-pointer grayscale hover:grayscale-0 transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none translate-x-0 hover:translate-x-1 hover:translate-y-1"
                                    >
                                        <img
                                            src={`/storage/images/item/${img?.url || img}`}
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="col-span-12 lg:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                                    {currentProduct?.brand?.name ||
                                        currentProduct?.category?.name ||
                                        "Premium Item"}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                    <TextWithHighlight
                                        text={currentProduct?.name}
                                    />
                                </h1>
                                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                    SKU: {currentProduct?.sku}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 border-y-4 border-black py-6">
                                <div className="text-4xl font-black tracking-tighter">
                                    {CurrencySymbol()}{" "}
                                    {currentProduct?.final_price}
                                </div>
                                {currentProduct?.price >
                                    currentProduct?.final_price && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-neutral-300 line-through font-bold">
                                            {CurrencySymbol()}{" "}
                                            {currentProduct?.price}
                                        </span>
                                        <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase italic">
                                            -
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
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest animate-pulse">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
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
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
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
                                                                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all border-2 
                                                                ${isSelected ? "bg-black text-white border-black" : isAvailable ? "bg-white text-black border-neutral-200 hover:border-black" : "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed line-through opacity-50"}
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
                            <div className="space-y-4 pt-6">
                                <div className="flex items-center justify-between border-4 border-black p-4 bg-gray-50 mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                        Cantidad
                                    </span>
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="text-2xl font-black hover:scale-125 transition-transform"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-black w-8 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(10, quantity + 1),
                                                )
                                            }
                                            className="text-2xl font-black hover:scale-125 transition-transform"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            onAddClicked(currentProduct);
                                            window.location.href = "/cart";
                                        }}
                                        className={rainstarPrimaryBtn}
                                    >
                                        Comprar Ahora
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
                    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 border-t-8 border-black pt-16">
                        <section>
                            <h2 className={rainstarSectionTitleClass}>
                                <span className="italic text-neutral-300">
                                    01
                                </span>{" "}
                                Descripción
                            </h2>
                            <div
                                className="text-lg font-medium uppercase tracking-tight leading-relaxed prose prose-neutral max-w-none text-black"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        currentProduct?.description ||
                                        item?.description,
                                }}
                            />
                        </section>
                        <section>
                            <h2 className={rainstarSectionTitleClass}>
                                <span className="italic text-neutral-300">
                                    02
                                </span>{" "}
                                Especificaciones
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {generalSpecifications.length > 0 ? (
                                    generalSpecifications.map((spec, i) => (
                                        <div
                                            key={i}
                                            className="border-2 border-black p-4 hover:bg-black hover:text-white transition-all group shadow-[5px_5px_0px_0px_rgba(0,0,0,0.05)]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 border-2 border-black group-hover:border-white flex items-center justify-center font-black text-xs shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-sm font-black uppercase tracking-widest">
                                                        {spec.title ||
                                                            "Característica"}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold uppercase text-neutral-400 group-hover:text-neutral-300 text-right">
                                                    {spec.description ||
                                                        spec.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                        No hay especificaciones disponibles.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Policy Section */}
                    <div className="col-span-12 mt-12 mb-20">
                        <div
                            onClick={() => setDeliveryPolicyModalOpen(true)}
                            className="bg-white text-black p-10 flex items-center justify-between cursor-pointer group border-4 border-black hover:bg-black hover:text-white transition-all shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)]"
                        >
                            <div className="flex items-center gap-8">
                                <Truck className="w-14 h-14" />
                                <div>
                                    <h4 className="text-3xl font-black uppercase tracking-tighter">
                                        Políticas de Envío
                                    </h4>
                                    <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-60 mt-1">
                                        Conoce nuestras condiciones de entrega a
                                        nivel nacional
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] hidden group-hover:block animate-pulse">
                                    Leer más
                                </span>
                                <ChevronRight className="w-10 h-10 transform group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-8">
                    <div className="space-y-4">
                        <div className="border-b-4 border-black pb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2 block">
                                #{currentProduct?.sku}
                            </span>
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">
                                {currentProduct?.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-black tracking-tighter">
                                    {CurrencySymbol()}{" "}
                                    {currentProduct?.final_price}
                                </span>
                            </div>
                        </div>

                        <div className="border-4 border-black p-4">
                            <Swiper
                                modules={[Pagination, Navigation]}
                                pagination={{ clickable: true }}
                                className="aspect-[3/4]"
                            >
                                {[
                                    currentProduct?.image,
                                    ...(currentProduct?.images || []),
                                ].map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <img
                                            src={`/storage/images/item/${img?.url || img}`}
                                            className="w-full h-full object-cover object-top grayscale"
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

                    <div className="space-y-6">
                        {group?.allAttributes?.map((attrData) => (
                            <div key={attrData.name} className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                                    {attrData.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {attrData.values.map((val, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                handleAttributeSelect(
                                                    attrData.name,
                                                    val,
                                                )
                                            }
                                            className={`px-4 py-2 text-xs font-black uppercase tracking-tighter border-2 ${selectedAttributes[attrData.name]?.value === val.value ? "bg-black text-white" : "bg-white text-black border-black"}`}
                                        >
                                            {val.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6 border-t-4 border-black pt-8">
                        <section>
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-4">
                                Descripción
                            </h2>
                            <div
                                className="text-sm font-medium uppercase tracking-tight leading-relaxed prose-sm"
                                dangerouslySetInnerHTML={{
                                    __html: currentProduct?.description,
                                }}
                            />
                        </section>
                        <section>
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-4">
                                Especificaciones
                            </h2>
                            <div className="space-y-2">
                                {generalSpecifications.map((spec, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between border-b-2 border-black/5 py-2"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {spec.title || "Característica"}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase text-neutral-400">
                                            {spec.description || spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div
                        onClick={() => setDeliveryPolicyModalOpen(true)}
                        className="border-4 border-black p-6 flex justify-between items-center bg-gray-50"
                    >
                        <div className="flex items-center gap-4">
                            <Truck className="w-8 h-8" />
                            <span className="text-xs font-black uppercase tracking-widest">
                                Políticas de Envío
                            </span>
                        </div>
                        <ChevronRight className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col gap-4 sticky bottom-4 z-40 bg-white p-4 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)]">
                        <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Modals - Rainstar Styled */}
            <ReactModal
                isOpen={deliveryPolicyModalOpen}
                onRequestClose={() => setDeliveryPolicyModalOpen(false)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none"
                overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
            >
                <div className="bg-white border-8 border-black p-8 max-w-3xl w-full shadow-[30px_30px_0px_0px_rgba(0,0,0,0.1)] overflow-y-auto max-h-[80vh] rounded-none">
                    <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                        <div className="flex items-center gap-4">
                            <Truck className="w-10 h-10" />
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                                Políticas de Envío
                            </h2>
                        </div>
                        <button
                            onClick={() => setDeliveryPolicyModalOpen(false)}
                            className="hover:scale-125 transition-transform"
                        >
                            <X className="w-10 h-10" />
                        </button>
                    </div>
                    <div className="prose prose-neutral max-w-none prose-headings:font-black prose-headings:uppercase prose-p:font-bold prose-p:uppercase prose-p:tracking-widest prose-p:text-sm">
                        <div
                            dangerouslySetInnerHTML={{ __html: deliveryPolicy }}
                        />
                    </div>
                    <button
                        onClick={() => setDeliveryPolicyModalOpen(false)}
                        className="mt-12 w-full py-5 bg-black text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-neutral-800 transition-colors"
                    >
                        Entendido / Cerrar
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
                                className="bg-white border-4 border-black p-4 mb-2 min-w-[250px] shadow-[15px_15px_0px_0px_rgba(0,0,0,0.1)]"
                            >
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b-2 border-black pb-2">
                                    Consultar con Asesor
                                </h4>
                                <div className="space-y-2">
                                    {advisors.map((adv, idx) => (
                                        <a
                                            key={idx}
                                            href={`https://api.whatsapp.com/send?phone=${adv.phone}&text=${encodeURIComponent(`¡Hola! Tengo dudas sobre: ${currentProduct?.name}`)}`}
                                            target="_blank"
                                            className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-black transition-all group"
                                        >
                                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs uppercase">
                                                {adv.name?.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest group-hover:italic">
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
                        className="w-20 h-20 bg-black text-white flex items-center justify-center border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] hover:bg-white hover:text-black transition-all active:translate-y-2 active:shadow-none"
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
