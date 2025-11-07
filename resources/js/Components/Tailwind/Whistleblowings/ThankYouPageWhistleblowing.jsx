import { CheckCircle, ArrowLeft, Shield, FileText, Clock, Mail } from "lucide-react";

export default function ThankYouPageWhistleblowing({ 
    title = "¡Denuncia Recibida!", 
    message = "Tu denuncia ha sido registrada exitosamente.",
    submittedData = {},
    onBackToForm 
}) {
    const codigo = submittedData?.codigo || 'N/A';
    const nombre = submittedData?.nombre || 'Usuario';
    const ambito = submittedData?.ambito || 'No especificado';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-3xl w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                        <div className="relative bg-green-500 rounded-full p-6">
                            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2} />
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-12 text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {title}
                        </h1>
                        <p className="text-green-50 text-lg max-w-2xl mx-auto">
                            {message}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-10 space-y-8">
                        {/* Código de Seguimiento */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-amber-100 rounded-full p-3">
                                    <FileText className="w-6 h-6 text-amber-700" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Código de Seguimiento
                                    </h3>
                                    <p className="text-3xl font-bold text-amber-700 tracking-wider mb-2">
                                        {codigo}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Guarda este código para hacer seguimiento de tu denuncia. 
                                        Te hemos enviado una copia por correo electrónico.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de la Denuncia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-blue-100 rounded-full p-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Denunciante</h4>
                                </div>
                                <p className="text-gray-700 text-lg">{nombre}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-purple-100 rounded-full p-2">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Ámbito</h4>
                                </div>
                                <p className="text-gray-700 text-lg">{ambito}</p>
                            </div>
                        </div>

                        {/* Próximos Pasos */}
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        ¿Qué sigue ahora?
                                    </h3>
                                    <ol className="space-y-3 text-gray-700">
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                1
                                            </span>
                                            <span>
                                                <strong>Revisión inicial:</strong> Nuestro equipo de compliance 
                                                revisará tu denuncia en un plazo máximo de 48 horas hábiles.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                2
                                            </span>
                                            <span>
                                                <strong>Investigación:</strong> Si se requiere más información, 
                                                nos contactaremos contigo al email proporcionado.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                3
                                            </span>
                                            <span>
                                                <strong>Resolución:</strong> Te notificaremos sobre las acciones 
                                                tomadas respetando la confidencialidad del proceso.
                                            </span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Confirmación de Email */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                                    <Mail className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Confirmación Enviada
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Hemos enviado un correo de confirmación con todos los detalles 
                                        de tu denuncia y el código de seguimiento.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confidencialidad */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <Shield className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        🔒 Confidencialidad Garantizada
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Tu denuncia será tratada con absoluta confidencialidad. Solo el equipo 
                                        autorizado de compliance tendrá acceso a la información proporcionada.
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>✓ Acceso restringido solo a personal autorizado</li>
                                        <li>✓ Datos protegidos según normativa de protección de datos</li>
                                        <li>✓ No se revelará tu identidad sin tu consentimiento</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer with Action Button */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-600 text-center sm:text-left">
                                Gracias por tu confianza y por ayudarnos a mantener un ambiente de trabajo ético.
                            </p>
                            {onBackToForm && (
                                <button
                                    onClick={onBackToForm}
                                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Volver al formulario
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Si tienes alguna pregunta o necesitas agregar información adicional, 
                        por favor contacta a nuestro equipo de compliance citando tu código de seguimiento.
                    </p>
                </div>
            </div>
        </div>
    );
}
