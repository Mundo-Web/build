import React, { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
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
            suffix,
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
                    } ${Icon ? "pl-12" : ""} ${suffix ? "pr-16" : ""}`}
                />
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-hover:text-neutral-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                {suffix && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {suffix}
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

export default function ResetPasswordRainstar({ data }) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRef = useRef();
    const confirmationRef = useRef();
    const tokenRef = useRef();
    const emailRef = useRef();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");

        if (token) {
            tokenRef.current = token;
            emailRef.current = email;
        } else {
            console.error("No se encontró el token en la URL.");
        }
    }, []);

    const onResetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const password = passwordRef.current.value;
        const token = tokenRef.current;
        const confirmation = confirmationRef.current.value;
        const email = emailRef.current;
        if (password !== confirmation)
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: "Las contraseñas no coinciden",
                showConfirmButton: false,
                timer: 3000,
            });

        const request = {
            email: jsEncrypt.encrypt(email),
            password: jsEncrypt.encrypt(password),
            token: token,
            confirmation: jsEncrypt.encrypt(confirmation),
        };
        const result = await AuthClientRest.resetPassword(request);

        if (!result) return setLoading(false);

        window.location.href = "/";
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
                            src={`/assets/resources/reset-password.png?v=${Date.now()}`}
                            alt={`Restablecer contraseña ${Global.APP_NAME}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to login image if specific reset-password doesn't exist
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
                                    Seguridad
                                </span>
                                <h1 className="text-5xl lg:text-6xl 2xl:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
                                    Restablecer <br /> Contraseña
                                </h1>
                                <p className="text-neutral-500 text-[11px] uppercase font-bold tracking-[0.2em] leading-relaxed max-w-sm">
                                    Ingresa tu nueva contraseña y confirma para
                                    asegurar tu cuenta.
                                </p>
                            </div>

                            <form
                                onSubmit={onResetSubmit}
                                className="space-y-10"
                            >
                                <div className="space-y-8">
                                    <InputField
                                        label="Nueva Contraseña"
                                        id="password"
                                        ref={passwordRef}
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                        suffix={
                                            <button
                                                type="button"
                                                onClick={
                                                    togglePasswordVisibility
                                                }
                                                className="text-neutral-light hover:text-black transition-colors"
                                            >
                                                <span className="text-[10px] uppercase font-black tracking-widest">
                                                    {showPassword
                                                        ? "Ocultar"
                                                        : "Ver"}
                                                </span>
                                            </button>
                                        }
                                    />

                                    <InputField
                                        label="Confirmar Contraseña"
                                        id="confirm-password"
                                        ref={confirmationRef}
                                        name="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Repite tu nueva contraseña"
                                        required
                                        suffix={
                                            <button
                                                type="button"
                                                onClick={
                                                    toggleConfirmPasswordVisibility
                                                }
                                                className="text-neutral-light hover:text-black transition-colors"
                                            >
                                                <span className="text-[10px] uppercase font-black tracking-widest">
                                                    {showConfirmPassword
                                                        ? "Ocultar"
                                                        : "Ver"}
                                                </span>
                                            </button>
                                        }
                                    />
                                </div>

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
                                                ACTUALIZAR CONTRASEÑA
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
                                        Cancelar y volver
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
