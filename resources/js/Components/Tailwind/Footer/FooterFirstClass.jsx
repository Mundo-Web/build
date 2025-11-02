import React from 'react';
import { Package, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const FooterFirstClass = ({ data, socials = [], generals = [] }) => {
    
    const addressObj = generals.find(item => item.correlative === "address");
    const supportPhoneObj = generals.find(item => item.correlative === "support_phone");
    const supportEmailObj = generals.find(item => item.correlative === "support_email");
    const footerDescriptionObj = generals.find(item => item.correlative === "footer_description");
    const copyrightObj = generals.find(item => item.correlative === "copyright");
    const termsConditionsObj = generals.find(item => item.correlative === "terms_conditions");
    const privacyPolicyObj = generals.find(item => item.correlative === "privacy_policy");
    
    const address = addressObj?.description ?? "Miami, FL 33101, Estados Unidos";
    const supportPhone = supportPhoneObj?.description ?? "+57 1 234 5678";
    const supportEmail = supportEmailObj?.description ?? "info@firstclass-courier.com";
    const footerDescription = footerDescriptionObj?.description ?? "Tu courier de primera clase para envíos seguros entre EE.UU. y América Latina.";
    const copyright = copyrightObj?.description ?? "© 2024 FirstClass Courier. Todos los derechos reservados.";
    const termsConditions = termsConditionsObj?.description ?? "/terminos-condiciones";
    const privacyPolicy = privacyPolicyObj?.description ?? "/politica-privacidad";

    return (
        <footer className={`bg-gray-900 text-white ${data?.class_footer || ''}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${data?.class_container || ''}`}>
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Company Info */}
                    <div className={data?.class_company_info || ''}>
                        <div className={`flex items-center mb-4 ${data?.class_logo || ''}`}>
                            <div className="bg-primary px-3 py-1.5 rounded-lg mr-3">
                                <div className="text-white font-bold text-lg tracking-wide">
                                    FirstClass
                                </div>
                                <div className="text-white text-xs font-light tracking-widest -mt-1">
                                    c o u r i e r
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6">
                            {footerDescription}
                        </p>
                        <div className={`flex space-x-4 ${data?.class_social_links || ''}`}>
                            {socials.length > 0 ? (
                                socials.map((social, index) => (
                                    <a 
                                        key={index}
                                        href={social.link || '#'} 
                                        className="text-gray-400 hover:customtext-primary transition-colors duration-200"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {social.name?.toLowerCase().includes('facebook') && <Facebook className="h-6 w-6" />}
                                        {social.name?.toLowerCase().includes('instagram') && <Instagram className="h-6 w-6" />}
                                        {social.name?.toLowerCase().includes('twitter') && <Twitter className="h-6 w-6" />}
                                        {!social.name?.toLowerCase().includes('facebook') && 
                                         !social.name?.toLowerCase().includes('instagram') && 
                                         !social.name?.toLowerCase().includes('twitter') && 
                                         <Package className="h-6 w-6" />}
                                    </a>
                                ))
                            ) : (
                                <>
                                    <a href="#" className="text-gray-400 hover:customtext-primary transition-colors duration-200">
                                        <Facebook className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:customtext-primary transition-colors duration-200">
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:customtext-primary transition-colors duration-200">
                                        <Twitter className="h-6 w-6" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Services */}
                    <div className={data?.class_services_section || ''}>
                        <h3 className="text-lg font-semibold mb-4">Servicios</h3>
                        <ul className="space-y-2">
                            <li><a href="/casillero-virtual" className="text-gray-400 hover:text-white transition-colors duration-200">Casillero Virtual</a></li>
                            <li><a href="/envios-express" className="text-gray-400 hover:text-white transition-colors duration-200">Envío Express</a></li>
                            <li><a href="/consolidacion" className="text-gray-400 hover:text-white transition-colors duration-200">Consolidación</a></li>
                            <li><a href="/empresas" className="text-gray-400 hover:text-white transition-colors duration-200">Servicios Empresariales</a></li>
                            <li><a href="/seguro" className="text-gray-400 hover:text-white transition-colors duration-200">Seguro de Envío</a></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div className={data?.class_help_section || ''}>
                        <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
                        <ul className="space-y-2">
                            <li><a href="/centro-ayuda" className="text-gray-400 hover:text-white transition-colors duration-200">Centro de Ayuda</a></li>
                            <li><a href="/rastreo" className="text-gray-400 hover:text-white transition-colors duration-200">Rastrea tu Envío</a></li>
                            <li><a href="/calculadora" className="text-gray-400 hover:text-white transition-colors duration-200">Calculadora de Envío</a></li>
                            <li><a href="/preguntas-frecuentes" className="text-gray-400 hover:text-white transition-colors duration-200">Preguntas Frecuentes</a></li>
                            <li><a href="/contacto" className="text-gray-400 hover:text-white transition-colors duration-200">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={data?.class_contact_section || ''}>
                        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Mail className="h-5 w-5 customtext-primary mr-2 mt-0.5" />
                                <div>
                                    <p className="text-gray-400">{supportEmail}</p>
                                    <p className="text-gray-400">soporte@firstclass-courier.com</p>
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
                        </div>
                        <div className={`flex space-x-6 text-sm ${data?.class_legal_links || ''}`}>
                            <a href={termsConditions} className="text-gray-400 hover:text-white transition-colors duration-200">
                                Términos y Condiciones
                            </a>
                            <a href={privacyPolicy} className="text-gray-400 hover:text-white transition-colors duration-200">
                                Política de Privacidad
                            </a>
                            <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Política de Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterFirstClass;