import React, { useRef, useState, useEffect } from "react";
import ReactModal from "react-modal";
import Tippy from "@tippyjs/react";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import SocialsRest from "../../../Actions/SocialsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import { CircleCheckBig, X, MapPin, Phone, Mail, Send, Heart } from "lucide-react";
import { toast } from "sonner";

const FooterLaPetaca = ({ pages, generals, data, items = [] }) => {
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

    // Obtener información de contacto de generals
    const contactInfo = {
        address: generals.find((item) => item.correlative === "address")?.description || "",
        phones: generals.find((item) => item.correlative === "support_phone")?.description?.split(',').map(p => p.trim()).filter(Boolean) || [],
        emails: generals.find((item) => item.correlative === "support_email")?.description?.split(',').map(e => e.trim()).filter(Boolean) || [],
    };

    return (
        <footer id={data?.element_id || null} className="bg-primary relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-5 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl opacity-5 -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
                    {/* Column 1 - Logo & Description */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            {data?.logo_footer ? (
                                <img 
                                    src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`}
                                    alt={Global.APP_NAME}
                                    className="h-14 object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/resources/logo.png';
                                    }}
                                />
                            ) : (
                                <img 
                                    src="/assets/resources/logo.png"
                                    alt={Global.APP_NAME}
                                    className="h-14 object-contain"
                                />
                            )}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {data?.description || generals.find((item) => item.correlative === "footer_description")?.description || `Conectando el lujo con la naturaleza en el corazón del Amazonas peruano.`}
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex gap-2">
                            {socials.filter(s => s.visible).map((social, index) => (
                                <Tippy key={index} content={social.description}>
                                    <a
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 customtext-accent hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                                    >
                                        <i className={social.icon}></i>
                                    </a>
                                </Tippy>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 - Navegación */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                            <div className="w-1 h-5 bg-accent rounded-full"></div>
                            Navegación
                        </h4>
                        <ul className="space-y-3">
                            {pages.filter(page => page.menuable).map((page, index) => (
                                <li key={index}>
                                    <a
                                        href={page.path}
                                        className="text-gray-400 text-sm hover:customtext-accent hover:translate-x-1 inline-flex transition-all duration-200"
                                    >
                                        {page.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Servicios */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                            <div className="w-1 h-5 bg-accent rounded-full"></div>
                            Servicios
                        </h4>
                        <ul className="space-y-3">
                            {items.slice(0, 6).map((service, index) => (
                                <li key={index} className="text-gray-400 text-sm">
                                    {service.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Contacto */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                            <div className="w-1 h-5 bg-accent rounded-full"></div>
                            Contacto
                        </h4>
                        <ul className="space-y-4">
                            {contactInfo.address && (
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MapPin size={14} className="customtext-accent" />
                                    </div>
                                    <span className="text-gray-400 text-sm leading-relaxed">
                                        {contactInfo.address}
                                    </span>
                                </li>
                            )}
                            {contactInfo.phones.length > 0 && (
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Phone size={14} className="customtext-accent" />
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {contactInfo.phones.map((phone, i) => (
                                            <a 
                                                key={i} 
                                                href={`tel:${phone.replace(/\s/g, '')}`}
                                                className="block hover:customtext-accent transition-colors"
                                            >
                                                {phone}
                                            </a>
                                        ))}
                                    </div>
                                </li>
                            )}
                            {contactInfo.emails.length > 0 && (
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Mail size={14} className="customtext-accent" />
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {contactInfo.emails.map((email, i) => (
                                            <a 
                                                key={i} 
                                                href={`mailto:${email}`}
                                                className="block hover:customtext-accent transition-colors"
                                            >
                                                {email}
                                            </a>
                                        ))}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left flex items-center gap-1">
                            &copy; {new Date().getFullYear()} {Global.APP_NAME}. Hecho con 
                            <Heart size={14} className="customtext-accent fill-current" /> 
                            en Perú
                        </p>
                        <div className="flex gap-6 text-sm">
                            <button 
                                onClick={() => openModal(0)}
                                className="text-gray-500 hover:customtext-accent transition-colors cursor-pointer"
                            >
                                Privacidad
                            </button>
                            <button 
                                onClick={() => openModal(1)}
                                className="text-gray-500 hover:customtext-accent transition-colors cursor-pointer"
                            >
                                Términos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold customtext-primary pr-4">{title}</h2>
                                <button
                                    onClick={closeModal}
                                    className="flex-shrink-0 text-gray-400 hover:customtext-danger transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                                    aria-label="Cerrar modal"
                                >
                                    <X size={20} strokeWidth={2} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-gray max-w-none">
                                    <HtmlContent html={content} />
                                </div>
                            </div>
                            <div className="flex justify-end p-6 border-t border-gray-100">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2.5 rounded-full bg-accent hover:bg-secondary text-white font-medium transition-colors duration-200"
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
