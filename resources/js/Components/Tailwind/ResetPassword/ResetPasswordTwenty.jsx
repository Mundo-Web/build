import { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";

export default function ResetPasswordTwenty({ data }) {
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

        if (password !== confirmation) {
            setLoading(false);
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: "Las contraseñas no coinciden",
                showConfirmButton: false,
                timer: 3000,
            });
        }

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
        <div id={data?.element_id || null} className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-black text-white px-primary 2xl:px-0 font-paragraph">
            <div className="2xl:max-w-7xl w-full mx-auto">
                <div className="bg-black border border-white/20 shadow-2xl overflow-hidden rounded-none">
                    <div className="flex flex-col lg:flex-row lg:min-h-[600px]">
                        {/* Left image */}
                        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900 border-r border-white/10">
                            <img
                                src={`/assets/resources/restore.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className="absolute inset-0 w-full h-full object-cover "
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
                                    <h5 className="text-[10px] font-paragraph uppercase tracking-widest text-white">Nueva contraseña</h5>
                                    <h1 className="text-3xl font-paragraph uppercase tracking-widest text-white font-bold">Restaurar contraseña</h1>
                                    <p className="text-sm font-paragraph text-white leading-relaxed">
                                        Crea una clave que sea fácil de recordar para ti, pero difícil de adivinar para otros. Asegúrate de que tenga al menos 8 caracteres, incluyendo una letra mayúscula y un número.
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={onResetSubmit}>
                                    <div>
                                        <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2" htmlFor="password">
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                ref={passwordRef}
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2" htmlFor="confirm-password">
                                            Confirmar contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirm-password"
                                                name="confirm-password"
                                                ref={confirmationRef}
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                disabled={loading}
                                                className="w-full bg-transparent border border-white/20 py-4 px-4 pr-12 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
                                                disabled={loading}
                                            >
                                                {showConfirmPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black hover:bg-white/90 py-4 text-xs font-paragraph uppercase tracking-widest font-bold rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Procesando..." : "Restablecer contraseña"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
