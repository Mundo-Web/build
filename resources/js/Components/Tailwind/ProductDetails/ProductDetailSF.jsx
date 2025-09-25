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
import { CurrencySymbol } from "../../../Utils/Number2Currency";


export default function ProductDetailSF({ item, data, setCart, cart, textstatic, contacts}) {
    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    // Debug: verificar que lleguen los datos
    console.log("DEBUG - data:", data);
    console.log("DEBUG - button_consultation:", data?.button_consultation);
    console.log("DEBUG - button_buy:", data?.button_buy);

  
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
    const onAddClicked = (product) => {

        const variantToAdd  = sizesItems.find(v => v.slug === selectedSize) || selectedVariant || product;
        const newCart = structuredClone(cart);
        //const index = newCart.findIndex((x) => x.id == product.id);
        const index = newCart.findIndex((x) => x.id == variantToAdd .id);
        
        if (index == -1) {
            //newCart.push({ ...product, quantity: quantity });
            newCart.push({ 
                ...variantToAdd , 
                quantity: quantity,
            });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);
    
        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${selectedVariant.name || product.name} al carrito`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Abrir mini carrito",
            cancelButtonText: "Seguir comprando",
            reverseButtons: true,
            timer: 5000,
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
            console.log(request);
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
    return (
        <>
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto pb-4 md:pb-6 xl:pb-8 bg-white">
                <div className="bg-white rounded-xl py-4 md:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-20 2xl:gap-16">
                        {/* Left Column - Images and Delivery Options */}
                        <div className="space-y-6">
                            {/* Product Images */}
                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* Thumbnails - Desktop: left side, Mobile: bottom */}
                                <div className="flex flex-row lg:flex-col gap-2 order-2 lg:order-1 lg:w-20">
                                    <button
                                        onClick={() =>
                                            setSelectedImage({
                                                url: item?.image,
                                                type: "main",
                                            })
                                        }
                                        className={`rounded-xl p-1 border-2 flex-shrink-0 ${
                                            selectedImage.url === item?.image
                                                ? "border-primary "
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={`/storage/images/item/${item?.image}`}
                                            alt="Main Thumbnail"
                                            className="w-16 lg:w-20  aspect-[3/4] rounded-lg object-cover"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </button>
                                    {item?.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage({
                                                    url: image.url,
                                                    type: "gallery",
                                                })
                                            }
                                            className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg p-1 flex-shrink-0 ${
                                                selectedImage.url === image.url
                                                    ? "border-primary"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${image.url}`||"/api/cover/thumbnail/null"}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 order-1 lg:order-2">
                                    <img
                                        src={
                                            selectedImage.type === "main"
                                                ? `/storage/images/item/${selectedImage.url}`
                                                : `/storage/images/item/${selectedImage.url}`
                                        }
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                        alt="Product main"
                                        className="w-full h-auto rounded-xl object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="flex flex-col gap-3">
                            
                            {/* Brand and Title */}
                            <div className="font-paragraph">
                                {item?.brand && (
                                    <p className="customtext-neutral-light text-sm 2xl:text-lg">
                                        Marca:{" "}
                                        <span className="customtext-neutral-dark">
                                            {item?.brand.name}
                                        </span>
                                    </p>
                                )}
                                <h1 className="customtext-neutral-dark text-3xl lg:text-4xl 2xl:text-5xl font-bold mt-2">
                                    {item?.name}
                                </h1>
                            </div>

                            {/* SKU and Availability */}
                            <div className="flex flex-wrap customtext-neutral-light items-center gap-y-2 gap-x-8 text-sm font-paragraph">
                                <span className="customtext-neutral-dark text-base 2xl:text-lg">
                                    SKU:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {item?.sku}
                                    </span>
                                </span>
                                <span className="customtext-neutral-dark text-base 2xl:text-lg">
                                    Disponibilidad:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {selectedVariant?.stock > 0 ? "En stock" : "Agotado"}
                                    </span>
                                </span>
                            </div>

                            {/* Price Section */}
                            {(selectedVariant?.price > 0 || selectedVariant?.final_price > 0) && (
                                <div className="flex flex-col w-full xl:w-1/2 font-paragraph max-w-xl mt-5">
                                    <p className="text-base 2xl:text-lg customtext-neutral-dark opacity-70 font-medium">
                                        Precio:{" "}
                                        <span className="line-through">
                                            {CurrencySymbol()} {selectedVariant?.price}
                                        </span>
                                    </p>
                                    <div className="flex flex-row items-center gap-4 relative">
                                        <span className="text-[40px] font-bold customtext-neutral-dark">
                                            {CurrencySymbol()} {selectedVariant?.final_price}
                                        </span>
                                        <span className="bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl text-base">
                                            -{calculateDiscount(selectedVariant?.price, selectedVariant?.final_price)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            {item?.summary && (
                                <div className="flex flex-col customtext-neutral-dark font-paragraph text-base 2xl:text-lg my-3">
                                    <p>{item?.summary}</p>       
                                </div>
                            )}

                            {variationsItems.length > 1 && (
                                <div className="variants-color flex flex-col gap-4">
                                    <h3 className="w-full block font-medium customtext-neutral-dark text-base 2xl:text-lg">
                                        Colores
                                    </h3>

                                    <div className="flex gap-3 items-center justify-start w-full flex-wrap">
                                        {variationsItems.map((variant) => (
                                            <Tippy key={variant.slug} content={variant.color}>
                                                <a
                                                    href={`/item/${variant.slug}`}
                                                    className={`variant-option rounded-full object-fit-cover transition-all duration-200 hover:scale-105 ${
                                                        variant.color === item.color 
                                                        ? "active p-[2px] border-[2px] border-primary shadow-lg"
                                                        : "p-[2px] border-[2px] border-gray-200 hover:border-gray-400"
                                                    }`}
                                                >
                                                    <img
                                                        className="color-box rounded-full h-10 w-10 lg:h-12 lg:w-12 object-cover"
                                                        src={`/storage/images/item/${variant.texture || variant.image}`}
                                                        onError={(e) =>
                                                            (e.target.src = "/api/cover/thumbnail/null")
                                                        }
                                                        alt={`Color ${variant.color}`}
                                                    />
                                                </a>
                                            </Tippy>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sizesItems.length > 0 && (
                                <div className="variants-color flex flex-col gap-4">
                                    <h3 className="w-full block font-medium customtext-neutral-dark text-base 2xl:text-lg">
                                        Tallas
                                    </h3>

                                    <div className="flex gap-3 items-center justify-start w-full flex-wrap">
                                        {sizesItems.map((variant) => (
                                            <button
                                                key={variant.slug}
                                                onClick={() => handleSizeChange(variant.slug)}
                                                className={`relative min-w-12 h-12 px-3 flex items-center justify-center text-center font-medium rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                                                    selectedSize === variant.slug
                                                        ? "border-primary bg-primary text-white shadow-lg transform scale-105"
                                                        : "border-gray-200 bg-white customtext-neutral-dark hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {variant.size}
                                               
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="flex items-center mt-8 gap-4">
                                <h3 className="font-medium customtext-neutral-dark text-base 2xl:text-lg">
                                    Cantidad
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 customtext-neutral-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={handleChange}
                                            min="1"
                                            max="10"
                                            className="w-16 h-12 customtext-neutral-dark text-center bg-white outline-none appearance-none font-medium text-lg border-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                            disabled={quantity >= 10}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 customtext-neutral-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    <span className="text-sm customtext-neutral-light">
                                        Máximo 10 unidades
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart - Conditional based on data?.button_buy - Desktop only */}
                            {data?.button_buy && (
                                <button
                                    onClick={() => {
                                        onAddClicked(item);
                                    }}
                                    disabled={selectedVariant?.stock <= 0}
                                    className={`hidden lg:block w-full font-paragraph text-base 2xl:text-lg py-3 font-semibold rounded-3xl transition-all duration-300 mt-3 ${
                                        selectedVariant?.stock > 0
                                            ? "bg-accent text-white hover:opacity-90 hover:shadow-lg transform hover:scale-[1.02]"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    {selectedVariant?.stock > 0 ? "Agregar al carrito" : "Producto agotado"}
                                </button>
                            )}

                            {/* WhatsApp Consultation Button - Desktop only */}
                            {data?.button_consultation && (
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${getContact("phone_whatsapp")}&text=${encodeURIComponent(
                                        `Hola, deseo cotizar el siguiente producto:\n\n` +
                                        `📦 Producto: ${item?.name}\n` +
                                        `🔢 SKU: ${item?.sku}\n` +
                                        `${item?.color ? `🎨 Color: ${item?.color}\n` : ''}` +
                                        `${selectedVariant?.size ? `📏 Talla: ${selectedVariant?.size}\n` : ''}` +
                                        `📊 Cantidad: ${quantity}\n\n` +
                                        `¿Podrían enviarme más información y el precio?`
                                    )}`}
                                    target="_blank"
                                    className="hidden lg:flex w-full font-paragraph py-3 text-base 2xl:text-lg font-semibold rounded-3xl transition-all duration-300 mt-3 bg-primary text-white hover:bg-primary hover:shadow-lg transform hover:scale-[1.02] items-center justify-center gap-2"
                                >
                                    Cotizar este producto
                                </a>
                            )}

                            {/* Specifications */}
                            {item?.specifications?.length > 0 && (
                                <div className="flex-1 w-full mt-5 2xl:mt-8">
                                    <div className="bg-[#F7F9FB] rounded-xl p-6">
                                        <h3 className="font-semibold text-lg xl:text-xl 2xl:text-2xl mb-4 customtext-neutral-dark font-paragraph">
                                            Especificaciones principales
                                        </h3>
                                        <ul
                                            className={`space-y-1  customtext-neutral-light  mb-4 list-disc transition-all duration-300 ${
                                                expandedSpecificationMain
                                                    ? "max-h-full"
                                                    : "max-h-20 overflow-hidden"
                                            }`}
                                            style={{ listStyleType: "disc" }}
                                        >
                                            {item?.specifications.map(
                                                (spec, index) =>
                                                    spec.type === "principal" && (
                                                        <li
                                                            key={index}
                                                            className="gap-2  customtext-primary opacity-85 flex flex-row items-start"
                                                        >   
                                                            <CircleCheckIcon className="customtext-primary mt-1 min-w-4 min-h-4 max-w-4 max-h-4" />
                                                           <span className="first-letter:uppercase"> {spec?.description?.toLowerCase()}</span>
                                                        </li>
                                                    )
                                            )}
                                        </ul>
                                        <button
                                            className="font-semibold flex flex-row gap-2 items-center text-base xl:text-[17px] 2xl:text-xl mb-4 customtext-neutral-dark font-paragraph pb-2 border-b border-neutral-dark"
                                            onClick={() =>
                                                setExpanded(
                                                    !expandedSpecificationMain
                                                )
                                            }
                                        >
                                            {expandedSpecificationMain
                                                ? "Ver menos"
                                                : "Ver más especificaciones"}
                                            {expandedSpecificationMain ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Whatsapp */}
                            <div className="w-full mt-5">
                                <a  href={`https://api.whatsapp.com/send?phone=${getContact("phone_whatsapp")}&text=${encodeURIComponent(
                                        `Hola, deseo mayor información acerca del producto: ${item?.name}`
                                    )}`}
                                 target="_blank">
                                    <div className="bg-[#F7F9FB] flex flex-row rounded-xl p-5 gap-3">
                                        <img
                                            src="/assets/img/salafabulosa/whatsapp.png"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "assets/img/noimage/no_imagen_circular.png")
                                            }
                                            className="w-12 h-12 object-contain"
                                            loading="lazy"
                                        />
                                        <div className="customtext-neutral-dark font-paragraph text-base  2xl:text-xl font-semibold">
                                            <p>
                                                ¿Tienes dudas sobre este producto? 
                                                Haz 
                                                <span className="underline"></span>
                                                    clic aquí
                                                
                                                y chatea con nosotros por WhatsApp
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-10 lg:gap-20 md:grid-cols-2 bg-white rounded-xl p-4 sm:p-8 font-paragraph">
                    {/* Specifications Section */}
                    {item?.specifications?.length > 0 && item.specifications.some(spec => spec.type === "general") && (
                        <div>
                            <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-3">
                                Especificaciones
                            </h2>
                            <div className="space-y-1">
                                {item.specifications.map(
                                    (spec, index) =>
                                        spec.type === "general" && (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-2 gap-4 p-3 ${
                                                    index % 2 === 0
                                                        ? "bg-[#F7F9FB]"
                                                        : "bg-white"
                                                }`}
                                            >
                                                <div className="customtext-neutral-dark ">
                                                    {spec.title}
                                                </div>
                                                <div className="customtext-neutral-dark opacity-75">
                                                    {spec.description}
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Additional Information Section */}
                    {data?.show_additional_info && (
                        <div className="font-paragraph">
                            {item?.description?.replace(/<[^>]+>/g, '') && (
                                <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-3">
                                    Información adicional
                                </h2>
                            )}

                            <div
                                className={`space-y-2 ${
                                    !isExpanded
                                        ? "max-h-none overflow-hidden"
                                        : ""
                                }`}
                            >
                                {item?.description?.replace(/<[^>]+>/g, '') && (
                                    <>
                                    <h3 className="text-xl font-semibold customtext-neutral-dark mb-4">
                                        Acerca de este artículo
                                    </h3>
                                    <div
                                        className="customtext-neutral-dark"
                                        dangerouslySetInnerHTML={{
                                            __html: item?.description,
                                        }}
                                    ></div>
                                    </>
                                )}
                                
                                {item?.features?.length > 0 && (
                                    <div className={`pl-10`}>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {item?.features.map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="customtext-neutral-dark"
                                                >
                                                    {feature.feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>

            {/* Mobile Footer - Fixed Action Buttons */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
                <div className="flex gap-3">
                    {/* Add to Cart Button - Mobile */}
                    {data?.button_buy && (
                        <button
                            onClick={() => {
                                onAddClicked(item);
                            }}
                            disabled={selectedVariant?.stock <= 0}
                            className={`flex-1 font-paragraph text-sm py-3 font-semibold rounded-2xl transition-all duration-300 ${
                                selectedVariant?.stock > 0
                                    ? "bg-accent text-white hover:opacity-90"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {selectedVariant?.stock > 0 ? "Agregar al carrito" : "Producto agotado"}
                        </button>
                    )}

                    {/* WhatsApp Consultation Button - Mobile */}
                    {data?.button_consultation && (
                        <a
                            href={`https://api.whatsapp.com/send?phone=${getContact("phone_whatsapp")}&text=${encodeURIComponent(
                                `Hola, deseo cotizar el siguiente producto:\n\n` +
                                `📦 Producto: ${item?.name}\n` +
                                `🔢 SKU: ${item?.sku}\n` +
                                `${item?.color ? `🎨 Color: ${item?.color}\n` : ''}` +
                                `${selectedVariant?.size ? `📏 Talla: ${selectedVariant?.size}\n` : ''}` +
                                `📊 Cantidad: ${quantity}\n\n` +
                                `¿Podrían enviarme más información y el precio?`
                            )}`}
                            target="_blank"
                            className={`font-paragraph text-base py-3 font-semibold rounded-xl transition-all duration-300 bg-primary text-white hover:opacity-90 flex items-center justify-center gap-2 ${
                                data?.button_buy ? "flex-1" : "w-full"
                            }`}
                        >
                         
                          Cotizar este producto
                        </a>
                    )}
                </div>
            </div>

            {/* Mobile Padding Bottom - to prevent content from being hidden behind fixed footer */}
            <div className="lg:hidden h-20"></div>

            {/* Productos relacionados */}
            {relationsItems.length > 0 && (
                <div className="-mt-10 mb-10 p-4">
                    <ProductNavigationSwiper
                        data={{ title: "Productos relacionados", link_catalog: "/catalogo" }}
                        items={relationsItems}
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
