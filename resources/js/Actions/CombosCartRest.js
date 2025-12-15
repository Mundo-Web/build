import BasicRest from './BasicRest'

export class CombosCartRest extends BasicRest {
  constructor() {
    super('/api/admin/combos')
  }

  /**
   * Get combos formatted as products for cart integration
   */
  async getAsProducts() {
    try {
      const response = await fetch('/api/combos-as-products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.status) {
        return { data: result.data }
      } else {
        console.error('Error getting combos as products:', result.message)
        return { data: [] }
      }
    } catch (error) {
      console.error('Error in getAsProducts:', error)
      return { data: [] }
    }
  }

  /**
   * Get a single combo formatted as product
   */
  async getAsProduct(id) {
    try {
      const response = await fetch(`/api/combos-as-products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.status) {
        return result.data
      } else {
        console.error('Error getting combo as product:', result.message)
        return null
      }
    } catch (error) {
      console.error('Error in getAsProduct:', error)
      return null
    }
  }

  /**
   * Add combo to cart (formatted as product)
   */
  async addToCart(comboId, quantity = 1) {
    const combo = await this.getAsProduct(comboId)
    if (!combo) {
      throw new Error('Combo not found')
    }

    // Return combo formatted for cart
    return {
      ...combo,
      quantity: quantity,
      cart_type: 'combo', // Identificador para el carrito
      combo_items: combo.combo_items // Mantener referencia a los items del combo
    }
  }

  /**
   * Get combos that contain a specific item
   */
  async getItemCombos(itemId) {
    try {
      const response = await fetch(`/api/items/${itemId}/combos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        return { data: [] }
      }
      
      const result = await response.json()
      return { data: result.status ? result.data : [] }
    } catch (error) {
      console.error('Error getting item combos:', error)
      return { data: [] }
    }
  }
}