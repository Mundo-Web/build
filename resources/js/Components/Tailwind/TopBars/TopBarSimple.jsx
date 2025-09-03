import { useEffect } from "react";
import General from "../../../Utils/General";
import { useRef } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import AnimatedCintillo from "../Components/AnimatedCintillo";
import useCintillos from "../../../Hooks/useCintillos";

const TopBarSimple = ({}) => {
    const divRef = useRef(null);
    const { hasActiveCintillos } = useCintillos();

    useEffect(() => {
        if (divRef.current) {
            adjustTextColor(divRef.current); // Llama a la función
        }
    }, []);

    // Si no hay cintillos activos, no renderizar nada
    if (!hasActiveCintillos) {
        return null;
    }
    
    return (
        <div
            ref={divRef}
            className="hidden bg-primary py-3 font-bold px-primary md:flex justify-center items-center text-sm font-font-secondary"
        >
            <p>
                <AnimatedCintillo />
            </p>
        </div>
    );
};

export default TopBarSimple;
