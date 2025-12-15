/**
 * Utilidad para manejar la programación de cintillos
 * Verifica si un cintillo debe mostrarse según la configuración de días y horarios
 */

export class CintilloScheduler {
  /**
   * Verifica si un cintillo debe mostrarse en el momento actual
   * @param {Object|String} cintillo - El objeto cintillo o string legacy
   * @returns {Boolean} - True si debe mostrarse, false si no
   */
  static shouldShow(cintillo) {
    // Compatibilidad con formato legacy (string)
    if (typeof cintillo === 'string') {
      return cintillo.trim() !== '';
    }

    // Verificar si el cintillo está habilitado
    if (!cintillo || cintillo.enabled === false) {
      return false;
    }

    // Verificar si tiene texto
    if (!cintillo.text || cintillo.text.trim() === '') {
      return false;
    }

    // Si no tiene programación, mostrar siempre
    if (!cintillo.schedule) {
      return true;
    }

    const now = new Date();
    const currentDay = this.getCurrentDayKey(now);
    const currentTime = this.getCurrentTimeString(now);

    // Obtener la configuración del día actual
    const daySchedule = cintillo.schedule[currentDay];

    // Si el día no está habilitado, no mostrar
    if (!daySchedule || !daySchedule.enabled) {
      return false;
    }

    // Verificar si está dentro del rango horario
    return this.isTimeInRange(currentTime, daySchedule.start, daySchedule.end);
  }

  /**
   * Obtiene la clave del día actual
   * @param {Date} date - Fecha actual
   * @returns {String} - Clave del día (monday, tuesday, etc.)
   */
  static getCurrentDayKey(date = new Date()) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  /**
   * Obtiene la hora actual en formato HH:MM
   * @param {Date} date - Fecha actual
   * @returns {String} - Hora en formato HH:MM
   */
  static getCurrentTimeString(date = new Date()) {
    return date.toTimeString().slice(0, 5);
  }

  /**
   * Verifica si una hora está dentro de un rango
   * @param {String} currentTime - Hora actual en formato HH:MM
   * @param {String} startTime - Hora de inicio en formato HH:MM
   * @param {String} endTime - Hora de fin en formato HH:MM
   * @returns {Boolean} - True si está en el rango
   */
  static isTimeInRange(currentTime, startTime, endTime) {
    if (!startTime || !endTime) {
      return true; // Si no hay restricción horaria, mostrar siempre
    }

    const current = this.timeToMinutes(currentTime);
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    // Manejar el caso donde el rango cruza medianoche (ej: 22:00 - 02:00)
    if (end < start) {
      return current >= start || current <= end;
    }

    return current >= start && current <= end;
  }

  /**
   * Convierte tiempo HH:MM a minutos desde medianoche
   * @param {String} time - Tiempo en formato HH:MM
   * @returns {Number} - Minutos desde medianoche
   */
  static timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Filtra una lista de cintillos para mostrar solo los que deben aparecer
   * @param {Array} cintillos - Array de cintillos
   * @returns {Array} - Array filtrado de cintillos que deben mostrarse
   */
  static filterActiveCintillos(cintillos) {
    if (!Array.isArray(cintillos)) {
      return [];
    }

    return cintillos.filter(cintillo => this.shouldShow(cintillo));
  }

  /**
   * Obtiene el texto de un cintillo (compatibilidad con legacy)
   * @param {Object|String} cintillo - El objeto cintillo o string legacy
   * @returns {String} - El texto del cintillo
   */
  static getText(cintillo) {
    if (typeof cintillo === 'string') {
      return cintillo;
    }
    return cintillo?.text || '';
  }

  /**
   * Obtiene información de depuración sobre por qué un cintillo no se muestra
   * @param {Object|String} cintillo - El objeto cintillo
   * @returns {Object} - Información de depuración
   */
  static getDebugInfo(cintillo) {
    const now = new Date();
    const currentDay = this.getCurrentDayKey(now);
    const currentTime = this.getCurrentTimeString(now);

    if (typeof cintillo === 'string') {
      return {
        type: 'legacy',
        shouldShow: cintillo.trim() !== '',
        text: cintillo,
        currentDay,
        currentTime
      };
    }

    const daySchedule = cintillo.schedule?.[currentDay];

    return {
      type: 'scheduled',
      enabled: cintillo.enabled,
      hasText: !!(cintillo.text && cintillo.text.trim()),
      currentDay,
      currentTime,
      dayEnabled: daySchedule?.enabled || false,
      daySchedule: daySchedule || null,
      timeInRange: daySchedule ? this.isTimeInRange(currentTime, daySchedule.start, daySchedule.end) : true,
      shouldShow: this.shouldShow(cintillo)
    };
  }

  /**
   * Obtiene el próximo horario en que se mostrará un cintillo
   * @param {Object} cintillo - El objeto cintillo
   * @returns {String|null} - Descripción del próximo horario o null
   */
  static getNextSchedule(cintillo) {
    if (typeof cintillo === 'string' || !cintillo.schedule) {
      return null;
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    for (let i = 0; i < 7; i++) {
      const dayKey = days[i];
      const schedule = cintillo.schedule[dayKey];
      
      if (schedule && schedule.enabled) {
        return `${dayNames[i]}: ${schedule.start} - ${schedule.end}`;
      }
    }

    return 'Sin programación activa';
  }
}

export default CintilloScheduler;