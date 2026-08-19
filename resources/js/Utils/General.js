class General {

  static set = (name, value) => {
    // Si es whatsapp_advisors, additional_shipping_costs o payment_methods, intentar parsear como JSON
    if ((name === 'whatsapp_advisors' || name === 'additional_shipping_costs' || name === 'payment_methods') && typeof value === 'string') {
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