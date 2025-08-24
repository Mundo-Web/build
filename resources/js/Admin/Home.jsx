import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import BaseAdminto from '../Components/Adminto/Base';
import Chart from 'react-apexcharts';
import { Toaster, toast } from 'sonner';
import HomeRest from '../Actions/Admin/HomeRest';
import Tippy from '@tippyjs/react';

const homeRest = new HomeRest();

const Home = ({ session, totalProducts, totalStock, salesToday, salesMonth, salesYear, incomeToday, incomeMonth, incomeYear, topProducts, newFeatured, ordersByStatus, salesByLocation, topCoupons, topDiscountRules, brands, topClients, salesLast30Days, usersToday, usersMonth, usersYear, customerSatisfaction, dashboardVisibility, hasRootRole, mostViewedProducts, visitsThisMonth, categoriesWithProducts, brandsWithProducts, totalCategories, totalBrands, totalActiveProducts }) => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  
  // Estados para gestión de visibilidad de cards
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [cardVisibility, setCardVisibility] = useState(dashboardVisibility || {});
  const [savingVisibility, setSavingVisibility] = useState(false);
  
  // Inicializar estado de visibilidad
  useEffect(() => {
    if (dashboardVisibility) {
      setCardVisibility(dashboardVisibility);
    }
  }, [dashboardVisibility]);
  
  // Función para verificar si una card debe mostrarse
  const shouldShowCard = (cardId) => {
    // Si no hay configuración de visibilidad, mostrar por defecto
    if (!dashboardVisibility) {
      return true;
    }
    // Verificar la configuración de visibilidad para todos los usuarios
    return cardVisibility[cardId] !== false;
  };
  
  // Funciones para gestión de visibilidad de cards
  const handleToggleCardVisibility = (cardId) => {
    setCardVisibility(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  
  const handleSaveVisibility = async () => {
    setSavingVisibility(true);
    try {
      const response = await homeRest.updateDashboardVisibility(cardVisibility);
      
      if (response.success) {
        toast.success('Configuración de visibilidad actualizada correctamente');
        // Recargar la página para reflejar los cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
       // toast.error(response.message || 'Error al actualizar la configuración');
      }
    } catch (error) {
      console.error('Error updating dashboard visibility:', error);
      toast.error('Error al actualizar la configuración: ' + error.message);
    } finally {
      setSavingVisibility(false);
      setShowVisibilityModal(false);
    }
  };
  
  const formatIncome = (value) => {
    const numValue = Number(value) || 0;
    return numValue.toFixed(2);
  };
  
  // Configuración de cards del dashboard
  const DASHBOARD_CARDS = {
    'total_orders': { name: 'Total de Órdenes', category: 'KPI' },
    'total_revenue': { name: 'Ingresos Totales', category: 'KPI' },
    'new_users': { name: 'Nuevos Usuarios', category: 'KPI' },
    'customer_satisfaction': { name: 'Satisfacción del Cliente', category: 'KPI' },
    'total_categories': { name: 'Total Categorías', category: 'KPI' },
    'total_brands': { name: 'Total Marcas', category: 'KPI' },
    'total_products': { name: 'Total Productos', category: 'KPI' },
    'statistics_chart': { name: 'Estadísticas de Ventas', category: 'Gráficos' },
    'orders_statistics': { name: 'Estadísticas de Órdenes', category: 'Gráficos' },
    'sales_by_location': { name: 'Ventas por Ubicación', category: 'Gráficos' },
    'visits_chart': { name: 'Visitas del Mes', category: 'Gráficos' },
    'categories_chart': { name: 'Productos por Categoría', category: 'Gráficos' },
    'brands_chart': { name: 'Productos por Marca', category: 'Gráficos' },
    'top_selling_products': { name: 'Productos Más Vendidos', category: 'Tablas' },
    'most_viewed_products': { name: 'Productos Más Vistos', category: 'Tablas' },
    'new_featured_products': { name: 'Nuevos Productos Destacados', category: 'Tablas' },
    'most_used_coupons': { name: 'Cupones Más Utilizados', category: 'Tablas' },
    'most_used_discount_rules': { name: 'Reglas de Descuento Más Utilizadas', category: 'Tablas' },
    'brands_listing': { name: 'Listado de Marcas', category: 'Tablas' },
    'top_clients': { name: 'Mejores Clientes', category: 'Tablas' }
  };
  
  const CARD_CATEGORIES = {
    'KPI': { name: 'Indicadores KPI', icon: 'fas fa-chart-line' },
    'Gráficos': { name: 'Gráficos y Estadísticas', icon: 'fas fa-chart-pie' },
    'Tablas': { name: 'Tablas de Datos', icon: 'fas fa-table' }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      
      {/* Header con botón de configuración de visibilidad */}
      {hasRootRole && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Dashboard</h4>
            <p className="text-muted mb-0">Panel de control principal</p>
          </div>
          <Tippy content="Configurar visibilidad de cards">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowVisibilityModal(true)}
            >
              <i className="fas fa-eye me-1"></i>
              Configurar Visibilidad
            </button>
          </Tippy>
        </div>
      )}
      
      {/* KPIs Modernos */}
      <div className="row g-3 mb-4">
        {shouldShowCard('total_orders') && (
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold">Total Orders</span>
                <i className="fas fa-ellipsis-v text-muted small"></i>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, background: '#e0e7ff'}}>
                  <i className="fas fa-shopping-cart text-primary fs-4"></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold text-dark">{salesToday || '—'}</div>
                  <div className="text-muted small">{salesMonth || '—'} <span className="ms-1">Since last month</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('total_revenue') && (
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold">Total Revenue</span>
                <i className="fas fa-ellipsis-v text-muted small"></i>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, background: '#d1fae5'}}>
                  <i className="fas fa-dollar-sign text-success fs-4"></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold text-dark">S/ {formatIncome(incomeToday) || '—'}</div>
                  <div className="text-success small fw-semibold"><i className="fas fa-arrow-up me-1"></i>32% <span className="text-muted ms-1">Since last month</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('new_users') && (
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold">New Users</span>
                <i className="fas fa-ellipsis-v text-muted small"></i>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, background: '#fef9c3'}}>
                  <i className="fas fa-user-plus text-warning fs-4"></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold text-dark">{usersToday || '—'}</div>
                  <div className="text-muted small">{usersMonth || '—'} <span className="ms-1">Since last month</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('customer_satisfaction') && (
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold">Customer Satisfaction</span>
                <i className="fas fa-ellipsis-v text-muted small"></i>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, background: '#e0e7ff'}}>
                  <i className="fas fa-smile text-info fs-4"></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold text-dark">{customerSatisfaction || '—'}%</div>
                  <div className="badge bg-info bg-opacity-10 text-info fw-semibold">5.7%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('total_categories') && (
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold">Total Categorías</span>
                <i className="fas fa-ellipsis-v text-muted small"></i>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, background: '#fef3c7'}}>
                  <i className="fas fa-tags text-amber-600 fs-4"></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold text-dark">{totalCategories || '—'}</div>
                  <div className="text-muted small">Categorías activas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('total_brands') && (
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold">Total Marcas</span>
                <i className="fas fa-ellipsis-v text-muted small"></i>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, background: '#e0e7ff'}}>
                  <i className="fas fa-copyright text-primary fs-4"></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold text-dark">{totalBrands || '—'}</div>
                  <div className="text-muted small">Marcas activas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('total_products') && (
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold">Total Productos</span>
                <i className="fas fa-ellipsis-v text-muted small"></i>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, background: '#d1fae5'}}>
                  <i className="fas fa-box text-success fs-4"></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold text-dark">{totalActiveProducts || '—'}</div>
                  <div className="text-muted small">Productos activos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Gráfico principal de estadísticas - 12 columnas */}
      {shouldShowCard('statistics_chart') && (
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-chart-bar text-info"></i>
                <span className="fw-bold">Statistics</span>
              </div>
              <button className="btn btn-sm btn-light border"><i className="fas fa-ellipsis-v"></i></button>
            </div>
            <div className="card-body">
              {(() => {
                // Filtrar datos por rango de fechas
                const filteredData = salesLast30Days.filter(d => {
                  const date = new Date(d.date);
                  return date >= startDate && date <= endDate;
                });
                return (
                  <>
                    <Chart
                      options={{
                        chart: {
                          id: 'ventas30dias',
                          toolbar: { show: false },
                          stacked: false,
                        },
                        xaxis: {
                          categories: filteredData.map(d => d.date),
                          labels: { rotate: -35 }
                        },
                        yaxis: [
                          {
                            title: { text: 'Pedidos' },
                            labels: { style: { colors: '#3b82f6' } },
                            min: 0,
                          },
                          {
                            opposite: true,
                            title: { text: 'Ventas (S/)' },
                            labels: { style: { colors: '#10b981' } },
                            min: 0,
                          }
                        ],
                        dataLabels: { enabled: false },
                        stroke: { curve: 'smooth', width: [0, 3] },
                        colors: ['#3b82f6', '#10b981'],
                        tooltip: {
                          enabled: true,
                          shared: true,
                          intersect: false,
                          y: [
                            {
                              formatter: val => `${val} pedidos`
                            },
                            {
                              formatter: val => `S/ ${Number(val).toFixed(2)}`
                            }
                          ]
                        },
                        legend: { show: true, position: 'top', fontWeight: 600 }
                      }}
                      series={[
                        {
                          name: 'Pedidos',
                          type: 'column',
                          data: filteredData.map(d => d.orders || 0),
                          yAxisIndex: 0
                        },
                        {
                          name: 'Ventas',
                          type: 'line',
                          data: filteredData.map(d => d.amount),
                          yAxisIndex: 1
                        }
                      ]}
                      type="line"
                      height={260}
                    />
                    <div className="mt-2 d-flex align-items-center gap-2 flex-wrap">
                      <span className="text-muted small">Rango de fechas:</span>
                      <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                        className="form-control form-control-sm"
                        maxDate={endDate}
                      />
                      <span className="mx-1">a</span>
                      <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                        className="form-control form-control-sm"
                        minDate={startDate}
                        maxDate={new Date()}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      )}
      

      
      {/* Gráfico de visitas - 12 columnas */}
      {shouldShowCard('visits_chart') && (
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-chart-bar text-info"></i>
                <span className="fw-bold">Visitas del Mes</span>
              </div>
              <button className="btn btn-sm btn-light border"><i className="fas fa-sync-alt"></i></button>
            </div>
            <div className="card-body">
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                    toolbar: { show: false },
                  },
                  xaxis: {
                    categories: visitsThisMonth.map(v => v.date),
                    labels: { rotate: -45, style: { fontSize: '12px' } }
                  },
                  yaxis: {
                    title: { text: 'Visitas' },
                    min: 0,
                  },
                  dataLabels: { enabled: false },
                  colors: ['#3b82f6'],
                  tooltip: {
                    y: {
                      formatter: val => `${val} visitas`
                    }
                  },
                  grid: { strokeDashArray: 3 }
                }}
                series={[{
                  name: 'Visitas',
                  data: visitsThisMonth.map(v => v.visits)
                }]}
                type="bar"
                height={280}
              />
            </div>
          </div>
        </div>
      </div>
      )}
      
      {/* Gráficos de categorías y marcas - 6 columnas */}
      <div className="row g-3 mb-4">
          {shouldShowCard('orders_statistics') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-chart-pie text-primary"></i>
                <span className="fw-bold">Orders Statistics</span>
              </div>
              <button className="btn btn-sm btn-light border"><i className="fas fa-sync-alt"></i></button>
            </div>
            <div className="card-body">
              <Chart
                options={{
                  chart: {
                    type: 'pie',
                    toolbar: { show: false },
                  },
                  labels: ordersByStatus.map(s => s.name),
                  colors: ordersByStatus.map(s => s.color),
                  legend: {
                    position: 'bottom',
                    fontSize: '15px',
                    fontWeight: 500,
                    markers: { width: 16, height: 16, radius: 8 },
                    itemMargin: { horizontal: 10, vertical: 4 }
                  },
                  tooltip: {
                    enabled: true,
                    style: { fontSize: '15px', fontWeight: 500 },
                    fillSeriesColor: false,
                  },
                  dataLabels: {
                    enabled: false
                  },
                  stroke: { width: 2, colors: ['#fff'] },
                  fill: {
                    type: 'solid',
                  },
                  states: {
                    hover: { filter: { type: 'lighten', value: 0.08 } },
                    active: { filter: { type: 'darken', value: 0.12 } }
                  },
                  animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 700,
                    animateGradually: { enabled: true, delay: 100 },
                    dynamicAnimation: { enabled: true, speed: 300 }
                  }
                }}
                series={ordersByStatus.map(s => s.count)}
                type="pie"
                height={300}
              />
              
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('sales_by_location') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-th-large text-success"></i>
                <span className="fw-bold">Ventas por Ubicación (TreeMap)</span>
              </div>
              <button className="btn btn-sm btn-light border"><i className="fas fa-ellipsis-v"></i></button>
            </div>
            <div className="card-body">
              <Chart
                options={{
                  chart: { type: 'treemap', toolbar: { show: false } },
                  legend: { show: false },
                  dataLabels: {
                    enabled: true,
                    style: { fontSize: '14px', fontWeight: 500 },
                    formatter: function(text, op) {
                      // Muestra solo el nombre de la ubicación, no el valor
                      return text.length > 18 ? text.slice(0, 15) + '...' : text;
                    }
                  },
                  colors: ['#10b981', '#3b82f6', '#f59e42', '#f43f5e', '#6366f1', '#06b6d4', '#fbbf24'],
                  tooltip: {
                    enabled: true,
                    y: {
                      formatter: val => `Ventas: ${val}`
                    }
                  },
                  grid: { show: false }
                }}
                series={[
                  {
                    data: salesByLocation.slice(0, 12).map(l => ({
                      x: `${l.department}/${l.province}/${l.district}`,
                      y: l.count
                    }))
                  }
                ]}
                type="treemap"
                height={300}
              />
              <div className="text-muted small mt-2">
                Mostrando top {Math.min(salesByLocation.length, 12)} ubicaciones
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('categories_chart') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-chart-bar text-warning"></i>
                <span className="fw-bold">Productos por Categoría</span>
              </div>
              <button className="btn btn-sm btn-light border"><i className="fas fa-sync-alt"></i></button>
            </div>
            <div className="card-body">
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                    toolbar: { show: false },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 4,
                      dataLabels: {
                        position: 'top'
                      }
                    }
                  },
                  xaxis: {
                    categories: categoriesWithProducts.filter(c => c.value > 0).map(c => c.name),
                    labels: {
                      style: {
                        fontSize: '11px'
                      }
                    }
                  },
                  yaxis: {
                    title: {
                      text: 'Productos'
                    }
                  },
                  colors: ['#f59e0b'],
                  tooltip: {
                    y: {
                      formatter: val => `${val} productos`
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: function(val) {
                      return val
                    },
                    style: {
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }
                  },
                  grid: {
                    strokeDashArray: 3
                  }
                }}
                series={[{
                  name: 'Productos',
                  data: categoriesWithProducts.filter(c => c.value > 0).map(c => c.value)
                }]}
                type="bar"
                height={400}
              />
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('brands_chart') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-chart-bar text-success"></i>
                <span className="fw-bold">Productos por Marca</span>
              </div>
              <button className="btn btn-sm btn-light border"><i className="fas fa-sync-alt"></i></button>
            </div>
            <div className="card-body">
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                    toolbar: { show: false },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 4,
                      dataLabels: {
                        position: 'top'
                      }
                    }
                  },
                  xaxis: {
                    categories: brandsWithProducts.filter(b => b.value > 0).map(b => b.name),
                    labels: {
                      style: {
                        fontSize: '12px'
                      }
                    }
                  },
                  yaxis: {
                    title: {
                      text: 'Productos'
                    }
                  },
                  colors: ['#10b981'],
                  tooltip: {
                    y: {
                      formatter: val => `${val} productos`
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: function(val) {
                      return val
                    },
                    style: {
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }
                  },
                  grid: {
                    strokeDashArray: 3
                  }
                }}
                series={[{
                  name: 'Productos',
                  data: brandsWithProducts.filter(b => b.value > 0).map(b => b.value)
                }]}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
        )}
          {shouldShowCard('top_selling_products') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="me-2"><i className="fas fa-fire text-danger"></i></span>
                <h6 className="mb-0 fw-bold">Top Selling Products</h6>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: 340}}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.name}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={`/storage/images/item/${product.image}`} alt={product.name} className="rounded-circle me-2" style={{width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #e5e7eb'}} onError={e => e.target.src = '/api/cover/thumbnail/null'} />
                            <div>
                              <div className="fw-semibold">{product.name}</div>
                              <span className="badge bg-primary bg-opacity-10 text-primary mt-1">Top</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge bg-success bg-opacity-10 text-success fs-6">{product.quantity}</span></td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success"><i className="fas fa-arrow-up me-1"></i>+{Math.round(Math.random() * 20)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center p-2">
                <span className="text-muted small">Mostrando {topProducts.length} productos</span>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('new_featured_products') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="me-2"><i className="fas fa-star text-warning"></i></span>
                <h6 className="mb-0 fw-bold">New Featured Products</h6>
              </div>
              <button className="btn btn-sm btn-outline-primary"><i className="fas fa-upload"></i> Import</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: 340}}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newFeatured.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={`/storage/images/item/${product.image}`} alt={product.name} className="rounded-circle me-2" style={{width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #e5e7eb'}} />
                            <div>
                              <div className="fw-semibold">{product.name}</div>
                              <span className="badge bg-warning bg-opacity-10 text-warning mt-1">Nuevo</span>
                            </div>
                          </div>
                        </td>
                        <td className="fw-bold">S/{Number(product.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center p-2">
                <span className="text-muted small">Mostrando {newFeatured.length} productos</span>
              </div>
            </div>
          </div>
        </div>
        )}
           {shouldShowCard('most_viewed_products') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="me-2"><i className="fas fa-eye text-info"></i></span>
                <h6 className="mb-0 fw-bold">Most Viewed Products</h6>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: 340}}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Vistas</th>
                      <th>Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mostViewedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={`/storage/images/item/${product.image}`} alt={product.name} className="rounded-circle me-2" style={{width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #e5e7eb'}} onError={e => e.target.src = '/api/cover/thumbnail/null'} />
                            <div>
                              <div className="fw-semibold">{product.name}</div>
                              <span className="badge bg-info bg-opacity-10 text-info mt-1">Visto</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge bg-info bg-opacity-10 text-info fs-6">{product.view_count}</span></td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info"><i className="fas fa-eye me-1"></i>Popular</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center p-2">
                <span className="text-muted small">Mostrando {mostViewedProducts.length} productos</span>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('most_used_coupons') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="me-2"><i className="fas fa-ticket-alt text-primary"></i></span>
                <h6 className="mb-0 fw-bold">Most Used Coupons</h6>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: 340}}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Veces Usado</th>
                      <th>Valor</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCoupons.map((c, i) => (
                      <tr key={i}>
                        <td><span className="badge bg-primary bg-opacity-10 text-primary">{c.code}</span></td>
                        <td className="fw-semibold">{c.name}</td>
                        <td><span className="badge bg-success bg-opacity-10 text-success">{c.used_count}</span></td>
                        <td><span className="badge bg-info bg-opacity-10 text-info">{c.value}</span></td>
                        <td><span className="badge bg-secondary bg-opacity-10 text-secondary">{c.type}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center p-2">
                <span className="text-muted small">Mostrando {topCoupons.length} cupones</span>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('most_used_discount_rules') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="me-2"><i className="fas fa-percentage text-success"></i></span>
                <h6 className="mb-0 fw-bold">Most Used Discount Rules</h6>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: 340}}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Veces Aplicada</th>
                      <th>Monto Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDiscountRules.map((r, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{r.name}</td>
                        <td><span className="badge bg-success bg-opacity-10 text-success">{r.times_used}</span></td>
                        <td><span className="badge bg-info bg-opacity-10 text-info">S/ {formatIncome(r.total_discount)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center p-2">
                <span className="text-muted small">Mostrando {topDiscountRules.length} reglas</span>
              </div>
            </div>
          </div>
        </div>
        )}
            {shouldShowCard('brands_listing') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="me-2"><i className="fas fa-industry text-info"></i></span>
                <h6 className="mb-0 fw-bold">Brands Listing</h6>
              </div>
              <button className="btn btn-sm btn-outline-primary"><i className="fas fa-plus"></i> Add Brand</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: 340}}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Estado</th>
                      <th>Destacada</th>
                      <th>Visible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((b, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{b.name}</td>
                        <td>
                          <span className={`badge ${b.status === 1 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>{b.status === 1 ? 'Activo' : 'Inactivo'}</span>
                        </td>
                        <td>
                          <span className={`badge ${b.featured ? 'bg-warning bg-opacity-10 text-warning' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{b.featured ? 'Sí' : 'No'}</span>
                        </td>
                        <td>
                          <span className={`badge ${b.visible ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{b.visible ? 'Sí' : 'No'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center p-2">
                <span className="text-muted small">Mostrando {brands.length} marcas</span>
              </div>
            </div>
          </div>
        </div>
        )}
        {shouldShowCard('top_clients') && (
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="me-2"><i className="fas fa-users text-primary"></i></span>
                <h6 className="mb-0 fw-bold">Top Clients</h6>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: 340}}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Email</th>
                      <th>Pedidos</th>
                      <th>Monto Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topClients.map((c, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{c.email}</td>
                        <td><span className="badge bg-primary bg-opacity-10 text-primary">{c.total_orders}</span></td>
                        <td><span className="badge bg-success bg-opacity-10 text-success">S/ {formatIncome(c.total_spent)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end align-items-center p-2">
                <span className="text-muted small">Mostrando {topClients.length} clientes</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>




      {/* Modal de configuración de visibilidad */}
      {showVisibilityModal && (
        <div  className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} onClick={() => setShowVisibilityModal(false)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-eye me-2"></i>
                  Configurar Visibilidad del Dashboard
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowVisibilityModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">
                  Selecciona qué elementos del dashboard deseas mostrar u ocultar. Los cambios se aplicarán inmediatamente.
                </p>
                
                {Object.entries(CARD_CATEGORIES).map(([categoryKey, category]) => {
                  const categoryCards = Object.entries(DASHBOARD_CARDS).filter(([_, card]) => card.category === categoryKey);
                  
                  return (
                    <div key={categoryKey} className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className={`${category.icon} me-2`}></i>
                        {category.name}
                      </h6>
                      <div className="row">
                        {categoryCards.map(([cardId, card]) => (
                          <div key={cardId} className="col-md-6 mb-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`visibility-${cardId}`}
                                checked={cardVisibility[cardId] !== false}
                                onChange={() => handleToggleCardVisibility(cardId)}
                              />
                              <label className="form-check-label" htmlFor={`visibility-${cardId}`}>
                                {card.name}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowVisibilityModal(false)}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveVisibility}
                  disabled={savingVisibility}
                >
                  {savingVisibility ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Dashboard">
      <Home {...properties} />
    </BaseAdminto>
  );
});