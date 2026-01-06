import React from "react";

// Importar todos los tipos de tarjetas de productos que EXISTEN
const ProductCard = React.lazy(() => import("./ProductCard"));
const CardProductBananaLab = React.lazy(() => import("./Components/CardProductBananaLab"));
const CardProductMultivet = React.lazy(() => import("./Components/CardProductMultivet"));
const CardProductKatya = React.lazy(() => import("./Components/CardProductKatya"));
const ProductCardColors = React.lazy(() => import("./Components/ProductCardColors"));
const ProductCardColorsBoton = React.lazy(() => import("./Components/ProductCardColorsBoton"));
const ProductCardFull = React.lazy(() => import("./Components/ProductCardFull"));
const ProductCardSimple = React.lazy(() => import("./Components/ProductCardSimple"));
const LaPetacaCard = React.lazy(() => import("./LaPetacaCard"));

/**
 * Componente selector de tarjetas de productos
 * Similar a TopBar.jsx, centraliza la lógica de selección de tarjetas
 * 
 * @param {Object} props
 * @param {string} props.cardType - Tipo de tarjeta a renderizar (ej: 'CardProductBananaLab')
 * @param {Object} props.product - Datos del producto
 * @param {Object} props.data - Configuración adicional del componente padre
 * @param {Array} props.cart - Carrito de compras
 * @param {Function} props.setCart - Función para actualizar el carrito
 * @param {Array} props.favorites - Lista de favoritos
 * @param {Function} props.setFavorites - Función para actualizar favoritos
 * @param {Function} props.handleProductClick - Función para manejar click en producto (opcional)
 * @param {Object} props.additionalProps - Props adicionales para pasar a la tarjeta
 */
const ProductCardSelector = ({ 
    cardType = 'ProductCard', 
    product, 
    data, 
    cart, 
    setCart, 
    favorites, 
    setFavorites,
    handleProductClick,
    ...additionalProps 
}) => {
    
    // Props comunes para todas las tarjetas
    const commonProps = {
        key: product.id,
        product: product,
        data: data,
        cart: cart,
        setCart: setCart,
        favorites: favorites,
        setFavorites: setFavorites,
        ...additionalProps
    };

    const getProductCard = () => {
        switch (cardType) {
            // Tarjetas específicas de proyectos
            case "CardProductBananaLab":
            case "banana-lab":
            case "bananalab":
                return (
                    <CardProductBananaLab 
                        {...commonProps}
                        widthClass="w-full sm:w-full lg:w-full"
                    />
                );
            
            case "CardProductMultivet":
            case "multivet":
                return <CardProductMultivet {...commonProps} />;
            
            case "CardProductKatya":
            case "katya":
                return <CardProductKatya {...commonProps} />;
            
            case "ProductCardColors":
            case "sala-fabulosa":
                return <ProductCardColors {...commonProps} />;
            
            case "ProductCardColorsBoton":
            case "colors-boton":
                return <ProductCardColorsBoton {...commonProps} />;
            
            case "ProductCardFull":
            case "full":
                return <ProductCardFull {...commonProps} />;
            
            case "ProductCardSimple":
            case "simple":
                return <ProductCardSimple {...commonProps} />;
            
            // Tarjeta LaPetaca para hoteles/habitaciones
          
            case "lapetaca":
            
                return (
                    <LaPetacaCard 
                        item={product}
                        index={additionalProps.index || 0}
                    />
                );
            
            // Tarjeta por defecto
            case "ProductCard":
            default:
                // ProductCard usa handleProductClick en lugar de las props comunes
                return (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        handleProductClick={handleProductClick}
                        data={data}
                    />
                );
        }
    };

    return getProductCard();
};

export default ProductCardSelector;
