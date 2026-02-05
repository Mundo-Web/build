import React, { useEffect, useState, Suspense, createContext } from "react";
import { createRoot } from 'react-dom/client';
import CreateReactScript from "./Utils/CreateReactScript";
import { Local } from "sode-extend-react";
import Global from "./Utils/Global";
import ItemsRest from "./Actions/ItemsRest";
import SortByAfterField from "./Utils/SortByAfterField";
import { Toaster } from "sonner";

// Componente de animación de scroll
const ScrollAnimation = React.lazy(() => import("./Components/Tailwind/Components/ScrollAnimation"));

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

// Componente de carga ligero para Suspense (debe ser igual al native-loader de public.blade.php)
const LoadingFallback = () => {
    return (
        <div 
            className="fixed inset-0 flex flex-col justify-center items-center z-[999999999] "
            style={{ background: "var(--bg-page-background)" }}
        >
            <style>{`
                @keyframes pulse-loader {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.98); }
                }
            `}</style>
            <div className="relative">
                <div 
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      
                        opacity: 0.05,
                        animation: 'pulse-loader 2s ease-in-out infinite'
                    }}
                />
                <img
                    src="/assets/resources/loading.png"
                    alt="Cargando..."
                    className="relative"
                    style={{ 
                        width: '300px', 
                        maxWidth: '80vw',
                        animation: 'pulse-loader 2s ease-in-out infinite'
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/resources/logo.png';
                       
                    }}
                    loading="eager"
                />
            </div>
         
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

    const getSystem = ({ component, value, data, itemsId, visible, element_id }) => {
        if (visible == 0) return <></>;

        // Incluir element_id en data para que esté disponible en todos los componentes
        const dataWithElementId = { ...data, element_id};
        
        // Configuración de animación desde data (configurable desde admin)
        const animationConfig = {
            animation: data?.scroll_animation || 'fade-up', // Tipo de animación
            duration: parseFloat(data?.scroll_duration) || 0.8,
            delay: parseFloat(data?.scroll_delay) || 0,
            easing: data?.scroll_easing || 'gcigc',
            disabled: data?.scroll_animation === 'none' || data?.scroll_disabled === true
        };
        
        // Componentes que NO deben tener animación de scroll (fixed, floating, etc)
        const noAnimationComponents = ['floating', 'header', 'top_bar', 'footer', 'menu'];
        const shouldAnimate = !noAnimationComponents.includes(component);

        const componentProps = {
            data: dataWithElementId,
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
        
        // Función helper para envolver con animación
        const wrapWithAnimation = (content, customConfig = {}) => {
            if (!shouldAnimate || animationConfig.disabled) {
                return content;
            }
            return (
                <ScrollAnimation
                    animationConfig={{ ...animationConfig, ...customConfig }}
                    key={element_id}
                >
                    {content}
                </ScrollAnimation>
            );
        };

        switch (component) {
            case "top_bar":
                return (
                    <TopBar {...componentProps} data={dataWithElementId} />
                );
            case "header":
                return (
                    <Header {...componentProps} />
                );
            case "menu":
                return <Menu data={dataWithElementId} which={value} items={getItems(itemsId)} cart={cart} setCart={setCart} pages={pages} />
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
                return wrapWithAnimation(<Filter which={value} data={dataWithElementId} items={getItems(itemsId)} filteredData={filteredData} cart={cart} setCart={setCart} setFavorites={setFavorites} favorites={favorites} />);
            case "product":
                return wrapWithAnimation(<Product which={value} data={dataWithElementId} items={getItems(itemsId)} filteredData={filteredData} cart={cart} setCart={setCart} pages={pages} favorites={favorites} generals={generals}
                    setFavorites={setFavorites} contacts={contacts} />);
            case "category":
                return wrapWithAnimation(<Category which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "collection":
                return wrapWithAnimation(<Collection which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "slider":
                return <Slider which={value} data={dataWithElementId} sliders={getItems(itemsId)} generals={generals} />
            case "carrusel":
                return wrapWithAnimation(<Carrusel which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "indicator":
                return wrapWithAnimation(<Indicator which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "banner":
                return wrapWithAnimation(<Banner which={value} data={dataWithElementId} items={getItems(itemsId)} generals={generals} />);
            case "ads":
                return wrapWithAnimation(<Ad which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "image":
                return wrapWithAnimation(<Image which={value} data={dataWithElementId} />);
            case "step":
                return wrapWithAnimation(<Step which={value} data={dataWithElementId} />);
            case 'delivery-zones':
                return wrapWithAnimation(<DeliveryZone which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "product-detail":
                return wrapWithAnimation(<ProductDetail which={value} item={filteredData.Item} cart={cart} setCart={setCart} data={dataWithElementId} generals={generals} favorites={favorites} setFavorites={setFavorites} textstatic={textstatic} contacts={contacts} />);
            case "cart":
                return wrapWithAnimation(<Cart which={value} data={dataWithElementId} cart={cart} setCart={setCart} />);
            case "checkout":
                return <Checkout which={value} data={dataWithElementId} items={getItems(itemsId)} cart={cart} setCart={setCart} isUser={session} prefixes={jsons?.prefixes ?? []} ubigeos={jsons?.ubigeos ?? []} contacts={contacts} generals={generals} categorias={categorias} />
            case "contact":
                return wrapWithAnimation(<Contact which={value} data={dataWithElementId} contacts={contacts} generals={generals} items={getItems(itemsId)} />);
            case "faq":
                return wrapWithAnimation(<Faq which={value} data={dataWithElementId} faqs={faqs} />);
            case "thank":
                return wrapWithAnimation(<ThankSimple which={value} data={dataWithElementId} item={filteredData.Sale} />);
            case "track":
                return wrapWithAnimation(<Track which={value} data={dataWithElementId} />);
            case "blog":
                return wrapWithAnimation(<Blog which={value} data={dataWithElementId} items={getItems(itemsId)} headerPosts={headerPosts} postsLatest={postsLatest} filteredData={filteredData} />);
            case "innovation":
                return wrapWithAnimation(<Innovation which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "service":
                return wrapWithAnimation(<Service which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "service-detail":
                return wrapWithAnimation(<ServiceDetail which={value} data={dataWithElementId} items={getItems(itemsId)} currentService={filteredData.Service ?? null} />);
            case "post-detail":
                return wrapWithAnimation(<PostDetail which={value} data={dataWithElementId} item={filteredData.Post} />);
            case "about":
                return wrapWithAnimation(<AboutUs which={value} data={dataWithElementId} filteredData={filteredData} items={getItems(itemsId)} />);
            case "login":
                return wrapWithAnimation(<Login which={value} data={dataWithElementId} />);
            case "signup":
                return wrapWithAnimation(<Signup which={value} data={dataWithElementId} />);
            case "forgot-password":
                return wrapWithAnimation(<ForgotPassword which={value} data={dataWithElementId} />);
            case "reset-password":
                return wrapWithAnimation(<ResetPassword which={value} data={dataWithElementId} />);
            case "unsubscribe":
                return wrapWithAnimation(<Unsubscribe which={value} data={dataWithElementId} />);
            case "frame":
                return wrapWithAnimation(<Frame which={value} data={dataWithElementId} />);
            case "footer":
                return <Footer {...componentProps} contacts={contacts} generals={generals} stores={stores} />
            case "complaints":
                return wrapWithAnimation(<Complaint which={value} data={dataWithElementId} generals={generals} />);
            case "whistleblowings":
                return wrapWithAnimation(<Whistleblowing which={value} data={dataWithElementId} generals={generals} />);
            case "floating":
                return <Floating which={value} data={dataWithElementId} />
            case "testimonials":
                return wrapWithAnimation(<Testimonials which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "strength":
                return wrapWithAnimation(<Strength which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "benefit":
                return wrapWithAnimation(<Benefit which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "specification":
                return wrapWithAnimation(<Specification which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "application":
                return wrapWithAnimation(<Application which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "brands":
                return wrapWithAnimation(<Brands which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "partner":
                return wrapWithAnimation(<Partner which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "subscription":
                return wrapWithAnimation(<Subscription which={value} data={dataWithElementId} />);
            case "agradecimientos":
                return wrapWithAnimation(<Agradecimientos which={value} data={dataWithElementId} items={getItems(itemsId)} contacts={contacts} />);
            case "support":
                return wrapWithAnimation(<Support which={value} data={dataWithElementId} items={getItems(itemsId)} />);
            case "firstclass":
                return wrapWithAnimation(<FirstClass {...componentProps} />);
            case "store":
                return wrapWithAnimation(<Store {...componentProps} />);
            case "hotel":
                return wrapWithAnimation(<Hotel {...componentProps} filteredData={filteredData} favorites={favorites} setFavorites={setFavorites} />);
            default:
                return <NoComponent which={value} data={dataWithElementId} />
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
            {systemsSorted.map((system) => <React.Fragment key={system.id}>{getSystem(system)}</React.Fragment>)}
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