import React, { useState } from 'react'
import ColorsRest from '../../../Actions/Admin/ColorsRest'
import GalleryRest from '../../../Actions/Admin/GalleryRest'
import SettingsRest from '../../../Actions/Admin/SettingsRest'
import Tippy from '@tippyjs/react'

const galleryRest = new GalleryRest()
const colorsRest = new ColorsRest()
const settingsRest = new SettingsRest()

const RigthBar = ({ colors, setColors, settings, setSettings }) => {

  const [images, setImages] = useState([
    { uuid: crypto.randomUUID(), col: 'col-3', name: "Icon (1:1)", src: "icon.png", width: '100%', aspectRatio: 1 },
    { uuid: crypto.randomUUID(), col: 'col-5', name: "Logo (13:4)", src: "logo.png", width: '100%', aspectRatio: 13 / 4 },
    { uuid: crypto.randomUUID(), col: 'col-4', name: "Logo footer (1:1)", src: "logo-footer.png", width: '100%', aspectRatio: 1 },
    { uuid: crypto.randomUUID(), col: 'col-12', name: "Loading (13:4)", src: "loading.png", width: '100%', aspectRatio: 13 / 4 }
  ])

  const onImageChange = async (e) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    e.target.value = null
    const name = e.target.name

    const formData = new FormData();
    formData.append('image', file)
    formData.append('name', name)

    const result = await galleryRest.save(formData)
    if (!result) return
    setImages(old => {
      return old.map(x => {
        if (x.src == name) x.uuid = crypto.randomUUID()
        return x
      })
    })
  }

  const onColorChange = async (e) => {
    const id = e.target.getAttribute('data-color-id')
    const field = e.target.name
    const value = e.target.value

    const currentColor = colors.find(color => color.id == id)[field];
    if (currentColor === value) return;

    const result = await colorsRest.save({
      id,
      [field]: value
    })
    if (!result) return
    setColors(old => {
      return old.map(x => x.id == id ? result.data : x);
    })
  }

  const onSettingChange = async (e) => {
    const id = e.target.getAttribute('data-id')
    const name = e.target.name
    let value = e.target.value

    if (e.target.type == 'checkbox') {
      value = e.target.checked ? 'true' : 'false'
    }

    const currentSetting = settings.find(setting => setting.name == name)?.description ?? '';
    if (currentSetting === value) return;
    const result = await settingsRest.save({
      name,
      value
    })
    if (!result) return
    setSettings(old => {
      return old.map(x => x.id == id ? result.data : x);
    })
  }

  const getSetting = (name) => {
    const setting = settings.find(setting => setting.name == name)
    if (!setting) return ''
    return setting.value
  }

  return (<div className="right-bar">

    <div data-simplebar className="h-100">

      <div className="rightbar-title">
        <a href="#" className="right-bar-toggle float-end">
          <i className="mdi mdi-close"></i>
        </a>
        <h4 className="font-16 m-0 text-white">Configuraciones</h4>
      </div>

      <div className='p-2'>
        <h5>Imágenes principales</h5>
        <div className='row'>
          {
            images.map((image, index) => {
              const uuid = 'file-' + image.uuid
              return <div className={image.col} key={index}>
                <input id={uuid} name={image.src} type="file" accept='image/png' hidden onChange={onImageChange} />
                <label htmlFor={uuid} className='form-label d-block mb-1' style={{ cursor: 'pointer' }}>{image.name}</label>
                <label htmlFor={uuid} style={{ cursor: 'pointer' }} className='w-100'>
                  <img className='border' src={`/assets/resources/${image.src}?v=${image.uuid}`} alt="" style={{
                    height: image.height,
                    width: image.width,
                    objectFit: 'contain',
                    objectPosition: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    aspectRatio: image.aspectRatio,
                  }} />
                </label>
              </div>
            })
          }
        </div>
        <hr className='my-2' />
        <h5>Fuentes del sistema</h5>
        <div className='mb-2'>
          <label htmlFor="" className='form-label mb-1'>Titulos</label>
          <Tippy content='Nombre de la fuente'>
            <input type="text" className='form-control form-control-sm mb-1'
              name='title-font-name'
              defaultValue={getSetting('title-font-name')}
              onBlur={onSettingChange} />
          </Tippy>
          <Tippy content='Enlace de la fuente'>
            <textarea className='form-control form-control-sm' rows={1}
              name='title-font-url'
              defaultValue={getSetting('title-font-url')}
              onBlur={onSettingChange}
              style={{
                minHeight: 27,
                fieldSizing: 'content'
              }} />
          </Tippy>
          <Tippy content='Marcar si el archivo es un archivo de fuente (otf, woff, woff2, etc)'>
            <div className="form-check mt-1">
              <input type="checkbox" className='form-check-input'
                name='title-font-source'
                id='title-font-source'
                defaultChecked={getSetting('title-font-source') == 'true'}
                onBlur={onSettingChange} />
              <label className='form-check-label' htmlFor='title-font-source'>
                ¿Es este un archivo de fuente?
              </label>
            </div>
          </Tippy>
        </div>
        <div className='mb-2'>
          <label htmlFor="" className='form-label mb-1'>Parrafos</label>
          <Tippy content='Nombre de la fuente'>
            <input type="text" className='form-control form-control-sm mb-1'
              name='paragraph-font-name'
              defaultValue={getSetting('paragraph-font-name')}
              onBlur={onSettingChange} />
          </Tippy>
          <Tippy content='Enlace de la fuente'>
            <textarea className='form-control form-control-sm' rows={1}
              name='paragraph-font-url'
              defaultValue={getSetting('paragraph-font-url')}
              onBlur={onSettingChange}
              style={{
                minHeight: 27,
                fieldSizing: 'content'
              }} />
          </Tippy>
          <Tippy content='Marcar si el archivo es un archivo de fuente (otf, woff, woff2, etc)'>
            <div className="form-check mt-1">
              <input type="checkbox" className='form-check-input'
                name='paragraph-font-source'
                id='paragraph-font-source'
                defaultChecked={getSetting('paragraph-font-source') == 'true'}
                onBlur={onSettingChange} />
              <label className='form-check-label' htmlFor='paragraph-font-source'>
                ¿Es este un archivo de fuente?
              </label>
            </div>
          </Tippy>
        </div>
        <hr className='my-2' />
        <h5>Colores del sistema</h5>
        <div className='d-flex flex-column gap-1'>
          {
            colors.map((color, index) => {
              const isGradient = color.description?.startsWith('linear-gradient') || color.description?.startsWith('radial-gradient');
              const isMenuAdmin = color.name == 'menu-admin';
              const primaryColor = colors.find(c => c.name == 'primary')?.description || '#6658dd';
              
              return <div key={index}>
                <div className="input-group input-group-sm">
                  {!isGradient && (
                    <span className="input-group-text px-1" >
                      <input type="color" name='description' data-color-id={color.id} className='p-0' style={{
                        width: '20px',
                        height: '20px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }} defaultValue={color.description || primaryColor} onBlur={onColorChange} />
                    </span>
                  )}
                  <input type="text" name='name' data-color-id={color.id} className={`form-control form-control-sm`} placeholder="Color" defaultValue={color.name} onBlur={onColorChange} disabled={color.name == 'primary' || isMenuAdmin} style={{
                    cursor: (color.name == 'primary' || isMenuAdmin) ? 'not-allowed' : 'text'
                  }} />
                </div>
                {isGradient ? (
                  <textarea 
                    name='description' 
                    data-color-id={color.id} 
                    className='form-control form-control-sm mt-1' 
                    placeholder='Gradiente: linear-gradient(...)' 
                    defaultValue={color.description || ''} 
                    onBlur={onColorChange}
                    rows={2}
                    style={{
                      fontSize: '11px',
                      minHeight: 27,
                      fieldSizing: 'content'
                    }}
                  />
                ) : (
                  <input 
                    type="text" 
                    name='description' 
                    data-color-id={color.id} 
                    className='form-control form-control-sm mt-1' 
                    placeholder={isMenuAdmin ? `Color del menú admin (por defecto: primary)` : 'Hex color'}
                    defaultValue={color.description || (isMenuAdmin ? primaryColor : '')} 
                    onBlur={onColorChange}
                    style={{
                      fontSize: '11px'
                    }}
                  />
                )}
              </div>
            })
          }
        </div>
      </div>

    </div>
  </div>)
}

export default RigthBar