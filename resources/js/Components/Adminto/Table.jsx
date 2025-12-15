import React from 'react'
import DataGrid from './DataGrid'

const Table = ({ title, gridRef, pageSize, rest, columns, toolBar, masterDetail, filterValue = [], onRefresh, exportable, exportableName, customizeCell = () => { }, rowDragging, sorting, withRelations }) => {
  return (<div className="row">
    <div className="col-12">
      <div className="card">
        {
          typeof title == 'object'
            ? <div className='card-header'>{title}</div>
            : ''
        }
        <div className="card-body">
          {
            typeof title != 'object'
              ? <h4 className="header-title">
                <div id="header-title-options" className="float-end"></div>
                <span id="header-title-prefix"></span> Lista de {title} <span id="header-title-suffix"></span>
              </h4>
              : ''
          }
          <DataGrid gridRef={gridRef} rest={rest} pageSize={pageSize} columns={columns.filter(Boolean)} toolBar={toolBar} masterDetail={masterDetail} filterValue={filterValue} onRefresh={onRefresh} exportable={exportable} exportableName={exportableName} customizeCell={customizeCell} rowDragging={rowDragging} sorting={sorting} withRelations={withRelations}/>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Table