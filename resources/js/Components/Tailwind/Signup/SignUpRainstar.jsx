import { useEffect, useState } from "react";
import JSEncrypt from "jsencrypt";
import Global from "../../../Utils/Global";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import AuthClientRest from "../../../Actions/AuthClientRest";
import InputForm from "../Checkouts/Components/InputForm";
import GoogleSignInButton from "../../Google/GoogleSignInButton";
import { ArrowRight, Loader2 } from "lucide-react";

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

        const result = await AuthClientRest.signup(request);
        setLoading(false);

        if (!result) {
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Info Side */}
                    <div className="lg:col-span-5 order-2 lg:order-1 sticky top-32">
                        <div className="space-y-8">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                                    Únete a Nosotros
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                                    Crear <br /> Cuenta
                                </h1>
                                <p className="text-neutral-500 text-sm uppercase tracking-widest leading-relaxed max-w-md">
                                    Regístrate para acceder a ofertas
                                    exclusivas, seguimiento de pedidos y más.
                                </p>
                            </div>

                            <div className="border-t border-neutral-100 pt-8">
                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
                                    ¿Ya tienes cuenta?
                                </p>
                                <a
                                    href="/login"
                                    className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
                                >
                                    Iniciar Sesión
                                    <ArrowRight
                                        size={14}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="lg:col-span-1 hidden lg:block order-1 lg:order-2">
                        <div className="w-[1px] h-full min-h-[400px] bg-neutral-100 mx-auto"></div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-6 order-1 lg:order-3">
                        <form onSubmit={onSignUpSubmit} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <InputForm
                                        label="Nombres"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="JUAN"
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    {invitationData?.name && (
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-1">
                                            Datos de tu solicitud
                                        </p>
                                    )}
                                </div>
                                <div>
                                    {" "}
                                    <InputForm
                                        label="Apellidos"
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        placeholder="PÉREZ"
                                        className={rainstarInputClass}
                                        labelClass={rainstarLabelClass}
                                    />
                                    {invitationData?.name && (
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-1">
                                            Datos de tu solicitud
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <InputForm
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="HOLA@MAIL.COM"
                                    className={rainstarInputClass}
                                    labelClass={rainstarLabelClass}
                                    readOnly={invitationData !== null}
                                    disabled={invitationData !== null}
                                />
                                {invitationData && (
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-1">
                                        Este email está vinculado a tu
                                        invitación como proveedor
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                </div>
                                <div className="space-y-0 w-full">
                                    <label
                                        className={rainstarLabelClass}
                                        htmlFor="confirmation"
                                    >
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        id="confirmation"
                                        value={formData.confirmation}
                                        onChange={handleChange}
                                        name="confirmation"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className={`${rainstarInputClass} w-full`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:brightness-125 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-black/10 ml-auto"
                                >
                                    {loading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={16}
                                        />
                                    ) : (
                                        <>
                                            REGISTRARME
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
                                        O regístrate con
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
