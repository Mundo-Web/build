import { useState, useEffect } from "react";
import Global from "../../../Utils/Global";
import { GET } from "sode-extend-react";
import Swal from "sweetalert2";
import { toast } from "sonner";

export default function UnsubscribeSimple() {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [success, setSuccess] = useState(false);
    const token = new URLSearchParams(window.location.search).get('token');

    useEffect(() => {
        if (GET.message) {
            Swal.fire({
                icon: "info",
                title: "Mensaje",
                text: GET.message,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    }, []);

    const onUnsubscribeSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Token inválido", {
                description: "El enlace de desuscripción no es válido",
                duration: 4000,
                position: "top-right",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    token: token,
                    reason: reason
                })
            });

            const result = await response.json();

            setLoading(false);

            if (!result.success) {
                toast.error("Error", {
                    description: result.message || "No se pudo procesar la desuscripción",
                    duration: 4000,
                    position: "top-right",
                });
                return;
            }

            setSuccess(true);
            toast.success("¡Desuscripción exitosa!", {
                description: "Lamentamos verte partir. Ya no recibirás más correos de nuestra parte.",
                duration: 4000,
                position: "top-right",
            });

            setTimeout(() => {
                window.location.href = "/";
            }, 3000);

        } catch (error) {
            setLoading(false);
            toast.error("Error", {
                description: "Ocurrió un error al procesar tu solicitud",
                duration: 4000,
                position: "top-right",
            });
        }
    };

    if (success) {
        return (
            <div className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-[#F7F9FB] px-primary 2xl:px-0">
                <div className="2xl:max-w-7xl w-full mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-12 text-center">
                            <div className="mb-6">
                                <svg className="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold customtext-neutral-dark mb-4">
                                ¡Desuscripción exitosa!
                            </h1>
                            <p className="customtext-neutral-light mb-6">
                                Lamentamos verte partir. Ya no recibirás más correos de nuestra parte.
                            </p>
                            <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all">
                                Volver al inicio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-sections-color px-primary 2xl:px-0">
            <div className="2xl:max-w-7xl w-full mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:min-h-[600px]">
                        <div className="hidden lg:block lg:w-1/2 relative">
                            <img 
                                src={`/assets/resources/unsubscribe.png?v=${crypto.randomUUID()}`} 
                                alt={Global.APP_NAME}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/logo-bk.svg';
                                }} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                        <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-16">
                            <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                                <div className="space-y-2 mb-6">
                                    <h5 className="text-primary font-medium">
                                        Desuscribirse
                                    </h5>
                                    <h1 className="text-3xl font-bold text-neutral-dark">
                                        ¿Quieres dejar de recibir nuestros correos?
                                    </h1>
                                    <p className="text-neutral-light">
                                        Lamentamos verte partir. Si confirmas, ya no recibirás más correos de nuestra parte.
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={onUnsubscribeSubmit}>
                                    <div className="space-y-2">
                                        <label
                                            className="block text-sm mb-1 customtext-neutral-dark"
                                            htmlFor="reason"
                                        >
                                            ¿Nos cuentas por qué? (Opcional)
                                        </label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            rows="4"
                                            placeholder="Tus comentarios nos ayudan a mejorar..."
                                            className="w-full px-4 py-3 border customtext-neutral-dark border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0 transition-all duration-300"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            disabled={loading}
                                            maxLength="500"
                                        />
                                        <small className="text-neutral-light text-xs">
                                            {reason.length}/500 caracteres
                                        </small>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="flex-1 rounded-xl font-semibold bg-danger px-4 py-4 text-white hover:bg-opacity-60 hover:scale-105  focus:outline-none focus:ring-2 transition-all duration-300 flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                </svg>
                                            ) : null}
                                            {loading ? "Procesando..." : "Confirmar"}
                                        </button>
                                        
                                        <a
                                            href="/"
                                            className="flex-1 rounded-xl font-semibold bg-gray-200 px-4 py-3 text-gray-800 hover:bg-gray-300 focus:outline-none transition-all duration-300 flex items-center justify-center text-center"
                                        >
                                            Cancelar
                                        </a>
                                    </div>

                                   
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
