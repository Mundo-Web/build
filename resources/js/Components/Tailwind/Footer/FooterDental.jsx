import React, { useRef, useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import { CircleCheckBig, X } from "lucide-react";
import { toast } from "sonner";

const FooterDental = ({ pages, generals, data, socials = [] }) => {
    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();

    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState();

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",

        // 'delivery_policy': 'Políticas de envío',
        saleback_policy: "Políticas de devolucion y cambio",
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

        /* Swal.fire({
             title: "¡Éxito!",
             text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
             icon: "success",
             confirmButtonText: "Ok",
         });*/
        toast.success("¡Suscrito!", {
            description: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: <CircleCheckBig className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: "top-center",
        });

        emailRef.current.value = null;
    };
    return (
        <footer className={` py-12  text-sm font-paragraph ${data?.class_footer || 'bg-accent text-white'

            }`}>
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6  md:gap-12">
                {/* Menu Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:col-span-4 justify-between md:mr-6">
                    {/* Logo Column */}
                    <div>
                        <div className={` -ml-8 md:ml-0 h-14 ${data?.logo_footer_content || 'aspect-[13/4] '}`}>
                            {data?.logo_footer ?

                                <img src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-20 lg:h-36 object-contain" onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/logo-bk.svg';
                                }} /> :
                                <div
                                    className="h-full w-full bg-primary"
                                    style={{
                                        maskImage: `url(/assets/resources/logo.png)`,
                                        maskSize: "contain",
                                        maskPosition: "center",
                                        maskRepeat: "no-repeat",
                                    }}
                                />
                            }
                        </div>
                    </div>

                    {/* Menu Column */}
                    <div>

                    </div>

                    {/* Policies Column */}
                    <div >
                        <h3 className={`customtext-primary font-bold mb-6 text-base ${data?.class_menu || ''}`}>
                            Políticas
                        </h3>
                        <ul className={`space-y-3 text-white ${data?.class_menu_list || ''}`}>
                            <li>
                                <a
                                    onClick={() => openModal(0)}
                                    className={`cursor-pointer hover:customtext-primary hover:font-bold transition-all duration-300 ${data?.class_menu_item || ''}`}
                                >
                                    Políticas de privacidad
                                </a>
                            </li>
                            <li>
                                <a
                                    type="button"
                                    href="#"
                                    onClick={() => openModal(1)}
                                    className={`cursor-pointer hover:customtext-primary hover:font-bold transition-all duration-300 ${data?.class_menu_item || ''}`}
                                >
                                    Términos y Condiciones
                                </a>
                            </li>
                            <li>
                                <a
                                    type="button"
                                    href="#"
                                    onClick={() => openModal(2)}
                                    className={`cursor-pointer hover:customtext-primary hover:font-bold transition-all duration-300 ${data?.class_menu_item || ''}`}
                                >
                                    Políticas de cambio
                                </a>
                            </li>
                            <li>
                                <a


                                    href="/libro-reclamaciones"
                                    className="cursor-pointer flex flex-col gap-2 items-start  "
                                >
                                    <span className={`hover:customtext-primary hover:font-bold transition-all duration-300 ${data?.class_menu_item || ''}`}>
                                        Libro de reclamaciones
                                    </span>

                                </a>
                            </li>
                        </ul>

                        <h3 className={`customtext-primary font-bold mb-6 text-base mt-8 ${data?.class_menu || ''}`}>
                            Horarios de atención
                        </h3>

                        <p className={`cursor-pointer text-white whitespace-pre-line hover:customtext-primary hover:font-bold transition-all duration-300 ${data?.class_menu_item || ''}`}>  {generals.find((contact) => contact.correlative === "opening_hours")
                            ?.description || ""}</p>
                    </div>
                </div>

                {/* Newsletter Column */}
                <div className="mt-4 lg:mt-0 col-span-1 md:col-span-2">
                    <h3 className={`customtext-primary font-bold mb-4 text-base ${data?.class_menu || ''}`}>
                        Únete a nuestro blog
                    </h3>
                    <p className={`mb-6  text-sm ${data?.class_menu_item || 'text-white'}`}>
                        Suscríbete y recibe todas nuestras novedades
                    </p>
                    <form onSubmit={onEmailSubmit}>
                        <div className="relative customtext-neutral-dark">
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="Ingresa tu e-mail"
                                className="w-full customtext-neutral-dark font-semibold  shadow-xl  py-5 pl-5 border  rounded-[20px] md:rounded-full focus:ring-0 focus:outline-none"
                                disabled={saving}
                            />
                            <button
                                disabled={saving}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 py-3 font-bold shadow-xl px-4 bg-primary  rounded-xl flex items-center justify-center min-w-[120px] ${data?.class_button || 'text-white'}`}
                                aria-label="Suscribite"
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>
                                        Enviando...
                                    </span>
                                ) : (
                                    "Suscribirme"
                                )}
                            </button>
                        </div>
                    </form>
                    <div>
                        <h3 className={`customtext-primary font-bold mb-6 text-base mt-8 ${data?.class_menu || ''}`}>Nuestras redes</h3>
                        <div className="flex gap-4" >
                            {socials.map((social, index) => (
                                <Tippy key={index} content={`Ver ${social.name} en ${social.description}`}>
                                    <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-base flex bg-white customtext-primary w-8 h-8 pt-0.5 items-center justify-center rounded-full">
                                        <i className={social.icon}></i>
                                    </a>
                                </Tippy>
                            ))}
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
                        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[999]"
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
                                    className="px-6 py-2 bg-primary text-white rounded-lg  transition-colors duration-200 font-medium"
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
export default FooterDental;
