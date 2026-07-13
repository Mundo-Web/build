import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import { toast } from "sonner";
import GoogleSignInButton from "../../Google/GoogleSignInButton";

export default function LoginTwenty({ data }) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const rememberRef = useRef();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        <div id={data?.element_id || null} className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-black text-white px-primary 2xl:px-0 font-paragraph">
            <div className="2xl:max-w-7xl w-full mx-auto">
                <div className="bg-black border border-white/20 shadow-2xl overflow-hidden rounded-none">
                    <div className="flex flex-col lg:flex-row">
                        {/* Imagen decorativa - lado izquierdo */}
                        <div className="hidden lg:block lg:w-1/2 relative min-h-[600px] border-r border-white/10 bg-neutral-900">
                            <img
                                src={`/assets/resources/login.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/logo-bk.svg';
                                }}
                            />

                        </div>

                        {/* Formulario - lado derecho */}
                        <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-16 flex flex-col justify-center bg-black">
                            <div className="max-w-md mx-auto w-full">
                                <div className="text-center lg:text-left">
                                    <h5 className="text-[10px] font-paragraph uppercase tracking-widest text-white">Hola</h5>
                                    <h1 className="mt-2 text-3xl font-paragraph uppercase tracking-widest text-white font-bold">Bienvenido</h1>
                                    <p className="mt-3 text-sm font-paragraph  tracking-wider text-white leading-relaxed">
                                        Inicia sesión para acceder a tu cuenta, seguir tus pedidos y disfrutar de una experiencia de compra extraordinaria.
                                    </p>
                                </div>

                                <form className="mt-8 space-y-6" onSubmit={onLoginSubmit}>
                                    <div className="space-y-4">
                                        {/* Email Input */}
                                        <div>
                                            <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="hola@mail.com"
                                                required
                                                className="w-full bg-transparent border border-white/20 py-4 px-4 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                            />
                                        </div>

                                        {/* Password Input */}
                                        <div>
                                            <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2">
                                                Contraseña
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    className="w-full bg-transparent border border-white/20 py-4 px-4 pr-12 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
                                                >
                                                    {showPassword ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                ref={rememberRef}
                                                className="h-4 w-4 bg-transparent border border-white/30 text-black focus:ring-0 rounded-none focus:outline-none cursor-pointer"
                                            />
                                            <label htmlFor="remember" className="ml-2 text-xs font-paragraph uppercase tracking-widest text-white cursor-pointer">
                                                Guardar mis datos
                                            </label>
                                        </div>
                                        <a
                                            href="/forgot-password"
                                            className="text-xs font-paragraph uppercase tracking-widest text-white/60 hover:text-white border-b border-white/10 hover:border-white pb-0.5 transition-all duration-300"
                                        >
                                            Olvidé mi contraseña
                                        </a>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black hover:bg-white/90 py-4 text-xs font-paragraph uppercase tracking-widest font-bold rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? "Ingresando..." : "Ingresar"}
                                    </button>

                                    {/* Mostrar Google Sign-In solo si está habilitado */}
                                    {Global.GOOGLE_OAUTH_ENABLED && (
                                        <>
                                            <div className="relative my-6">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-white/10" />
                                                </div>
                                                <div className="relative flex justify-center text-[10px] font-paragraph uppercase tracking-widest">
                                                    <span className="px-3 bg-black text-white/40">O continúa con</span>
                                                </div>
                                            </div>

                                            {/* Botón de Google */}
                                            <GoogleSignInButton
                                                onSuccess={() => window.location.href = "/"}
                                                text="Continuar con Google"
                                            />
                                        </>
                                    )}

                                    <div className="text-center mt-6 border-t border-white/10 pt-4">
                                        <p className="text-xs font-paragraph uppercase tracking-wider text-white/40">
                                            ¿Eres nuevo por aquí?{" "}
                                            <a href="/crear-cuenta" className="text-white hover:border-b border-white pb-0.5 ml-1 transition-all">
                                                Crea una cuenta
                                            </a>
                                        </p>
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
