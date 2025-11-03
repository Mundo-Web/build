import React, { useState, useEffect, useRef } from "react";
import {
    Package,
    DollarSign,
    Scale,
    ShieldCheck,
    AlertTriangle,
    FileText,
    Truck,
    CheckCircle,
    XCircle,
    ArrowRight,
    Calculator,
    Globe,
    Box,
    Plane,
    Clock,
    Ban,
    AlertCircle,
    TrendingUp,
    Home,
    Headphones
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

const TarifasNormativas = ({ data, items, generals, cart, setCart, pages, isUser, contacts }) => {
    const [selectedWeight, setSelectedWeight] = useState(5);
    const [isVisible, setIsVisible] = useState({});
    const observerRef = useRef(null);

    // Intersection Observer for animations
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.dataset.section]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll("[data-section]").forEach((section) => {
            observerRef.current?.observe(section);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    // Cálculo de tarifas
    const calcularTarifa = (peso) => {
        const flete = peso * 1.75;
        const cargosFijos = 14;
        const total = flete + cargosFijos;
        return {
            flete: flete.toFixed(2),
            cargosFijos: cargosFijos.toFixed(2),
            total: total.toFixed(2)
        };
    };

    const tarifa = calcularTarifa(selectedWeight);

    const tarifasInfo = {
        flete: {
            precio: "$1.75 USD",
            unidad: "por libra",
            rango: "1LB hasta 110LB",
            descripcion: "Recepción, almacenaje, consolidación, preparación y transporte internacional"
        },
        cargosFijos: {
            precio: "$14 USD",
            descripcion: "Se calcula por envío",
            incluye: [
                "Seguro con cobertura hasta $200 USD",
                "Proceso y trámite de importación postal",
                "Entrega en cualquier parte de Perú"
            ]
        }
    };

    const requisitosAduana = [
        {
            categoria: "Envíos hasta $200 USD",
            icon: "📦",
            requisitos: [
                "Valor máximo: $200 USD FOB",
                "Peso máximo: 50 kg",
                "Solo artículos de uso personal",
                "Documentación simplificada"
            ],
            color: "from-green-500 to-emerald-500"
        },
        {
            categoria: "Envíos de $200 a $2000 USD",
            icon: "📋",
            requisitos: [
                "Valor: $200 - $2000 USD FOB",
                "Requiere factura comercial",
                "RUC activo obligatorio",
                "Declaración aduanera detallada"
            ],
            color: "from-blue-500 to-cyan-500"
        },
        {
            categoria: "Envíos superiores a $2000 USD",
            icon: "⚠️",
            requisitos: [
                "Cambio de modalidad necesario",
                "Importación formal requerida",
                "Agente de aduanas obligatorio",
                "Proceso completo de desaduanaje"
            ],
            color: "from-orange-500 to-red-500"
        }
    ];

    const mercanciaProhibida = [
        {
            icon: "🔫",
            titulo: "Armas y Explosivos",
            items: ["Armas de fuego", "Municiones", "Explosivos", "Artículos bélicos", "Fuegos artificiales"]
        },
        {
            icon: "💊",
            titulo: "Sustancias Reguladas",
            items: ["Drogas ilegales", "Medicamentos controlados sin receta", "Precursores químicos", "Sustancias psicotrópicas"]
        },
        {
            icon: "🐾",
            titulo: "Materiales Biológicos",
            items: ["Animales vivos", "Plantas sin certificado", "Materiales biológicos", "Productos de origen animal"]
        },
        {
            icon: "💰",
            titulo: "Valores y Joyas",
            items: ["Dinero en efectivo", "Billetes de banco", "Joyas de alto valor", "Metales preciosos sin declarar"]
        },
        {
            icon: "📱",
            titulo: "Electrónicos Usados",
            items: ["Celulares usados o remanufacturados", "Equipos electrónicos de segunda mano", "Baterías de litio sin embalaje"]
        },
        {
            icon: "🍾",
            titulo: "Sustancias Restringidas",
            items: ["Bebidas alcohólicas", "Tabaco y cigarrillos", "Productos falsificados", "Material obsceno o inmoral"]
        },
        {
            icon: "🚗",
            titulo: "Autopartes Usadas",
            items: ["Repuestos usados de vehículos", "Partes de motor usadas", "Neumáticos de segunda mano"]
        },
        {
            icon: "⚖️",
            titulo: "Productos Falsificados",
            items: ["Mercancía pirateada", "Copias no autorizadas", "Imitaciones de marcas", "Productos con violación de derechos"]
        }
    ];

    const consecuenciasIncumplimiento = [
        {
            titulo: "Reajuste de Valor",
            descripcion: "Si el valor declarado no corresponde al valor real de la mercancía, será objeto de propuesta de valor, generando un ajuste en el pago de tributos aduaneros.",
            icon: Calculator,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            titulo: "Cambio de Modalidad",
            descripcion: "Cuando no se cumplen los requisitos de tráfico postal, se debe cambiar la modalidad de importación, trasladando el envío a un depósito aduanero.",
            icon: TrendingUp,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            titulo: "Abandono",
            descripcion: "Si pasan 30 días sin nacionalizar el envío, se considera abandonado. Puedes recuperarlo en el siguiente mes pagando impuestos y 10% adicional. Después pasa a propiedad del Estado.",
            icon: Clock,
            color: "text-red-600",
            bgColor: "bg-red-50"
        },
        {
            titulo: "Aprehensión o Decomiso",
            descripcion: "Mercancía prohibida, no descrita o que no está amparada en el documento de transporte será aprehendida o decomisada directamente por la aduana.",
            icon: Ban,
            color: "text-red-700",
            bgColor: "bg-red-100"
        }
    ];

    const pasosCotizacion = [
        {
            numero: 1,
            titulo: "Pesa tu Paquete",
            descripcion: "Calcula el peso real o volumétrico de tu envío",
            icon: Scale
        },
        {
            numero: 2,
            titulo: "Calcula el Flete",
            descripcion: "Multiplica el peso por $1.75 USD",
            icon: Calculator
        },
        {
            numero: 3,
            titulo: "Suma Cargos Fijos",
            descripcion: "Agrega $14 USD de cargos fijos por envío",
            icon: DollarSign
        },
        {
            numero: 4,
            titulo: "Total a Pagar",
            descripcion: "Obtén el costo total de tu envío",
            icon: CheckCircle
        }
    ];

    const beneficiosServicio = [
        {
            icon: ShieldCheck,
            titulo: "Seguro Incluido",
            descripcion: "Cobertura hasta $200 USD sin costo adicional",
            color: "text-blue-600"
        },
        {
            icon: Truck,
            titulo: "Entrega Nacional",
            descripcion: "Entregamos en cualquier parte de Perú",
            color: "text-green-600"
        },
        {
            icon: FileText,
            titulo: "Gestión Aduanera",
            descripcion: "Nos encargamos de todos los trámites",
            color: "text-purple-600"
        },
        {
            icon: Package,
            titulo: "Consolidación",
            descripcion: "Agrupa múltiples compras en un solo envío",
            color: "text-orange-600"
        }
    ];

    return (
        <div className="w-full bg-gray-50">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                            <DollarSign className="w-5 h-5" />
                            <span className="font-semibold">Tarifas Transparentes</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Tarifas y Normativas
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Conoce nuestras tarifas competitivas y los requisitos aduaneros para tus envíos desde USA a Perú
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <div className="text-3xl font-bold">$1.75</div>
                                <div className="text-sm">USD por libra</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <div className="text-3xl font-bold">$14</div>
                                <div className="text-sm">USD cargos fijos</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <div className="text-3xl font-bold">$200</div>
                                <div className="text-sm">Seguro incluido</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculadora de Tarifas */}
            <section 
                data-section="calculator"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.calculator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Calcula tu Tarifa
                            </h2>
                            <p className="text-xl text-gray-600">
                                Usa nuestra calculadora para estimar el costo de tu envío
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 shadow-lg">
                            <div className="mb-8">
                                <label className="block text-lg font-semibold text-gray-900 mb-4">
                                    Peso de tu envío (libras)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="110"
                                    value={selectedWeight}
                                    onChange={(e) => setSelectedWeight(Number(e.target.value))}
                                    className="w-full h-3 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>1 LB</span>
                                    <span className="text-2xl font-bold text-primary">{selectedWeight} LB</span>
                                    <span>110 LB</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Scale className="w-6 h-6 text-primary" />
                                        <span className="text-gray-600">Flete</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        ${tarifa.flete}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {selectedWeight} lb × $1.75
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="w-6 h-6 text-orange-600" />
                                        <span className="text-gray-600">Cargos Fijos</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        ${tarifa.cargosFijos}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Por envío
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 shadow-md text-white">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DollarSign className="w-6 h-6" />
                                        <span className="font-semibold">Total</span>
                                    </div>
                                    <div className="text-3xl font-bold">
                                        ${tarifa.total}
                                    </div>
                                    <div className="text-sm opacity-90 mt-1">
                                        USD
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                    <div className="text-sm text-blue-900">
                                        <strong>Incluye:</strong> Seguro hasta $200 USD, gestión aduanera, almacenaje, consolidación y entrega en Perú
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Desglose de Tarifas */}
            <section 
                data-section="breakdown"
                className={`py-16 bg-gray-50 transition-all duration-1000 ${
                    isVisible.breakdown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Desglose de Tarifas
                            </h2>
                            <p className="text-xl text-gray-600">
                                Transparencia total en nuestros costos
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Flete */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                        <Plane className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Flete</h3>
                                        <p className="text-primary font-semibold">{tarifasInfo.flete.precio} {tarifasInfo.flete.unidad}</p>
                                    </div>
                                </div>
                                <div className="bg-primary/5 rounded-lg p-4 mb-4">
                                    <div className="font-semibold text-gray-900 mb-2">Rango de peso:</div>
                                    <div className="text-gray-700">{tarifasInfo.flete.rango}</div>
                                </div>
                                <div className="text-gray-600">
                                    <strong className="text-gray-900">Incluye:</strong>
                                    <p className="mt-2">{tarifasInfo.flete.descripcion}</p>
                                </div>
                            </div>

                            {/* Cargos Fijos */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Cargos Fijos</h3>
                                        <p className="text-orange-600 font-semibold">{tarifasInfo.cargosFijos.precio}</p>
                                    </div>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                                    <div className="font-semibold text-gray-900 mb-2">Aplicación:</div>
                                    <div className="text-gray-700">{tarifasInfo.cargosFijos.descripcion}</div>
                                </div>
                                <div className="space-y-2">
                                    <strong className="text-gray-900">Incluye:</strong>
                                    {tarifasInfo.cargosFijos.incluye.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pasos para Cotizar */}
            <section 
                data-section="steps"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.steps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                ¿Cómo Calcular tu Envío?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Sigue estos simples pasos
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {pasosCotizacion.map((paso, index) => (
                                <div key={index} className="relative">
                                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 h-full">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                                            {paso.numero}
                                        </div>
                                        <paso.icon className="w-8 h-8 text-primary mb-3" />
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            {paso.titulo}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {paso.descripcion}
                                        </p>
                                    </div>
                                    {index < pasosCotizacion.length - 1 && (
                                        <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-primary" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Requisitos Aduaneros */}
            <section 
                data-section="requirements"
                className={`py-16 bg-gray-50 transition-all duration-1000 ${
                    isVisible.requirements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                                <Globe className="w-5 h-5 text-primary" />
                                <span className="text-primary font-semibold">Normativa Aduanera</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Requisitos por Valor de Envío
                            </h2>
                            <p className="text-xl text-gray-600">
                                Según las normas de aduana para modalidad courier
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {requisitosAduana.map((categoria, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className={`bg-gradient-to-br ${categoria.color} p-6 text-white`}>
                                        <div className="text-5xl mb-3">{categoria.icon}</div>
                                        <h3 className="text-xl font-bold">
                                            {categoria.categoria}
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <ul className="space-y-3">
                                            {categoria.requisitos.map((req, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-amber-900 mb-2">Importante</h4>
                                    <p className="text-amber-800">
                                        Los envíos que superen los $2,000 USD FOB no pueden ingresar por modalidad courier y requieren 
                                        cambio a importación formal con agente de aduanas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mercancía Prohibida */}
            <section 
                data-section="prohibited"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.prohibited ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="text-red-600 font-semibold">Restricciones</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Mercancía Prohibida
                            </h2>
                            <p className="text-xl text-gray-600">
                                Productos que no pueden ingresar a Perú por modalidad courier
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mercanciaProhibida.map((categoria, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-50 to-red-50 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-shadow">
                                    <div className="text-4xl mb-3">{categoria.icon}</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-3">
                                        {categoria.titulo}
                                    </h3>
                                    <ul className="space-y-2">
                                        {categoria.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <div className="text-red-900">
                                    <p className="font-semibold mb-2">Nota Importante:</p>
                                    <p>
                                        Esta lista es un ejemplo general. Te recomendamos siempre verificar las regulaciones actuales 
                                        y específicas tanto de Estados Unidos como de Perú con tu asesor o las autoridades aduaneras 
                                        correspondientes antes de realizar cualquier envío. Las normativas pueden cambiar, y es tu 
                                        responsabilidad asegurarte de cumplir con todos los requisitos legales.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Consecuencias de Incumplimiento */}
            <section 
                data-section="consequences"
                className={`py-16 bg-gray-50 transition-all duration-1000 ${
                    isVisible.consequences ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                ¿Qué Pasa si el Envío No Cumple?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Consecuencias por incumplimiento de requisitos aduaneros
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {consecuenciasIncumplimiento.map((consecuencia, index) => (
                                <div key={index} className={`${consecuencia.bgColor} rounded-2xl p-6 border-2 border-${consecuencia.color.split('-')[1]}-200`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${consecuencia.bgColor} border-2 border-${consecuencia.color.split('-')[1]}-300 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <consecuencia.icon className={`w-6 h-6 ${consecuencia.color}`} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${consecuencia.color} mb-2`}>
                                                {consecuencia.titulo}
                                            </h3>
                                            <p className="text-gray-700">
                                                {consecuencia.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div className="text-blue-900">
                                    <p className="font-semibold mb-2">Nuestro Compromiso</p>
                                    <p>
                                        En FirstClass estamos comprometidos en apoyar y asesorar el proceso de logística 
                                        internacional para tus envíos desde y hacia Estados Unidos. Nuestro equipo te 
                                        guiará para cumplir con todos los requisitos aduaneros.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficios del Servicio */}
            <section 
                data-section="benefits"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Beneficios Incluidos
                            </h2>
                            <p className="text-xl text-gray-600">
                                Todo lo que obtienes con nuestro servicio
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {beneficiosServicio.map((beneficio, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <beneficio.icon className={`w-12 h-12 ${beneficio.color} mb-4`} />
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        {beneficio.titulo}
                                    </h3>
                                    <p className="text-gray-600">
                                        {beneficio.descripcion}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            ¿Listo para Enviar?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Cotiza tu envío ahora y aprovecha nuestras tarifas competitivas
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a
                                href="#cotizar"
                                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                <Calculator className="w-5 h-5" />
                                Cotiza tu Envío
                            </a>
                            <a
                                href="#contacto"
                                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-colors border-2 border-white"
                            >
                                <Headphones className="w-5 h-5" />
                                Contactar Asesor
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TarifasNormativas;
