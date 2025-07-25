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
const AboutUs = React.lazy(() => import("./Components/Tailwind/AboutUs"));
const Login = React.lazy(() => import("./Components/Tailwind/Login"));
const Signup = React.lazy(() => import("./Components/Tailwind/Signup"));
const ForgotPassword = React.lazy(() => import("./Components/Tailwind/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./Components/Tailwind/ResetPassword"));
const Complaint = React.lazy(() => import("./Components/Tailwind/Complaint"));
const Indicator = React.lazy(() => import("./Components/Tailwind/Indicator"));
const ThankSimple = React.lazy(() => import("./Components/Tailwind/Thanks/ThankSimple"));
const Image = React.lazy(() => import("./Components/Tailwind/Image"));
const Track = React.lazy(() => import("./Components/Tailwind/Track"));
const BananaLab = React.lazy(() => import("./Components/Tailwind/BananaLab"));
const Floating = React.lazy(() => import("./Components/Tailwind/Floating"));
const DeliveryZone = React.lazy(() => import("./Components/Tailwind/DeliveryZone"));
const Ad = React.lazy(() => import("./Components/Tailwind/Ad"));
const Testimonials = React.lazy(() => import("./Components/Tailwind/Testimonials"));
const Brands = React.lazy(() => import("./Components/Tailwind/Brands"));
const Partner = React.lazy(() => import("./Components/Tailwind/Partner"));
const Agradecimientos = React.lazy(() => import("./Components/Tailwind/Agradecimientos"));

// Componente de carga para usar con Suspense
const LoadingFallback = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showFallback, setShowFallback] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [progress, setProgress] = useState(10);
    
    useEffect(() => {
        // Detectar mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Simular progreso de carga más realista
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return prev;
                // Progreso más lento al final
                const increment = prev < 50 ? Math.random() * 15 + 5 : Math.random() * 5 + 1;
                return Math.min(prev + increment, 95);
            });
        }, 200);
        
        // Timeout diferenciado para mobile vs desktop
        const timeout = setTimeout(() => {
            setProgress(100);
            setTimeout(() => setShowFallback(false), 300);
        }, isMobile ? 1500 : 2500);
        
        return () => {
            clearTimeout(timeout);
            clearInterval(progressInterval);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);
    
    // Si ya no mostrar fallback, hacer transición suave manteniendo la barra de progreso
    if (!showFallback) {
        return (
            <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/95 backdrop-blur-sm z-50">
                <div className="animate-bounce">
                    <img
                        src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                        alt={Global.APP_NAME}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/img/logo-bk.svg";
                        }}
                        className={`${
                            isMobile ? 'w-36' : 'w-48 lg:w-64'
                        } transition-all duration-300 opacity-50`}
                        loading="eager"
                        decoding="async"
                    />
                </div>
                
                {/* Mantener barra de progreso pero más sutil */}
                <div className={`mt-4 bg-gray-200 rounded-full h-1 ${
                    isMobile ? 'w-32' : 'w-48'
                }`}>
                    <div 
                        className="bg-primary h-1 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress + 5, 100)}%` }}
                    ></div>
                </div>
                
               
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/95 backdrop-blur-sm z-50">
            <div className="animate-bounce">
                <img
                    src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                    alt={Global.APP_NAME}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/img/logo-bk.svg";
                    }}
                    onLoad={() => {
                        setIsLoaded(true);
                        // En mobile, ocultar más rápido una vez cargado
                        if (isMobile) {
                            setTimeout(() => setShowFallback(false), 300);
                        }
                    }}
                    className={`${
                        isMobile ? 'w-32 sm:w-48' : 'w-64 lg:w-96'
                    } transition-all duration-300 transform hover:scale-105 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="eager"
                    decoding="async"
                />
            </div>
            
            {/* Spinner de respaldo si la imagen no carga */}
            {!isLoaded && (
                <div className={`animate-spin rounded-full border-b-2 border-primary mt-4 ${
                    isMobile ? 'h-8 w-8' : 'h-12 w-12'
                }`}></div>
            )}
            
            {/* Indicador de progreso mejorado */}
            {isMobile && (
                <div className="mt-4 w-32 bg-gray-200 rounded-full h-1.5">
                    <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                            width: `${Math.max(progress, 10)}%`
                        }}
                    ></div>
                </div>
            )}
            
            {/* Barra de progreso para desktop también */}
            {!isMobile && (
                <div className="mt-6 w-48 bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                            width: `${Math.max(progress, 10)}%`
                        }}
                    ></div>
                </div>
            )}
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
        itemsRest.verifyStock(cart.map((x) => x.id)).then((items) => {
            const newCart = items.map((item) => {
                const found = cart.find((x) => x.id == item.id);
                if (!found) return;
                found.price = item.price;
                found.discount = item.discount;
                found.name = item.name;
                return found;
            });
            setCart(newCart);
        });
    }, [null]);

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
            contacts
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
                return <Filter which={value} data={data} items={getItems(itemsId)} filteredData={filteredData} cart={cart} setCart={setCart} />
            case "product":
                return <Product which={value} data={data} items={getItems(itemsId)} filteredData={filteredData} cart={cart} setCart={setCart} pages={pages} favorites={favorites}
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
                return <Banner which={value} data={data} items={getItems(itemsId)} />
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
                return <Checkout which={value} data={data} items={getItems(itemsId)} cart={cart} setCart={setCart} isUser={session} prefixes={jsons?.prefixes ?? []} ubigeos={jsons?.ubigeos ?? []} contacts={contacts} generals={generals} />
            case "contact":
                return <Contact which={value} data={data} contacts={contacts} />
            case "faq":
                return <Faq which={value} data={data} faqs={faqs} />
            case "thank":
                return <ThankSimple which={value} data={data} item={filteredData.Sale} />
            case "track":
                return <Track which={value} data={data} />
            case "blog":
                return <Blog which={value} data={data} items={getItems(itemsId)} headerPosts={headerPosts} postsLatest={postsLatest} filteredData={filteredData} />
            case "post-detail":
                return <PostDetail which={value} data={data} item={filteredData.Post} />
            case "about":
                return <AboutUs which={value} data={data} filteredData={filteredData} items={getItems(itemsId)}/>
            case "login":
                return <Login which={value} data={data} />
            case "signup":
                return <Signup which={value} data={data} />
            case "forgot-password":
                return <ForgotPassword which={value} data={data} />
            case "reset-password":
                return <ResetPassword which={value} data={data} />
            case "frame":
                return <Frame which={value} data={data} />
            case "footer":
                return <Footer {...componentProps} contacts={contacts} generals={generals} data={data} stores={stores} />
            case "complaints":
                return <Complaint which={value} data={data} generals={generals} />
            case "floating":
                return <Floating which={value} data={data} />
            case "testimonials":
                return <Testimonials which={value} data={data} items={getItems(itemsId)} />
            case "brands":
                return <Brands which={value} data={data} items={getItems(itemsId)} />
            case "partner":
                return <Partner which={value} data={data} items={getItems(itemsId)} />
            case "agradecimientos":
                return <Agradecimientos which={value} data={data} items={getItems(itemsId)} contacts={contacts} />
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