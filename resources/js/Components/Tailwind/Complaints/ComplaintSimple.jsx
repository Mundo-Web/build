import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef, useState } from "react";
import InputForm from "../Checkouts/Components/InputForm";
import ubigeoData from "../../../../../storage/app/utils/ubigeo.json";
import SelectForm from "../Checkouts/Components/SelectForm";

import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
export default function ComplaintSimple({ generals }) {
    const recaptchaRef = useRef(null);
    const [messageCaptcha, setMessageCaptcha] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        tipo_documento: "RUC",
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
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        setLoading(true);
        const recaptchaValue = recaptchaRef.current.getValue();
        if (!recaptchaValue) {
            setMessageCaptcha("Por favor, verifica el reCAPTCHA.");
            setLoading(false);
            return;
        }

        const updatedFormData = {
            ...formData,
            recaptcha_token: recaptchaValue,
        };
        fetch("/api/complaints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
        })
            .then((response) => response.json())
            .then((data) => {
                
                if (data.type === "success") {
                    toast.success("Solicitud enviada", {
                        description: `Pronto nos comunicaremos contigo ¡Gracias!.`,
                        icon: <Send className="h-5 w-5 text-green-500" />,
                        duration: 3000,
                        position: "bottom-center",
                    });
                    setLoading(false);
                }
                else {
                    toast.error("Solicitud rechazada", {
                        description: `Lo sentimos, no se envió su solicitud.`,
                        icon: <Send className="h-5 w-5 text-red-500" />,
                        duration: 3000,
                        position: "bottom-center",
                    });
                    setLoading(false);

                }
            })
            .catch((error) => {
                toast.error("Solicitud rechazada", {
                    description: error || `Lo sentimos, no se envió su solicitud.`,
                    icon: <Send className="h-5 w-5 text-red-500" />,
                    duration: 3000,
                    position: "bottom-center",
                });
                setLoading(false);
            });
    };

    // Estados para manejar los valores seleccionados
    const [departamento, setDepartamento] = useState("");
    const [provincia, setProvincia] = useState("");
    const [distrito, setDistrito] = useState("");

    // Estados para las opciones dinámicas
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    // Cargar los departamentos al iniciar el componente
    useEffect(() => {
        const uniqueDepartamentos = [
            ...new Set(ubigeoData.map((item) => item.departamento)),
        ];
        setDepartamentos(uniqueDepartamentos);
    }, []);

    // Filtrar provincias cuando se selecciona un departamento
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
            setProvincia(""); // Reiniciar provincia
            setDistrito(""); // Reiniciar distrito
            setDistritos([]); // Limpiar distritos
            setFormData((prev) => ({
                ...prev,
                departamento: departamento,
                provincia: "",
                distrito: "",
            }));
        }
    }, [departamento]);

    // Filtrar distritos cuando se selecciona una provincia
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
            setDistrito(""); // Reiniciar distrito
            setFormData((prev) => ({
                ...prev,
                provincia: provincia,
                distrito: "",
            }));
        }
    }, [provincia]);

    // Consultar el precio de envío cuando se selecciona un distrito
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
    return (
        <div className=" w-full px-primary mx-auto pt-8 pb-16 font-paragraph">
            <div className="max-w-7xl mx-auto  bg-white shadow-lg rounded-2xl customtext-neutral-dark p-8">
                <h1 className="text-2xl font-bold mb-10 text-center uppercase">
                    Libro de Reclamaciones
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* Identificación del Consumidor */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Identificación del Consumidor
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Nombres"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombres"
                                />
                            </div>
                            {/*TIPO DOCUMENTO */}
                            <div className="space-y-1">
                                <SelectForm
                                    label="Tipo de documento"
                                    options={typesDocument}
                                    placeholder="Selecciona  documento"
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipo_documento: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Número de identidad"
                                    name="numero_identidad"
                                    value={formData.numero_identidad}
                                    onChange={handleChange}
                                    placeholder="Número de identidad"
                                />
                            </div>
                        </div>
                        {/*CELULAR */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Número de celular"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    placeholder="Número de celular"
                                />
                            </div>
                            {/*CORREO */}
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label=" Correo Electrónico"
                                    name="correo_electronico"
                                    value={formData.correo_electronico}
                                    onChange={handleChange}
                                    placeholder=" Correo Electrónico"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {/* Departamento */}

                            <SelectForm
                                label="Departamento"
                                options={departamentos}
                                placeholder="Selecciona un Departamento"
                                onChange={(value) => {
                                    setDepartamento(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        departmento: value,
                                    }));
                                }}
                            />

                            {/* Provincia */}

                            <SelectForm
                                disabled={!departamento}
                                label="Provincia"
                                options={provincias}
                                placeholder="Selecciona una Provincia"
                                onChange={(value) => {
                                    setProvincia(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        provincia: value,
                                    }));
                                }}
                            />

                            {/* Distrito */}

                            <SelectForm
                                disabled={!provincia}
                                label="Distrito"
                                options={distritos}
                                placeholder="Selecciona un Distrito"
                                onChange={(value) => {
                                    setDistrito(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        distrito: value,
                                    }));
                                }}
                            />
                        </div>

                        <div className="mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Dirección"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder=" Dirección"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Identificación del bien contratado */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Identificación del bien contratado
                        </h2>

                        <div className="mb-4">
                            <div className="relative mt-1">
                                <SelectForm
                                    label=" ¿Fue un producto o Servicio?"
                                    options={typesContract}
                                    placeholder="Selecciona..."
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            tipo_producto: value,
                                        }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="number"
                                    label=" Monto reclamado"
                                    name="monto_reclamado"
                                    value={formData.monto_reclamado}
                                    onChange={handleChange}
                                    placeholder="Monto reclamado"
                                />
                            </div>

                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label=" Descripción de producto"
                                    name="descripcion_producto"
                                    value={formData.descripcion_producto}
                                    onChange={handleChange}
                                    placeholder="Nombre de producto y/o servicios, código(opcional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detalle del reclamo del pedido del consumidor */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Detalle del reclamo del pedido del consumidor
                        </h2>

                        <div className="mb-4">
                            <SelectForm
                                label="¿Es un reclamo o queja?"
                                options={typesClaim}
                                placeholder="Selecciona..."
                                onChange={(value) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        tipo_reclamo: value,
                                    }));
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <InputForm
                                    type="date"
                                    label="  Fecha de ocurrencia"
                                    name="fecha_ocurrencia"
                                    value={formData.fecha_ocurrencia}
                                    onChange={handleChange}
                                    placeholder="dd/mm/aaaa"
                                />
                            </div>

                            <div className="space-y-1">
                                <InputForm
                                    type="text"
                                    label="Número de Pedido"
                                    name="numero_pedido"
                                    value={formData.numero_pedido}
                                    onChange={handleChange}
                                    placeholder="Número de pedido: #95825548"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="space-y-1">
                                <label className="block text-sm mb-1 customtext-neutral-dark">
                                    Detalle de reclamo o queja
                                </label>
                                <textarea
                                    name="detalle_reclamo"
                                    placeholder="Detalle de reclamo"
                                    className="w-full min-h-32  px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                                    value={formData.detalle_reclamo}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Términos y condiciones */}
                    <div className="mb-8">
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terminos"
                                name="acepta_terminos"
                                className="mt-1 mr-2"
                                checked={formData.acepta_terminos}
                                onChange={handleChange}
                            />
                            <label htmlFor="terminos" className="text-sm">
                                Estoy de acuerdo con los{" "}
                                <a
                                    onClick={() => openModal(0)}
                                    className="customtext-primary underline"
                                >
                                    términos y condiciones
                                </a>
                            </label>
                        </div>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="mb-8">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LfAcfcqAAAAACc7tfKbaBFc1X5I9V4fewWoVf-9"
                        />
                        {messageCaptcha && (
                            <p className="text-red-500 mt-2">
                                {messageCaptcha}
                            </p>
                        )}
                    </div>

                    {/* Botón de envío */}
                    <div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="bg-primary text-white px-6 py-3 font-medium rounded-lg flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            )}
                            {loading ? "Enviando..." : "Enviar a libro de reclamaciones"}
                        </button>
                    </div>
                </form>
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
        </div>
    );
}
