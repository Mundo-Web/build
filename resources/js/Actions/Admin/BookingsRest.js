import BasicRest from "../BasicRest";

class BookingsRest extends BasicRest {
  path = 'admin/bookings'

  /**
   * Confirmar una reserva
   * @param {string} id - ID de la reserva
   * @returns {Promise}
   */
  async confirm(id) {
    return await this.post(`/api/admin/bookings/${id}/confirm`);
  }

  /**
   * Completar una reserva (check-out realizado)
   * @param {string} id - ID de la reserva
   * @returns {Promise}
   */
  async complete(id) {
    return await this.post(`/api/admin/bookings/${id}/complete`);
  }

  /**
   * Cancelar una reserva
   * @param {string} id - ID de la reserva
   * @param {object} data - Datos con la razón de cancelación
   * @returns {Promise}
   */
  async cancel(id, data) {
    return await this.post(`/api/admin/bookings/${id}/cancel`, data);
  }

  /**
   * Marcar como no show
   * @param {string} id - ID de la reserva
   * @returns {Promise}
   */
  async noShow(id) {
    return await this.post(`/api/admin/bookings/${id}/no-show`);
  }
}

export default BookingsRest;
