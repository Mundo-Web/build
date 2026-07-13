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
const CardProductMiBalon = React.lazy(() => import("./Components/CardProductMiBalon"));
const CardProductMicjc = React.lazy(() => import("./Components/CardProductMicjc"));
const CardProductTwenty = React.lazy(() => import("./Components/CardProductTwenty"));
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
    onClickTracking,
    ...additionalProps 
}) => {
    
    // Props comunes para todas las tarjetas
    const commonProps = {
        product: product,
        data: data,
        cart: cart,
        setCart: setCart,
        favorites: favorites,
        setFavorites: setFavorites,
        onClickTracking: onClickTracking,
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
                        key={product?.id}
                        {...commonProps}
                        widthClass="w-full sm:w-full lg:w-full"
                    />
                );
            
            case "CardProductMiBalon":
            case "mibalon":
                return <CardProductMiBalon key={product?.id} {...commonProps} />;
            
            case "CardProductMiyagui":
            case "miyagui":
                return <CardProductMiyagui key={product?.id} {...commonProps} />;
            
            case "CardProductMicjc":
            case "micjc":
                return <CardProductMicjc key={product?.id} {...commonProps} />;
            
            case "CardProductTwenty":
            case "twenty":
                return <CardProductTwenty key={product?.id} {...commonProps} />;
            
            case "CardProductMultivet":
            case "multivet":
                return <CardProductMultivet key={product?.id} {...commonProps} />;
            
            case "CardProductKatya":
            case "katya":
                return <CardProductKatya key={product?.id} {...commonProps} />;
            
            case "ProductCardColors":
            case "sala-fabulosa":
                return <ProductCardColors key={product?.id} {...commonProps} />;
            
            case "ProductCardColorsBoton":
            case "colors-boton":
                return <ProductCardColorsBoton key={product?.id} {...commonProps} />;
            
            case "ProductCardFull":
            case "full":
                return <ProductCardFull key={product?.id} {...commonProps} />;
            
            case "ProductCardSimple":
            case "simple":
                return <ProductCardSimple key={product?.id} {...commonProps} />;
            
            // Tarjeta LaPetaca para hoteles/habitaciones
          
            case "lapetaca":
            
                return (
                    <LaPetacaCard 
                        key={product?.id}
                        item={product}
                        index={additionalProps.index || 0}
                    />
                );
            
            // Tarjeta por defecto
            case "ProductCard":
            default:
                return (
                    <ProductCard 
                        key={product?.id}
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
