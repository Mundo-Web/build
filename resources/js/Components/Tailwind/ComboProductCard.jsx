import React, { useState, useEffect } from 'react';
import { CombosCartRest } from '../../Actions/CombosCartRest';


const ComboProductCard = ({ combo, onAddToCart, cart = [], showAddButton = true }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);
    
    const combosRest = new CombosCartRest();
    
    const handleAddToCart = async () => {
        if (isAdding) return;
        
        setIsAdding(true);
        try {
            const comboForCart = await combosRest.addToCart(combo.id, quantity);
            onAddToCart(comboForCart);
        } catch (error) {
            console.error('Error adding combo to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, Math.min(10, newQuantity)));
    };

    const isInCart = cart.some(item => 
        item.type === 'combo' && item.combo_id === combo.id
    );

    return (
        <div className="combo-product-card bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-start gap-4">
                {/* Imagen del combo */}
                <div className="flex-shrink-0">
                    <img 
                        src={combo.image || '/images/placeholder.jpg'} 
                        alt={combo.name}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                </div>

                {/* Información del combo */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {combo.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                {combo.summary || `Combo de ${combo.combo_items?.length || 0} productos`}
                            </p>
                            
                            {/* Items del combo */}
                            <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-1">Incluye:</p>
                                <div className="flex flex-wrap gap-1">
                                    {combo.combo_items?.map((item, index) => (
                                        <span 
                                            key={item.id}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                        >
                                            {item.name}
                                            {item.is_main_item && (
                                                <span className="ml-1 text-blue-600">★</span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Precio */}
                            <div className="flex items-center gap-2 mb-3">
                                {combo.discount > 0 && (
                                    <span className="text-sm line-through text-gray-500">
                                        S/.{combo.price}
                                    </span>
                                )}
                                <span className="text-lg font-bold text-green-600">
                                    S/.{combo.final_price}
                                </span>
                                {combo.discount > 0 && (
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                        -{combo.discount_percent}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Controles de cantidad y agregar */}
                        {showAddButton && (
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-600">Cantidad:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                </div>
                                
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isInCart}
                                    className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                                        isInCart
                                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                            : isAdding
                                                ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isInCart 
                                        ? '✓ En carrito' 
                                        : isAdding 
                                            ? 'Agregando...' 
                                            : 'Agregar combo'
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComboProductCard;