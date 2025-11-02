import React from 'react';
import { User, Building, ArrowRight, Shield, Globe, Truck, Calculator, Users, Briefcase } from 'lucide-react';

const ServiceSelection = ({ data }) => {
    return (
        <section className={`py-16 lg:py-24 bg-white relative overflow-hidden ${data?.class_section || ''}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary rounded-full"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-secondary rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-primary rounded-full"></div>
                <div className="absolute top-1/3 right-1/4 w-20 h-20 border border-secondary rounded-full"></div>
            </div>

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${data?.class_container || ''}`}>
                <div className="text-center mb-16">
                    <h2 className={`text-3xl lg:text-5xl font-bold text-gray-900 mb-6 ${data?.class_title || ''}`}>
                        Elige tu tipo de servicio
                    </h2>
                    <p className={`text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed ${data?.class_subtitle || ''}`}>
                        Ofrecemos soluciones especializadas tanto para personas como para empresas, 
                        adaptadas a tus necesidades específicas
                    </p>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${data?.class_cards_grid || ''}`}>
                    
                    {/* Personas Card */}
                    <div className="group relative">
                        <div className={`relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 lg:p-12 border-2 border-primary/20 hover:border-primary transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer h-full overflow-hidden ${data?.class_card_personas || ''}`}>
                            
                            {/* Background Image */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500">
                                <img
                                    src="https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                                    alt="Personas background"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Content overlay */}
                            <div className="relative z-10">
                            
                                {/* Header */}
                                <div className={`flex items-center justify-between mb-8 ${data?.class_card_header || ''}`}>
                                    <div className="bg-primary p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <User className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                                    </div>
                                    <div className="bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
                                        <span className="customtext-primary font-semibold text-sm">POPULAR</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-4 ${data?.class_card_title || ''}`}>
                                    Personas
                                </h3>
                                <p className={`text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed ${data?.class_card_description || ''}`}>
                                    Conoce nuestro servicio de Deblex Casillero Virtual y FirstClass para tus envíos desde y hacia Estados Unidos. Obtén asesoría personalizada en todo el proceso.
                                </p>

                                {/* CTA Button */}
                                <button className={`w-full bg-primary hover:bg-secondary text-white py-4 lg:py-5 rounded-xl text-lg lg:text-xl font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-xl backdrop-blur-sm mt-8 ${data?.class_card_button || ''}`}>
                                    Ver más
                                    <ArrowRight className="ml-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    {/* Empresas Card */}
                    <div className="group relative">
                        <div className={`relative bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-3xl p-8 lg:p-12 border-2 border-secondary/20 hover:border-secondary transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer h-full overflow-hidden ${data?.class_card_empresas || ''}`}>
                            
                            {/* Background Image */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500">
                                <img
                                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                                    alt="Empresas background"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Content overlay */}
                            <div className="relative z-10">
                            
                                {/* Header */}
                                <div className={`flex items-center justify-between mb-8 ${data?.class_card_header || ''}`}>
                                    <div className="bg-secondary p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Building className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                                    </div>
                                    <div className="bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
                                        <span className="customtext-secondary font-semibold text-sm">EMPRESARIAL</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-4 ${data?.class_card_title || ''}`}>
                                    Empresas
                                </h3>
                                <p className={`text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed ${data?.class_card_description || ''}`}>
                                    Tenemos soluciones de envío desde y hacia Estados unidos para empresas y emprendedores. Obtén asesoría personalizada en nuestros servicios y trámites aduaneros.
                                </p>

                                {/* CTA Button */}
                                <button className={`w-full bg-secondary hover:bg-primary text-white py-4 lg:py-5 rounded-xl text-lg lg:text-xl font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-xl backdrop-blur-sm mt-8 ${data?.class_card_button || ''}`}>
                                    Ver más
                                    <ArrowRight className="ml-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-16 ${data?.class_bottom_cta || ''}`}>
                    <p className="text-lg text-gray-600 mb-6">
                        ¿No estás seguro cuál opción es mejor para ti?
                    </p>
                    <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Habla con un asesor especializado
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServiceSelection;