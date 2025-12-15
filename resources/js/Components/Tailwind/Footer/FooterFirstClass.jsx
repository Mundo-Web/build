import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, X } from 'lucide-react';
import ReactModal from 'react-modal';
import ServicesCategoriesPublicRest from '../../../Actions/Public/ServicesCategoriesPublicRest';
import HtmlContent from '../../../Utils/HtmlContent';
import Global from '../../../Utils/Global';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaSnapchat,
  FaPinterest,
  FaReddit
} from 'react-icons/fa';

// Redes sociales predefinidas (mismo mapeo que en TopBarSocials.jsx)
const predefinedSocials = [
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, iconRef: 'fab fa-facebook' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, iconRef: 'fab fa-instagram' },
  { id: 'twitter', name: 'Twitter/X', icon: FaTwitter, iconRef: 'fab fa-twitter' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, iconRef: 'fab fa-linkedin' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, iconRef: 'fab fa-youtube' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, iconRef: 'fab fa-tiktok' },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, iconRef: 'fab fa-whatsapp' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, iconRef: 'fab fa-telegram' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, iconRef: 'fab fa-discord' },
  { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, iconRef: 'fab fa-snapchat' },
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, iconRef: 'fab fa-pinterest' },
  { id: 'reddit', name: 'Reddit', icon: FaReddit, iconRef: 'fab fa-reddit' }
];

const servicesCategoriesRest = new ServicesCategoriesPublicRest();

const FooterFirstClass = ({ data, socials = [], generals = [] }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(null);
    
    const addressObj = generals.find(item => item.correlative === "address");
    const supportPhoneObj = generals.find(item => item.correlative === "support_phone");
    const emailContactObj = generals.find(item => item.correlative === "email_contact");
    const footerDescriptionObj = generals.find(item => item.correlative === "site_description");
    const copyrightObj = generals.find(item => item.correlative === "copyright");
    const termsConditionsObj = generals.find(item => item.correlative === "terms_conditions");
    const privacyPolicyObj = generals.find(item => item.correlative === "privacy_policy");
    
    const address = addressObj?.description ?? "Miami, FL 33101, Estados Unidos";
    const supportPhone = supportPhoneObj?.description ?? "+57 1 234 5678";
    const emailContact = emailContactObj?.description ?? "info@firstclass-courier.com";
    const emailList = emailContact.split(',').map(email => email.trim()).filter(email => email);
    const footerDescription = footerDescriptionObj?.description ?? "Tu courier de primera clase para envíos seguros entre EE.UU. y América Latina.";
    const copyright = copyrightObj?.description ?? "© 2024 FirstClass Courier. Todos los derechos reservados.";
    
    // Content for modals
    const termsConditionsContent = generals.find(item => item.correlative === "terms_conditions")?.description ?? "";
    const privacyPolicyContent = generals.find(item => item.correlative === "privacy_policy")?.description ?? "";

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    const policyItems = {
        privacy_policy: { 
            title: "Política de Privacidad",
            content: privacyPolicyContent
        },
        terms_conditions: { 
            title: "Términos y Condiciones",
            content: termsConditionsContent
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await servicesCategoriesRest.getAll();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Filtrar servicios por categorías
    const mainServices = categories
        .filter(cat => cat.name === 'Personas' || cat.name === 'Empresas')
        .flatMap(cat => cat.services || []);

    const helpLinks = categories
        .filter(cat => cat.name === 'Enlaces de Interés')
        .flatMap(cat => cat.services || []);

    return (
        <footer className={`bg-gray-900 text-white ${data?.class_footer || ''}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${data?.class_container || ''}`}>
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Company Info */}
                    <div className={data?.class_company_info || ''}>
                        <div className={`flex items-center mb-4 ${data?.class_logo || ''}`}>
                           <img src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className={`h-12 lg:h-16 object-contain ${data?.class_logo_footer || ''}`} onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/logo-bk.svg';
                                }} />
                        </div>
                        <p className="text-gray-400 mb-6">
                            {footerDescription}
                        </p>
                        <div className={`flex space-x-4 ${data?.class_social_links || ''}`}>
                            {socials.length > 0 ? (
                                socials.map((social, index) => {
                                    // Buscar el icono correcto basado en la descripción o el iconRef
                                    const socialData = predefinedSocials.find(s => 
                                        s.name === social.description || 
                                        s.iconRef === social.icon ||
                                        s.name.toLowerCase() === social.description?.toLowerCase() ||
                                        s.name.toLowerCase() === social.name?.toLowerCase()
                                    );
                                    
                                    const IconComponent = socialData?.icon;

                                    return (
                                        <a 
                                            key={index}
                                            href={social.url || social.link || '#'} 
                                            className="text-gray-400 hover:customtext-primary transition-all duration-200 hover:scale-110"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={social.name || social.description || 'Red social'}
                                        >
                                            {IconComponent ? (
                                                <IconComponent className="h-6 w-6" />
                                            ) : (
                                                <i className={social.icon || 'fab fa-globe'} style={{ fontSize: '24px' }} />
                                            )}
                                        </a>
                                    );
                                })
                            ) : (
                                <>
                                    <a href="#" className="text-gray-400 hover:customtext-primary transition-colors duration-200">
                                        <FaFacebook className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:customtext-primary transition-colors duration-200">
                                        <FaInstagram className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:customtext-primary transition-colors duration-200">
                                        <FaTwitter className="h-6 w-6" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Services */}
                    <div className={data?.class_services_section || ''}>
                        <h3 className="text-lg font-semibold mb-4">Servicios</h3>
                        {loading ? (
                            <div className="text-gray-400 text-sm">Cargando...</div>
                        ) : (
                            <ul className="space-y-2">
                                {mainServices.length > 0 ? (
                                    mainServices.map((service) => (
                                        <li key={service.id}>
                                            <a 
                                                href={service.path || `/${service.slug}`} 
                                                className="text-gray-400 hover:text-white transition-colors duration-200"
                                            >
                                                {service.name}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li><a href="/casillero-virtual" className="text-gray-400 hover:text-white transition-colors duration-200">Casillero virtual</a></li>
                                        <li><a href="/envios-usa-peru" className="text-gray-400 hover:text-white transition-colors duration-200">Envíos de USA a Perú</a></li>
                                        <li><a href="/envios-peru-usa" className="text-gray-400 hover:text-white transition-colors duration-200">Envíos de Perú a USA</a></li>
                                    </>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Help - Enlaces de Interés */}
                    <div className={data?.class_help_section || ''}>
                        <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
                        {loading ? (
                            <div className="text-gray-400 text-sm">Cargando...</div>
                        ) : (
                            <ul className="space-y-2">
                                <li>
                                    <a href="/contacto" className="text-gray-400 hover:text-white transition-colors duration-200">
                                        Contacto
                                    </a>
                                </li>
                                {helpLinks.length > 0 && helpLinks.map((service) => (
                                    <li key={service.id}>
                                        <a 
                                            href={service.path || `/${service.slug}`} 
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {service.name}
                                        </a>
                                    </li>
                                ))}
                                {helpLinks.length === 0 && (
                                    <>
                                        <li><a href="/preguntas-frecuentes" className="text-gray-400 hover:text-white transition-colors duration-200">Preguntas Frecuentes</a></li>
                                        <li><a href="/rastreo" className="text-gray-400 hover:text-white transition-colors duration-200">Rastrea tu Envío</a></li>
                                    </>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Contact */}
                    <div className={data?.class_contact_section || ''}>
                        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Mail className="h-5 w-5 customtext-primary mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    {emailList.map((email, index) => (
                                        <p key={index} className="text-gray-400">{email}</p>
                                    ))}
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Phone className="h-5 w-5 customtext-primary mr-2 mt-0.5" />
                                <div>
                                    <p className="text-gray-400">Perú: {supportPhone}</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 customtext-primary mr-2 mt-0.5" />
                                <p className="text-gray-400">{address}</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={`border-t border-gray-800 py-8 ${data?.class_bottom_section || ''}`}>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className={`text-gray-400 text-sm mb-4 md:mb-0 ${data?.class_copyright || ''}`}>
                            {copyright}
                            {" "}
                                <span>Powered by</span>
                                <a 
                                    href="https://mundoweb.pe/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark font-semibold transition-colors duration-200"
                                >{" "}
                                    Mundoweb
                                </a>
                        </div>
                        <div className={`flex space-x-6 text-sm ${data?.class_legal_links || ''}`}>
                            <button 
                                onClick={() => openModal(1)}
                                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                Términos y Condiciones
                            </button>
                            <button 
                                onClick={() => openModal(0)}
                                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                Política de Privacidad
                            </button>
                      
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {Object.keys(policyItems).map((key, index) => {
                const policy = policyItems[key];
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={policy.title}
                        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[999]"
                        ariaHideApp={false}
                    >
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 pr-4">{policy.title}</h2>
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
                                    <HtmlContent html={policy.content} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end p-6 border-t border-gray-200">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium"
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

export default FooterFirstClass;