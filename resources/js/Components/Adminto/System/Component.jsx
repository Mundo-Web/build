import React from 'react';

const Component = ({ className, system, component, onComponentClicked, onDeleteClicked, onEditDataClicked }) => {
  const options = component?.options ?? [];
  const selected = options.find(x => x.id == system.value);
  return <div className={`dropdown ${className}`} data-id={system.id}>
    <div className="btn btn-light dropdown-toggle text-truncate w-100 text-start" type="button" id={`dd-${system.id}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true" data-bs-boundary="viewport">
      <i className="mdi mdi-chevron-down ms-1 float-end"></i>
      <span className='handle-sortable' style={{ cursor: "move" }}>
        <i className="fa fa-ellipsis-v"></i>
        <i className="fa fa-ellipsis-v"></i>
      </span>
      <span className='ms-1'>{system.name}</span>
    </div>
    <div className="dropdown-menu" aria-labelledby={`dd-${system.id}`} data-popper-placement="bottom-start" data-simplebar style={{
      maxHeight: '300px',
      width: '100%'
    }}>
      {
        options.length > 1 &&
        <>
          {
            options.filter(x => x.id != system.value).map((option, index) => (
              <button key={index} className='dropdown-item' onClick={() => onComponentClicked({
                ...system,
                name: `${component.name} - ${option.name}`,
                value: option.id
              })}>
                {component.name} - {option.name}
              </button>
            ))
          }
          <div className="dropdown-divider"></div>
        </>
      }
      {
        (selected?.using?.filters || selected?.data) &&
        <button className="dropdown-item" onClick={() => onEditDataClicked(system, selected)}>
          <i className="mdi mdi-pencil me-1"></i>
          Configurar datos
        </button>
      }
      <button className="dropdown-item" onClick={() => onDeleteClicked(system)}>
        <i className="mdi mdi-trash-can-outline me-1"></i>
        Eliminar
      </button>
    </div>
  </div>
};

export default Component;
