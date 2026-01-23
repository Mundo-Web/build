import React, { useEffect, useRef, useState } from "react";
import InputFormGroup from '../../Adminto/form/InputFormGroup';
import TextareaFormGroup from '../../Adminto/form/TextareaFormGroup';
import Modal from '../../Adminto/Modal';
import SelectFormGroup from "../../Adminto/form/SelectFormGroup";
import SystemRest from "../../../Actions/Admin/SystemRest";
import EditorFormGroup from "../../Adminto/form/EditorFormGroup";

const systemRest = new SystemRest()

// Opciones de animación disponibles
const animationOptions = [
  { value: 'fade-up', label: 'Fade Up (por defecto)' },
  { value: 'fade-down', label: 'Fade Down' },
  { value: 'fade-left', label: 'Fade Left' },
  { value: 'fade-right', label: 'Fade Right' },
  { value: 'fade', label: 'Fade (solo opacidad)' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'zoom-out', label: 'Zoom Out' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'blur-in', label: 'Blur In' },
  { value: 'scale-up', label: 'Scale Up' },
  { value: 'rotate-in', label: 'Rotate In' },
  { value: 'reveal', label: 'Reveal (máscara)' },
  { value: 'none', label: 'Sin animación' }
];

const easingOptions = [
  { value: 'gcigc', label: 'GCIGC (suave profesional)' },
  { value: 'smooth', label: 'Smooth' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'spring', label: 'Spring (rebote suave)' },
  { value: 'bounce', label: 'Bounce (rebote fuerte)' }
];

const DataModal = ({ dataLoaded, setDataLoaded, setSystems, modalRef }) => {
  const [data, setData] = useState(dataLoaded?.data || {})
  const [elementId, setElementId] = useState(dataLoaded?.element_id || '')
  const [methodValues, setMethodValues] = useState([])

  const usingRef = {}
  usingRef.model = useRef(null)
  usingRef.filters = useRef(null)
  usingRef.filtersMethod = useRef(null)

  const onDataSubmit = async (e) => {
    e.preventDefault()
    // CRÍTICO: Hacer merge con los datos existentes en lugar de sobrescribir
    const mergedData = {
      ...(dataLoaded?.data || {}), // Mantener todos los campos existentes
      ...data // Sobrescribir solo los campos editados
    }
    const result = await systemRest.save({
      id: dataLoaded.id,
      data: mergedData,
      element_id: elementId,
      filters: $(usingRef.filters.current).val(),
      filters_method: dataLoaded?.component?.using?.['filters:method'],
      filters_method_values: $(usingRef.filtersMethod.current).val()
    })
    if (!result) return
    setDataLoaded(null)
    $(modalRef.current).modal('hide')
    setSystems(old => old.map(system => system.id == dataLoaded.id ? result : system))
  }

  useEffect(() => {
    // CRÍTICO: Inicializar con TODOS los datos existentes, no solo los campos definidos en components.json
    const existingData = dataLoaded?.data || {}
    const newData = { ...existingData }
    
    // Asegurar que los campos definidos en components.json estén presentes
    dataLoaded?.component?.data?.forEach && dataLoaded?.component?.data?.forEach(key => {
      if (!(key in newData)) {
        newData[key] = ''
      }
    })
    setData(newData)
    setElementId(dataLoaded?.element_id || '')
    usingRef.model.current.value = dataLoaded?.component?.using?.model ?? ''
    $(usingRef.filters.current).val(dataLoaded?.filters ?? []).trigger('change')
    $(usingRef.filtersMethod.current).val(dataLoaded?.filtersMethod ?? []).trigger('change')

    const model = dataLoaded?.component?.using?.model
    const method = dataLoaded?.component?.using?.['filters:method']
    if (!model || !method) return
    systemRest.simpleGet(`/api/admin/system/related/${model}/${method}`).then(result => {
      setMethodValues(result)
    })
  }, [dataLoaded])

  const onBoolChange = (key, value) => {
    setData({ ...data, [key]: value })
  }

  return (
    <Modal modalRef={modalRef} title={dataLoaded?.name} onSubmit={onDataSubmit} size={dataLoaded?.component?.data?.some(x => x.startsWith('code:')) ? 'lg' : 'md'}>
      <ul className="nav nav-tabs nav-bordered">
        <li className="nav-item">
          <a href="#tab-general" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
            General
          </a>
        </li>
        <li className="nav-item" hidden={!dataLoaded?.component?.data?.length}>
          <a href="#tab-info" data-bs-toggle="tab" aria-expanded="true" className="nav-link">
            Información
          </a>
        </li>
        <li className="nav-item">
          <a href="#tab-animation" data-bs-toggle="tab" aria-expanded="true" className="nav-link">
            <i className="mdi mdi-animation-play me-1"></i>
            Animación
          </a>
        </li>
        <li className="nav-item" hidden={!dataLoaded?.component?.using?.filters && !dataLoaded?.component?.using?.['filters:method']}>
          <a href="#tab-db" data-bs-toggle="tab" aria-expanded="true" className="nav-link">
            Base de datos
          </a>
        </li>
      </ul>
      <div className="tab-content" id="data-modal-container">
        <div className="tab-pane active" id="tab-general">
          <InputFormGroup 
            label='ID del elemento' 
            value={elementId} 
            onChange={e => setElementId(e.target.value)}
            placeholder="ej: contacto-principal, formulario-1"
          />
          <small className="text-muted d-block mb-3">
            Este ID se usa para anclas (#id), CSS personalizado y navegación. Se genera automáticamente pero puedes personalizarlo.
          </small>
        </div>
        <div className="tab-pane" id="tab-info" hidden={!dataLoaded?.component?.data?.length}>
          {
            dataLoaded?.component?.data?.map((element, index) => (
              element.startsWith('code:')
                ? <EditorFormGroup key={index} label={element.replace('code:', '')} value={data[element] ?? ''} rows={1} onChange={e => setData({ ...data, [element]: e.target.value })} />
                : <React.Fragment key={index}>
                  {
                    element.startsWith('bool:')
                      ? <div className="form-group">
                        <label className="form-label">{element.replace('bool:', '')}</label>
                        <div>
                          <div className="form-check form-check-inline">
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`${element}-true`}
                              name={element}
                              value="true"
                              checked={data[element] === true}
                              onChange={e => onBoolChange(element, e.target.value === 'true')}
                            />
                            <label className="form-check-label" htmlFor={`${element}-true`}>Sí</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`${element}-false`}
                              name={element}
                              value="false"
                              checked={data[element] === false}
                              onChange={e => onBoolChange(element, e.target.value === 'true')}
                            />
                            <label className="form-check-label" htmlFor={`${element}-false`}>No</label>
                          </div>
                        </div>
                      </div>
                      : <TextareaFormGroup label={element} value={data[element] ?? ''} rows={1} onChange={e => setData({ ...data, [element]: e.target.value })} />
                  }
                </React.Fragment>

            ))
          }
        </div>
        <div className="tab-pane" id="tab-animation">
          <div className="alert alert-info alert-dismissible fade show mb-3" role="alert">
            <i className="mdi mdi-information-outline me-1"></i>
            Configura animaciones de scroll estilo <strong>gcigc.com</strong>. Los elementos aparecerán animados al hacer scroll.
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className="form-label">Tipo de Animación</label>
                <select 
                  className="form-control"
                  value={data.scroll_animation || 'fade-up'}
                  onChange={e => setData({ ...data, scroll_animation: e.target.value })}
                >
                  {animationOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className="form-label">Easing (curva de velocidad)</label>
                <select 
                  className="form-control"
                  value={data.scroll_easing || 'gcigc'}
                  onChange={e => setData({ ...data, scroll_easing: e.target.value })}
                >
                  {easingOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className="form-label">Duración (segundos)</label>
                <input 
                  type="number" 
                  className="form-control"
                  step="0.1"
                  min="0.1"
                  max="3"
                  value={data.scroll_duration || 0.8}
                  onChange={e => setData({ ...data, scroll_duration: e.target.value })}
                  placeholder="0.8"
                />
                <small className="text-muted">Recomendado: 0.6 - 1.0 segundos</small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className="form-label">Delay (segundos)</label>
                <input 
                  type="number" 
                  className="form-control"
                  step="0.1"
                  min="0"
                  max="2"
                  value={data.scroll_delay || 0}
                  onChange={e => setData({ ...data, scroll_delay: e.target.value })}
                  placeholder="0"
                />
                <small className="text-muted">Tiempo de espera antes de iniciar</small>
              </div>
            </div>
          </div>
          
          <div className="form-group mb-3">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input"
                id="scroll_disabled"
                checked={data.scroll_disabled === true}
                onChange={e => setData({ ...data, scroll_disabled: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="scroll_disabled">
                Desactivar animación para este componente
              </label>
            </div>
          </div>
          
          {/* Preview de la animación */}
          <div className="card bg-light mb-0">
            <div className="card-body py-2">
              <small className="text-muted d-block mb-1">Vista previa:</small>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary">{data.scroll_animation || 'fade-up'}</span>
                <span className="badge bg-secondary">{data.scroll_easing || 'gcigc'}</span>
                <span className="badge bg-info">{data.scroll_duration || 0.8}s</span>
                {data.scroll_delay > 0 && <span className="badge bg-warning">delay: {data.scroll_delay}s</span>}
                {data.scroll_disabled && <span className="badge bg-danger">desactivado</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="tab-pane show" id="tab-db">
          <InputFormGroup eRef={usingRef.model} label='Modelo' disabled />
          <SelectFormGroup eRef={usingRef.filters} label='Filtros' multiple dropdownParent='#tab-db' hidden={!dataLoaded?.component?.using?.filters}>
            {
              dataLoaded?.component?.using?.filters?.map((filter, index) => (
                <option key={index} value={filter}>{filter}</option>
              ))
            }
          </SelectFormGroup>
          <div hidden={!dataLoaded?.component?.using?.['filters:method']}>
            <SelectFormGroup eRef={usingRef.filtersMethod} label={dataLoaded?.component?.using?.['filters:method']?.toTitleCase()} multiple dropdownParent='#tab-db' changeWith={[methodValues]}>
              {
                methodValues?.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))
              }
            </SelectFormGroup>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DataModal;
