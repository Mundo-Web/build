import React, { useRef, useState, useEffect } from "react";
import ReactModal from "react-modal";
import Tippy from "@tippyjs/react";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import SocialsRest from "../../../Actions/SocialsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import { CircleCheckBig, X } from "lucide-react";
import { toast } from "sonner";

const FooterLaPetaca = ({ pages, generals, data, items = [] }) => {
    console.log("FooterLaPetaca items:", items);
    const subscriptionsRest = new SubscriptionsRest();
    const socialsRest = new SocialsRest();
    const emailRef = useRef();

    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState(false);
    const [socials, setSocials] = useState([]);

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",
        saleback_policy: "Políticas de devolución y cambio",
    };

    // Cargar socials al montar el componente
    useEffect(() => {
        const fetchSocials = async () => {
            const result = await socialsRest.paginate({ status: true, visible: true });
            if (result?.data) {
                setSocials(result.data);
            }
        };
        fetchSocials();
    }, []);

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

    const accentColor = data?.accentColor || '#78673A';

    // Obtener información de contacto de generals
    const contactInfo = {
        address: generals.find((item) => item.correlative === "address")?.description || "",
        phones: generals.find((item) => item.correlative === "support_phone")?.description?.split(',').map(p => p.trim()).filter(Boolean) || [],
        emails: generals.find((item) => item.correlative === "support_email")?.description?.split(',').map(e => e.trim()).filter(Boolean) || [],
    };

    const getIcon = (iconName) => {
        const icons = {
            'map': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            'phone': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
            'mail': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        };
        return icons[iconName] || icons['map'];
    };

    return (
        <footer 
            className="bg-[#281409] border-t"
            style={{ borderColor: `${accentColor}33` }}
        >
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1 - Logo & Description */}
                    <div>
                        <div className="mb-6">
                            {data?.logo_footer ? (
                                <img 
                                    src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`}
                                    alt={Global.APP_NAME}
                                    className="h-16 object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/resources/logo.png';
                                    }}
                                />
                            ) : (
                                <img 
                                    src="/assets/resources/logo.png"
                                    alt={Global.APP_NAME}
                                    className="h-16 object-contain"
                                />
                            )}
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            {data?.description || generals.find((item) => item.correlative === "footer_description")?.description || `Conectando el lujo con la naturaleza en el corazón del Amazonas peruano.`}
                        </p>
                        <div className="flex gap-3">
                            {socials.filter(s => s.visible).map((social, index) => (
                                <Tippy key={index} content={social.description}>
                                    <a
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110 hover:opacity-80"
                                        style={{ 
                                            backgroundColor: `${accentColor}33`,
                                            color: accentColor
                                        }}
                                    >
                                        <i className={social.icon}></i>
                                    </a>
                                </Tippy>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 - Navegación */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Navegación</h4>
                        <ul className="space-y-3">
                            {pages.filter(page => page.menuable).map((page, index) => (
                                <li key={index}>
                                    <a
                                        href={page.path}
                                        className="text-gray-400 hover:transition-colors duration-300"
                                        style={{ color: 'rgb(156 163 175)' }}
                                        onMouseEnter={(e) => e.target.style.color = accentColor}
                                        onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}
                                    >
                                        {page.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Servicios */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Servicios</h4>
                        <ul className="space-y-3">
                            {items.slice(0, 6).map((service, index) => (
                                <li key={index} className="text-gray-400">
                                    {service.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Contacto */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
                        <ul className="space-y-4">
                            {contactInfo.address && (
                                <li className="flex items-start gap-3">
                                    <div style={{ color: accentColor }}>
                                        {getIcon('map')}
                                    </div>
                                    <span className="text-gray-400 text-sm whitespace-pre-line">
                                        {contactInfo.address}
                                    </span>
                                </li>
                            )}
                            {contactInfo.phones.length > 0 && (
                                <li className="flex items-start gap-3">
                                    <div style={{ color: accentColor }}>
                                        {getIcon('phone')}
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {contactInfo.phones.map((phone, i) => (
                                            <React.Fragment key={i}>
                                                {phone}
                                                {i < contactInfo.phones.length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </li>
                            )}
                            {contactInfo.emails.length > 0 && (
                                <li className="flex items-start gap-3">
                                    <div style={{ color: accentColor }}>
                                        {getIcon('mail')}
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {contactInfo.emails.map((email, i) => (
                                            <React.Fragment key={i}>
                                                {email}
                                                {i < contactInfo.emails.length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div 
                    className="pt-8 border-t"
                    style={{ borderColor: `${accentColor}33` }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            &copy; {new Date().getFullYear()} {Global.APP_NAME}. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a 
                                onClick={() => openModal(0)}
                                className="text-gray-500 transition-colors cursor-pointer"
                                onMouseEnter={(e) => e.target.style.color = accentColor}
                                onMouseLeave={(e) => e.target.style.color = 'rgb(107 114 128)'}
                            >
                                Política de Privacidad
                            </a>
                            <a 
                                onClick={() => openModal(1)}
                                className="text-gray-500 transition-colors cursor-pointer"
                                onMouseEnter={(e) => e.target.style.color = accentColor}
                                onMouseLeave={(e) => e.target.style.color = 'rgb(107 114 128)'}
                            >
                                Términos y Condiciones
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tagline Bar */}
            {data?.tagline && (
                <div className="bg-[#0a0604] py-4">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-gray-600 text-xs">
                            {data.tagline}
                        </p>
                    </div>
                </div>
            )}

            {/* Policy Modals */}
            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content = generals.find((x) => x.correlative == key)?.description ?? "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[999]"
                        ariaHideApp={false}
                    >
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
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
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-gray max-w-none">
                                    <HtmlContent html={content} />
                                </div>
                            </div>
                            <div className="flex justify-end p-6 border-t border-gray-200">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 rounded-lg transition-colors duration-200 font-medium text-white"
                                    style={{ backgroundColor: accentColor }}
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

export default FooterLaPetaca;
