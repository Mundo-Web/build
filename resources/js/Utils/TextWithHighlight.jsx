import { useState, useEffect } from 'react';

const TextWithHighlight = ({ text = "", split = false, split_coma = false, split_dos_puntos = false, color = "bg-accent", counter = false, className = "" }) => {
    // Función para procesar el texto con resaltados
    const safeText = text || "";
    const [currentNumber, setCurrentNumber] = useState(0);

    // Efecto para animar el contador
    useEffect(() => {
        if (counter) {
            // Extraer el número del texto
            const numberMatch = safeText.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
            if (numberMatch) {
                const targetNumber = parseFloat(numberMatch[0].replace(/,/g, ''));
                const duration = 2000; // 2 segundos de animación
                const increment = targetNumber / (duration / 16); // 60 FPS aproximadamente

                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNumber) {
                        setCurrentNumber(targetNumber);
                        clearInterval(timer);
                    } else {
                        setCurrentNumber(Math.floor(current));
                    }
                }, 16);

                return () => clearInterval(timer);
            }
        }
    }, [counter, safeText]);

    const renderHighlightedText = (textToRender) => {
        let processedText = textToRender;

        // Si counter está activado, reemplazar el número con el contador animado
        if (counter) {
            const numberMatch = textToRender.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
            if (numberMatch) {
                const formattedNumber = currentNumber.toLocaleString();
                processedText = textToRender.replace(numberMatch[0], formattedNumber);
            }
        }

        const parts = processedText.split(/(\*[^*]+\*)/g); // separa todo lo entre *...*

        return parts.map((part, index) => {
            if (part.startsWith("*") && part.endsWith("*")) {
                const cleanedClassName = className.replace(/\btext-[a-z0-9-]+\b/g, "");
                return (
                    <span
                        key={index}
                        className={`${cleanedClassName} ${color} bg-clip-text text-transparent`}
                        style={{ WebkitBackgroundClip: "text", backgroundClip: "text" }}
                    >
                        {part.slice(1, -1)}
                    </span>
                );
            } else {
                return (
                    <span className={`${className}`} key={index}>
                        {part}
                    </span>
                );
            }
        });
    };

    if (split) {
        const words = safeText.split(" ");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(" ");

        return (
            <div className={`flex flex-col ${className}`}>
                <span className={`block ${className}`}>{renderHighlightedText(firstWord)}</span>
                <span className={`block ${className}`}>
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }

    if (split_coma) {
        const words = safeText.split(",");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(" ");

        return (
            <div className={`flex flex-col ${className}`}>
                <span className={`block ${className}`}>{renderHighlightedText(firstWord)}</span>
                <span className={`block ${className}`}>
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }
    if (split_dos_puntos) {
        const words = safeText.split(":");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(" ");

        return (
            <div className={`flex flex-col ${className}`}>
                <span className={`block ${className}`}>{firstWord}</span>
                <span className={`block ${className}`}>
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }

    return <span className={className}>{renderHighlightedText(safeText)}</span>;
};

export default TextWithHighlight;
