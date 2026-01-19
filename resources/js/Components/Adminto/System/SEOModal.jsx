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

  const onSeoChange = async (e) => {
    e.preventDefault()
    const result = await systemRest.savePage({
      id: dataLoaded.id,
      description: descriptionRef.current.value,
      keywords: $(keywordsRef.current).val(),
      sitemap_priority: parseFloat(sitemapPriorityRef.current.value) || 0.8,
      sitemap_frequency: $(sitemapFrequencyRef.current).val() || 'weekly'
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
      </div>
    </Modal>
  )
}

export default SEOModal;
