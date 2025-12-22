import menus from '../../json/menus.json'

const CanAccess = {}

for (const container of menus) {
  for (const menu of container.items) {
    const menuKey = menu.id || menu.href
    if (menuKey) CanAccess[menuKey] = true
    if (menu.children) {
      for (const submenu of menu.children) {
        const submenuKey = submenu.id || submenu.href
        CanAccess[submenuKey] = true
      }
    }
  }
}

export default CanAccess