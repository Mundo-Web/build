import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Moon, Trash2, ShoppingBag, ArrowRight, Sparkles, Clock, CreditCard } from 'lucide-react';
import { CurrencySymbol } from '../../../Utils/Number2Currency';

const CartModalLaPetaca = ({ data, cart = [], setCart, modalOpen, setModalOpen }) => {
    const modalRef = useRef(null);

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

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        },
        exit: { 
            opacity: 0, 
            x: -50, 
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {modalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[9999] flex items-start justify-end"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop con efecto de desenfoque */}
                    <motion.div 
                        initial={{ backdropFilter: 'blur(0px)' }}
                        animate={{ backdropFilter: 'blur(8px)' }}
                        exit={{ backdropFilter: 'blur(0px)' }}
                        className="absolute inset-0 bg-black/70" 
                    />

                    {/* Modal Panel */}
                    <motion.div
                        ref={modalRef}
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                        className="relative h-full bg-sections-color w-full max-w-md shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Decoración de fondo */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {/* Header Premium */}
                        <div className="relative bg-primary p-5 shadow-lg">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                            
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                                            <ShoppingBag size={22} className="text-white" />
                                        </div>
                                        {totalCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-primary"
                                            >
                                                {totalCount}
                                            </motion.span>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Mi Carrito</h2>
                                        <p className="text-white/60 text-sm font-light">
                                            {totalCount === 0 ? 'Sin items' : `${totalCount} item${totalCount !== 1 ? 's' : ''} seleccionado${totalCount !== 1 ? 's' : ''}`}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} className="text-white" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                            {cart.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center py-16"
                                >
                                    <div className="relative mb-6">
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                                            <ShoppingBag size={48} className="customtext-primary" />
                                        </div>
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center"
                                        >
                                            <Sparkles size={16} className="customtext-secondary" />
                                        </motion.div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Tu carrito está vacío
                                    </h3>
                                    <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">
                                        Descubre nuestras exclusivas habitaciones y vive una experiencia inolvidable
                                    </p>
                                    <motion.a
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        href="/#habitaciones"
                                        onClick={() => setModalOpen(false)}
                                        className="group px-8 py-4 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 flex items-center gap-3"
                                    >
                                        <span>Explorar Habitaciones</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </motion.a>
                                </motion.div>
                            ) : (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-5"
                                >
                                    {/* Sección de Reservas */}
                                    {bookings.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full  bg-primary flex items-center justify-center">
                                                    <Calendar size={16} className="text-white" />
                                                </div>
                                                <h3 className="text-sm font-semibold customtext-primary uppercase tracking-wider">
                                                    Reservas
                                                </h3>
                                               
                                            </div>
                                            
                                            <AnimatePresence mode="popLayout">
                                                {bookings.map((booking, index) => (
                                                    <motion.div
                                                        key={`${booking.id}-${booking.check_in}-${index}`}
                                                        variants={itemVariants}
                                                        exit="exit"
                                                        layout
                                                        className="group relative overflow-hidden border-b border-primary transition-shadow duration-300"
                                                    >
                                                       
                                                        {/* Header de la card con imagen */}
                                                        <div className="relative flex gap-4 p-4">
                                                            {/* Imagen con overlay */}
                                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                                                <img
                                                                    src={booking.image ? `/storage/images/item/${booking.image}` : '/assets/img/noimage/no_img.jpg'}
                                                                    alt={booking.name}
                                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                                    onError={(e) => {
                                                                        e.target.src = '/assets/img/noimage/no_img.jpg';
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                                {/* Badge de noches */}
                                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-md flex items-center gap-1">
                                                                    <Moon size={12} className="customtext-primary" />
                                                                    <span className="text-white text-xs font-bold">
                                                                        {booking.nights || calculateNights(booking.check_in, booking.check_out)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Información principal */}
                                                            <div className="flex-1 min-w-0 py-1">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-bold customtext-neutral-dark text-base leading-tight truncate mb-1">
                                                                            {booking.name}
                                                                        </h4>
                                                                        <p className="customtext-neutral-dark text-sm">
                                                                            {booking.room_type || 'Habitación'}
                                                                        </p>
                                                                    </div>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => removeBooking(booking.id, booking.check_in, booking.check_out)}
                                                                        className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border-danger transition-colors border "
                                                                    >
                                                                        <Trash2 size={16} className="customtext-danger" />
                                                                    </motion.button>
                                                                </div>
                                                                
                                                                {/* Precio destacado */}
                                                                <div className="mt-3 flex items-baseline gap-2">
                                                                    <span className="text-2xl font-bold customtext-neutral-dark">
                                                                        {CurrencySymbol()} {parseFloat(booking.total_price || 0).toFixed(2)}
                                                                    </span>
                                                                    <span className="customtext-neutral-dark text-xs">
                                                                        total
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Detalles de fechas y huéspedes */}
                                                        <div className="px-4 pb-4">
                                                            <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {/* Check-in */}
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                                            <Calendar size={14} className="text-white" />
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="customtext-neutral-dark text-[10px] uppercase tracking-wider font-medium">Entrada</p>
                                                                            <p className="customtext-neutral-dark font-semibold text-sm truncate">
                                                                                {formatDate(booking.check_in)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Check-out */}
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                                                            <Calendar size={14} className="text-white" />
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="customtext-neutral-dark text-[10px] uppercase tracking-wider font-medium">Salida</p>
                                                                            <p className="customtext-neutral-dark font-semibold text-sm truncate">
                                                                                {formatDate(booking.check_out)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                              
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {/* Sección de Otros Items */}
                                    {otherItems.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                                                    <ShoppingBag size={16} className="customtext-secondary" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                                                    Productos
                                                </h3>
                                                <span className="px-2.5 py-1 bg-secondary/20 customtext-secondary text-xs font-bold rounded-full">
                                                    {otherItems.length}
                                                </span>
                                            </div>
                                            
                                            <AnimatePresence mode="popLayout">
                                                {otherItems.map((item, index) => (
                                                    <motion.div
                                                        key={`${item.id}-${index}`}
                                                        variants={itemVariants}
                                                        exit="exit"
                                                        layout
                                                        className="group flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/60 to-primary/80 border border-white/5 hover:border-white/10 transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        <div className="relative w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                                            <img
                                                                src={item.image ? `/storage/images/item/${item.image}` : '/assets/img/noimage/no_img.jpg'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                                onError={(e) => {
                                                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0 py-0.5">
                                                            <h4 className="font-semibold text-white truncate mb-1">
                                                                {item.name}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="px-2 py-0.5 bg-white/10 rounded-md text-white/70 text-xs">
                                                                    Cantidad: {item.quantity}
                                                                </span>
                                                            </div>
                                                            <span className="text-lg font-bold text-white">
                                                                {CurrencySymbol()} {(parseFloat(item.final_price || item.price) * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeItem(item.id)}
                                                            className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center self-start hover:bg-red-500/30 transition-colors border border-white/10"
                                                        >
                                                            <Trash2 size={16} className="text-white/70 group-hover:text-red-400" />
                                                        </motion.button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Footer Premium */}
                        {cart.length > 0 && (
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative p-5 bg-gradient-to-t from-sections-color via-sections-color to-sections-color/95 border-t border-white/10"
                            >
                                {/* Efecto de brillo superior */}
                                <div className="absolute top-0 inset-x-0 h-px bg-primary" />
                                
                                {/* Resumen de precios */}
                                <div className="space-y-3 mb-5">
                                    {bookings.length > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="customtext-neutral-dark text-sm flex items-center gap-2">
                                                <Calendar size={14} />
                                                Subtotal reservas
                                            </span>
                                            <span className="customtext-neutral-dark font-medium">{CurrencySymbol()} {totalBookings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {otherItems.length > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="customtext-neutral-dark text-sm flex items-center gap-2">
                                                <ShoppingBag size={14} />
                                                Subtotal productos
                                            </span>
                                            <span className="customtext-neutral-dark font-medium">{CurrencySymbol()} {totalOtherItems.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    {/* Línea divisoria con gradiente */}
                                    <div className="h-px bg-primary my-2" />
                                    
                                    {/* Total destacado */}
                                    <div className="flex justify-between items-center py-2">
                                        <span className="customtext-neutral-dark font-semibold text-lg">Total a pagar</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
                                                {CurrencySymbol()} {grandTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="space-y-3">
                                    <motion.a
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        href="/checkout"
                                        className="group flex items-center justify-center gap-3 w-full py-4 bg-primary rounded-full text-white font-bold transition-all shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30"
                                    >
                                        <CreditCard size={20} />
                                        <span>Proceder al Pago</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </motion.a>
                                  
                                </div>

                                {/* Info adicional con icono */}
                                <div className="mt-4 flex items-center justify-center gap-2 customtext-neutral-dark">
                                    <Clock size={12} />
                                    <p className="text-xs">
                                        Las reservas están sujetas a disponibilidad
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartModalLaPetaca;
