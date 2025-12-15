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
} from "lucide-react";

import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";
import { usePage } from "@inertiajs/react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

export default function ScrapingProductDetail({ item, setCart, cart }) {


    const [url, setUrl] = useState(null);

    useEffect(() => {
        // Recuperar el dato oculto desde sessionStorage
        const storedUrl = sessionStorage.getItem("product_url");
      
        if (storedUrl) {
            setUrl(storedUrl);
            sessionStorage.removeItem("product_url"); // Limpiar después de usarlo
        }
    }, []);

    const itemsRest = new ItemsRest();
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    const [quantity, setQuantity] = useState(1);
    const handleChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        setQuantity(value);
    };
    /*ESPECIFICACIONES */
    const [isExpanded, setIsExpanded] = useState(false);

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: quantity });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${product.name} al carrito`,
            icon: "success",
            timer: 1500,
        });
    };

    const [associatedItems, setAssociatedItems] = useState([]);
    const inCart = cart?.find((x) => x.id == item?.id);

    useEffect(() => {
        if (item?.id) {
            obtenerCombo(item);
        }
    }, [item]); // Agregar `item` como dependencia

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
            return
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
    }


    return (
        <div className="px-primary mx-auto py-12 bg-[#F7F9FB] ">
            <div className="bg-white rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Images and Delivery Options */}
                    <div className="space-y-6">
                        {/* Product Images */}
                        <div className="flex gap-6">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() =>
                                        setSelectedImage({
                                            url: item?.image,
                                            type: "main",
                                        })
                                    }
                                    className={`w-16 h-16 border rounded-lg p-2 ${selectedImage.url === item?.image
                                        ? "border-blue-400"
                                        : "border-gray-200"
                                        }`}
                                >
                                    <img
                                        src={`/storage/images/item/${item?.image}`}
                                        alt="Main Thumbnail"
                                        className="w-full h-full object-contain"
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
                                        className={`w-16 h-16 border rounded-lg p-2 ${selectedImage.url === image.url
                                            ? "border-blue-400"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <img
                                            src={`/storage/images/item_image/${image.url}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1">
                                <img
                                    src={
                                        selectedImage.type === "main"
                                            ? `/storage/images/item/${selectedImage.url}`
                                            : `/storage/images/item_image/${selectedImage.url}`
                                    }
                                    alt="Product main"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        {/* Delivery Options */}
                        <div className="border rounded-lg">
                            <div className="flex gap-6 items-center justify-center py-4 customtext-neutral-dark">
                                <div className="p-4">
                                    <div className="bg-[#F7F9FB] py-4 px-5 rounded-full w-max h-max">
                                        <Home className="w-6 h-6 mx-auto mb-1 customtext-primary" />
                                    </div>

                                    <p className="font-semibold text-sm">Despacho</p>
                                    <p className="font-semibold text-sm">
                                        a domicilio
                                    </p>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="bg-[#F7F9FB] py-4 px-5 rounded-full w-max h-max">
                                        <Store className="w-6 h-6 mx-auto mb-1 customtext-primary" />
                                    </div>

                                    <p className="font-semibold text-sm">Retira</p>
                                    <p className="font-semibold text-sm">
                                        en tienda
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="mt-8 bg-[#F7F9FB] rounded-lg p-6 space-y-4 customtext-neutral-dark">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-5 h-5 customtext-primary" />
                                <span className="text-sm font-semibold">
                                    ¿Necesitas ayuda? Llámanos al 012037074
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm ">
                                <CircleUserRound className="w-5 h-5 customtext-primary" />
                                <span className="text-sm font-semibold">Soporte técnico</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div>
                        {/* Brand and Title */}
                        <div className="mb-6">
                            <p className="customtext-neutral-light text-sm">
                                Marca: <span className="customtext-neutral-dark">{item?.brand.name}</span>
                            </p>
                            <h1 className="customtext-neutral-dark text-[40px] font-bold mt-2">
                                {item?.name}
                            </h1>
                        </div>

                        {/* SKU and Availability */}
                        <div className="flex customtext-neutral-light items-center gap-8 text-sm mb-6">
                            <span className="customtext-neutral-light text-sm">
                                SKU:  <span className="customtext-neutral-dark">{item?.sku}</span>
                            </span>
                            <span className="ustomtext-neutral-light text-sm">
                                Disponibilidad:{" "}
                                <span className="customtext-neutral-dark">
                                    {item?.stock > 0 ? "En stock" : "Agotado"}
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-8 border-b-2 pb-8">
                            {/* Specifications */}
                            <div className="flex-1 w-6/12 ">
                                <div className="bg-[#F7F9FB] rounded-lg p-6">
                                    <h3 className="font-medium text-sm mb-4">
                                        Especificaciones principales
                                    </h3>
                                    <ul
                                        className={`space-y-2  customtext-neutral-light mb-4 transition-all duration-300 ${expandedSpecificationMain
                                            ? "max-h-full"
                                            : "max-h-24 overflow-hidden"
                                            }`}
                                        style={{ listStyleType: "disc" }}
                                    >
                                        {item?.specifications.map(
                                            (spec, index) =>
                                                spec.type === "principal" && (
                                                    <li key={index} className="flex gap-2">
                                                        <CircleCheckIcon className="customtext-primary" />
                                                        {spec.description}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                    <button
                                        className="customtext-primary text-sm font-semibold hover:underline flex items-center gap-1 transition-all duration-300"
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

                            {/* Price Section */}
                            <div className=" w-6/12 ">
                                <p className="text-sm customtext-neutral-light mb-1">
                                    Precio:{" "}
                                    <span className="line-through">
                                        {CurrencySymbol()} {item?.price}
                                    </span>
                                </p>
                                <div className="flex items-center gap-4 ">
                                    <span className="text-[40px] font-bold">
                                        {CurrencySymbol()} {item?.final_price}
                                    </span>
                                    <span className="bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl">
                                        -
                                        {Number(item?.discount_percent).toFixed(
                                            1
                                        )}
                                        %
                                    </span>
                                </div>

                                {/* Quantity */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex items-center space-x-4 customtext-neutral-light text-sm">
                                            <span className="">Cantidad</span>
                                            <div className="relative flex items-center border rounded-md px-2 py-1">
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={handleChange}
                                                    min="1"
                                                    max="10"
                                                    className="w-10 py-1 customtext-neutral-dark text-center bg-transparent outline-none appearance-none"
                                                />
                                            </div>
                                            <span className="">Máximo 10 unidades.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={() => onAddClicked(item)}
                                    className="w-full bg-primary text-white py-3 font-bold shadow-lg rounded-xl hover:opacity-90 transition-all duration-300 mt-4"
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>

                        {/* Complementary Products */}
                        <div className="mt-8 ">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingCart className="w-6 h-6 customtext-primary" />
                                <h2 className="text-base font-semibold">
                                    Completa tu compra con estos productos
                                </h2>
                            </div>

                            <div className=" flex gap-4">
                                <div className="w-2/3 flex gap-2">
                                    {associatedItems.map((product, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <img
                                                src={`/storage/images/item/${product.image}`}
                                                className=" rounded-lg aspect-square w-24 h-24 object-cover bg-[#F7F9FB]"
                                            />
                                            {index <
                                                associatedItems.length - 1 && (
                                                    <span className="text-2xl font-bold">
                                                        <Plus />
                                                    </span>
                                                )}
                                        </div>
                                    ))}
                                </div>
                                <div className=" w-1/3 flex flex-col justify-between items-end bg-gray-50 p-4 rounded-lg mt-4">
                                    <span className="text-xs font-semibold customtext-neutral-light">
                                        Total
                                    </span>

                                    <p className="font-bold mb-2 customtext-neutral-dark">
                                        {CurrencySymbol()} {total.toFixed(2)}
                                    </p>
                                    <button onClick={() => addAssociatedItems()} className="bg-primary text-xs font-semibold text-white w-full py-3 rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-md">
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>

                            {associatedItems.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex mt-4 gap-4 p-4 border rounded-lg items-center"
                                >
                                    <CheckSquare className="w-5 h-5 customtext-primary" />
                                    <div className="flex-1 font-semibold">
                                        <span className="text-[10px] customtext-neutral-dark block">
                                            {product.brand.name}
                                        </span>
                                        <p className="text-sm customtext-neutral-light font-medium">
                                            {product.name}
                                        </p>
                                    </div>
                                    <p className="font-bold customtext-neutral-dark">
                                        {CurrencySymbol()} {parseFloat(
                                            product.final_price
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className=" grid gap-20 md:grid-cols-2 bg-white rounded-xl p-8 mt-12">
                {/* Specifications Section */}
                <div>
                    <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-4">
                        Especificaciones
                    </h2>
                    <div className="space-y-1">
                        {item?.specifications.map(
                            (spec, index) =>
                                spec.type === "general" && (
                                    <div
                                        key={index}
                                        className={`grid grid-cols-2 gap-4 p-4 ${index % 2 === 0
                                            ? "bg-[#F7F9FB]"
                                            : "bg-white"
                                            }`}
                                    >
                                        <div className="customtext-neutral-light">
                                            {spec.title}
                                        </div>
                                        <div className="customtext-neutral-dark">{spec.description}</div>
                                    </div>
                                )
                        )}
                    </div>
                </div>

                {/* Additional Information Section */}
                <div>
                    <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-4">
                        Información adicional
                    </h2>
                    <div
                        className={`space-y-2 ${!isExpanded ? "max-h-[400px] overflow-hidden" : ""
                            }`}
                    >
                        <h3 className="text-xl font-semibold customtext-neutral-dark mb-4">
                            Acerca de este artículo
                        </h3>
                        <div
                            className="customtext-neutral-dark"
                            dangerouslySetInnerHTML={{
                                __html: item?.description,
                            }}
                        ></div>
                        <div className={`pl-10`}>
                            <ul className="list-disc pl-5 space-y-2">
                                {item?.features.map((feature, index) => (
                                    <li key={index} className="customtext-neutral-dark">
                                        {feature.feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <botton
                        variant="ghost"
                        className="border-2 border-primary  w-max px-5 py-3  my-8  rounded-xl flex items-center gap-2 customtext-primary font-semibold cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        Ver más
                        <ChevronDown
                            className={`transform transition-transform ${isExpanded ? "rotate-180" : ""
                                }`}
                        />
                    </botton>
                </div>
            </div>
        </div>
    );
}
