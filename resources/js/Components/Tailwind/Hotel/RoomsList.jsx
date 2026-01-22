import React, { useState, useEffect } from 'react';
import SearchWidget from './SearchWidget';
import RoomCard from './RoomCard';
import Swal from 'sweetalert2';

const RoomsList = ({ data }) => {
    const [rooms, setRooms] = useState([]);
    const [searchParams, setSearchParams] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (params) => {
        setLoading(true);
        setSearched(true);

        try {
            const response = await fetch('/api/hotels/rooms/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();

            if (data.status === 200) {
                setRooms(data.data.rooms || []);
                setSearchParams({
                    check_in: data.data.check_in,
                    check_out: data.data.check_out,
                    nights: data.data.nights,
                    guests: data.data.guests,
                });

                if (data.data.rooms.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin resultados',
                        text: 'No se encontraron habitaciones disponibles para las fechas seleccionadas. Por favor, intenta con otras fechas.',
                        confirmButtonText: 'Entendido'
                    });
                }
            } else {
                throw new Error(data.message || 'Error al buscar habitaciones');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al buscar habitaciones',
                confirmButtonText: 'Cerrar'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id={data?.element_id || null} className="py-8 px-[5%] replace-max-w-here mx-auto">
            {/* Search Widget */}
            <div className="mb-8">
                <SearchWidget onSearch={handleSearch} />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                    <p className="mt-4 text-gray-600 text-lg">Buscando habitaciones disponibles...</p>
                </div>
            )}

            {/* Results Header */}
            {!loading && searched && rooms.length > 0 && searchParams && (
                <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                        <i className="fas fa-check-circle mr-2"></i>
                        Se encontraron <strong>{rooms.length}</strong> habitación(es) disponible(s) 
                        {' '}para <strong>{searchParams.nights}</strong> noche(s) 
                        {' '}del <strong>{new Date(searchParams.check_in).toLocaleDateString('es-ES')}</strong>
                        {' '}al <strong>{new Date(searchParams.check_out).toLocaleDateString('es-ES')}</strong>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            {!loading && rooms.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} searchParams={searchParams} />
                    ))}
                </div>
            )}

            {/* Empty State - Before Search */}
            {!loading && !searched && (
                <div className="text-center py-16">
                    <i className="fas fa-bed text-6xl text-gray-400 mb-4"></i>
                    <h4 className="text-2xl font-bold text-gray-700 mb-2">Busca tu habitación ideal</h4>
                    <p className="text-gray-600">
                        Selecciona tus fechas y encuentra la habitación perfecta para tu estadía
                    </p>
                </div>
            )}

            {/* Empty State - No Results */}
            {!loading && searched && rooms.length === 0 && (
                <div className="text-center py-16">
                    <i className="fas fa-calendar-times text-6xl text-gray-400 mb-4"></i>
                    <h4 className="text-2xl font-bold text-gray-700 mb-2">No hay habitaciones disponibles</h4>
                    <p className="text-gray-600">
                        Intenta con otras fechas para encontrar disponibilidad
                    </p>
                </div>
            )}
        </div>
    );
};

export default RoomsList;
