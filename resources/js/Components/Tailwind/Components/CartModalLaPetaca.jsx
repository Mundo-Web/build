import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Moon, Trash2, ShoppingBag, MapPin } from 'lucide-react';
import { CurrencySymbol } from '../../../Utils/Number2Currency';

const CartModalLaPetaca = ({ data, cart = [], setCart, modalOpen, setModalOpen }) => {
    const modalRef = useRef(null);
    const accentColor = data?.accentColor || '#78673A';
    const bgColor = data?.bgColor || '#281409';

    // Filtrar solo las reservas (type === 'booking')
    const bookings = cart.filter(item => item.type === 'booking');
    const otherItems = cart.filter(item => item.type !== 'booking');

    // Calcular totales - asegurar que sean números
    const totalBookings = bookings.reduce((acc, booking) => acc + parseFloat(booking.total_price || 0), 0);
    const totalOtherItems = otherItems.reduce((acc, item) => acc + (parseFloat(item.final_price || item.price || 0) * parseInt(item.quantity || 1)), 0);
    const grandTotal = totalBookings + totalOtherItems;

    // Cantidad total de items
    const totalCount = bookings.length + otherItems.reduce((acc, item) => acc + item.quantity, 0);

    // Cerrar modal con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setModalOpen(false);
        };
        if (modalOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen, setModalOpen]);

    // Cerrar al hacer clic fuera
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setModalOpen(false);
        }
    };

    // Eliminar reserva del carrito
    const removeBooking = (bookingId, checkIn, checkOut) => {
        const newCart = cart.filter(item => {
            if (item.type === 'booking') {
                return !(item.id === bookingId && item.check_in === checkIn && item.check_out === checkOut);
            }
            return true;
        });
        setCart(newCart);
    };

    // Eliminar item normal del carrito
    const removeItem = (itemId) => {
        const newCart = cart.filter(item => item.id !== itemId || item.type === 'booking');
        setCart(newCart);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-PE', { 
            weekday: 'short',
            day: '2-digit', 
            month: 'short'
        });
    };

    // Calcular noches entre fechas
    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    return (
        <AnimatePresence>
            {modalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-start justify-end"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal Panel */}
                    <motion.div
                        ref={modalRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative h-full w-full max-w-md shadow-2xl flex flex-col"
                        style={{ backgroundColor: bgColor }}
                    >
                        {/* Header */}
                        <div 
                            className="flex items-center justify-between p-4 border-b"
                            style={{ borderColor: `${accentColor}33` }}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={24} style={{ color: accentColor }} />
                                <div>
                                    <h2 className="text-lg font-bold text-white">Mi Carrito</h2>
                                    <p className="text-sm text-gray-400">
                                        {totalCount} {totalCount === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <ShoppingBag size={64} className="text-gray-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Tu carrito está vacío
                                    </h3>
                                    <p className="text-gray-400 mb-6">
                                        Explora nuestras habitaciones y realiza tu reserva
                                    </p>
                                    <a
                                        href="/#habitaciones"
                                        onClick={() => setModalOpen(false)}
                                        className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        Ver Habitaciones
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {/* Sección de Reservas */}
                                    {bookings.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <Calendar size={16} />
                                                Reservas ({bookings.length})
                                            </h3>
                                            
                                            {bookings.map((booking, index) => (
                                                <motion.div
                                                    key={`${booking.id}-${booking.check_in}-${index}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -100 }}
                                                    className="rounded-xl overflow-hidden border"
                                                    style={{ 
                                                        backgroundColor: `${accentColor}11`,
                                                        borderColor: `${accentColor}33`
                                                    }}
                                                >
                                                    {/* Imagen y nombre */}
                                                    <div className="flex gap-3 p-3">
                                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={booking.image ? `/storage/images/item/${booking.image}` : '/assets/img/noimage/no_img.jpg'}
                                                                alt={booking.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-white truncate">
                                                                {booking.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-400">
                                                                {booking.room_type || 'Habitación'}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span 
                                                                    className="text-lg font-bold"
                                                                    style={{ color: accentColor }}
                                                                >
                                                                    {CurrencySymbol()} {parseFloat(booking.total_price || 0).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeBooking(booking.id, booking.check_in, booking.check_out)}
                                                            className="p-2 h-fit rounded-full hover:bg-red-500/20 transition-colors group"
                                                        >
                                                            <Trash2 size={18} className="text-gray-400 group-hover:text-red-500" />
                                                        </button>
                                                    </div>

                                                    {/* Detalles de la reserva */}
                                                    <div 
                                                        className="px-3 py-2 grid grid-cols-3 gap-2 text-sm border-t"
                                                        style={{ 
                                                            backgroundColor: `${accentColor}08`,
                                                            borderColor: `${accentColor}22`
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar size={14} style={{ color: accentColor }} />
                                                            <div>
                                                                <p className="text-gray-500 text-xs">Check-in</p>
                                                                <p className="text-white font-medium">
                                                                    {formatDate(booking.check_in)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar size={14} style={{ color: accentColor }} />
                                                            <div>
                                                                <p className="text-gray-500 text-xs">Check-out</p>
                                                                <p className="text-white font-medium">
                                                                    {formatDate(booking.check_out)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Moon size={14} style={{ color: accentColor }} />
                                                            <div>
                                                                <p className="text-gray-500 text-xs">Noches</p>
                                                                <p className="text-white font-medium">
                                                                    {booking.nights || calculateNights(booking.check_in, booking.check_out)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Huéspedes */}
                                                    <div 
                                                        className="px-3 py-2 flex items-center justify-between text-sm border-t"
                                                        style={{ borderColor: `${accentColor}22` }}
                                                    >
                                                        <div className="flex items-center gap-1.5 text-gray-400">
                                                            <Users size={14} />
                                                            <span>{booking.guests} huésped{booking.guests !== 1 ? 'es' : ''}</span>
                                                        </div>
                                                        <div className="text-gray-400 text-xs">
                                                            {CurrencySymbol()} {parseFloat(booking.price || 0).toFixed(2)} / noche
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Sección de Otros Items (productos normales si los hubiera) */}
                                    {otherItems.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <ShoppingBag size={16} />
                                                Productos ({otherItems.length})
                                            </h3>
                                            
                                            {otherItems.map((item, index) => (
                                                <motion.div
                                                    key={`${item.id}-${index}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex gap-3 p-3 rounded-xl border"
                                                    style={{ 
                                                        backgroundColor: `${accentColor}11`,
                                                        borderColor: `${accentColor}33`
                                                    }}
                                                >
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image ? `/storage/images/item/${item.image}` : '/assets/img/noimage/no_img.jpg'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/assets/img/noimage/no_img.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-white truncate text-sm">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-400">
                                                            Cant: {item.quantity}
                                                        </p>
                                                        <span 
                                                            className="font-bold"
                                                            style={{ color: accentColor }}
                                                        >
                                                            {CurrencySymbol()} {(parseFloat(item.final_price || item.price) * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-2 h-fit rounded-full hover:bg-red-500/20 transition-colors group"
                                                    >
                                                        <Trash2 size={16} className="text-gray-400 group-hover:text-red-500" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer con total y botones */}
                        {cart.length > 0 && (
                            <div 
                                className="p-4 border-t space-y-4"
                                style={{ borderColor: `${accentColor}33` }}
                            >
                                {/* Resumen */}
                                <div className="space-y-2">
                                    {bookings.length > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Subtotal reservas</span>
                                            <span className="text-white">{CurrencySymbol()} {totalBookings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {otherItems.length > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Subtotal productos</span>
                                            <span className="text-white">{CurrencySymbol()} {totalOtherItems.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div 
                                        className="flex justify-between text-lg font-bold pt-2 border-t"
                                        style={{ borderColor: `${accentColor}33` }}
                                    >
                                        <span className="text-white">Total</span>
                                        <span style={{ color: accentColor }}>
                                            {CurrencySymbol()} {grandTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="space-y-2">
                                    <a
                                        href="/cart"
                                        className="block w-full py-3 text-center text-white font-semibold rounded-lg transition-all hover:opacity-90"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        Ir al Carrito
                                    </a>
                                    <a
                                        href="/checkout"
                                        className="block w-full py-3 text-center font-semibold rounded-lg border transition-all hover:bg-white/5"
                                        style={{ 
                                            borderColor: accentColor,
                                            color: accentColor
                                        }}
                                    >
                                        Proceder al Pago
                                    </a>
                                </div>

                                {/* Info adicional */}
                                <p className="text-xs text-gray-500 text-center">
                                    Las reservas están sujetas a disponibilidad
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartModalLaPetaca;
