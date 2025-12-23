import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronDown, ArrowRight, Phone } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";







import Swal from "sweetalert2";

import MessagesRest from "../../../Actions/MessagesRest";
import GeneralsRest from "../../../Actions/Admin/GeneralsRest";
import Global from "../../../Utils/Global";

// Animaciones mejoradas
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
            duration: 0.6,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15,
            duration: 0.7,
        },
    },
};

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const slideUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const buttonHover = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

const inputFocus = {
    rest: { 
        borderColor: "#cbd5e1",
        boxShadow: "none",
        scale: 1,
    },
    focus: {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
        scale: 1.01,
        transition: { duration: 0.2 },
    },
};

const cardHover = {
    rest: { 
        y: 0, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        scale: 1,
    },
    hover: {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

const ContactKatya= ({  data,generals=[] }) => {
 
 
 
const messagesRest = new MessagesRest();

// Opción 1: Deshabilitar notificaciones automáticas para usar notificaciones personalizadas
messagesRest.enableNotifications = false;

// Opción 2: Usando method chaining (alternativa más elegante)
// const messagesRest = new MessagesRest().withoutNotifications();

// Opción 3: Usando el método setNotifications
// const messagesRest = new MessagesRest().setNotifications(false);


const nameRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()
  const descriptionRef = useRef()
    const lastnameRef = useRef()

  const [sending, setSending] = useState(false)

  // Función para limpiar el formulario
  const clearForm = () => {
    const fields = [nameRef, lastnameRef, phoneRef, emailRef, descriptionRef];
    
    fields.forEach((ref, index) => {
      if (ref.current) {
        // Pequeño delay para crear efecto de limpieza secuencial
        setTimeout(() => {
          ref.current.value = "";
          // Opcional: agregar una pequeña animación visual
          ref.current.style.transform = 'scale(0.98)';
          setTimeout(() => {
            ref.current.style.transform = 'scale(1)';
          }, 100);
        }, index * 50);
      }
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    setSending(true)

    const request = {
      name: nameRef.current.value + ' ' + lastnameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      message: descriptionRef.current.value,
     
    }

    console.log('ContactKatya - Enviando datos:', request);

    try {
      const result = await messagesRest.save(request);
      setSending(false)

      if (!result) {
        // Mostrar error personalizado ya que las notificaciones automáticas están deshabilitadas
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Entendido'
        })
        return
      }

      // Mostrar éxito personalizado
      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!',
        showConfirmButton: false,
        timer: 3000
      })

      // Enviar lead a Atalaya CRM si existe API Key configurado
      const atalayaApiKey = generalsData.find(item => item.correlative === "atalaya_leads_api_key")?.description;
      if (atalayaApiKey && atalayaApiKey.trim() !== '') {
        try {
          console.log('ContactKatya - Enviando lead a Atalaya CRM...');
          const atalayaResponse = await fetch('https://crm.atalaya.pe/free/leads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${atalayaApiKey}`
            },
            body: JSON.stringify({
              contact_name: nameRef.current.value + ' ' + lastnameRef.current.value,
              contact_phone: phoneRef.current.value,
              contact_email: emailRef.current.value,
              message: descriptionRef.current.value,
              origin: `Página Web ${Global.APP_NAME}`,
              triggered_by: 'Formulario de Contacto'
            })
          });

          const atalayaResult = await atalayaResponse.json();
          if (atalayaResult.status === 200) {
            console.log('ContactKatya - Lead enviado correctamente a Atalaya:', atalayaResult.message);
          } else {
            console.warn('ContactKatya - Error al enviar lead a Atalaya:', atalayaResult);
          }
        } catch (atalayaError) {
          // No mostrar error al usuario, solo log interno
          console.error('ContactKatya - Error al enviar a Atalaya CRM:', atalayaError);
        }
      }

      // Verificar si hay redirección en data (como ContactGrid)
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

      // Limpiar los campos del formulario
      clearForm()
    } catch (error) {
      console.error('ContactKatya - Error al enviar:', error);
      setSending(false);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Entendido'
      });
    }
  }





  
   
 
const generalsData = generals || [];

  //location = -12.08572604235328,-76.99121088594794

  const location = generalsData.find(item => item.correlative === "location")?.value || "-12.08572604235328,-76.99121088594794";
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&q=${location}`;
  const mapSrcWithZoom = `${mapSrc}&zoom=12`;
  const mapSrcWithOutput = `${mapSrc}&output=embed`;
  const mapSrcWithEmbed = `${mapSrc}&embed=true`;
  const mapSrcWithLocation = `https://www.google.com/maps?q=${location}&z=12&output=embed`;
  const mapSrcWithLocationAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed`;
  const mapSrcWithLocationAndEmbed = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndOutput = `https://www.google.com/maps?q=${location}&z=12&output=embed`;
  const mapSrcWithLocationAndEmbedAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutput = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKey = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKeyAndOutput = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&output=embed`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKeyAndOutputAndEmbed = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKeyAndOutputAndEmbedAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&output=embed&embed=true&zoom=12`;
 
    return (
        <motion.div 
            className="font-paragraph customcustomtext-neutral-dark-dark min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
         
            <motion.main 
                className="flex flex-col items-center justify-center min-h-[80vh] py-16"
                variants={itemVariants}
            >
                <motion.div 
                    className="w-full px-[5%] 2xl:max-w-7xl 2xl:px-0 mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 bg-transparent"
                    variants={containerVariants}
                >
                    {/* Left: Contact Form */}
                    <motion.div 
                        className="bg-[#F3F3F3] rounded-2xl p-8 flex flex-col justify-between shadow-md min-h-[500px]"
                        variants={slideInLeft}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    >
                        <div>
                           
                       

                        {/* Título principal */}
                        <motion.h2 
                            className="text-4xl lg:text-5xl font-medium mb-6 leading-tight "
                            variants={itemVariants}
                        >

                            {data?.title || "Necesita ayuda, contáctenos ahora"}
                       
                        </motion.h2>
                          
                        <motion.p 
                            className="mt-4 text-base customtext-neutral-dark max-w-3xl mx-auto"
                            variants={itemVariants}
                        >
                          {data?.description || "Conectamos el talento con la oportunidad, fomentando el crecimiento, el éxito y un futuro más brillante para las personas y las empresas."}
                        </motion.p>
                        </div>


                        
                        {/* Contact Form */}
                        <motion.form 
                            onSubmit={onSubmit} 
                            className="w-full flex flex-col gap-4 mt-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div 
                                className="flex flex-col lg:flex-row gap-3"
                                variants={itemVariants}
                            >
                                <motion.input 
                                    ref={nameRef} 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="flex-1  rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                                <motion.input 
                                    ref={lastnameRef} 
                                    type="text" 
                                    placeholder="Apellido" 
                                    className="flex-1  rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                            </motion.div>
                            <motion.div 
                                className="flex flex-col lg:flex-row gap-3"
                                variants={itemVariants}
                            >
                                <motion.input 
                                    ref={phoneRef} 
                                    type="text" 
                                    placeholder="Teléfono" 
                                    className="flex-1  rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                                <motion.input 
                                    ref={emailRef} 
                                    type="email" 
                                    placeholder="Correo electrónico" 
                                    className="flex-1  rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                            </motion.div>
                            <motion.textarea 
                                ref={descriptionRef} 
                                placeholder="Escribir mensaje" 
                                rows={4} 
                                className=" rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-200"
                                variants={itemVariants}
                                whileFocus={{ scale: 1.01 }}
                                whileHover={{ scale: 1.01 }}
                                style={{ transition: 'transform 0.2s ease-in-out' }}
                            />
                            <motion.button 
                                type="submit" 
                                className="mt-2 bg-secondary w-full text-white font-semibold rounded-full px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300"
                                variants={buttonHover}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                disabled={sending}
                            >
                                <AnimatePresence mode="wait">
                                    {sending ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <motion.div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Enviando...
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="send"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 uppercase"
                                        >
                                            Enviar mensaje
                                          
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </motion.form>
                    </motion.div>
                    {/* Right: Map and Info Cards */}
                    <motion.div 
                        className="flex flex-col gap-6"
                        variants={slideInRight}
                    >
                        {/* Map */}
                        <motion.div 
                            className="rounded-2xl overflow-hidden shadow-md w-full h-72 md:h-full min-h-[300px]"
                            variants={fadeInScale}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <iframe
                                title="Ubicación Lima"
                                src={mapSrcWithLocationAndEmbedAndOutput}
                                width="100%"
                                height="100%"
                                className="w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </motion.div>
                        
                        {/* Info Cards */}
                        <motion.div 
                            className="flex flex-col gap-3"
                            variants={containerVariants}
                        >
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                variants={itemVariants}
                            >
                                {/* Email */}
                                <motion.div 
                                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow border border-[#f3f4f6]"
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                >
                                    <motion.span 
                                        className="bg-secondary text-white rounded-full p-2"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75" />
                                        </svg>
                                    </motion.span>
                                    <div>
                                        <motion.div 
                                            className="font-semibold customtext-neutral-dark"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Correo electrónico
                                        </motion.div>
                                        <motion.div 
                                            className="customtext-neutral-dark text-sm"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                           {(() => {
                                               const emailData = generalsData.find(item => item.correlative === "email_contact")?.description || "";
                                               if (emailData.includes(',')) {
                                                   return emailData.split(',').map((email, index) => (
                                                       <div key={index} className="block">
                                                           {email.trim()}
                                                       </div>
                                                   ));
                                               }
                                               return emailData;
                                           })()}
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                {/* Phone */}
                                <motion.div 
                                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow border border-[#f3f4f6]"
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                >
                                    <motion.span 
                                        className="bg-secondary text-white rounded-full p-2"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                      <Phone/>
                                    </motion.span>
                                    <div>
                                        <motion.div 
                                            className="font-semibold customtext-neutral-dark"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Contacto
                                        </motion.div>
                                        <motion.div 
                                            className="customtext-neutral-dark text-sm"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {(() => {
                                                const phoneData = generalsData.find(item => item.correlative === "phone_contact")?.description || "";
                                                if (phoneData.includes(',')) {
                                                    return phoneData.split(',').map((phone, index) => (
                                                        <div key={index} className="block">
                                                            {phone.trim()}
                                                        </div>
                                                    ));
                                                }
                                                return phoneData;
                                            })()}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                            
                            {/* Location */}
                            <motion.div 
                                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow border border-[#f3f4f6]"
                                variants={cardHover}
                                initial="rest"
                                whileHover="hover"
                            >
                                <motion.span 
                                    className="bg-secondary text-white rounded-full p-2"
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                </motion.span>
                                <div>
                                    <motion.div 
                                        className="font-semibold customtext-neutral-dark"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Ubicación
                                    </motion.div>
                                    <motion.div 
                                        className="customtext-neutral-dark text-sm"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {generalsData.find(item => item.correlative === "address")?.description || "Lima, Perú"}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.main>

        </motion.div>
    );
};

export default ContactKatya;