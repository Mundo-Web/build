import React from 'react';
import CardItem from './CardItem';
import CardItemMiBalon from './CardItemMiBalon';

const CardItemSelector = ({ type_cart_item, ...props }) => {
    // Normalizamos el string en caso de que venga sucio de la BD
    const actualType = typeof type_cart_item === "string" ? type_cart_item.split("|")[0].trim() : type_cart_item;

    switch (actualType) {
        case 'CardItemMiBalon':
            return <CardItemMiBalon {...props} />;
        case 'CardItem':
        default:
            return <CardItem {...props} />;
    }
};

export default CardItemSelector;
