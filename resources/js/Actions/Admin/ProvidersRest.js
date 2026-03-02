import BasicRest from "../BasicRest";

class ProvidersRest extends BasicRest {
  path = 'admin/providers'
  hasFiles = false

  invite = (data) => {
    return this.post(`${this.path}/invite`, data)
  }

  getTree = async () => {
    try {
      const res = await fetch(`/api/${this.path}/tree`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching provider tree:', error);
      return null;
    }
  }

  getVault = (userId) => {
    return this.get(`${this.path}/${userId}/vault`)
  }

  updateVault = (data) => {
    return this.post(`${this.path}/vault`, data)
  }

  deleteVaultItem = (id) => {
    return this.delete(`${this.path}/vault/${id}`)
  }

}

export default ProvidersRest
