import React, { useRef, useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import General from "../../../Utils/General";


ReactModal.setAppElement('#app')

const subscriptionsRest = new SubscriptionsRest();

const FooterSimpleCallToAction = ({ socials = [], generals = [], pages = [], data }) => {

  const emailRef = useRef()

  const [modalOpen, setModalOpen] = useState(null);
  const [saving, setSaving] = useState()

  const onEmailSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const request = {
      email: emailRef.current.value
    }
    const result = await subscriptionsRest.save(request);
    setSaving(false)

    if (!result) return

    Swal.fire({
      title: '¡Éxito!',
      text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
      icon: 'success',
      confirmButtonText: 'Ok'
    })

    emailRef.current.value = null
  }

  const policyItems = {
    'terms_conditions': 'Términos y condiciones',
    'privacy_policy': 'Políticas de privacidad',
    'delivery_policy': 'Políticas de envío',
    'saleback_policy': 'Políticas de devolucion y cambio'
  }

  return (
    <>
      <footer id={data?.element_id || null} className="font-poppins bg-primary text-white">
        <div className="px-[5%] replace-max-w-here mx-auto py-[5%] md:py-[2.5%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:justify-center">
            <div className="lg:col-span-3 w-full flex flex-col gap-10">
              <div>
                <a href="/">
                  <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="w-full aspect-[13/4] object-contain object-center" onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/img/logo-bk.svg';
                  }} />
                </a>
              </div>
              <nav>
                <ul className="flex flex-col gap-3 text-base font-normal">
                  <li className="flex flex-row items-start gap-2">
                    <i className="mdi mdi-map-marker"></i>
                    <span>{General.get('address')}</span>
                  </li>
                  <li className="flex flex-row gap-2">
                    <i className="mdi mdi-email"></i>
                    <span className="text-wrap break-all">{General.get('support_email')}</span>
                  </li>
                  <li className="flex flex-row gap-2">
                    <i className="mdi mdi-whatsapp"></i>
                 
                  </li>
                </ul>
              </nav>


            </div>

            <div className="lg:col-span-3 w-full flex flex-col gap-5">
              <h3 className="font-bold text-lg">Términos Legales</h3>

              <nav>
                <ul className="flex flex-col gap-3 text-base font-normal">
                  {
                    Object.keys(policyItems).map((key, index) => {
                      const title = policyItems[key];
                      const foundIndex = generals.findIndex(x => x.correlative == key);
                      if (foundIndex == -1) return
                      return <li
                        key={index}
                        className="flex flex-row gap-2">
                        <button className="text-start" onClick={() => setModalOpen(key)}>{title}</button>
                      </li>
                    })
                  }
                </ul>
              </nav>

              <a href="https://juguetesludicos.mundoweb.pe/libro-de-reclamaciones"><img className="w-28" src="https://juguetesludicos.mundoweb.pe/images/img/reclamaciones.png" /></a>
            </div>

            <div className="lg:col-span-2 w-full flex flex-col gap-5">
              <h3 className="font-bold text-lg">Menú</h3>

              <nav>
                <ul className="flex flex-col gap-3 text-base font-normal">
                  {
                    pages.filter(x => x.menuable).map((page, index) => {
                      return <li className="flex flex-row gap-2">
                        <button className="border-b-[3px] border-transparent hover:border-b-white transition-all" href={page.pseudo_path || page.path}>{page.name}</button>
                      </li>
                    })
                  }
                </ul>
              </nav>
            </div>

            <div className="lg:col-span-4 w-full flex flex-col gap-5">


              <h3 className="text-2xl font-bold">Suscríbete a nuestro blog</h3>
              <p className="font-normal text-base">Mantente actualizado sobre las últimas noticias y ofertas.</p>

              <div className="flex flex-col gap-2">
                <form onSubmit={onEmailSubmit} className="flex flex-col md:flex-row md:justify-start md:items-center gap-3">
                  <div className="w-full">
                    <input required="" name="email" type="email" ref={emailRef} className="ring-0 focus:ring-0 border-transparent focus:border-transparent bg-white px-5 py-3 rounded-xl w-full text-textPrimary outline-none" placeholder="info@mail.com" disabled={saving} />
                  </div>

                  <div className="flex justify-center items-center w-full md:w-auto">
                    <button type="submit" className="font-helveticaBold text-base text-white border border-white py-3 px-3 rounded-xl w-full md:w-auto text-center" disabled={saving}>Suscribirme
                    </button>
                  </div>
                </form>
                <p className="font-helveticaLight text-text12 text-white">
                  Al suscribirse, acepta nuestra Política de privacidad y brinda su
                  consentimiento para recibir actualizaciones de nuestra empresa.
                </p>
              </div>


            </div>
          </div>

          <div className="mt-5 flex flex-col md:flex-row justify-center md:justify-between items-center gap-5 mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <p className="font-normal">
                Copyright © <a target="_blank" href="http://mundoweb.pe/" className="font-bold">2024 Mundo Web</a>. Reservados todos los derechos
              </p>

            </div>

            <div className="flex flex-wrap gap-2 pb-5">
              {
                socials.map((social, index) => {
                  return <Tippy key={index} content={`Ver ${social.name} en ${social.description}`}>
                    <button
                      href={social.link}
                      className={`text-xl bg-transparent bg-white text-primary ${social.icon} w-10 h-10 pt-0.5 text-center rounded-full`}
                    />
                  </Tippy>
                })
              }
            </div>
          </div>
        </div>
      </footer>

      {Object.keys(policyItems).map((key, index) => {
        const title = policyItems[key]
        const content = generals.find(x => x.correlative == key)?.description ?? '';
        return <ReactModal
          key={index}
          isOpen={modalOpen === key}
          onRequestClose={() => setModalOpen(null)}
          contentLabel={title}
          className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow-lg w-[95%] max-w-4xl my-8"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        >
          <button onClick={() => setModalOpen(null)} className="float-right text-gray-500 hover:text-gray-900">
            Cerrar
          </button>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <HtmlContent className='prose' html={content} />
        </ReactModal>
      })}
    </>
  );
};

export default FooterSimpleCallToAction;
