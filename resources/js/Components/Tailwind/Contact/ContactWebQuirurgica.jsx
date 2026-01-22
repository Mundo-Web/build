import React, { useRef, useState } from 'react';
import MessagesRest from '../../../Actions/MessagesRest';
import Swal from 'sweetalert2';

const ContactWebQuirurgica = ({ data, generals = [], items = [] }) => {
  const messagesRest = new MessagesRest();
  messagesRest.enableNotifications = false;

  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const descriptionRef = useRef();

  const [sending, setSending] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const clearForm = () => {
    if (nameRef.current) nameRef.current.value = '';
    if (phoneRef.current) phoneRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (descriptionRef.current) descriptionRef.current.value = '';
    setSelectedService(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    const request = {
      name: nameRef.current?.value,
      phone: phoneRef.current?.value,
      email: emailRef.current?.value,
      subject: selectedService?.name || 'Consulta general',
      description: descriptionRef.current?.value,
    };

    try {
      const result = await messagesRest.save(request);
      setSending(false);

      if (!result) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!',
        showConfirmButton: false,
        timer: 3000
      });

      // Verificar si hay redirección en data
      if (data?.redirect) {
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 3000);
      }
      // También verificar si viene en result
      else if (result.redirect) {
        setTimeout(() => {
          window.location.href = result.redirect;
        }, 3000);
      }

      clearForm();
    } catch (error) {
      console.error('ContactWebQuirurgica - Error al enviar:', error);
      setSending(false);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const generalsData = generals || [];
  const phone = generalsData.find(item => item.correlative === 'phone_contact')?.description || '+52 (55) 1234-5678';
  const email = generalsData.find(item => item.correlative === 'email_contact')?.description || 'contacto@ejemplo.com';
  const address = generalsData.find(item => item.correlative === 'address')?.description || 'Av. Ejemplo 123\nCol. Centro, CDMX';
  const openingHours = generalsData.find(item => item.correlative === 'opening_hours')?.description || 'Lunes - Viernes: 9:00 - 19:00\nSábados: 9:00 - 14:00';

  return (
    <section id={data?.element_id || 'contacto'} className="py-24 px-primary 2xl:px-0 bg-sections-color">
      <div className="2xl:max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-primary leading-tight">
            Agenda tu <span className="font-light">Evaluación</span>
          </h2>
          <div className=" mx-auto"></div>
          <p className="text-lg text-neutral-light font-light leading-relaxed">
            Da el primer paso hacia tu transformación
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-light text-primary mb-6">Información de Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-light font-light mb-1">Teléfono</div>
                    <div className="space-y-1">
                      {phone.split(',').map((tel, index) => (
                        <div key={index} className="text-lg text-primary font-light">
                          {tel.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-light font-light mb-1">Email</div>
                    <div className="space-y-1">
                      {email.split(',').map((mail, index) => (
                        <div key={index} className="text-lg text-primary font-light">
                          {mail.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-light font-light mb-1">Ubicación</div>
                    <div className="text-lg text-primary font-light whitespace-pre-line">
                      {address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-white  p-6 shadow-sm ${data?.class_opening_hours_container || ''}`}>
              <h4 className="text-lg font-light text-primary mb-4">Horarios de Atención</h4>
              <div className="text-neutral-light font-light whitespace-pre-line">
                {openingHours}
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className={`bg-white  shadow-lg p-8 border border-gray-100 ${data?.class_form_container || ''}`}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-light text-neutral-dark mb-2">
                  Nombre Completo
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-light"
                  placeholder="Tu nombre"
                  required
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-light text-neutral-dark mb-2">
                  Teléfono
                </label>
                <input
                  ref={phoneRef}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-light"
                  placeholder="Tu teléfono"
                  required
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-light text-neutral-dark mb-2">
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-light"
                  placeholder="tu@email.com"
                  required
                  disabled={sending}
                />
              </div>

              {items && items.length > 0 && (
                <div className="relative">
                  <label className="block text-sm font-light text-neutral-dark mb-2">
                    Procedimiento de Interés
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={sending}
                    className="w-full px-4 py-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-light text-left flex items-center justify-between bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={selectedService ? 'text-neutral-dark' : 'text-neutral-light'}>
                      {selectedService ? selectedService.name : 'Selecciona un procedimiento'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-neutral-light transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200  shadow-lg max-h-60 overflow-y-auto">
                      {items.map((service, index) => (
                        <button
                          key={service.id || index}
                          type="button"
                          onClick={() => {
                            setSelectedService(service);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-sections-color transition-colors font-light ${selectedService?.id === service.id ? 'bg-accent/10 text-primary' : 'text-neutral-dark'
                            }`}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-light text-neutral-dark mb-2">
                  Mensaje
                </label>
                <textarea
                  ref={descriptionRef}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-light resize-none"
                  placeholder="Cuéntanos tu caso..."
                  disabled={sending}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full px-8 py-4 bg-primary hover:bg-secondary text-white  font-light text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {sending ? 'Enviando...' : 'Solicitar Evaluación'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactWebQuirurgica;
