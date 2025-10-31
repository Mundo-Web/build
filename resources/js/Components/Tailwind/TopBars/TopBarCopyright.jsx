import { useState, useRef } from "react"
import ReactModal from "react-modal"
import { CircleCheckBig, X, Upload, CheckCircle } from "lucide-react"
import General from "../../../Utils/General"
import Global from "../../../Utils/Global"
import { toast } from "sonner"

const TopBarCopyright = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const nameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()
  const positionRef = useRef()
  const messageRef = useRef()
  const cvRef = useRef()

  const copyright = General.get('copyright') ?? ''
  const content = copyright.replace(/\{\{([^}]+)\}\}/g, (match, code) => {
    try {
      return eval(code);
    } catch (error) {
      console.error('Error evaluating code:', error);
      return match;
    }
  });

  const openModal = () => setModalOpen(true)
  const closeModal = () => {
    setModalOpen(false)
    setSelectedFile(null)
    setSuccess(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Archivo muy grande', {
          description: 'El archivo no debe superar los 5MB',
        })
        e.target.value = null
        return
      }
      setSelectedFile(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      // Validar extensión
      const validExtensions = ['.pdf', '.doc', '.docx']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error('Formato no válido', {
          description: 'Solo se permiten archivos PDF, DOC o DOCX',
        })
        return
      }

      // Validar tamaño
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Archivo muy grande', {
          description: 'El archivo no debe superar los 5MB',
        })
        return
      }

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      cvRef.current.files = dataTransfer.files
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setSelectedFile(null)
    cvRef.current.value = null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (saving) return
    
    setSaving(true)
    
    try {
      const formData = new FormData()
      formData.append('name', nameRef.current.value)
      formData.append('email', emailRef.current.value)
      formData.append('phone', phoneRef.current.value)
      formData.append('position', positionRef.current.value)
      formData.append('message', messageRef.current.value)
      
      if (cvRef.current.files[0]) {
        formData.append('cv', cvRef.current.files[0])
      }

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success('¡Solicitud enviada!', {
          description: 'Gracias por tu interés. Pronto nos pondremos en contacto contigo.',
          icon: <CircleCheckBig className="h-5 w-5 text-green-500" />,
          duration: 4000,
          position: "top-center",
        })
        
        // Limpiar formulario
        e.target.reset()
        setSelectedFile(null)
      } else {
        toast.error('Error al enviar solicitud', {
          description: result.message || 'Por favor, intenta nuevamente.',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al enviar solicitud', {
        description: 'Por favor, intenta nuevamente.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className={` text-sm font-medium py-3  text-center px-primary flex justify-between items-center  flex-wrap ${data?.class_container|| "bg-white customtext-neutral-light"} `}>
        <p>{content}   <span className="italic">  Powered by  <a href="https://www.mundoweb.pe" target="_blank" rel="noopener noreferrer">MundoWeb</a></span></p>
        
      {data?.showJobApplicationButton && (  <button
          onClick={openModal}
          className="text-sm font-paragraph font-medium hover:underline transition-all duration-300 cursor-pointer"
        >
          Trabaja con nosotros
        </button>)}
      </div>

      {/* Modal */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Trabaja con nosotros"
        className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[95%] max-w-5xl top-1/2 -translate-y-1/2 overflow-hidden"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[999]"
        ariaHideApp={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] min-h-[70vh]">
          {/* Imagen decorativa - lado izquierdo */}
          <div className="hidden md:block bg-[#f8f5f2] min-h-[70vh]">
            <img
              src={`/assets/resources/job-application.png?v=${crypto.randomUUID()}`}
              alt="Trabaja con nosotros"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/img/logo-bk.svg";
              }}
            />
          </div>

          {/* Contenido del modal - lado derecho */}
          <div className="flex flex-col max-h-[90vh]">
            {!success ? (
              <>
                {/* Header fijo */}
                <div className="p-6 pb-0 flex-shrink-0 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-bold customtext-neutral-dark mb-3">
                    Únete a nuestro equipo
                  </h2>
                  <p className="text-base md:text-lg 2xl:text-xl text-gray-600 leading-relaxed">
                    Completa el formulario y envíanos tu CV. Estamos buscando talento como tú.
                  </p>
                </div>

                {/* Formulario con scroll */}
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="space-y-6 py-6">
                    <form onSubmit={handleSubmit} id="job-application-form">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Nombre completo <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={nameRef}
                            type="text"
                            required
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="Ingresa tu nombre completo"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Correo electrónico <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={emailRef}
                            type="email"
                            required
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="tu@email.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Teléfono
                          </label>
                          <input
                            ref={phoneRef}
                            type="tel"
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="+51 999 999 999"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Posición de interés
                          </label>
                          <input
                            ref={positionRef}
                            type="text"
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="Ej: Desarrollador, Diseñador, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Mensaje
                          </label>
                          <textarea
                            ref={messageRef}
                            rows="4"
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none shadow-sm hover:shadow-md"
                            placeholder="Cuéntanos brevemente sobre ti..."
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Adjunta tu CV
                          </label>
                          
                          <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                            onClick={() => cvRef.current?.click()}
                          >
                            <input
                              ref={cvRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            
                            {selectedFile ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
                                    <Upload className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium text-gray-900 text-sm">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeFile()
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <div className="py-3">
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-600 font-medium text-sm mb-1">
                                  Arrastra tu CV o haz clic aquí
                                </p>
                                <p className="text-xs text-gray-400">
                                  PDF, DOC, DOCX (máx. 5MB)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Espacio extra para padding bottom */}
                        <div className="pb-4"></div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Botones fijos en el bottom */}
                <div className="p-6 pt-0 flex-shrink-0 border-t border-gray-100">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white py-4 rounded-2xl font-bold transition-all duration-300 text-base 2xl:text-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      form="job-application-form"
                      disabled={saving}
                      className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-base 2xl:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      {saving ? "Enviando..." : "Enviar solicitud"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 h-full">
                <div className="bg-green-100 rounded-full p-6 mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h2 className="text-2xl 2xl:text-3xl font-bold customtext-primary mb-3">
                  ¡Gracias por tu interés!
                </h2>
                <p className="text-gray-600 text-base 2xl:text-lg mb-6 max-w-md">
                  Hemos recibido tu solicitud correctamente. Revisaremos tu perfil y nos pondremos en contacto contigo pronto.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-primary text-white px-8 py-3 rounded-3xl font-medium hover:bg-opacity-90 transition-all text-sm 2xl:text-base"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      </ReactModal>
    </>
  )
}

export default TopBarCopyright