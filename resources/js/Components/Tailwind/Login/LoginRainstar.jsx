import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
import GoogleSignInButton from "../../Google/GoogleSignInButton";
import { ArrowRight, Loader2 } from "lucide-react";

const InputField = ({
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
}) => (
    <div className="space-y-1.5 w-full text-left">
        <label className="text-xs font-bold tracking-widest text-neutral-light block mb-1.5">
            {label}
        </label>
        <div className="relative group">
            <input
                {...props}
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
);

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
                            src={`/assets/resources/login.png?v=${Date.now()}`}
                            alt={`Inicio de sesión ${Global.APP_NAME}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/api/cover/thumbnail/null";
                            }}
                        />
                        <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>

                    {/* Right Side: Content (Header + Form) */}
                    <div className="lg:col-span-6">
                        <div className="max-w-md mx-auto lg:mx-0">
                            {/* Header moved here for readability */}
                            <div className="mb-12">
                                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
                                    Iniciar <br /> Sesión
                                </h1>
                            </div>

                            <form
                                onSubmit={onLoginSubmit}
                                className="space-y-10"
                            >
                                <div className="space-y-8">
                                    <InputField
                                        label="Usuario / Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="hola@mail.com"
                                        required
                                    />

                                    <InputField
                                        label="Contraseña"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Tu contraseña"
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
                                    <div className="flex justify-end pt-2">
                                        <a
                                            href="/forgot-password"
                                            className="text-[10px] font-bold  tracking-widest text-neutral-light hover:text-black transition-all border-b border-transparent hover:border-black"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-8">
                                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                name="remember"
                                                checked={formData.remember}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-5 h-5 border-2 transition-all flex items-center justify-center ${formData.remember ? "bg-black border-black" : "border-neutral-200 group-hover:border-black"}`}
                                            >
                                                {formData.remember && (
                                                    <div className="w-1.5 h-1.5 bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-light group-hover:text-black transition-colors">
                                            Recordarme
                                        </span>
                                    </label>

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
                                                INGRESAR
                                                <ArrowRight
                                                    size={18}
                                                    className="group-hover:translate-x-2 transition-transform"
                                                />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {Global.GOOGLE_OAUTH_ENABLED && (
                                    <div className="pt-10 border-t border-neutral-100">
                                        <p className="text-center text-[9px] font-black text-neutral-300 uppercase tracking-[0.5em] mb-8">
                                            O accede vía
                                        </p>
                                        <div className="flex justify-center">
                                            <GoogleSignInButton
                                                onSuccess={() =>
                                                    (window.location.href = "/")
                                                }
                                                text="Google"
                                                className="w-full py-5 border-2 border-neutral-100 text-[10px] font-black uppercase tracking-[0.2em] hover:border-black transition-all duration-300 flex items-center justify-center gap-4"
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>

                            {/* Signup link at the bottom for better flow */}
                            <div className="pt-12 border-t border-neutral-100 mt-12">
                                <p className="text-[10px] text-neutral-light tracking-widest mb-4 font-black">
                                    ¿Aún no tienes cuenta?
                                </p>
                                <a
                                    href="/crear-cuenta"
                                    className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all"
                                >
                                    UNIRSE AHORA
                                    <ArrowRight
                                        size={18}
                                        className="group-hover:translate-x-2 transition-transform"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
