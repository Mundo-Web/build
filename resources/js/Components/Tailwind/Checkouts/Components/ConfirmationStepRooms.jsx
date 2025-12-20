import { useEffect, useState } from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import { recoveryBookingData } from "../../../../Actions/recoveryBookingData";
import ButtonPrimary from "./ButtonPrimary";
import { Local } from "sode-extend-react";
import Global from "../../../../Utils/Global";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Users, Moon, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

export default function ConfirmationStepRooms({ 
    setCart, 
    cart, 
    code, 
    data,
    couponDiscount = 0,
    couponCode = null
}) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await recoveryBookingData({ code });
                setOrder(response.order);
            } catch (err) {
                setError(err.message || err);
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            fetchOrderDetails();
            // Limpiar el carrito de habitaciones
            Local.delete(`${Global.APP_CORRELATIVE}_cart`);
        }
    }, [code]);

    // Formatear fechas
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, "dd 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return dateString;
        }
    };

    // Determinar tipo de habitación
    const getRoomTypeLabel = (type) => {
        const types = {
            'standard': 'Estándar',
            'suite': 'Suite',
            'deluxe': 'Deluxe',
            'presidential': 'Presidencial',
            'family': 'Familiar',
            'executive': 'Ejecutiva',
            'single': 'Individual',
            'double': 'Doble',
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow p-6 font-paragraph text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Cargando detalles de tu reserva...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow p-6 font-paragraph text-center text-red-500">
                    <p>Error al cargar la reserva: {error}</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow p-6 font-paragraph text-center">
                    <p>No se encontraron datos de la reserva</p>
                </div>
            </div>
        );
    }

    const totalPrice = order?.items?.reduce((acc, room) => {
        const pricePerNight = room.final_price || room.price || 0;
        const nights = room.nights || 1;
        return acc + (pricePerNight * nights);
    }, 0) || 0;

    // Calcular IGV y subtotal
    const subTotal = parseFloat((totalPrice / 1.18).toFixed(2));
    const igv = parseFloat((totalPrice - subTotal).toFixed(2));
    const couponDiscountAmount = parseFloat(order.coupon_discount || 0);
    const paymentCommission = parseFloat(order.payment_commission || 0);
    
    // Calcular total final
    const totalBeforeDiscount = parseFloat(subTotal) + parseFloat(igv);
    const totalFinal = totalBeforeDiscount - couponDiscountAmount + paymentCommission;

    return (
        <div className="max-w-4xl mx-auto font-paragraph">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header de confirmación */}
                <div className="bg-success p-8 text-white text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-2">¡Reserva Confirmada!</h1>
                    <p className="text-lg opacity-90">
                        Código de reserva: <span className="font-mono font-bold">{order.code}</span>
                    </p>
                </div>

                {/* Información del cliente */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 customtext-primary" />
                        Información del Huésped
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sections-color rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Nombre completo</p>
                                <p className="font-semibold">{order.name} {order.lastname}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">{order.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Teléfono</p>
                                <p className="font-semibold">+{order.phone_prefix} {order.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Documento</p>
                                <p className="font-semibold">{order.document}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detalles de las habitaciones reservadas */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Habitaciones Reservadas</h2>
                    <div className="space-y-4">
                        {order.items && order.items.map((room, index) => {
                            const pricePerNight = room.final_price || room.price || 0;
                            const nights = room.nights || 1;
                            const totalRoomPrice = pricePerNight * nights;
                            const guests = room.guests || 2;

                            return (
                                <div 
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={room.image ? `/storage/images/item/${room.image}` : '/assets/img/noimage/no_img.jpg'}
                                                alt={room.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                                onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                                            {room.room_type && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Tipo: {getRoomTypeLabel(room.room_type)}
                                                </p>
                                            )}
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="customtext-info" />
                                                    <span className="text-gray-600">Check-in:</span>
                                                    <span className="font-semibold">{formatDate(room.check_in)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="customtext-danger" />
                                                    <span className="text-gray-600">Check-out:</span>
                                                    <span className="font-semibold">{formatDate(room.check_out)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Moon size={16} className="customtext-secondary" />
                                                    <span className="text-gray-600">Noches:</span>
                                                    <span className="font-semibold">{nights}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className="customtext-success" />
                                                    <span className="text-gray-600">Huéspedes:</span>
                                                    <span className="font-semibold">{guests}</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-gray-500">Precio por noche</p>
                                                    <p className="font-semibold">{CurrencySymbol()} {Number2Currency(pricePerNight)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Total habitación</p>
                                                    <p className="font-bold text-lg customtext-primary">
                                                        {CurrencySymbol()} {Number2Currency(totalRoomPrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Resumen de pago */}
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Resumen de Pago</h2>
                    <div className="space-y-3 bg-sections-color rounded-lg p-4">
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">Subtotal</span>
                            <span className="font-semibold">{CurrencySymbol()} {Number2Currency(subTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">IGV (18%)</span>
                            <span className="font-semibold">{CurrencySymbol()} {Number2Currency(igv)}</span>
                        </div>
                        
                        {order.coupon_id && (
                            <div className="flex justify-between items-center customtext-success border-t pt-2">
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Cupón aplicado ({order.coupon_code})
                                </span>
                                <span className="font-semibold">
                                    -{CurrencySymbol()} {Number2Currency(couponDiscountAmount)}
                                </span>
                            </div>
                        )}

                        {paymentCommission > 0 && (
                            <div className="flex justify-between items-center customtext-warning border-t pt-2">
                                <span className="text-sm">
                                    Comisión método de pago ({order.payment_commission_percentage || 0}%)
                                </span>
                                <span className="font-semibold">
                                    +{CurrencySymbol()} {Number2Currency(paymentCommission)}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center font-bold text-xl border-t-2 pt-3 mt-3">
                            <span>Total Pagado</span>
                            <span className="customtext-primary">{CurrencySymbol()} {Number2Currency(totalFinal)}</span>
                        </div>

                        {order.payment_method && (
                            <div className="text-center text-sm text-gray-600 pt-2">
                                Método de pago: <span className="font-semibold capitalize">{order.payment_method}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información adicional */}
                <div className="p-6 bg-sections-color border-t border-info">
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 customtext-info mt-1" />
                        <div className="flex-1">
                            <h3 className="font-semibold customtext-primary mb-2">
                                Confirmación enviada por email
                            </h3>
                            <p className="text-sm customtext-neutral-dark">
                                Hemos enviado un correo electrónico a <span className="font-semibold">{order.email}</span> con 
                                todos los detalles de tu reserva. Por favor, revisa tu bandeja de entrada y la carpeta de spam.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nota importante */}
                {order.comment && (
                    <div className="p-6 bg-sections-color border-t border-warning">
                        <h3 className="font-semibold customtext-primary mb-2">
                            Comentarios adicionales
                        </h3>
                        <p className="text-sm customtext-neutral-dark">{order.comment}</p>
                    </div>
                )}

                {/* Botón para volver */}
                <div className="p-6 border-t border-gray-200">
                    <ButtonPrimary 
                        href="/habitaciones" 
                        className={`w-full !rounded-full py-4 text-white ${data?.class_button}`}
                    >
                        Ver más habitaciones
                    </ButtonPrimary>
                </div>

                {/* Información de contacto */}
                <div className="p-6 bg-sections-color text-center text-sm text-gray-600">
                    <p>
                        Si tienes alguna pregunta sobre tu reserva, no dudes en contactarnos.
                    </p>
                    <p className="mt-2">
                        <span className="font-semibold">Código de reserva:</span> {order.code}
                    </p>
                </div>
            </div>
        </div>
    );
}
