// Configuración de las cards del dashboard para el sistema de visibilidad
// Este archivo define todas las cards disponibles en el dashboard y sus identificadores únicos

const DASHBOARD_CARDS = {
  // KPI Cards
  'total_orders': {
    id: 'total_orders',
    name: 'Total de Órdenes',
    description: 'Muestra el total de órdenes del sistema',
    category: 'kpi',
    defaultVisible: true
  },
  'total_revenue': {
    id: 'total_revenue',
    name: 'Ingresos Totales',
    description: 'Muestra los ingresos totales generados',
    category: 'kpi',
    defaultVisible: true
  },
  'new_users': {
    id: 'new_users',
    name: 'Nuevos Usuarios',
    description: 'Muestra la cantidad de nuevos usuarios registrados',
    category: 'kpi',
    defaultVisible: true
  },
  'customer_satisfaction': {
    id: 'customer_satisfaction',
    name: 'Satisfacción del Cliente',
    description: 'Muestra el nivel de satisfacción de los clientes',
    category: 'kpi',
    defaultVisible: true
  },

  // Chart Cards
  'statistics_chart': {
    id: 'statistics_chart',
    name: 'Estadísticas de Ventas',
    description: 'Gráfico de estadísticas de ventas con selector de fechas',
    category: 'charts',
    defaultVisible: true
  },
  'orders_statistics': {
    id: 'orders_statistics',
    name: 'Estadísticas de Órdenes',
    description: 'Gráfico circular de estadísticas de órdenes por estado',
    category: 'charts',
    defaultVisible: true
  },
  'sales_by_location': {
    id: 'sales_by_location',
    name: 'Ventas por Ubicación (TreeMap)',
    description: 'Mapa de árbol mostrando ventas por ubicación geográfica',
    category: 'charts',
    defaultVisible: true
  },

  // Table Cards
  'top_selling_products': {
    id: 'top_selling_products',
    name: 'Productos Más Vendidos',
    description: 'Tabla con los productos que más se han vendido',
    category: 'tables',
    defaultVisible: true
  },
  'new_featured_products': {
    id: 'new_featured_products',
    name: 'Nuevos Productos Destacados',
    description: 'Tabla con los productos nuevos y destacados',
    category: 'tables',
    defaultVisible: true
  },
  'most_used_coupons': {
    id: 'most_used_coupons',
    name: 'Cupones Más Utilizados',
    description: 'Tabla con los cupones de descuento más utilizados',
    category: 'tables',
    defaultVisible: true
  },
  'most_used_discount_rules': {
    id: 'most_used_discount_rules',
    name: 'Reglas de Descuento Más Utilizadas',
    description: 'Tabla con las reglas de descuento más aplicadas',
    category: 'tables',
    defaultVisible: true
  },
  'brands_listing': {
    id: 'brands_listing',
    name: 'Listado de Marcas',
    description: 'Tabla con el listado de marcas disponibles',
    category: 'tables',
    defaultVisible: true
  },
  'top_clients': {
    id: 'top_clients',
    name: 'Mejores Clientes',
    description: 'Tabla con los clientes que más compras han realizado',
    category: 'tables',
    defaultVisible: true
  }
};

// Categorías de cards para organización en el modal
const CARD_CATEGORIES = {
  'kpi': {
    name: 'Indicadores KPI',
    description: 'Métricas principales del negocio',
    icon: 'fas fa-chart-line'
  },
  'charts': {
    name: 'Gráficos y Estadísticas',
    description: 'Visualizaciones de datos y tendencias',
    icon: 'fas fa-chart-pie'
  },
  'tables': {
    name: 'Tablas de Datos',
    description: 'Listados detallados de información',
    icon: 'fas fa-table'
  }
};

// Configuración por defecto para nuevas instalaciones
const DEFAULT_VISIBILITY_CONFIG = Object.keys(DASHBOARD_CARDS).reduce((config, cardId) => {
  config[cardId] = DASHBOARD_CARDS[cardId].defaultVisible;
  return config;
}, {});

export { DASHBOARD_CARDS, CARD_CATEGORIES, DEFAULT_VISIBILITY_CONFIG };