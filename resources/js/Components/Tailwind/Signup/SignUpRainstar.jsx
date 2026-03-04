import { useEffect, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
import GoogleSignInButton from "../../Google/GoogleSignInButton";
import { ArrowRight, Loader2 } from "lucide-react";
import React from "react"; // Added React import for React.forwardRef

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

export default function SignUpRainstar({ data }) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [invitationData, setInvitationData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmation: "",
    });

    useEffect(() => {
        // Leer parámetros de invitación
        const urlParams = new URLSearchParams(window.location.search);
        const invitationType = urlParams.get("type");
        const invitationToken = urlParams.get("token");

        // Si hay una invitación, obtener los datos
        if (invitationType === "provider" && invitationToken) {
            fetch(`/api/provider-invitation/${invitationToken}`)
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

                        // Pre-llenar el formulario
                        const nameParts = data.data.name
                            ? data.data.name.trim().split(" ")
                            : [];
                        setFormData((prev) => ({
                            ...prev,
                            email: data.data.email || "",
                            name: nameParts.length > 0 ? nameParts[0] : "",
                            lastname:
                                nameParts.length > 1
                                    ? nameParts.slice(1).join(" ")
                                    : "",
                        }));
                    }
                })
                .catch((err) => {
                    console.error("Error fetching invitation:", err);
                });
        }
    }, []);

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

    const onSignUpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { name, lastname, email, password, confirmation } = formData;

        if (password !== confirmation) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Las contraseñas no coinciden",
                showConfirmButton: false,
                timer: 3000,
            });
            setLoading(false);
            return;
        }

        const request = {
            name: jsEncrypt.encrypt(name),
            lastname: jsEncrypt.encrypt(lastname),
            email: jsEncrypt.encrypt(email),
            password: jsEncrypt.encrypt(password),
            confirmation: jsEncrypt.encrypt(confirmation),
        };

        // Si hay datos de invitación, agregarlos al request
        if (invitationData) {
            request.invitation_type = invitationData.type;
            request.invitation_token = invitationData.token;
        }

        // Enviar el código de referido si existe en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get("ref");
        if (refCode) {
            request.ref = refCode;
        }

        const result = await AuthClientRest.signup(request);
        setLoading(false);

        if (!result) {
            return;
        }

        window.location.href = "/";
    };

    return (
        <section
            id={data?.element_id || null}
            className="bg-white min-h-screen flex items-center justify-center py-12 lg:py-12"
        >
            <div className="w-full mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 xl:gap-24 items-center">
                    {/* Left Side: Decorative Image (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-6 h-full relative overflow-hidden group">
                        <img
                            src={`/assets/resources/signup.png?v=${Date.now()}`}
                            alt={`Crear cuenta ${Global.APP_NAME}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/api/cover/thumbnail/null";
                            }}
                        />
                        <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>

                    {/* Right Side: Content (Header + Form) */}
                    <div className="lg:col-span-6">
                        <div className="max-w-md mx-auto lg:mx-0 py-12">
                            <div className="mb-12">
                                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
                                    Crear <br /> Cuenta
                                </h1>
                            </div>

                            <form
                                onSubmit={onSignUpSubmit}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <InputField
                                            label="Nombres"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Juan"
                                            required
                                        />
                                        {invitationData?.name && (
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-light mt-2">
                                                Datos de tu solicitud
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <InputField
                                            label="Apellidos"
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            placeholder="Pérez"
                                            required
                                        />
                                        {invitationData?.name && (
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-light mt-2">
                                                Datos de tu solicitud
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="relative">
                                    <InputField
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="hola@mail.com"
                                        required
                                        readOnly={invitationData !== null}
                                        disabled={invitationData !== null}
                                    />
                                    {invitationData && (
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-light mt-2">
                                            Este email está vinculado a tu
                                            invitación como proveedor
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField
                                        label="Contraseña"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
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
                                        name="confirmation"
                                        value={formData.confirmation}
                                        onChange={handleChange}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Repite tu contraseña"
                                        required
                                    />
                                </div>

                                <div className="pt-8">
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
                                                REGISTRARME
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
                                            O regístrate con
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

                            <div className="pt-12 border-t border-neutral-100 mt-12">
                                <p className="text-[10px] text-neutral-light  tracking-widest mb-4 font-black">
                                    ¿Ya tienes cuenta?
                                </p>
                                <a
                                    href="/iniciar-sesion"
                                    className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all"
                                >
                                    INICIAR SESIÓN
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
