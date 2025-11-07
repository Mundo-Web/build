import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import InputForm from "../Checkouts/Components/InputForm";
import ubigeoData from "../../../../../storage/app/utils/ubigeo.json";
import SelectForm from "../Checkouts/Components/SelectForm";
import CustomCaptcha from "../Complaints/CustomCaptcha";
import ThankYouPageWhistleblowing from "./ThankYouPageWhistleblowing";
import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import { Send, X, FileText, MapPin, AlertTriangle, Shield, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function WhistleblowingStech({ generals = [], data }) {
    const [messageCaptcha, setMessageCaptcha] = useState("");
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [formLoadedAt, setFormLoadedAt] = useState(null);
    
    const captchaRef = useRef();
    
    // Registrar tiempo de carga
    useEffect(() => {
        setFormLoadedAt(Math.floor(Date.now() / 1000));
    }, []);
    
    const [formData, setFormData] = useState({
        // Ubicación
        departamento: "",
        ciudad: "",
        direccion_exacta: "",
        
        // Información del incidente
        ambito: "",
        relacion_compania: "",
        empresa: "",
        que_sucedio: "",
        quien_implicado: "",
        cuando_ocurrio: "",
        dialogo_superior: "",
        
        // Contacto
        nombre: "",
        telefono: "",
        email: "",
        
        acepta_politica: false,
    });
    
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }, []);

    // Handler específico para SelectForm (recibe valor directo, no evento)
    const handleSelectChange = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            departamento: "",
            ciudad: "",
            direccion_exacta: "",
            ambito: "",
            relacion_compania: "",
            empresa: "",
            que_sucedio: "",
            quien_implicado: "",
            cuando_ocurrio: "",
            dialogo_superior: "",
            nombre: "",
            telefono: "",
            email: "",
            acepta_politica: false,
        });
        setIsCaptchaVerified(false);
        setCaptchaToken(null);
        setMessageCaptcha("");
        
        if (captchaRef.current) {
            captchaRef.current.reset();
        }
    }, []);

    const handleCaptchaVerify = useCallback((isVerified, token) => {
        setIsCaptchaVerified(isVerified);
        setCaptchaToken(token);
        if (isVerified) {
            setMessageCaptcha("");
        }
    }, []);

    const handleBackToForm = useCallback(() => {
        setShowThankYou(false);
        setSubmittedData(null);
    }, []);

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
            _hp: '',
        };
        
        fetch("/api/whistleblowings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
        })
            .then((res) => {
                if (!res.ok) {
                    // Si la respuesta no es exitosa (400, 422, 500, etc.)
                    throw res;
                }
                return res.json();
            })
            .then((data) => {
                if (data.type === "success") {
                    toast.success(data.message);
                    setSubmittedData(data.data);
                    setShowThankYou(true);
                    resetForm();
                } else {
                    toast.error(data.message || "Error al enviar la denuncia");
                    if (data.message && data.message.includes('CAPTCHA')) {
                        setMessageCaptcha(data.message);
                        if (captchaRef.current) {
                            captchaRef.current.reset();
                        }
                    }
                }
            })
            .catch(async (error) => {
                console.error("Error:", error);
                
                // Si el error es una respuesta HTTP, intentar parsear el JSON
                if (error instanceof Response) {
                    try {
                        const errorData = await error.json();
                        toast.error(errorData.message || "Error al enviar la denuncia");
                        
                        // Si es error de CAPTCHA, resetear
                        if (errorData.message && errorData.message.includes('CAPTCHA')) {
                            setMessageCaptcha(errorData.message);
                            if (captchaRef.current) {
                                captchaRef.current.reset();
                            }
                        }
                    } catch {
                        toast.error("Error al enviar la denuncia. Por favor, intenta nuevamente.");
                    }
                } else {
                    toast.error("Hubo un error al enviar la denuncia. Por favor, intenta nuevamente.");
                }
            })
            .finally(() => setLoading(false));
    };

    // Manejo de departamentos - Memoizado para evitar recalcular
    const departamentos = useMemo(() => {
        const uniqueDepartamentos = [...new Set(ubigeoData.map((item) => item.departamento))];
        return uniqueDepartamentos.map((dep) => ({ value: dep, label: dep }));
    }, []);

    const ambitosOptions = useMemo(() => [
        { value: "Laboral", label: "Laboral" },
        { value: "Ético", label: "Ético" },
        { value: "Técnico u operativo", label: "Técnico u operativo" },
        { value: "Comercial o ventas", label: "Comercial o ventas" },
        { value: "Seguridad", label: "Seguridad" },
        { value: "Discriminación o acoso", label: "Discriminación o acoso" },
        { value: "Otro", label: "Otro" },
    ], []);

    const relacionesOptions = useMemo(() => [
        { value: "Empleado", label: "Empleado" },
        { value: "Proveedor", label: "Proveedor" },
        { value: "Cliente", label: "Cliente" },
        { value: "Otro", label: "Otro" },
    ], []);

    const [modalOpen, setModalOpen] = useState(false);
    const policyItems = {
        privacy_policy: "Política de Privacidad",
    };
    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(false);
    
    if (showThankYou && submittedData) {
        return (
            <ThankYouPageWhistleblowing
                title="¡Denuncia Recibida!"
                message="Tu denuncia ha sido registrada exitosamente y será revisada por nuestro equipo de compliance."
                submittedData={submittedData}
                onBackToForm={handleBackToForm}
                data={data}
            />
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 ${data?.class_base || ''}`}>
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <AlertTriangle className="w-10 h-10 customtext-primary" />
                        <h1 className={`text-4xl font-bold customtext-neutral-dark ${data?.class_title || ''}`}>
                            Canal de Denuncias
                        </h1>
                    </div>
                    <p className="customtext-neutral-light text-lg max-w-2xl mx-auto">
                        Este es un canal confidencial para reportar conductas irregulares o situaciones que consideres inapropiadas.
                        Tu denuncia será tratada con la máxima confidencialidad.
                    </p>
                </div>

                <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-12">
                        {/* Honeypot */}
                        <input
                            type="text"
                            name="_hp"
                            tabIndex="-1"
                            autoComplete="off"
                            style={{
                                position: 'absolute',
                                left: '-9999px',
                                width: '1px',
                                height: '1px',
                                opacity: 0,
                                pointerEvents: 'none'
                            }}
                            aria-hidden="true"
                        />
                        
                        {/* UBICACIÓN DEL INCIDENTE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <div className={`flex items-center justify-center w-12 h-12 bg-secondary rounded-full ${data?.class_icon || 'shadow-lg customtext-primary'}`}>
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold customtext-neutral-dark ${data?.class_title || ''}`}>
                                        Ubicación del Incidente
                                    </h2>
                                    <p className="customtext-neutral-light">¿Dónde ha ocurrido?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SelectForm
                                    label="Departamento"
                                    name="departamento"
                                     placeholder="Selecciona departamento"
                                    value={formData.departamento}
                                    onChange={(value) => handleSelectChange('departamento', value)}
                                    options={departamentos}
                                    required
                                />
                                <InputForm
                                    type="text"
                                    label="Ciudad"
                                    name="ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    placeholder="Ingresa la ciudad"
                                    required
                                />
                            </div>

                            <InputForm
                                type="text"
                                label="Dirección exacta del incidente"
                                name="direccion_exacta"
                                value={formData.direccion_exacta}
                                onChange={handleChange}
                                placeholder="Ej: Oficina Lima, Av. Principal 123"
                                required
                            />
                        </div>

                        {/* INFORMACIÓN DEL INCIDENTE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <div className={`flex items-center justify-center w-12 h-12 bg-secondary rounded-full ${data?.class_icon || 'shadow-lg customtext-primary'}`}>
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold customtext-neutral-dark ${data?.class_title || ''}`}>
                                        Información del Incidente
                                    </h2>
                                    <p className="customtext-neutral-light">Detalles de lo ocurrido</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SelectForm
                                    label="Ámbito de la denuncia"
                                    name="ambito"
                                        placeholder="Selecciona ámbito"
                                    value={formData.ambito}
                                    onChange={(value) => handleSelectChange('ambito', value)}
                                    options={ambitosOptions}
                                    required
                                />
                                <SelectForm
                                    label="Tu relación con la compañía"
                                    name="relacion_compania"
                                    placeholder="Selecciona relación"
                                    value={formData.relacion_compania}
                                    onChange={(value) => handleSelectChange('relacion_compania', value)}
                                    options={relacionesOptions}
                                    required
                                />
                            </div>

                            <InputForm
                                type="text"
                                label="¿En qué empresa ocurrió?"
                                name="empresa"
                                value={formData.empresa}
                                onChange={handleChange}
                                placeholder="Nombre de la empresa (opcional)"
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium customtext-neutral-dark">
                                    ¿Qué ha sucedido? <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="que_sucedio"
                                    value={formData.que_sucedio}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe detalladamente lo sucedido..."
                                    required
                                />
                            </div>

                            <InputForm
                                type="text"
                                label="¿Quién está implicado?"
                                name="quien_implicado"
                                value={formData.quien_implicado}
                                onChange={handleChange}
                                placeholder="Nombres, cargos o departamentos involucrados"
                                required
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <InputForm
                                    type="date"
                                    label="¿Cuándo ocurrió?"
                                    name="cuando_ocurrio"
                                    value={formData.cuando_ocurrio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium customtext-neutral-dark">
                                    ¿Has dialogado con tu superior o con otra persona?
                                </label>
                                <textarea
                                    name="dialogo_superior"
                                    value={formData.dialogo_superior}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Si/No y detalles adicionales (opcional)"
                                />
                            </div>
                        </div>

                        {/* INFORMACIÓN DE CONTACTO */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <div className={`flex items-center justify-center w-12 h-12 bg-secondary rounded-full ${data?.class_icon || 'shadow-lg customtext-primary'}`}>
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold customtext-neutral-dark ${data?.class_title || ''}`}>
                                        Información de Contacto
                                    </h2>
                                    <p className="customtext-neutral-light">
                                        Tus datos serán tratados confidencialmente
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <InputForm
                                    type="text"
                                    label="Nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Tu nombre completo"
                                    required
                                />
                                <InputForm
                                    type="tel"
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="(Opcional)"
                                />
                            </div>

                            <InputForm
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        {/* CAPTCHA */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <div className={`flex items-center justify-center w-12 h-12 bg-secondary rounded-full ${data?.class_icon || 'shadow-lg customtext-primary'}`}>
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold customtext-neutral-dark ${data?.class_title || ''}`}>
                                        Validación de Seguridad
                                    </h2>
                                </div>
                            </div>

                            <CustomCaptcha
                                ref={captchaRef}
                                onVerify={handleCaptchaVerify}
                                error={messageCaptcha}
                            />
                        </div>

                        {/* POLÍTICAS */}
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="acepta_politica"
                                    checked={formData.acepta_politica}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <span className="text-sm customtext-neutral-dark">
                                    Acepto la{" "}
                                    <button
                                        type="button"
                                        onClick={() => openModal(0)}
                                        className="customtext-primary underline hover:no-underline"
                                    >
                                        Política de Privacidad
                                    </button>{" "}
                                    y autorizo el tratamiento confidencial de mis datos
                                    <span className="text-red-500"> *</span>
                                </span>
                            </label>

                          
                        </div>

                        {/* BOTÓN ENVIAR */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                disabled={loading || !isCaptchaVerified || !formData.acepta_politica}
                                className={`
                                    flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-semibold text-lg
                                    transition-all duration-300 transform hover:scale-105
                                    ${loading || !isCaptchaVerified || !formData.acepta_politica
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6" />
                                        Enviar Denuncia
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL DE POLÍTICAS */}
            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content = Array.isArray(generals) 
                    ? generals.find((x) => x.correlative == key)?.description ?? ""
                    : "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9999999]"
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
                                    className="px-6 py-2 bg-primary text-white rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </ReactModal>
                );
            })}
        </div>
    );
}
