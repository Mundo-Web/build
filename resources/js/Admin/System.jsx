import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import Tippy from '@tippyjs/react';
import SystemRest from '../Actions/Admin/SystemRest';
import BasicEditing4System from '../Components/Adminto/Basic/BasicEditing4System';
import Global from '../Utils/Global';
import SortByAfterField from '../Utils/SortByAfterField';
import SEOModal from '../Components/Adminto/System/SEOModal';
import Component from '../Components/Adminto/System/Component';
import DataModal from '../Components/Adminto/System/DataModal';
import Menu from '../Components/Adminto/System/Menu';
import ParamsModal from '../Components/Adminto/System/ParamsModal';
import RouteParams from '../Utils/RouteParams';
import RigthBar from '../Components/Adminto/System/RightBar';
import Modal from '../Components/Adminto/Modal';

const systemRest = new SystemRest()

const System = ({
  systems: systemsDB = [],
  pages: pagesDB = [],
  colors: colorsDB = [],
  components, models,
  settings: settingsDB = [],
}) => {

  const modalSEORef = useRef(null);
  const modalParamsRef = useRef(null);
  const modalGitHubRef = useRef(null);
  const dataModalRef = useRef(null);

  const [systems, setSystems] = useState(systemsDB);
  const [pages, setPages] = useState(pagesDB);
  const [colors, setColors] = useState(colorsDB)
  const [settings, setSettings] = useState(settingsDB);

  const [addingPage, setAddingPage] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(null);
  const [systemLoaded, setSystemLoaded] = useState(null);

  const [ghHasError, setGhHasError] = useState(false)
  const [hasRemoteChanges, setHasRemoteChanges] = useState(false)
  const [lastRemoteCommit, setLastRemoteCommit] = useState(null)
  const [fetchingChanges, setFetchingChanges] = useState(false)
  const [commits, setCommits] = useState(0)

  const onAddPageClicked = async () => {
    setAddingPage(true);
    const newPages = await systemRest.savePage();
    if (!newPages) return;
    setAddingPage(false);
    setPages(newPages);
  }

  const onComponentClicked = async (system) => {

    const tabPane = $('.tab-pane:visible');
    const tabPaneId = tabPane.data('id') ?? null;

    system.page_id = tabPaneId;

    const result = await systemRest.save(system);
    if (!result) return;
    const newSystem = result;
    setSystems(old => {
      const exists = old.some(x => x.id === newSystem.id);
      if (exists) {
        return old.map(x => x.id === newSystem.id ? newSystem : x);
      } else {
        return [...old, newSystem];
      }
    });
  }

  const onDeleteClicked = async (system) => {
    const result = await systemRest.delete(system.id);
    if (!result) return;
    setSystems(old => old.filter(x => x.id != system.id));
  }

  const fetchRemoteChanges = async () => {
    setFetchingChanges(true)
    const result = await systemRest.fetchRemoteChanges()
    setFetchingChanges(false)
    if (!result) return
    location.reload()
  }

  const onPathChange = (e) => {
    const pageId = $(e.target).data('page-id')
    const path = $(e.target).data('page-path')
    const value = $(e.target).val()

    $(`#iframe-${pageId}`).removeAttr('src')
    $(`#iframe-${pageId}`).attr('src', `${path}/${value}`)
  }

  const onEditSEOClicked = async (page) => {
    setPageLoaded(page);
    $(modalSEORef.current).modal('show');
  }

  const onManageParamsClicked = async (page) => {
    setPageLoaded(page);
    $(modalParamsRef.current).modal('show');
  }

  const onEditDataClicked = async (system, component) => {
    setSystemLoaded({ ...system, component });
    $(dataModalRef.current).modal('show');
  }

  useEffect(() => {
    let interval = null;

    const checkRemoteChanges = async () => {
      if (fetchingChanges) return
      if (ghHasError) {
        clearInterval(interval)
        return
      }

      const data = await systemRest.hasRemoteChanges()

      if (!data) {
        setGhHasError(true)
        return
      };

      setHasRemoteChanges(data.has_changes)
      setLastRemoteCommit(data.last_commit)
      setCommits(data.commits)
    }

    interval = setInterval(async () => {
      await checkRemoteChanges()
    }, 10000)

    return () => clearInterval(interval)
  }, [ghHasError, fetchingChanges])

  useEffect(() => {
    const iframe = $('iframe:visible');
    if (iframe) {
      $(iframe).removeAttr('src');
      $(iframe).attr('src', iframe.data('path'));
    }
  }, [systems, colors, settings])

  useEffect(() => {
    const containers = [...$('.components-container')];
    containers.forEach(container => {
      // Destroy previous sortable if exists to avoid duplicate bindings
      try {
        if ($(container).hasClass('ui-sortable')) {
          $(container).sortable('destroy');
        }
      } catch (e) {
        // ignore
      }

      $(container).sortable({
        connectWith: '.components-container',
        handle: '.handle-sortable',
        forcePlaceholderSize: true,
        update: async function (event, ui) {

          const systemsSorted = [...$(container).children()];
          const updates = {};

          systemsSorted.forEach(system => {
            const id = $(system).data('id');
            const after_component = $(system).prev().data('id') ?? null;

            const currentSystem = systems.find(x => x.id == id);
            if (currentSystem?.after_component !== after_component) {
              updates[id] = after_component;
            }
          });

          if (Object.keys(updates).length > 0) {
            const result = await systemRest.updateOrder(updates);
            if (!result) return;

            setSystems(old => {
              // Crear una copia del array actual
              const newSystems = [...old];

              // Actualizar todos los sistemas afectados de una vez
              Object.entries(updates).forEach(([id, after_component]) => {
                const index = newSystems.findIndex(s => s.id == id);
                if (index !== -1) {
                  newSystems[index] = {
                    ...newSystems[index],
                    after_component
                  };
                }
              });

              return newSystems;
            });
          }
        }
      }).disableSelection();
    });
  }, [pages, systems]);

  useEffect(() => {
    document.title = `Sistema | ${Global.APP_NAME}`
  }, [])

  const [gitAuthor, gitDate, gitMessage] = lastRemoteCommit?.split('\n') ?? []

  return (
    <>
      <div id="wrapper position-relative">
        <Menu components={components} onClick={onComponentClicked} />
        <div className="content-page mt-2 pb-3" style={{ height: 'max-content' }}>
          <div className="content mt-2">
            <div className="container-fluid">
              <button className='button-menu-mobile d-lg-none d-md-block position-absolute ' style={{
                zIndex: 1,
                border: 'none',
                borderRadius: '0 50% 50% 0',
                backgroundColor: '#fff',
                color: '#343a40',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                padding: '24px 0px 20px 6px ',
                fontWeight: 'bold'
              }}>
                〉
              </button>
              <div className='row'>
                <div className="col-12">
                  <div className="card mb-0">
                    <div className="card-body" style={{ height: 'calc(100vh - 48px)' }}>
                      <ul className="nav nav-tabs nav-bordered flex-nowrap" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                        <li className="nav-item">
                          <a id='base-template-link' href="#base-template" data-bs-toggle="tab" aria-expanded="false" className="nav-link active h-100">
                            Base
                          </a>
                        </li>
                        {
                          pages.map((page, index) => (
                            <li className="nav-item" key={index}>
                              <a href={`#page-${page.id}`} data-bs-toggle="tab" aria-expanded="false" className="nav-link h-100" style={{ whiteSpace: 'nowrap' }}>
                                {page.name}
                                <small className='d-block text-muted' style={{ fontWeight: 'normal' }}>{page.path}</small>
                              </a>
                            </li>
                          ))
                        }
                        <li className="nav-item d-flex justify-content-center align-items-center px-2">
                          <Tippy content="Agregar página">
                            <button className="nav-link btn btn-xs btn-white rounded-pill" onClick={onAddPageClicked} disabled={addingPage}>
                              {
                                addingPage ? <i className="mdi mdi-loading mdi-spin"></i> : <i className="mdi mdi-plus"></i>
                              }
                            </button>
                          </Tippy>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane active" id="base-template">
                          <div className="row">
                            <div className="col-md-4" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                              <div className='d-flex flex-column gap-2 components-container' data-page-id={null}>
                                {
                                  SortByAfterField(systems).filter(x => x.page_id == null).map(system => {
                                    const component = components.find(x => x.id == system.component);
                                    const options = component?.options ?? [];
                                    if (system.component == 'content') {
                                      return <button key={system.id} data-id={system.id} className="btn btn-light text-truncate w-100 text-start" type="button">
                                        <i className="fa fa-ellipsis-v"></i>
                                        <i className="fa fa-ellipsis-v"></i>
                                        <span className='ms-1'>{system.name}</span>
                                      </button>
                                    } else {
                                      const component = components.find(x => x.id == system.component);
                                      return <Component
                                        key={system.id}
                                        className=''
                                        system={system}
                                        component={component}
                                        onComponentClicked={onComponentClicked}
                                        onDeleteClicked={onDeleteClicked}
                                        onEditDataClicked={onEditDataClicked}
                                      />
                                    }
                                  })
                                }
                              </div>
                            </div>
                            <div className="col-md-8">
                              <iframe src='/base-template' data-path='/base-template' className='w-100 h-100 border' style={{
                                minHeight: 'calc(100vh - 200px)',
                                borderRadius: '4px'
                              }}></iframe>
                            </div>
                          </div>
                        </div>

                        {
                          pages.map((page, index) => (
                            <div className="tab-pane" id={`page-${page.id}`} data-id={page.id} key={index}>
                              <div className="row">
                                <div className="col-md-4" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                                  <BasicEditing4System {...page} models={models} setPages={setPages} onSEOClicked={onEditSEOClicked} onParamsClicked={onManageParamsClicked} />
                                  <hr className='my-2' />
                                  <div className='d-flex flex-column gap-2 components-container' data-page-id={page.id}>
                                    {
                                      SortByAfterField(systems).filter(x => x.page_id == page.id).map(system => {
                                        const component = components.find(x => x.id == system.component);
                                        return <Component
                                          key={system.id}
                                          className=''
                                          system={system}
                                          component={component}
                                          onComponentClicked={onComponentClicked}
                                          onDeleteClicked={onDeleteClicked}
                                          onEditDataClicked={onEditDataClicked}
                                        />
                                      })
                                    }
                                  </div>
                                </div>
                                <div className="col-md-8">
                                  <div className="input-group mb-2">
                                    <span className='input-group-text'>
                                      {page?.pseudo_path || page.path}
                                      {RouteParams(page?.path).length > 0 && '/'}
                                    </span>
                                    {
                                      RouteParams(page?.path).length > 0 &&
                                      <input type="text" className="form-control" placeholder="Parametros" data-page-path={page.pseudo_path} data-page-id={page.id} onChange={onPathChange} />
                                    }
                                  </div>
                                  <iframe id={`iframe-${page.id}`} src={page?.pseudo_path || page.path} data-path={page?.pseudo_path || page.path} className='w-100 h-100 border' style={{
                                    minHeight: 'calc(100vh - 302px)',
                                    borderRadius: '4px'
                                  }}></iframe>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          hasRemoteChanges &&
          <Tippy content={`Tienes ${commits} cambios sin sincronizar`}>
            <button className='btn btn-dark p-0 position-absolute rounded-pill' style={{
              right: '20px',
              bottom: '20px',
              height: '40px',
              width: '40px'
            }} onClick={() => $(modalGitHubRef.current).modal('show')}>
              <small className='position-absolute' style={{
                backgroundColor: '#ff5b5b',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                top: '-5px',
                left: '-5px'
              }}>{commits}</small>
              <i className='mdi mdi-github mdi-24px'></i>
            </button>
          </Tippy>
        }
      </div>
      <Modal modalRef={modalGitHubRef} title='Cambios de Github' size='sm' hideFooter>
        <div className="text-center">
          <i className='mdi mdi-github mdi-48px'></i>
          <h5 className='mt-2'>Tienes cambios sin sincronizar</h5>
          <div className='mb-2 py-2'>
            <b className='d-block'>{gitAuthor}</b>
            <small className='d-block text-muted'>{moment(gitDate).fromNow()}</small>
            <span className='d-block'>Commit: {gitMessage}</span>
          </div>
          <button
            className='btn btn-primary mb-2'
            type='button'
            onClick={() => fetchRemoteChanges()}
            disabled={fetchingChanges}>
            {
              fetchingChanges
                ? <>
                  <i className='mdi mdi-loading mdi-spin me-1'></i>
                  Sincronizando
                </>
                : <>
                  <i className='mdi mdi-cloud-download me-1'></i>
                  Sincronizar
                </>
            }
          </button>
        </div>
      </Modal>
      <RigthBar colors={colors} setColors={setColors} settings={settings} setSettings={setSettings} />

      <SEOModal dataLoaded={pageLoaded} setDataLoaded={setPageLoaded} modalRef={modalSEORef} />
      <ParamsModal dataLoaded={pageLoaded} setDataLoaded={setPageLoaded} setPages={setPages} modalRef={modalParamsRef} models={models} />
      <DataModal dataLoaded={systemLoaded} setDataLoaded={setSystemLoaded} setSystems={setSystems} modalRef={dataModalRef} />
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<System {...properties} />);
})