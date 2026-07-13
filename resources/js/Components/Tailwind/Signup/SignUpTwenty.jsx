import JSEncrypt from "jsencrypt";
import { useEffect, useRef, useState } from "react";
import { GET } from "sode-extend-react";
import Global from "../../../Utils/Global";
import AuthClientRest from "../../../Actions/AuthClientRest";
import Swal from "sweetalert2";

export default function SignUpTwenty({ data }) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [invitationData, setInvitationData] = useState(null);

    const nameRef = useRef();
    const lastnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmationRef = useRef();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const invitationType = urlParams.get("type");
        const invitationToken = urlParams.get("token");

        if (invitationType === "seller" && invitationToken) {
            fetch(`/api/seller-invitation/${invitationToken}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data) {
                        setInvitationData({
                            email: data.data.email,
                            name: data.data.name,
                            phone: data.data.phone,
                            token: invitationToken,
                            type: invitationType,
                        });

                        if (emailRef.current && data.data.email) {
                            emailRef.current.value = data.data.email;
                        }

                        if (data.data.name) {
                            const nameParts = data.data.name.trim().split(" ");
                            if (nameParts.length > 0 && nameRef.current) {
                                nameRef.current.value = nameParts[0];
                            }
                            if (nameParts.length > 1 && lastnameRef.current) {
                                lastnameRef.current.value = nameParts.slice(1).join(" ");
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.error("Error fetching invitation:", err);
                });
        }

        if (GET.message)
            Swal.fire({
                icon: "info",
                title: "Mensaje",
                text: GET.message,
                showConfirmButton: false,
                timer: 3000,
            });
    }, []);

    const onSignUpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const name = nameRef.current.value;
        const lastname = lastnameRef.current.value;
        const confirmation = confirmationRef.current.value;

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
            name: jsEncrypt.encrypt(name),
            lastname: jsEncrypt.encrypt(lastname),
            confirmation: jsEncrypt.encrypt(confirmation),
        };

        if (invitationData) {
            request.invitation_type = invitationData.type;
            request.invitation_token = invitationData.token;
        }

        const result = await AuthClientRest.signup(request);

        if (result) {
            window.location.href = "/";
        } else {
            setLoading(false);
        }
    };

    return (
        <div id={data?.element_id || null} className="py-8 lg:py-0 lg:min-h-screen flex items-center justify-center bg-black text-white px-primary 2xl:px-0 font-paragraph">
            <div className="2xl:max-w-7xl w-full mx-auto py-16">
                <div className="bg-black border border-white/20 shadow-2xl overflow-hidden rounded-none">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left image */}
                        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900 border-r border-white/10">
                            <img
                                src={`/assets/resources/signup.png?v=${crypto.randomUUID()}`}
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
                                    <h5 className="text-[10px] font-paragraph uppercase tracking-widest text-white">Vamos a crear</h5>
                                    <h1 className="text-3xl font-paragraph uppercase tracking-widest text-white font-bold">Crear nueva cuenta</h1>
                                    <p className="text-sm font-paragraph  text-white leading-relaxed">
                                        Completa tus datos para crear tu cuenta y acceder a todas nuestras funciones de manera rápida y segura.
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={onSignUpSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2" htmlFor="name">
                                                Nombres
                                            </label>
                                            <input
                                                id="name"
                                                ref={nameRef}
                                                name="name"
                                                type="text"
                                                placeholder="Carlos"
                                                required
                                                className="w-full bg-transparent border border-white/20 py-4 px-4 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2" htmlFor="lastname">
                                                Apellidos
                                            </label>
                                            <input
                                                id="lastname"
                                                ref={lastnameRef}
                                                name="lastname"
                                                type="text"
                                                placeholder="Soria"
                                                required
                                                className="w-full bg-transparent border border-white/20 py-4 px-4 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                            />
                                        </div>
                                    </div>

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
                                            readOnly={invitationData !== null}
                                            disabled={invitationData !== null}
                                            className="w-full bg-transparent border border-white/20 py-4 px-4 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                        />
                                        {invitationData && (
                                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
                                                Este email está vinculado a tu invitación.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-paragraph uppercase tracking-widest text-white/70 mb-2" htmlFor="password">
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                ref={passwordRef}
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
                                                ref={confirmationRef}
                                                name="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-transparent border border-white/20 py-4 px-4 pr-12 text-xs font-paragraph uppercase tracking-wider rounded-none text-white focus:border-white placeholder:text-white/20 focus:ring-0 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
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
                                        className="w-full bg-white text-black hover:bg-white/90 py-4 text-xs font-paragraph uppercase tracking-widest font-bold rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                                    </button>

                                    <div className="text-center mt-6 border-t border-white/10 pt-4">
                                        <p className="text-xs font-paragraph uppercase tracking-wider text-white/40">
                                            ¿Ya tienes una cuenta?{" "}
                                            <a href="/iniciar-sesion" className="text-white hover:border-b border-white pb-0.5 ml-1 transition-all">
                                                Inicia sesión
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
