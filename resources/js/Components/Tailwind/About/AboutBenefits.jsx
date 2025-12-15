import React from 'react';
import { Shield, Clock, DollarSign, Package, MapPin, Headphones, Truck, Star } from 'lucide-react';

const AboutBenefits = ({ data }) => {
    const benefits = [
        {
            icon: Shield,
            title: "Seguridad garantizada",
            description: "Seguimiento completo y seguro de tus paquetes desde EE.UU. hasta tu puerta"
        },
        {
            icon: Clock,
            title: "Entrega rápida",
            description: "Recibe tus compras en 5-7 días hábiles con nuestro servicio express"
        },
        {
            icon: DollarSign,
            title: "Precios competitivos",
            description: "Tarifas transparentes sin costos ocultos, ahorra hasta 40% vs. otros couriers"
        },
        {
            icon: Package,
            title: "Consolidación gratuita",
            description: "Combina múltiples compras en un solo envío y ahorra en costos de envío"
        },
        {
            icon: MapPin,
            title: "Cobertura nacional",
            description: "Entregamos en todas las principales ciudades de Perú"
        },
        {
            icon: Headphones,
            title: "Soporte 24/7",
            description: "Atención al cliente especializada disponible todos los días del año"
        },
        {
            icon: Truck,
            title: "Recogida a domicilio",
            description: "Servicio de recogida en tu oficina o domicilio sin costo adicional"
        },
        {
            icon: Star,
            title: "Calidad premium",
            description: "Más de 10 años de experiencia en logística internacional"
        }
    ];

    return (
        <section className={`py-20 bg-gray-50 ${data?.class_section || ''}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${data?.class_container || ''}`}>
                <div className="text-center mb-16">
                    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${data?.class_title || ''}`}>
                        ¿Por qué elegir FirstClass?
                    </h2>
                    <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${data?.class_subtitle || ''}`}>
                        Más de 50,000 clientes confían en nosotros para sus envíos internacionales
                    </p>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${data?.class_benefits_grid || ''}`}>
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${data?.class_benefit_card || ''}`}
                            >
                                <div className={`bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300 ${data?.class_benefit_icon || ''}`}>
                                    <Icon className="h-6 w-6 customtext-primary" />
                                </div>
                                <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${data?.class_benefit_title || ''}`}>
                                    {benefit.title}
                                </h3>
                                <p className={`text-gray-600 ${data?.class_benefit_description || ''}`}>
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AboutBenefits;