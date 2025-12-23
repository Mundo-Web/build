import BasicRest from "../BasicRest";

class GalleryRest extends BasicRest {
  path = 'admin/gallery'
  hasFiles = true

  async updateVisibility(visibilityUpdates) {
    try {
      // Crear una instancia temporal para la ruta específica de visibilidad
      const originalPath = this.path;
      const originalHasFiles = this.hasFiles;
      
      this.path = 'admin/gallery/visibility';
      this.hasFiles = false; // Cambiar a false para enviar JSON en lugar de FormData
      
      // Usar el método save heredado de BasicRest que maneja CSRF automáticamente
      const response = await this.save({ visibility: visibilityUpdates });
      
      // Restaurar la configuración original
      this.path = originalPath;
      this.hasFiles = originalHasFiles;
      
      return response;
    } catch (error) {
      console.error('Error updating visibility:', error);
      throw error;
    }
  }
}

export default GalleryRest