import React, { useState } from "react";
import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import Global from "../../../Utils/Global";
import General from "../../../Utils/General";

ReactModal.setAppElement('#app');

const FooterHuaillys = ({ socials = [], pages = [], generals = [] }) => {
    const [modalOpen, setModalOpen] = useState(null);
    
    const openModal = (type) => setModalOpen(type);
    const closeModal = () => setModalOpen(null);

    // Obtener contenido de políticas
    const getPolicyContent = (correlative) => {
        return generals.find(item => item.correlative === correlative)?.description || "";
    };

    // Obtener descripción de la empresa
    const getDescription = () => {
        return generals.find(item => item.correlative === 'footer_description')?.description || 
               'Pollería Huaillys - Sabor auténtico, tradición peruana en cada bocado.';
    };


     const copyright = General.get('copyright') ?? ''
  const content = copyright.replace(/\{\{([^}]+)\}\}/g, (match, code) => {
    try {
      return eval(code);
    } catch (error) {
      console.error('Error evaluating code:', error);
      return match;
    }
  });
    return (
        <>
            <footer 
                className="py-4 font-paragraph px-[5%] md:px-[8%] pt-[calc(45px)] bg-[#54340E] bg-cover text-white relative" 
                style={{backgroundImage: 'url(https://polleriahuaillys.com/images/img/texturafooter.png)'}}
            >
                {/* Imágenes decorativas laterales */}
                <img 
                    src="https://polleriahuaillys.com/images/img/leftpollo.png" 
                    alt="Pollo izquierdo" 
                    className="absolute bottom-0 left-0 object-cover object-center w-auto hidden md:flex"
                />
                <img 
                    src="https://polleriahuaillys.com/images/img/rightpollo.png" 
                    alt="Pollo derecho" 
                    className="absolute bottom-0 right-0 object-cover object-center w-auto hidden md:flex"
                />

                {/* Sección principal del footer */}
                <section className="flex flex-row items-center justify-center">
                    <div className="flex flex-col gap-4 items-center justify-center pb-10">
                        <a href="/">  
                            <img 
                                src="/assets/resources/logo-footer.png" 
                                alt="Pollería Huaillys" 
                                className="h-28"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://polleriahuaillys.com/images/img/logofooterpolleria.svg';
                                }}
                            />
                        </a>
                        <p className="text-base max-w-md text-center line-clamp-2 font-latoregular">
                            {getDescription()}
                        </p>
                        <a 
                            href="/nosotros" 
                            className="text-white font-paragraph  bg-primary w-auto px-8 py-3 rounded-lg font-latoregular font-semibold tracking-wide hover:bg-opacity-90 transition-all duration-300"
                        >
                            Nosotros
                        </a>
                    </div>
                </section>

                {/* Línea divisora */}
                <hr className="my-2" />

                {/* Sección inferior con copyright y redes sociales */}
                <div 
                    className="flex flex-col items-start gap-3 md:flex-row md:justify-between md:items-center w-full   bg-cover" 
                    style={{backgroundImage: 'url(https://polleriahuaillys.com/images/img/footerbarra.png)'}}
                >
                    {/* Copyright */}
                    <div className="text-white font-latoregular text-sm text-center md:text-left">
                    <p>{content}   <span className="italic ">  Powered by  <a href="https://www.mundoweb.pe" target="_blank" rel="noopener noreferrer">MundoWeb</a></span></p>
                        <div className="mt-1 text-xs space-x-4" hidden>
                            <button 
                                onClick={() => openModal('terms')}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                Términos y Condiciones
                            </button>
                            <span>|</span>
                            <button 
                                onClick={() => openModal('privacy')}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                Políticas de Privacidad
                            </button>
                        </div>
                    </div>
                   
                    {/* Redes sociales */}
                    <div className="flex justify-start items-center gap-5 mx-auto sm:mx-0">
                        <div className="flex flex-row gap-5">
                            {socials.map((social, index) => (
                                <a 
                                    key={index}
                                    href={social.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex justify-start items-center gap-2 text-white font-roboto font-normal hover:text-primary transition-colors duration-300"
                                    title={`Síguenos en ${social.name}`}
                                >
                                    <i className={`text-2xl text-white ${social.icon} hover:text-primary transition-colors duration-300`}></i>
                                </a>
                            ))}
                            
                            {/* Redes sociales por defecto si no hay configuradas */}
                            {socials.length === 0 && (
                                <>
                                    <a 
                                        href="https://www.facebook.com/PolleriaHuaillysAbancayPuebloJoven" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex justify-start items-center gap-2 text-white font-roboto font-normal hover:text-primary transition-colors duration-300"
                                    >
                                        <i className="text-2xl text-white fa-brands fa-facebook hover:text-primary transition-colors duration-300"></i>
                                    </a>
                                    <a 
                                        href="https://www.instagram.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex justify-start items-center gap-2 text-white font-roboto font-normal text-text14 hover:text-primary transition-colors duration-300"
                                    >
                                        <i className="text-2xl text-white fa-brands fa-instagram hover:text-primary transition-colors duration-300"></i>
                                    </a>
                                    <a 
                                        href="https://www.linkedin.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex justify-start items-center gap-2 text-white font-roboto font-normal text-text14 hover:text-primary transition-colors duration-300"
                                    >
                                        <i className="text-2xl text-white fa-brands fa-linkedin hover:text-primary transition-colors duration-300"></i>
                                    </a>
                                    <a 
                                        href="https://www.tiktok.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex justify-start items-center gap-2 text-white font-roboto font-normal text-text14 hover:text-primary transition-colors duration-300"
                                    >
                                        <i className="text-2xl text-white fa-brands fa-tiktok hover:text-primary transition-colors duration-300"></i>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modal para Términos y Condiciones */}
            <ReactModal
                isOpen={modalOpen === 'terms'}
                onRequestClose={closeModal}
                contentLabel="Términos y condiciones"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] outline-none overflow-hidden"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            >
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h1 className="font-bold text-2xl text-[#54340E]">Términos y condiciones</h1>
                    <button 
                        onClick={closeModal} 
                        className="text-gray-500 hover:text-red-500 text-2xl font-bold transition-colors duration-300"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <HtmlContent 
                        className="prose prose-lg max-w-none" 
                        html={getPolicyContent('terms_conditions') || '<p>Contenido de términos y condiciones no disponible.</p>'} 
                    />
                </div>
            </ReactModal>

            {/* Modal para Políticas de Privacidad */}
            <ReactModal
                isOpen={modalOpen === 'privacy'}
                onRequestClose={closeModal}
                contentLabel="Políticas de privacidad"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] outline-none overflow-hidden"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            >
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h1 className="font-bold text-2xl text-[#54340E]">Políticas de privacidad</h1>
                    <button 
                        onClick={closeModal} 
                        className="text-gray-500 hover:text-red-500 text-2xl font-bold transition-colors duration-300"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <HtmlContent 
                        className="prose prose-lg max-w-none" 
                        html={getPolicyContent('privacy_policy') || '<p>Contenido de políticas de privacidad no disponible.</p>'} 
                    />
                </div>
            </ReactModal>
        </>
    );
};

export default FooterHuaillys;