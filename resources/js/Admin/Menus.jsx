import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import BaseAdminto from '../Components/Adminto/Base';
import menusAdmin from '../../json/menus.json';
import menusSeller from '../../json/menus_seller.json';
import menusProvider from '../../json/menus_provider.json';
import menusCustomer from '../../json/menus_customer.json';
import { useState } from 'react';
import RoleHasMenusRest from '../Actions/Admin/RoleHasMenusRest';

const roleHasMenusRest = new RoleHasMenusRest();

const menuStructures = {
  'Admin': menusAdmin,
  'Customer': menusCustomer,
  'Seller': menusSeller,
  'Provider': menusProvider
};

const Item = ({ id, href, roleId, icon, label, menusAdmin, setMenusAdmin }) => {
  const [saving, setSaving] = useState(false);
  const menuKey = id || href;
  
  // Find permission row in db records
  const config = menusAdmin.find(menu => menu.role_id == roleId && menu.menu == menuKey);
  const active = config ? config.can_access !== false : true;

  const handleChange = async (e) => {
    setSaving(true);
    const result = await roleHasMenusRest.save({
      role_id: roleId,
      menu: e.target.value,
      can_access: e.target.checked
    });
    setSaving(false);

    if (result) {
      const menuIndex = menusAdmin.findIndex(menu => menu.role_id == roleId && menu.menu === result.menu);
      if (menuIndex >= 0) {
        const updatedMenus = [...menusAdmin];
        updatedMenus[menuIndex] = result;
        setMenusAdmin(updatedMenus);
      } else {
        setMenusAdmin([...menusAdmin, result]);
      }
    }
  };

  const inputId = `chk-${roleId}-${menuKey.replace(/\//g, '').replace(/-/g, '_').trim()}`;

  return (
    <div className="form-check mb-0">
      <input
        className="form-check-input"
        type="checkbox"
        id={inputId}
        value={menuKey}
        disabled={saving}
        checked={active}
        onChange={handleChange}
      />
      <label
        className="form-check-label text-dark fw-medium"
        htmlFor={inputId}
        style={{ cursor: 'pointer', fontSize: '13px' }}
      >
        <i className={`${icon || 'mdi mdi-circle-small'} me-1 text-primary`}></i>
        {label}
      </label>
    </div>
  );
};

const Menus = ({ menus: initialMenus, roles = [] }) => {
  const [menusAdmin, setMenusAdmin] = useState(initialMenus);
  
  // Select first role by default (usually Admin)
  const [selectedRole, setSelectedRole] = useState(roles[0] || null);

  const activeStructure = selectedRole ? menuStructures[selectedRole.name] || [] : [];

  return (
    <div className="container-fluid px-0">
      {/* Selector de Roles Premium */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <label className="form-label fw-bold text-muted mb-2 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                Selecciona el Rol a Configurar:
              </label>
              <div className="d-flex flex-wrap gap-2">
                {roles.map((role) => {
                  const isSelected = selectedRole?.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={`btn rounded-pill px-4 py-2 transition-all d-flex align-items-center gap-2 ${
                        isSelected 
                          ? 'btn-primary shadow-sm fw-bold' 
                          : 'btn-light border text-dark fw-medium'
                      }`}
                      style={{ fontSize: '13px' }}
                    >
                      <i className={`mdi ${
                        role.name === 'Admin' ? 'mdi-shield-account' :
                        role.name === 'Seller' ? 'mdi-account-tie' :
                        role.name === 'Provider' ? 'mdi-account-cog' : 'mdi-account'
                      } fs-5`}></i>
                      {role.name === 'Admin' ? 'Administrador' :
                       role.name === 'Seller' ? 'Vendedor' :
                       role.name === 'Provider' ? 'Proveedor' : 'Cliente'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Menús correspondientes al Rol */}
      {selectedRole && activeStructure.length > 0 ? (
        <div className="row g-3">
          {activeStructure.map((section, i) => (
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={i}>
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-primary text-white fw-bold py-2 px-3 d-flex align-items-center justify-content-between">
                  <span style={{ fontSize: '14px', fontFamily: "'Outfit', sans-serif" }}>
                    {section.title}
                  </span>
                  <i className="mdi mdi-menu-open fs-5 opacity-75"></i>
                </div>
                <div className="card-body p-3">
                  <div className="d-flex flex-column gap-2">
                    {section.items.map((item, idx) => {
                      if (item.children) {
                        return (
                          <div key={idx} className="mb-2">
                            <div className="fw-semibold text-muted mb-2 pb-1 border-bottom" style={{ fontSize: '12px' }}>
                              <i className={`${item.icon || 'mdi mdi-chevron-right'} me-1`}></i> 
                              {item.label}
                            </div>
                            <div className="ms-2 d-flex flex-column gap-2 ps-2 border-start">
                              {item.children.map((child, childIdx) => {
                                const childKey = child.id || child.href || `${idx}-${childIdx}`;
                                return (
                                  <Item
                                    key={childKey}
                                    {...child}
                                    roleId={selectedRole.id}
                                    menusAdmin={menusAdmin}
                                    setMenusAdmin={setMenusAdmin}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      const itemKey = item.id || item.href || `item-${idx}`;
                      return (
                        <Item
                          key={itemKey}
                          {...item}
                          roleId={selectedRole.id}
                          menusAdmin={menusAdmin}
                          setMenusAdmin={setMenusAdmin}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row py-5 justify-content-center">
          <div className="col-md-6 text-center">
            <div className="p-5 bg-white shadow-sm rounded-3">
              <i className="mdi mdi-menu-off mdi-48px text-muted mb-2"></i>
              <h5 className="fw-bold">Sin Estructura</h5>
              <p className="text-muted mb-0">No se ha cargado una estructura de menú válida para este rol.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Menus del Sistema">
      <Menus {...properties} />
    </BaseAdminto>
  );
});