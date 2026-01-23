import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const ServiceTracking = ({ data, generals = [] }) => {
    const [trackingCode, setTrackingCode] = useState('');
    const [isTracking, setIsTracking] = useState(false);

    const trackingHelpPhoneObj = generals.find(
        (item) => item.correlative === "tracking_help_phone"
    );
    const trackingHelpEmailObj = generals.find(
        (item) => item.correlative === "tracking_help_email"
    );
    
    const trackingHelpPhone = trackingHelpPhoneObj?.description ?? null;
    const trackingHelpEmail = trackingHelpEmailObj?.description ?? null;

    const handleTrack = () => {
        if (trackingCode.trim()) {
            setIsTracking(true);
            // Simulate tracking process
            setTimeout(() => {
                setIsTracking(false);
                // Here you would typically make an API call
            }, 2000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTrack();
        }
    };

    return (
        <section id={data?.element_id || null} className={`py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden ${data?.class_section || ''}`}>
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
            
            <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${data?.class_container || ''}`}>
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                        <Package className="h-8 w-8 customtext-primary" />
                    </div>
                    <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-4 ${data?.class_title || ''}`}>
                        Rastrea tu envío
                    </h2>
                    <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${data?.class_subtitle || ''}`}>
                        Ingresa tu código de rastreo para conocer el estado actual de tu paquete en tiempo real
                    </p>
                </div>

                {/* Tracking Input */}
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ingresa tu código de rastreo (ej: FC123456789)"
                                className={`w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 transition-colors duration-200 pr-12 ${data?.class_input || ''}`}
                                disabled={isTracking}
                            />
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                        </div>
                        <button
                            onClick={handleTrack}
                            disabled={!trackingCode.trim() || isTracking}
                            className={`bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center min-w-[160px] shadow-lg hover:shadow-xl ${data?.class_button || ''}`}
                        >
                            {isTracking ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Rastreando...
                                </>
                            ) : (
                                <>
                                    <Truck className="mr-2 h-5 w-5" />
                                    Rastrear
                                </>
                            )}
                        </button>
                    </div>

                    {/* Quick Status Examples */}
                    <div className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 ${data?.class_status_grid || ''}`}>
                        <div className="flex items-center p-4 bg-primary/5 rounded-xl border border-primary/20">
                            <Clock className="h-6 w-6 customtext-primary mr-3 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">En tránsito</div>
                                <div className="text-gray-600 text-xs">Camino a destino</div>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-secondary/5 rounded-xl border border-secondary/20">
                            <Package className="h-6 w-6 customtext-secondary mr-3 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">En aduana</div>
                                <div className="text-gray-600 text-xs">Proceso aduanero</div>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <CheckCircle className="h-6 w-6 text-black mr-3 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">Entregado</div>
                                <div className="text-gray-600 text-xs">Paquete recibido</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className={`text-center mt-8 ${data?.class_help_text || ''}`}>
                    <p className="text-gray-500">
                        ¿No tienes tu código de rastreo?{' '}
                        {trackingHelpPhone && (
                            <a href={`tel:${trackingHelpPhone}`} className="customtext-primary hover:text-secondary font-medium transition-colors duration-200">
                                Llámanos al {trackingHelpPhone}
                            </a>
                        )}
                        {trackingHelpPhone && trackingHelpEmail && ' o '}
                        {trackingHelpEmail && (
                            <a href={`mailto:${trackingHelpEmail}`} className="customtext-primary hover:text-secondary font-medium transition-colors duration-200">
                                escríbenos aquí
                            </a>
                        )}
                        {!trackingHelpPhone && !trackingHelpEmail && (
                            <a href="/contacto" className="customtext-primary hover:text-secondary font-medium transition-colors duration-200">
                                Contáctanos aquí
                            </a>
                        )}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ServiceTracking;