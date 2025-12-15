import { Link } from '@inertiajs/react'
import JSEncrypt from 'jsencrypt'
import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import ReCAPTCHA from 'react-google-recaptcha'
import Swal from 'sweetalert2'
import AuthRest from './actions/AuthRest'
import SelectFormGroup from './Components/Adminto/form/SelectFormGroup'
import Modal from './Components/Adminto/Modal'
import CreateReactScript from './Utils/CreateReactScript'
import HtmlContent from './Utils/HtmlContent'

const Register = ({ PUBLIC_RSA_KEY, RECAPTCHA_SITE_KEY, token, terms = 'Terminos y condiciones', roles = [], specialties }) => {

  document.title = 'Registro | NetCoaching'

  const jsEncrypt = new JSEncrypt()
  jsEncrypt.setPublicKey(PUBLIC_RSA_KEY)

  // Estados
  const [loading, setLoading] = useState(true)
  const [captchaValue, setCaptchaValue] = useState(null)
  const [found, setFound] = useState(false)

  // const documentTypeRef = useRef()
  // const documentNumberRef = useRef()
  const roleRef = useRef()
  const nameRef = useRef()
  const lastnameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmationRef = useRef()
  const termsRef = useRef()
  const specialtyRef = useRef()

  const termsModalRef = useRef();

  useEffect(() => {
    setLoading(false)
  }, [])

  const onRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)


    const password = passwordRef.current.value
    const confirmation = confirmationRef.current.value

    if (password != confirmation) {
      return Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonText: 'Ok'
      })
    }

    if (!captchaValue) return Swal.fire({
      icon: 'warning',
      title: 'Error',
      text: 'Por favor, complete el captcha',
      confirmButtonText: 'Ok'
    })

    // if (found) return Swal.fire({
    //   icon: 'warning',
    //   title: 'Error',
    //   text: 'El numero de documento ya esta registrado',
    //   confirmButtonText: 'Ok'
    // })

    const request = {
      role: $(roleRef.current).val(),
      name: nameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      password: jsEncrypt.encrypt(password),
      confirmation: jsEncrypt.encrypt(confirmation),
      terms: termsRef.current.checked,
      captcha: captchaValue,
      specialties: $(specialtyRef.current).val()
    }
    const result = await AuthRest.signup(request)
    if (!result) return setLoading(false)

    if (result) location.href = `./confirm-email/${result}`;
    setLoading(false)
  }

  const onDocumentTypeChange = (e) => {
    documentNumberRef.current.value = ''
    setFound(false)
  }

  return (<>
    <div className="account-pages mt-5 mb-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-4">
            <div className="text-center">
              <a href="/">
                <img src='/assets/img/logo-default.png' alt="" className="mx-auto" style={{ height: '40px' }} />
              </a>
              <p className="text-muted mt-2 mb-4">Bienvenido a Trasciende</p>
            </div>
            <div className="card">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h4 className="text-uppercase mt-0 font-bold">Registrate</h4>
                </div>
                <form onSubmit={onRegisterSubmit} className='row'>
                  <div className="col-12">
                    <div className="row justify-content-center">
                      <div className="col-sm-6 mb-2">
                        <label htmlFor="role" className="form-label">Tipo de usuario <b className="text-danger">*</b></label>
                        <SelectFormGroup eRef={roleRef} onChange={onDocumentTypeChange} required>
                          {
                            roles.map((role, i) => {
                              return <option value={role.relative_id}>{role.name}</option>
                            })
                          }
                        </SelectFormGroup>
                      </div>
                    </div>
                  </div>

                  <SelectFormGroup label='Especialidad' eRef={specialtyRef} required multiple>
                    {
                      specialties.map((specialty, i) => {
                        return <option key={`specialty-${i}`} value={specialty.id}>{specialty.name}</option>
                      })
                    }
                  </SelectFormGroup>

                  <div className="col-sm-6 mb-2">
                    <label htmlFor="name" className="form-label">Nombres <b className="text-danger">*</b></label>
                    <input ref={nameRef} className="form-control" type="text" id="name" placeholder="Ingrese su nombre"
                      required />
                  </div>
                  <div className="col-sm-6 mb-2">
                    <label htmlFor="lastname" className="form-label">Apellidos <b className="text-danger">*</b></label>
                    <input ref={lastnameRef} className="form-control" type="text" id="lastname" placeholder="Ingrese sus apellidos"
                      required />
                  </div>
                  <div className="col-12 mb-2">
                    <label htmlFor="email" className="form-label">Correo electronico <b className="text-danger">*</b></label>
                    <input ref={emailRef} className="form-control" type="email" id="email" required
                      placeholder="Ingrese su correo electronico" />
                  </div>
                  <div className="col-sm-6 mb-2">
                    <label htmlFor="password" className="form-label">Contraseña <b className="text-danger">*</b></label>
                    <input ref={passwordRef} className="form-control" type="password" required id="password"
                      placeholder="Ingrese su contraseña" />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="confirmation" className="form-label">Confirmacion <b className="text-danger">*</b></label>
                    <input ref={confirmationRef} className="form-control" type="password" required id="confirmation"
                      placeholder="Confirme su contraseña" />
                  </div>
                  <div className="col-12 mb-3">
                    <div className="form-check mx-auto" style={{ width: 'max-content' }}>
                      <input ref={termsRef} type="checkbox" className="form-check-input" id="checkbox-signup" required />
                      <label className="form-check-label" htmlFor="checkbox-signup">
                        Acepto los
                        <a
                          href="#terms" className="ms-1 text-blue" onClick={() => $(termsModalRef.current).modal('show')}>
                          terminos y condiciones
                        </a>
                      </label>
                    </div>
                  </div>
                  <ReCAPTCHA className='m-auto mb-3' sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptchaValue} style={{ display: "block", width: 'max-content' }} />
                  <div className="mb-0 text-center d-grid">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? <>
                        <i className='fa fa-spinner fa-spin'></i> Verificando
                      </> : 'Registrarme'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 text-center">
                <p className="text-muted">Ya tienes una cuenta? <Link href="/login"
                  className="text-white ms-1"><b>Iniciar sesion</b></Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal modalRef={termsModalRef} title='Terminos y condiciones' size='lg' hideFooter>
      <HtmlContent html={terms} />
    </Modal>
  </>)
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<Register {...properties} />);
})