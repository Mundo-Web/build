import AuthClientRest from "../../../Actions/AuthClientRest";
import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { GET } from "sode-extend-react";
import Global from "../../../Utils/Global";

export default function ForgotPasswordTwenty({ data }) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    const [loading, setLoading] = useState(false);
    const emailRef = useRef();

    useEffect(() => {
        if (GET.message)
            Swal.fire({
                icon: "info",
                title: "Mensaje",
                text: GET.message,
                showConfirmButton: false,
                timer: 3000,
            });
    }, []);

    const onForgotSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = emailRef.current.value;

        const request = {
            email: jsEncrypt.encrypt(email),
        };
        const result = await AuthClientRest.forgotPassword(request);

        setLoading(false);

        if (!result || !result.success) {
            if (result && result.user_exists === false) {
                setTimeout(() => {
                    toast.info("¿Ya tienes cuenta?", {
                        description: "Puedes intentar iniciar sesión aquí",
                        duration: 4000,
                        position: "top-right",
                        action: {
                            label: "Ir al login",
                            onClick: () => {
                                window.location.href = "/iniciar-sesion";
                            }
                        },
                        actionButtonStyle: {
                            backgroundColor: "#ffffff",
                            color: "#000000",
                            border: "none",
                            borderRadius: "0px",
                            padding: "8px 16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        },
                    });
                }, 2000);
            }
            return;
        }

        toast.success("¡Revisa tu correo!", {
            description: "Te hemos enviado las instrucciones para restablecer tu contraseña.",
            duration: 4000,
            position: "top-right",
            action: {
                label: "Ir al login",
                onClick: () => {
                    window.location.href = "/iniciar-sesion";
                }
            },
            actionButtonStyle: {
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "none",
                borderRadius: "0px",
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
            },
        });

        setTimeout(() => {
            window.location.href = "/iniciar-sesion";
        }, 4000);
    };

    return (
        <div id={data?.element_id || null} className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-black text-white px-primary 2xl:px-0 font-paragraph">
            <div className="2xl:max-w-7xl w-full mx-auto">
                <div className="bg-black border border-white/20 shadow-2xl overflow-hidden rounded-none">
                    <div className="flex flex-col lg:flex-row lg:min-h-[600px]">
                        {/* Left image */}
                        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900 border-r border-white/10">
                            <img
                                src={`/assets/resources/reset.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/logo-bk.svg';
                                }}
                            />

                        </div>

                        {/* Right Form */}
                        <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-16 flex flex-col justify-center bg-black">
                            <div className="max-w-md mx-auto w-full">
                                <div className="space-y-2 mb-6">
                                    <h5 className="text-[10px] font-paragraph uppercase tracking-widest text-white">Olvidé</h5>
                                    <h1 className="text-3xl font-paragraph uppercase tracking-widest text-white font-bold">Olvidé mi contraseña</h1>
                                    <p className="text-sm font-paragraph  text-white leading-relaxed">
                                        ¡No pasa nada! Dinos qué dirección de correo usaste para registrarte y en unos minutos tendrás las instrucciones en tu bandeja de entrada para volver a entrar.
                                    </p>
                                </div>

                                <form className="space-y-6" onSubmit={onForgotSubmit}>
                                    <div>
                                        <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            ref={emailRef}
                                            name="email"
                                            type="email"
                                            placeholder="hola@mail.com"
                                            required
                                            disabled={loading}
                                            className="w-full bg-transparent border border-white/20 py-4 px-4 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black hover:bg-white/90 py-4 text-xs font-paragraph uppercase tracking-widest font-bold rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Enviando..." : "Enviar"}
                                    </button>

                                    <div className="text-center border-t border-white/10 pt-4">
                                        <a href="/iniciar-sesion" className="text-xs font-paragraph uppercase tracking-widest text-white/65 hover:text-white transition-colors">
                                            Volver al inicio de sesión
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
