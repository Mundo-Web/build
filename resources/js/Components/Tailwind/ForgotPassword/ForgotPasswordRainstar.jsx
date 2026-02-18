import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ArrowRight } from "lucide-react";

export default function ForgotPasswordRainstar({ data }) {
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
                            },
                        },
                    });
                }, 2000);
            }
            return;
        }

        toast.success("¡Revisa tu correo!", {
            description:
                "Te hemos enviado las instrucciones para restablecer tu contraseña.",
            duration: 4000,
            position: "top-right",
        });

        setTimeout(() => {
            window.location.href = "/login";
        }, 4000);
    };

    const rainstarInputClass =
        "!rounded-none !border-x-0 !border-t-0 border-b border-neutral-900 !px-0 py-4 bg-transparent focus:!ring-0 focus:!outline-none focus:!border-x-0 focus:!border-t-0 focus:border-b-1 text-xs uppercase tracking-widest placeholder:text-neutral-300 transition-all font-medium";
    const rainstarLabelClass =
        "text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2 block";

    return (
        <section
            id={data?.element_id || null}
            className="bg-white min-h-screen pt-20 pb-32 flex items-center"
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                            Recuperar Cuenta
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                            Olvidé mi <br /> Contraseña
                        </h1>
                        <p className="text-neutral-500 text-sm uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
                            Ingresá tu correo electrónico y te enviaremos las
                            instrucciones para restablecer tu acceso.
                        </p>
                    </div>

                    <form onSubmit={onForgotSubmit} className="space-y-12">
                        <div className="space-y-2">
                            <label
                                className={rainstarLabelClass}
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                ref={emailRef}
                                name="email"
                                type="email"
                                placeholder="HOLA@MAIL.COM"
                                className={rainstarInputClass + " w-full"}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                            <a
                                href="/login"
                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors group"
                            >
                                <ArrowLeft
                                    size={14}
                                    className="group-hover:-translate-x-1 transition-transform"
                                />
                                Volver al login
                            </a>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:brightness-125 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-black/10"
                            >
                                {loading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={16}
                                    />
                                ) : (
                                    <>
                                        ENVIAR INSTRUCCIONES
                                        <ArrowRight
                                            size={14}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
