import BasicRest from "../BasicRest";

class GeneralsRest extends BasicRest {
  path = 'admin/generals'

  async updateVisibility(visibilityUpdates) {
    try {
      // Crear una instancia temporal para la ruta específica de visibilidad
      const originalPath = this.path;
      this.path = 'admin/generals/visibility';
      
      // Usar el método save heredado de BasicRest que maneja CSRF automáticamente
      const response = await this.save({ updates: visibilityUpdates });
      
      // Restaurar la ruta original
      this.path = originalPath;
      
      return response;
    } catch (error) {
      console.error('Error updating visibility:', error);
      throw error;
    }
  }
}

export default GeneralsRest