import React, { useRef, useState, useEffect } from "react";
import ReactModal from "react-modal";
import Tippy from "@tippyjs/react";
import { CircleCheckBig, X, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";

const FooterPanelPro = ({ pages = [], generals = [], data, socials = [] }) => {
    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();
    const currentYear = new Date().getFullYear();

    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",
    };

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    // Fetch productos desde la API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/items/paginate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        skip: 0,
                        take: 6,
                        status: 1,
                        requireTotalCount: false
                    })
                });
                const result = await response.json();
                console.log('API Response:', result); // Para debug
                if (result.status === 200 && result.data) {
                    setProducts(result.data);
                }
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const request = {
            email: emailRef.current.value,
            status: 1,
        };
        const result = await subscriptionsRest.save(request);
        setSaving(false);

        if (!result) return;

        toast.success("¡Suscrito!", {
            description: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: <CircleCheckBig className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: "top-center",
        });

        emailRef.current.value = null;
    };

    // Función para scroll suave personalizado con animación más lenta
    const smoothScrollTo = (targetElement, duration = 1200) => {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80; // Offset de 80px desde el top
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Función de easing para suavizar la animación (ease-in-out)
            const easing = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easing);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    // Obtener información de generals
    const footerDescription = generals.find(g => g.correlative === 'footer_description')?.description || '';
    
    // Obtener enlaces de empresa desde generals (array) - solo visibles
    const companyLinks = (() => {
        try {
            const links = generals.find(g => g.correlative === 'footer_company_links')?.description;
            const parsed = links ? JSON.parse(links) : [];
            // Filtrar solo los enlaces visibles
            return parsed.filter(link => link.visible !== false);
        } catch {
            return [];
        }
    })();

    // Obtener información de contacto de generals
    const phone = generals.find(g => g.correlative === 'phone_contact')?.description || '';
    const email = generals.find(g => g.correlative === 'email_contact')?.description || '';
    const address = generals.find(g => g.correlative === 'address')?.description || '';
    const openingHours = generals.find(g => g.correlative === 'opening_hours')?.description || '';

    return (
        <footer className="bg-primary text-white">
            <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Logo y Redes Sociales */}
                    <div className="md:col-span-2 lg:col-span-2 w-8/12">
                        <div className="flex items-center gap-2 mb-4 ">
                            {data?.logo_footer ? (
                                <img 
                                    src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`} 
                                    alt={Global.APP_NAME} 
                                    className="h-12 object-contain" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/img/logo-bk.svg';
                                    }} 
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-wood-400 to-wood-600 rounded-lg"></div>
                                    <h3 className="text-xl font-bold">{Global.APP_NAME}</h3>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            {footerDescription || `Líderes en distribución de productos de alta calidad para profesionales que exigen lo mejor.`}
                        </p>
                        <div className="flex gap-3">
                            {socials.map((social, index) => (
                                <Tippy key={index} content={`Ver ${social.name} en ${social.description}`}>
                                    <a
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-base"
                                    >
                                        <i className={social.icon}></i>
                                    </a>
                                </Tippy>
                            ))}
                        </div>
                    </div>
                  

                    {/* Columna Productos */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">{data?.products_title || 'Productos'}</h4>
                        {loadingProducts ? (
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-4 bg-white/10 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <ul className="space-y-2 text-gray-300">
                                {products.map((product) => (
                                    <li key={product.id}>
                                        <a 
                                           href={`#`}
                                            className="hover:text-wood-300 transition-colors line-clamp-1"
                                            title={product.name}
                                        >
                                            {product.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-white text-sm">No hay productos disponibles</p>
                        )}
                    </div>

                    {/* Columna Empresa con Contactos */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">{data?.company_title || 'Empresa'}</h4>
                        
                        {/* Enlaces de Empresa */}
                        {companyLinks.length > 0 && (
                            <ul className="space-y-2 text-gray-300 mb-6">
                                {companyLinks.map((link, index) => (
                                    <li key={index}>
                                        <a 
                                            href={link.href || '#'} 
                                            className="hover:text-wood-300 transition-colors"
                                            onClick={(e) => {
                                                const href = link.href || '#';
                                                // Si el enlace contiene un hash (#), hacer scroll suave
                                                if (href.includes('#')) {
                                                    e.preventDefault();
                                                    const hashIndex = href.indexOf('#');
                                                    const targetId = href.substring(hashIndex + 1);
                                                    const targetElement = document.getElementById(targetId);
                                                    
                                                    if (targetElement) {
                                                        // Usar scroll personalizado más suave y lento
                                                        smoothScrollTo(targetElement, 1200);
                                                        
                                                        // Actualizar URL después de un pequeño delay
                                                        setTimeout(() => {
                                                            window.history.pushState(null, '', href);
                                                        }, 100);
                                                    }
                                                }
                                            }}
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}

                    
                    </div>

                    {/* Columna Ubicación y Horarios */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">{data?.contact_title || 'Ubicación'}</h4>
                        <ul className="space-y-3 text-gray-300">
                                {/* Email */}
                        {email && (
                            <div className="mb-4">
                                <div className="flex items-start gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-wood-300 flex-shrink-0 mt-1" />
                                    <div className="text-sm">
                                
                                        <div className="text-gray-300">
                                            {(() => {
                                                if (email.includes(',')) {
                                                    return email.split(',').map((em, index) => (
                                                        <div key={index} className="block">
                                                            {em.trim()}
                                                        </div>
                                                    ));
                                                }
                                                return email;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Teléfono */}
                        {phone && (
                            <div className="mb-4">
                                <div className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 text-wood-300 flex-shrink-0 mt-1" />
                                    <div className="text-sm">
                                       
                                        <div className="text-gray-300">
                                            {(() => {
                                                if (phone.includes(',')) {
                                                    return phone.split(',').map((ph, index) => (
                                                        <div key={index} className="block">
                                                            {ph.trim()}
                                                        </div>
                                                    ));
                                                }
                                                return phone;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                            {address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-wood-300 flex-shrink-0 mt-0.5" />
                                    <div>
                                      
                                        <div className="text-sm whitespace-pre-line">{address}</div>
                                    </div>
                                </li>
                            )}
                            {openingHours && (
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-wood-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                      
                                        <div className="text-sm whitespace-pre-line">{openingHours}</div>
                                    </div>
                                </li>
                            )}
                        </ul>

                        {/* Newsletter opcional */}
                        {data?.show_newsletter && (
                            <div className="mt-6">
                                <h4 className="text-sm font-bold mb-2">{data?.newsletter_title || 'Suscríbete al blog'}</h4>
                                <form onSubmit={onEmailSubmit}>
                                    <div className="flex gap-2">
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            placeholder={data?.newsletter_placeholder || 'Tu email'}
                                            className="flex-1 px-3 py-2 text-sm text-neutral-dark rounded-lg focus:ring-2 focus:ring-wood-300 focus:outline-none"
                                            disabled={saving}
                                            required
                                        />
                                        <button
                                            disabled={saving}
                                            className="px-4 py-2 bg-wood-400 hover:bg-wood-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                                            aria-label="Suscribirse"
                                        >
                                            {saving ? (data?.newsletter_sending || '...') : (data?.newsletter_button || 'Enviar')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white text-md">
                            {data?.copyright || `© ${currentYear} ${Global.APP_NAME}. Todos los derechos reservados.`}
                             <span className="italic">  Powered by  <a href="https://www.mundoweb.pe" target="_blank" rel="noopener noreferrer">MundoWeb</a></span>
                        </p>
                        <div className="flex flex-wrap gap-4 md:gap-6 text-md text-white justify-center">
                            <a 
                                onClick={() => openModal(0)}
                                className="hover:text-wood-300 transition-colors cursor-pointer"
                            >
                                {data?.privacy_text || 'Política de Privacidad'}
                            </a>
                            <a 
                                onClick={() => openModal(1)}
                                className="hover:text-wood-300 transition-colors cursor-pointer"
                            >
                                {data?.terms_text || 'Términos y Condiciones'}
                            </a>
                            <a
                                href="/libro-reclamaciones"
                                className="hover:text-wood-300 transition-colors hidden"
                            >
                                {data?.complaints_text || 'Libro de reclamaciones'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modales de Políticas */}
            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content = generals.find((x) => x.correlative === key)?.description ?? "";

                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[99999]"
                        ariaHideApp={false}
                    >
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 pr-4">{title}</h2>
                                <button
                                    onClick={closeModal}
                                    className="flex-shrink-0 text-white hover:text-red-500 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                                    aria-label="Cerrar modal"
                                >
                                    <X size={24} strokeWidth={2} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-gray max-w-none">
                                    <HtmlContent html={content} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end p-6 border-t border-gray-200">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-primary text-white rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </ReactModal>
                );
            })}
        </footer>
    );
};

export default FooterPanelPro;
