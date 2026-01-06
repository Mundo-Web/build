import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import BaseAdminto from '../Components/Adminto/Base';
import menus from '../../json/menus.json'
import { useState } from 'react';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import RoleHasMenusRest from '../Actions/Admin/RoleHasMenusRest';

const roleHasMenusRest = new RoleHasMenusRest()

const Item = ({ id, href, role, icon, label, menusAdmin, setMenusAdmin }) => {
  const [saving, setSaving] = useState(false)
  const menuKey = id || href
  const active = menusAdmin.find(menu => menu.menu == menuKey)?.can_access !== false

  const handleChange = async (e) => {
    setSaving(true)
    const result = await roleHasMenusRest.save({
      menu: e.target.value,
      can_access: e.target.checked
    })
    setSaving(false)

    const menuIndex = menusAdmin.findIndex(menu => menu.menu === result.menu);
    if (menuIndex >= 0) {
      const updatedMenus = [...menusAdmin];
      updatedMenus[menuIndex] = result;
      setMenusAdmin(updatedMenus);
    } else {
      setMenusAdmin([...menusAdmin, result]);
    }
  }

  return <div className='form-check mb-0'>
    <input
      className="form-check-input"
      type="checkbox"
      id={`chk-${menuKey.replaceAll('/', '').trim().replaceAll('-', '_')}`}
      value={menuKey}
      disabled={role == 'Root' || saving}
      checked={active && role != 'Root'}
      onChange={handleChange}
    />
    <label
      className="form-check-label"
      htmlFor={`chk-${menuKey.replaceAll('/', '').trim().replaceAll('-', '_')}`}
    >
      <i className={`${icon} me-1`}></i>
      {label}
    </label>
  </div>
}

const Menus = ({ menus: menusAdminDB }) => {
  const [menusAdmin, setMenusAdmin] = useState(menusAdminDB)

  return <div className="row" style={{ height: 'max-content' }}>
    {menus.map((section, i) => (
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8 col-xs-12" key={i}>
        <div className="card  shadow-sm">
          <div className="card-header bg-primary text-white fw-bold">
            {section.title}
          </div>
          <div className="card-body">
            <div className='d-flex flex-column gap-2'>
              {section.items.map((item, idx) => {
                if (item.children) return <div key={idx}>
                  <div className="fw-semibold mb-1">
                    <i className={`${item.icon} me-1`}></i> {item.label}
                  </div>
                  <div className="ms-3 d-flex flex-column gap-1">
                    {item.children.map((child, childIdx) => {
                      const childKey = child.id || child.href || `${idx}-${childIdx}`;
                      return <Item key={childKey} {...child} menusAdmin={menusAdmin} setMenusAdmin={setMenusAdmin} noMargin />
                    })}
                  </div>
                </div>
                const itemKey = item.id || item.href || `item-${idx}`;
                return <Item key={itemKey} {...item} menusAdmin={menusAdmin} setMenusAdmin={setMenusAdmin} />

              })}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Menus del Admin">
      <Menus {...properties} />
    </BaseAdminto>
  );
});