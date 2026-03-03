import { useEffect, useRef, useState } from "react";
import ubigeoData from "../../../../../storage/app/utils/ubigeo.json";
import CustomCaptcha from "./CustomCaptcha";
import ThankYouRainstar from "./ThankYouRainstar";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
    getDocumentTypesOptions,
    validateDocument,
} from "../../../Utils/DocumentValidation";

import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import {
    Send,
    X,
    FileText,
    User,
    MapPin,
    Package,
    AlertTriangle,
    Shield,
    ArrowRight,
    Loader2,
    ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import Global from "../../../Utils/Global";

const InputField = ({ label, name, error, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold tracking-widest text-neutral-400 block mb-1.5">
            {label}
        </label>
        <div className="relative">
            <input
                {...props}
                name={name}
                className={`w-full border-2 p-4 font-medium outline-none transition-all bg-white text-neutral-800 placeholder-neutral-300 ${
                    error
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-black hover:border-gray-400"
                }`}
            />
        </div>
        {error && (
            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                {error}
            </p>
        )}
    </div>
);

const SelectField = ({ label, options, placeholder, error, ...props }) => {
    const isArrayOfObjects =
        options.length > 0 && typeof options[0] === "object";
    const normalizedOptions = options.map((option) =>
        isArrayOfObjects
            ? { value: option.value, label: option.label }
            : { value: option, label: option },
    );

    return (
        <div className="space-y-1.5 w-full">
            <label className="text-xs font-bold tracking-widest text-neutral-400 block mb-1.5">
                {label}
            </label>
            <div className="relative group">
                <select
                    {...props}
                    className={`w-full border-2 p-4 font-medium outline-none appearance-none bg-white cursor-pointer transition-all text-neutral-800 ${
                        error
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-black hover:border-gray-400"
                    }`}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {normalizedOptions.map((opt, i) => (
                        <option key={i} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-300 group-hover:text-neutral-500 transition-colors">
                    <ChevronDown size={16} />
                </div>
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                    {error}
                </p>
            )}
        </div>
    );
};

export default function ComplaintRainstar({ generals = [], data }) {
    // Data from Generals
    const phoneContact =
        generals.find((g) => g.correlative === "phone_contact")?.description ||
        "";
    const emailContact =
        generals.find((g) => g.correlative === "email_contact")?.description ||
        "ayuda@rainstarstore.com";
    const openingHours =
        generals.find((g) => g.correlative === "opening_hours")?.description ||
        "Lunes — Sábado: 09:00 - 18:00";

    const [messageCaptcha, setMessageCaptcha] = useState("");
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [formLoadedAt, setFormLoadedAt] = useState(null);

    // Referencia para el captcha
    const captchaRef = useRef();

    // Registrar tiempo de carga del formulario y verificar si hay un código en la URL
    useEffect(() => {
        setFormLoadedAt(Math.floor(Date.now() / 1000));

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            fetch(`/api/complaints/track/${code}`)
                .then((res) => res.json())
                .then((res) => {
                    if (res.type === "success") {
                        setSubmittedData(res.data);
                        setShowThankYou(true);
                    } else {
                        // Si no existe el código, limpiamos la URL
                        const url = new URL(window.location);
                        url.searchParams.delete("code");
                        window.history.pushState({}, "", url);
                    }
                })
                .catch(() => {
                    const url = new URL(window.location);
                    url.searchParams.delete("code");
                    window.history.pushState({}, "", url);
                });
        }
    }, []);

    const [formData, setFormData] = useState({
        nombre: "",
        tipo_documento: "",
        numero_identidad: "",
        celular: "",
        correo_electronico: "",
        departamento: "",
        provincia: "",
        distrito: "",
        direccion: "",
        tipo_producto: "",
        monto_reclamado: "",
        descripcion_producto: "",
        tipo_reclamo: "",
        fecha_ocurrencia: "",
        numero_pedido: "",
        detalle_reclamo: "",
        acepta_terminos: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Validar campos de fecha para limitar el año a 4 dígitos
        if (type === "date" && value) {
            const [year] = value.split("-");
            if (year && year.length > 4) {
                return; // No permitir más de 4 dígitos en el año
            }
        }

        // Validación específica para número de documento
        if (name === "numero_identidad") {
            const validation = validateDocument(formData.tipo_documento, value);
            if (!validation.isValid) {
                // Truncar al máximo permitido si el usuario intenta pegar algo más largo
                setFormData({
                    ...formData,
                    [name]: value.substring(0, validation.maxLength),
                });
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setFormData({
            nombre: "",
            tipo_documento: "",
            numero_identidad: "",
            celular: "",
            correo_electronico: "",
            departamento: "",
            provincia: "",
            distrito: "",
            direccion: "",
            tipo_producto: "",
            monto_reclamado: "",
            descripcion_producto: "",
            tipo_reclamo: "",
            fecha_ocurrencia: "",
            numero_pedido: "",
            detalle_reclamo: "",
            acepta_terminos: false,
        });
        setDepartamento("");
        setProvincia("");
        setDistrito("");
        setIsCaptchaVerified(false);
        setCaptchaToken(null);
        setMessageCaptcha("");

        // Resetear el captcha usando la referencia
        if (captchaRef.current) {
            captchaRef.current.reset();
        }
    };

    // Función para manejar la verificación del captcha
    const handleCaptchaVerify = (isVerified, token) => {
        setIsCaptchaVerified(isVerified);
        setCaptchaToken(token);
        if (isVerified) {
            setMessageCaptcha(""); // Limpiar cualquier mensaje de error
        }
    };

    // Función para volver al formulario desde la página de agradecimiento
    const handleBackToForm = () => {
        setShowThankYou(false);
        setSubmittedData(null);
        // Limpiar URL
        const url = new URL(window.location);
        url.searchParams.delete("code");
        window.history.pushState({}, "", url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isCaptchaVerified || !captchaToken) {
            setMessageCaptcha(
                "Por favor, completa la verificación de seguridad.",
            );
            setLoading(false);
            return;
        }

        // Limpiar mensaje de error del captcha
        setMessageCaptcha("");

        const updatedFormData = {
            ...formData,
            captcha_verified: true,
            recaptcha_token: captchaToken,
            _form_loaded_at: formLoadedAt,
            _hp: "",
        };
        fetch("/api/complaints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.type === "success") {
                    setSubmittedData(data.data);
                    setShowThankYou(true);

                    // Actualizar URL con el código del reclamo
                    const url = new URL(window.location);
                    url.searchParams.set("code", data.data.code);
                    window.history.pushState({}, "", url);

                    resetForm();
                    setLoading(false);
                } else {
                    toast.error("Error al enviar", {
                        description: `Lo sentimos, no se envió su solicitud.`,
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.error("Error inesperado", {
                    description: error || `Error de conexión.`,
                });
                setLoading(false);
            });
    };

    const [departamento, setDepartamento] = useState("");
    const [provincia, setProvincia] = useState("");
    const [distrito, setDistrito] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    useEffect(() => {
        const uniqueDepartamentos = [
            ...new Set(ubigeoData.map((item) => item.departamento)),
        ];
        setDepartamentos(uniqueDepartamentos);
    }, []);

    useEffect(() => {
        if (departamento) {
            const filteredProvincias = [
                ...new Set(
                    ubigeoData
                        .filter((item) => item.departamento === departamento)
                        .map((item) => item.provincia),
                ),
            ];
            setProvincias(filteredProvincias);
            setProvincia("");
            setDistrito("");
            setDistritos([]);
            setFormData((prev) => ({
                ...prev,
                departamento: departamento,
                provincia: "",
                distrito: "",
            }));
        }
    }, [departamento]);

    useEffect(() => {
        if (provincia) {
            const filteredDistritos = ubigeoData
                .filter(
                    (item) =>
                        item.departamento === departamento &&
                        item.provincia === provincia,
                )
                .map((item) => item.distrito);
            setDistritos(filteredDistritos);
            setDistrito("");
            setFormData((prev) => ({
                ...prev,
                provincia: provincia,
                distrito: "",
            }));
        }
    }, [provincia]);

    useEffect(() => {
        if (distrito) {
            setFormData((prev) => ({ ...prev, distrito: distrito }));
        }
    }, [distrito]);

    const typesDocument = getDocumentTypesOptions();
    const typesContract = [
        { value: "producto", label: "Producto" },
        { value: "servicio", label: "Servicio" },
    ];
    const typesClaim = [
        { value: "reclamo", label: "Reclamo" },
        { value: "queja", label: "Queja" },
    ];

    const [modalOpen, setModalOpen] = useState(null);

    const policyItems = {
        terms_conditions: "Términos y condiciones",
    };

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    if (showThankYou && submittedData) {
        return (
            <ThankYouRainstar
                complaintData={submittedData}
                onBackToForm={handleBackToForm}
            />
        );
    }

    const rainstarLabelClass =
        "text-xs font-bold tracking-widest text-neutral-400 block mb-1.5";

    return (
        <section
            id={data?.element_id || null}
            className="bg-white min-h-screen pt-20 pb-32"
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 border-b-[6px] border-neutral-dark pb-12"
                    >
                        <div className="max-w-4xl">
                            <span className="text-[11px] font-bold text-primary mb-6 block">
                                Tu tranquilidad es prioridad
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-neutral-dark mb-4">
                                <TextWithHighlight
                                    text={
                                        data?.title || "Libro de Reclamaciones"
                                    }
                                />
                            </h1>
                        </div>
                        <div className="hidden md:block max-w-[280px]">
                            <p className="text-right text-[11px] font-medium text-neutral-dark leading-relaxed italic">
                                {data?.description ||
                                    "En Rainstar valoramos tu experiencia. Si algo no cumplió con tus expectativas, permítenos corregirlo de inmediato."}
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 order-2 lg:order-1">
                        <div className="sticky top-32 space-y-12">
                            <div className="p-8 bg-neutral-50 border-l-[6px] border-neutral-dark">
                                <h3 className="text-sm font-black mb-8 text-neutral-dark">
                                    Información Útil
                                </h3>
                                <ul className="space-y-8">
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 bg-neutral-dark text-white flex items-center justify-center text-[10px] font-black">
                                            01
                                        </div>
                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-bold">
                                            Tu reclamo será atendido en un plazo
                                            máximo de 15 días calendario.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 bg-neutral-dark text-white flex items-center justify-center text-[10px] font-black">
                                            02
                                        </div>
                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-bold">
                                            Recibirás una copia de este reclamo
                                            en tu correo electrónico.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 bg-neutral-dark text-white flex items-center justify-center text-[10px] font-black">
                                            03
                                        </div>
                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-bold">
                                            Los datos personales proporcionados
                                            son estrictamente confidenciales.
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-6 pt-12 border-t border-neutral-100">
                                <h4 className="text-[11px] font-bold text-primary block">
                                    Atención Directa
                                </h4>
                                <div className="space-y-6">
                                    {emailContact && (
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-400 mb-1">
                                                Email
                                            </p>
                                            <p className="text-sm font-black text-neutral-dark">
                                                {emailContact}
                                            </p>
                                        </div>
                                    )}
                                    {phoneContact && (
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-400 mb-1">
                                                Teléfono
                                            </p>
                                            <p className="text-sm font-black text-neutral-dark">
                                                {phoneContact}
                                            </p>
                                        </div>
                                    )}
                                    {openingHours && (
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-400 mb-1">
                                                Horario
                                            </p>
                                            <p className="text-sm font-medium text-neutral-500 leading-relaxed">
                                                {openingHours}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form area */}
                    <div className="lg:col-span-8 order-1 lg:order-2">
                        <form onSubmit={handleSubmit} className="space-y-20">
                            <div className="space-y-12">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                        01
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight text-neutral-dark">
                                        Identificación del Consumidor
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Nombre Completo"
                                            name="nombre"
                                            placeholder="Ej. John Doe"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid col-span-2 grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                        <div className="md:col-span-1">
                                            <SelectField
                                                label="Tipo de Documento"
                                                options={typesDocument}
                                                placeholder="Selecciona una opción"
                                                value={formData.tipo_documento}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const validation =
                                                        validateDocument(
                                                            val,
                                                            formData.numero_identidad,
                                                        );
                                                    setFormData((p) => ({
                                                        ...p,
                                                        tipo_documento: val,
                                                        numero_identidad:
                                                            p.numero_identidad.substring(
                                                                0,
                                                                validation.maxLength,
                                                            ),
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <InputField
                                                label="Nº Documento"
                                                name="numero_identidad"
                                                placeholder="00000000"
                                                value={
                                                    formData.numero_identidad
                                                }
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <InputField
                                        label="Teléfono Móvil"
                                        name="celular"
                                        placeholder="+51 999 999 999"
                                        value={formData.celular}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Email"
                                        name="correo_electronico"
                                        placeholder="correo@ejemplo.com"
                                        value={formData.correo_electronico}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                        02
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight text-neutral-dark">
                                        Ubicación
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                                    <SelectField
                                        label="Departamento"
                                        options={departamentos}
                                        placeholder="Selecciona"
                                        value={departamento}
                                        onChange={(e) =>
                                            setDepartamento(e.target.value)
                                        }
                                    />
                                    <SelectField
                                        label="Provincia"
                                        disabled={!departamento}
                                        options={provincias}
                                        placeholder="Selecciona"
                                        value={provincia}
                                        onChange={(e) =>
                                            setProvincia(e.target.value)
                                        }
                                    />
                                    <SelectField
                                        label="Distrito"
                                        disabled={!provincia}
                                        options={distritos}
                                        placeholder="Selecciona"
                                        value={distrito}
                                        onChange={(e) =>
                                            setDistrito(e.target.value)
                                        }
                                    />
                                    <div className="md:col-span-3">
                                        <InputField
                                            label="Dirección de Domicilio"
                                            name="direccion"
                                            placeholder="Ej. Av. Principal 123, Urbanización..."
                                            value={formData.direccion}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                        03
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight text-neutral-dark">
                                        Bien Contratado
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    <SelectField
                                        label="Tipo"
                                        options={typesContract}
                                        placeholder="Selecciona una opción"
                                        value={formData.tipo_producto}
                                        onChange={(e) =>
                                            setFormData((p) => ({
                                                ...p,
                                                tipo_producto: e.target.value,
                                            }))
                                        }
                                    />
                                    <InputField
                                        label={`Monto (${CurrencySymbol()})`}
                                        type="number"
                                        name="monto_reclamado"
                                        placeholder="0.00"
                                        value={formData.monto_reclamado}
                                        onChange={handleChange}
                                    />
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Descripción del Producto o Servicio"
                                            name="descripcion_producto"
                                            placeholder="Ej. Nombre del producto, talla o modelo"
                                            value={
                                                formData.descripcion_producto
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                        04
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight text-neutral-dark">
                                        Detalle de la Solicitud
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    <SelectField
                                        label="Tipo de Solicitud"
                                        options={typesClaim}
                                        placeholder="Selecciona una opción"
                                        value={formData.tipo_reclamo}
                                        onChange={(e) =>
                                            setFormData((p) => ({
                                                ...p,
                                                tipo_reclamo: e.target.value,
                                            }))
                                        }
                                    />
                                    <InputField
                                        label="Fecha de Ocurrencia"
                                        type="date"
                                        name="fecha_ocurrencia"
                                        value={formData.fecha_ocurrencia}
                                        onChange={handleChange}
                                    />
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Nº Pedido (Opcional)"
                                            name="numero_pedido"
                                            placeholder="Ej. #12345"
                                            value={formData.numero_pedido}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className={rainstarLabelClass}>
                                            Detalles del Reclamo o Queja
                                        </label>
                                        <textarea
                                            name="detalle_reclamo"
                                            placeholder="Describe lo sucedido con el mayor detalle posible..."
                                            value={formData.detalle_reclamo}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full border-2 border-gray-200 p-4 font-medium outline-none transition-all bg-white text-neutral-800 placeholder-neutral-300 focus:border-black hover:border-gray-400 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                        05
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight text-neutral-dark">
                                        Confirmación
                                    </h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4 p-8 bg-neutral-dark text-white border-l-[6px] border-primary">
                                        <input
                                            type="checkbox"
                                            id="terminos"
                                            name="acepta_terminos"
                                            className="mt-1 w-4 h-4 accent-primary bg-transparent border-white"
                                            checked={formData.acepta_terminos}
                                            onChange={handleChange}
                                        />
                                        <label
                                            htmlFor="terminos"
                                            className="text-[11px] leading-relaxed font-bold"
                                        >
                                            Declaro que la información es
                                            conforme y acepto los{" "}
                                            <button
                                                type="button"
                                                onClick={() => openModal(0)}
                                                className="underline hover:text-primary transition-colors font-black"
                                            >
                                                términos y condiciones
                                            </button>{" "}
                                            del libro de reclamaciones de
                                            Rainstar.
                                        </label>
                                    </div>

                                    <div className="border border-neutral-100 p-10 flex justify-center bg-neutral-50/50">
                                        <CustomCaptcha
                                            ref={captchaRef}
                                            onVerify={handleCaptchaVerify}
                                            error={messageCaptcha}
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-neutral-100">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-12 py-5 text-[11px] font-black uppercase tracking-widest border-2 border-neutral-dark hover:bg-neutral-dark hover:text-white transition-all duration-500"
                                        >
                                            Limpiar Formulario
                                        </button>
                                        <button
                                            disabled={
                                                loading ||
                                                !formData.acepta_terminos ||
                                                !isCaptchaVerified
                                            }
                                            type="submit"
                                            className="flex-1 px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] bg-neutral-dark text-white hover:bg-primary disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center gap-4 group shadow-xl"
                                        >
                                            {loading ? (
                                                <Loader2
                                                    className="animate-spin"
                                                    size={16}
                                                />
                                            ) : (
                                                <>
                                                    Registrar Reclamo
                                                    <ArrowRight
                                                        size={14}
                                                        className="group-hover:translate-x-2 transition-transform duration-500"
                                                    />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modals para términos y condiciones */}
            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content = Array.isArray(generals)
                    ? (generals.find((x) => x.correlative == key)
                          ?.description ?? "")
                    : "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed inset-0 flex items-center justify-center p-4 z-[999999]"
                        overlayClassName="fixed inset-0 bg-black/90 z-[999998]"
                        ariaHideApp={false}
                    >
                        <div className="bg-white w-full max-w-4xl max-h-[85vh] flex flex-col relative !rounded-none">
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-12 pb-6">
                                <h2 className="text-3xl font-black uppercase tracking-tighter">
                                    {title}
                                </h2>
                                <div className="w-12 h-[2px] bg-black mt-4"></div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-12 pb-12 text-justify">
                                <div className="prose prose-neutral max-w-none prose-p:text-neutral-600 prose-headings:uppercase prose-headings:tracking-tighter font-medium text-sm leading-loose">
                                    <HtmlContent html={content} />
                                </div>
                            </div>

                            <div className="p-12 pt-0 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:border-b-2 transition-all"
                                >
                                    Cerrar ×
                                </button>
                            </div>
                        </div>
                    </ReactModal>
                );
            })}
        </section>
    );
}
