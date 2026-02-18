import React, { useRef, useState } from "react";
import Tippy from "@tippyjs/react";
import {
    CircleCheckBig,
    Mail,
    Phone,
    MapPin,
    Clock,
    ArrowUpRight,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";
import JobApplicationModal from "../Modals/JobApplicationModal";
import ProviderJoinModal from "../Modals/ProviderJoinModal";

const FooterRainstar = ({ pages = [], generals = [], data, socials = [] }) => {
    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();
    const currentYear = new Date().getFullYear();

    const [saving, setSaving] = useState(false);
    const [jobModalOpen, setJobModalOpen] = useState(false);
    const [providerModalOpen, setProviderModalOpen] = useState(false);

    // Efecto para escuchar clics globales en enlaces que apuntan al modal
    React.useEffect(() => {
        const handleGlobalLinkClick = (e) => {
            const link = e.target.closest("a");
            if (!link) return;
            const href = link.getAttribute("href");

            if (href === "#jobapplicationmodal") {
                e.preventDefault();
                setJobModalOpen(true);
            } else if (href === "#providerjoinmodal") {
                e.preventDefault();
                setProviderModalOpen(true);
            }
        };

        document.addEventListener("click", handleGlobalLinkClick);

        // Verificar hash inicial
        if (window.location.hash === "#jobapplicationmodal") {
            setJobModalOpen(true);
        } else if (window.location.hash === "#providerjoinmodal") {
            setProviderModalOpen(true);
        }

        return () => {
            document.removeEventListener("click", handleGlobalLinkClick);
        };
    }, []);

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        if (!emailRef.current.value) return;

        setSaving(true);
        const result = await subscriptionsRest.save({
            email: emailRef.current.value,
            status: 1,
        });
        setSaving(false);

        if (!result) return;

        toast.success("¡Suscrito!", {
            description: `Te has suscrito correctamente a Rainstar Store.`,
            icon: <CircleCheckBig className="h-5 w-5 text-black" />,
            duration: 3000,
            position: "top-center",
        });

        emailRef.current.value = "";
    };

    // Data from Generals
    const footerDescription =
        generals.find((g) => g.correlative === "footer_description")
            ?.description || "";
    const address =
        generals.find((g) => g.correlative === "address")?.description || "";
    const openingHours =
        generals.find((g) => g.correlative === "opening_hours")?.description ||
        "";
    const phoneContact =
        generals.find((g) => g.correlative === "phone_contact")?.description ||
        "";
    const emailContact =
        generals.find((g) => g.correlative === "email_contact")?.description ||
        "";
    const copyright =
        generals.find((g) => g.correlative === "copyright")?.description ||
        `© ${currentYear} ${Global.APP_NAME}. Todos los derechos reservados.`;

    return (
        <footer
            id={data?.element_id || null}
            className={`bg-black text-white pt-24 pb-12 overflow-hidden ${data?.class || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="mb-8">
                            <img
                                src={`/assets/resources/logo-footer.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className="h-12 md:h-16 object-contain filter brightness-0 invert"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/img/logo-bk.svg";
                                }}
                            />
                        </div>
                        <p className="text-white text-base leading-relaxed">
                            {footerDescription ||
                                "Elevando el estándar de la moda con piezas curadas para quienes exigen exclusividad y calidad superior."}
                        </p>

                        <div className="pt-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6">
                                Síguenos
                            </h4>
                            <div className="flex gap-4">
                                {socials.map((social, index) => (
                                    <Tippy key={index} content={social.name}>
                                        <a
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group"
                                        >
                                            <i
                                                className={`${social.icon} text-base group-hover:scale-110 transition-transform`}
                                            ></i>
                                        </a>
                                    </Tippy>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">
                            Explorar
                        </h4>
                        <ul className="space-y-4">
                            {pages
                                .filter((p) => p.menuable)
                                .map((page, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={page.pseudo_path || page.path}
                                            className="text-white hover:text-white transition-colors flex items-center justify-between group text-sm"
                                        >
                                            <span className="font-medium">
                                                {page.name}
                                            </span>
                                            <ArrowUpRight
                                                size={12}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                        </a>
                                    </li>
                                ))}

                            <li>
                                <button
                                    onClick={() => setProviderModalOpen(true)}
                                    className="text-white hover:text-white transition-colors flex items-center justify-between group text-sm w-full text-left"
                                >
                                    <span className="font-medium">
                                        Únete a Nosotros
                                    </span>
                                    <ArrowUpRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">
                            Legal
                        </h4>
                        <ul className="space-y-6">
                            <li>
                                <a
                                    href="/politicas-de-privacidad"
                                    className="text-white hover:text-white transition-colors flex items-center justify-between group text-sm w-full text-left"
                                >
                                    <span className="font-medium">
                                        Política de Privacidad
                                    </span>
                                    <ArrowUpRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/terminos-y-condiciones"
                                    className="text-white hover:text-white transition-colors flex items-center justify-between group text-sm w-full text-left"
                                >
                                    <span className="font-medium">
                                        Términos y Condiciones
                                    </span>
                                    <ArrowUpRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/politicas-de-devolucion-y-cambio"
                                    className="text-white hover:text-white transition-colors flex items-center justify-between group text-sm w-full text-left"
                                >
                                    <span className="font-medium">
                                        Políticas de Devolución y Cambio
                                    </span>
                                    <ArrowUpRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/politicas-de-envio"
                                    className="text-white hover:text-white transition-colors flex items-center justify-between group text-sm w-full text-left"
                                >
                                    <span className="font-medium">
                                        Políticas de Envío
                                    </span>
                                    <ArrowUpRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </a>
                            </li>
                            <li className="pt-2">
                                <div className="space-y-4">
                                    <a
                                        href="/libro-reclamaciones"
                                        className="text-white hover:text-white transition-colors flex items-center justify-between group text-[11px] font-bold tracking-widest uppercase"
                                    >
                                        <span>Libro de Reclamaciones</span>
                                        <ArrowUpRight
                                            size={14}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </a>
                                    <a
                                        href="/libro-reclamaciones"
                                        className="block w-24 hover:opacity-80 transition-opacity"
                                    >
                                        <img
                                            src="/assets/resources/libro-reclamaciones.png"
                                            alt="Libro de Reclamaciones"
                                            className="w-full h-auto object-contain transition-all duration-300"
                                            onError={(e) =>
                                                (e.target.style.display =
                                                    "none")
                                            }
                                        />
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter + Contact Section */}
                    <div className="lg:col-span-4 space-y-12">
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">
                                Suscríbete
                            </h4>
                            <p className="text-white mb-6 text-xs leading-relaxed">
                                Únete a nuestra comunidad exclusiva y recibe
                                lanzamientos y eventos privados.
                            </p>
                            <form
                                onSubmit={onEmailSubmit}
                                className="relative group"
                            >
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="TU CORREO"
                                    className="w-full bg-transparent border-b border-neutral-700 py-3 pr-10 text-xs focus:border-white focus:outline-none transition-colors placeholder:text-neutral-600 uppercase tracking-widest font-bold"
                                    disabled={saving}
                                />
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    {saving ? (
                                        <Loader2
                                            size={16}
                                            className="animate-spin text-white"
                                        />
                                    ) : (
                                        <ArrowUpRight size={16} />
                                    )}
                                </button>
                            </form>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">
                                Contacto
                            </h4>
                            <div className="space-y-6 text-sm tracking-wide">
                                {address && (
                                    <div className="flex items-start gap-4 group">
                                        <MapPin
                                            size={18}
                                            className="text-white mt-1 shrink-0 group-hover:text-white transition-colors"
                                        />
                                        <p className="text-white leading-relaxed group-hover:text-gray-200 transition-colors uppercase text-[11px] font-medium tracking-wider">
                                            {address}
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {phoneContact &&
                                            phoneContact
                                                .split(",")
                                                .map((phone, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`tel:${phone.trim()}`}
                                                        className="flex items-center gap-4 group"
                                                    >
                                                        <Phone
                                                            size={18}
                                                            className="text-white shrink-0 group-hover:text-white transition-colors"
                                                        />
                                                        <span className="text-white group-hover:text-gray-200 transition-colors font-bold text-[11px] tracking-widest">
                                                            {phone.trim()}
                                                        </span>
                                                    </a>
                                                ))}
                                    </div>
                                    <div className="space-y-4">
                                        {emailContact &&
                                            emailContact
                                                .split(",")
                                                .map((email, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`mailto:${email.trim()}`}
                                                        className="flex items-center gap-4 group"
                                                    >
                                                        <Mail
                                                            size={18}
                                                            className="text-white shrink-0 group-hover:text-white transition-colors"
                                                        />
                                                        <span className="text-white group-hover:text-gray-200 transition-colors font-bold text-[11px] tracking-wider truncate">
                                                            {email.trim()}
                                                        </span>
                                                    </a>
                                                ))}
                                    </div>
                                </div>
                                {openingHours && (
                                    <div className="flex items-start gap-4 group pt-2 border-t border-neutral-900 mt-6 overflow-hidden">
                                        <Clock
                                            size={18}
                                            className="text-white mt-1 shrink-0 group-hover:text-white transition-colors"
                                        />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-600 group-hover:text-white transition-colors">
                                                Horarios de atención
                                            </p>
                                            <p className="text-white leading-relaxed group-hover:text-gray-200 transition-colors whitespace-pre-line text-[11px] lowercase first-letter:uppercase font-medium">
                                                {openingHours}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase text-center md:text-left">
                        <span>{copyright}</span>
                        <span className="hidden md:block opacity-30">|</span>
                        <span className="flex items-center gap-1">
                            Powered by{" "}
                            <a
                                href="https://www.mundoweb.pe"
                                target="_blank"
                                className="hover:text-white transition-colors"
                            >
                                MundoWeb
                            </a>
                        </span>
                    </div>
                </div>
            </div>

            <JobApplicationModal
                isOpen={jobModalOpen}
                onClose={() => setJobModalOpen(false)}
            />

            <ProviderJoinModal
                isOpen={providerModalOpen}
                onClose={() => setProviderModalOpen(false)}
            />
        </footer>
    );
};

export default FooterRainstar;
