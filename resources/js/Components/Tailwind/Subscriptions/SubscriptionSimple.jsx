import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { CircleCheckBig } from "lucide-react";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";

const SubscriptionSimple = ({ data }) => {
    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();
    const [saving, setSaving] = useState(false);

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const request = {
            email: emailRef.current.value,
            status: 1,
        };
        
        const result = await subscriptionsRest.save(request);
        setSaving(false);

        if (!result) return;

        toast.success("¡Suscrito!", {
            description: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: <CircleCheckBig className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: "top-center",
        });

        emailRef.current.value = null;
    };

    return (
        <section id={data?.element_id || null} className="bg-[#54340E] bg-cover bg-opacity-100 relative flex flex-col gap-2">
            <div 
                className="bg-cover bg-center w-full relative" 
                style={{ 
                    backgroundImage: data?.background_image 
                        && `url(${data.background_image})` 
                       
                }}
            >
                {/* Overlay */}
                <div className="w-full h-full absolute opacity-60 bg-[#54340E]"></div>

                <form onSubmit={onEmailSubmit}>
                    <div className="flex flex-col gap-2 justify-center items-center py-10 lg:py-16 px-[5%] relative">
                        {/* Título */}
                        <h2 className="text-white font-title text-4xl lg:text-5xl z-10 text-center ">
                            {data?.title || 'Suscríbete a nuestro blog'}
                        </h2>
                        
                        {/* Descripción */}
                        {data?.description && (
                            <p className="text-white text-base font-paragraph w-full leading-tight text-center z-10 max-w-2xl">
                                {data.description}
                            </p>
                        )}
                        
                        {/* Formulario */}
                        <div className="z-10 mt-8 flex flex-col gap-2 w-full max-w-md">
                            <div className="md:space-x-2 bg-white px-5 py-3 rounded-xl overflow-hidden min-w-[250px] w-full flex flex-col md:flex-row gap-3">
                                <input 
                                    ref={emailRef}
                                    type="email" 
                                    required 
                                    disabled={saving}
                                    className="customtext-neutral-dark max-w-[300px] font-paragraph ring-0 border-0 focus:ring-0 focus:border-0 focus:outline-none border-transparent ring-transparent bg-transparent flex-1" 
                                    placeholder={data?.placeholder || "Introduce tu email"}
                                />
                                
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className={`text-white w-full md:w-auto px-4 py-2 rounded-lg font-paragraph font-semibold transition-colors hover:opacity-90 ${
                                        data?.button_color ? `bg-[${data.button_color}]` : 'bg-primary'
                                    }`}
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                />
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : (
                                        data?.button_text || 'Suscribir'
                                    )}
                                </button>
                            </div>
                            
                            {/* Nota de privacidad */}
                            {data?.privacy_note && (
                                <p className="text-white text-sm font-paragraph w-full leading-tight text-center z-10">
                                    {data.privacy_note}
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SubscriptionSimple;