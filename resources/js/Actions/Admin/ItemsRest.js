import { Fetch } from "sode-extend-react";
import BasicRest from "../BasicRest";

class ItemsRest extends BasicRest {
    path = "admin/items";
    hasFiles = true;

    importData = async (request) => {
        console.log("FormData recibido en importData:", [...request.entries()]);

        try {
            const response = await fetch(`/api/unified-import`, {
                method: "POST",
                body: request,
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (!response.ok) {
                throw new Error(
                    result?.error ??
                        result?.message ??
                        "Error en la importación"
                );
            }

            return result;
        } catch (error) {
            console.error("Error en importData:", error.message);
            throw error; // ✅ Lanza el error para que `handleUpload()` lo capture
        }
    };

    exportData = async () => {
        try {
            const response = await fetch(`/api/${this.path}/export`, {
                method: "GET",
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            if (!response.ok) {
                // Intentar parsear como JSON para obtener el error
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData?.message || errorData?.error || "Error al exportar items"
                    );
                } else {
                    // Si no es JSON, obtener el texto (probablemente HTML de error)
                    const errorText = await response.text();
                    console.error('Error HTML:', errorText);
                    throw new Error(`Error del servidor (${response.status}): Revisa la consola del navegador y los logs de Laravel`);
                }
            }

            // Obtener el blob de la respuesta
            const blob = await response.blob();
            
            // Verificar que sea un archivo Excel válido
            if (blob.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
                blob.type !== 'application/octet-stream') {
                console.error('Tipo de archivo recibido:', blob.type);
                throw new Error('El servidor no devolvió un archivo Excel válido');
            }
            
            // Crear nombre de archivo con fecha
            const fileName = `items_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            // Crear enlace temporal para descarga
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return true;
        } catch (error) {
            console.error("Error en exportData:", error.message);
            throw error;
        }
    };
}

export default ItemsRest;
