import { useEffect, useRef, useState } from "react";
import InputFormTwenty from "../Checkouts/Components/InputFormTwenty";
import SelectFormTwenty from "../Checkouts/Components/SelectFormTwenty";
import ubigeoData from "../../../../../storage/app/utils/ubigeo.json";
import CustomCaptcha from "./CustomCaptcha";
import ThankYouTwenty from "./ThankYouTwenty";

import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import { Send, X, FileText, User, MapPin, Package, AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

export default function ComplaintTwenty({ generals = [], data }) {
    const [messageCaptcha, setMessageCaptcha] = useState("");
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [formLoadedAt, setFormLoadedAt] = useState(null);

    const captchaRef = useRef();

    useEffect(() => {
        setFormLoadedAt(Math.floor(Date.now() / 1000));
    }, []);

    const [formData, setFormData] = useState({
        nombre: "",
        tipo_documento: "ruc",
        numero_identidad: "",
        celular: "",
        correo_electronico: "",
        departamento: "",
        provincia: "",
        distrito: "",
        direccion: "",
        tipo_producto: "producto",
        monto_reclamado: "",
        descripcion_producto: "",
        tipo_reclamo: "reclamo",
        fecha_ocurrencia: "",
        numero_pedido: "",
        detalle_reclamo: "",
        acepta_terminos: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "date" && value) {
            const [year] = value.split("-");
            if (year && year.length > 4) {
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const resetForm = () => {
        setFormData({
            nombre: "",
            tipo_documento: "ruc",
            numero_identidad: "",
            celular: "",
            correo_electronico: "",
            departamento: "",
            provincia: "",
            distrito: "",
            direccion: "",
            tipo_producto: "producto",
            monto_reclamado: "",
            descripcion_producto: "",
            tipo_reclamo: "reclamo",
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

        if (captchaRef.current) {
            captchaRef.current.reset();
        }
    };

    const handleCaptchaVerify = (isVerified, token) => {
        setIsCaptchaVerified(isVerified);
        setCaptchaToken(token);
        if (isVerified) {
            setMessageCaptcha("");
        }
    };

    const handleBackToForm = () => {
        setShowThankYou(false);
        setSubmittedData(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isCaptchaVerified || !captchaToken) {
            setMessageCaptcha("Por favor, completa la verificación de seguridad.");
            setLoading(false);
            return;
        }

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
                    resetForm();
                    setLoading(false);
                } else {
                    toast.error("Solicitud rechazada", {
                        description: `No se pudo registrar su solicitud.`,
                        icon: <Send className="h-5 w-5 text-red-500" />,
                        duration: 3000,
                        position: "bottom-center",
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.error("Solicitud rechazada", {
                    description: error.message || `No se pudo registrar su solicitud.`,
                    icon: <Send className="h-5 w-5 text-red-500" />,
                    duration: 3000,
                    position: "bottom-center",
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
                        .map((item) => item.provincia)
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
                        item.provincia === provincia
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

    const typesDocument = [
        { value: "ruc", label: "RUC" },
        { value: "dni", label: "DNI" },
        { value: "ce", label: "CE" },
        { value: "pasaporte", label: "Pasaporte" },
    ];
    const typesContract = [
        { value: "producto", label: "Producto" },
        { value: "servicio", label: "Servicio" },
    ];
    const typesClaim = [
        { value: "reclamo", label: "Reclamo" },
        { value: "queja", label: "Queja" },
    ];

    const [modalOpen, setModalOpen] = useState(false);

    const policyItems = {
        terms_conditions: "Términos y condiciones",
    };

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    if (showThankYou && submittedData) {
        return (
            <ThankYouTwenty
                complaintData={submittedData}
                onBackToForm={handleBackToForm}
                data={data}
            />
        );
    }

    return (
        <div id={data?.element_id || null} className="min-h-screen bg-black text-white w-full px-4 py-16 font-paragraph">
            {/* Inline Captcha styling overrides for brutalist dark style */}
            <style>{`
                .captcha-container img {
                    border: 2px solid rgba(255,255,255,0.2) !important;
                    border-radius: 0px !important;
                }
                .captcha-container button {
                    background: transparent !important;
                    border: 2px solid rgba(255,255,255,0.2) !important;
                    border-radius: 0px !important;
                    color: white !important;
                }
                .captcha-container button:hover {
                    border-color: white !important;
                }
                .captcha-container input {
                    border: 2px solid rgba(255,255,255,0.2) !important;
                    background: transparent !important;
                    color: white !important;
                    border-radius: 0px !important;
                }
                .captcha-container input:focus {
                    border-color: white !important;
                    box-shadow: none !important;
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-3">
                        Servicio de Atención al Cliente
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
                        Libro de Reclamaciones
                    </h1>
                    <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
                        Completa este formulario de registro oficial para enviarnos tu reclamo o queja.
                    </p>
                </div>

                <div className="bg-black border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.15)] rounded-none">
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-12">
                        {/* Campo Honeypot para spam bots */}
                        <input
                            type="text"
                            name="_hp"
                            tabIndex="-1"
                            autoComplete="off"
                            className="hidden pointer-events-none opacity-0"
                            aria-hidden="true"
                        />

                        {/* Sección 1: Identificación del Consumidor */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                    <User className="w-5 h-5 stroke-[2]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-wider text-white">
                                        1. Identificación del Consumidor
                                    </h2>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Ingresa tus datos personales</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <InputFormTwenty
                                        type="text"
                                        label="Nombres completos"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Escribe tu nombre y apellidos"
                                        required
                                    />
                                </div>
                                <SelectFormTwenty
                                    label="Tipo de documento"
                                    options={typesDocument}
                                    placeholder="Seleccionar documento"
                                    value={formData.tipo_documento}
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipo_documento: value,
                                        }));
                                    }}
                                />
                                <InputFormTwenty
                                    type="text"
                                    label="Número de documento"
                                    name="numero_identidad"
                                    value={formData.numero_identidad}
                                    onChange={handleChange}
                                    placeholder="Ingresa el número"
                                    required
                                />
                                <InputFormTwenty
                                    type="tel"
                                    label="Número de celular"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    placeholder="Ej: 999999999"
                                    required
                                />
                                <InputFormTwenty
                                    type="email"
                                    label="Correo electrónico"
                                    name="correo_electronico"
                                    value={formData.correo_electronico}
                                    onChange={handleChange}
                                    placeholder="tu@correo.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Sección 2: Ubicación */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                    <MapPin className="w-5 h-5 stroke-[2]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-wider text-white">
                                        2. Ubicación
                                    </h2>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Indica tu domicilio actual</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SelectFormTwenty
                                    label="Departamento"
                                    options={departamentos}
                                    placeholder="Seleccionar"
                                    value={departamento}
                                    onChange={(value) => {
                                        setDepartamento(value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            departamento: value,
                                        }));
                                    }}
                                />
                                <SelectFormTwenty
                                    disabled={!departamento}
                                    label="Provincia"
                                    options={provincias}
                                    placeholder="Seleccionar"
                                    value={provincia}
                                    onChange={(value) => {
                                        setProvincia(value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            provincia: value,
                                        }));
                                    }}
                                />
                                <SelectFormTwenty
                                    disabled={!provincia}
                                    label="Distrito"
                                    options={distritos}
                                    placeholder="Seleccionar"
                                    value={distrito}
                                    onChange={(value) => {
                                        setDistrito(value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            distrito: value,
                                        }));
                                    }}
                                />
                            </div>
                            <InputFormTwenty
                                type="text"
                                label="Dirección completa"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Ej: Av. Brasil 1450, Dpto 402"
                                required
                            />
                        </div>

                        {/* Sección 3: Detalle del bien contratado */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                    <Package className="w-5 h-5 stroke-[2]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-wider text-white">
                                        3. Identificación del Bien Contratado
                                    </h2>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Detalles del producto o servicio</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <SelectFormTwenty
                                        label="Tipo de contratación"
                                        options={typesContract}
                                        placeholder="Seleccionar"
                                        value={formData.tipo_producto}
                                        onChange={(value) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                tipo_producto: value,
                                            }));
                                        }}
                                    />
                                </div>
                                <InputFormTwenty
                                    type="number"
                                    label={`Monto reclamado (${CurrencySymbol()})`}
                                    name="monto_reclamado"
                                    value={formData.monto_reclamado}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                                <InputFormTwenty
                                    type="text"
                                    label="Descripción del producto o servicio"
                                    name="descripcion_producto"
                                    value={formData.descripcion_producto}
                                    onChange={handleChange}
                                    placeholder="Ej: Zapatillas Urbanas Modelo X"
                                    required
                                />
                            </div>
                        </div>

                        {/* Sección 4: Detalle de la reclamación */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                    <AlertTriangle className="w-5 h-5 stroke-[2]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-wider text-white">
                                        4. Detalles del Reclamo o Queja
                                    </h2>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Describe el incidente</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectFormTwenty
                                    label="Tipo de reclamación"
                                    options={typesClaim}
                                    placeholder="Seleccionar"
                                    value={formData.tipo_reclamo}
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipo_reclamo: value,
                                        }));
                                    }}
                                />
                                <InputFormTwenty
                                    type="date"
                                    label="Fecha de ocurrencia"
                                    name="fecha_ocurrencia"
                                    value={formData.fecha_ocurrencia}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split("T")[0]}
                                    min="2020-01-01"
                                    required
                                />
                                <div className="md:col-span-2">
                                    <InputFormTwenty
                                        type="text"
                                        label="Número de pedido / Compra (Opcional)"
                                        name="numero_pedido"
                                        value={formData.numero_pedido}
                                        onChange={handleChange}
                                        placeholder="Ej: 202506241427"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/50 mb-1">
                                        Detalle del reclamo o queja
                                    </label>
                                    <textarea
                                        name="detalle_reclamo"
                                        placeholder="Detalla de forma clara el inconveniente presentado con el producto o servicio adquirido..."
                                        className="w-full min-h-[140px] px-4 py-3 bg-transparent border border-white/20 text-white font-paragraph placeholder:text-white/30 rounded-none focus:border-white focus:ring-0 focus:outline-none transition-all duration-300 resize-none"
                                        value={formData.detalle_reclamo}
                                        onChange={handleChange}
                                        required
                                    />
                                    <p className="text-[10px] font-mono uppercase text-white/30 text-right mt-1">
                                        Recomendado: Describir claramente la disconformidad
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sección 5: Verificación y términos */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                    <Shield className="w-5 h-5 stroke-[2]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-wider text-white">
                                        5. Términos y Verificación
                                    </h2>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Confirmación de seguridad</p>
                                </div>
                            </div>

                            <div className="border border-white/15 bg-white/5 p-5 rounded-none">
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        id="acepta_terminos"
                                        name="acepta_terminos"
                                        className="mt-1 w-5 h-5 border-white/20 bg-transparent text-black focus:ring-0 rounded-none cursor-pointer"
                                        checked={formData.acepta_terminos}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="acepta_terminos" className="text-xs text-white/60 font-paragraph uppercase tracking-wide leading-relaxed cursor-pointer select-none">
                                        Declaro que la información registrada es real y acepto los{" "}
                                        <button
                                            type="button"
                                            onClick={() => openModal(0)}
                                            className="text-white underline font-bold hover:text-white/80 transition-colors"
                                        >
                                            términos y condiciones
                                        </button>{" "}
                                        del libro de reclamaciones virtual.
                                    </label>
                                </div>
                            </div>

                            <div className="border border-white/15 bg-[#080808] p-5 rounded-none captcha-container">
                                <CustomCaptcha
                                    ref={captchaRef}
                                    onVerify={handleCaptchaVerify}
                                    error={messageCaptcha}
                                />
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="pt-8 border-t border-white/10">
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-4 bg-transparent border-2 border-white/20 hover:border-white text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 rounded-none"
                                >
                                    Limpiar
                                </button>
                                <button
                                    disabled={loading || !formData.acepta_terminos || !isCaptchaVerified}
                                    type="submit"
                                    className="px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 rounded-none flex items-center justify-center gap-3 shrink-0"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                                            <span>Registrando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 stroke-[2.5]" />
                                            <span>Enviar Reclamo</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-[10px] font-mono text-white/30 mt-6 text-center uppercase tracking-widest">
                                El registro de este reclamo será procesado según la legislación de protección al consumidor vigente.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal para términos y condiciones */}
            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content = Array.isArray(generals)
                    ? generals.find((x) => x.correlative === key)?.description ?? ""
                    : "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed inset-0 m-auto max-w-4xl max-h-[85vh] bg-black border-4 border-white text-white outline-none flex flex-col z-[99999]"
                        overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-md z-[99998]"
                        ariaHideApp={false}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/15">
                            <h2 className="text-xl font-black uppercase tracking-wider">{title}</h2>
                            <button
                                onClick={closeModal}
                                className="text-white/50 hover:text-white transition-colors duration-200 border-2 border-white/10 p-2 hover:border-white rounded-none"
                                aria-label="Cerrar modal"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 font-paragraph leading-relaxed text-sm text-white/70">
                            <div className="prose prose-invert max-w-none">
                                <HtmlContent html={content} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end p-6 border-t border-white/15">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/90 transition-all rounded-none"
                            >
                                Entendido
                            </button>
                        </div>
                    </ReactModal>
                );
            })}
        </div>
    );
}
