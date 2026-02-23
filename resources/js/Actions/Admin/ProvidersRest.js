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

}

export default ProvidersRest
