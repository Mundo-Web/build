import BasicRest from "../BasicRest";
import { Cookies } from "sode-extend-react";

class BookingsRest extends BasicRest {
  path = 'admin/bookings'

  /**
   * Confirmar una reserva
   * @param {string} id - ID de la reserva
   * @returns {Promise}
   */
  async confirm(id) {
    return await this.postRequest(`/api/admin/bookings/${id}/confirm`);
  }

  /**
   * Completar una reserva (check-out realizado)
   * @param {string} id - ID de la reserva
   * @returns {Promise}
   */
  async complete(id) {
    return await this.postRequest(`/api/admin/bookings/${id}/complete`);
  }

  /**
   * Cancelar una reserva
   * @param {string} id - ID de la reserva
   * @param {object} data - Datos con la razón de cancelación
   * @returns {Promise}
   */
  async cancel(id, data) {
    return await this.postRequest(`/api/admin/bookings/${id}/cancel`, data);
  }

  /**
   * Marcar como no show
   * @param {string} id - ID de la reserva
   * @returns {Promise}
   */
  async noShow(id) {
    return await this.postRequest(`/api/admin/bookings/${id}/no-show`);
  }

  /**
   * Actualizar el estado del sale asociado a la reserva
   * @param {string} id - ID de la reserva
   * @param {object} data - { status_id, notify_client }
   * @returns {Promise}
   */
  async updateSaleStatus(id, data) {
    return await this.postRequest(`/api/admin/bookings/${id}/update-sale-status`, data);
  }

  /**
   * Método auxiliar para hacer peticiones POST
   * @param {string} url - URL del endpoint
   * @param {object} data - Datos a enviar
   * @returns {Promise}
   */
  async postRequest(url, data = {}) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(errorResult?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en petición POST:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de estados del sale asociado
   * @param {string} id - ID de la reserva
   * @returns {Promise}
   */
  async getSaleStatusHistory(id) {
    try {
      const response = await fetch(`/api/admin/bookings/${id}/sale-status-history`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener historial de estados:', error);
      return [];
    }
  }
}

export default BookingsRest;
