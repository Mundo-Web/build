import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { CircleCheckBig, X, Server } from "lucide-react";
import { toast } from "sonner";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import General from "../../../Utils/General";

const FooterHostinfinity = ({ pages = [], generals = [], data, socials = [] }) => {
    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();
    const currentYear = new Date().getFullYear();

    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState(false);

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",
        saleback_policy: "Políticas de devolución",
    };

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

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

    // Obtener información de generals
    const footerDescription = generals.find(g => g.correlative === 'footer_description')?.description || 'Soluciones de alojamiento premium para negocios modernos.';
    
    // Obtener enlaces de productos desde data
    const productLinks = (() => {
        try {
            const links = data?.product_links;
            return links ? JSON.parse(links) : [];
        } catch {
            return [];
        }
    })();

    // Obtener enlaces de soporte desde data
    const supportLinks = (() => {
        try {
            const links = data?.support_links;
            return links ? JSON.parse(links) : [];
        } catch {
            return [];
        }
    })();

    // Obtener información de contacto de generals
    const phone = generals.find(g => g.correlative === 'phone_contact')?.description || '';
    const email = generals.find(g => g.correlative === 'email_contact')?.description || '';
    const address = generals.find(g => g.correlative === 'address')?.description || '';
    const ruc = generals.find(g => g.correlative === 'ruc')?.description || '';

    return (
        <footer 
            id={data?.element_id || null} 
            className={`border-t border-white/10 backdrop-blur-xl bg-primary ${data?.class || ''}`}
        >
            <div className="2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Logo y descripción */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                       
                                <img 
                                    src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`} 
                                    alt={Global.APP_NAME} 
                                    className="h-16 object-contain" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/img/logo-bk.svg';
                                    }} 
                                />
                           
                        </div>
                        <p className="text-neutral-light text-lg mb-4 leading-relaxed">
                            {footerDescription}
                        </p>
                        <p className="text-neutral-light text-sm">
                            {ruc && <>{data?.ruc_label || 'RUC'}: {ruc}<br /></>}
                            {address && <>{data?.address_label || 'Dirección'}: {address}<br /></>}
                            {email && <>{data?.email_label || 'Email'}: {email}<br /></>}
                            {phone && <>{data?.phone_label || 'Teléfono'}: {phone}</>}
                        </p>
                    </div>

                    {/* Productos */}
                    <div>
                        <h4 className="text-white font-bold mb-4 tracking-tight">
                            {data?.products_title || 'Productos'}
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {productLinks.length > 0 ? (
                                productLinks.map((link, index) => (
                                    <li key={index}>
                                        <a 
                                            href={link.url} 
                                            className="text-white/60 hover:text-secondary transition-all duration-200"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                pages.filter(p => p.menuable).slice(0, 4).map((page, index) => (
                                    <li key={index}>
                                        <a 
                                            href={page.path} 
                                            className="text-white/60 hover:text-secondary transition-all duration-200"
                                        >
                                            {page.name}
                                        </a>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Soporte */}
                    <div>
                        <h4 className="text-white font-bold mb-4 tracking-tight">
                            {data?.support_title || 'Soporte'}
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {supportLinks.length > 0 ? (
                                supportLinks.map((link, index) => (
                                    <li key={index}>
                                        <a 
                                            href={link.url} 
                                            className="text-white/60 hover:text-secondary transition-all duration-200"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li>
                                        <a href="/contacto" className="text-white/60 hover:text-secondary transition-all duration-200">
                                            Centro de Ayuda
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/contacto" className="text-white/60 hover:text-secondary transition-all duration-200">
                                            Contacto
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-4 tracking-tight">
                            {data?.legal_title || 'Legal'}
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button 
                                    onClick={() => openModal(1)}
                                    className="text-white/60 hover:text-secondary transition-all duration-200 text-left"
                                >
                                    {data?.terms_text || 'Términos y Condiciones'}
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => openModal(0)}
                                    className="text-white/60 hover:text-secondary transition-all duration-200 text-left"
                                >
                                    {data?.privacy_text || 'Política de Privacidad'}
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => openModal(2)}
                                    className="text-white/60 hover:text-secondary transition-all duration-200 text-left"
                                >
                                    {data?.returns_text || 'Política de Devoluciones'}
                                </button>
                            </li>
                            <li>
                                <a 
                                    href="/libro-reclamaciones" 
                                    className="text-secondary hover:text-secondary/80 transition-all duration-200 font-semibold"
                                >
                                    {data?.complaints_text || 'Libro de Reclamaciones'}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-white/60 text-sm text-center md:text-left">
                            {General.get('copyright') || `© ${currentYear} ${Global.APP_NAME}. Todos los derechos reservados.`}
                        </p>
                        <div className="flex items-center space-x-4">
                            {socials.map((social, index) => (
                                <a 
                                    key={index}
                                    href={social.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-white/60 hover:text-white transition-colors duration-200 text-xl"
                                    aria-label={social.name}
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
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
                                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
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
                                    className="px-6 py-2 bg-secondary text-white rounded-lg transition-colors duration-200 font-medium hover:bg-secondary/90"
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

export default FooterHostinfinity;
