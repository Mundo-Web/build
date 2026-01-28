class Global {
    static WA_URL = null;
    static PUBLIC_RSA_KEY = null;
    static APP_PROTOCOL = null;
    static APP_URL = null;
    static APP_DOMAIN = null;
    static APP_ENV = "production";
    static APP_NAME = "Stech Perú";
    static APP_CORRELATIVE = null;
    static GMAPS_API_KEY = null;
    static APP_COLOR_PRIMARY = null;
    static CULQI_PUBLIC_KEY = null;
    static CULQI_API = null;
    static CULQI_ENABLED = null;
    static CULQI_NAME = null;
    static CULQI_RSA_ID = null;
    static CULQI_RSA_PUBLIC_KEY = null;
    static OPENPAY_MERCHANT_ID = null;
    static OPENPAY_PUBLIC_KEY = null;
    static OPENPAY_PRIVATE_KEY = null;
    static OPENPAY_ENABLED = null;
    static OPENPAY_SANDBOX_MODE = null;
    static GOOGLE_CLIENT_ID = null;
    static GOOGLE_OAUTH_ENABLED = null;
    static API_KEY_TINYMCE = null;

    static set = (name, value) => {
        Global[name] = value;
    };

    static get = (name) => {
        // Primero intentar obtener de las propiedades estáticas
        if (Global[name] !== null && Global[name] !== undefined) {
            return Global[name];
        }
        // Si no está definido, intentar obtener de window (para variables inyectadas desde Blade)
        if (typeof window !== 'undefined' && window[name] !== undefined) {
            Global[name] = window[name]; // Cachear para futuras consultas
            return window[name];
        }
        return Global[name];
    };

    /**
     * Inicializa las variables globales desde window si están disponibles
     */
    static initFromWindow = () => {
        if (typeof window !== 'undefined') {
            // Configuración de la aplicación
            if (window.APP_URL !== undefined) {
                Global.APP_URL = window.APP_URL;
            }
            if (window.APP_COLOR_PRIMARY !== undefined) {
                Global.APP_COLOR_PRIMARY = window.APP_COLOR_PRIMARY;
            }
            if (window.APP_NAME !== undefined) {
                Global.APP_NAME = window.APP_NAME;
            }
            // Culqi
            if (window.CULQI_PUBLIC_KEY !== undefined) {
                Global.CULQI_PUBLIC_KEY = window.CULQI_PUBLIC_KEY;
            }
            if (window.CULQI_ENABLED !== undefined) {
                Global.CULQI_ENABLED = window.CULQI_ENABLED;
            }
            if (window.CULQI_RSA_ID !== undefined) {
                Global.CULQI_RSA_ID = window.CULQI_RSA_ID;
            }
            if (window.CULQI_RSA_PUBLIC_KEY !== undefined) {
                Global.CULQI_RSA_PUBLIC_KEY = window.CULQI_RSA_PUBLIC_KEY;
            }
            // OpenPay
            if (window.OPENPAY_MERCHANT_ID !== undefined) {
                Global.OPENPAY_MERCHANT_ID = window.OPENPAY_MERCHANT_ID;
            }
            if (window.OPENPAY_PUBLIC_KEY !== undefined) {
                Global.OPENPAY_PUBLIC_KEY = window.OPENPAY_PUBLIC_KEY;
            }
            if (window.OPENPAY_SANDBOX_MODE !== undefined) {
                Global.OPENPAY_SANDBOX_MODE = window.OPENPAY_SANDBOX_MODE;
            }
        }
    };
}

// Auto-inicializar desde window cuando se carga el módulo
Global.initFromWindow();

export default Global;
