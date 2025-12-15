import { X } from "lucide-react";
import ReactModal from "react-modal";

export default function PrivacyModal({ isOpen, onClose }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            ariaHideApp={false}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Política de Privacidad
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
                
                <div className="prose max-w-none text-sm space-y-4">
                    <h3 className="font-semibold text-lg">1. Información que Recopilamos</h3>
                    <p>
                        Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta, realiza una compra, o se comunica con nosotros. Esto incluye:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Nombre, dirección de correo electrónico y número de teléfono</li>
                        <li>Dirección de envío y facturación</li>
                        <li>Información de pago (procesada de forma segura)</li>
                        <li>Historial de compras y preferencias</li>
                    </ul>

                    <h3 className="font-semibold text-lg">2. Cómo Utilizamos su Información</h3>
                    <p>
                        Utilizamos la información recopilada para:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Procesar y entregar sus pedidos</li>
                        <li>Proporcionar atención al cliente</li>
                        <li>Personalizar su experiencia de compra</li>
                        <li>Enviar comunicaciones sobre productos y ofertas (con su consentimiento)</li>
                        <li>Mejorar nuestros productos y servicios</li>
                    </ul>

                    <h3 className="font-semibold text-lg">3. Compartir Información</h3>
                    <p>
                        No vendemos, alquilamos o compartimos su información personal con terceros para fines de marketing sin su consentimiento explícito. Podemos compartir información en las siguientes circunstancias:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                        <li>Para cumplir con obligaciones legales</li>
                        <li>Para proteger nuestros derechos y seguridad</li>
                    </ul>

                    <h3 className="font-semibold text-lg">4. Seguridad de Datos</h3>
                    <p>
                        Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra el acceso, alteración, divulgación o destrucción no autorizados.
                    </p>

                    <h3 className="font-semibold text-lg">5. Cookies y Tecnologías Similares</h3>
                    <p>
                        Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web, analizar el tráfico y personalizar el contenido. Puede controlar las cookies a través de la configuración de su navegador.
                    </p>

                    <h3 className="font-semibold text-lg">6. Sus Derechos</h3>
                    <p>
                        Usted tiene derecho a:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Acceder a su información personal</li>
                        <li>Corregir información inexacta</li>
                        <li>Solicitar la eliminación de su información</li>
                        <li>Oponerse al procesamiento de su información</li>
                        <li>Retirar el consentimiento en cualquier momento</li>
                    </ul>

                    <h3 className="font-semibold text-lg">7. Retención de Datos</h3>
                    <p>
                        Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que se requiera un período de retención más largo por ley.
                    </p>

                    <h3 className="font-semibold text-lg">8. Contacto</h3>
                    <p>
                        Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, puede contactarnos a través de nuestros canales de atención al cliente.
                    </p>

                    <h3 className="font-semibold text-lg">9. Cambios a esta Política</h3>
                    <p>
                        Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en nuestro sitio web.
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}
