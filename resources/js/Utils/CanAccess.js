import menus from '../../json/menus.json'

const CanAccess = {}

for (const container of menus) {
  for (const menu of container.items) {
    if (menu.href) CanAccess[menu.href] = true
    if (menu.children) {
      for (const submenu of menu.children) {
        CanAccess[submenu.href] = true
      }
    }
  }
}

export default CanAccess