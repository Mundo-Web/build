import BasicRest from "../BasicRest";

class ClientsRest extends BasicRest {
  path = 'admin/clients'
  hasFiles = false

  async promote(id) {
    return await this.post(`${this.path}/${id}/promote`)
  }
}

export default ClientsRest
