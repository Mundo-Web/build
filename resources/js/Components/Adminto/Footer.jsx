import React from "react";
import Global from "../../Utils/Global";

const Footer = () => {
    const fullYear = new Date().getFullYear();
    return (
        <footer className="footer mt-10">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        {fullYear} &copy; {Global.APP_NAME} |{" "}
                        {/* Desarrollado por <a href="#">Manuel Gamboa</a> |{" "} */}
                        Powered by<a href="//mundoweb.pe" target="_blank">Mundo Web</a>
                    </div>
                    <div className="col-md-6">
                        <div className="text-md-end footer-links d-none d-sm-block">
                            <a href="//mundoweb.pe" target="_blank">
                                Sobre nosotros
                            </a>
                            <a href="//mundoweb.pe" target="_blank">
                                Contactanos
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
