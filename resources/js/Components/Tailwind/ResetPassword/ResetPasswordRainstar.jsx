import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
import { ArrowLeft, Loader2, ArrowRight } from "lucide-react";

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
                            Seguridad
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                            Restablecer <br /> Contraseña
                        </h1>
                        <p className="text-neutral-500 text-sm uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
                            Ingresa tu nueva contraseña y confirma para asegurar
                            tu cuenta.
                        </p>
                    </div>

                    <form onSubmit={onResetSubmit} className="space-y-12">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label
                                    className={rainstarLabelClass}
                                    htmlFor="password"
                                >
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        ref={passwordRef}
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className={`border ${rainstarInputClass} w-full pr-10`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                                    >
                                        {showPassword ? (
                                            <span className="text-[10px] uppercase font-bold tracking-widest">
                                                Ocultar
                                            </span>
                                        ) : (
                                            <span className="text-[10px] uppercase font-bold tracking-widest">
                                                Ver
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className={rainstarLabelClass}
                                    htmlFor="confirm-password"
                                >
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        ref={confirmationRef}
                                        name="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`border ${rainstarInputClass} w-full pr-10`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={
                                            toggleConfirmPasswordVisibility
                                        }
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <span className="text-[10px] uppercase font-bold tracking-widest">
                                                Ocultar
                                            </span>
                                        ) : (
                                            <span className="text-[10px] uppercase font-bold tracking-widest">
                                                Ver
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
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
                                Cancelar
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
                                        CAMBIAR CONTRASEÑA
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
