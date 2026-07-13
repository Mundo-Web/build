import { useState, useEffect } from "react";
import Global from "../../../Utils/Global";
import { GET } from "sode-extend-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

export default function UnsubscribeTwenty({ data }) {
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
            <div id={data?.element_id || null} className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-black text-white px-primary 2xl:px-0 font-paragraph">
                <div className="2xl:max-w-7xl w-full mx-auto">
                    <div className="bg-black border border-white/20 shadow-2xl overflow-hidden rounded-none">
                        <div className="p-12 text-center max-w-md mx-auto">
                            <div className="mb-6">
                                <svg className="w-16 h-16 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h1 className="text-xl font-paragraph uppercase tracking-widest text-white font-bold mb-4">
                                ¡Desuscripción exitosa!
                            </h1>
                            <p className="text-xs font-paragraph uppercase tracking-wider text-white/50 mb-6 leading-relaxed">
                                Lamentamos verte partir. Ya no recibirás más correos de nuestra parte.
                            </p>
                            <a href="/" className="inline-block bg-white text-black px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all">
                                Volver al inicio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id={data?.element_id || null} className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-black text-white px-primary 2xl:px-0 font-paragraph">
            <div className="2xl:max-w-7xl w-full mx-auto">
                <div className="bg-black border border-white/20 shadow-2xl overflow-hidden rounded-none">
                    <div className="flex flex-col lg:flex-row lg:min-h-[600px]">
                        {/* Left image */}
                        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900 border-r border-white/10">
                            <img 
                                src={`/assets/resources/unsubscribe.png?v=${crypto.randomUUID()}`} 
                                alt={Global.APP_NAME}
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/logo-bk.svg';
                                }} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>

                        {/* Right Form */}
                        <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-16 flex flex-col justify-center bg-black">
                            <div className="max-w-md mx-auto w-full">
                                <div className="space-y-2 mb-6">
                                    <h5 className="text-[10px] font-paragraph uppercase tracking-widest text-white/50">Desuscribirse</h5>
                                    <h1 className="text-xl font-paragraph uppercase tracking-widest text-white font-bold leading-tight">¿Quieres dejar de recibir nuestros correos?</h1>
                                    <p className="text-xs font-paragraph uppercase tracking-wider text-white/50 leading-relaxed mt-2">
                                        Lamentamos verte partir. Si confirmas, ya no recibirás más correos de nuestra parte.
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={onUnsubscribeSubmit}>
                                    <div>
                                        <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2" htmlFor="reason">
                                            ¿Nos cuentas por qué? (Opcional)
                                        </label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            rows="4"
                                            placeholder="Tus comentarios nos ayudan a mejorar..."
                                            maxLength="500"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            disabled={loading}
                                            className="w-full bg-transparent border border-white/20 py-2.5 px-4 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none resize-none"
                                        />
                                        <div className="text-right mt-1">
                                            <span className="text-[9px] font-paragraph text-white/30 uppercase tracking-wider">
                                                {reason.length}/500 caracteres
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-white text-black hover:bg-white/90 py-3.5 text-xs font-paragraph uppercase tracking-widest font-bold rounded-none transition-all duration-300 disabled:opacity-50"
                                        >
                                            {loading ? "Procesando..." : "Confirmar"}
                                        </button>
                                        
                                        <a
                                            href="/"
                                            className="flex-1 bg-transparent border border-white/20 text-white/60 hover:text-white hover:border-white py-3.5 text-xs font-paragraph uppercase tracking-widest rounded-none transition-all duration-300 flex items-center justify-center text-center font-bold"
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
