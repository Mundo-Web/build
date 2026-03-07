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
    X,
    CheckCircle,
} from "lucide-react";
import ReactModal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";

if (typeof window !== "undefined") {
    ReactModal.setAppElement("#app");
}
import ProductInfinite from "../Products/ProductInfinite";
import CartModal from "../Components/CartModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ProductNavigationSwiper from "../Products/ProductNavigationSwiper";
import em from "../../../Utils/em";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

export default function ProductDetailSF({
    item,
    data,
    setCart,
    cart,
    textstatic,
    contacts,
}) {
    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(item?.image);

    const [quantity, setQuantity] = useState(1);
    const [variantsForSelectedGroup, setVariantsForSelectedGroup] = useState(
        [],
    );
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(item);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [lastAddedProduct, setLastAddedProduct] = useState(null);

    const masterProduct =
        variantsForSelectedGroup.find((v) => v.is_master) ||
        (item?.is_master ? item : null);
    const currentProduct = selectedVariant || item;

    useEffect(() => {
        let newImage = currentProduct?.image;
        if (!newImage || newImage === "null") {
            const variantImages = Array.isArray(currentProduct?.images)
                ? currentProduct.images
                : Object.values(currentProduct?.images || {});

            if (variantImages.length > 0) {
                newImage = variantImages[0]?.url || variantImages[0];
            }
        }

        // Only fallback to master ONLY if we are actually ON the master product (container)
        // or if the item prop is all we have. If currentProduct is a variant and has no images,
        // we keep it as null to trigger the placeholder.
        if (
            (!newImage || newImage === "null") &&
            (item?.is_master || !selectedVariant)
        ) {
            newImage = masterProduct?.image || item?.image;
            if (!newImage || newImage === "null") {
                const masterImages = Array.isArray(masterProduct?.images)
                    ? masterProduct.images
                    : Object.values(masterProduct?.images || {});
                if (masterImages.length > 0) {
                    newImage = masterImages[0]?.url || masterImages[0];
                }
            }
        }

        console.log(
            "[useEffect activeImage] Changing to:",
            newImage || "placeholder",
        );
        setActiveImage(newImage || null);
    }, [currentProduct?.id, variantsForSelectedGroup, masterProduct?.id]);

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
    const textProductRelation =
        textstatic.find((x) => x.correlative == "detailproduct-relation-title")
            ?.title ?? "";

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
        // Validation: The master item (container) should not be added to the cart
        if (product.is_master || (item.agrupador && product.id === item.id)) {
            Swal.fire({
                title: "Seleccione una variante",
                text: "Por favor, elija una de las opciones disponibles (color, talla, etc.) antes de agregar al carrito.",
                icon: "info",
                confirmButtonColor: "#000000",
            });
            return;
        }

        const variantToAdd = selectedVariant || product;
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == variantToAdd.id);

        if (index == -1) {
            newCart.push({
                ...variantToAdd,
                quantity: quantity,
            });
        } else {
            newCart[index].quantity += quantity;
        }
        setCart(newCart);

        setLastAddedProduct({
            ...variantToAdd,
            addedQuantity: quantity,
        });
        setSuccessModalOpen(true);
    };

    const [associatedItems, setAssociatedItems] = useState([]);
    const [relationsItems, setRelationsItems] = useState([]);
    const inCart = cart?.find((x) => x.id == item?.id);

    useEffect(() => {
        if (item?.id) {
            handleViewUpdate(item);

            console.log("[ProductDetailSF] Initializing item:", item.name, {
                is_master: item.is_master,
                attributes: item.attributes,
            });

            // Mirroring Rainstar logic for variants
            setSelectedVariant(item);
            const initialAttributes = {};
            const attrsArr = Array.isArray(item.attributes)
                ? item.attributes
                : Object.values(item.attributes || {});

            if (attrsArr.length > 0) {
                attrsArr.forEach((attr) => {
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
                console.log(
                    "[ProductDetailSF] Extracted attributes:",
                    initialAttributes,
                );
            } else {
                console.warn(
                    "[ProductDetailSF] No attributes found in item prop. Check if relations are loaded.",
                );
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

                        // If user hasn't interacted, we could keep the current item or select a default sellable variant
                        // Rainstar does this:
                        const sellableVariants = uniqueVariants.filter(
                            (v) => !v.is_master && v.id !== item.id,
                        );

                        if (sellableVariants.length > 0 && item.is_master) {
                            const first = sellableVariants[0];
                            setSelectedVariant(first);
                            const newAttrs = {};
                            if (first.attributes) {
                                const firstAttrs = Array.isArray(
                                    first.attributes,
                                )
                                    ? first.attributes
                                    : Object.values(first.attributes || {});
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
                            window.history.replaceState(
                                {},
                                "",
                                `/item/${first.slug}`,
                            );
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

    useEffect(() => {
        const target = masterProduct || item;
        if (target?.id) {
            productosRelacionados(target);
            obtenerCombo(target);
        }
    }, [masterProduct?.id, item?.id]);

    const handleAttributeSelect = (attrName, valueData) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attrName]: valueData,
        }));
        if (valueData.item) {
            setSelectedVariant(valueData.item);
        }
    };

    const _getAttrs = (variant) =>
        Array.isArray(variant?.attributes)
            ? variant.attributes
            : Object.values(variant?.attributes || {});

    const isValueAvailable = (attrName, valueToCheck, group) => {
        return group.variants.some((variant) => {
            const variantAttrs = _getAttrs(variant);
            const hasThisValue = variantAttrs.some((attr) => {
                const name = attr.name || attr.slug;
                const value = attr.pivot?.value || attr.value;
                return name === attrName && value === valueToCheck;
            });

            if (!hasThisValue) return false;

            for (const [selectedAttrName, selectedValueData] of Object.entries(
                selectedAttributes,
            )) {
                if (selectedAttrName === attrName) continue;
                const hasSelectedAttr = variantAttrs.some((attr) => {
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
        console.log(
            `[findBestMatchingVariant] Buscando para atributo: ${attrName}, valor: ${valueData.value}`,
        );
        const candidates = group.variants.filter((v) => {
            const vAttrs = _getAttrs(v);
            return vAttrs.some(
                (a) =>
                    (a.name || a.slug) === attrName &&
                    (a.pivot?.value || a.value) === valueData.value,
            );
        });

        console.log(
            `[findBestMatchingVariant] Candidatos encontrados:`,
            candidates.length,
        );

        if (candidates.length === 0) return null;

        const scoredCandidates = candidates.map((v) => {
            let score = 0;
            const vAttrs = _getAttrs(v);
            Object.entries(selectedAttributes).forEach(([selName, selData]) => {
                if (selName === attrName) return;
                const matches = vAttrs.some(
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

    const calculateDiscount = (prod) => {
        const price = Number(prod?.price || 0);
        const finalPrice =
            Number(prod?.final_price || 0) > 0
                ? Number(prod.final_price)
                : price;

        if (price > 0 && finalPrice < price) {
            return Math.round(100 - (finalPrice * 100) / price);
        }

        if (prod?.discount > 0 && prod?.discount < 100) {
            return Math.round(prod.discount);
        }

        return 0;
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
            if (!response || !response[0]) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const associated = response[0].associated_items;
            if (associated) {
                setAssociatedItems(Object.values(associated));
            }
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
                                  values.push({
                                      value,
                                      itemId: v.id,
                                      item: v,
                                      texture: v.texture,
                                      image: v.image,
                                      slug: v.slug,
                                  });
                              }
                          }
                      });
                      return {
                          name,
                          attribute: (Array.isArray(
                              variantsForSelectedGroup[0].attributes,
                          )
                              ? variantsForSelectedGroup[0].attributes
                              : Object.values(
                                    variantsForSelectedGroup[0].attributes ||
                                        {},
                                )
                          ).find((a) => (a.name || a.slug) === name),
                          values,
                      };
                  }),
              }
            : null;

    const total = associatedItems.reduce(
        (sum, product) => sum + parseFloat(product.final_price),
        0,
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
            <div
                id={data?.element_id || null}
                className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto pb-4 md:pb-6 xl:pb-8 bg-white"
            >
                <div className="bg-white rounded-xl py-4 md:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-20 2xl:gap-16">
                        {/* Left Column - Images and Delivery Options */}
                        <div className="space-y-6">
                            {/* Product Images */}
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Thumbnails - Desktop: left side, Mobile: bottom */}
                                <div className="flex flex-row lg:flex-col gap-2 order-2 lg:order-1 lg:w-20">
                                    {(() => {
                                        const allImages = [
                                            currentProduct?.image,
                                            // 1. Current product images gallery
                                            ...(Array.isArray(
                                                currentProduct?.images,
                                            )
                                                ? currentProduct.images.map(
                                                      (i) => i.url || i,
                                                  )
                                                : Object.values(
                                                      currentProduct?.images ||
                                                          {},
                                                  ).map((i) => i.url || i)),
                                        ];

                                        // If we are at a variant, we ONLY show what that variant has.
                                        // No automatic fallback to master gallery to avoid confusion.
                                        if (
                                            allImages.filter(
                                                (img) => img && img !== "null",
                                            ).length === 0 &&
                                            (item?.is_master ||
                                                !selectedVariant)
                                        ) {
                                            allImages.push(
                                                masterProduct?.image,
                                                ...(Array.isArray(
                                                    masterProduct?.images,
                                                )
                                                    ? masterProduct.images.map(
                                                          (i) => i.url || i,
                                                      )
                                                    : Object.values(
                                                          masterProduct?.images ||
                                                              {},
                                                      ).map((i) => i.url || i)),
                                            );
                                        }

                                        const uniqueImages = allImages.filter(
                                            (img, idx, self) =>
                                                img &&
                                                img !== "null" &&
                                                self.indexOf(img) === idx,
                                        );

                                        if (uniqueImages.length === 0)
                                            return null;

                                        return uniqueImages.map(
                                            (imgUrl, index) => {
                                                const isActive =
                                                    (activeImage ||
                                                        currentProduct?.image ||
                                                        masterProduct?.image ||
                                                        item?.image) === imgUrl;
                                                return (
                                                    <button
                                                        key={`thumb-${index}`}
                                                        onClick={() =>
                                                            setActiveImage(
                                                                imgUrl,
                                                            )
                                                        }
                                                        className={`rounded-xl p-1 border-2 flex-shrink-0 transition-all duration-300 ${
                                                            isActive
                                                                ? "border-primary"
                                                                : "border-gray-200"
                                                        }`}
                                                    >
                                                        <img
                                                            src={
                                                                imgUrl &&
                                                                imgUrl !==
                                                                    "null"
                                                                    ? `/storage/images/item/${imgUrl}`
                                                                    : "/api/cover/thumbnail/null"
                                                            }
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-16 lg:w-20 aspect-[3/4] rounded-lg object-cover"
                                                            onError={(e) =>
                                                                (e.target.src =
                                                                    "/api/cover/thumbnail/null")
                                                            }
                                                        />
                                                    </button>
                                                );
                                            },
                                        );
                                    })()}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 order-1 lg:order-2">
                                    <img
                                        src={
                                            activeImage
                                                ? `/storage/images/item/${activeImage}`
                                                : currentProduct?.image &&
                                                    currentProduct.image !==
                                                        "null"
                                                  ? `/storage/images/item/${currentProduct.image}`
                                                  : masterProduct?.image &&
                                                      masterProduct.image !==
                                                          "null"
                                                    ? `/storage/images/item/${masterProduct.image}`
                                                    : item?.image &&
                                                        item.image !== "null"
                                                      ? `/storage/images/item/${item.image}`
                                                      : "/api/cover/thumbnail/null"
                                        }
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                        alt={
                                            currentProduct?.name ||
                                            "Product main"
                                        }
                                        className="w-full aspect-[3/4] rounded-xl object-cover object-top"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="flex flex-col gap-3">
                            {/* Brand and Title */}
                            <div className="font-paragraph">
                                {currentProduct?.brand && (
                                    <p className="customtext-neutral-light text-sm 2xl:text-lg">
                                        Marca:{" "}
                                        <span className="customtext-neutral-dark">
                                            {currentProduct?.brand.name}
                                        </span>
                                    </p>
                                )}
                                <h1 className="customtext-neutral-dark text-3xl lg:text-4xl 2xl:text-5xl font-bold mt-2">
                                    {currentProduct?.name}
                                </h1>
                            </div>

                            {/* SKU and Availability */}
                            <div className="flex flex-wrap customtext-neutral-light items-center gap-y-2 gap-x-8 text-sm font-paragraph">
                                <span className="customtext-neutral-dark text-base 2xl:text-lg">
                                    SKU:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {currentProduct?.sku}
                                    </span>
                                </span>
                                <span className="customtext-neutral-dark text-base 2xl:text-lg">
                                    Disponibilidad:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {currentProduct?.stock > 0
                                            ? "En stock"
                                            : "Agotado"}
                                    </span>
                                </span>
                            </div>

                            {/* Price Section */}
                            {(Number(currentProduct?.price) > 0 ||
                                Number(currentProduct?.final_price) > 0) && (
                                <div className="flex flex-col w-full xl:w-1/2 font-paragraph max-w-xl mt-5">
                                    {Number(currentProduct?.price) >
                                        Number(currentProduct?.final_price) && (
                                        <p className="text-base 2xl:text-lg customtext-neutral-dark opacity-70 font-medium">
                                            Precio:{" "}
                                            <span className="line-through">
                                                {CurrencySymbol()}{" "}
                                                {Number(
                                                    currentProduct?.price,
                                                ).toFixed(2)}
                                            </span>
                                        </p>
                                    )}
                                    <div className="flex flex-row items-center gap-4 relative">
                                        <span className="text-[40px] font-bold customtext-neutral-dark">
                                            {CurrencySymbol()}{" "}
                                            {Number(
                                                currentProduct?.final_price ||
                                                    currentProduct?.price,
                                            ).toFixed(2)}
                                        </span>
                                        {(() => {
                                            const disc =
                                                calculateDiscount(
                                                    currentProduct,
                                                );
                                            return disc > 0 ? (
                                                <span className="bg-danger text-white font-bold px-3 py-2 rounded-xl text-base">
                                                    -{disc}%
                                                </span>
                                            ) : null;
                                        })()}
                                    </div>
                                </div>
                            )}

                            {(currentProduct?.summary ||
                                masterProduct?.summary) && (
                                <div className="flex flex-col customtext-neutral-dark font-paragraph text-base 2xl:text-lg my-3">
                                    <p>
                                        {currentProduct?.summary ||
                                            masterProduct?.summary}
                                    </p>
                                </div>
                            )}

                            {/* Variants Selection - Rainstar style */}
                            {isLoadingVariants ? (
                                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest animate-pulse mt-4">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    Actualizando Variantes...
                                </div>
                            ) : (
                                group?.allAttributes?.length > 0 && (
                                    <div className="space-y-6 mt-4">
                                        {group.allAttributes.map((attrData) => (
                                            <div
                                                key={attrData.name}
                                                className="flex flex-col gap-3"
                                            >
                                                <h3 className="font-medium customtext-neutral-dark text-base 2xl:text-lg">
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

                                                            // Remove special color block relying on val.texture completely, just use standard button
                                                            const isColorAttr = false;

                                                            return (
                                                                <button
                                                                    key={`var-${attrData.name}-${val.value}`}
                                                                    disabled={
                                                                        !isAvailable
                                                                    }
                                                                    onClick={() => {
                                                                        console.log(
                                                                            `[onClick Boton] Clic en: ${attrData.name} - ${val.value}`,
                                                                        );
                                                                        const matching =
                                                                            findBestMatchingVariant(
                                                                                attrData.name,
                                                                                val,
                                                                                group,
                                                                            );
                                                                        console.log(
                                                                            `[onClick Boton] Resultado matching:`,
                                                                            matching?.name ||
                                                                                "none",
                                                                        );
                                                                        if (
                                                                            matching
                                                                        ) {
                                                                            console.log(
                                                                                "[onClick Boton] Actualizando selectedVariant:",
                                                                                matching.id,
                                                                            );
                                                                            setSelectedVariant(
                                                                                matching,
                                                                            );
                                                                            const newAttrs =
                                                                                {};
                                                                            const mAttrs =
                                                                                Array.isArray(
                                                                                    matching.attributes,
                                                                                )
                                                                                    ? matching.attributes
                                                                                    : Object.values(
                                                                                          matching.attributes ||
                                                                                              {},
                                                                                      );
                                                                            mAttrs.forEach(
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
                                                                            window.history.pushState(
                                                                                {},
                                                                                "",
                                                                                `/item/${matching.slug}`,
                                                                            );
                                                                        } else {
                                                                            handleAttributeSelect(
                                                                                attrData.name,
                                                                                val,
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`relative min-w-12 h-12 px-4 flex items-center justify-center text-center font-medium rounded-xl border-2 transition-all duration-200 
                                                                    ${isSelected ? "border-primary bg-primary text-white shadow-lg transform scale-105" : isAvailable ? "border-gray-200 bg-white customtext-neutral-dark hover:border-gray-300 hover:bg-gray-50" : "border-gray-50 bg-gray-50/50 text-neutral-dark/20 cursor-not-allowed line-through"}
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

                            {/* Quantity */}
                            <div className="flex items-center mt-8 gap-4">
                                <h3 className="font-medium customtext-neutral-dark text-base 2xl:text-lg">
                                    Cantidad
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            disabled={quantity <= 1}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <svg
                                                className="w-4 h-4 customtext-neutral-dark"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M20 12H4"
                                                />
                                            </svg>
                                        </button>
                                        <input
                                            value={quantity}
                                            onChange={handleChange}
                                            min="1"
                                            max="10"
                                            className="w-16 h-12 customtext-neutral-dark text-center bg-white outline-none appearance-none font-medium text-lg border-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(10, quantity + 1),
                                                )
                                            }
                                            disabled={quantity >= 10}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <svg
                                                className="w-4 h-4 customtext-neutral-dark"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
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
                                        onAddClicked(currentProduct);
                                    }}
                                    disabled={currentProduct?.stock <= 0}
                                    className={`hidden lg:block w-full font-paragraph text-base 2xl:text-lg py-3 xl:py-4 font-semibold rounded-full transition-all duration-300 mt-3 ${
                                        currentProduct?.stock > 0
                                            ? "bg-accent text-white hover:opacity-90 hover:shadow-lg transform hover:scale-[1.02]"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    {currentProduct?.stock > 0
                                        ? "Agregar al carrito"
                                        : "Producto agotado"}
                                </button>
                            )}

                            {/* WhatsApp Consultation Button - Desktop only */}
                            {data?.button_consultation && (
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${getContact("phone_whatsapp")}&text=${encodeURIComponent(
                                        `Hola, deseo cotizar el siguiente producto:\n\n` +
                                            `📦 Producto: ${currentProduct?.name}\n` +
                                            `🔢 SKU: ${currentProduct?.sku}\n` +
                                            Object.entries(selectedAttributes)
                                                .map(
                                                    ([name, data]) =>
                                                        `- ${name}: ${data.value}`,
                                                )
                                                .join("\n") +
                                            `\nCant.: ${quantity}\n\n` +
                                            `¿Podrían enviarme más información y el precio?`,
                                    )}`}
                                    target="_blank"
                                    className="hidden lg:flex w-full font-paragraph py-3 xl:py-4 text-base 2xl:text-lg font-semibold rounded-full transition-all duration-300 mt-3 bg-primary text-white hover:bg-primary hover:shadow-lg transform hover:scale-[1.02] items-center justify-center gap-2"
                                >
                                    Cotizar este producto
                                </a>
                            )}

                            {/* Specifications */}
                            {(currentProduct?.specifications?.length > 0 ||
                                masterProduct?.specifications?.length > 0) && (
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
                                            {(() => {
                                                const specs = Array.isArray(
                                                    currentProduct?.specifications ||
                                                        item?.specifications,
                                                )
                                                    ? currentProduct?.specifications ||
                                                      item?.specifications
                                                    : Object.values(
                                                          currentProduct?.specifications ||
                                                              item?.specifications ||
                                                              {},
                                                      );
                                                return specs
                                                    .filter(
                                                        (spec) =>
                                                            spec.type ===
                                                            "principal",
                                                    )
                                                    .map((spec, index) => (
                                                        <li
                                                            key={`spec-main-${index}`}
                                                            className="gap-2 customtext-primary opacity-85 flex flex-row items-start"
                                                        >
                                                            <CircleCheckIcon className="customtext-primary mt-1 min-w-4 min-h-4 max-w-4 max-h-4" />
                                                            <span className="first-letter:uppercase">
                                                                {" "}
                                                                {spec?.description?.toLowerCase()}
                                                            </span>
                                                        </li>
                                                    ));
                                            })()}
                                        </ul>
                                        <button
                                            className="font-semibold flex flex-row gap-2 items-center text-base xl:text-[17px] 2xl:text-xl mb-4 customtext-neutral-dark font-paragraph pb-2 border-b border-neutral-dark"
                                            onClick={() =>
                                                setExpanded(
                                                    !expandedSpecificationMain,
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
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${getContact("phone_whatsapp")}&text=${encodeURIComponent(
                                        `Hola, deseo mayor información acerca del producto: ${item?.name}`,
                                    )}`}
                                    target="_blank"
                                >
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
                                                ¿Tienes dudas sobre este
                                                producto? Haz
                                                <span className="underline"></span>
                                                clic aquí y chatea con nosotros
                                                por WhatsApp
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
                    {item?.specifications?.length > 0 &&
                        item.specifications.some(
                            (spec) => spec.type === "general",
                        ) && (
                            <div>
                                <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-3">
                                    Especificaciones
                                </h2>
                                <div className="space-y-1">
                                    {(() => {
                                        const specs = Array.isArray(
                                            currentProduct?.specifications ||
                                                item?.specifications,
                                        )
                                            ? currentProduct?.specifications ||
                                              item?.specifications
                                            : Object.values(
                                                  currentProduct?.specifications ||
                                                      item?.specifications ||
                                                      {},
                                              );
                                        return specs
                                            .filter(
                                                (spec) =>
                                                    spec.type === "general",
                                            )
                                            .map((spec, index) => (
                                                <div
                                                    key={`spec-gen-${index}`}
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
                                            ));
                                    })()}
                                </div>
                            </div>
                        )}

                    {/* Additional Information Section */}
                    {data?.show_additional_info && (
                        <div className="font-paragraph">
                            {(currentProduct?.description?.replace(
                                /<[^>]+>/g,
                                "",
                            ) ||
                                masterProduct?.description?.replace(
                                    /<[^>]+>/g,
                                    "",
                                )) && (
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
                                {(currentProduct?.description?.replace(
                                    /<[^>]+>/g,
                                    "",
                                ) ||
                                    masterProduct?.description?.replace(
                                        /<[^>]+>/g,
                                        "",
                                    )) && (
                                    <>
                                        <h3 className="text-xl font-semibold customtext-neutral-dark mb-4">
                                            Acerca de este artículo
                                        </h3>
                                        <div
                                            className="customtext-neutral-dark"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    currentProduct?.description ||
                                                    masterProduct?.description,
                                            }}
                                        ></div>
                                    </>
                                )}

                                {item?.features?.length > 0 && (
                                    <div className={`pl-10`}>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {(() => {
                                                const feats = Array.isArray(
                                                    currentProduct?.features ||
                                                        item?.features,
                                                )
                                                    ? currentProduct?.features ||
                                                      item?.features
                                                    : Object.values(
                                                          currentProduct?.features ||
                                                              item?.features ||
                                                              {},
                                                      );
                                                return feats.map(
                                                    (feature, index) => (
                                                        <li
                                                            key={`feature-${index}`}
                                                            className="customtext-neutral-dark"
                                                        >
                                                            {feature.feature}
                                                        </li>
                                                    ),
                                                );
                                            })()}
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
                                onAddClicked(currentProduct);
                            }}
                            disabled={currentProduct?.stock <= 0}
                            className={`flex-1 font-paragraph text-sm py-3 font-semibold rounded-2xl transition-all duration-300 ${
                                currentProduct?.stock > 0
                                    ? "bg-accent text-white hover:opacity-90"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {currentProduct?.stock > 0
                                ? "Agregar al carrito"
                                : "Producto agotado"}
                        </button>
                    )}

                    {/* WhatsApp Consultation Button - Mobile */}
                    {data?.button_consultation && (
                        <a
                            href={`https://api.whatsapp.com/send?phone=${getContact("phone_whatsapp")}&text=${encodeURIComponent(
                                `Hola, deseo cotizar el siguiente producto:\n\n` +
                                    `📦 Producto: ${currentProduct?.name}\n` +
                                    `🔢 SKU: ${currentProduct?.sku}\n` +
                                    Object.entries(selectedAttributes)
                                        .map(
                                            ([name, data]) =>
                                                `- ${name}: ${data.value}`,
                                        )
                                        .join("\n") +
                                    `\nCant.: ${quantity}\n\n` +
                                    `¿Podrían enviarme más información y el precio?`,
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
                        data={{
                            title: "Productos relacionados",
                            link_catalog: "/catalogo",
                        }}
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

            {/* Modal de Producto Agregado */}
            <ReactModal
                isOpen={successModalOpen}
                onRequestClose={() => setSuccessModalOpen(false)}
                className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999]"
                closeTimeoutMS={300}
            >
                <AnimatePresence>
                    {successModalOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            {/* Header con gradiente suave */}
                            <div className="bg-gray-50 px-6 py-6 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-accent/10 p-2 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-accent" />
                                    </div>
                                    <h2 className="text-xl font-bold customtext-neutral-dark">
                                        ¡Agregado con éxito!
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSuccessModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors group"
                                >
                                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Informática del producto */}
                                <div className="flex gap-4 mb-8">
                                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                        <img
                                            src={
                                                lastAddedProduct?.image
                                                    ? `/storage/images/item/${lastAddedProduct.image}`
                                                    : "/api/cover/thumbnail/null"
                                            }
                                            alt={lastAddedProduct?.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-lg customtext-neutral-dark line-clamp-1">
                                            {lastAddedProduct?.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Cantidad:{" "}
                                            {lastAddedProduct?.addedQuantity}
                                        </p>
                                        <p className="text-accent font-bold text-lg mt-1">
                                            {CurrencySymbol()}
                                            {(
                                                Number(
                                                    lastAddedProduct?.final_price ||
                                                        lastAddedProduct?.price,
                                                ) *
                                                (lastAddedProduct?.addedQuantity ||
                                                    1)
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => {
                                            setSuccessModalOpen(false);
                                            setModalOpen(true);
                                        }}
                                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all transform hover:scale-[1.02] active:scale-95"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Ver mi carrito
                                    </button>
                                    <button
                                        onClick={() =>
                                            setSuccessModalOpen(false)
                                        }
                                        className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        Seguir comprando
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </ReactModal>
        </>
    );
}
