import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from './Breadcrumbs';
import BrandsCarousel from './BrandsCarousel';
import { 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  ArrowRight, 
  Globe, 
  Shield, 
  Clock, 
  Star,
  User,
  Mail,
  Plane,
  ChevronDown,
  Play,
  DollarSign,
  Smartphone,
  MessageCircle,
  FileText
} from 'lucide-react';

const CasilleroVirtual = ({ data, items, generals, cart, setCart, pages, isUser, contacts }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const observerRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  // Auto-advance steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      id: 1,
      icon: User,
      title: "Regístrate Gratis",
      description: "Recibirás vía correo electrónico tu dirección en Miami, Estados Unidos.",
      color: "from-blue-500 to-cyan-500",
      delay: "0ms"
    },
    {
      id: 2,
      icon: MapPin,
      title: "Envía a tu casillero",
      description: "Usa tu dirección de Miami cuando realices tu compra, tal cual te la proporcionamos.",
      color: "from-cyan-500 to-teal-500",
      delay: "200ms"
    },
    {
      id: 3,
      icon: Package,
      title: "Crea orden de envío",
      description: "Te notificaremos cuando tus compras lleguen al casillero virtual para que puedas indicarnos cómo prefieres realizar el envío a Perú.",
      color: "from-teal-500 to-green-500",
      delay: "400ms"
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Recibe en Perú",
      description: "Recibe tu envío de 3 a 7 días hábiles en la dirección que nos indiques en cualquier parte de Perú.",
      color: "from-green-500 to-emerald-500",
      delay: "600ms"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Protección total de tus paquetes",
      color: "text-blue-500"
    },
    {
      icon: Clock,
      title: "Entrega Rápida",
      description: "3-7 días hábiles a Perú",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Acceso Global",
      description: "Miles de tiendas estadounidenses",
      color: "text-purple-500"
    },
    {
      icon: Star,
      title: "Calidad Premium",
      description: "Servicio de primera clase",
      color: "text-yellow-500"
    }
  ];

  const features = [
    {
      title: "Dirección física real en Miami",
      description: "No es un apartado postal, es una dirección física real que acepta todos los tipos de envío.",
      icon: "🏢"
    },
    {
      title: "Consolidación gratuita",
      description: "Combina múltiples compras en un solo envío y ahorra hasta 60% en costos de envío.",
      icon: "📦"
    },
    {
      title: "Almacenamiento gratuito",
      description: "Guardamos tus paquetes hasta 60 días sin costo adicional.",
      icon: "🏪"
    },
    {
      title: "Seguro incluido",
      description: "Todos los envíos incluyen seguro básico sin costo adicional.",
      icon: "🛡️"
    },
    {
      title: "Fotos de tus paquetes",
      description: "Recibe fotos de tus paquetes antes del envío para verificar su estado.",
      icon: "📸"
    },
    {
      title: "Reempaque profesional",
      description: "Optimizamos el empaque para reducir peso y dimensiones.",
      icon: "📋"
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary" style={{ margin: 0, padding: 0, position: 'relative', top: 0 }}>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/10 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs className="text-white/80" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div 
                className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium mb-8 animate-fade-in"
                data-animate
                id="hero-badge"
              >
                <Package className="mr-2 h-5 w-5" />
                Casillero Virtual FirstClass
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span 
                  className={`block transition-all duration-1000 ${isVisible['hero-title1'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  data-animate
                  id="hero-title1"
                >
                  Una forma
                </span>
                <span 
                  className={`block text-6xl lg:text-8xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${isVisible['hero-title2'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  data-animate
                  id="hero-title2"
                >
                  Divertida
                </span>
                <span 
                  className={`block transition-all duration-1000 delay-600 ${isVisible['hero-title3'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  data-animate
                  id="hero-title3"
                >
                  de Importar
                </span>
              </h1>

              <p 
                className={`text-xl lg:text-2xl text-white/90 mb-4 transition-all duration-1000 delay-900 ${isVisible['hero-subtitle'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                data-animate
                id="hero-subtitle"
              >
                Rápido | Seguro | Eficiente
              </p>

              <p 
                className={`text-lg text-white/80 mb-8 transition-all duration-1000 delay-1200 ${isVisible['hero-desc'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                data-animate
                id="hero-desc"
              >
                ¡Crea tu casillero AHORA mismo!
              </p>

              <div 
                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-1500 ${isVisible['hero-buttons'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                data-animate
                id="hero-buttons"
              >
                <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-xl group">
                  <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
                  Abrir mi casillero
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center group">
                  <Play className="mr-3 h-6 w-6" />
                  Ver cómo funciona
                </button>
              </div>
            </div>

            {/* Right Visual - Creative Card */}
            <div className="flex justify-center lg:justify-end">
              <div 
                className={`relative max-w-md w-full transition-all duration-1000 delay-800 ${isVisible['hero-card'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-12'}`}
                data-animate
                id="hero-card"
              >
                {/* Main Card */}
                <div className="bg-black rounded-3xl p-8 shadow-2xl transform hover:rotate-0 transition-all duration-500 relative overflow-hidden">
                  {/* Decorative elements inside card */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-red-400 rounded-full animate-pulse delay-500"></div>
                  <div className="absolute top-1/3 left-6 w-4 h-4 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
                  
                  {/* Floating geometric shapes */}
                  <div className="absolute top-8 left-8 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg transform rotate-45 animate-pulse"></div>
                  <div className="absolute bottom-16 right-8 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse delay-700"></div>
                  <div className="absolute top-20 right-12 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 transform rotate-12 animate-pulse delay-300"></div>
                  
                  <div className="text-center relative z-10">
                    <h3 className="text-white text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                      Una forma<br />
                      <span className="text-primary text-3xl lg:text-4xl">Divertida</span><br />
                      <span className="text-lg lg:text-xl">de Importar</span>
                    </h3>
                    <p className="text-primary text-sm lg:text-base mb-6 font-medium">
                      Rápido | Seguro | Eficiente
                    </p>
                    <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Regístrate gratis
                    </button>
                    <p className="text-white text-sm mt-4 opacity-90">
                      ¡Crea tu casillero AHORA mismo!
                    </p>
                  </div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-6 -right-6 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-secondary rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/2 -right-4 w-4 h-4 bg-white rounded-full animate-bounce delay-700"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-secondary rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-primary rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['how-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="how-title"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              ¿Cómo funciona el servicio de
              <span className="block text-primary">Casillero Virtual?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Con tu Casillero Virtual <strong>tendrás una dirección física en Miami</strong> a la que{' '}
              <strong>puedes enviar tus compras en línea</strong> y luego son reenviadas a{' '}
              <strong>tu dirección en Perú.</strong>
            </p>
          </div>

          {/* Interactive Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Steps List */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;
                
                return (
                  <div
                    key={step.id}
                    className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                      isActive 
                        ? 'bg-white shadow-2xl border-2 border-primary' 
                        : 'bg-white/50 hover:bg-white shadow-lg border border-gray-200'
                    }`}
                    onClick={() => setActiveStep(index)}
                    style={{ animationDelay: step.delay }}
                  >
                    {/* Step Number */}
                    <div className="absolute -left-4 -top-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.id}
                    </div>

                    <div className="flex items-start space-x-4 ml-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} shadow-lg transform transition-all duration-300 ${isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Visual Representation */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary/20 rounded-full animate-pulse delay-500"></div>
                </div>

                {/* Miami to Perú Visual */}
                <div className="relative z-10 text-center">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <span className="text-white font-bold text-lg">🇺🇸</span>
                      </div>
                      <p className="font-semibold text-gray-900">Miami, FL</p>
                      <p className="text-sm text-gray-600">Tu casillero</p>
                    </div>

                    {/* Animated Arrow */}
                    <div className="flex-1 relative">
                      <div className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                      <Plane className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 h-8 w-8 text-primary animate-bounce" />
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <span className="text-white font-bold text-lg">🇵🇪</span>
                      </div>
                      <p className="font-semibold text-gray-900">Perú</p>
                      <p className="text-sm text-gray-600">Tu hogar</p>
                    </div>
                  </div>

                  {/* Current Step Display */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      {React.createElement(steps[activeStep].icon, { 
                        className: "h-8 w-8 text-primary" 
                      })}
                      <h4 className="text-xl font-bold text-gray-900">
                        {steps[activeStep].title}
                      </h4>
                    </div>
                    <p className="text-gray-600">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <button className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center mx-auto group">
              <CheckCircle className="mr-3 h-6 w-6" />
              Abrir mi casillero
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['benefits-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="benefits-title"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Beneficios de tu casillero virtual
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Disfruta de todas las ventajas de tener una dirección en Estados Unidos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className={`text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible[`benefit-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  data-animate
                  id={`benefit-${index}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['features-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="features-title"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Características incluidas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para importar de forma fácil y segura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                data-animate
                id={`feature-${index}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to Shop Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-secondary rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-primary rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['shopping-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="shopping-title"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              ¿Dónde comprar con{' '}
              <span className="text-primary">Casillero Virtual?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Compra en las mejores tiendas de Estados Unidos como{' '}
              <strong className="text-primary">Amazon, Macy's, Apple Store, Walmart</strong>{' '}
              y muchas más con tu dirección en Miami, y recibe tus paquetes en{' '}
              <strong className="text-secondary">Perú</strong> rápido, seguro y a bajo costo con{' '}
              <strong className="text-gray-900">FirstClass Casillero Virtual.</strong>
            </p>
          </div>

          {/* Brands Carousel */}
          <div 
            className={`transition-all duration-1000 delay-300 ${isVisible['brands-carousel'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="brands-carousel"
          >
            <BrandsCarousel />
          </div>

          {/* Shopping Categories */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 transition-all duration-1000 delay-600 ${isVisible['shopping-categories'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="shopping-categories"
          >
            {[
              {
                icon: "👗",
                title: "Moda & Accesorios",
                description: "Las últimas tendencias de las mejores marcas",
                brands: "Versace, Armani, Mango"
              },
              {
                icon: "👟",
                title: "Deportes & Calzado",
                description: "Equipos deportivos y calzado original",
                brands: "Nike, Adidas, Reebok"
              },
              {
                icon: "📱",
                title: "Tecnología",
                description: "Los últimos gadgets y electrónicos",
                brands: "Apple, Samsung, Sony"
              },
              {
                icon: "⌚",
                title: "Relojes & Joyería",
                description: "Relojes de lujo y joyería exclusiva",
                brands: "Jomashop, Fossil, Pandora"
              }
            ].map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 hover:border-primary/20"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {category.description}
                </p>
                <p className="text-sm text-primary font-medium">
                  {category.brands}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div 
              className={`transition-all duration-1000 delay-900 ${isVisible['shopping-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              data-animate
              id="shopping-cta"
            >
              <a
                href="/tiendas-disponibles"
                className="inline-flex items-center bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl group"
              >
                <Globe className="mr-3 h-6 w-6" />
                Explorar tiendas disponibles
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <p className="text-gray-500 mt-4 text-lg">
                Más de <strong className="text-primary">10,000 tiendas</strong> disponibles para comprar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Requirements Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-secondary rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-primary rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/4 right-1/4 w-28 h-28 border border-secondary rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['requirements-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="requirements-title"
          >
            <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-full text-primary font-medium mb-6 border border-primary/20">
              <Shield className="mr-2 h-5 w-5" />
              Normativas Aduaneras
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-primary">REQUISITOS POR ENVÍO</span> QUE DEBES CUMPLIR<br />
              <span className="text-2xl lg:text-3xl text-gray-600 font-medium">
                SEGÚN NORMA DE ADUANA
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Por la modalidad de <strong className="text-primary">tráficos postal y envíos urgentes</strong> a{' '}
              <strong className="text-secondary">Perú</strong>
            </p>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Main Requirements */}
            <div className="space-y-6">
              {[
                {
                  icon: DollarSign,
                  title: "Valor Contenido",
                  description: "El contenido de tu envío no debe exceder los 2.000 USD de USA.",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "bg-green-50",
                  iconColor: "text-green-600",
                  borderColor: "border-green-200",
                  limit: "$2,000 USD",
                  delay: "0ms"
                },
                {
                  icon: Package,
                  title: "Peso",
                  description: "El peso máximo por envío es de 110 libras (50 kg).",
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-600",
                  borderColor: "border-blue-200",
                  limit: "110 lbs / 50 kg",
                  delay: "200ms"
                },
                {
                  icon: Truck,
                  title: "Tamaño",
                  description: "El envío no debe sobrepasar 1.50 metros en ninguna de sus dimensiones.",
                  color: "from-purple-500 to-violet-500",
                  bgColor: "bg-purple-50",
                  iconColor: "text-purple-600",
                  borderColor: "border-purple-200",
                  limit: "1.50 metros",
                  delay: "400ms"
                }
              ].map((requirement, index) => {
                const Icon = requirement.icon;
                return (
                  <div
                    key={index}
                    className={`${requirement.bgColor} ${requirement.borderColor} border-2 rounded-2xl p-6 lg:p-8 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl group cursor-pointer ${isVisible[`req-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    data-animate
                    id={`req-${index}`}
                    style={{ animationDelay: requirement.delay }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${requirement.color} shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`text-xl lg:text-2xl font-bold ${requirement.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                            {requirement.title}
                          </h3>
                          <div className={`${requirement.bgColor} ${requirement.borderColor} border px-3 py-1 rounded-full`}>
                            <span className={`text-sm font-bold ${requirement.iconColor}`}>
                              {requirement.limit}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {requirement.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Effect Indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`w-3 h-3 ${requirement.iconColor.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Secondary Requirements */}
            <div className="space-y-6">
              {[
                {
                  icon: Globe,
                  title: "Cantidades",
                  description: "El envío no debe contener más de 6 unidades del mismo tipo.",
                  color: "from-orange-500 to-red-500",
                  bgColor: "bg-orange-50",
                  iconColor: "text-orange-600",
                  borderColor: "border-orange-200",
                  limit: "6 unidades máx",
                  delay: "600ms"
                },
                {
                  icon: Shield,
                  title: "Tipo de Mercancía",
                  description: "No puedes ingresar una serie de mercancías prohibidas por aduana o entidades reguladoras. Consulta con tu asesor.",
                  color: "from-red-500 to-pink-500",
                  bgColor: "bg-red-50",
                  iconColor: "text-red-600",
                  borderColor: "border-red-200",
                  limit: "Consultar",
                  delay: "800ms"
                },
                {
                  icon: Smartphone,
                  title: "Ingreso de teléfono móvil celular a Perú",
                  description: "Se permite importar un solo teléfono por envío a cualquier destinatario, sin envíos fraccionados del mismo proveedor en el mismo medio de transporte, incluso si los destinatarios comparten la misma dirección.",
                  color: "from-indigo-500 to-purple-500",
                  bgColor: "bg-indigo-50",
                  iconColor: "text-indigo-600",
                  borderColor: "border-indigo-200",
                  limit: "1 teléfono",
                  delay: "1000ms",
                  isSpecial: true
                }
              ].map((requirement, index) => {
                const Icon = requirement.icon;
                return (
                  <div
                    key={index + 3}
                    className={`${requirement.bgColor} ${requirement.borderColor} border-2 rounded-2xl p-6 lg:p-8 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl group cursor-pointer relative overflow-hidden ${requirement.isSpecial ? 'lg:col-span-1' : ''} ${isVisible[`req-${index + 3}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    data-animate
                    id={`req-${index + 3}`}
                    style={{ animationDelay: requirement.delay }}
                  >
                    {requirement.isSpecial && (
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        ESPECIAL
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${requirement.color} shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`text-xl lg:text-2xl font-bold ${requirement.iconColor} group-hover:scale-105 transition-transform duration-300 ${requirement.isSpecial ? 'text-base lg:text-lg' : ''}`}>
                            {requirement.title}
                          </h3>
                          <div className={`${requirement.bgColor} ${requirement.borderColor} border px-3 py-1 rounded-full`}>
                            <span className={`text-sm font-bold ${requirement.iconColor}`}>
                              {requirement.limit}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {requirement.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Effect Indicator */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`w-3 h-3 ${requirement.iconColor.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Notice */}
          <div 
            className={`bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20 rounded-2xl p-8 lg:p-12 text-center transition-all duration-1000 delay-1200 ${isVisible['requirements-notice'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="requirements-notice"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary p-4 rounded-full shadow-lg animate-pulse">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              ¿Tienes dudas sobre los requisitos?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Nuestros asesores especializados te ayudarán a verificar que tu envío cumpla con todas las normativas aduaneras de Perú.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center group">
                <MessageCircle className="mr-3 h-6 w-6" />
                Consultar con asesor
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center group">
                <FileText className="mr-3 h-6 w-6" />
                Ver lista completa
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 transition-all duration-1000 delay-1400 ${isVisible['requirements-tips'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="requirements-tips"
          >
            {[
              {
                icon: "💡",
                title: "Tip de Ahorro",
                description: "Consolida múltiples compras para maximizar el límite de $2,000 USD"
              },
              {
                icon: "📋",
                title: "Documentación",
                description: "Guarda todas las facturas de tus compras para el proceso aduanero"
              },
              {
                icon: "⚡",
                title: "Envío Rápido",
                description: "Cumpliendo estos requisitos tu envío llegará en 3-7 días hábiles"
              }
            ].map((tip, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                style={{ animationDelay: `${1600 + index * 200}ms` }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tip.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                  {tip.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/10 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div 
            className={`transition-all duration-1000 ${isVisible['cta-final'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="cta-final"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Únete a miles de Peruanos que ya disfrutan de las mejores compras desde Estados Unidos
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="bg-white hover:bg-gray-100 text-gray-900 px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center group">
                <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
                Abrir mi casillero gratis
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-8 py-5 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex items-center group">
                <Mail className="mr-3 h-6 w-6" />
                Contactar asesor
              </button>
            </div>

            <p className="text-white/80 mt-6 text-lg">
              ✅ Sin costos de apertura • ✅ Sin mensualidades • ✅ Solo pagas cuando envías
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CasilleroVirtual;
