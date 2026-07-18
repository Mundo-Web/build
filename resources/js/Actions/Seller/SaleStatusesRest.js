import { Fetch, Notify } from "sode-extend-react";
import BasicRest from "../BasicRest";

class SaleStatusesRest extends BasicRest {
  path = 'seller/sale-statuses'

  bySale = async (saleId) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/by-sale/${saleId}`)
      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')
      return result.data
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }
}

export default SaleStatusesRest;
