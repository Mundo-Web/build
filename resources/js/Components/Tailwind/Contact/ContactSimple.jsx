import React, { useRef, useState } from "react"
import MessagesRest from "../../../Actions/MessagesRest"
import Swal from "sweetalert2"
// import { useNavigate } from "react-router-dom"

const messagesRest = new MessagesRest()

const ContactSimple = ({ data, contacts }) => {
  // const navigate = useNavigate()
  const getContact = (correlative) => {
    return (
        contacts.find((contact) => contact.correlative === correlative)
            ?.description || ""
    );
  };

  const nameRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()
  const descriptionRef = useRef()

  const [sending, setSending] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    setSending(true)

    const request = {
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      description: descriptionRef.current.value
    }

    const result = await messagesRest.save(request);
    setSending(false)

    if (!result) return

    Swal.fire({
      icon: 'success',
      title: 'Mensaje enviado',
      text: 'Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!',
      showConfirmButton: false,
      timer: 3000
    })

    if (data.redirect) {
      location.href = data.redirect
    }

    nameRef.current.value = null
    phoneRef.current.value = null
    emailRef.current.value = null
    descriptionRef.current.value = null
  }

  return <div className="bg-white">
    <div className="px-[5%] replace-max-w-here w-full mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 2xl:gap-44">
        <div className="flex flex-col gap-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
          <h2 className="font-font-general font-bold text-3xl lg:text-4xl xl:text-[43px] leading-none customtext-primary">Escríbenos si tienes alguna duda o consulta</h2>
          <p className="customtext-primary text-opacity-20 font-font-general font-normal text-base">Renueva tus espacios con estilo: Fundas exclusivas para cada temporada.</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="full_name" className="font-normal text-sm leading-none text-[#311609A3] font-font-general">Nombre Completo</label>
              <input ref={nameRef} required type="text" id="full_name" name="full_name" placeholder="Nombres y Apellidos" className="border-[#3116093D] font-font-general p-3 border rounded-2xl w-full focus:outline-none focus:border-[#3116093D] text-base py-3 focus:ring-transparent focus:ring-0" disabled={sending}/>
            </div>

            <div className="w-full flex flex-col gap-2">
            <label htmlFor="telefono" className="font-normal text-sm leading-none text-[#311609A3] font-font-general">Teléfono</label>
              <input ref={phoneRef} required type="tel" id="telefono" name="phone" placeholder="Teléfono" maxlength="9" className="border-[#3116093D] font-font-general p-3 border rounded-2xl w-full focus:outline-none focus:border-[#3116093D] text-base py-3 focus:ring-transparent focus:ring-0" disabled={sending}/>
            </div>

            <div className="w-full flex flex-col gap-2">
            <label htmlFor="email" className="font-normal text-sm leading-none text-[#311609A3] font-font-general">Correo electrónico</label>
              <input ref={emailRef} required type="email" id="email" name="email" placeholder="E-mail" className="border-[#3116093D] font-font-general p-3 border rounded-2xl w-full focus:outline-none focus:border-[#3116093D] text-base py-3 focus:ring-transparent focus:ring-0" disabled={sending}/>
            </div>

            <div className="w-full flex flex-col gap-2">
            <label htmlFor="message" className="font-normal text-sm leading-none text-[#311609A3] font-font-general">Mensaje</label>
              <textarea ref={descriptionRef} required type="text" id="message" name="message" placeholder="Mensaje" className="border-[#3116093D] font-font-general p-3 border rounded-2xl w-full focus:outline-none focus:border-[#3116093D] text-base py-3 focus:ring-transparent focus:ring-0" disabled={sending}></textarea>
            </div>

            <div className="flex justify-center items-center pt-3">
              <button type="submit" className="font-font-general text-text16 md:text-text18 text-white py-4 px-10 bg-primary w-full text-center rounded-3xl hover:opacity-75 md:duration-300 disabled:opacity-75" disabled={sending}>
                Enviar Solicitud
              </button>
            </div>

          </form>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
            <h2 className="font-font-general font-bold text-3xl  leading-none customtext-primary">Datos de contacto</h2>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
                <svg className="stroke-neutral-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path className="stroke-neutral-light" d="M12.0004 14.4004L11.3442 15.155C11.7205 15.4822 12.2803 15.4822 12.6566 15.155L12.0004 14.4004ZM6.87357 15.2547C7.40485 15.1038 7.71323 14.5508 7.56235 14.0196C7.41148 13.4883 6.85849 13.1799 6.32721 13.3308L6.87357 15.2547ZM17.6736 13.3308C17.1423 13.1799 16.5893 13.4883 16.4384 14.0196C16.2876 14.5508 16.5959 15.1038 17.1272 15.2547L17.6736 13.3308ZM15.8004 7.09604C15.8004 7.64061 15.5851 8.31679 15.1709 9.08205C14.764 9.83392 14.2089 10.5924 13.6333 11.2806C13.0605 11.9654 12.4849 12.5601 12.0511 12.9845C11.8348 13.196 11.6553 13.3638 11.5311 13.4776C11.469 13.5345 11.4209 13.5778 11.3889 13.6062C11.373 13.6205 11.361 13.631 11.3535 13.6376C11.3497 13.641 11.347 13.6433 11.3455 13.6447C11.3447 13.6454 11.3442 13.6458 11.344 13.646C11.3439 13.6461 11.3438 13.6461 11.3439 13.6461C11.3439 13.6461 11.344 13.646 11.344 13.646C11.3441 13.6459 11.3442 13.6458 12.0004 14.4004C12.6566 15.155 12.6567 15.1549 12.6569 15.1547C12.657 15.1546 12.6572 15.1545 12.6573 15.1543C12.6577 15.154 12.6581 15.1537 12.6585 15.1533C12.6595 15.1524 12.6607 15.1514 12.6623 15.15C12.6653 15.1474 12.6695 15.1437 12.6748 15.139C12.6854 15.1297 12.7005 15.1164 12.7197 15.0993C12.758 15.0651 12.813 15.0156 12.8822 14.9523C13.0204 14.8256 13.216 14.6428 13.4497 14.4141C13.9159 13.958 14.5403 13.3136 15.1675 12.5637C15.7919 11.8171 16.4368 10.9451 16.9299 10.0339C17.4157 9.13616 17.8004 8.11669 17.8004 7.09604H15.8004ZM12.0004 14.4004C12.6566 13.6458 12.6567 13.6459 12.6568 13.646C12.6568 13.646 12.6569 13.6461 12.6569 13.6461C12.6569 13.6461 12.6569 13.6461 12.6568 13.646C12.6566 13.6458 12.6561 13.6454 12.6553 13.6447C12.6537 13.6433 12.6511 13.641 12.6473 13.6376C12.6397 13.631 12.6278 13.6205 12.6119 13.6062C12.5799 13.5778 12.5317 13.5345 12.4697 13.4776C12.3454 13.3638 12.166 13.196 11.9497 12.9845C11.5159 12.5601 10.9403 11.9654 10.3675 11.2806C9.7919 10.5924 9.23676 9.83392 8.82986 9.08205C8.41573 8.31679 8.20039 7.64061 8.20039 7.09604H6.20039C6.20039 8.11669 6.58506 9.13616 7.07092 10.0339C7.56403 10.9451 8.20888 11.8171 8.83331 12.5637C9.46052 13.3136 10.0849 13.958 10.5511 14.4141C10.7848 14.6428 10.9803 14.8256 11.1186 14.9523C11.1878 15.0156 11.2428 15.0651 11.2811 15.0993C11.3003 15.1164 11.3153 15.1297 11.326 15.139C11.3313 15.1437 11.3355 15.1474 11.3385 15.15C11.34 15.1514 11.3413 15.1524 11.3422 15.1533C11.3427 15.1537 11.3431 15.154 11.3434 15.1543C11.3436 15.1545 11.3438 15.1546 11.3439 15.1547C11.3441 15.1549 11.3442 15.155 12.0004 14.4004ZM8.20039 7.09604C8.20039 5.0756 9.88088 3.40039 12.0004 3.40039V1.40039C8.81797 1.40039 6.20039 3.92981 6.20039 7.09604H8.20039ZM12.0004 3.40039C14.1199 3.40039 15.8004 5.0756 15.8004 7.09604H17.8004C17.8004 3.92981 15.1828 1.40039 12.0004 1.40039V3.40039ZM20.6004 17.6004C20.6004 17.8043 20.5054 18.0891 20.1442 18.445C19.7794 18.8043 19.2003 19.1739 18.404 19.5057C16.8158 20.1675 14.5523 20.6004 12.0004 20.6004V22.6004C14.7504 22.6004 17.2869 22.1378 19.1732 21.3519C20.1142 20.9598 20.9409 20.4675 21.5478 19.8698C22.1581 19.2685 22.6004 18.501 22.6004 17.6004H20.6004ZM12.0004 20.6004C9.44845 20.6004 7.18502 20.1675 5.59678 19.5057C4.80048 19.1739 4.22135 18.8043 3.85659 18.445C3.49535 18.0891 3.40039 17.8043 3.40039 17.6004H1.40039C1.40039 18.501 1.84269 19.2685 2.45302 19.8698C3.05983 20.4675 3.88659 20.9598 4.82755 21.3519C6.71383 22.1378 9.25039 22.6004 12.0004 22.6004V20.6004ZM3.40039 17.6004C3.40039 17.3494 3.55143 16.9622 4.16014 16.493C4.75881 16.0316 5.67899 15.5939 6.87357 15.2547L6.32721 13.3308C4.98646 13.7115 3.80664 14.2403 2.93915 14.909C2.08169 15.5699 1.40039 16.4765 1.40039 17.6004H3.40039ZM17.1272 15.2547C18.3218 15.5939 19.242 16.0316 19.8406 16.493C20.4493 16.9622 20.6004 17.3494 20.6004 17.6004H22.6004C22.6004 16.4765 21.9191 15.5699 21.0616 14.909C20.1941 14.2403 19.0143 13.7115 17.6736 13.3308L17.1272 15.2547Z" fill="#91502D"/>
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none customtext-primary font-font-general">Dirección
                </p>
                <p className="customtext-primary text-opacity-20 font-font-general font-normal text-base">
                  {getContact("address")}
                </p>
              </div>
            </div>

            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
              <svg className="stroke-neutral-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path className="stroke-neutral-light" d="M12.8715 6.32632C14.0713 6.52742 15.1613 7.09414 16.0315 7.9625C16.9016 8.83087 17.4649 9.91861 17.671 11.116M13.0547 2.40039C15.1888 2.76145 17.1352 3.77149 18.6831 5.3117C20.2311 6.85647 21.2386 8.79887 21.6004 10.9286M19.9333 19.4021C19.9333 19.4021 18.7747 20.5401 18.4907 20.8737C18.0282 21.3673 17.4832 21.6004 16.7688 21.6004C16.7001 21.6004 16.6268 21.6004 16.5581 21.5958C15.1979 21.509 13.9339 20.9788 12.9859 20.5264C10.3938 19.2741 8.11773 17.4962 6.22631 15.243C4.66463 13.3646 3.62046 11.6279 2.92893 9.76321C2.50302 8.62519 2.34731 7.73854 2.416 6.90217C2.4618 6.36744 2.66789 5.92412 3.048 5.54478L4.60968 3.9863C4.83408 3.77606 5.07223 3.6618 5.30579 3.6618C5.59431 3.6618 5.82788 3.83547 5.97443 3.98173C5.97901 3.9863 5.98359 3.99087 5.98817 3.99544C6.26753 4.25595 6.53315 4.5256 6.81251 4.81353C6.95448 4.95978 7.10103 5.10603 7.24758 5.25685L8.49784 6.50455C8.98329 6.98901 8.98329 7.4369 8.49784 7.92136C8.36503 8.0539 8.2368 8.18644 8.10399 8.31441C7.71929 8.70746 8.02149 8.40587 7.62306 8.76236C7.6139 8.7715 7.60474 8.77607 7.60016 8.78521C7.2063 9.17826 7.27958 9.56217 7.36201 9.82268C7.36659 9.83639 7.37117 9.8501 7.37575 9.86381C7.70091 10.6499 8.15888 11.3903 8.855 12.2724L8.85958 12.277C10.1236 13.8309 11.4563 15.042 12.9263 15.9698C13.1141 16.0886 13.3065 16.1846 13.4896 16.276C13.6545 16.3583 13.8102 16.436 13.943 16.5182C13.9614 16.5274 13.9797 16.5411 13.998 16.5502C14.1537 16.6279 14.3003 16.6645 14.4514 16.6645C14.8315 16.6645 15.0696 16.4268 15.1475 16.3491L16.0452 15.4533C16.2009 15.2979 16.4482 15.1105 16.7367 15.1105C17.0207 15.1105 17.2542 15.2887 17.3962 15.4441C17.4008 15.4487 17.4008 15.4487 17.4054 15.4533L19.9288 17.9715C20.4005 18.4377 19.9333 19.4021 19.9333 19.4021Z" stroke="#91502D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none customtext-primary font-font-general">Número
                  de Teléfono</p>
                <p className="customtext-primary text-opacity-20 font-font-general font-normal text-base">
                  {getContact("phone_contact")}
                </p>
              </div>
            </div>

            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
              <svg className="stroke-neutral-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path className="stroke-neutral-light" d="M4.125 6.125L12 11.1875L20.4375 6.125M5.25 18.3044C4.00736 18.3044 3 17.297 3 16.0544V7.25C3 6.00736 4.00736 5 5.25 5H18.75C19.9926 5 21 6.00736 21 7.25V16.0543C21 17.297 19.9926 18.3044 18.75 18.3044H5.25Z" stroke="#91502D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none customtext-primary font-font-general">Correo
                  Electrónico</p>
                <p className="customtext-primary text-opacity-20 font-font-general font-normal text-base">
                  {getContact("email_contact")}</p>
              </div>
            </div>

            <div className="flex justify-start items-start gap-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
              <div className="w-6">
              <svg className="stroke-neutral-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path className="stroke-neutral-light" d="M14.625 14.25L11.25 13.125V8.42087M20.25 12C20.25 7.02944 16.2206 3 11.25 3C6.27944 3 2.25 7.02944 2.25 12C2.25 16.9706 6.27944 21 11.25 21C14.5813 21 17.4898 19.1901 19.046 16.5M17.7811 11.0123L20.0311 13.2623L22.2811 11.0123" stroke="#91502D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins font-semibold text-lg  leading-none customtext-primary font-font-general">Horario
                  de Atención</p>
                <p className="customtext-primary text-opacity-20 font-font-general font-normal text-base">
                  {getContact("opening_hours")}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
}

export default ContactSimple