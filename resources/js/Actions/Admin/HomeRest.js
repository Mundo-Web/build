import BasicRest from "../BasicRest";

class HomeRest extends BasicRest {
  path = 'admin/dashboard'

  /**
   * Actualiza la configuración de visibilidad del dashboard
   * @param {Object} visibilityConfig - Configuración de visibilidad de las cards
   * @returns {Promise} - Respuesta del servidor
   */
  async updateDashboardVisibility(visibilityConfig) {
    try {
      // Crear una instancia temporal para la ruta específica de visibilidad
      const originalPath = this.path;
      this.path = 'admin/dashboard/visibility';
      
      // Usar el método save heredado de BasicRest que maneja CSRF automáticamente
      const response = await this.save({ visibility: visibilityConfig });
      
      // Restaurar la ruta original
      this.path = originalPath;
      
      return response;
    } catch (error) {
      console.error('Error updating dashboard visibility:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos del dashboard
   * @returns {Promise} - Datos del dashboard
   */
  async getDashboardData() {
    try {
      const response = await this.get();
      return response;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

export default HomeRest;