import BasicRest from "../BasicRest";

class SellersRest extends BasicRest {
  path = 'admin/sellers'
  hasFiles = false

  invite = (data) => {
    return this.post(`${this.path}/invite`, data)
  }

  acceptApplication = (data) => {
    return this.post(`${this.path}/accept-application`, data)
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
      console.error('Error fetching seller tree:', error);
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

export default SellersRest
