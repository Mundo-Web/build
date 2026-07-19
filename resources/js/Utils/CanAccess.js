import menus from '../../json/menus.json'
import menusSeller from '../../json/menus_seller.json'
import menusProvider from '../../json/menus_provider.json'
import menusCustomer from '../../json/menus_customer.json'

const CanAccess = {}

const loadMenus = (menuList) => {
  for (const container of menuList) {
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
}

loadMenus(menus)
loadMenus(menusSeller)
loadMenus(menusProvider)
loadMenus(menusCustomer)

export default CanAccess