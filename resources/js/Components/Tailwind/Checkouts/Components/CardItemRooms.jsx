import { Trash2, Calendar, Users, Moon, MapPin, Wifi, Coffee, X } from "lucide-react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CardItemRooms = ({ setCart, ...room }) => {

    const onDeleteClicked = () => {
        setCart(old => old.filter(x => x.id !== room.id || x.check_in !== room.check_in));
    }

    // Formatear fechas de manera corta
    const formatDateShort = (dateString) => {
        if (!dateString) return '';
        try {
            // Agregar T00:00:00 para forzar hora local y evitar conversión UTC
            const date = new Date(dateString + 'T00:00:00');
            return format(date, "dd MMM", { locale: es });
        } catch (error) {
            return dateString;
        }
    };

    // Formatear fecha completa
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            // Agregar T00:00:00 para forzar hora local y evitar conversión UTC
            const date = new Date(dateString + 'T00:00:00');
            return format(date, "dd 'de' MMMM", { locale: es });
        } catch (error) {
            return dateString;
        }
    };

    const pricePerNight = room.final_price || room.price;
    const nights = room.nights || 1;
    const totalPrice = pricePerNight * nights;
    const guests = room.guests || 2;

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

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 font-paragraph">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-64 h-48 md:h-72 relative flex-shrink-0">
                    <img
                        src={`/storage/images/item/${room.image}`}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                    />
                    {room.room_type && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
                            {getRoomTypeLabel(room.room_type)}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                {room.name}
                            </h3>
                            
                            {/* Room Features */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Users size={16} className="text-blue-600" />
                                    <span>{guests} {guests === 1 ? 'huésped' : 'huéspedes'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Moon size={16} className="text-indigo-600" />
                                    <span>{nights} {nights === 1 ? 'noche' : 'noches'}</span>
                                </div>
                                {room.amenities && room.amenities.includes('wifi') && (
                                    <div className="flex items-center gap-1.5">
                                        <Wifi size={16} className="text-green-600" />
                                        <span>WiFi</span>
                                    </div>
                                )}
                            </div>

                            {/* Dates */}
                            <div className="inline-flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Check-in</div>
                                        <div className="font-semibold text-gray-900">{formatDate(room.check_in)}</div>
                                    </div>
                                </div>
                                <div className="w-8 h-px bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Check-out</div>
                                        <div className="font-semibold text-gray-900">{formatDate(room.check_out)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={onDeleteClicked}
                            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            aria-label="Eliminar reserva"
                            title="Eliminar reserva"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Pricing Section */}
                    <div className="flex items-end justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-gray-600">Precio por noche:</span>
                            <span className="text-lg font-semibold text-gray-900">
                                {CurrencySymbol()} {pricePerNight.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">Total a pagar</div>
                            <div className="text-2xl font-bold text-primary">
                                {CurrencySymbol()} {totalPrice.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardItemRooms;
