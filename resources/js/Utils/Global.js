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
        return Global[name];
    };
}

export default Global;
