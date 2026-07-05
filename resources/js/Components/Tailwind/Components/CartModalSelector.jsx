import React from "react";

import CartModal from "./CartModal";
import CartModalBananaLab from "./CartModalBananaLab";
import CartModalIbergruas from "./CartModalIbergruas";
import CartModalLaPetaca from "./CartModalLaPetaca";
import CartModalMiBalon from "./CartModalMiBalon";
import CartModalRainstar from "./CartModalRainstar";

const CartModalSelector = ({
    type_modal_cart = 'CartModal',
    data,
    cart,
    setCart,
    subTotal,
    igv,
    perception,
    totalPrice,
    modalOpen,
    setModalOpen,
    ...additionalProps
}) => {
    // Si el type viene en data (desde components.json) y no se pasa como prop
    const rawModalType = data?.type_modal_cart || type_modal_cart;
    
    // Extraemos solo el key si viene con pipe (ej: "CartModalBananaLab|Banana Lab")
    let actualModalType = typeof rawModalType === 'string' ? rawModalType.split('|')[0].trim() : String(rawModalType);
    
    // Normalizamos para evitar problemas de case o espacios ('Banana Lab' -> 'bananalab')
    const normalizedType = actualModalType.toLowerCase().replace(/[^a-z0-9]/g, '');

    console.log("DEBUG CartModalSelector -> data:", data, "raw:", rawModalType, "normalized:", normalizedType);

    const commonProps = {
        data,
        cart,
        setCart,
        subTotal,
        igv,
        perception,
        totalPrice,
        modalOpen,
        setModalOpen,
        ...additionalProps
    };

    switch (normalizedType) {
        case "cartmodalbananalab":
        case "bananalab":
            return <CartModalBananaLab {...commonProps} />;
        
        case "cartmodalibergruas":
        case "ibergruas":
            return <CartModalIbergruas {...commonProps} />;
        
        case "cartmodallapetaca":
        case "lapetaca":
            return <CartModalLaPetaca {...commonProps} />;
        
        case "cartmodalmibalon":
        case "mibalon":
            return <CartModalMiBalon {...commonProps} />;
        
        case "cartmodalrainstar":
        case "rainstar":
            return <CartModalRainstar {...commonProps} />;
        
        case "cartmodal":
        case "normal":
        default:
            return <CartModal {...commonProps} />;
    }
};

export default CartModalSelector;
