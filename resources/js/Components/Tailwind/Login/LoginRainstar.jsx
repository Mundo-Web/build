import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
import GoogleSignInButton from "../../Google/GoogleSignInButton";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginRainstar({ data }) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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

    const onLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = formData?.email;
        const password = formData?.password;

        const request = {
            email: jsEncrypt.encrypt(email),
            password: jsEncrypt.encrypt(password),
        };

        const result = await AuthClientRest.login(request);
        setLoading(false);

        if (!result || result.status !== 200) {
            return;
        }

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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Info Side */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="space-y-8">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                                    Bienvenido
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                                    Iniciar <br /> Sesión
                                </h1>
                                <p className="text-neutral-500 text-sm uppercase tracking-widest leading-relaxed max-w-md">
                                    Accede a tu cuenta para gestionar tus
                                    pedidos y disfrutar de una experiencia
                                    personalizada.
                                </p>
                            </div>

                            <div className="border-t border-neutral-100 pt-8">
                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
                                    ¿Aún no tienes cuenta?
                                </p>
                                <a
                                    href="/crear-cuenta"
                                    className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
                                >
                                    Crear Cuenta
                                    <ArrowRight
                                        size={14}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-1 hidden lg:block order-1 lg:order-2">
                        <div className="w-[1px] h-64 bg-neutral-100 mx-auto"></div>
                    </div>

                    <div className="lg:col-span-6 order-1 lg:order-3">
                        <form onSubmit={onLoginSubmit} className="space-y-12">
                            <div className="space-y-8">
                                <InputForm
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="HELLO@EMAIL.COM"
                                    className={rainstarInputClass}
                                    labelClass={rainstarLabelClass}
                                />

                                <div className="space-y-2">
                                    <label
                                        className={rainstarLabelClass}
                                        htmlFor="password"
                                    >
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
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
                                    <div className="flex justify-end pt-2">
                                        <a
                                            href="/forgot-password"
                                            className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                                <div className="flex items-center gap-3 mr-auto">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        checked={formData.remember}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-black bg-transparent border-neutral-300 rounded-none focus:ring-0"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-[10px] font-bold uppercase tracking-widest select-none cursor-pointer"
                                    >
                                        Recordarme
                                    </label>
                                </div>

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
                                            INGRESAR
                                            <ArrowRight
                                                size={14}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </>
                                    )}
                                </button>
                            </div>

                            {Global.GOOGLE_OAUTH_ENABLED && (
                                <div className="pt-8 border-t border-neutral-100 mt-8">
                                    <p className="text-center text-[10px] text-neutral-400 uppercase tracking-widest mb-6">
                                        O continúa con
                                    </p>
                                    <div className="flex justify-center">
                                        <GoogleSignInButton
                                            onSuccess={() =>
                                                (window.location.href = "/")
                                            }
                                            text="Google"
                                            className="px-8 py-4 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3"
                                        />
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
