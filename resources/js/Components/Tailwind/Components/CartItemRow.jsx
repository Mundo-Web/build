import React from "react";
import { motion } from "framer-motion";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import { Minus, Plus, Trash2, Package, Bed, Calendar, Users, Moon } from "lucide-react";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";

const CartItemRow = ({ setCart, index, ...item }) => {
    const isCombo = item.type === 'combo';
    const isBooking = item.type === 'booking';
    
    const onDelete = () => {
        // Para reservas, mostrar confirmación especial
        if (isBooking) {
            Swal.fire({
                title: '¿Eliminar reserva?',
                html: `
                    <p class="mb-2">¿Deseas eliminar esta reserva del carrito?</p>
                    <p class="text-sm text-gray-600">
                        ${item.name}<br/>
                        ${formatDate(item.check_in)} - ${formatDate(item.check_out)}
                    </p>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#dc3545',
            }).then((result) => {
                if (result.isConfirmed) {
                    setCart(old => old.filter(x => 
                        !(x.type === 'booking' && x.id === item.id && x.check_in === item.check_in && x.check_out === item.check_out)
                    ));
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Reserva eliminada',
                        text: 'La reserva ha sido eliminada del carrito',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            });
            return;
        }
        
        // Para productos y combos
        setCart(old => old.filter(x => 
            x.id !== item.id || (x.type !== item.type)
        ));
    };
    
    const updateQuantity = (newQuantity) => {
        if(newQuantity < 1) return onDelete();
        setCart(old => old.map(x => 
            (x.id === item.id && x.type === item.type) 
                ? { ...x, quantity: newQuantity } 
                : x
        ));
    };

    // Formatear fechas para reservas
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    const roomTypes = {
        'standard': 'Estándar',
        'suite': 'Suite',
        'deluxe': 'Deluxe',
        'presidential': 'Presidencial',
        'family': 'Familiar',
        'executive': 'Ejecutiva',
    };

    // Determinar precio final según si es combo, booking o item
    const finalPrice = isBooking
        ? item.total_price // Para reservas usar el total_price
        : (isCombo 
            ? (item.final_price || item.price) // Para combos usar final_price o price
            : (item.discount > 0 ? Math.min(item.price, item.discount) : item.price));

    // Renderizar componente especial para reservas
    if (isBooking) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-blue-100"
            >
                <div className="flex gap-4">
                    <div className="flex-shrink-0 relative">
                        <img
                            src={item.image ? `/api/items/media/${item.image}` : '/images/placeholder-room.jpg'}
                            onError={(e) => e.target.src = "/assets/img/noimage/no_img.jpg"}
                            className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-sm"
                            alt={item.name}
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-md">
                            <Bed size={14} />
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2 mb-2">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">
                                    {item.name}
                                </h3>
                                <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full mb-2">
                                    <Bed className="inline-block w-3 h-3 mr-1" />
                                    {roomTypes[item.room_type] || 'Habitación'}
                                </span>
                            </div>
                            <Tippy content="Eliminar reserva">
                                <button
                                    onClick={onDelete}
                                    className="text-gray-400 hover:text-red-500 transition-colors self-start"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </Tippy>
                        </div>
                        
                        {/* Información de la reserva */}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                            <div className="flex items-center text-gray-700">
                                <Calendar size={14} className="mr-1 text-green-600" />
                                <span className="font-medium">Check-in:</span>
                                <span className="ml-1">{formatDate(item.check_in)}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Calendar size={14} className="mr-1 text-red-600" />
                                <span className="font-medium">Check-out:</span>
                                <span className="ml-1">{formatDate(item.check_out)}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Moon size={14} className="mr-1 text-indigo-600" />
                                <span className="font-medium">{item.nights} noche{item.nights !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Users size={14} className="mr-1 text-blue-600" />
                                <span className="font-medium">{item.guests} huésped{item.guests !== 1 ? 'es' : ''}</span>
                            </div>
                        </div>

                        {/* Amenidades destacadas */}
                        {item.amenities && item.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {item.amenities.slice(0, 3).map((amenity) => (
                                    <span key={amenity.id} className="text-xs px-2 py-1 bg-white text-gray-600 rounded-full border border-gray-200">
                                        <i className={`${amenity.icon || 'fas fa-check'} mr-1`}></i>
                                        {amenity.name}
                                    </span>
                                ))}
                                {item.amenities.length > 3 && (
                                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-full border border-gray-200">
                                        +{item.amenities.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                            {/* Las reservas no tienen cantidad editable */}
                            <div className="text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-blue-200">
                                <span className="font-medium">
                                    S/ {(item.total_price / item.nights).toFixed(2)} × {item.nights} {item.nights === 1 ? 'noche' : 'noches'}
                                </span>
                            </div>
                            
                            <span className="font-bold text-xl text-blue-700">
                                {CurrencySymbol()} {Number2Currency(item.total_price)}
                            </span>
                        </div>

                        {/* Nota informativa */}
                        <div className="mt-2 text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border border-blue-100">
                            <i className="fas fa-info-circle mr-1 text-blue-600"></i>
                            Las reservas no requieren envío. Cancela hasta 24h antes del check-in.
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex-shrink-0 relative">
                <img
                    src={isCombo 
                        ? (item.image ? `/storage/images/combo/${item.image}` : `/storage/images/item/${item.image}`)
                        : `/storage/images/item/${item.image}`
                    }
                    onError={(e) => e.target.src = "/assets/img/noimage/no_img.jpg"}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                    alt={item.name}
                />
                {isCombo && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                        <Package size={12} />
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2 mb-2">
                    <div className="max-w-52">
                        <h3 className="font-semibold line-clamp-2  text-gray-900 truncate">
                            {item.name}
                        </h3>
                        {isCombo && (
                            <span className="text-xs customtext-primary font-medium">
                                Combo ({item.combo_items?.length || 0} productos)
                            </span>
                        )}
                    </div>
                    <Tippy content="Eliminar">
                        <button
                            onClick={onDelete}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </Tippy>
                </div>
                
                {!isCombo && item?.discount > 0 && (
                    <div className="text-sm text-gray-500 mb-2">
                        <span className="line-through mr-2">
                            {Number2Currency(item.price)}
                        </span>
                        <span className="text-red-500">
                            -{Number(item.discount_percent).toFixed(0)}%
                        </span>
                    </div>
                )}

                {isCombo && item?.discount > 0 && (
                    <div className="text-sm text-gray-500 mb-2">
                        <span className="line-through mr-2">
                            {CurrencySymbol()} {Number2Currency(item.price)}
                        </span>
                        <span className="text-red-500">
                            -{Number(item.discount_percent).toFixed(0)}%
                        </span>
                    </div>
                )}

                {isCombo && item.combo_items && (
                    <div className="text-xs text-gray-500 mb-2">
                        Incluye: {item.combo_items.map(comboItem => comboItem.name).join(', ')}
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                        >
                            <Plus size={16} className="text-gray-600" />
                        </button>
                    </div>
                    
                    <span className="font-semibold text-gray-900">
                        {CurrencySymbol()} {Number2Currency(finalPrice * item.quantity)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItemRow;