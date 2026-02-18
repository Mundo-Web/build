import { useState, useRef } from "react";
import ReactModal from "react-modal";
import { CircleCheckBig, X, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import JobApplicationRest from "../../../Actions/JobApplicationRest";

const jobApplicationRest = new JobApplicationRest();

const ProviderJoinModal = ({ isOpen, onClose }) => {
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const messageRef = useRef();
    const cvRef = useRef();

    const handleClose = () => {
        onClose();
        setSelectedFile(null);
        setSuccess(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Archivo muy grande", {
                    description: "El archivo no debe superar los 5MB",
                });
                e.target.value = null;
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const validExtensions = [".pdf", ".doc", ".docx"];
            const fileExtension =
                "." + file.name.split(".").pop().toLowerCase();

            if (!validExtensions.includes(fileExtension)) {
                toast.error("Formato no válido", {
                    description: "Solo se permiten archivos PDF, DOC o DOCX",
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Archivo muy grande", {
                    description: "El archivo no debe superar los 5MB",
                });
                return;
            }

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            cvRef.current.files = dataTransfer.files;
            setSelectedFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeFile = () => {
        setSelectedFile(null);
        cvRef.current.value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;

        setSaving(true);

        try {
            const formData = new FormData();

            const name = nameRef.current?.value?.trim() || "";
            const email = emailRef.current?.value?.trim() || "";
            const phone = phoneRef.current?.value?.trim() || "";
            const message = messageRef.current?.value?.trim() || "";

            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("message", message);
            formData.append("type", "provider");

            if (cvRef.current?.files?.[0]) {
                formData.append("cv", cvRef.current.files[0]);
            }

            const result = await jobApplicationRest.save(formData);

            if (result) {
                setSuccess(true);
                toast.success("¡Solicitud enviada!", {
                    description:
                        "Gracias por tu interés. Revisaremos tu información y nos pondremos en contacto contigo.",
                    icon: <CircleCheckBig className="h-5 w-5 text-green-500" />,
                    duration: 4000,
                    position: "top-center",
                });

                e.target.reset();
                setSelectedFile(null);
            } else {
                toast.error("Error al enviar solicitud", {
                    description: "Por favor, intenta nuevamente.",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al enviar solicitud", {
                description: "Por favor, intenta nuevamente.",
            });
        } finally {
            setSaving(false);
        }
    };

    const rainstarInputClass =
        "w-full !rounded-none !border-x-0 !border-t-0 border-b border-neutral-300 !px-0 py-4 bg-transparent focus:!ring-0 focus:!outline-none focus:!border-x-0 focus:!border-t-0 focus:border-b-black text-xs uppercase tracking-widest placeholder:text-neutral-300 transition-all font-medium";
    const rainstarLabelClass =
        "text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2 block";

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Únete a Nosotros"
            className="absolute left-1/2 -translate-x-1/2 bg-white z-[99999999] shadow-2xl w-[95%] max-w-6xl top-1/2 -translate-y-1/2 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-[99999999]"
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={true}
            bodyOpenClassName="overflow-hidden"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] min-h-[70vh]">
                {/* Imagen decorativa - lado izquierdo */}
                <div className="hidden md:block bg-black min-h-[70vh] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center ">
                        <img
                            src={`/assets/resources/job-application.png?v=${crypto.randomUUID()}`}
                            alt="Trabaja con nosotros"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/logo-bk.svg";
                            }}
                        />
                    </div>
                </div>

                {/* Contenido del modal - lado derecho */}
                <div className="flex flex-col max-h-[90vh] relative bg-white">
                    {/* Botón cerrar */}
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 z-10 text-neutral-400 hover:text-black transition-colors duration-200"
                        aria-label="Cerrar modal"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>

                    {!success ? (
                        <>
                            {/* Header fijo */}
                            <div className="p-8 md:p-12 pb-6 flex-shrink-0 border-b border-neutral-100">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                                    Oportunidad de Ventas
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-3">
                                    Vende con
                                    <br />
                                    Nosotros
                                </h2>
                                <p className="text-xs text-neutral-500 leading-relaxed uppercase tracking-wider font-medium">
                                    Completa el formulario y únete a nuestro
                                    equipo de distribuidores
                                </p>
                            </div>

                            {/* Formulario con scroll */}
                            <div className="flex-1 overflow-y-auto px-8 md:px-12">
                                <div className="py-8 space-y-8">
                                    <form
                                        onSubmit={handleSubmit}
                                        id="provider-join-form"
                                    >
                                        <div className="space-y-8">
                                            <div>
                                                <label
                                                    className={
                                                        rainstarLabelClass
                                                    }
                                                >
                                                    Nombre Completo{" "}
                                                    <span className="text-black">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    ref={nameRef}
                                                    type="text"
                                                    required
                                                    className={
                                                        rainstarInputClass
                                                    }
                                                    placeholder="INGRESA TU NOMBRE COMPLETO"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label
                                                        className={
                                                            rainstarLabelClass
                                                        }
                                                    >
                                                        Email{" "}
                                                        <span className="text-black">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        ref={emailRef}
                                                        type="email"
                                                        required
                                                        className={
                                                            rainstarInputClass
                                                        }
                                                        placeholder="TU@EMAIL.COM"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className={
                                                            rainstarLabelClass
                                                        }
                                                    >
                                                        Teléfono{" "}
                                                        <span className="text-black">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        ref={phoneRef}
                                                        type="tel"
                                                        required
                                                        className={
                                                            rainstarInputClass
                                                        }
                                                        placeholder="+51 999 999 999"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    className={
                                                        rainstarLabelClass
                                                    }
                                                >
                                                    ¿Por qué quieres unirte?
                                                </label>
                                                <textarea
                                                    ref={messageRef}
                                                    rows="4"
                                                    className={
                                                        rainstarInputClass +
                                                        " resize-none"
                                                    }
                                                    placeholder="CUÉNTANOS BREVEMENTE SOBRE TI Y TU EXPERIENCIA EN VENTAS..."
                                                ></textarea>
                                            </div>

                                            <div>
                                                <label
                                                    className={
                                                        rainstarLabelClass
                                                    }
                                                >
                                                    CV (Opcional)
                                                </label>

                                                <div
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    className="relative border border-dashed border-neutral-300 p-8 text-center hover:border-black transition-all cursor-pointer bg-neutral-50"
                                                    onClick={() =>
                                                        cvRef.current?.click()
                                                    }
                                                >
                                                    <input
                                                        ref={cvRef}
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="hidden"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                    />

                                                    {selectedFile ? (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Upload
                                                                    className="w-5 h-5 text-black"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                />
                                                                <div className="text-left">
                                                                    <p className="font-bold text-black text-xs uppercase tracking-wider">
                                                                        {
                                                                            selectedFile.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                                                                        {(
                                                                            selectedFile.size /
                                                                            1024 /
                                                                            1024
                                                                        ).toFixed(
                                                                            2,
                                                                        )}{" "}
                                                                        MB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    removeFile();
                                                                }}
                                                                className="text-neutral-400 hover:text-black transition-colors"
                                                            >
                                                                <X
                                                                    className="w-4 h-4"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="py-4">
                                                            <Upload
                                                                className="w-8 h-8 mx-auto text-neutral-300 mb-3"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                            <p className="text-neutral-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                                                                Arrastra tu CV o
                                                                haz clic aquí
                                                            </p>
                                                            <p className="text-[9px] text-neutral-400 uppercase tracking-widest">
                                                                PDF, DOC, DOCX
                                                                (MÁX. 5MB)
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-neutral-100">
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="w-full bg-black text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {saving
                                                        ? "Enviando Solicitud..."
                                                        : "Enviar Solicitud"}
                                                </button>
                                            </div>

                                            <div className="pb-4"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-16 h-full px-12">
                            <div className="mb-8">
                                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle
                                        className="w-10 h-10 text-black"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="w-16 h-[1px] bg-neutral-200 mx-auto mb-8"></div>
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6">
                                ¡Gracias por
                                <br />
                                tu Interés!
                            </h2>
                            <p className="text-neutral-500 text-xs uppercase tracking-wider leading-relaxed max-w-md mb-10 font-medium">
                                Hemos recibido tu solicitud correctamente.
                                Revisaremos tu perfil y nos pondremos en
                                contacto contigo pronto.
                            </p>
                            <button
                                onClick={handleClose}
                                className="bg-black text-white px-12 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-800 transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ReactModal>
    );
};

export default ProviderJoinModal;
