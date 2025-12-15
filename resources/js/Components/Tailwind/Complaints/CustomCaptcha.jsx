import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import axios from 'axios';

const CustomCaptcha = forwardRef(({ onVerify, error }, ref) => {
    const [captchaImage, setCaptchaImage] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [attemptsRemaining, setAttemptsRemaining] = useState(5);
    const [loadTime, setLoadTime] = useState(Date.now());
    const hasGeneratedRef = useRef(false);

    // Función para generar CAPTCHA desde el servidor
    const generateCaptcha = async () => {
        setIsLoading(true);
        setLocalError('');
        setUserInput('');
        setIsVerified(false);
        setAttemptsRemaining(5);
        onVerify(false, null);

        try {
            const response = await axios.post('/api/captcha/generate');
            const { token, image } = response.data;
            
            setCaptchaToken(token);
            setCaptchaImage(image);
            setLoadTime(Date.now()); // Registrar tiempo de carga
        } catch (err) {
            if (err.response?.status === 429) {
                setLocalError('Demasiados intentos. Por favor, espera un momento e intenta nuevamente.');
            } else {
                setLocalError(err.response?.data?.error || 'Error al cargar CAPTCHA. Intenta nuevamente.');
            }
            console.error('Error generando CAPTCHA:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Exponer la función reset al componente padre
    useImperativeHandle(ref, () => ({
        reset: generateCaptcha
    }));

    // Generar captcha inicial solo una vez
    useEffect(() => {
        if (!hasGeneratedRef.current) {
            hasGeneratedRef.current = true;
            generateCaptcha();
        }
    }, []);

    // Verificar input del usuario (debounce para evitar múltiples llamadas)
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setUserInput(value);
        setLocalError('');

        // Solo validar cuando tiene 6 caracteres
        if (value.length === 6) {
            setIsLoading(true);
            
            try {
                const response = await axios.post('/api/captcha/verify', {
                    token: captchaToken,
                    answer: value
                });

                if (response.data.success) {
                    setIsVerified(true);
                    onVerify(true, captchaToken);
                } else {
                    setIsVerified(false);
                    onVerify(false, null);
                }
            } catch (err) {
                const errorData = err.response?.data;
                setIsVerified(false);
                onVerify(false, null);
                
                if (errorData?.attempts_remaining !== undefined) {
                    setAttemptsRemaining(errorData.attempts_remaining);
                }
                
                setLocalError(errorData?.error || 'Error al verificar CAPTCHA');
                
                // Si el token expiró o se bloqueó, generar nuevo CAPTCHA
                if (err.response?.status === 400 && errorData?.error?.includes('expirado')) {
                    setTimeout(() => generateCaptcha(), 2000);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsVerified(false);
            onVerify(false, null);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium customtext-neutral-dark mb-2">
                Verificación de seguridad
            </label>
            <div className='flex flex-col lg:flex-row gap-4 items-center'>
                {/* Imagen del captcha desde el servidor */}
                <div className="flex items-center gap-4">
                    <div className="relative min-w-[300px]">
                        {isLoading && !captchaImage ? (
                            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg px-6 py-4 h-[100px] flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <img 
                                src={captchaImage} 
                                alt="CAPTCHA" 
                                className="border-2 border-gray-300 rounded-lg select-none pointer-events-none"
                                draggable="false"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        )}
                    </div>
                    
                    <button
                        type="button"
                        onClick={generateCaptcha}
                        disabled={isLoading}
                        className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Generar nuevo código"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-300 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                <div className='w-full'>
                    {/* Input del usuario */}
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="Ingresa el código de 6 caracteres"
                            maxLength={6}
                            className={`w-full px-4 py-3 border rounded-xl font-mono text-lg tracking-wider focus:ring-2 focus:outline-none transition-all duration-300 uppercase disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                isVerified 
                                    ? 'border-primary customtext-primary' 
                                    : (error || localError)
                                    ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                                    : 'border-gray-300 focus:ring-blue-200'
                            }`}
                        />
                        
                        {/* Indicador visual */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isLoading && userInput.length === 6 ? (
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            ) : isVerified ? (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {(error || localError) && (
                        <div className="mt-2 space-y-1">
                            <p className="text-red-500 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {error || localError}
                            </p>
                            {attemptsRemaining < 5 && attemptsRemaining > 0 && (
                                <p className="text-orange-600 text-xs">
                                    Intentos restantes: {attemptsRemaining}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Información adicional */}
            <p className="text-xs customtext-neutral-light">
                Ingresa exactamente el código que aparece en la imagen. No distingue entre mayúsculas y minúsculas.
            </p>
        </div>
    );
});

export default CustomCaptcha;