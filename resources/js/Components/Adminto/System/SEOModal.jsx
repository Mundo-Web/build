import React, { useEffect, useRef } from "react";
import InputFormGroup from '../../Adminto/form/InputFormGroup';
import TextareaFormGroup from '../../Adminto/form/TextareaFormGroup';
import Modal from '../../Adminto/Modal';
import SelectFormGroup from "../../Adminto/form/SelectFormGroup";
import Global from "../../../Utils/Global";
import SystemRest from "../../../Actions/Admin/SystemRest";
import SetSelectValue from "../../../Utils/SetSelectValue";

const systemRest = new SystemRest()

const SITEMAP_FREQUENCIES = [
  { value: 'always', label: 'Siempre' },
  { value: 'hourly', label: 'Cada hora' },
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
  { value: 'never', label: 'Nunca' },
]

const SEOModal = ({ dataLoaded, setDataLoaded, modalRef }) => {
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const keywordsRef = useRef(null)
  const sitemapPriorityRef = useRef(null)
  const sitemapFrequencyRef = useRef(null)
  const searchEnabledRef = useRef(null)
  const searchPatternRef = useRef(null)

  const onSeoChange = async (e) => {
    e.preventDefault()
    const result = await systemRest.savePage({
      id: dataLoaded.id,
      description: descriptionRef.current.value,
      keywords: $(keywordsRef.current).val(),
      sitemap_priority: parseFloat(sitemapPriorityRef.current.value) || 0.8,
      sitemap_frequency: $(sitemapFrequencyRef.current).val() || 'weekly',
      search_enabled: searchEnabledRef.current.checked,
      search_pattern: searchPatternRef.current.value
    })
    if (!result) return
    setDataLoaded(null)
    $(modalRef.current).modal('hide')
  }

  useEffect(() => {
    nameRef.current.value = `${dataLoaded?.name} | ${Global.APP_NAME}`
    descriptionRef.current.value = dataLoaded?.description ?? ''
    SetSelectValue(keywordsRef.current, dataLoaded?.keywords ?? []);
    sitemapPriorityRef.current.value = dataLoaded?.sitemap_priority ?? 0.8
    SetSelectValue(sitemapFrequencyRef.current, dataLoaded?.sitemap_frequency ?? 'weekly');
    searchEnabledRef.current.checked = dataLoaded?.search_enabled ?? false;
    searchPatternRef.current.value = dataLoaded?.search_pattern ?? '/catalogo?search={search_term_string}';
  }, [dataLoaded])

  return (
    <Modal modalRef={modalRef} title={`Editar SEO - ${dataLoaded?.name}`} size='md' onSubmit={onSeoChange}>
      <div id='seo-container'>
        <InputFormGroup eRef={nameRef} label='Título' disabled />
        <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={2} />
        <SelectFormGroup eRef={keywordsRef} label='Palabras clave' tags multiple dropdownParent='#seo-container' />
        
        <hr className="my-3" />
        <h6 className="text-muted mb-3">
          <i className="fas fa-sitemap me-1"></i>
          Configuración del Sitemap
        </h6>
        
        <div className="row">
          <div className="col-6">
            <InputFormGroup 
              eRef={sitemapPriorityRef} 
              label='Prioridad (0.0 - 1.0)' 
              type='number' 
              step='0.1' 
              min='0' 
              max='1'
            />
          </div>
          <div className="col-6">
            <SelectFormGroup 
              eRef={sitemapFrequencyRef} 
              label='Frecuencia de cambio'
              dropdownParent='#seo-container'
            >
              {SITEMAP_FREQUENCIES.map(freq => (
                <option key={freq.value} value={freq.value}>{freq.label}</option>
              ))}
            </SelectFormGroup>
          </div>
         </div>

        <hr className="my-3" />
        <h6 className="text-muted mb-3">
          <i className="fas fa-search me-1"></i>
          Configuración de Búsqueda (Google Schema)
        </h6>

        <div className="form-check form-switch mb-2">
          <input className="form-check-input" type="checkbox" id="search_enabled" ref={searchEnabledRef} />
          <label className="form-check-label fw-bold" htmlFor="search_enabled">Habilitar Buscador en Google</label>
        </div>
        
        <InputFormGroup 
          eRef={searchPatternRef} 
          label='Patrón de URL de búsqueda' 
          placeholder='/catalogo?search={search_term_string}'
        />
        <small className="text-muted d-block mt-n2 mb-2">
          Usa <code>{`{search_term_string}`}</code> como marcador de posición para el término de búsqueda.
        </small>
      </div>
    </Modal>
  )
}

export default SEOModal;
