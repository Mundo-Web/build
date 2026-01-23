import { Facebook, Youtube, Instagram, Twitter } from "lucide-react"

import React, { useRef, useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";

import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import { CircleCheckBig, X } from "lucide-react";
import { toast } from "sonner";
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

// Redes sociales predefinidas con sus iconos
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

// Datos de ejemplo (estos vendrían de la base de datos)
const footerData = {
    company: {
        name: "PAANI",
        tagline: "Power Filter",
        logo: "/logo.png", // Ruta a tu logo
    },
    location: {
        address: "Montevideo N. 725 Tienda 1041",
        phone: "+51 915 968 941",
        email: "info@paani.com",
    },
    policies: [
        { id: 1, title: "Políticas de privacidad", url: "/privacidad" },
        { id: 2, title: "Términos y Condiciones", url: "/terminos" },
        { id: 3, title: "Políticas de cambio", url: "/cambios" },
        { id: 4, title: "Libro de reclamaciones", url: "/reclamaciones" },
    ],
    businessHours: {
        weekdays: "Lun - Sab: 8:00 - 20:00",
        weekend: "Dom: 11:30 - 18:00",
    },
    socialMedia: {
        facebook: "https://facebook.com/paani",
        youtube: "https://youtube.com/paani",
        instagram: "https://instagram.com/paani",
        twitter: "https://twitter.com/paani",
        tiktok: "https://tiktok.com/@paani",
    },
    paymentMethods: [
        { id: 1, name: "PayPal", icon: "/payment-icons/paypal.png" },
        { id: 2, name: "American Express", icon: "/payment-icons/amex.png" },
        { id: 3, name: "Visa", icon: "/payment-icons/visa.png" },
        { id: 4, name: "Mastercard", icon: "/payment-icons/mastercard.png" },
    ],
}

export default function FooterPaani({ data = footerData, generals, socials }) {

    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState();
    const [showFooterOverlay, setShowFooterOverlay] = useState(true);

    const policyItems = {
        terms_conditions: "Términos y condiciones",
        privacy_policy: "Políticas de privacidad",
        // 'delivery_policy': 'Políticas de envío',
        saleback_policy: "Políticas de devolucion y cambio",
    };

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);
    const getContact = (correlative) => {
        return (
            generals?.find((contact) => contact.correlative === correlative)
                ?.description || ""
        );
    };
 
    return (
        <footer id={data?.element_id || null} className="w-full bg-primary text-white py-12 relative overflow-hidden">
            {/* Imagen overlay decorativa con blend mode */}

            {showFooterOverlay && (
                <img
                    src={`/assets/resources/footer-overlay.png?v=${crypto.randomUUID()}`}
                    alt={`${Global.APP_NAME} - footer overlay decorativo`}
                    className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-50 z-0"
                    style={{
                        objectPosition: "center",
                        mixBlendMode: "overlay", // Cambia a "multiply" si prefieres ese efecto
                    }}
                    aria-hidden="true"
                    loading="lazy"
                    onError={() => setShowFooterOverlay(false)}
                />
            )}
            <div className="relative z-10 px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto ">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Logo y métodos de pago */}
                    <div className="md:col-span-3 flex flex-col items-start space-y-6">

                        <img src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-20 lg:h-24 object-contain" onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/img/logo-bk.svg';
                        }} />

                        {/* Métodos de pago */}
                        <div className="flex space-x-2">
                            {(data.methodPayment || "")
                                .split(",")
                                .map((name, idx) => {
                                    const trimmed = name.trim();
                                    return (
                                        <Tippy
                                            key={idx}
                                            content={`${name}`}>
                                            <div key={trimmed} className="bg-white p-1 rounded-lg w-10 lg:w-12 h-8 flex items-center justify-center">
                                                <span className="sr-only">{trimmed}</span>
                                                <img
                                                    src={`/assets/payment-icons/${trimmed.toLowerCase().replace(/\s/g, "")}.png`}
                                                    alt={trimmed}
                                                    className="h-6 lg:h-8 object-contain"
                                                    onError={e => { e.target.src = "/assets/payment-icons/default.png"; }}
                                                />
                                            </div>
                                        </Tippy>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-8">
                        {/* Ubicación */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-base lg:text-xl font-semibold">Ubicanos</h3>
                            <div className="text-sm lg:text-base space-y-2">
                                <p>{getContact("address")}</p>
                                <p>Teléfono: {getContact("support_phone")}</p>
                                <p>Correo: {getContact("support_email")}</p>
                            </div>
                        </div>

                        {/* Políticas */}
                        <div>
                            <h3 className="text-base lg:text-xl font-semibold text-white  mb-4 ">
                                Políticas
                            </h3>
                            <ul className="text-sm lg:text-base  space-y-3 text-white">
                                <li>
                                    <a
                                        onClick={() => openModal(0)}
                                        className="cursor-pointer  hover:font-bold transition-all duration-300"
                                    >
                                        Políticas de privacidad
                                    </a>
                                </li>
                                <li>
                                    <a
                                        type="button"
                                        href="#"
                                        onClick={() => openModal(1)}
                                        className="cursor-pointer  hover:font-bold transition-all duration-300"
                                    >
                                        Términos y Condiciones
                                    </a>
                                </li>
                                <li>
                                    <a
                                        type="button"
                                        href="#"
                                        onClick={() => openModal(2)}
                                        className="cursor-pointer  hover:font-bold transition-all duration-300"
                                    >
                                        Políticas de cambio
                                    </a>
                                </li>
                                <li>
                                    <a


                                        href="/libro-reclamaciones"
                                        className="cursor-pointer flex flex-col gap-2 items-start  "
                                    >
                                        <span className=" hover:font-bold transition-all duration-300">
                                            Libro de reclamaciones
                                        </span>

                                    </a>
                                </li>
                            </ul>
                        </div>


                        {/* Horarios */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-base lg:text-xl font-semibold">Horario de atención</h3>
                            <div className="text-sm lg:text-base  space-y-1">
                                <p>{getContact("opening_hours")}</p>

                            </div>
                        </div>

                        {/* Redes sociales */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-base  lg:text-xl font-semibold">Nuestras redes</h3>
                            <div className="grid grid-cols-3 gap-y-3 lg:flex lg:space-x-3">
                                {
                                    socials.map((social, index) => {
                                        const socialData = predefinedSocials.find(s => 
                                            s.name === social.description || s.iconRef === social.icon
                                        );
                                        const IconComponent = socialData?.icon;
                                        
                                        return (
                                            <Tippy
                                                key={index}
                                                content={`Ver ${social.name} en ${social.description}`}>
                                                <a className="text-xl w-8 h-8 flex items-center justify-center bg-white rounded-full p-2 customtext-primary" href={social.link} target="_blank" rel="noopener noreferrer">
                                                    {IconComponent ? (
                                                        <IconComponent size={20} />
                                                    ) : (
                                                        <i className={social.icon} />
                                                    )}
                                                </a>
                                            </Tippy>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>

                </div>


            </div>
            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content =
                    generals.find((x) => x.correlative == key)?.description ??
                    "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl my-8"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                    >
                        <button
                            onClick={closeModal}
                            className="float-right text-red-500 hover:text-red-700 transition-all duration-300 "
                        >
                            <X width="2rem" strokeWidth="4px" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                        <HtmlContent className="prose" html={content} />
                    </ReactModal>
                );
            })}
        </footer>
    )
}
