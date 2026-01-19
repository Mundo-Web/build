import React, { useState } from "react"
import SystemRest from "../../../Actions/Admin/SystemRest"
import Tippy from "@tippyjs/react"
import SwitchFormGroup from "../form/SwitchFormGroup"
import RouteParams from "../../../Utils/RouteParams"
import TrimEnd from "../../../Utils/TrimEnd"

const systemRest = new SystemRest()

const BasicEditing4System = (page) => {

  const { id, name, path, extends_base = false, menuable = false, sitemapable = false, setPages, onSEOClicked, onParamsClicked } = page

  const [nameEditing, setNameEditing] = useState(false)
  const [pathEditing, setPathEditing] = useState(false)
  const [extendsBaseEditing, setExtendsBaseEditing] = useState(false)
  const [menuableEditing, setMenuableEditing] = useState(false)
  const [sitemapableEditing, setSitemapableEditing] = useState(false)

  const onNameChange = async (e) => {
    if (name === e.target.value) return setNameEditing(false)
    const result = systemRest.savePage({
      id,
      name: e.target.value
    })
    if (!result) return
    setNameEditing(false)
    setPages(old => old.map(page => page.id === id ? { ...page, name: e.target.value } : page))
  }

  const onPathChange = async (e) => {
    if (path === e.target.value) return setPathEditing(false)

    const newPath = e.target.value
    let path2check = structuredClone(newPath);
    const using = page.using ?? {}

    for (const param of RouteParams(newPath)) {
      path2check = path2check
        .replace(`{${param}}`, '')
        .replace(`{${param}?}`, '')
      using[param] = using[param] ?? { model: null }
    }

    const pseudo = TrimEnd(path2check, '/')

    const result = systemRest.savePage({
      id,
      path: newPath,
      pseudo_path: pseudo,
      using: Object.keys(using).length > 0 ? using : undefined
    })

    if (!result) return
    setPathEditing(false)
    setPages(old => old.map(page => page.id === id ? { ...page, path: e.target.value } : page))
  }

  const onExtendsBaseChange = async (e) => {
    setExtendsBaseEditing(true)
    const checked = e.target.checked
    const result = systemRest.savePage({
      id,
      extends_base: checked
    })
    setExtendsBaseEditing(false)
    if (!result) return
    setPages(old => old.map(page => page.id === id ? { ...page, extends_base: checked } : page))
  }

  const onMenuableChange = async (e) => {
    setMenuableEditing(true)
    const checked = e.target.checked
    const result = systemRest.savePage({
      id,
      menuable: checked
    })
    setMenuableEditing(false)
    if (!result) return
    setPages(old => old.map(page => page.id === id ? { ...page, menuable: checked } : page))
  }

  const onSitemapableChange = async (e) => {
    setSitemapableEditing(true)
    const checked = e.target.checked
    const result = systemRest.savePage({
      id,
      sitemapable: checked
    })
    setSitemapableEditing(false)
    if (!result) return
    setPages(old => old.map(page => page.id === id ? { ...page, sitemapable: checked } : page))
  }

  const onDeletePageClicked = async (page) => {
    const result = await systemRest.deletePage(page.id);
    if (!result) return;
    setPages(old => old.filter(x => x.id != page.id));
    $('[data-bs-toggle="tab"]').removeClass('active');
    $('.tab-pane').removeClass('active');

    $('#base-template-link').addClass('active');
    $('#base-template').addClass('active');
  }

  const params = RouteParams(path);

  return <>
    <div className="dropdown float-end">
      <a href="#" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="mdi mdi-dots-vertical"></i>
      </a>
      <div className="dropdown-menu dropdown-menu-end">
        <button className="dropdown-item" onClick={() => onSEOClicked(page)}>
          <i className="mdi mdi-cloud-search-outline me-1"></i>
          Editar SEO
        </button>
        {
          params.length > 0 &&
          <button className="dropdown-item" onClick={() => onParamsClicked(page)}>
            <i className="mdi mdi-code-braces me-1"></i>
            Parámetros
          </button>
        }
        <div className="dropdown-divider"></div>
        <button className="dropdown-item" onClick={() => onDeletePageClicked(page)}>
          <i className="mdi mdi-trash-can-outline me-1"></i>
          Eliminar página
        </button>
      </div>
    </div>
    <div>
      {
        nameEditing
          ? <input className='form-control form-control-sm mb-1' defaultValue={name} onBlur={onNameChange} autoFocus />
          : <Tippy content="Editar nombre" placement="left">
            <h4 className='header-title mb-1 d-block' onClick={() => setNameEditing(true)} style={{ minWidth: '200px', cursor: 'pointer' }}>{name || 'Sin nombre'}</h4>
          </Tippy>
      }
      {
        pathEditing
          ? <input className='form-control form-control-sm mb-1' defaultValue={path} style={{ minHeight: 27, fieldSizing: 'content' }} onBlur={onPathChange} autoFocus />
          : <Tippy content="Editar ruta" placement="left">
            <small className='text-muted d-block mb-1' onClick={() => setPathEditing(true)} style={{ minWidth: '200px', cursor: 'pointer' }}>{path || 'Sin ruta'}</small>
          </Tippy>
      }
    </div>
    <div className="row">
      <SwitchFormGroup label="Extiende de base" col={'col-lg-6 col-md-12 col-sm-6'} checked={extends_base} onChange={onExtendsBaseChange} disabled={extendsBaseEditing} />
      <SwitchFormGroup label="Mostrar en menu" col={'col-lg-6 col-md-12 col-sm-6'} checked={menuable} onChange={onMenuableChange} disabled={menuableEditing} />
      <SwitchFormGroup label="Incluir en sitemap" col={'col-lg-6 col-md-12 col-sm-6'} checked={sitemapable} onChange={onSitemapableChange} disabled={sitemapableEditing} />
    </div>
  </>
}

export default BasicEditing4System