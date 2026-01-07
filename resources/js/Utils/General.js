class General {

  static set = (name, value) => {
    // Si es whatsapp_advisors o additional_shipping_costs, intentar parsear como JSON
    if ((name === 'whatsapp_advisors' || name === 'additional_shipping_costs') && typeof value === 'string') {
      try {
        General[name] = JSON.parse(value);
      } catch (error) {
        General[name] = [];
      }
    } else {
      General[name] = value;
    }
  }

  static get = (name) => {
    return General[name] ?? null
  }
}

export default General