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
    <div className="dashboard-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem' }}>
      <Toaster position="top-right" richColors />

      {/* Modern Header */}
      <div className="dashboard-header mb-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-2 fw-bold text-dark">Dashboard</h2>
            <p className="text-muted mb-0 fs-6">Bienvenido de vuelta, aquí tienes un resumen de tu negocio</p>
          </div>
          {hasRootRole && (
            <div className="d-flex gap-2">
              <Tippy content="Actualizar datos">
                <button className="btn btn-light border-0 shadow-sm px-3 py-2 rounded-3">
                  <i className="fas fa-sync-alt text-primary"></i>
                </button>
              </Tippy>
              <Tippy content="Configurar visibilidad de cards">
                <button
                  className="btn btn-primary px-3 py-2"
                  onClick={() => setShowVisibilityModal(true)}
                >
                  <i className="fas fa-eye me-2"></i>
                  Configurar Visibilidad
                </button>
              </Tippy>
            </div>
          )}
        </div>
      </div>

      {/* Clean KPI Cards */}
      <div className="row g-4 mb-5">
        {shouldShowCard('total_orders') && (
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3" style={{ background: '#e0e7ff' }}>
                    <i className="fas fa-shopping-cart text-primary fs-4"></i>
                  </div>
                  <div className="text-end">
                    <div className="fs-2 fw-bold text-dark mb-0">{salesToday || '0'}</div>
                    <div className="text-muted small">Órdenes Hoy</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Este mes: {salesMonth || '0'}</span>
                  <div className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">
                    <i className="fas fa-arrow-up me-1"></i>+12%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('total_revenue') && (
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3" style={{ background: '#d1fae5' }}>
                    <i className="fas fa-dollar-sign text-success fs-4"></i>
                  </div>
                  <div className="text-end">
                    <div className="fs-2 fw-bold text-dark mb-0">S/ {formatIncome(incomeToday) || '0'}</div>
                    <div className="text-muted small">Ingresos Hoy</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Este mes: S/ {formatIncome(incomeMonth) || '0'}</span>
                  <div className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">
                    <i className="fas fa-arrow-up me-1"></i>+32%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('new_users') && (
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3" style={{ background: '#fef3c7' }}>
                    <i className="fas fa-user-plus text-warning fs-4"></i>
                  </div>
                  <div className="text-end">
                    <div className="fs-2 fw-bold text-dark mb-0">{usersToday || '0'}</div>
                    <div className="text-muted small">Usuarios Hoy</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Este mes: {usersMonth || '0'}</span>
                  <div className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill">
                    <i className="fas fa-arrow-up me-1"></i>+8%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('customer_satisfaction') && (
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3" style={{ background: '#e0f2fe' }}>
                    <i className="fas fa-smile text-info fs-4"></i>
                  </div>
                  <div className="text-end">
                    <div className="fs-2 fw-bold text-dark mb-0">{customerSatisfaction || '0'}%</div>
                    <div className="text-muted small">Satisfacción</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Promedio mensual</span>
                  <div className="badge bg-info bg-opacity-10 text-info px-2 py-1 rounded-pill">
                    <i className="fas fa-arrow-up me-1"></i>+5.7%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('total_categories') && (
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3" style={{ background: '#fef3c7' }}>
                    <i className="fas fa-tags text-warning fs-4"></i>
                  </div>
                  <div className="text-end">
                    <div className="fs-2 fw-bold text-dark mb-0">{totalCategories || '0'}</div>
                    <div className="text-muted small">Categorías</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Activas</span>
                  <div className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">
                    <i className="fas fa-check me-1"></i>100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('total_brands') && (
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3" style={{ background: '#e0e7ff' }}>
                    <i className="fas fa-copyright text-primary fs-4"></i>
                  </div>
                  <div className="text-end">
                    <div className="fs-2 fw-bold text-dark mb-0">{totalBrands || '0'}</div>
                    <div className="text-muted small">Marcas</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Activas</span>
                  <div className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">
                    <i className="fas fa-check me-1"></i>100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('total_products') && (
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-3 p-3" style={{ background: '#fce7f3' }}>
                    <i className="fas fa-box text-pink fs-4" style={{ color: '#ec4899' }}></i>
                  </div>
                  <div className="text-end">
                    <div className="fs-2 fw-bold text-dark mb-0">{totalActiveProducts || '0'}</div>
                    <div className="text-muted small">Productos</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Activos</span>
                  <div className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">
                    <i className="fas fa-check me-1"></i>100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Statistics Chart */}
      {shouldShowCard('statistics_chart') && (
        <div className="row g-4 mb-5">
          <div className="col-12">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <i className="fas fa-chart-line text-white fs-5"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-dark">Estadísticas de Ventas</h5>
                      <p className="text-muted mb-0 small">Análisis de rendimiento en tiempo real</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className="card-body p-4">
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
                            background: 'transparent',
                            fontFamily: 'Inter, sans-serif'
                          },
                          grid: {
                            borderColor: '#e2e8f0',
                            strokeDashArray: 2,
                            xaxis: { lines: { show: false } },
                            yaxis: { lines: { show: true } }
                          },
                          xaxis: {
                            categories: filteredData.map(d => d.date),
                            labels: {
                              rotate: -45,
                              style: { colors: '#64748b', fontSize: '11px' }
                            },
                            axisBorder: { show: false },
                            axisTicks: { show: false }
                          },
                          yaxis: [
                            {
                              title: {
                                text: 'Pedidos',
                                style: { color: '#3b82f6', fontSize: '12px', fontWeight: 600 }
                              },
                              labels: { style: { colors: '#3b82f6', fontSize: '11px' } },
                              min: 0,
                            },
                            {
                              opposite: true,
                              title: {
                                text: 'Ventas (S/)',
                                style: { color: '#10b981', fontSize: '12px', fontWeight: 600 }
                              },
                              labels: { style: { colors: '#10b981', fontSize: '11px' } },
                              min: 0,
                            }
                          ],
                          dataLabels: { enabled: false },
                          stroke: {
                            curve: 'smooth',
                            width: [0, 4],
                            dashArray: [0, 0]
                          },
                          colors: ['#3b82f6', '#10b981'],
                          fill: {
                            opacity: [0.8, 1]
                          },
                          plotOptions: {
                            bar: {
                              borderRadius: 4,
                              columnWidth: '60%'
                            }
                          },
                          tooltip: {
                            enabled: true,
                            shared: true,
                            intersect: false,
                            theme: 'light',
                            style: { fontSize: '12px' },
                            y: [
                              {
                                formatter: val => `${val} pedidos`
                              },
                              {
                                formatter: val => `S/ ${Number(val).toFixed(2)}`
                              }
                            ]
                          },
                          legend: {
                            show: true,
                            position: 'top',
                            fontWeight: 500,
                            fontSize: '13px',
                            markers: { width: 10, height: 10, radius: 5 }
                          }
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
                            yAxisIndex: 1,
                            stroke: {
                              width: 4,
                              curve: 'smooth'
                            },
                            markers: {
                              size: 6,
                              colors: ['#10b981'],
                              strokeColors: '#fff',
                              strokeWidth: 2,
                              hover: {
                                size: 8
                              }
                            }
                          }
                        ]}
                        type="line"
                        height={300}
                      />
                      <div className="mt-4 p-3 rounded-3" style={{ background: '#f8fafc' }}>
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                          <span className="text-muted fw-semibold">Filtrar por fechas:</span>
                          <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="yyyy-MM-dd"
                            className="form-control form-control-sm border-0 shadow-sm rounded-3"
                            maxDate={endDate}
                            style={{ minWidth: '140px' }}
                          />
                          <span className="text-muted">hasta</span>
                          <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="yyyy-MM-dd"
                            className="form-control form-control-sm border-0 shadow-sm rounded-3"
                            minDate={startDate}
                            maxDate={new Date()}
                            style={{ minWidth: '140px' }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Modern Visits Chart */}
      {shouldShowCard('visits_chart') && (
        <div className="row g-4 mb-5">
          <div className="col-12">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                      <i className="fas fa-chart-bar text-white fs-5"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-dark">Visitas del Mes</h5>
                      <p className="text-muted mb-0 small">Tráfico diario del sitio web</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className="card-body p-4">
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: { show: false },
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif'
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 6,
                        columnWidth: '70%',
                        dataLabels: {
                          position: 'top'
                        }
                      }
                    },
                    xaxis: {
                      categories: visitsThisMonth.map(v => v.date),
                      labels: {
                        rotate: -45,
                        style: { colors: '#64748b', fontSize: '11px' }
                      },
                      axisBorder: { show: false },
                      axisTicks: { show: false }
                    },
                    yaxis: {
                      title: {
                        text: 'Visitas',
                        style: { color: '#64748b', fontSize: '12px' }
                      },
                      labels: {
                        style: { colors: '#64748b', fontSize: '11px' }
                      },
                      min: 0,
                    },
                    grid: {
                      borderColor: '#e2e8f0',
                      strokeDashArray: 2,
                      xaxis: { lines: { show: false } },
                      yaxis: { lines: { show: true } }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val
                      },
                      style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        colors: ['#374151']
                      },
                      offsetY: -20
                    },
                    colors: ['#06b6d4'],
                    fill: {
                      opacity: 0.8
                    },
                    tooltip: {
                      theme: 'light',
                      style: { fontSize: '12px' },
                      y: {
                        formatter: val => `${val} visitas`
                      }
                    },
                    states: {
                      hover: {
                        filter: {
                          type: 'lighten',
                          value: 0.1
                        }
                      }
                    }
                  }}
                  series={[{
                    name: 'Visitas',
                    data: visitsThisMonth.map(v => v.visits)
                  }]}
                  type="bar"
                  height={320}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Charts Grid */}
      <div className="row g-4 mb-5">
        {shouldShowCard('orders_statistics') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <i className="fas fa-chart-pie text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Estadísticas de Órdenes</h6>
                      <p className="text-muted mb-0 small">Distribución por estado</p>
                    </div>
                  </div>
                  <button className="btn btn-light border-0 shadow-sm px-3 py-2 rounded-3">
                    <i className="fas fa-sync-alt text-primary"></i>
                  </button>
                </div>
              </div>
              <div className="card-body p-4">
                <Chart
                  options={{
                    chart: {
                      type: 'radialBar',
                      toolbar: { show: false },
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif'
                    },
                    labels: ordersByStatus.filter(s => s.count > 0).map(s => s.name),
                    colors: [
                      '#667eea', '#10b981', '#f59e0b', '#ef4444',
                      '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'
                    ],
                    legend: {
                      show: true,
                      position: 'bottom',
                      fontSize: '12px',
                      fontWeight: 500,
                      markers: { width: 10, height: 10, radius: 5 },
                      itemMargin: { horizontal: 8, vertical: 4 },
                      formatter: function (seriesName, opts) {
                        const filteredOrders = ordersByStatus.filter(s => s.count > 0);
                        const originalOrder = filteredOrders[opts.seriesIndex];
                        return `${originalOrder.name} (${originalOrder.count})`;
                      }
                    },
                    plotOptions: {
                      radialBar: {
                        offsetY: 0,
                        startAngle: 0,
                        endAngle: 360,
                        hollow: {
                          margin: 5,
                          size: '30%',
                          background: 'transparent',
                          image: undefined,
                        },
                        track: {
                          background: '#f1f5f9',
                          strokeWidth: '67%',
                          margin: 0,
                          dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                          }
                        },
                        dataLabels: {
                          show: true,
                          name: {
                            offsetY: -10,
                            show: true,
                            color: '#374151',
                            fontSize: '13px',
                            fontWeight: 600
                          },
                          value: {
                            formatter: function (val, opts) {
                              const filteredOrders = ordersByStatus.filter(s => s.count > 0);
                              const order = filteredOrders[opts.seriesIndex];
                              return order ? order.count : '0';
                            },
                            color: '#1f2937',
                            fontSize: '16px',
                            fontWeight: 700,
                            show: true,
                          },
                          total: {
                            show: true,
                            showAlways: false,
                            label: 'Total Órdenes',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151',
                            formatter: function (w) {
                              const total = ordersByStatus.filter(s => s.count > 0).reduce((sum, o) => sum + o.count, 0);
                              return total.toString();
                            }
                          }
                        }
                      }
                    },
                    stroke: {
                      lineCap: 'round'
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shade: 'light',
                        type: 'horizontal',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#764ba2', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#22d3ee', '#fb923c', '#f472b6'],
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100]
                      }
                    },
                    tooltip: {
                      enabled: true,
                      theme: 'light',
                      style: { fontSize: '12px' },
                      y: {
                        formatter: function (val, opts) {
                          const filteredOrders = ordersByStatus.filter(s => s.count > 0);
                          const order = filteredOrders[opts.seriesIndex];
                          return `${order.count} órdenes`;
                        }
                      },
                      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        const filteredOrders = ordersByStatus.filter(s => s.count > 0);
                        const order = filteredOrders[seriesIndex];
                        return `
                          <div class="px-3 py-2">
                            <div class="fw-bold">${order.name}</div>
                            <div class="text-primary fw-semibold">${order.count} órdenes</div>
                            <div class="text-muted small">${Math.round(series[seriesIndex])}% del total</div>
                          </div>
                        `;
                      }
                    },
                    states: {
                      hover: {
                        filter: {
                          type: 'lighten',
                          value: 0.1
                        }
                      },
                      active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                          type: 'darken',
                          value: 0.1
                        }
                      }
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: {
                          width: 280
                        },
                        legend: {
                          position: 'bottom',
                          fontSize: '11px'
                        }
                      }
                    }]
                  }}
                  series={(() => {
                    const filteredOrders = ordersByStatus.filter(s => s.count > 0);
                    const total = filteredOrders.reduce((sum, o) => sum + o.count, 0);
                    return filteredOrders.map(s => Math.round((s.count / total) * 100));
                  })()}
                  type="radialBar"
                  height={350}
                />
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('sales_by_location') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
                      <i className="fas fa-th-large text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Ventas por Ubicación</h6>
                      <p className="text-muted mb-0 small">Distribución geográfica</p>
                    </div>
                  </div>
             
                </div>
              </div>
              <div className="card-body p-4">
                <Chart
                  options={{
                    chart: {
                      type: 'treemap',
                      toolbar: { show: false },
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif'
                    },
                    legend: { show: false },
                    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'],
                    dataLabels: {
                      enabled: true,
                      style: { fontSize: '12px', fontWeight: 600, colors: ['#fff'] },
                      formatter: function (text, op) {
                        return text.length > 15 ? text.slice(0, 12) + '...' : text;
                      }
                    },
                    tooltip: {
                      enabled: true,
                      theme: 'light',
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
                  height={320}
                />
                <div className="mt-3 p-3 rounded-3" style={{ background: '#f8fafc' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small fw-medium">
                      Mostrando top {Math.min(salesByLocation.length, 12)} ubicaciones
                    </span>
                    <a href='/admin/sales' target='_blank' className="btn btn-sm btn-outline-primary rounded-3 px-3">
                      Ver todas
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('categories_chart') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
                      <i className="fas fa-tags text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Productos por Categoría</h6>
                      <p className="text-muted mb-0 small">Distribución de inventario</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className="card-body p-4">
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: true,
                        tools: {
                          download: true,
                          selection: false,
                          zoom: false,
                          zoomin: false,
                          zoomout: false,
                          pan: false,
                          reset: false
                        }
                      },
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif',
                      animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                          enabled: true,
                          delay: 150
                        },
                        dynamicAnimation: {
                          enabled: true,
                          speed: 350
                        }
                      }
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        borderRadius: 8,
                        borderRadiusApplication: 'end',
                        columnWidth: '60%',
                        dataLabels: {
                          position: 'top'
                        },
                        distributed: true
                      }
                    },
                    xaxis: {
                      categories: categoriesWithProducts.filter(c => c.value > 0).map(c => c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name),
                      labels: {
                        rotate: -45,
                        rotateAlways: true,
                        style: {
                          colors: '#64748b',
                          fontSize: '11px',
                          fontWeight: 500
                        },
                        maxHeight: 80
                      },
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                      tooltip: {
                        enabled: true,
                        formatter: function (val, opts) {
                          const fullCategory = categoriesWithProducts.filter(c => c.value > 0)[opts.dataPointIndex];
                          return fullCategory ? fullCategory.name : val;
                        }
                      }
                    },
                    yaxis: {
                      title: {
                        text: 'Cantidad de Productos',
                        style: {
                          color: '#64748b',
                          fontSize: '13px',
                          fontWeight: 600
                        }
                      },
                      labels: {
                        style: {
                          colors: '#64748b',
                          fontSize: '11px',
                          fontWeight: 500
                        },
                        formatter: function (val) {
                          return Math.floor(val);
                        }
                      },
                      min: 0
                    },
                    grid: {
                      borderColor: '#e2e8f0',
                      strokeDashArray: 3,
                      xaxis: { lines: { show: false } },
                      yaxis: { lines: { show: true } },
                      padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                      }
                    },
                    colors: [
                      '#f59e0b', '#10b981', '#3b82f6', '#ef4444',
                      '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
                      '#84cc16', '#f43f5e', '#6366f1', '#14b8a6'
                    ],
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.4,
                        gradientToColors: [
                          '#fbbf24', '#34d399', '#60a5fa', '#f87171',
                          '#a78bfa', '#22d3ee', '#fb923c', '#f472b6',
                          '#a3e635', '#fb7185', '#818cf8', '#2dd4bf'
                        ],
                        inverseColors: false,
                        opacityFrom: 0.9,
                        opacityTo: 0.6,
                        stops: [0, 100]
                      }
                    },
                    tooltip: {
                      enabled: true,
                      theme: 'light',
                      style: { fontSize: '12px' },
                      y: {
                        formatter: function (val, opts) {
                          const category = categoriesWithProducts.filter(c => c.value > 0)[opts.dataPointIndex];
                          return `${val} productos`;
                        }
                      },
                      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        const category = categoriesWithProducts.filter(c => c.value > 0)[dataPointIndex];
                        const value = series[seriesIndex][dataPointIndex];
                        const total = categoriesWithProducts.filter(c => c.value > 0).reduce((sum, c) => sum + c.value, 0);
                        const percentage = ((value / total) * 100).toFixed(1);

                        return `
                          <div class="px-3 py-2">
                            <div class="fw-bold text-dark">${category.name}</div>
                            <div class="text-primary fw-semibold">${value} productos</div>
                            <div class="text-muted small">${percentage}% del inventario</div>
                          </div>
                        `;
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val > 0 ? val : '';
                      },
                      style: {
                        fontSize: '12px',
                        fontWeight: 'bold',
                        colors: ['#374151']
                      },
                      offsetY: -25,
                      dropShadow: {
                        enabled: true,
                        top: 1,
                        left: 1,
                        blur: 1,
                        opacity: 0.45
                      }
                    },
                    states: {
                      hover: {
                        filter: {
                          type: 'lighten',
                          value: 0.1
                        }
                      },
                      active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                          type: 'darken',
                          value: 0.1
                        }
                      }
                    },
                    legend: {
                      show: false
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: {
                          width: '100%'
                        },
                        plotOptions: {
                          bar: {
                            columnWidth: '80%'
                          }
                        },
                        xaxis: {
                          labels: {
                            rotate: -90,
                            fontSize: '10px'
                          }
                        }
                      }
                    }]
                  }}
                  series={[{
                    name: 'Productos por Categoría',
                    data: categoriesWithProducts.filter(c => c.value > 0).map(c => c.value)
                  }]}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('brands_chart') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
                      <i className="fas fa-copyright text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Productos por Marca</h6>
                      <p className="text-muted mb-0 small">Distribución por fabricante</p>
                    </div>
                  </div>
               
                </div>
              </div>
              <div className="card-body p-4">
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: { show: false },
                      background: 'transparent',
                      fontFamily: 'Inter, sans-serif'
                    },
                    plotOptions: {
                      bar: {
                        horizontal: true,
                        borderRadius: 6,
                        barHeight: '70%',
                        dataLabels: {
                          position: 'center'
                        }
                      }
                    },
                    xaxis: {
                      categories: brandsWithProducts.filter(b => b.value > 0).map(b => b.name.length > 15 ? b.name.substring(0, 15) + '...' : b.name),
                      labels: {
                        style: { colors: '#64748b', fontSize: '11px' }
                      },
                      axisBorder: { show: false },
                      axisTicks: { show: false }
                    },
                    yaxis: {
                      labels: {
                        style: { colors: '#64748b', fontSize: '11px' }
                      }
                    },
                    grid: {
                      borderColor: '#e2e8f0',
                      strokeDashArray: 2,
                      xaxis: { lines: { show: true } },
                      yaxis: { lines: { show: false } }
                    },
                    colors: ['#10b981'],
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shade: 'light',
                        type: 'horizontal',
                        shadeIntensity: 0.25,
                        gradientToColors: ['#34d399'],
                        inverseColors: false,
                        opacityFrom: 0.85,
                        opacityTo: 0.55,
                      }
                    },
                    tooltip: {
                      theme: 'light',
                      y: {
                        formatter: val => `${val} productos`
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val
                      },
                      style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        colors: ['#fff']
                      }
                    }
                  }}
                  series={[{
                    name: 'Productos',
                    data: brandsWithProducts.filter(b => b.value > 0).map(b => b.value)
                  }]}
                  type="bar"
                  height={280}
                />
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('top_selling_products') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' }}>
                      <i className="fas fa-fire text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Productos Más Vendidos</h6>
                      <p className="text-muted mb-0 small">Top performers del mes</p>
                    </div>
                  </div>
               
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 380 }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Producto</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Cantidad</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={product.name} className="border-0">
                          <td className="px-4 py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <img
                                  src={`/storage/images/item/${product.image}`}
                                  alt={product.name}
                                  className="rounded-3 shadow-sm"
                                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                  onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                />
                                <div className="position-absolute top-0 start-0 translate-middle">
                                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)', fontSize: '10px' }}>
                                    #{index + 1}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">{product.name}</div>
                                <span className="badge rounded-pill px-2 py-1" style={{ background: '#fef3c7', color: '#d97706', fontSize: '11px' }}>
                                  Bestseller
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#d1fae5', color: '#059669', fontSize: '12px' }}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '12px' }}>
                              <i className="fas fa-arrow-up me-1"></i>+{Math.round(Math.random() * 20)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderRadius: '0 0 1rem 1rem' }}>
                  <span className="text-muted small fw-medium">Mostrando {topProducts.length} productos</span>
                  <a href='/admin/items' target='_blank' className="btn btn-sm btn-outline-primary rounded-3 px-3">
                    Ver todos
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('new_featured_products') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>
                      <i className="fas fa-star text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Nuevos Productos Destacados</h6>
                      <p className="text-muted mb-0 small">Últimos lanzamientos destacados</p>
                    </div>
                  </div>
                
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 380 }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Producto</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Precio</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newFeatured.map((product, index) => (
                        <tr key={product.id} className="border-0">
                          <td className="px-4 py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <img
                                  src={`/storage/images/item/${product.image}`}
                                  alt={product.name}
                                  className="rounded-3 shadow-sm"
                                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                  onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                />
                                <div className="position-absolute top-0 start-0 translate-middle">
                                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', fontSize: '10px' }}>
                                    <i className="fas fa-star"></i>
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">{product.name}</div>
                                <span className="badge rounded-pill px-2 py-1" style={{ background: '#fef3c7', color: '#d97706', fontSize: '11px' }}>
                                  Destacado
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#d1fae5', color: '#059669', fontSize: '12px' }}>
                              S/ {Number(product.price).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#fef3c7', color: '#d97706', fontSize: '12px' }}>
                              <i className="fas fa-sparkles me-1"></i>Nuevo
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderRadius: '0 0 1rem 1rem' }}>
                  <span className="text-muted small fw-medium">Mostrando {newFeatured.length} productos</span>
                  <button className="btn btn-sm btn-outline-primary rounded-3 px-3">
                    Ver todos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('most_viewed_products') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                      <i className="fas fa-eye text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Productos Más Vistos</h6>
                      <p className="text-muted mb-0 small">Mayor tráfico y visualizaciones</p>
                    </div>
                  </div>
                
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 380 }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Producto</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Vistas</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Popularidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mostViewedProducts.map((product, index) => (
                        <tr key={product.id} className="border-0">
                          <td className="px-4 py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <img
                                  src={`/storage/images/item/${product.image}`}
                                  alt={product.name}
                                  className="rounded-3 shadow-sm"
                                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                  onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                />
                                <div className="position-absolute top-0 start-0 translate-middle">
                                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', fontSize: '10px' }}>
                                    <i className="fas fa-eye"></i>
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">{product.name}</div>
                                <span className="badge rounded-pill px-2 py-1" style={{ background: '#e0f2fe', color: '#0891b2', fontSize: '11px' }}>
                                  Trending
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '12px' }}>
                              {product.view_count}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#e0f2fe', color: '#0891b2', fontSize: '12px' }}>
                              <i className="fas fa-fire me-1"></i>Popular
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderRadius: '0 0 1rem 1rem' }}>
                  <span className="text-muted small fw-medium">Mostrando {mostViewedProducts.length} productos</span>
                  <a href='/admin/items' target='_blank' className="btn btn-sm btn-outline-primary rounded-3 px-3">
                    Ver todos
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('most_used_coupons') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                      <i className="fas fa-ticket-alt text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Cupones Más Utilizados</h6>
                      <p className="text-muted mb-0 small">Códigos de descuento populares</p>
                    </div>
                  </div>
                
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 380 }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Cupón</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Usos</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Valor</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCoupons.map((coupon, index) => (
                        <tr key={index} className="border-0">
                          <td className="px-4 py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <div className="rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' }}>
                                  <i className="fas fa-ticket-alt" style={{ color: '#8b5cf6', fontSize: '20px' }}></i>
                                </div>
                                <div className="position-absolute top-0 start-0 translate-middle">
                                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', fontSize: '10px' }}>
                                    #{index + 1}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">{coupon.code}</div>
                                <div className="text-muted small">{coupon.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '12px' }}>
                              {coupon.used_count}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dbeafe', color: '#2563eb', fontSize: '12px' }}>
                              {coupon.value}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#f3e8ff', color: '#8b5cf6', fontSize: '12px' }}>
                              {coupon.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderRadius: '0 0 1rem 1rem' }}>
                  <span className="text-muted small fw-medium">Mostrando {topCoupons.length} cupones</span>
                  <a href='/admin/coupons' target='_blank' className="btn btn-sm btn-outline-primary rounded-3 px-3">
                    Ver todos
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('most_used_discount_rules') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                      <i className="fas fa-percentage text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Reglas de Descuento Más Usadas</h6>
                      <p className="text-muted mb-0 small">Promociones más efectivas</p>
                    </div>
                  </div>
                
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 380 }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Regla</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Aplicaciones</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Ahorro Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDiscountRules.map((rule, index) => (
                        <tr key={index} className="border-0">
                          <td className="px-4 py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <div className="rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
                                  <i className="fas fa-percentage" style={{ color: '#10b981', fontSize: '20px' }}></i>
                                </div>
                                <div className="position-absolute top-0 start-0 translate-middle">
                                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontSize: '10px' }}>
                                    #{index + 1}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">{rule.name}</div>
                                <span className="badge rounded-pill px-2 py-1" style={{ background: '#d1fae5', color: '#059669', fontSize: '11px' }}>
                                  Activa
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '12px' }}>
                              {rule.times_used}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dbeafe', color: '#2563eb', fontSize: '12px' }}>
                              S/ {formatIncome(rule.total_discount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderRadius: '0 0 1rem 1rem' }}>
                  <span className="text-muted small fw-medium">Mostrando {topDiscountRules.length} reglas</span>
                  <a href="/admin/discount-rules" target='_blank' className="btn btn-sm btn-outline-primary rounded-3 px-3">
                    Ver todas
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('brands_listing') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
                      <i className="fas fa-copyright text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Listado de Marcas</h6>
                      <p className="text-muted mb-0 small">Gestión de marcas registradas</p>
                    </div>
                  </div>
             
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 380 }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Marca</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Estado</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Destacada</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Visible</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brands.map((brand, index) => (
                        <tr key={index} className="border-0">
                          <td className="px-4 py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <div className="rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)' }}>
                                  <i className="fas fa-copyright" style={{ color: '#f97316', fontSize: '20px' }}></i>
                                </div>
                                <div className="position-absolute top-0 start-0 translate-middle">
                                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', fontSize: '10px' }}>
                                    #{index + 1}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">{brand.name}</div>
                                <span className="badge rounded-pill px-2 py-1" style={{ background: '#fed7aa', color: '#ea580c', fontSize: '11px' }}>
                                  Marca
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className={`badge rounded-pill px-3 py-2 fw-semibold ${brand.status === 1 ? 'text-success' : 'text-danger'}`} style={{ background: brand.status === 1 ? '#dcfce7' : '#fee2e2', fontSize: '12px' }}>
                              {brand.status === 1 ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className={`badge rounded-pill px-3 py-2 fw-semibold ${brand.featured ? 'text-warning' : 'text-secondary'}`} style={{ background: brand.featured ? '#fef3c7' : '#f1f5f9', fontSize: '12px' }}>
                              {brand.featured ? 'Sí' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className={`badge rounded-pill px-3 py-2 fw-semibold ${brand.visible ? 'text-primary' : 'text-secondary'}`} style={{ background: brand.visible ? '#dbeafe' : '#f1f5f9', fontSize: '12px' }}>
                              {brand.visible ? 'Sí' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderRadius: '0 0 1rem 1rem' }}>
                  <span className="text-muted small fw-medium">Mostrando {brands.length} marcas</span>
                  <a href='/admin/brands' target='_blank' className="btn btn-sm btn-outline-primary rounded-3 px-3">
                    Ver todas
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {shouldShowCard('top_clients') && (
          <div className="col-xl-6 col-lg-6">
            <div className="card border-0 h-100" style={{ borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                      <i className="fas fa-crown text-white fs-5"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Mejores Clientes</h6>
                      <p className="text-muted mb-0 small">Clientes con mayor valor</p>
                    </div>
                  </div>
              
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 380 }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Cliente</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Pedidos</th>
                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Total Gastado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topClients.map((client, index) => (
                        <tr key={index} className="border-0">
                          <td className="px-4 py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <div className="rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
                                  <i className="fas fa-user" style={{ color: '#3b82f6', fontSize: '20px' }}></i>
                                </div>
                                <div className="position-absolute top-0 start-0 translate-middle">
                                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', fontSize: '10px' }}>
                                    #{index + 1}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">{client.email}</div>
                                <span className="badge rounded-pill px-2 py-1" style={{ background: '#dbeafe', color: '#2563eb', fontSize: '11px' }}>
                                  VIP
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dbeafe', color: '#2563eb', fontSize: '12px' }}>
                              {client.total_orders}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-0">
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '12px' }}>
                              S/ {formatIncome(client.total_spent)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderRadius: '0 0 1rem 1rem' }}>
                  <span className="text-muted small fw-medium">Mostrando {topClients.length} clientes</span>
                  <a href='/admin/clients' target='_blank' className="btn btn-sm btn-outline-primary rounded-3 px-3">
                    Ver todos
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>




      {/* Modern Visibility Configuration Modal */}
      {showVisibilityModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowVisibilityModal(false)}>
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
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Dashboard">
      <Home {...properties} />
    </BaseAdminto>
  );
});