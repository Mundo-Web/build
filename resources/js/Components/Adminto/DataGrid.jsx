import React, { useEffect, useRef, useState } from 'react'
import Fillable from '../../Utils/Fillable';
import { hasRole } from '../../Utils/CreateReactScript';
import Modal from './Modal';
import FillableRest from '../../Actions/Admin/FillableRest';
import { Toaster } from 'sonner';

const fillableRest = new FillableRest()

const DataGrid = ({ gridRef: dataGridRef, pageSize = 10, rest, columns, toolBar, masterDetail, filterValue, exportable, exportableName, customizeCell = () => { }, onRefresh = () => { }, rowDragging, sorting }) => {
  const modalRef = useRef()
  const [saving, setSaving] = useState(false)
  const [activeModel, setActiveModel] = useState(Fillable.models[0] ?? null)

  const onModalSubmit = async (e) => {
    e.preventDefault();

    // Get checkboxes only for the active model
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][id^="fillable-ck-${activeModel}"]`);
    const fillableData = Array.from(checkboxes).reduce((acc, checkbox) => {
      acc[checkbox.value] = checkbox.checked;
      return acc;
    }, {});

    setSaving(true)
    const result = await fillableRest.save(activeModel, fillableData);
    setSaving(false)
    if (!result) return
    Fillable.set(activeModel, result)
  }

  useEffect(() => {
    DevExpress.localization.locale(navigator.language);
    $(dataGridRef.current).dxDataGrid({
      language: "es",
      dataSource: {
        load: async (params) => {
          const data = await rest.paginate({
            ...params,
            requireTotalCount: true,
            // _token: $('[name="csrf_token"]').attr('content')
          })
          onRefresh(data)
          return data
        },
      },
      onToolbarPreparing: (e) => {
        const { items } = e.toolbarOptions;
        hasRole('Root') && Fillable.models.length > 0 && items.unshift({
          widget: 'dxButton',
          location: 'before',
          options: {
            icon: 'mdi mdi-cog',
            hint: 'Configurar campos',
            text: 'Configurar',
            onClick: () => $(modalRef.current).modal('show')
          }
        });
        toolBar(items)
      },
      remoteOperations: true,
      columnResizingMode: "widget",
      allowColumnResizing: true,
      allowColumnReordering: true,
      columnAutoWidth: true,
      scrollbars: 'auto',
      filterPanel: { visible: true },
      searchPanel: { visible: true },
      headerFilter: { visible: true, search: { enabled: true } },
      height: 'calc(100vh - 185px)',
      filterValue,
      export: {
        enabled: exportable
      },
      onExporting: function (e) {
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet('Main sheet');
        DevExpress.excelExporter.exportDataGrid({
          worksheet: worksheet,
          component: e.component,
          customizeCell: function (options) {
            customizeCell(options)
            options.excelCell.alignment = {
              horizontal: 'left',
              vertical: 'top',
              ...options.excelCell.alignment
            };
          },
          includeHiddenColumns: true
        }).then(function () {
          workbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${exportableName}.xlsx`);
          });
        });
      },
      rowAlternationEnabled: true,
      showBorders: true,
      filterRow: {
        visible: true,
        applyFilter: "auto"
      },
      filterBuilderPopup: {
        visible: false,
        position: {
          of: window, at: 'top', my: 'top', offset: { y: 10 },
        },
      },
      paging: {
        pageSize,
      },
      pager: {
        visible: true,
        allowedPageSizes: [5, 10, 25, 50, 100],
        showPageSizeSelector: true,
        showInfo: true,
        showNavigationButtons: true,
      },
      allowFiltering: true,
      scrolling: {
        mode: 'standard',
        useNative: true,
        preloadEnabled: true,
        rowRenderingMode: 'standard'
      },
      columnChooser: {
        title: 'Mostrar/Ocultar columnas',
        enabled: true,
        mode: 'select',
        search: { enabled: true }
      },
      columns,
      masterDetail,
      rowDragging,
      sorting,
      onContentReady: (...props) => {
        tippy('.tippy-here', { arrow: true, animation: 'scale' })
      }
      // onColumnsChanging: () => {
      //   const dataGrid = $(dataGridRef.current).dxDataGrid('instance')
      //   const state = dataGrid.state()

      //   if (Object.keys(state) == 0) return

      //   const path = location.pathname
      //   const dxSettings = Local.get('dxSettings') || {}
      //   if (JSON.stringify(dxSettings[path]) == JSON.stringify(state)) return

      //   dxSettings[path] = {}
      //   dxSettings[path].columns = state.columns
      //   dxSettings[path].masterDetail = state.masterDetail

      //   Local.set('dxSettings', dxSettings)
      // }
    }).dxDataGrid('instance')

    tippy('.dx-button', { arrow: true })

    // const dxSettings = Local.get('dxSettings') || {}
    // if (dxSettings[location.pathname]) {
    //   $(dataGridRef.current).dxDataGrid('instance').state(dxSettings[location.pathname])
    // }
  }, [null])

  return (<>
    <Toaster />
    <div ref={dataGridRef}></div>
    <Modal modalRef={modalRef} title='Configurar campos visibles' onSubmit={onModalSubmit}
      onClose={() => {
        Fillable.models.forEach(model => {
          Object.keys(Fillable.values[model]).forEach(key => {
            const checkbox = document.getElementById(`fillable-ck-${model}-${key}`);
            if (checkbox) {
              checkbox.checked = Fillable.values[model][key];
            }
          });
        });
      }}
      loading={saving}>
      <ul class="nav nav-tabs nav-bordered">
        {
          Fillable.models.map((model, index) => <li key={index} class="nav-item">
            <button href={`#fillable-${model}`} data-bs-toggle="tab" aria-expanded="false" class={`nav-link ${activeModel == model && 'active'}`} onClick={() => setActiveModel(model)} disabled={saving} type='button'>{model}</button>
          </li>)
        }
      </ul>
      <div class="tab-content" style={{ minHeight: '240px' }}>
        {
          Fillable.models.map((model, index) => <div key={index} class={`tab-pane ${activeModel == model && 'active'}`} id={`fillable-${model}`}>
            <div className='d-flex flex-wrap' style={{ gap: '6px' }}>
              {
                Object.keys(Fillable.values[model]).map((key, index) => {
                  return <label key={index} class="form-check form-check-success border cursor-pointer" htmlFor={`fillable-ck-${model}-${key}`} style={{
                    padding: '2px 10px 2px 30px',
                    borderRadius: '8px',
                    userSelect: 'none'
                  }}>
                    <input class="form-check-input cursor-pointer" type="checkbox" value={key} id={`fillable-ck-${model}-${key}`} defaultChecked={Fillable.values[model][key]} />
                    <span class="form-check-label">{key}</span>
                  </label>
                })
              }
            </div>
          </div>)
        }
      </div>
    </Modal>
  </>)
}

export default DataGrid