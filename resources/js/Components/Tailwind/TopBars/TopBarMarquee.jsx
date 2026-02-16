import React, { useEffect, useState, useRef } from "react";
import General from "../../../Utils/General";
import CintilloScheduler from "../../../Utils/CintilloScheduler";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const TopBarMarquee = ({ data }) => {
    const divRef = useRef(null);
    const [activeCintillos, setActiveCintillos] = useState([]);

    const updateActiveCintillos = () => {
        try {
            const cintilloData = General.get("cintillo");
            let allCintillos = [];

            if (cintilloData) {
                try {
                    allCintillos = JSON.parse(cintilloData);
                } catch (e) {
                    allCintillos = cintilloData
                        .split(",")
                        .map((c) => c.trim())
                        .filter((c) => c.length > 0);
                }
            }

            const filtered =
                CintilloScheduler.filterActiveCintillos(allCintillos);
            setActiveCintillos(filtered);
        } catch (error) {
            console.warn("Error al procesar cintillos:", error);
            setActiveCintillos([]);
        }
    };

    useEffect(() => {
        updateActiveCintillos();
        const interval = setInterval(updateActiveCintillos, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (divRef.current) {
            adjustTextColor(divRef.current);
        }
    }, [activeCintillos]);

    if (activeCintillos.length === 0) {
        return null;
    }

    // Creamos el bloque de contenido y lo repetimos muchas veces para asegurar que sea más ancho que la pantalla
    const MarqueeGroup = () => (
        <div className="flex items-center shrink-0">
            {[...Array(10)].map((_, i) => (
                <React.Fragment key={i}>
                    {activeCintillos.map((cintillo, index) => (
                        <React.Fragment key={`${i}-${index}`}>
                            <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase shrink-0 whitespace-nowrap">
                                {CintilloScheduler.getText(cintillo)}
                            </span>
                            <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase shrink-0">
                                •
                            </span>
                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes marquee-infinite {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-infinite {
                    display: flex;
                    width: max-content;
                    animation: marquee-infinite 50s linear infinite;
                }
                .animate-marquee-infinite:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div
                id={data?.element_id || null}
                ref={divRef}
                className={`relative w-full h-10 bg-black text-white z-[60] flex items-center overflow-hidden ${data?.class_content || ""}`}
            >
                {/* Contenedor que se mueve */}
                <div className="animate-marquee-infinite">
                    <MarqueeGroup />
                    <MarqueeGroup />
                </div>
            </div>
        </>
    );
};

export default TopBarMarquee;
