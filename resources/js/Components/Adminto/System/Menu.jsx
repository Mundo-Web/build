import React, { useState } from "react"
import MenuItemContainer from "../../MenuItemContainer";
import MenuItem from "../../MenuItem";
import SystemRest from "../../../Actions/Admin/SystemRest";

const systemRest = new SystemRest();

const Menu = ({ components, onClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = components
    .filter(component => component.options.length > 0)
    .filter(component => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        component.name.toLowerCase().includes(searchLower) ||
        component.options.some(option => 
          option.name.toLowerCase().includes(searchLower)
        )
      );
    });
  return <div className="left-side-menu top-0 pt-2">
    <div data-simplebar className='h-100'>
      <div id="sidebar-menu" className='show'>
        <ul id="side-menu">
          <li className="menu-title">Lista de componentes</li>
          <li className="px-3 py-2">
            <div className="position-relative">
              <input 
                type="text" 
                className="form-control form-control-sm" 
                placeholder="Buscar componentes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: '#ffffff',
                
                  color: '#8391a2',
                  paddingLeft: '35px'
                }}
              />
              <i className="mdi mdi-magnify position-absolute" style={{
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8391a2',
                fontSize: '16px'
              }}></i>
            </div>
          </li>
          {
            filteredComponents.map((component, index) => (
                <MenuItemContainer title={component.name} key={index} icon={component.icon}>
                  {
                    component.options.map((option, index) => (
                      <MenuItem key={index} name={option.name} icon={option.icon} onClick={() => {
                        const after_component = $('.tab-pane:visible .components-container > div').last().data('id');
                        onClick({
                          name: `${component.name} - ${option.name}`,
                          component: component.id,
                          value: option.id,
                          after_component
                        })
                      }}>{option.name}</MenuItem>
                    ))
                  }
                </MenuItemContainer>
              ))
            }
          {
            filteredComponents.length === 0 && searchTerm && (
              <li className="px-3 py-2">
                <small className="text-muted">No se encontraron componentes</small>
              </li>
            )
          }          <li className="menu-title">Sistema de respaldo</li>
          <MenuItem icon='mdi mdi-cogs' rightBarToggle>Configuraciones</MenuItem>
          <MenuItem icon='mdi mdi-cloud-download' onClick={async () => {
            const backup = await systemRest.exportBK();
            const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}>Exportar Backup</MenuItem>
          <input type="file" id="file-input" accept="application/json" style={{ display: 'none' }} onChange={async (event) => {
            const file = event.target.files[0];
            event.target.value = null
            if (file) {
              const formData = new FormData()
              formData.append('backup', file)
              const result = await systemRest.importBK(formData)
              if (!result) return
              location.reload()
            }
          }} />
          <MenuItem icon='mdi mdi-backup-restore' onClick={() => {
            document.getElementById('file-input').click();
          }}>Importar Backup</MenuItem>
        </ul>
      </div>
      <div className="clearfix"></div>
    </div>
  </div>
}

export default Menu