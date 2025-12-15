class General {

  static set = (name, value) => {
    // Si es whatsapp_advisors, intentar parsear como JSON
    if (name === 'whatsapp_advisors' && typeof value === 'string') {
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