import { useEffect, useState } from "react";
import {
    ShoppingCart,
    Store,
    Home,
    Phone,
    CircleUserRound,
    ChevronDown,
    CheckSquare,
    Plus,
    Minus,
    ChevronUp,
    CircleCheckIcon,
    DotIcon,

} from "lucide-react";

import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";
import ProductInfinite from "../Products/ProductInfinite";
import CartModal from "../Components/CartModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ProductNavigationSwiper from "../Products/ProductNavigationSwiper";
import em from "../../../Utils/em";
import Global from "../../../Utils/Global";
import CardProductBananaLab from "../Products/Components/CardProductBananaLab";
import ProductBananaLab from "../Products/ProductBananaLab";
import { CurrencySymbol } from "../../../Utils/Number2Currency";


export default function ProductDetailPidelo({ item, data, setCart, cart, textstatic, contacts }) {
    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });


    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(item?.slug);
    const [selectedVariant, setSelectedVariant] = useState(item);

    const handleChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        setQuantity(value);
    };

    const getContact = (correlative) => {
        return (
            contacts.find((contacts) => contacts.correlative === correlative)
                ?.description || ""
        );
    };

    /*TEXTOS */
    const textProductRelation = textstatic.find(x => x.correlative == 'detailproduct-relation-title')?.title ?? '';

    /*ESPECIFICACIONES */
    const [isExpanded, setIsExpanded] = useState(false);

    // const onAddClicked = (product) => {
    //     const newCart = structuredClone(cart);
    //     const index = newCart.findIndex((x) => x.id == product.id);
    //     if (index == -1) {
    //         newCart.push({ ...product, quantity: quantity });
    //     } else {
    //         newCart[index].quantity++;
    //     }
    //     setCart(newCart);

    //     Swal.fire({
    //         title: "Producto agregado",
    //         text: `Se agregó ${product.name} al carrito`,
    //         icon: "success",
    //         timer: 1500,
    //     });
    // };
    // Comprar: agrega al carrito y redirige al cart, sin abrir modal
    const onBuyClicked = (product) => {
        const variantToAdd = sizesItems.find(v => v.slug === selectedSize) || selectedVariant || product;
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == variantToAdd.id);
        if (index == -1) {
            newCart.push({
                ...variantToAdd,
                quantity: quantity,
            });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);
        // Redirige al carrito
        window.location.href = '/cart';
    };
    const onAddClicked = (product) => {


        const variantToAdd = sizesItems.find(v => v.slug === selectedSize) || selectedVariant || product;
        const newCart = structuredClone(cart);
        //const index = newCart.findIndex((x) => x.id == product.id);
        const index = newCart.findIndex((x) => x.id == variantToAdd.id);

        if (index == -1) {
            //newCart.push({ ...product, quantity: quantity });
            newCart.push({
                ...variantToAdd,
                quantity: quantity,
            });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        Swal.fire({
            title: '<span style="font-size:2rem;font-weight:700;color:#222">Producto agregado</span>',
            html: `<div style="font-size:1.1rem;color:#444;margin-bottom:1rem;">Se agregó <b>${selectedVariant.name || product.name}</b> al carrito</div>
                <img src='/storage/images/item/${selectedVariant.image || product.image}' style='width:100px;height:100px;border-radius:16px;margin:auto;background:#fff;object-fit:cover;' />`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: '<span style="font-size:1rem;font-weight:600;">Abrir mini carrito</span>',
            cancelButtonText: '<span style="font-size:1rem;font-weight:600;">Seguir comprando</span>',
            reverseButtons: true,
            timer: 5000,
            customClass: {
                popup: 'swal2-elegant-modal',
                confirmButton: 'swal2-confirm-primary',
                cancelButton: 'swal2-cancel-secondary',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                setModalOpen(!modalOpen);
            }
        });
    };



    const [associatedItems, setAssociatedItems] = useState([]);
    const [relationsItems, setRelationsItems] = useState([]);
    const [variationsItems, setVariationsItems] = useState([]);
    const [sizesItems, setSizesItems] = useState([]);
    const inCart = cart?.find((x) => x.id == item?.id);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
            obtenerCombo(item);
            handleViewUpdate(item);
            handleVariations(item);
            handleSizes(item);
            setSelectedSize(item.slug);
        }
    }, [item]); // Agregar `item` como dependencia

    const handleSizeChange = (sizeSlug) => {
        const variant = sizesItems.find(v => v.slug === sizeSlug) || item;
        setSelectedVariant(variant);
        setSelectedSize(sizeSlug);
        window.history.pushState({}, '', `/item/${sizeSlug}`);
    };

    const calculateDiscount = (price, finalPrice) => {
        if (!price || price <= finalPrice) return 0;
        return Math.round(((price - finalPrice) / price) * 100);
    };

    const handleViewUpdate = async (item) => {
        try {
            const request = {
                id: item?.id,
            };
     
            const response = await itemsRest.updateViews(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }
        } catch (error) {
            return;
        }
    };

    const obtenerCombo = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                id: item?.id,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.verifyCombo(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const associated = response[0].associated_items;

            setAssociatedItems(Object.values(associated));
        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };

    const productosRelacionados = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                id: item?.id,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.productsRelations(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const relations = response;

            setRelationsItems(Object.values(relations));

        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };

    const handleVariations = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                slug: item?.slug,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.getColors(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const variations = response;

            setVariationsItems(variations.variants);

        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };

    const handleSizes = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                slug: item?.slug,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.getSizes(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const variations = response;

            setSizesItems(variations);

        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };

    const total = associatedItems.reduce(
        (sum, product) => sum + parseFloat(product.final_price),
        0
    );
    const [expandedSpecificationMain, setExpanded] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);

    const addAssociatedItems = () => {
        setCart((prevCart) => {
            const newCart = structuredClone(prevCart); // Clona el estado anterior

            [...associatedItems, item].forEach((product) => {
                const index = newCart.findIndex((x) => x.id === product.id);
                if (index === -1) {
                    newCart.push({ ...product, quantity: quantity });
                } else {
                    newCart[index].quantity++;
                }
            });

            return newCart; // Devuelve el nuevo estado acumulado
        });
        Notify.add({
            icon: "/assets/img/icon.svg",
            title: "Carrito de Compras",
            body: "Se agregaron con éxito los productos",
        });
    };
    // Custom styles for SweetAlert2 elegant modal
    useEffect(() => {
        const styleId = 'swal2-elegant-modal-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .swal2-elegant-modal {
                    border-radius: 2rem !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                    padding: 2.5rem 2rem 2rem 2rem !important;
                    background: #fff !important;
                }
                .swal2-confirm-primary {
                    background: ${Global.APP_COLOR_PRIMARY} !important;
                    color: #fff !important;
                    border-radius: 1rem !important;
                    font-size: 1rem !important;
                    font-weight: 600 !important;
                    padding: 0.75rem 2rem !important;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.08);
                    border: none !important;
                    transition: background 0.2s;
                }
                
                .swal2-cancel-secondary {
                    background: #e5e7eb !important;
                    color: #222 !important;
                    border-radius: 1rem !important;
                    font-size: 1rem !important;
                    font-weight: 600 !important;
                    padding: 0.75rem 2rem !important;
                    border: none !important;
                    margin-left: 0.5rem !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);
    return (
        <>
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 md:py-6 xl:py-8 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Image Gallery */}
                    <div className="flex flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedImage({ url: item?.image, type: "main" })}
                                className={`w-16 h-16 rounded-lg p-1 border-2 ${selectedImage.url === item?.image ? "border-primary" : "border-gray-200"
                                    }`}
                            >
                                <img
                                    src={`/storage/images/item/${item?.image}`}
                                    alt="Main Thumbnail"
                                    className="w-full h-full object-cover rounded"
                                    onError={e => (e.target.src = "/api/cover/thumbnail/null")}
                                />
                            </button>
                            {item?.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage({ url: image.url, type: "gallery" })}
                                    className={`w-16 h-16 border-2 rounded-lg p-1 ${selectedImage.url === image.url ? "border-primary" : "border-gray-200"
                                        }`}
                                >
                                    <img
                                        src={`/storage/images/item/${image.url}` || "/api/cover/thumbnail/null"}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover rounded"
                                        onError={e => (e.target.src = "/api/cover/thumbnail/null")}
                                    />
                                </button>
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="flex-1">
                            <img
                                src={`/storage/images/item/${selectedImage.url}`}
                                alt="Product main"
                                className="w-full h-auto object-contain rounded-xl"
                                onError={e => (e.target.src = "/api/cover/thumbnail/null")}
                            />
                        </div>
                    </div>

                    {/* Right Column - Complete Product Info */}
                    <div className="flex flex-col gap-6">
                        {/* Product Header */}
                        <div className="font-paragraph">
                            <span className="customtext-neutral-dark text-sm">{item?.brand?.name}</span>
                            <h1 className="customtext-neutral-dark text-xl  lg:text-2xl font-bold leading-[1.0] mb-6 text-wrap">{item?.name}</h1>
                            <p className="customtext-neutral-dark text-sm line-clamp-5 lg:line-clamp-none lg:text-base mt-0 opacity-80" dangerouslySetInnerHTML={{ __html: item?.description }}></p>
                        </div>

                        {/* Quantity and Color Selectors - 50/50 Layout */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Quantity Selector - 50% */}
                            <div className="flex flex-row  items-center gap-4 ">
                                <span className="customtext-neutral-dark text-sm font-medium">Cantidad</span>
                                <div className="flex items-center bg-gray-50 rounded-xl p-1 w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-gray-100 customtext-neutral-dark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-white"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="w-16 px-3 py-2 text-center">
                                        <span className="customtext-neutral-dark font-semibold text-lg">{quantity}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-gray-100 customtext-neutral-dark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-white"
                                        disabled={quantity >= 10}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleChange}
                                    min="1"
                                    max="10"
                                    className="hidden"
                                />
                            </div>

                            {/* Color Selector - 50% */}
                            {variationsItems.length > 1 && (
                                <div className="flex items-center gap-4">
                                    <span className="customtext-neutral-dark text-base min-w-fit">Color:</span>
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="flex gap-2">
                                            {variationsItems.slice(0, 4).map((variant) => (
                                                <Tippy content={variant.color} key={variant.slug}>
                                                    <a
                                                        href={`/item/${variant.slug}`}
                                                        className={`rounded-full border-2 ${variant.color === item.color ? "border-primary" : "border-gray-200"
                                                            }`}
                                                    >
                                                        <img
                                                            className="color-box rounded-full h-8 w-8 object-fit-cover"
                                                            src={`/storage/images/item/${variant.texture || variant.image}`}
                                                        />
                                                    </a>
                                                </Tippy>
                                            ))}
                                        </div>
                                        {variationsItems.length > 4 && (
                                            <button
                                                onClick={() => setShowColorModal(true)}
                                                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 hover:border-primary bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                            >
                                                <Plus className="w-4 h-4 text-gray-600" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Color Modal */}
                        {showColorModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowColorModal(false)}>
                                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold customtext-neutral-dark">Seleccionar Color</h3>
                                        <button
                                            onClick={() => setShowColorModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <Plus className="w-5 h-5 rotate-45" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        {variationsItems.map((variant) => (
                                            <Tippy content={variant.color} key={variant.slug}>
                                                <a
                                                    href={`/item/${variant.slug}`}
                                                    className={`rounded-full border-2 flex items-center justify-center ${variant.color === item.color ? "border-primary" : "border-gray-200"
                                                        }`}
                                                    onClick={() => setShowColorModal(false)}
                                                >
                                                    <img
                                                        className="color-box rounded-full h-12 w-12 object-fit-cover"
                                                        src={`/storage/images/item/${variant.texture || variant.image}`}
                                                    />
                                                </a>
                                            </Tippy>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {sizesItems.length > 0 && (
                            <div className="flex items-center gap-4">
                                <span className="customtext-neutral-dark text-base">Tamaño:</span>
                                <div className="flex gap-2">
                                    {sizesItems.map((variant) => (
                                        <button
                                            key={variant.slug}
                                            onClick={() => handleSizeChange(variant.slug)}
                                            className={`rounded-md min-w-9 px-2 h-8 flex items-center justify-center bg-slate-200 text-sm ${selectedSize === variant.slug ? "border-primary border-2" : "border-gray-200 border"
                                                }`}
                                        >
                                            {variant.size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Details */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">

                            {/* Availability */}
                            <div className="flex gap-4 items-center justify-start ">
                                <span className="customtext-neutral-dark text-sm font-medium">Disponibilidad</span>
                                <span className={`px-3  py-1 rounded-full text-xs font-semibold ${selectedVariant?.stock > 0
                                    ? ` customtext-neutral-dark ${data?.class_badge || "bg-primary"}`
                                    : `bg-secondary customtext-neutral-dark`
                                    }`}>
                                    {selectedVariant?.stock > 0 ? "En stock" : "Agotado"}
                                </span>
                            </div>

                            {/* Brand */}
                            {item?.brand?.name && (
                                <div className="flex gap-4 items-center justify-start ">
                                    <span className="customtext-neutral-dark text-sm font-medium">Marca</span>
                                    <span className="customtext-neutral-dark text-sm font-bold">{item.brand.name}</span>
                                </div>
                            )}

                            {/* Weight */}
                            {item?.weight && (
                                <div className="flex gap-4 items-center justify-start ">
                                    <span className="customtext-neutral-dark text-sm font-medium">Peso con empaque</span>
                                    <span className="customtext-neutral-dark text-sm font-bold">{item.weight} kg</span>
                                </div>
                            )}

                            {/* Stock Quantity */}
                            {selectedVariant?.stock > 0 && (
                                <div className="flex gap-4 items-center justify-start ">
                                    <span className="customtext-neutral-dark text-sm font-medium">Stock disponible</span>
                                    <span className="customtext-neutral-dark text-sm font-bold">{selectedVariant.stock} unidades</span>
                                </div>
                            )}

                            {/* SKU */}
                            {item?.sku && (
                                <div className="flex gap-4 items-center justify-start ">
                                    <span className="customtext-neutral-dark text-sm font-medium">SKU</span>
                                    <span className="customtext-neutral-dark text-sm font-mono bg-gray-200 px-2 py-1 rounded">{item.sku}</span>
                                </div>
                            )}

                            {/* Category */}
                            {item?.category?.name && (
                                <div className="flex gap-4 items-center justify-start ">
                                    <span className="customtext-neutral-dark text-sm font-medium">Categoría</span>
                                    <span className="customtext-neutral-dark text-sm font-bold">{item.category.name}</span>
                                </div>
                            )}


                        </div>

                        {/* Specifications Grid */}
                        {item?.specifications?.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {item.specifications.filter(spec => spec.type === "general").slice(0, 4).map((spec, index) => (
                                    <div key={index} className="bg-[#F7F9FB] rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">{spec.title}</div>
                                        <div className="font-bold customtext-neutral-dark text-sm">{spec.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Purchase Card */}
                        <div className="bg-[#F7F9FB] rounded-xl p-6 flex flex-col gap-4 shadow-md">
                            {selectedVariant?.discount > 0 && selectedVariant?.price > selectedVariant?.final_price && (
                                <div className="text-sm text-gray-600">
                                    Precio: <span className="line-through">{CurrencySymbol()} {selectedVariant?.price}</span>
                                    <br />
                                    Ahorras: {CurrencySymbol()} {selectedVariant?.price - selectedVariant?.final_price} ({calculateDiscount(selectedVariant?.price, selectedVariant?.final_price)}%)
                                </div>)}
                            <div className="text-4xl font-bold customtext-neutral-dark">{CurrencySymbol()} {selectedVariant?.final_price}</div>



                            <div className="flex items-center gap-2 text-sm">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.66667 14.6654C4.99537 14.6654 3.65973 14.6654 2.82987 13.689C2 12.7128 2 11.1414 2 7.9987C2 4.856 2 3.28465 2.82987 2.30834C3.65973 1.33203 4.99537 1.33203 7.66667 1.33203C10.3379 1.33203 11.6736 1.33203 12.5035 2.30834C13.1715 3.09424 13.3018 4.26572 13.3272 6.33203" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.33301 5.33203H9.99967M5.33301 8.66536H7.33301" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M13.0725 12.0703C13.6344 11.6612 13.9997 10.9983 13.9997 10.25C13.9997 9.00733 12.9923 8 11.7497 8H11.583C10.3403 8 9.33301 9.00733 9.33301 10.25C9.33301 10.9983 9.69827 11.6612 10.2602 12.0703M13.0725 12.0703C12.7012 12.3405 12.2441 12.5 11.7497 12.5H11.583C11.0886 12.5 10.6315 12.3405 10.2602 12.0703M13.0725 12.0703L13.461 13.2936C13.6092 13.7602 13.6833 13.9935 13.6631 14.1388C13.6209 14.4411 13.3743 14.6656 13.0831 14.6667C12.9433 14.6672 12.7337 14.5572 12.3145 14.3373C12.1348 14.2429 12.0449 14.1957 11.953 14.168C11.7657 14.1115 11.567 14.1115 11.3797 14.168C11.2877 14.1957 11.1979 14.2429 11.0181 14.3373C10.599 14.5572 10.3894 14.6672 10.2495 14.6667C9.95841 14.6656 9.71181 14.4411 9.66961 14.1388C9.64934 13.9935 9.72347 13.7602 9.87167 13.2936L10.2602 12.0703" stroke="#141B34" />
                                </svg>

                                <span>Este producto tiene</span>
                                <span className={` customtext-neutral-dark px-1 lg:px-2 py-1 text-[9px] lg:text-sm rounded-lg font-semibold ${data?.class_badge || "bg-primary"}`}>Garantía de Entrega</span>
                            </div>

                            <div className="text-sm flex gap-2 text-gray-600">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.00033 1.33203C5.05481 1.33203 2.66699 3.42137 2.66699 5.9987H13.3337C13.3337 3.42137 10.9459 1.33203 8.00033 1.33203Z" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.33301 11.5555C5.33301 10.2686 5.56323 10 6.66634 10H9.33301C10.4361 10 10.6663 10.2686 10.6663 11.5555V13.1111C10.6663 14.3981 10.4361 14.6667 9.33301 14.6667H6.66634C5.56323 14.6667 5.33301 14.3981 5.33301 13.1111V11.5555Z" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M8.00502 11.668H7.99902" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M2.66699 6L8.00033 10L13.3337 6" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span> Agrega el producto al carrito para conocer los costos de envío</span>
                            </div>

                            <div className="text-sm text-gray-600 flex gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.66634 6.33333L3.51655 2.98374C3.23771 2.68298 3.28236 2.46329 3.6112 2.27308C4.22937 1.91551 4.71093 1.9058 5.36253 2.26339L8.63234 4.05781C8.86514 4.18555 9.09341 4.31504 9.33301 4.38568" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M8.33301 9.1101L9.73987 13.6477C9.85474 14.0183 10.057 14.0854 10.3703 13.9058C10.9594 13.568 11.1969 13.178 11.2128 12.4751L11.2927 8.94784C11.3033 8.4767 11.3014 8.01564 11.6663 7.66797" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.55198 7.3228L6.80994 6.40369L9.75814 4.25422L9.76074 4.25232L9.76574 4.24865C9.83534 4.19772 10.8726 3.44157 11.4609 3.18385C12.184 2.86709 12.8576 3.01435 13.5823 3.21675C13.9571 3.32143 14.1445 3.37377 14.2798 3.47143C14.4943 3.62637 14.6339 3.86483 14.6625 4.12566C14.6807 4.29005 14.6329 4.47637 14.5373 4.84902C14.3526 5.56951 14.1451 6.21877 13.5055 6.67833C12.9851 7.05227 11.8027 7.56067 11.7234 7.59453L11.7177 7.597L11.7147 7.59827L8.35414 9.04293L6.91848 9.65833C6.39794 9.88147 6.13768 9.99307 5.9606 10.2001C5.5459 10.685 5.48733 11.5625 5.33255 12.1662C5.24702 12.4999 4.778 13.078 4.36006 12.9912C4.10204 12.9377 4.0971 12.6147 4.06498 12.4087L3.75581 10.4259C3.68188 9.95173 3.6762 9.942 3.297 9.64173L1.71139 8.38613C1.5467 8.25573 1.2657 8.09 1.34768 7.84273C1.48047 7.4422 2.2224 7.33047 2.55799 7.4242C3.16524 7.5938 3.96466 7.98247 4.59757 7.87053C4.86781 7.82273 5.09588 7.65607 5.55198 7.3228Z" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>   Recibe aproximadamente entre 18 y 23 días hábiles, seleccionando envío normal</span>
                            </div>

                            <div className={`customtext-neutral-dark px-3 py-2 rounded-xl font-semibold text-center ${data?.class_badge || "bg-primary"}`}>
                                Hasta x6 cuotas sin intereses
                            </div>

                            <div className="flex flex-row flex-wrap gap-2 items-center justify-center">
                                <img src="/assets/img/banks/mastercard.png" alt="Mastercard" className="h-6" />
                                <img src="/assets/img/banks/bitpay.png" alt="Bitpay" className="h-6" />

                                <img src="/assets/img/banks/visa.png" alt="Visa" className="h-6" />
                                <img src="/assets/img/banks/americanexpress.png" alt="Amex" className="h-6" />
                                <img src="/assets/img/banks/discover.png" alt="Discover" className="h-6" />
                                <img src="/assets/img/banks/sofort.png" alt="Sofort" className="h-6" />
                                <img src="/assets/img/banks/gpay.png" alt="Google Pay" className="h-6" />
                                <img src="/assets/img/banks/applepay.png" alt="Apple Pay" className="h-6" />

                                <img src="/assets/img/banks/paypal.png" alt="Paypal" className="h-6" />
                                <img src="/assets/img/banks/maestro.png" alt="Maestro" className="h-6" />

                            </div>

                            <button
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition"
                                disabled={selectedVariant?.stock <= 0}
                                onClick={() => onBuyClicked(item)}
                            >
                                Comprar
                            </button>

                            <button
                                className="w-full bg-gray-200 text-gray-700 font-bold py-4 rounded-xl text-lg hover:opacity-90 transition"
                                onClick={() => onAddClicked(item)}
                                disabled={selectedVariant?.stock <= 0}
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos relacionados */}
            {relationsItems.length > 0 && (
                <div className="-mt-10 mb-10 p-4">
                    <ProductBananaLab
                        data={{ title: "Productos relacionados", text_button: "Ver todos", link_catalog: "/catalogo" }}
                        items={relationsItems}
                        setFavorites={[]}
                        favorites={[]}
                        cart={cart}
                        setCart={setCart}
                    />
                </div>
            )}

            <CartModal
                cart={cart}
                data={data}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
}
