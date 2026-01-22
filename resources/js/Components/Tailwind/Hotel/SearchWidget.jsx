import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';

const SearchWidget = ({ onSearch, className = '', data }) => {
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(2);
    const [roomType, setRoomType] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const roomTypes = {
        '': 'Todos los tipos',
        'standard': 'Estándar',
        'suite': 'Suite',
        'deluxe': 'Deluxe',
        'presidential': 'Presidencial',
        'family': 'Familiar',
        'executive': 'Ejecutiva',
    };

    const validateDates = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!checkIn) {
            newErrors.checkIn = 'Selecciona la fecha de entrada';
        } else if (checkIn < today) {
            newErrors.checkIn = 'La fecha de entrada no puede ser anterior a hoy';
        }

        if (!checkOut) {
            newErrors.checkOut = 'Selecciona la fecha de salida';
        } else if (checkOut <= checkIn) {
            newErrors.checkOut = 'La fecha de salida debe ser posterior a la entrada';
        }

        if (guests < 1) {
            newErrors.guests = 'Debe haber al menos 1 huésped';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!validateDates()) {
            return;
        }

        setLoading(true);

        try {
            const searchParams = {
                check_in: checkIn.toISOString().split('T')[0],
                check_out: checkOut.toISOString().split('T')[0],
                guests,
                room_type: roomType || undefined,
            };

            if (onSearch) {
                await onSearch(searchParams);
            }
        } catch (error) {
            console.error('Error al buscar habitaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckInChange = (date) => {
        setCheckIn(date);
        // Si la fecha de salida es anterior o igual, ajustarla
        if (checkOut && checkOut <= date) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setCheckOut(nextDay);
        }
        if (errors.checkIn) {
            setErrors({ ...errors, checkIn: null });
        }
    };

    const handleCheckOutChange = (date) => {
        setCheckOut(date);
        if (errors.checkOut) {
            setErrors({ ...errors, checkOut: null });
        }
    };

    return (
        <div id={data?.element_id || null} className={`${className}`}>
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                    <h3 className="text-center text-2xl font-bold text-gray-900 mb-6">
                        <i className="fas fa-search mr-2 text-primary"></i>
                        Buscar Habitaciones Disponibles
                    </h3>
                    
                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Check-in */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fas fa-calendar-check mr-2 text-green-600"></i>
                                    Fecha de Entrada
                                </label>
                                <DatePicker
                                    selected={checkIn}
                                    onChange={handleCheckInChange}
                                    selectsStart
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    locale={es}
                                    placeholderText="Selecciona fecha"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.checkIn && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.checkIn}
                                    </p>
                                )}
                            </div>

                            {/* Check-out */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fas fa-calendar-times mr-2 text-red-600"></i>
                                    Fecha de Salida
                                </label>
                                <DatePicker
                                    selected={checkOut}
                                    onChange={handleCheckOutChange}
                                    selectsEnd
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={checkIn || new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    locale={es}
                                    placeholderText="Selecciona fecha"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.checkOut ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.checkOut && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.checkOut}
                                    </p>
                                )}
                            </div>

                            {/* Guests */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fas fa-users mr-2 text-blue-600"></i>
                                    Número de Huéspedes
                                </label>
                                <select
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.guests ? 'border-red-500' : 'border-gray-300'}`}
                                    value={guests}
                                    onChange={(e) => {
                                        setGuests(parseInt(e.target.value));
                                        if (errors.guests) {
                                            setErrors({ ...errors, guests: null });
                                        }
                                    }}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>
                                            {num} {num === 1 ? 'huésped' : 'huéspedes'}
                                        </option>
                                    ))}
                                </select>
                                {errors.guests && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.guests}
                                    </p>
                                )}
                            </div>

                            {/* Room Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="fas fa-bed mr-2 text-indigo-600"></i>
                                    Tipo de Habitación
                                </label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={roomType}
                                    onChange={(e) => setRoomType(e.target.value)}
                                >
                                    {Object.entries(roomTypes).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl transform hover:scale-[1.02]'}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                            Buscando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <i className="fas fa-search"></i>
                                            Buscar Habitaciones
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Info */}
                            {checkIn && checkOut && (
                                <div className="md:col-span-2">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                                        <span className="text-blue-800">
                                            <strong>{Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))} noche(s)</strong>
                                            {' '}del {checkIn.toLocaleDateString('es-ES')} al {checkOut.toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchWidget;
