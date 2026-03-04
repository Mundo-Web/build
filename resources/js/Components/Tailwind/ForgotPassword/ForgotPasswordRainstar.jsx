import React, { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ArrowRight } from "lucide-react";

const InputField = React.forwardRef(
    (
        {
            label,
            name,
            type = "text",
            error,
            icon: Icon,
            value,
            onChange,
            placeholder,
            ...props
        },
        ref,
    ) => (
        <div className="space-y-1.5 w-full text-left">
            <label className="text-xs font-bold tracking-widest text-neutral-light block mb-1.5">
                {label}
            </label>
            <div className="relative group">
                <input
                    {...props}
                    ref={ref}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full border-2 p-4 font-medium outline-none transition-all bg-white text-neutral-800 placeholder:text-neutral-300 text-sm ${
                        error
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-black hover:border-gray-400"
                    } ${Icon ? "pl-12" : ""}`}
                />
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-hover:text-neutral-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                    {error}
                </p>
            )}
        </div>
    ),
);

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
            window.location.href = "/iniciar-sesion";
        }, 4000);
    };

    return (
        <section
            id={data?.element_id || null}
            className="bg-white min-h-screen flex items-center justify-center py-12 lg:py-0"
        >
            <div className="w-full mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 xl:gap-24 items-center">
                    {/* Left Side: Decorative Image (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-6 h-full relative overflow-hidden group">
                        <img
                            src={`/assets/resources/recovery.png?v=${Date.now()}`}
                            alt={`Recuperar cuenta ${Global.APP_NAME}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to login image if recovery doesn't exist
                                e.target.src = "/api/cover/thumbnail/null";
                            }}
                        />
                        <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>

                    {/* Right Side: Content (Header + Form) */}
                    <div className="lg:col-span-6">
                        <div className="max-w-md mx-auto lg:mx-0 py-12">
                            <div className="mb-12">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-light mb-6 block">
                                    Recuperar Cuenta
                                </span>
                                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
                                    Olvidé mi <br /> Contraseña
                                </h1>
                                <p className="text-neutral-500 text-[11px] uppercase font-bold tracking-[0.2em] leading-relaxed max-w-sm">
                                    Ingresa tu correo electrónico y te
                                    enviaremos las instrucciones para
                                    restablecer tu acceso.
                                </p>
                            </div>

                            <form
                                onSubmit={onForgotSubmit}
                                className="space-y-10"
                            >
                                <InputField
                                    label="Email"
                                    id="email"
                                    ref={emailRef}
                                    name="email"
                                    type="email"
                                    placeholder="hola@mail.com"
                                    required
                                    disabled={loading}
                                />

                                <div className="flex flex-col gap-8 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-6 text-[11px] font-black uppercase tracking-[0.4em] bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-6 group shadow-2xl shadow-black/10"
                                    >
                                        {loading ? (
                                            <Loader2
                                                className="animate-spin"
                                                size={18}
                                            />
                                        ) : (
                                            <>
                                                ENVIAR INSTRUCCIONES
                                                <ArrowRight
                                                    size={18}
                                                    className="group-hover:translate-x-2 transition-transform"
                                                />
                                            </>
                                        )}
                                    </button>

                                    <a
                                        href="/iniciar-sesion"
                                        className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-light hover:text-black transition-colors group"
                                    >
                                        <ArrowLeft
                                            size={14}
                                            className="group-hover:-translate-x-2 transition-transform"
                                        />
                                        Volver al login
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
