import React, { useEffect, useRef } from "react";
import General from "../../../Utils/General";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import { MapPinned } from "lucide-react";

const TopBarAddress = ({ data }) => {
    const divRef = useRef(null);

    useEffect(() => {
        if (divRef.current) {
            adjustTextColor(divRef.current);
        }
    }, []);

    const address = General.get("address");
    const phoneWhatsapp = General.get("phone_whatsapp");
    const messageWhatsapp = General.get("message_whatsapp");

    // Construir URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneWhatsapp?.replace(/\D/g, '')}${messageWhatsapp ? `?text=${encodeURIComponent(messageWhatsapp)}` : ''}`;

    return (
        <div
            ref={divRef}
            className={`bg-primary py-1 font-semibold  text-sm font-paragraph ${data?.class_content || ""}`}
        >
            <div className="px-primary 2xl:px-0 mx-auto 2xl:max-w-7xl flex justify-between items-center">
                {/* Dirección a la izquierda */}
            <div className={`flex gap-1 items-center ${data?.class_address || ""}`}>
                <MapPinned className="h-5" />
                <span>{address || "Sin dirección configurada"}</span>
            </div>

            {/* Botón Ordenar aquí a la derecha */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-accent text-primary px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2 ${data?.class_button || ""}`}
            >
                <i className="mdi mdi-whatsapp"></i>
                <span>Ordenar aquí</span>
            </a>
            </div>
        </div>
    );
};

export default TopBarAddress;
