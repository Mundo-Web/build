import React, { useState, useEffect } from 'react';


import { CombosCartRest } from '../Actions/CombosCartRest';
import ComboProductCard from '../Components/Tailwind/ComboProductCard';
import { CurrencySymbol } from '../Utils/Number2Currency';

const ComboCartTest = () => {
    const [combos, setCombos] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const combosRest = new CombosCartRest();

    useEffect(() => {
        loadCombos();
    }, []);

    const loadCombos = async () => {
        try {
            const response = await combosRest.getAsProducts();
            setCombos(response.data || []);
        } catch (error) {
            console.error('Error loading combos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (combo) => {
        const existingItem = cart.find(item =>
            item.id === combo.id && item.type === combo.type
        );

        if (existingItem) {
            setCart(cart.map(item =>
                (item.id === combo.id && item.type === combo.type)
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...combo, quantity: 1 }]);
        }
    };

    const removeFromCart = (comboId) => {
        setCart(cart.filter(item => !(item.id === comboId && item.type === 'combo')));
    };

    const updateQuantity = (comboId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(comboId);
            return;
        }

        setCart(cart.map(item =>
            (item.id === comboId && item.type === 'combo')
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando combos...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Prueba de Combos en Carrito</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Combos */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">Combos Disponibles</h2>
                    {combos.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No hay combos disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {combos.map(combo => (
                                <ComboProductCard
                                    key={combo.id}
                                    combo={combo}
                                    onAddToCart={() => addToCart(combo)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Carrito */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">
                            Carrito ({cart.length})
                        </h2>

                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-center">Carrito vacío</p>
                        ) : (
                            <>
                                <div className="space-y-4 mb-4">
                                    {cart.map(item => (
                                        <div key={`${item.type}-${item.id}`} className="border-b pb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-sm">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="font-medium">
                                                    {CurrencySymbol()} {(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            {item.combo_items && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Incluye: {item.combo_items.map(ci => ci.name).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>Total:</span>
                                        <span>{CurrencySymbol()} {getTotalPrice().toFixed(2)}</span>
                                    </div>

                                    <button
                                        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => {
                                            alert('Datos del carrito en consola');
                                        }}
                                    >
                                        Procesar Compra
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Debug Info */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Debug - Estado del Carrito:</h3>
                <pre className="text-xs overflow-auto">
                    {JSON.stringify(cart, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default ComboCartTest;