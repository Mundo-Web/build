import BasicRest from "../BasicRest";

class ProvidersRest extends BasicRest {
  path = 'admin/providers'
  hasFiles = false

  invite = (data) => {
    return this.post(`${this.path}/invite`, data)
  }

}

export default ProvidersRest
