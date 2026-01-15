import React, { useEffect, useState, Suspense, createContext } from "react";
import { createRoot } from 'react-dom/client';
import CreateReactScript from "./Utils/CreateReactScript";
import { Local } from "sode-extend-react";
import Global from "./Utils/Global";
import ItemsRest from "./Actions/ItemsRest";
import SortByAfterField from "./Utils/SortByAfterField";
import { Toaster } from "sonner";

// Importaciones lazy
const NoComponent = React.lazy(() => import("./NoComponent"));
const TopBar = React.lazy(() => import("./Components/Tailwind/TopBar"));
const Header = React.lazy(() => import("./Components/Tailwind/Header"));
const Footer = React.lazy(() => import("./Components/Tailwind/Footer"));
const Slider = React.lazy(() => import("./Components/Tailwind/Slider"));
const Product = React.lazy(() => import("./Components/Tailwind/Product"));
const Banner = React.lazy(() => import("./Components/Tailwind/Banner"));
const Category = React.lazy(() => import("./Components/Tailwind/Category"));
const Collection = React.lazy(() => import("./Components/Tailwind/Collection"));
const Cart = React.lazy(() => import("./Components/Tailwind/Cart"));
const Step = React.lazy(() => import("./Components/Tailwind/Step"));
const Filter = React.lazy(() => import("./Components/Tailwind/Filter"));
const ProductDetail = React.lazy(() => import("./Components/Tailwind/ProductDetail"));
const Contact = React.lazy(() => import("./Components/Tailwind/Contact"));
const Frame = React.lazy(() => import("./Components/Tailwind/Frame"));
const Checkout = React.lazy(() => import("./Components/Tailwind/Checkout"));
const Menu = React.lazy(() => import("./Components/Tailwind/Menu"));
const Carrusel = React.lazy(() => import("./Components/Tailwind/Carrusel"));
const Faq = React.lazy(() => import("./Components/Tailwind/Faq"));
const PostDetail = React.lazy(() => import("./Components/Tailwind/PostDetail"));
const Blog = React.lazy(() => import("./Components/Tailwind/Blog"));
const Innovation = React.lazy(() => import("./Components/Tailwind/Innovation"));
const Service = React.lazy(() => import("./Components/Tailwind/Service"));
const ServiceDetail = React.lazy(() => import("./Components/Tailwind/ServiceDetail"));
const AboutUs = React.lazy(() => import("./Components/Tailwind/AboutUs"));
const Login = React.lazy(() => import("./Components/Tailwind/Login"));
const Signup = React.lazy(() => import("./Components/Tailwind/Signup"));
const ForgotPassword = React.lazy(() => import("./Components/Tailwind/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./Components/Tailwind/ResetPassword"));
const Unsubscribe = React.lazy(() => import("./Components/Tailwind/Unsubscribe"));
const Complaint = React.lazy(() => import("./Components/Tailwind/Complaint"));
const Whistleblowing = React.lazy(() => import("./Components/Tailwind/Whistleblowing"));
const Indicator = React.lazy(() => import("./Components/Tailwind/Indicator"));
const ThankSimple = React.lazy(() => import("./Components/Tailwind/Thanks/ThankSimple"));
const Image = React.lazy(() => import("./Components/Tailwind/Image"));
const Track = React.lazy(() => import("./Components/Tailwind/Track"));
const BananaLab = React.lazy(() => import("./Components/Tailwind/BananaLab"));
const Floating = React.lazy(() => import("./Components/Tailwind/Floating"));
const DeliveryZone = React.lazy(() => import("./Components/Tailwind/DeliveryZone"));
const Ad = React.lazy(() => import("./Components/Tailwind/Ad"));
const Testimonials = React.lazy(() => import("./Components/Tailwind/Testimonials"));
const Strength = React.lazy(() => import("./Components/Tailwind/Strength"));
const Benefit = React.lazy(() => import("./Components/Tailwind/Benefit"));
const Specification = React.lazy(() => import("./Components/Tailwind/Specification"));
const Application = React.lazy(() => import("./Components/Tailwind/Application"));
const Brands = React.lazy(() => import("./Components/Tailwind/Brands"));
const Partner = React.lazy(() => import("./Components/Tailwind/Partner"));
const Subscription = React.lazy(() => import("./Components/Tailwind/Subscription"));
const Agradecimientos = React.lazy(() => import("./Components/Tailwind/Agradecimientos"));
const Support = React.lazy(() => import("./Components/Tailwind/Support"));
const FirstClass = React.lazy(() => import("./Components/Tailwind/FirstClass"));
const Store = React.lazy(() => import("./Components/Tailwind/Store"));
const Hotel = React.lazy(() => import("./Components/Tailwind/Hotel"));

// Componente de carga profesional para usar con Suspense
const LoadingFallback = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showFallback, setShowFallback] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Cargando');
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Detectar mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Animación de puntos en "Cargando..."
        const textInterval = setInterval(() => {
            setLoadingText(prev => {
                const dots = (prev.match(/\./g) || []).length;
                return dots >= 3 ? 'Cargando' : prev + '.';
            });
        }, 400);

        // Progreso suave y realista
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return prev;
                // Progreso más rápido al inicio, más lento al final
                const increment = prev < 30 ? Math.random() * 20 + 10 
                    : prev < 70 ? Math.random() * 10 + 5 
                    : Math.random() * 3 + 1;
                return Math.min(prev + increment, 95);
            });
        }, 300);

        // Timeout diferenciado para mobile vs desktop
        const timeout = setTimeout(() => {
            setProgress(100);
            setFadeOut(true);
            setTimeout(() => setShowFallback(false), 600);
        }, isMobile ? 1200 : 2000);

        return () => {
            clearTimeout(timeout);
            clearInterval(progressInterval);
            clearInterval(textInterval);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    // Renderizado con fade-out elegante
    const containerClasses = `fixed inset-0 flex flex-col justify-center items-center z-50 transition-all duration-600 ${
        fadeOut 
            ? 'opacity-0 scale-95' 
            : 'opacity-100 scale-100'
    }`;

    const backgroundClasses = `absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white ${
        fadeOut ? 'backdrop-blur-none' : 'backdrop-blur-sm'
    }`;

    if (!showFallback) return null;

    return (
        <div className={containerClasses}>
            {/* Background con gradiente */}
            <div className={backgroundClasses}></div>
            
            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo con animación pulse suave */}
                <div className="relative">
                    {/* Círculo de fondo animado */}
                    <div className="absolute inset-0 -m-8 rounded-full bg-primary/5 animate-pulse"></div>
                    
                    <img
                        src={`/assets/resources/loading.png?v=${crypto.randomUUID()}`}
                        alt={Global.APP_NAME}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/resources/logo.png";
                        }}
                        onLoad={() => setIsLoaded(true)}
                        className={`relative ${
                            isMobile ? 'w-40 sm:w-52' : 'w-64 lg:w-80'
                        } transition-all duration-700 ease-out ${
                            isLoaded 
                                ? 'opacity-100 scale-100' 
                                : 'opacity-0 scale-90'
                        } ${!fadeOut && 'animate-pulse'}`}
                        style={{
                            filter: fadeOut ? 'blur(4px)' : 'blur(0px)',
                            animationDuration: '2s'
                        }}
                        loading="eager"
                        decoding="async"
                    />
                </div>

                {/* Texto "Cargando..." */}
                <div className={`mt-8 text-center transition-opacity duration-500 ${
                    fadeOut ? 'opacity-0' : 'opacity-100'
                }`}>
                    <p className={`font-medium text-gray-700 ${
                        isMobile ? 'text-base' : 'text-lg'
                    }`}>
                        {loadingText}
                    </p>
                </div>

                {/* Barra de progreso moderna con gradiente */}
                <div className={`mt-6 ${
                    isMobile ? 'w-48' : 'w-72'
                } transition-all duration-500 ${
                    fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}>
                    {/* Contenedor de la barra */}
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        {/* Barra de progreso con gradiente */}
                        <div
                            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${progress}%`,
                              
                            }}
                        >
                            {/* Efecto de brillo animado */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                                style={{
                                    animation: 'shimmer 2s infinite'
                                }}
                            ></div>
                        </div>
                    </div>
                    
                    {/* Porcentaje */}
                    <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500 font-medium">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Spinner de respaldo si la imagen no carga */}
                {!isLoaded && (
                    <div className="mt-4">
                        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${
                            isMobile ? 'h-8 w-8' : 'h-10 w-10'
                        }`}></div>
                    </div>
                )}
            </div>

            {/* Estilos inline para animación de shimmer */}
            <style>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

const itemsRest = new ItemsRest();

export const SystemContext = createContext({});

const System = ({
    session,
    page,
    isUser,
    pages,
    params,
    jsons,
    filteredData = {},
    systems,
    generals = [],
    systemItems = {},
    contacts,
    faqs,
    headerPosts,
    stores,
    postsLatest,
    textstatic,
    categorias,
    hasRole = () => { }
}) => {

    const getItems = (itemsId) => {
        return systemItems[itemsId] ?? [];
    };

    const [cart, setCart] = useState(
        Local.get(`${Global.APP_CORRELATIVE}_cart`) ?? []
    );

    useEffect(() => {
        Local.set(`${Global.APP_CORRELATIVE}_cart`, cart);
    }, [cart]);

    const [favorites, setFavorites] = useState(
        Local.get(`${Global.APP_CORRELATIVE}_favorites`) ?? []
    );

    useEffect(() => {
        Local.set(`${Global.APP_CORRELATIVE}_favorites`, favorites);
    }, [favorites]);

    useEffect(() => {
        // Separar combos de productos normales
        const regularItems = cart.filter(x => x.type !== 'combo');
        const combos = cart.filter(x => x.type === 'combo');

        if (regularItems.length > 0) {
            itemsRest.verifyStock(regularItems.map((x) => x.id)).then((items) => {
                const verifiedRegularItems = items.map((item) => {
                    const found = regularItems.find((x) => x.id == item.id);
                    if (!found) return;
                    found.price = item.price;
                    found.discount = item.discount;
                    found.name = item.name;
                    return found;
                }).filter(Boolean); // Filtrar undefined/null

                // Combinar productos verificados con combos sin modificar
                const newCart = [...verifiedRegularItems, ...combos];



                setCart(newCart);
            });
        } else if (combos.length > 0) {
            // Si solo hay combos, mantenerlos sin verificación
        }
    }, []);

    // Preload crítico para mobile
    useEffect(() => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Preload componentes críticos solo en mobile
            const criticalComponents = ['Header', 'Footer', 'Product', 'Cart'];

            criticalComponents.forEach(component => {
                import(`./Components/Tailwind/${component}.jsx`).catch(() => {
                    // Silenciar errores de preload
                });
            });
        }
    }, []);

    const getSystem = ({ component, value, data, itemsId, visible }) => {
        if (visible == 0) return <></>;

        const componentProps = {
            data,
            which: value,
            items: getItems(itemsId),
            cart,
            setCart,
            pages,
            isUser: session,
            generals,
            stores,
            headerPosts,
            contacts,
            categorias
        };

        switch (component) {
            case "top_bar":
                return (
                    <TopBar {...componentProps} data={data} />
                );
            case "header":
                return (
                    <Header {...componentProps} />
                );
            case "menu":
                return <Menu data={data} which={value} items={getItems(itemsId)} cart={cart} setCart={setCart} pages={pages} />
            case "content":
                if (!page.id) {
                    return null
                    return <div className="h-80 w-full bg-gray-300 flex items-center justify-center">
                        <div>- Tu contenido aquí -</div>
                    </div>
                } else if (page.extends_base) {
                    const contentSystems = SortByAfterField(systems).filter(
                        (x) => Boolean(x.page_id)
                    );
                    return contentSystems.map((content) => getSystem(content));
                }
                break;
            case "filter":
                return <Filter which={value} data={data} items={getItems(itemsId)} filteredData={filteredData} cart={cart} setCart={setCart} setFavorites={setFavorites} favorites={favorites} />
            case "product":
                return <Product which={value} data={data} items={getItems(itemsId)} filteredData={filteredData} cart={cart} setCart={setCart} pages={pages} favorites={favorites} generals={generals}
                    setFavorites={setFavorites} contacts={contacts} />
            case "category":
                return <Category which={value} data={data} items={getItems(itemsId)} />
            case "collection":
                return <Collection which={value} data={data} items={getItems(itemsId)} />
            case "slider":
                return <Slider which={value} data={data} sliders={getItems(itemsId)} generals={generals} />
            case "carrusel":
                return <Carrusel which={value} data={data} items={getItems(itemsId)} />
            case "indicator":
                return <Indicator which={value} data={data} items={getItems(itemsId)} />
            case "banner":
                return <Banner which={value} data={data} items={getItems(itemsId)} generals={generals} />
            case "ads":
                return <Ad which={value} data={data} items={getItems(itemsId)} />
            case "image":
                return <Image which={value} data={data} />
            case "step":
                return <Step which={value} data={data} />
            case 'delivery-zones':
                return <DeliveryZone which={value} data={data} items={getItems(itemsId)} />
            case "product-detail":
                return <ProductDetail which={value} item={filteredData.Item} cart={cart} setCart={setCart} data={data} generals={generals} favorites={favorites} setFavorites={setFavorites} textstatic={textstatic} contacts={contacts} />
            case "cart":
                return <Cart which={value} data={data} cart={cart} setCart={setCart} />
            case "checkout":
                return <Checkout which={value} data={data} items={getItems(itemsId)} cart={cart} setCart={setCart} isUser={session} prefixes={jsons?.prefixes ?? []} ubigeos={jsons?.ubigeos ?? []} contacts={contacts} generals={generals} categorias={categorias} />
            case "contact":
                return <Contact which={value} data={data} contacts={contacts} generals={generals} items={getItems(itemsId)} />
            case "faq":
                return <Faq which={value} data={data} faqs={faqs} />
            case "thank":
                return <ThankSimple which={value} data={data} item={filteredData.Sale} />
            case "track":
                return <Track which={value} data={data} />
            case "blog":
                return <Blog which={value} data={data} items={getItems(itemsId)} headerPosts={headerPosts} postsLatest={postsLatest} filteredData={filteredData} />
            case "innovation":
                return <Innovation which={value} data={data} items={getItems(itemsId)} />
            case "service":
                return <Service which={value} data={data} items={getItems(itemsId)} />
            case "service-detail":
                return <ServiceDetail which={value} data={data} items={getItems(itemsId)} currentService={filteredData.Service ?? null} />
            case "post-detail":
                return <PostDetail which={value} data={data} item={filteredData.Post} />
            case "about":
                return <AboutUs which={value} data={data} filteredData={filteredData} items={getItems(itemsId)} />
            case "login":
                return <Login which={value} data={data} />
            case "signup":
                return <Signup which={value} data={data} />
            case "forgot-password":
                return <ForgotPassword which={value} data={data} />
            case "reset-password":
                return <ResetPassword which={value} data={data} />
            case "unsubscribe":
                return <Unsubscribe which={value} data={data} />
            case "frame":
                return <Frame which={value} data={data} />
            case "footer":
                return <Footer {...componentProps} contacts={contacts} generals={generals} data={data} stores={stores} />
            case "complaints":
                return <Complaint which={value} data={data} generals={generals} />
            case "whistleblowings":
                return <Whistleblowing which={value} data={data} generals={generals} />
            case "floating":
                return <Floating which={value} data={data} />
            case "testimonials":
                return <Testimonials which={value} data={data} items={getItems(itemsId)} />
            case "strength":
                return <Strength which={value} data={data} items={getItems(itemsId)} />
            case "benefit":
                return <Benefit which={value} data={data} items={getItems(itemsId)} />
            case "specification":
                return <Specification which={value} data={data} items={getItems(itemsId)} />
            case "application":
                return <Application which={value} data={data} items={getItems(itemsId)} />
            case "brands":
                return <Brands which={value} data={data} items={getItems(itemsId)} />
            case "partner":
                return <Partner which={value} data={data} items={getItems(itemsId)} />
            case "subscription":
                return <Subscription which={value} data={data} />
            case "agradecimientos":
                return <Agradecimientos which={value} data={data} items={getItems(itemsId)} contacts={contacts} />
            case "support":
                return <Support which={value} data={data} items={getItems(itemsId)} />
            case "firstclass":
                return <FirstClass {...componentProps} />
            case "store":
                return <Store {...componentProps} />
            case "hotel":
                return <Hotel {...componentProps} filteredData={filteredData} favorites={favorites} setFavorites={setFavorites} />
            default:
                return <NoComponent which={value} />
        }
    };

    const systemsSorted = SortByAfterField(systems).filter((x) =>
        page.extends_base ? !x.page_id : true
    );

    return (
        // <SystemContext.Provider value={{
        //     hasRole
        // }}>
        <main className="font-paragraph">
            {systemsSorted.map((system) => getSystem(system))}
            <Toaster />
        </main>
        // </SystemContext.Provider>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <Suspense fallback={<LoadingFallback />}>
            <System {...properties} />
        </Suspense>
    );
});