import Tippy from "@tippyjs/react";
import React from "react";
import "tippy.js/dist/tippy.css";
import Logout from "../../Actions/Logout";
import MenuItem from "../MenuItem";
import MenuItemContainer from "../MenuItemContainer";
import menus from '../../../json/menus.json'
import CanAccess from "../../Utils/CanAccess";

const Menu = ({ session, hasRole }) => {
  const mainRole = session.roles[0];

  return (
    <div className="left-side-menu">
      <div className="h-100" data-simplebar>
        <div className="user-box text-center">
          <img
            src={`/api/profile/thumbnail/${session.uuid}?v=${new Date(session.updated_at).getTime()}`}
            alt={session.name}
            title={session.name}
            className="rounded-circle img-thumbnail avatar-md"
            style={{
              backgroundColor: "unset",
              borderColor: "#98a6ad",
              objectFit: "cover",
              objectPosition: "center",
            }}
            onError={(e) =>
              (e.target.src = `https://ui-avatars.com/api/?name=${session.name}+${session.lastname}&color=7F9CF5&background=EBF4FF`)
            }
          />
          <div className="dropdown">
            <a href="#"
              className="user-name dropdown-toggle h5 mt-2 mb-1 d-block"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              {session.name.split(" ")[0]}{" "}
              {session.lastname.split(" ")[0]}
            </a>
            <div className="dropdown-menu user-pro-dropdown">
              <a href="/profile"
                className="dropdown-item notify-item">
                <i className="fe-user me-1"></i>
                <span>Mi perfil</span>
              </a>

              <a href="/account"
                className="dropdown-item notify-item">
                <i className="mdi mdi-account-key-outline me-1"></i>
                <span>Mi cuenta</span>
              </a>

              <a href="#"
                className="dropdown-item notify-item right-bar-toggle dropdown notification-list">
                <i className="fe-settings me-1"></i>
                <span>Configuracion</span>
              </a>

              <a href="#"
                className="dropdown-item notify-item"
                onClick={Logout}>
                <i className="fe-log-out me-1"></i>
                <span>Cerrar sesion</span>
              </a>
            </div>
          </div>

          {/* <Tippy content={mainRole.description} arrow={true}> */}
          <p className="text-muted left-user-info">{mainRole.name}</p>
          {/* </Tippy> */}

          <ul className="list-inline">
            <li className="list-inline-item">
              <Tippy content="Configuracion">
                <a href="#"
                  className="text-muted left-user-info right-bar-toggle dropdown notification-list">
                  <i className="mdi mdi-cog"></i>
                </a>
              </Tippy>
            </li>

            <li className="list-inline-item">
              <Tippy content="Cerrar sesion">
                <a href="#"
                  className="text-danger"
                  onClick={Logout}>
                  <i className="mdi mdi-power"></i>
                </a>
              </Tippy>
            </li>
          </ul>
        </div>
        {hasRole("Admin", "Root") && (
          <div id="sidebar-menu" className="show">
            <ul id="side-menu">
              {hasRole("Admin", "Root") && (
                <>
                  {/* <MenuItem href="/admin/home" icon="mdi mdi-home">Dashboard</MenuItem>
                  <MenuItem href="/admin/sales" icon="mdi mdi-cart-outline">Pedidos</MenuItem>
                  <MenuItem href="/admin/items" icon="mdi mdi-bookshelf">Items</MenuItem>

                  <MenuItem href="/admin/combos" icon="mdi mdi-package-variant-closed">
                    Combos
                  </MenuItem>

                  <MenuItem href="/admin/coupons" icon="mdi mdi-brightness-percent">
                    Cupones
                  </MenuItem>
                  <MenuItem href="/admin/discount-rules" icon="mdi mdi-pencil-ruler">
                    Reglas de Descuento
                  </MenuItem>


                  <MenuItemContainer title="Características" icon="mdi mdi-view-dashboard">
                    <MenuItem href="/admin/collections" icon="mdi mdi-view-carousel-outline">Colecciones</MenuItem>
                    <MenuItem href="/admin/categories" icon="mdi mdi-shape-outline">Categorías</MenuItem>
                    <MenuItem href="/admin/subcategories" icon="mdi mdi-file-tree">SubCategorías</MenuItem>
                    <MenuItem href="/admin/brands" icon="mdi mdi-label">Marcas</MenuItem>
                    <MenuItem href="/admin/tags" icon="mdi mdi-label-multiple">Etiquetas</MenuItem>
                  </MenuItemContainer>
                  <MenuItem href="/admin/stores" icon="mdi mdi-office-building-marker">Sucursales</MenuItem>
                  <MenuItem href="/admin/prices" icon="mdi mdi-moped">Costos de envío</MenuItem>
                  <MenuItem href="/admin/messages" icon="mdi mdi-message-text">Mensajes</MenuItem>
                  <MenuItem href="/admin/subscriptions" icon="mdi mdi-email-multiple">Suscripciones</MenuItem>

                  <li className="menu-title">Landing Page</li>
                  <MenuItem href="/admin/ads" icon='mdi mdi-google-ads'>Pop-ups</MenuItem>
                  <MenuItem href="/admin/posts" icon="mdi mdi-post">Posts</MenuItem>
                  <MenuItem href="/admin/about" icon="mdi mdi-briefcase">Nosotros</MenuItem>
                  <MenuItem href="/admin/delivery-zones" icon="mdi mdi-map-marker-radius">Zonas de Cobertura</MenuItem>
                  <MenuItem href="/admin/indicators" icon="mdi mdi-dots-grid">Indicadores</MenuItem>
                  <MenuItem href="/admin/certifications" icon="mdi mdi-certificate">Certificaciones</MenuItem>
                  <MenuItem href="/admin/partners" icon="mdi mdi-charity">Aliados</MenuItem>
                  <MenuItem href="/admin/strengths" icon="mdi mdi-arm-flex">Fortalezas</MenuItem>
                  <MenuItem href="/admin/banners" icon="mdi mdi-post-outline">Banners</MenuItem>
                  <MenuItem href="/admin/sliders" icon="mdi mdi-page-layout-body">Sliders</MenuItem>
                  <MenuItem href="/admin/faqs" icon="mdi mdi-comment-account">Preguntas Frecuentes</MenuItem>
                  <MenuItem href="/admin/testimonies" icon="mdi mdi-forum">Testimonios</MenuItem>
                  <MenuItem href="/admin/socials" icon="mdi mdi-web">Redes Sociales</MenuItem>
                  <MenuItem href="/admin/statuses" icon="mdi mdi-bell-circle">Estados de ventas</MenuItem>

                  <li className="menu-title">Recursos</li>
                  <MenuItem href="/admin/gallery" icon="mdi mdi-image-multiple">Galeria</MenuItem>
                  <MenuItem href="/admin/repository" icon="mdi mdi-database">Repositorio</MenuItem>

                  <li className="menu-title">Configuraciones</li>
                  <MenuItemContainer title="Usuarios" icon="mdi mdi-account-multiple">
                    <MenuItem href="/admin/users" icon="mdi mdi-account-box-multiple">Sistema</MenuItem>
                    <MenuItem href="/admin/clients" icon="mdi mdi-account-group">Clientes</MenuItem>
                  </MenuItemContainer>
                  {hasRole("Root") && <MenuItem href="/admin/menus" icon="mdi mdi-menu">
                    Menus
                    <i className="mdi mdi-security ms-1 text-danger"></i>
                  </MenuItem>}
                  {hasRole("Root") && (
                    <MenuItem href="/admin/system" icon="mdi mdi-cog" target="_blank">
                      Configuraciones
                      <i className="mdi mdi-arrow-top-right ms-1"></i>
                    </MenuItem>
                  )}
                  <MenuItem href="/admin/generals" icon="mdi mdi-credit-card-settings">Datos Generales</MenuItem>
                  <MenuItem href="/admin/profile" icon="mdi mdi-account-box">Mi perfil</MenuItem>
                  <MenuItem href="/admin/account" icon="mdi mdi-account-key">Mi cuenta</MenuItem> */}

                  {menus.map((section) => {
                    const sectionKey = section.id || section.title || JSON.stringify(section);
                    return (
                      <React.Fragment key={sectionKey}>
                        <li className="menu-title">{section.title}</li>
                        {section.items.map((item) => {
                          const itemKey = item.id || item.href || `${sectionKey}-${item.label}`;

                          if (item.children) {
                            return (
                              <MenuItemContainer
                                key={itemKey}
                                title={item.label}
                                icon={item.icon}
                              >
                                {item.children
                                  .filter((child) => CanAccess[child.href])
                                  .map((child) => (
                                    <MenuItem
                                      key={child.id || child.href || `${itemKey}-${child.label}`}
                                      href={child.href}
                                      icon={child.icon}
                                    >
                                      {child.label}
                                    </MenuItem>
                                  ))}
                              </MenuItemContainer>
                            );
                          }

                          if (item.role) {
                            if (!hasRole(item.role) || !CanAccess[item.href]) {
                              return null;
                            }

                            return (
                              <MenuItem
                                key={itemKey}
                                href={item.href}
                                icon={item.icon}
                                target={item.target}
                              >
                                {item.label}
                                {item.target && (
                                  <i className="mdi mdi-arrow-top-right ms-1"></i>
                                )}
                              </MenuItem>
                            );
                          }

                          if (!CanAccess[item.href]) {
                            return null;
                          }

                          return (
                            <MenuItem key={itemKey} href={item.href} icon={item.icon}>
                              {item.label}
                            </MenuItem>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </ul>
          </div>
        )}
        {hasRole("Customer") && (
          <div id="sidebar-menu" className="show">
            <ul id="side-menu">
              <li className="menu-title">Panel del Cliente</li>

              {hasRole("Customer") && (
                <>
                  <MenuItem href="/customer/orders" icon="mdi mdi-cart-outline">
                    Mis Pedidos</MenuItem>
                </>
              )}
            </ul>
          </div>
        )}

        <div className="clearfix"></div>
      </div>
    </div>
  );
};

export default Menu;
