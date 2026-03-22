import React, { useState, useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import General from "../../../Utils/General";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const ProductCardItem = ({ item, index, onClick }) => {
    const imageUrl = item.image
        ? `/storage/images/item/${item.image}`
        : "/api/cover/thumbnail/null";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="group w-full flex flex-col cursor-pointer"
            onClick={onClick}
        >
            <div className="relative flex-1 flex flex-col rounded-[2.5rem] bg-white border border-neutral-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden text-center transition-all duration-500 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.08)]">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full z-10 transition-transform duration-500 group-hover:scale-150" />

                {/* Image Container */}
                <div className="w-full h-auto aspect-square  flex items-center justify-center shadow-inner transition-transform duration-500 overflow-hidden bg-neutral-50 relative">
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                    />
                    {/* Overlay and Title */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20" />
                    <div className="absolute inset-x-0 bottom-0 p-6 z-30">
                        <h3 className="text-3xl md:text-4xl xl:text-6xl text-white text-center font-bold transition-transform duration-500 line-clamp-2">
                            {item.name}
                        </h3>
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                    {item.description && (
                        <div
                            className="text-base text-neutral-light leading-relaxed line-clamp-3 mb-6 [&_*]:!text-neutral-light"
                            dangerouslySetInnerHTML={{
                                __html: item.description,
                            }}
                        />
                    )}
                    <div className="mt-auto flex justify-center">
                        <div className="group/btn inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white border-2 border-primary text-primary font-bold transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:shadow-2xl hover:shadow-primary/40 active:scale-95">
                            <span className="text-sm uppercase tracking-widest font-bold">
                                Ver más detalle
                            </span>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-300">
                                <svg
                                    className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProductListCardPanelPro = ({
    items,
    data,
    onClickTracking,
    generals,
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mainSwiper, setMainSwiper] = useState(null);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);

    // Estado para variantes y selección de atributos
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [variantsForSelectedGroup, setVariantsForSelectedGroup] = useState(
        [],
    );
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);

    // Estados para swiper
    const [activeIndexProduct, setActiveIndexProduct] = useState(0);
    const [swiperInstanceProduct, setSwiperInstanceProduct] = useState(null);
    const [paginationElProduct, setPaginationElProduct] = useState(null);

    useEffect(() => {
        if (swiperInstanceProduct) {
            if (paginationElProduct) {
                swiperInstanceProduct.params.pagination.el =
                    paginationElProduct;
                swiperInstanceProduct.pagination.destroy();
                swiperInstanceProduct.pagination.init();
                swiperInstanceProduct.pagination.render();
                swiperInstanceProduct.pagination.update();
            }
            if (swiperInstanceProduct.navigation) {
                swiperInstanceProduct.navigation.destroy();
                swiperInstanceProduct.navigation.init();
                swiperInstanceProduct.navigation.update();
            }
        }
    }, [swiperInstanceProduct, paginationElProduct]);

    // Obtener asesores de WhatsApp
    const whatsappAdvisors = General.whatsapp_advisors || [];

    // Agrupar productos por nombre
    const groupedItems = useMemo(() => {
        if (!items || items.length === 0) return [];

        const groups = {};
        items.forEach((item) => {
            const groupKey = item.name?.trim().toLowerCase() || item.id;
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    main: item,
                    variants: [item],
                };
            } else {
                groups[groupKey].variants.push(item);
            }
        });

        return Object.values(groups)
            .map((group) => group.main)
            .sort(
                (a, b) => (a.order_index || 99999) - (b.order_index || 99999),
            );
    }, [items]);

    // Obtener datos del grupo del producto seleccionado
    const getProductGroup = (item) => {
        if (!item) return null;

        const variants =
            variantsForSelectedGroup.length > 0
                ? variantsForSelectedGroup
                : items?.filter(
                      (i) =>
                          i.agrupador === item.agrupador ||
                          (i.name?.trim().toLowerCase() || i.id) ===
                              (item.name?.trim().toLowerCase() || item.id),
                  ) || [];

        const allAttributes = {};
        const allApplications = [];

        variants.forEach((variant) => {
            if (variant.attributes && variant.attributes.length > 0) {
                variant.attributes.forEach((attr) => {
                    const attrName = attr.name || attr.slug;
                    if (!allAttributes[attrName]) {
                        allAttributes[attrName] = {
                            attribute: attr,
                            values: [],
                        };
                    }
                    const value = attr.pivot?.value || attr.value;
                    if (
                        value &&
                        !allAttributes[attrName].values.find(
                            (v) => v.value === value,
                        )
                    ) {
                        allAttributes[attrName].values.push({
                            value,
                            itemId: variant.id,
                            item: variant,
                        });
                    }
                });
            }

            if (variant.applications && variant.applications.length > 0) {
                variant.applications.forEach((app) => {
                    if (!allApplications.find((a) => a.id === app.id)) {
                        allApplications.push(app);
                    }
                });
            }
        });

        const sortedAttributes = Object.entries(allAttributes)
            .map(([name, data]) => ({ name, ...data }))
            .sort(
                (a, b) =>
                    (a.attribute?.order_index ?? 999) -
                    (b.attribute?.order_index ?? 999),
            );

        sortedAttributes.forEach((attrGroup) => {
            const isNumber = attrGroup.attribute?.type === "number";
            attrGroup.values.sort((a, b) => {
                if (isNumber) {
                    const valA = parseFloat(a.value);
                    const valB = parseFloat(b.value);
                    if (!isNaN(valA) && !isNaN(valB)) return valA - valB;
                }
                return String(a.value).localeCompare(
                    String(b.value),
                    undefined,
                    { numeric: true, sensitivity: "base" },
                );
            });
        });

        return { variants, allAttributes: sortedAttributes, allApplications };
    };

    // Bloquear scroll del body
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = "hidden";
            setActiveIndex(0);
            setSelectedVariant(selectedImage);
            const initialAttributes = {};
            if (
                selectedImage.attributes &&
                selectedImage.attributes.length > 0
            ) {
                selectedImage.attributes.forEach((attr) => {
                    const attrName = attr.name || attr.slug;
                    const value = attr.pivot?.value || attr.value;
                    if (value) {
                        initialAttributes[attrName] = {
                            value,
                            itemId: selectedImage.id,
                            item: selectedImage,
                        };
                    }
                });
            }
            setSelectedAttributes(initialAttributes);
        } else {
            document.body.style.overflow = "unset";
            setMainSwiper(null);
            setActiveIndex(0);
            setSelectedVariant(null);
            setSelectedAttributes({});
        }
    }, [selectedImage]);

    const currentProduct = selectedVariant || selectedImage;

    const handleProductClick = async (item) => {
        if (onClickTracking) onClickTracking(item);
        setSelectedImage(item);
        setSelectedVariant(item);

        if (item.agrupador) {
            setIsLoadingVariants(true);
            try {
                const response = await fetch(
                    `/api/items/variants/${item.agrupador}`,
                );
                if (response.ok) {
                    const data = await response.json();
                    setVariantsForSelectedGroup([item, ...data]);
                } else {
                    setVariantsForSelectedGroup([item]);
                }
            } catch (error) {
                setVariantsForSelectedGroup([item]);
            } finally {
                setIsLoadingVariants(false);
            }
        } else {
            setVariantsForSelectedGroup([item]);
        }
    };

    const handleAttributeSelect = (attrName, valueData) => {
        setSelectedAttributes((prev) => ({ ...prev, [attrName]: valueData }));
        if (valueData.item) setSelectedVariant(valueData.item);
    };

    const handleWhatsAppQuote = (advisor, item) => {
        const productToQuote = selectedVariant || item;
        const group = getProductGroup(item);
        let customMessage = `🌟 ¡Hola! Me interesa solicitar información sobre:\n\n`;
        customMessage += `📦 *Producto:* ${productToQuote.name}\n`;

        if (Object.keys(selectedAttributes).length > 0) {
            customMessage += `\n📐 *Especificaciones seleccionadas:*\n`;
            Object.entries(selectedAttributes).forEach(
                ([attrName, valueData]) => {
                    const attrNode = group?.allAttributes?.find(
                        (a) => a.name === attrName,
                    );
                    const attr = attrNode?.attribute;
                    const unit = attr?.unit || "";
                    customMessage += `  • ${attrName}: ${valueData.value}${unit}\n`;
                },
            );
        }
        customMessage += `\n💬 Me gustaría recibir más información y cotización.\n¡Gracias!`;
        window.open(
            `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(customMessage)}`,
            "_blank",
        );
        setIsAdvisorDropdownOpen(false);
    };

    const getItemGallery = (item) => {
        const productToShow = selectedVariant || item;
        const gallery = [
            {
                url: productToShow?.image,
                type: "main",
                alt: "Imagen principal",
            },
        ];
        if (productToShow?.images && productToShow.images.length > 0) {
            productToShow.images.forEach((img, index) => {
                gallery.push({
                    url: img.url,
                    type: "gallery",
                    index,
                    alt: `Imagen ${index + 1}`,
                });
            });
        }
        return gallery;
    };

    return (
        <>
            <section
                id={data?.element_id || "productListCardPanelPro"}
                className="py-24 sm:py-32 bg-sections-color relative overflow-hidden"
            >
                {/* Patrón decorativo de fondo sutil */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold tracking-wider uppercase">
                            {data?.subtitle || "Nuestros Productos"}
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 font-title mb-8 leading-[1.1] tracking-tight">
                            {data?.title || "Colección Premium"}
                        </h2>
                        <p className="text-lg hidden md:text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                            {data?.description ||
                                "Explore nuestra gama de productos seleccionados con los más altos estándares de calidad."}
                        </p>
                    </motion.div>
                    {(() => {
                        const catalogUrl = generals?.find(
                            (g) => g.correlative === "items.file_catalogo_url",
                        )?.description;

                        if (catalogUrl) {
                            return (
                                <div className="mb-16 flex justify-center">
                                    <a
                                        href={catalogUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-4 px-12 py-4 bg-accent text-white font-bold rounded-full transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:scale-95 shadow-xl"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-110">
                                            <Download className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-lg font-bold">
                                                Descargar Catálogo General
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <div className="relative group/swiper">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1.2}
                            loop={groupedItems.length > 1}
                            navigation={{
                                prevEl: ".product-prev",
                                nextEl: ".product-next",
                            }}
                            pagination={{
                                el: paginationElProduct,
                                clickable: true,
                                renderBullet: function (index, className) {
                                    return `<span class="${className} !rounded-full !opacity-40 !w-2 !h-2 !bg-primary transition-all duration-500 cursor-pointer block [&.swiper-pagination-bullet-active]:!w-10 [&.swiper-pagination-bullet-active]:!opacity-100"></span>`;
                                },
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 2.5 },
                                1280: { slidesPerView: 3 },
                            }}
                            onSwiper={setSwiperInstanceProduct}
                            onSlideChange={(swiper) =>
                                setActiveIndexProduct(swiper.realIndex)
                            }
                            className="!pb-14"
                        >
                            {groupedItems.map((item, index) => (
                                <SwiperSlide
                                    key={item.id || index}
                                    className="!h-auto !flex"
                                >
                                    <ProductCardItem
                                        item={item}
                                        index={index}
                                        onClick={() => handleProductClick(item)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation Buttons */}
                        <button className="product-prev absolute -left-4 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary border border-neutral-100  group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.1}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button className="product-next absolute -right-4 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary border border-neutral-100  group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.1}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        <div
                            ref={setPaginationElProduct}
                            className="flex justify-center mt-8 space-x-2 h-2"
                        />
                    </div>
                </div>
            </section>

            {/* Modal de Producto - Diseño Premium */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-0 lg:p-6 backdrop-blur-sm"
                        onClick={() => {
                            setSelectedImage(null);
                            setIsAdvisorDropdownOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full h-full lg:w-[95vw] lg:h-[92vh] lg:max-w-7xl lg:max-h-[92vh] lg:rounded-3xl shadow-2xl overflow-hidden relative bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botón cerrar - Esquina superior derecha */}
                            <button
                                onClick={() => {
                                    setSelectedImage(null);
                                    setIsAdvisorDropdownOpen(false);
                                }}
                                className="absolute top-4 right-4 z-[60] w-11 h-11 bg-white/90 hover:bg-primary text-neutral-dark hover:text-white transition-all duration-300 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <div className="flex flex-col lg:flex-row h-full">
                                {/* Galería de imágenes - Lado izquierdo */}
                                <div className="lg:w-1/2 h-[35vh] lg:h-full  flex flex-col overflow-hidden relative">
                                    {/* Imagen principal */}
                                    <div className="flex-1 min-h-full relative flex items-center justify-center w-full ">
                                        <Swiper
                                            modules={[Navigation]}
                                            navigation={{
                                                prevEl: ".custom-main-prev",
                                                nextEl: ".custom-main-next",
                                            }}
                                            loop={
                                                getItemGallery(selectedImage)
                                                    .length > 1
                                            }
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            onSwiper={setMainSwiper}
                                            onSlideChange={(swiper) =>
                                                setActiveIndex(
                                                    swiper.activeIndex,
                                                )
                                            }
                                            className="!h-full !w-full !m-0 !p-0"
                                        >
                                            {getItemGallery(selectedImage).map(
                                                (img, index) => (
                                                    <SwiperSlide
                                                        key={index}
                                                        className="w-full"
                                                    >
                                                        <div className="w-full h-full flex items-center justify-center bg-white relative overflow-hidden">
                                                            <AnimatePresence
                                                                initial={false}
                                                            >
                                                                <motion.img
                                                                    key={
                                                                        img.url ||
                                                                        index
                                                                    }
                                                                    src={
                                                                        img.url
                                                                            ? `/storage/images/item/${img.url}`
                                                                            : "/api/cover/thumbnail/null"
                                                                    }
                                                                    alt={
                                                                        img.alt
                                                                    }
                                                                    initial={{
                                                                        opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.4,
                                                                        ease: "easeInOut",
                                                                    }}
                                                                    className="absolute inset-0 w-full h-full object-cover"
                                                                    onError={(
                                                                        e,
                                                                    ) =>
                                                                        (e.target.src =
                                                                            "/api/cover/thumbnail/null")
                                                                    }
                                                                />
                                                            </AnimatePresence>
                                                        </div>
                                                    </SwiperSlide>
                                                ),
                                            )}
                                        </Swiper>

                                        {/* Botones de navegación - Solo si hay más de una imagen */}
                                        {getItemGallery(selectedImage).length >
                                            1 && (
                                            <>
                                                <button className="custom-main-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-neutral-200">
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 19l-7-7 7-7"
                                                        />
                                                    </svg>
                                                </button>

                                                <button className="custom-main-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-neutral-200">
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Indicadores de imagen */}
                                    {getItemGallery(selectedImage).length >
                                        1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {getItemGallery(selectedImage).map(
                                                (_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            mainSwiper?.slideTo(
                                                                index,
                                                            )
                                                        }
                                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                            activeIndex ===
                                                            index
                                                                ? "bg-primary w-6"
                                                                : "bg-neutral-300 hover:bg-neutral-light"
                                                        }`}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Información del producto - Lado derecho */}
                                <div className="lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-white">
                                    {/* Contenido scrolleable */}
                                    <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                                        {/* Título con estilo premium */}
                                        <h3
                                            className="
                    
                    
                     text-5xl lg:text-7xl font-light text-primary mb-2  transition-transform duration-700 flex-shrink-0
                        
                        "
                                        >
                                            {selectedImage.name}
                                        </h3>

                                        {/* Descripción */}
                                        {(currentProduct?.description ||
                                            selectedImage.description) && (
                                            <div
                                                className="text-neutral-dark text-lg lg:text-xl leading-relaxed mb-8 prose prose-neutral max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        currentProduct?.description ||
                                                        selectedImage.description,
                                                }}
                                            />
                                        )}

                                        {/* Características */}
                                        {(
                                            currentProduct?.features ||
                                            selectedImage.features
                                        )?.length > 0 && (
                                            <div>
                                                <h4 className="text-base font-semibold text-neutral-dark mb-5">
                                                    Características
                                                </h4>
                                                <ul className="space-y-3">
                                                    {(
                                                        currentProduct?.features ||
                                                        selectedImage.features
                                                    ).map((feat, index) => (
                                                        <li
                                                            key={
                                                                feat.id || index
                                                            }
                                                            className="flex items-start gap-3 text-base text-neutral-dark "
                                                        >
                                                            <svg
                                                                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2.5
                                                                    }
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                            <span>
                                                                {feat.feature}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {/* ============ SELECTOR DE MEDIDAS ============ */}
                                        {isLoadingVariants ? (
                                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                                <div className="flex gap-2">
                                                    <div
                                                        className="w-3 h-3 bg-primary rounded-full animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0s",
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="w-3 h-3 bg-primary rounded-full animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.1s",
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="w-3 h-3 bg-primary rounded-full animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.2s",
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-neutral-light tracking-wide uppercase">
                                                    Cargando opciones
                                                </span>
                                            </div>
                                        ) : (
                                            (() => {
                                                const group =
                                                    getProductGroup(
                                                        selectedImage,
                                                    );
                                                const hasGroupAttributes =
                                                    group &&
                                                    Object.keys(
                                                        group.allAttributes,
                                                    ).length > 0;

                                                if (!hasGroupAttributes)
                                                    return null;

                                                // Función para verificar si un valor de atributo está disponible
                                                // basándose en las selecciones actuales de otros atributos
                                                const isValueAvailable = (
                                                    attrName,
                                                    valueToCheck,
                                                ) => {
                                                    // Buscar variantes que tengan este valor Y todos los demás atributos seleccionados
                                                    return group.variants.some(
                                                        (variant) => {
                                                            // Verificar que esta variante tiene el valor que estamos evaluando
                                                            const hasThisValue =
                                                                variant.attributes?.some(
                                                                    (attr) => {
                                                                        const name =
                                                                            attr.name ||
                                                                            attr.slug;
                                                                        const value =
                                                                            attr
                                                                                .pivot
                                                                                ?.value ||
                                                                            attr.value;
                                                                        return (
                                                                            name ===
                                                                                attrName &&
                                                                            value ===
                                                                                valueToCheck
                                                                        );
                                                                    },
                                                                );

                                                            if (!hasThisValue)
                                                                return false;

                                                            // Verificar que la variante también tiene todos los otros atributos seleccionados
                                                            for (const [
                                                                selectedAttrName,
                                                                selectedValueData,
                                                            ] of Object.entries(
                                                                selectedAttributes,
                                                            )) {
                                                                if (
                                                                    selectedAttrName ===
                                                                    attrName
                                                                )
                                                                    continue; // Skip el atributo actual

                                                                const hasSelectedAttr =
                                                                    variant.attributes?.some(
                                                                        (
                                                                            attr,
                                                                        ) => {
                                                                            const name =
                                                                                attr.name ||
                                                                                attr.slug;
                                                                            const value =
                                                                                attr
                                                                                    .pivot
                                                                                    ?.value ||
                                                                                attr.value;
                                                                            return (
                                                                                name ===
                                                                                    selectedAttrName &&
                                                                                value ===
                                                                                    selectedValueData.value
                                                                            );
                                                                        },
                                                                    );

                                                                if (
                                                                    !hasSelectedAttr
                                                                )
                                                                    return false;
                                                            }

                                                            return true;
                                                        },
                                                    );
                                                };

                                                // Función inteligente para encontrar la mejor variante posible
                                                const findBestMatchingVariant =
                                                    (attrName, valueData) => {
                                                        // 1. Filtrar variantes que tengan el atributo clickeado con el valor correcto
                                                        const candidates =
                                                            group.variants.filter(
                                                                (v) =>
                                                                    v.attributes?.some(
                                                                        (a) =>
                                                                            (a.name ||
                                                                                a.slug) ===
                                                                                attrName &&
                                                                            (a
                                                                                .pivot
                                                                                ?.value ||
                                                                                a.value) ===
                                                                                valueData.value,
                                                                    ),
                                                            );

                                                        if (
                                                            candidates.length ===
                                                            0
                                                        )
                                                            return null;

                                                        // 2. Calcular puntuación de coincidencia (cuántos otros atributos coinciden)
                                                        const scoredCandidates =
                                                            candidates.map(
                                                                (v) => {
                                                                    let score = 0;
                                                                    Object.entries(
                                                                        selectedAttributes,
                                                                    ).forEach(
                                                                        ([
                                                                            selName,
                                                                            selData,
                                                                        ]) => {
                                                                            if (
                                                                                selName ===
                                                                                attrName
                                                                            )
                                                                                return; // Ya sabemos que el clickeado coincide

                                                                            const matches =
                                                                                v.attributes?.some(
                                                                                    (
                                                                                        a,
                                                                                    ) =>
                                                                                        (a.name ||
                                                                                            a.slug) ===
                                                                                            selName &&
                                                                                        (a
                                                                                            .pivot
                                                                                            ?.value ||
                                                                                            a.value) ===
                                                                                            selData.value,
                                                                                );
                                                                            if (
                                                                                matches
                                                                            )
                                                                                score++;
                                                                        },
                                                                    );
                                                                    return {
                                                                        variant:
                                                                            v,
                                                                        score,
                                                                    };
                                                                },
                                                            );

                                                        // 3. Ordenar por puntuación (descendente) y devolver el superior
                                                        scoredCandidates.sort(
                                                            (a, b) =>
                                                                b.score -
                                                                a.score,
                                                        );
                                                        return scoredCandidates[0]
                                                            .variant;
                                                    };

                                                return (
                                                    <div className="mb-10">
                                                        {group.allAttributes.map(
                                                            (attrData) => {
                                                                const attrName =
                                                                    attrData.name;
                                                                const attr =
                                                                    attrData.attribute;
                                                                const values =
                                                                    attrData.values;
                                                                const selectedValue =
                                                                    selectedAttributes[
                                                                        attrName
                                                                    ];

                                                                return (
                                                                    <div
                                                                        key={
                                                                            attrName
                                                                        }
                                                                        className="mb-6 last:mb-0"
                                                                    >
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <h4 className="text-lg font-bold text-neutral-dark flex items-center gap-2 m-0">
                                                                                {
                                                                                    attrName
                                                                                }
                                                                                {attr.unit && (
                                                                                    <span className="text-neutral-light font-normal text-sm">
                                                                                        (
                                                                                        {
                                                                                            attr.unit
                                                                                        }

                                                                                        )
                                                                                    </span>
                                                                                )}
                                                                                {attr.is_parent && (
                                                                                    <span className="hidden px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] uppercase font-bold tracking-wider border border-purple-200">
                                                                                        Principal
                                                                                    </span>
                                                                                )}
                                                                            </h4>
                                                                            {selectedValue && (
                                                                                <span className="hidden text-sm font-medium text-primary">
                                                                                    {
                                                                                        selectedValue.value
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-3">
                                                                            {values.map(
                                                                                (
                                                                                    valueData,
                                                                                    idx,
                                                                                ) => {
                                                                                    const isSelected =
                                                                                        selectedValue?.value ===
                                                                                        valueData.value;
                                                                                    // Los atributos padres siempre están disponibles para selección para evitar bloqueos
                                                                                    const isAvailable =
                                                                                        attr.is_parent ||
                                                                                        isValueAvailable(
                                                                                            attrName,
                                                                                            valueData.value,
                                                                                        );

                                                                                    return (
                                                                                        <button
                                                                                            key={
                                                                                                idx
                                                                                            }
                                                                                            onClick={() => {
                                                                                                if (
                                                                                                    !isAvailable
                                                                                                )
                                                                                                    return;

                                                                                                // Intentar encontrar la variante exacta
                                                                                                let matchingVariant =
                                                                                                    findBestMatchingVariant(
                                                                                                        attrName,
                                                                                                        valueData,
                                                                                                    );

                                                                                                if (
                                                                                                    !matchingVariant &&
                                                                                                    attr.is_parent
                                                                                                ) {
                                                                                                    matchingVariant =
                                                                                                        group.variants.find(
                                                                                                            (
                                                                                                                v,
                                                                                                            ) =>
                                                                                                                v.attributes?.some(
                                                                                                                    (
                                                                                                                        a,
                                                                                                                    ) =>
                                                                                                                        (a.name ||
                                                                                                                            a.slug) ===
                                                                                                                            attrName &&
                                                                                                                        (a
                                                                                                                            .pivot
                                                                                                                            ?.value ||
                                                                                                                            a.value) ===
                                                                                                                            valueData.value,
                                                                                                                ),
                                                                                                        );
                                                                                                }

                                                                                                if (
                                                                                                    matchingVariant
                                                                                                ) {
                                                                                                    setSelectedVariant(
                                                                                                        matchingVariant,
                                                                                                    );
                                                                                                    // Actualizar selectedAttributes con los valores de la variante encontrada
                                                                                                    const newAttributes =
                                                                                                        {};
                                                                                                    matchingVariant.attributes?.forEach(
                                                                                                        (
                                                                                                            attr,
                                                                                                        ) => {
                                                                                                            const name =
                                                                                                                attr.name ||
                                                                                                                attr.slug;
                                                                                                            const value =
                                                                                                                attr
                                                                                                                    .pivot
                                                                                                                    ?.value ||
                                                                                                                attr.value;
                                                                                                            if (
                                                                                                                value
                                                                                                            ) {
                                                                                                                newAttributes[
                                                                                                                    name
                                                                                                                ] =
                                                                                                                    {
                                                                                                                        value,
                                                                                                                        itemId: matchingVariant.id,
                                                                                                                        item: matchingVariant,
                                                                                                                    };
                                                                                                            }
                                                                                                        },
                                                                                                    );
                                                                                                    setSelectedAttributes(
                                                                                                        newAttributes,
                                                                                                    );
                                                                                                } else {
                                                                                                    handleAttributeSelect(
                                                                                                        attrName,
                                                                                                        valueData,
                                                                                                    );
                                                                                                }
                                                                                            }}
                                                                                            disabled={
                                                                                                !isAvailable
                                                                                            }
                                                                                            className={`min-w-[70px] px-5 py-3 text-lg font-medium transition-all duration-200 rounded-xl border-2 ${
                                                                                                isSelected
                                                                                                    ? "border-primary text-primary shadow-sm"
                                                                                                    : isAvailable
                                                                                                      ? "border-neutral-200 text-neutral-dark hover:border-neutral-300 hover:bg-neutral-50"
                                                                                                      : "border-neutral-100 text-neutral-300 bg-neutral-50 cursor-not-allowed line-through"
                                                                                            }`}
                                                                                            title={
                                                                                                !isAvailable
                                                                                                    ? "No disponible con la selección actual"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                valueData.value
                                                                                            }
                                                                                        </button>
                                                                                    );
                                                                                },
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        )}

                                        {/* ============ CARACTERÍSTICAS Y APLICACIONES EN GRID ============ */}
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                                            {/* Aplicaciones */}
                                            {(() => {
                                                const group =
                                                    getProductGroup(
                                                        selectedImage,
                                                    );
                                                const applications =
                                                    currentProduct?.applications ||
                                                    group?.allApplications ||
                                                    [];

                                                if (applications.length === 0)
                                                    return null;

                                                return (
                                                    <div>
                                                        <h4 className="text-base font-semibold text-neutral-dark mb-5">
                                                            Ideal para
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {applications.map(
                                                                (
                                                                    app,
                                                                    index,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            app.id ||
                                                                            index
                                                                        }
                                                                        className="text-lg text-neutral-dark  bg-neutral-100 px-4 py-2 rounded-lg"
                                                                    >
                                                                        {
                                                                            app.name
                                                                        }
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Botón WhatsApp fijo abajo */}
                                    <div className="p-5 lg:p-6 border-t border-neutral-100 bg-white">
                                        {/* Botón de cotización WhatsApp */}
                                        <div className="relative flex w-full items-end justify-end">
                                            {whatsappAdvisors.length <= 1 ? (
                                                <button
                                                    onClick={() => {
                                                        const advisor =
                                                            whatsappAdvisors[0] || {
                                                                phone: "+51958973943",
                                                                message: "",
                                                            };
                                                        handleWhatsAppQuote(
                                                            advisor,
                                                            selectedImage,
                                                        );
                                                    }}
                                                    className="w-full lg:max-w-max bg-success  text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 flex items-center justify-center gap-3"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                    </svg>
                                                    <span>
                                                        Solicitar Cotización
                                                    </span>
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            setIsAdvisorDropdownOpen(
                                                                !isAdvisorDropdownOpen,
                                                            )
                                                        }
                                                        className="w-full lg:max-w-max bg-success hover:bg-success  text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 flex items-center justify-center gap-3"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                        </svg>
                                                        <span>
                                                            Solicitar Cotización
                                                        </span>
                                                        <svg
                                                            className={`w-4 h-4 ml-1 transition-transform duration-200 ${isAdvisorDropdownOpen ? "rotate-180" : ""}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {/* Dropdown de asesores */}
                                                    <AnimatePresence>
                                                        {isAdvisorDropdownOpen && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    y: 10,
                                                                }}
                                                                transition={{
                                                                    duration: 0.15,
                                                                }}
                                                                className="absolute bottom-full max-w-max right-0  mb-2 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-30"
                                                            >
                                                                <div className="p-3 bg-primary border-b border-neutral-100">
                                                                    <p className="text-base font-medium text-white">
                                                                        Selecciona
                                                                        un
                                                                        asesor
                                                                    </p>
                                                                </div>
                                                                <div className="max-h-[200px] x overflow-y-auto">
                                                                    {whatsappAdvisors.map(
                                                                        (
                                                                            advisor,
                                                                            index,
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    index
                                                                                }
                                                                                onClick={() =>
                                                                                    handleWhatsAppQuote(
                                                                                        advisor,
                                                                                        selectedImage,
                                                                                    )
                                                                                }
                                                                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-success/5 transition-colors text-left border-b border-neutral-100 last:border-b-0"
                                                                            >
                                                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                                                                                    {advisor.photo ? (
                                                                                        <img
                                                                                            src={`/assets/resources/${advisor.photo}`}
                                                                                            alt={
                                                                                                advisor.name
                                                                                            }
                                                                                            className="w-full h-full object-cover"
                                                                                            onError={(
                                                                                                e,
                                                                                            ) => {
                                                                                                e.target.src =
                                                                                                    "/api/cover/thumbnail/null";
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                                                                                            {advisor.name
                                                                                                ?.charAt(
                                                                                                    0,
                                                                                                )
                                                                                                .toUpperCase()}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-medium text-neutral-dark 0 text-base">
                                                                                        {
                                                                                            advisor.name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-sm text-neutral-light">
                                                                                        {advisor.position ||
                                                                                            "Asesor"}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                                                                                    <svg
                                                                                        className="w-4 h-4 text-white"
                                                                                        fill="currentColor"
                                                                                        viewBox="0 0 24 24"
                                                                                    >
                                                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                                                    </svg>
                                                                                </div>
                                                                            </button>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductListCardPanelPro;
