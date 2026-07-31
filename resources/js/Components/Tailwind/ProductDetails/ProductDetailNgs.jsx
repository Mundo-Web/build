import React, { useEffect, useRef, useState } from "react";
import {
    ShoppingCart,
    Store,
    Home,
    Phone,
    CircleUserRound,
    ChevronDown,
    Plus,
    ChevronUp,
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
    Shield,
    ShieldCheck,
    ArrowRight,
    Tag,
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import General from "../../../Utils/General";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import CartModalRainstar from "../Components/CartModalRainstar";
import CardProductNgs from "../Products/Components/CardProductNgs";

/**
 * ProductDetailNgs — Componente de detalle de producto para NGS Solutions.
 * Incorpora galería interactiva con zoom, datos técnicos, cotización WhatsApp, 
 * descarga de fichas en PDF y productos relacionados con la tarjeta CardProductNgs.
 */
const ProductDetailNgs = ({
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
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(item);
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
                    popup: "rounded-3xl border border-slate-200 font-bold",
                    confirmButton:
                        "rounded-full bg-primary text-white hover:bg-secondary transition-all px-6 py-2.5",
                },
            });
        }
    };

    const productosRelacionados = async (prodItem) => {
        try {
            const request = {
                id: prodItem?.id,
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
        }
    }, [item?.id]);

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
            `Hola, me interesa solicitar cotización del producto: ${currentProduct?.name || item?.name} (${window.location.href})`,
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
        <main id={data?.element_id || null} className=" min-h-screen text-neutral-dark py-12 mx-auto ">
            <div className="w-full 2xl:max-w-7xl px-primary 2xl:px-0 mx-auto">
                {/* Product Layout Grid */}
                <article
                    itemScope={true}
                    itemType="https://schema.org/Product"
                    className="grid grid-cols-12 gap-8 lg:gap-12 "
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
                                            className={`w-20 md:w-full aspect-square rounded-2xl border p-1 bg-white cursor-pointer transition-all shrink-0 overflow-hidden ${isActive
                                                ? "border-primary ring-2 ring-primary/30 shadow-md"
                                                : "border-slate-200 hover:border-neutral-light"
                                                }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${imgUrl}`}
                                                className="w-full h-full object-contain rounded-xl"
                                                alt="thumb"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Main Image Container */}
                        <div className="flex-1   rounded-3xl relative group overflow-hidden">
                            <div
                                ref={imageRef}
                                className="aspect-square bg-transparent cursor-zoom-in relative overflow-hidden flex items-center justify-center rounded-2xl"
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

                                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare();
                                        }}
                                        className="bg-white/90 backdrop-blur-md text-neutral-dark p-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-md border border-slate-200"
                                        title="Compartir"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Specs & CTAs */}
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                        {/* Category & Brand Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            {currentProduct?.category?.name && (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase  bg-primary/10 text-primary border border-primary/20">

                                    <span>{currentProduct.category.name}</span>
                                </span>
                            )}
                            {currentProduct?.brand?.name && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">

                                    <span>{currentProduct.brand.name}</span>
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1
                            itemProp="name"
                            className="text-4xl md:text-5xl xl:text-6xl font-title font-bold text-neutral-dark  "
                        >
                            {currentProduct?.name || item?.name}
                        </h1>

                        {/* Description / Summary */}
                        {currentProduct?.description && (
                            <div
                                className="prose prose-base md:prose-lg max-w-none 
                                prose-headings:font-title prose-headings:font-bold prose-headings:text-neutral-dark 
                                prose-p:text-neutral-light prose-p:font-paragraph prose-p: 
                                prose-strong:text-neutral-dark prose-strong:font-bold 
                                prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 
                                prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic 
                                prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 prose-img:shadow-md"
                                dangerouslySetInnerHTML={{ __html: currentProduct.description }}
                            />
                        )}

                        {/* Specifications Table (Datos Técnicos) */}
                        {generalSpecifications.length > 0 && (
                            <div className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-xs">
                                <div className="bg-slate-100/80 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
                                    <span className="text-base font-bold uppercase  text-neutral-dark ">
                                        DATOS TÉCNICOS Y ESPECIFICACIONES
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-lg border-collapse">
                                        <tbody>
                                            {generalSpecifications.map((spec, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="border-b border-slate-100 last:border-b-0 odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/50 transition-colors"
                                                >
                                                    {spec.title ? (
                                                        <>
                                                            <td className="py-3.5 px-5 font-bold text-neutral-dark text-sm uppercase  w-1/3 sm:w-2/5 align-top bg-slate-50/40 border-r border-slate-100">
                                                                {spec.title}
                                                            </td>
                                                            <td className="py-3.5 px-5 text-neutral-light font-medium align-top ">
                                                                {spec.description || spec.value}
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <td colSpan={2} className="py-3.5 px-5 text-neutral-light font-medium ">
                                                            {spec.description || spec.value}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Price Display if present */}
                        {(currentProduct?.final_price > 0 || currentProduct?.price > 0) && (
                            <div className="flex items-baseline gap-3 pt-2">
                                <span className="text-3xl font-bold text-primary font-title">
                                    {CurrencySymbol()} {currentProduct?.final_price || currentProduct?.price}
                                </span>
                                {currentProduct?.price > currentProduct?.final_price && (
                                    <span className="text-lg text-neutral-light line-through">
                                        {CurrencySymbol()} {currentProduct.price}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Action Buttons: PDF Fichas + WhatsApp Cotización */}
                        <div className="flex flex-col gap-3 pt-4 w-full">
                            {/* Especificaciones / Fichas Técnicas PDF */}
                            {pdfFiles.length > 0 && (
                                <div className="relative w-full">
                                    {pdfFiles.length === 1 ? (
                                        <a
                                            href={`/storage/images/item/${pdfFiles[0].url || pdfFiles[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-neutral-dark rounded-full font-bold text-xs md:text-sm uppercase  flex items-center justify-center gap-2 transition-all shadow-xs"
                                        >
                                            <Download className="w-4 h-4 text-primary" />
                                            <span>DESCARGAR FICHA TÉCNICA (PDF)</span>
                                        </a>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setIsPdfDropdownOpen(!isPdfDropdownOpen)}
                                                className="w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-neutral-dark rounded-full font-bold text-xs md:text-sm uppercase  flex items-center justify-center gap-2 transition-all shadow-xs"
                                            >
                                                <Download className="w-4 h-4 text-primary" />
                                                <span>FICHAS TÉCNICAS (PDF)</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isPdfDropdownOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            {isPdfDropdownOpen && (
                                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 p-2 space-y-1">
                                                    <p className="text-xs font-bold text-neutral-light px-3 py-1 uppercase">Documentos Disponibles:</p>
                                                    {pdfFiles.map((pdf, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={`/storage/images/item/${pdf.url || pdf}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full text-left px-3 py-2 text-sm font-bold text-neutral-dark hover:bg-slate-50 rounded-xl flex items-center justify-between transition-colors"
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
                                            className="w-full py-4 px-6 bg-accent hover:bg-primary text-white rounded-full font-bold text-sm md:text-base uppercase  flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-accent/25 active:scale-[0.99]"
                                        >
                                            <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                                            <span>SOLICITAR UNA COTIZACIÓN AHORA</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isAdvisorDropdownOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {isAdvisorDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 p-2 space-y-1">
                                                <p className="text-xs font-bold text-neutral-light px-3 py-1 uppercase">Selecciona un asesor:</p>
                                                {advisors.map((adv, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAdvisorClick(adv)}
                                                        className="w-full text-left px-3 py-2 text-sm font-bold text-neutral-dark hover:bg-slate-50 rounded-xl flex items-center justify-between transition-colors"
                                                    >
                                                        <span>{adv.name || `Asesor ${idx + 1}`}</span>
                                                        <MessageCircle className="w-4 h-4 text-green-600 shrink-0" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={handleSingleAdvisorClick}
                                        className="w-full py-4 px-6 bg-accent hover:bg-primary text-white rounded-full font-bold text-sm md:text-base uppercase  flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-accent/25 active:scale-[0.99]"
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
                    <section className="mt-16 pt-12 border-t border-slate-200">
                        <div className="mb-8 text-left">
                            <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-neutral-dark font-title">
                                <TextWithHighlight
                                    text="PRODUCTOS *RELACIONADOS*"
                                    className="text-neutral-dark font-title"
                                    color="bg-secondary"
                                />
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                            {relationsItems.map((relProduct, index) => (
                                <CardProductNgs
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

export default ProductDetailNgs;
