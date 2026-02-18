import { useEffect, useRef, useState } from "react";
import InputForm from "../Checkouts/Components/InputForm";
import ubigeoData from "../../../../../storage/app/utils/ubigeo.json";
import SelectForm from "../Checkouts/Components/SelectForm";
import CustomCaptcha from "./CustomCaptcha";
import ThankYouRainstar from "./ThankYouRainstar";
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
} from "lucide-react";
import { toast } from "sonner";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import Global from "../../../Utils/Global";

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

    const rainstarInputClass =
        "!rounded-none !border-x-0 !border-t-0 border-b border-neutral-900 !px-0 py-4 bg-transparent focus:!ring-0 focus:!outline-none focus:!border-x-0 focus:!border-t-0 focus:border-b-1 text-xs uppercase tracking-widest placeholder:text-neutral-300 transition-all font-medium";
    const rainstarLabelClass =
        "text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2 block";

    return (
        <section
            id={data?.element_id || null}
            className="bg-white min-h-screen pt-20 pb-32"
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="max-w-3xl">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                                Servicio al Cliente
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                                Libro de <br /> Reclamaciones
                            </h1>
                            <p className="text-neutral-500 text-lg max-w-xl leading-relaxed">
                                En {Global.APP_NAME} valoramos tu experiencia.
                                Si algo no cumplió con tus expectativas,
                                permítenos corregirlo.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-24 h-[1px] bg-neutral-900 mb-4"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                Formulario Oficial
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 order-2 lg:order-1">
                        <div className="sticky top-32 space-y-12">
                            <div className="p-8 bg-neutral-50 border border-neutral-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-neutral-200 pb-4">
                                    Información Útil
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-none bg-black text-white flex items-center justify-center text-[10px] font-bold">
                                            01
                                        </div>
                                        <p className="text-xs text-neutral-600 leading-relaxed uppercase tracking-wider font-medium">
                                            Tu reclamo será atendido en un plazo
                                            máximo de 15 días calendario.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-none bg-black text-white flex items-center justify-center text-[10px] font-bold">
                                            02
                                        </div>
                                        <p className="text-xs text-neutral-600 leading-relaxed uppercase tracking-wider font-medium">
                                            Recibirás una copia de este reclamo
                                            en tu correo electrónico.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-none bg-black text-white flex items-center justify-center text-[10px] font-bold">
                                            03
                                        </div>
                                        <p className="text-xs text-neutral-600 leading-relaxed uppercase tracking-wider font-medium">
                                            Los datos personales proporcionados
                                            son estrictamente confidenciales.
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                                    Atención Directa
                                </h4>
                                <div className="space-y-4">
                                    {emailContact && (
                                        <div className="group">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                                                Email
                                            </p>
                                            <p className="text-xs font-bold tracking-widest uppercase transition-colors group-hover:text-neutral-500">
                                                {emailContact}
                                            </p>
                                        </div>
                                    )}
                                    {phoneContact && (
                                        <div className="group">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                                                Teléfono
                                            </p>
                                            <p className="text-xs font-bold tracking-widest uppercase transition-colors group-hover:text-neutral-500">
                                                {phoneContact}
                                            </p>
                                        </div>
                                    )}
                                    {openingHours && (
                                        <div className="group">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                                                Horario
                                            </p>
                                            <p className="text-xs font-medium whitespace-pre-line text-neutral-500 uppercase tracking-widest leading-loose">
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
                            {/* Section 1: Consumer ID */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                                    <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                                        01
                                    </span>
                                    <h2 className="text-xl font-bold uppercase tracking-tighter">
                                        Identificación del Consumidor
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    <div className="md:col-span-2">
                                        <InputForm
                                            label="Nombre Completo"
                                            name="nombre"
                                            placeholder="EJ. JOHN DOE"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className={rainstarInputClass}
                                            labelClass={rainstarLabelClass}
                                        />
                                    </div>
                                    <div className="grid col-span-2 grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                        <div className="md:col-span-1">
                                            <SelectForm
                                                label="Tipo de Documento"
                                                options={typesDocument}
                                                placeholder="SELECCIONA UNA OPCIÓN"
                                                value={formData.tipo_documento}
                                                onChange={(val) => {
                                                    const validation =
                                                        validateDocument(
                                                            val,
                                                            formData.numero_identidad,
                                                        );
                                                    setFormData((p) => ({
                                                        ...p,
                                                        tipo_documento: val,
                                                        // Truncar el número actual si excede el nuevo límite
                                                        numero_identidad:
                                                            p.numero_identidad.substring(
                                                                0,
                                                                validation.maxLength,
                                                            ),
                                                    }));
                                                }}
                                                className={rainstarInputClass}
                                                labelClass={rainstarLabelClass}
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <InputForm
                                                label="Nº Documento"
                                                name="numero_identidad"
                                                placeholder="00000000"
                                                value={
                                                    formData.numero_identidad
                                                }
                                                onChange={handleChange}
                                                className={rainstarInputClass}
                                                labelClass={rainstarLabelClass}
                                            />
                                        </div>
                                    </div>
                                    <InputForm
                                        label="Teléfono Móvil"
                                        name="celular"
                                        placeholder="+51 999 999 999"
                                        value={formData.celular}
                                        onChange={handleChange}
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <InputForm
                                        label="Email"
                                        name="correo_electronico"
                                        placeholder="HELLO@EMAIL.COM"
                                        value={formData.correo_electronico}
                                        onChange={handleChange}
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Ubicación */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                                    <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                                        02
                                    </span>
                                    <h2 className="text-xl font-bold uppercase tracking-tighter">
                                        Ubicación
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                                    <SelectForm
                                        label="Departamento"
                                        options={departamentos}
                                        placeholder="SELECCIONA"
                                        value={departamento}
                                        onChange={setDepartamento}
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <SelectForm
                                        label="Provincia"
                                        disabled={!departamento}
                                        options={provincias}
                                        placeholder="SELECCIONA"
                                        value={provincia}
                                        onChange={setProvincia}
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <SelectForm
                                        label="Distrito"
                                        disabled={!provincia}
                                        options={distritos}
                                        placeholder="SELECCIONA"
                                        value={distrito}
                                        onChange={setDistrito}
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <div className="md:col-span-3">
                                        <InputForm
                                            label="Dirección de Domicilio"
                                            name="direccion"
                                            placeholder="AV. PRINCIPAL 123, URBANIZACIÓN..."
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className={rainstarInputClass}
                                            labelClass={rainstarLabelClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Product Info */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                                    <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                                        03
                                    </span>
                                    <h2 className="text-xl font-bold uppercase tracking-tighter">
                                        Bien Contratado
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    <SelectForm
                                        label="Tipo"
                                        options={typesContract}
                                        placeholder="SELECCIONA UNA OPCIÓN"
                                        value={formData.tipo_producto}
                                        onChange={(val) =>
                                            setFormData((p) => ({
                                                ...p,
                                                tipo_producto: val,
                                            }))
                                        }
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <InputForm
                                        label={`Monto (${CurrencySymbol()})`}
                                        type="number"
                                        name="monto_reclamado"
                                        placeholder="0.00"
                                        value={formData.monto_reclamado}
                                        onChange={handleChange}
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <div className="md:col-span-2">
                                        <InputForm
                                            label="Descripción del Producto o Servicio"
                                            name="descripcion_producto"
                                            placeholder="NOMBRE DEL PRODUCTO, TALLA, MODELO O REFERENCIA"
                                            value={
                                                formData.descripcion_producto
                                            }
                                            onChange={handleChange}
                                            className={rainstarInputClass}
                                            labelClass={rainstarLabelClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Reclamo */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                                    <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                                        04
                                    </span>
                                    <h2 className="text-xl font-bold uppercase tracking-tighter">
                                        Detalle de la Solicitud
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    <SelectForm
                                        label="Tipo de Solicitud"
                                        options={typesClaim}
                                        placeholder="SELECCIONA UNA OPCIÓN"
                                        value={formData.tipo_reclamo}
                                        onChange={(val) =>
                                            setFormData((p) => ({
                                                ...p,
                                                tipo_reclamo: val,
                                            }))
                                        }
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <InputForm
                                        label="Fecha de Ocurrencia"
                                        type="date"
                                        name="fecha_ocurrencia"
                                        value={formData.fecha_ocurrencia}
                                        onChange={handleChange}
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    <div className="md:col-span-2">
                                        <InputForm
                                            label="Nº Pedido (Opcional)"
                                            name="numero_pedido"
                                            placeholder="#12345"
                                            value={formData.numero_pedido}
                                            onChange={handleChange}
                                            className={rainstarInputClass}
                                            labelClass={rainstarLabelClass}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className={rainstarLabelClass}>
                                            Detalles del Reclamo o Queja
                                        </label>
                                        <textarea
                                            name="detalle_reclamo"
                                            placeholder="DESCRIBE LO SUCEDIDO CON EL MAYOR DETALLE POSIBLE..."
                                            value={formData.detalle_reclamo}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full !border-x-0 !border-t-0 border-b border-neutral-900 p-0 focus:!ring-0 focus:!outline-none focus:!border-x-0 focus:!border-t-0 focus:border-b-2 transition-all uppercase text-xs tracking-widest placeholder:text-neutral-300 font-medium bg-transparent resize-none py-4"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Verification */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                                    <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                                        05
                                    </span>
                                    <h2 className="text-xl font-bold uppercase tracking-tighter">
                                        Confirmación
                                    </h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4 p-8 bg-black text-white">
                                        <input
                                            type="checkbox"
                                            id="terminos"
                                            name="acepta_terminos"
                                            className="mt-1 w-4 h-4 accent-white bg-transparent border-white"
                                            checked={formData.acepta_terminos}
                                            onChange={handleChange}
                                        />
                                        <label
                                            htmlFor="terminos"
                                            className="text-[10px] uppercase tracking-widest leading-relaxed font-bold"
                                        >
                                            Declaro que la información es
                                            conforme y acepto los{" "}
                                            <button
                                                type="button"
                                                onClick={() => openModal(0)}
                                                className="underline hover:text-neutral-300 transition-colors"
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
                                            className="px-12 py-5 text-[10px] font-bold uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-all duration-300"
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
                                            className="flex-1 px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:brightness-125 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group"
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
                                                        className="group-hover:translate-x-1 transition-transform"
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
