import React, { useState, useEffect } from 'react';

import ComboProductCard from '../ComboProductCard';
import { CombosCartRest } from '../../../Actions/CombosCartRest';

const ComboSuggestions = ({ itemId, cart, setCart, onComboAdded }) => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    
    const combosRest = new CombosCartRest();

    useEffect(() => {
        if (itemId) {
            loadCombos();
        }
    }, [itemId]);

    const loadCombos = async () => {
        setLoading(true);
        try {
            const itemCombos = await combosRest.getItemCombos(itemId);
            setCombos(itemCombos || []);
        } catch (error) {
            console.error('Error loading combos:', error);
            setCombos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComboToCart = (comboForCart) => {
        const newCart = [...cart];
        const existingIndex = newCart.findIndex(item => 
            item.type === 'combo' && item.combo_id === comboForCart.combo_id
        );

        if (existingIndex !== -1) {
            newCart[existingIndex].quantity += comboForCart.quantity;
        } else {
            newCart.push(comboForCart);
        }

        setCart(newCart);
        
        if (onComboAdded) {
            onComboAdded(comboForCart);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (!combos.length) {
        return null;
    }

    return (
        <div className="combo-suggestions bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-blue-600">💎</span>
                        Combos disponibles
                    </h3>
                    <p className="text-sm text-gray-600">
                        Ahorra comprando este producto en combo
                    </p>
                </div>
                
                {combos.length > 1 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {expanded ? 'Ver menos' : `Ver todos (${combos.length})`}
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {(expanded ? combos : combos.slice(0, 2)).map((combo) => (
                    <ComboProductCard
                        key={combo.id}
                        combo={combo}
                        cart={cart}
                        onAddToCart={handleAddComboToCart}
                    />
                ))}
            </div>

            {combos.length > 2 && !expanded && (
                <div className="mt-3 text-center">
                    <button
                        onClick={() => setExpanded(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Ver {combos.length - 2} combos más...
                    </button>
                </div>
            )}
        </div>
    );
};

export default ComboSuggestions;