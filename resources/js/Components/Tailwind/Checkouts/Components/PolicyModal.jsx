import { X } from "lucide-react";
import ReactModal from "react-modal";

export default function PolicyModal({ isOpen, onClose }) {
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
                        Términos y Condiciones
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
                
                <div className="prose max-w-none text-sm space-y-4">
                    <h3 className="font-semibold text-lg">1. Aceptación de los Términos</h3>
                    <p>
                        Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones de uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
                    </p>

                    <h3 className="font-semibold text-lg">2. Uso del Sitio Web</h3>
                    <p>
                        Este sitio web está destinado para uso personal y comercial. No está permitido:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Usar el sitio para cualquier propósito ilegal o no autorizado</li>
                        <li>Intentar obtener acceso no autorizado a cualquier parte del sitio</li>
                        <li>Interferir con la seguridad del sitio web</li>
                        <li>Transmitir virus o código malicioso</li>
                    </ul>

                    <h3 className="font-semibold text-lg">3. Productos y Servicios</h3>
                    <p>
                        Los productos mostrados en este sitio web están sujetos a disponibilidad. Nos reservamos el derecho de descontinuar cualquier producto en cualquier momento. Los precios están sujetos a cambios sin previo aviso.
                    </p>

                    <h3 className="font-semibold text-lg">4. Proceso de Compra</h3>
                    <p>
                        Al realizar una compra, usted confirma que la información proporcionada es verdadera y completa. Todas las compras están sujetas a verificación y aceptación.
                    </p>

                    <h3 className="font-semibold text-lg">5. Política de Envíos</h3>
                    <p>
                        Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad del producto. Los costos de envío se calculan al momento de la compra.
                    </p>

                    <h3 className="font-semibold text-lg">6. Política de Devoluciones</h3>
                    <p>
                        Las devoluciones se aceptan dentro de los 30 días posteriores a la compra, siempre que el producto esté en su estado original. Los costos de envío de devolución corren por cuenta del cliente.
                    </p>

                    <h3 className="font-semibold text-lg">7. Limitación de Responsabilidad</h3>
                    <p>
                        En ningún caso seremos responsables por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestros productos o servicios.
                    </p>

                    <h3 className="font-semibold text-lg">8. Modificaciones</h3>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
                    </p>

                    <h3 className="font-semibold text-lg">9. Contacto</h3>
                    <p>
                        Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de nuestros canales de atención al cliente.
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
