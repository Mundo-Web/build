import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createRoot } from "react-dom/client";
import CreateReactScript from "../Utils/CreateReactScript";
import BaseAdminto from "../Components/Adminto/Base";
import Chart from "react-apexcharts";
import { Toaster, toast } from "sonner";
import HomeRest from "../Actions/Admin/HomeRest";
import Tippy from "@tippyjs/react";
import { CurrencySymbol } from "../Utils/Number2Currency";
import SellerTreeCard from "../Components/Adminto/SellerTreeCard";

const homeRest = new HomeRest();

const UI_STYLE = {
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.02)",
    pastel: {
        blue: {
            bg: "#eff6ff",
            text: "#1e40af",
            icon: "#3b82f6",
            badge: "#dbeafe",
        },
        green: {
            bg: "#f0fdf4",
            text: "#166534",
            icon: "#22c55e",
            badge: "#dcfce7",
        },
        amber: {
            bg: "#fffbeb",
            text: "#92400e",
            icon: "#f59e0b",
            badge: "#fef3c7",
        },
        indigo: {
            bg: "#eef2ff",
            text: "#3730a3",
            icon: "#6366f1",
            badge: "#e0e7ff",
        },
        rose: {
            bg: "#fff1f2",
            text: "#9f1239",
            icon: "#f43f5e",
            badge: "#ffe4e6",
        },
        violet: {
            bg: "#f5f3ff",
            text: "#5b21b6",
            icon: "#8b5cf6",
            badge: "#ede9fe",
        },
        pink: {
            bg: "#fdf2f8",
            text: "#9d174d",
            icon: "#ec4899",
            badge: "#fbcfe8",
        },
        slate: {
            bg: "#f8fafc",
            text: "#334155",
            icon: "#64748b",
            badge: "#f1f5f9",
        },
    },
};

const Home = ({
    session,
    totalProducts,
    totalStock,
    salesToday,
    salesMonth,
    salesYear,
    incomeToday,
    incomeMonth,
    incomeYear,
    topProducts,
    newFeatured,
    ordersByStatus,
    salesByLocation,
    topCoupons,
    topDiscountRules,
    brands,
    topClients,
    salesLast30Days,
    usersToday,
    usersMonth,
    usersYear,
    customerSatisfaction,
    // Mensajes de contacto
    messagesToday,
    messagesMonth,
    messagesYear,
    messagesUnread,
    dashboardVisibility,
    hasRootRole,
    mostViewedProducts,
    visitsThisMonth,
    categoriesWithProducts,
    brandsWithProducts,
    totalCategories,
    totalBrands,
    totalActiveProducts,
    // Nuevos props de servicios
    totalServices,
    totalServiceCategories,
    featuredServices,
    mostViewedServices,
    mostClickedServices,
    serviceClicksToday,
    serviceClicksMonth,
    serviceClicksYear,
    uniqueClickersMonth,
    serviceCTR,
    serviceVisitsThisMonth,
    serviceViewsByDevice,
    serviceViewsLast30Days,
    serviceClicksThisMonth,
    serviceClicksByDevice,
    serviceClicksTodayByDevice,
    serviceViewsTodayByDevice,
    hasServicesFeature, // Indica si el proyecto usa servicios
    // Props de clicks de productos
    mostClickedProducts,
    productClicksToday,
    productClicksMonth,
    productClicksYear,
    uniqueProductClickersMonth,
    productCTR,
    productClicksThisMonth,
    productClicksByDevice,
    productClicksTodayByDevice,
    productViewsByDevice,
    productViewsTodayByDevice,
    pendingProductsCount,
    // Nuevas props de analítica avanzada
    bounceRate,
    avgSessionDuration,
    aov,
    cvr,
    realTimeUsers,
    trafficSources,
    funnelData,
    sessionTrend,
    bounceTrend,
    durationTrend,
    avgOrderPreparationTime,
}) => {
    const [startDate, setStartDate] = useState(
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    );
    const [endDate, setEndDate] = useState(new Date());

    // Estados para gestión de visibilidad de cards
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [cardVisibility, setCardVisibility] = useState(
        dashboardVisibility || {},
    );
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

    const renderSparkline = (data, color) => {
        return (
            <Chart
                options={{
                    chart: {
                        sparkline: { enabled: true },
                        animations: { enabled: false },
                        toolbar: { show: false },
                    },
                    stroke: { curve: "smooth", width: 2 },
                    fill: {
                        type: "gradient",
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.45,
                            opacityTo: 0.05,
                            stops: [20, 100, 100, 100],
                        },
                    },
                    colors: [color],
                    tooltip: { enabled: false },
                }}
                series={[{ data: data || [] }]}
                type="area"
                height={50}
            />
        );
    };

    const MetricCard = ({
        title,
        value,
        icon,
        color,
        trend,
        trendIcon,
        subtitle,
        sparkline,
        help,
    }) => {
        const style = UI_STYLE.pastel[color] || UI_STYLE.pastel.blue;
        return (
            <div
                className="card h-100 border-0"
                style={{
                    borderRadius: UI_STYLE.borderRadius,
                    boxShadow: UI_STYLE.boxShadow,
                    background: "#fff",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <div className="card-body p-4 d-flex flex-column h-100">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div
                            className="p-3 rounded-4"
                            style={{
                                backgroundColor: style.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "56px",
                                height: "56px",
                            }}
                        >
                            <i
                                className={`${icon} fs-3`}
                                style={{ color: style.icon }}
                            ></i>
                        </div>
                        <div className="d-flex gap-2">
                            {help && (
                                <Tippy content={help}>
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center bg-light text-muted cursor-help"
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                        }}
                                    >
                                        <i className="fas fa-question extra-small"></i>
                                    </div>
                                </Tippy>
                            )}
                            {trend && (
                                <div
                                    className="badge rounded-pill px-3 py-2"
                                    style={{
                                        backgroundColor: style.badge,
                                        color: style.text,
                                        fontSize: "0.75rem",
                                        fontWeight: "800",
                                    }}
                                >
                                    <i className={`fas ${trendIcon} me-1`}></i>{" "}
                                    {trend}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div
                            className="text-muted small fw-bold text-uppercase tracking-widest mb-1"
                            style={{ fontSize: "0.65rem" }}
                        >
                            {title}
                        </div>
                        <h2
                            className="fw-bold mb-1"
                            style={{
                                color: "#0f172a",
                                fontSize: "1.85rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {value}
                        </h2>
                        {subtitle && (
                            <div
                                className="text-muted small fw-medium"
                                style={{ fontSize: "0.8rem" }}
                            >
                                {subtitle}
                            </div>
                        )}
                    </div>
                    {sparkline && (
                        <div className="mt-auto pt-4">{sparkline}</div>
                    )}
                </div>
            </div>
        );
    };

    // Funciones para gestión de visibilidad de cards
    const handleToggleCardVisibility = (cardId) => {
        setCardVisibility((prev) => ({
            ...prev,
            [cardId]: !prev[cardId],
        }));
    };

    const handleSaveVisibility = async () => {
        setSavingVisibility(true);
        try {
            const response =
                await homeRest.updateDashboardVisibility(cardVisibility);

            if (response.success) {
                toast.success(
                    "Configuración de visibilidad actualizada correctamente",
                );
                // Recargar la página para reflejar los cambios
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // toast.error(response.message || 'Error al actualizar la configuración');
            }
        } catch (error) {
            console.error("Error updating dashboard visibility:", error);
            toast.error(
                "Error al actualizar la configuración: " + error.message,
            );
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
        total_orders: { name: "Total de Órdenes", category: "KPI" },
        total_revenue: { name: "Ingresos Totales", category: "KPI" },
        new_users: { name: "Nuevos Usuarios", category: "KPI" },
        contact_messages: { name: "Mensajes de Contacto", category: "KPI" },
        customer_satisfaction: {
            name: "Satisfacción del Cliente",
            category: "KPI",
        },
        total_categories: { name: "Total Categorías", category: "KPI" },
        total_brands: { name: "Total Marcas", category: "KPI" },
        total_products: { name: "Total Productos", category: "KPI" },
        statistics_chart: {
            name: "Estadísticas de Ventas",
            category: "Gráficos",
        },
        orders_statistics: {
            name: "Estadísticas de Órdenes",
            category: "Gráficos",
        },
        sales_by_location: {
            name: "Ventas por Ubicación",
            category: "Gráficos",
        },
        visits_chart: { name: "Visitas del Mes", category: "Gráficos" },
        categories_chart: {
            name: "Productos por Categoría",
            category: "Gráficos",
        },
        brands_chart: { name: "Productos por Marca", category: "Gráficos" },
        top_selling_products: {
            name: "Productos Más Vendidos",
            category: "Tablas",
        },
        most_viewed_products: {
            name: "Productos Más Vistos",
            category: "Tablas",
        },
        new_featured_products: {
            name: "Nuevos Productos Destacados",
            category: "Tablas",
        },
        most_used_coupons: {
            name: "Cupones Más Utilizados",
            category: "Tablas",
        },
        most_used_discount_rules: {
            name: "Reglas de Descuento Más Utilizadas",
            category: "Tablas",
        },
        brands_listing: { name: "Listado de Marcas", category: "Tablas" },
        top_clients: { name: "Mejores Clientes", category: "Tablas" },
        average_order_duration: {
            name: "Tiempo de Prep. Pedido",
            category: "KPI",
        },
        // Analíticas de Servicios
        total_services_kpi: { name: "Total Servicios", category: "KPI" },
        total_service_categories: {
            name: "Categorías de Servicios",
            category: "KPI",
        },
        service_clicks_kpi: { name: "Clicks en Servicios", category: "KPI" },
        service_ctr_kpi: { name: "CTR de Servicios", category: "KPI" },
        most_viewed_services: {
            name: "Servicios Más Vistos",
            category: "Tablas",
        },
        most_clicked_services: {
            name: "Servicios Más Clickeados",
            category: "Tablas",
        },
        service_visits_chart: {
            name: "Visitas de Servicios del Mes",
            category: "Gráficos",
        },
        service_clicks_chart: {
            name: "Clicks de Servicios del Mes",
            category: "Gráficos",
        },
        service_views_by_device: {
            name: "Vistas por Dispositivo (Servicios)",
            category: "Gráficos",
        },
        service_clicks_by_device: {
            name: "Clicks por Dispositivo (Servicios)",
            category: "Gráficos",
        },
        service_views_trend: {
            name: "Tendencia de Vistas de Servicios",
            category: "Gráficos",
        },
        service_clicks_vs_views: {
            name: "Clicks vs Vistas (30 días)",
            category: "Gráficos",
        },
        // Analíticas de Productos
        product_clicks_kpi: { name: "Clicks en Productos", category: "KPI" },
        product_ctr_kpi: { name: "CTR de Productos", category: "KPI" },
        most_clicked_products: {
            name: "Productos Más Clickeados",
            category: "Tablas",
        },
        product_clicks_chart: {
            name: "Clicks de Productos del Mes",
            category: "Gráficos",
        },
        product_clicks_by_device: {
            name: "Clicks de Productos por Dispositivo",
            category: "Gráficos",
        },
        product_views_by_device: {
            name: "Vistas de Productos por Dispositivo",
            category: "Gráficos",
        },
        // Organigrama de Vendedores
        seller_tree: {
            name: "Organigrama de Vendedores",
            category: "Tablas",
        },
        pending_products: {
            name: "Productos Pendientes de Revisión",
            category: "KPI",
        },
        // Analítica Avanzada
        advanced_analytics_section: {
            name: "Sección de Analítica Avanzada",
            category: "Gráficos",
        },
        traffic_sources_chart: {
            name: "Fuentes de Tráfico",
            category: "Gráficos",
        },
        conversion_funnel: {
            name: "Embudo de Conversión",
            category: "Gráficos",
        },
    };

    const CARD_CATEGORIES = {
        KPI: { name: "Indicadores KPI", icon: "fas fa-chart-line" },
        Gráficos: { name: "Gráficos y Estadísticas", icon: "fas fa-chart-pie" },
        Tablas: { name: "Tablas de Datos", icon: "fas fa-table" },
    };

    return (
        <div
            className="dashboard-container"
            style={{
                backgroundColor: "#f8fafc",
                minHeight: "100vh",
                padding: "1.5rem",
            }}
        >
            <Toaster position="top-right" richColors />

            {/* Modern Header */}
            <div className="dashboard-header mb-5">
                <style>{`
                    .card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                    .card:hover { transform: translateY(-7px) scale(1.02); box-shadow: 0 25px 50px rgba(0,0,0,0.06) !important; }
                    .dashboard-container { background-color: #f8fafc; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
                    .badge { border: none; letter-spacing: 0.02em; }
                    .rounded-4 { border-radius: 1.25rem !important; }
                    .rounded-5 { border-radius: 1.5rem !important; }
                    .extra-small { font-size: 0.75rem; }
                `}</style>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2
                            className="mb-2 fw-bold text-dark"
                            style={{ letterSpacing: "-0.03em" }}
                        >
                            Dashboard
                        </h2>
                        <p className="text-muted mb-0 fs-6 fw-medium">
                            Bienvenido de vuelta, aquí tienes un resumen de tu
                            negocio
                        </p>
                    </div>
                    {hasRootRole && (
                        <div className="d-flex gap-3">
                            <Tippy content="Actualizar datos">
                                <button
                                    className="btn btn-white shadow-sm px-3 py-2 border-0 rounded-4"
                                    style={{ background: "#fff" }}
                                >
                                    <i className="fas fa-sync-alt text-primary"></i>
                                </button>
                            </Tippy>
                            <Tippy content="Configurar visibilidad de cards">
                                <button
                                    className="btn btn-primary px-4 py-2 rounded-4 fw-bold shadow-primary"
                                    onClick={() => setShowVisibilityModal(true)}
                                    style={{
                                        boxShadow:
                                            "0 8px 20px rgba(79, 70, 229, 0.2)",
                                    }}
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
                {shouldShowCard("total_orders") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Órdenes Hoy"
                            value={salesToday || "0"}
                            icon="fas fa-shopping-cart"
                            color="indigo"
                            trend="+12%"
                            trendIcon="fa-arrow-up"
                            subtitle={`Este mes: ${salesMonth || "0"}`}
                            help="Número total de pedidos realizados durante el día de hoy."
                        />
                    </div>
                )}
                {shouldShowCard("total_revenue") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Ingresos Hoy"
                            value={`${CurrencySymbol()} ${formatIncome(incomeToday) || "0"}`}
                            icon="fas fa-dollar-sign"
                            color="green"
                            trend="+32%"
                            trendIcon="fa-arrow-up"
                            subtitle={`Este mes: ${CurrencySymbol()} ${formatIncome(incomeMonth) || "0"}`}
                            help="Monto monetario total generado por las ventas de hoy (basado en el valor de las órdenes)."
                        />
                    </div>
                )}
                {shouldShowCard("new_users") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Usuarios Hoy"
                            value={usersToday || "0"}
                            icon="fas fa-user-plus"
                            color="amber"
                            trend="+8%"
                            trendIcon="fa-arrow-up"
                            subtitle={`Este mes: ${usersMonth || "0"}`}
                            help="Nuevos usuarios registrados en la plataforma durante el día actual."
                        />
                    </div>
                )}
                {shouldShowCard("contact_messages") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Mensajes Hoy"
                            value={messagesToday || "0"}
                            icon="fas fa-envelope"
                            color="violet"
                            trend={
                                messagesUnread > 0
                                    ? `${messagesUnread} sin leer`
                                    : "Al día"
                            }
                            trendIcon={
                                messagesUnread > 0 ? "fa-bell" : "fa-check"
                            }
                            subtitle={`Este mes: ${messagesMonth || "0"}`}
                            help="Mensajes recibidos a través del formulario de contacto o CRM hoy."
                        />
                    </div>
                )}
                {shouldShowCard("pending_products") &&
                    pendingProductsCount > 0 && (
                        <div className="col-xl-3 col-md-6">
                            <MetricCard
                                title="Productos por Revisar"
                                value={pendingProductsCount || "0"}
                                icon="fas fa-exclamation-triangle"
                                color="rose"
                                trend="Urgente"
                                trendIcon="fa-clock"
                                subtitle="Proveedores esperando"
                            />
                        </div>
                    )}
                {shouldShowCard("customer_satisfaction") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Satisfacción"
                            value={`${customerSatisfaction || "0"}%`}
                            icon="fas fa-smile"
                            color="blue"
                            trend="Alta"
                            trendIcon="fa-smile"
                            subtitle="Promedio mensual"
                            help="Índice de satisfacción calculado en base a las reseñas y feedback de los clientes."
                        />
                    </div>
                )}
                {shouldShowCard("total_categories") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Categorías"
                            value={totalCategories || "0"}
                            icon="fas fa-tags"
                            color="amber"
                            trend="100%"
                            trendIcon="fa-check"
                            subtitle="Activas en tienda"
                        />
                    </div>
                )}
                {shouldShowCard("total_brands") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Marcas"
                            value={totalBrands || "0"}
                            icon="fas fa-copyright"
                            color="indigo"
                            trend="100%"
                            trendIcon="fa-check"
                            subtitle="Marcas activas"
                        />
                    </div>
                )}
                {hasServicesFeature &&
                    shouldShowCard("total_service_categories") && (
                        <div className="col-xl-3 col-md-6">
                            <MetricCard
                                title="Cat. Servicios"
                                value={totalServiceCategories || "0"}
                                icon="fas fa-layer-group"
                                color="rose"
                                trend="Activas"
                                trendIcon="fa-check"
                                subtitle="Categorías de servicios"
                            />
                        </div>
                    )}
                {shouldShowCard("total_products") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Productos"
                            value={totalActiveProducts || "0"}
                            icon="fas fa-box"
                            color="rose"
                            trend="Activos"
                            trendIcon="fa-check"
                            subtitle="Total productos"
                        />
                    </div>
                )}
                {shouldShowCard("total_services_kpi") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Servicios"
                            value={totalServices || "0"}
                            icon="fas fa-concierge-bell"
                            color="indigo"
                            trend={`${featuredServices || "0"} Destacados`}
                            trendIcon="fa-star"
                            subtitle="Servicios activos"
                        />
                    </div>
                )}
                {shouldShowCard("service_clicks_kpi") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Clicks en Servicios"
                            value={serviceClicksMonth || "0"}
                            icon="fas fa-mouse-pointer"
                            color="amber"
                            trend={`Hoy: ${serviceClicksToday || "0"}`}
                            trendIcon="fa-hand-pointer"
                            subtitle="Interacciones del mes"
                            help="Total de clics realizados en los servicios ofrecidos durante el mes actual."
                        />
                    </div>
                )}
                {shouldShowCard("service_ctr_kpi") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="CTR Servicios"
                            value={`${serviceCTR || "0"}%`}
                            icon="fas fa-bullseye"
                            color="green"
                            trend="Eficiencia"
                            trendIcon="fa-percentage"
                            subtitle={`Clicks únicos: ${uniqueClickersMonth || "0"}`}
                            help="Ratio de clic (Click-Through Rate). Indica qué porcentaje de usuarios que ven un servicio terminan haciendo clic."
                        />
                    </div>
                )}
                {shouldShowCard("average_order_duration") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Prep. Pedido"
                            value={
                                avgOrderPreparationTime
                                    ? `${avgOrderPreparationTime}h`
                                    : "0h"
                            }
                            icon="fas fa-shipping-fast"
                            color="indigo"
                            trend="Promedio"
                            trendIcon="fa-clock"
                            subtitle="Tiempo de procesamiento"
                            help="Tiempo promedio transcurrido desde que se registra el pago hasta que el pedido es marcado como enviado."
                        />
                    </div>
                )}
                {shouldShowCard("product_clicks_kpi") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="Clicks Productos"
                            value={productClicksMonth || "0"}
                            icon="fas fa-eye"
                            color="amber"
                            trend={`Hoy: ${productClicksToday || "0"}`}
                            trendIcon="fa-fingerprint"
                            subtitle="Vistas de productos"
                        />
                    </div>
                )}
                {shouldShowCard("product_ctr_kpi") && (
                    <div className="col-xl-3 col-md-6">
                        <MetricCard
                            title="CTR Productos"
                            value={`${productCTR || "0"}%`}
                            icon="fas fa-percentage"
                            color="violet"
                            trend="Clicks únicos"
                            trendIcon="fa-user-check"
                            subtitle={`${uniqueProductClickersMonth || "0"} interesados`}
                        />
                    </div>
                )}
            </div>

            {/* Análisis Analítico Avanzado (estilo Google Analytics) */}
            {shouldShowCard("advanced_analytics_section") && (
                <>
                    <div className="dashboard-header mb-4 mt-5">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="rounded-4 p-3"
                                    style={{
                                        background: UI_STYLE.pastel.indigo.bg,
                                    }}
                                >
                                    <i
                                        className="fas fa-chart-line fs-4"
                                        style={{
                                            color: UI_STYLE.pastel.indigo.icon,
                                        }}
                                    ></i>
                                </div>
                                <div>
                                    <h4
                                        className="mb-0 fw-bold text-dark"
                                        style={{ letterSpacing: "-0.02em" }}
                                    >
                                        Análisis Analítico Avanzado
                                    </h4>
                                    <p className="text-muted mb-0 small fw-medium">
                                        Rendimiento y comportamiento detallado
                                        de tus usuarios
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex gap-3 align-items-center">
                                <Tippy content="Generar enlaces de prueba para validar el rastreo">
                                    <button
                                        className="btn btn-white shadow-sm px-3 py-2 border-0 rounded-4 fw-bold small"
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "test-acquisition-panel",
                                                )
                                                ?.scrollIntoView({
                                                    behavior: "smooth",
                                                })
                                        }
                                    >
                                        <i className="fas fa-vial me-2 text-primary"></i>{" "}
                                        Probar Rastreo
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                    </div>

                    {/* KPI de Rendimiento Analítico con Sparklines */}
                    {/* KPI de Rendimiento Analítico con Sparklines */}
                    <div className="row g-4 mb-5">
                        <div className="col-xl col-md-4">
                            <MetricCard
                                title="Sesiones (7d)"
                                value={
                                    sessionTrend
                                        ? sessionTrend.reduce(
                                              (a, b) => a + b,
                                              0,
                                          )
                                        : 0
                                }
                                icon="fas fa-users"
                                color="indigo"
                                trend="LIVE"
                                trendIcon="fa-circle text-success extra-small"
                                sparkline={renderSparkline(
                                    sessionTrend,
                                    UI_STYLE.pastel.indigo.icon,
                                )}
                                help="Cantidad total de sesiones (visitas) iniciadas en los últimos 7 días."
                            />
                        </div>

                        <div className="col-xl col-md-4">
                            <MetricCard
                                title="Tasa de Rebote"
                                value={`${bounceRate || 0}%`}
                                icon="fas fa-door-open"
                                color={bounceRate > 60 ? "rose" : "green"}
                                trend={bounceRate > 60 ? "Alto" : "Sano"}
                                trendIcon={
                                    bounceRate > 60
                                        ? "fa-exclamation-triangle"
                                        : "fa-check-circle"
                                }
                                sparkline={renderSparkline(
                                    bounceTrend,
                                    bounceRate > 60
                                        ? UI_STYLE.pastel.rose.icon
                                        : UI_STYLE.pastel.green.icon,
                                )}
                                help="Porcentaje de visitantes que abandonan el sitio después de ver solo una página."
                            />
                        </div>

                        <div className="col-xl col-md-4">
                            <MetricCard
                                title="Permanencia Media"
                                value={`${avgSessionDuration || 0}m`}
                                icon="fas fa-hourglass-half"
                                color="amber"
                                trend="Engagement"
                                trendIcon="fa-bolt"
                                sparkline={renderSparkline(
                                    durationTrend,
                                    UI_STYLE.pastel.amber.icon,
                                )}
                                help="Tiempo promedio que un usuario pasa navegando en la tienda por sesión."
                            />
                        </div>

                        <div className="col-xl col-md-6">
                            <MetricCard
                                title="Ticket Promedio (AOV)"
                                value={`${CurrencySymbol()} ${aov || 0}`}
                                icon="fas fa-shopping-basket"
                                color="green"
                                trend="Venta Media"
                                trendIcon="fa-chart-pie"
                                subtitle="Eficiencia de revenue por cliente"
                            />
                        </div>

                        <div className="col-xl col-md-6">
                            <MetricCard
                                title="Conversión (CVR)"
                                value={`${cvr || 0}%`}
                                icon="fas fa-bullseye"
                                color="violet"
                                trend="Efectividad"
                                trendIcon="fa-crosshairs"
                                subtitle="Cierre de ventas confirmado"
                            />
                        </div>
                    </div>

                    <div className="row g-4 mb-5">
                        {/* Gráfico Fuentes de Tráfico Mejorado */}
                        {shouldShowCard("traffic_sources_chart") && (
                            <div className="col-lg-6">
                                <div
                                    className="card border-0 shadow-sm h-100"
                                    style={{
                                        borderRadius: UI_STYLE.borderRadius,
                                    }}
                                >
                                    <div
                                        className="card-header bg-white border-0 p-4"
                                        style={{
                                            borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                        }}
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h6 className="mb-0 fw-bold text-dark">
                                                Adquisición de Usuarios (Fuentes
                                                & UTMs)
                                            </h6>
                                            <Tippy content="Rastreo automático de referidos y parámetros UTM de marketing.">
                                                <i className="fas fa-question-circle text-muted cursor-help"></i>
                                            </Tippy>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "pie",
                                                    toolbar: { show: false },
                                                },
                                                labels: Object.keys(
                                                    trafficSources || {},
                                                ),
                                                colors: [
                                                    UI_STYLE.pastel.indigo.icon,
                                                    "#0ea5e9",
                                                    UI_STYLE.pastel.rose.icon,
                                                    UI_STYLE.pastel.green.icon,
                                                    "#000",
                                                    UI_STYLE.pastel.violet.icon,
                                                    "#94a3b8",
                                                ],
                                                plotOptions: {
                                                    pie: {
                                                        expandOnClick: true,
                                                        dataLabels: {
                                                            offset: -25,
                                                        },
                                                    },
                                                },
                                                legend: {
                                                    position: "bottom",
                                                    fontSize: "11px",
                                                    markers: { radius: 12 },
                                                    offsetY: 0,
                                                },
                                                stroke: {
                                                    width: 4,
                                                    colors: ["#fff"],
                                                },
                                                dataLabels: {
                                                    enabled: true,
                                                    style: {
                                                        fontSize: "10px",
                                                        fontWeight: "bold",
                                                        colors: ["#fff"],
                                                    },
                                                    dropShadow: {
                                                        enabled: false,
                                                    },
                                                },
                                                tooltip: {
                                                    theme: "dark",
                                                    style: {
                                                        fontSize: "12px",
                                                        colors: ["#fff"],
                                                    },
                                                },
                                            }}
                                            series={Object.values(
                                                trafficSources || {},
                                            )}
                                            type="pie"
                                            height={350}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Embudo de Conversión Mejorado */}
                        {shouldShowCard("conversion_funnel") && (
                            <div className="col-lg-6">
                                <div
                                    className="card border-0 shadow-sm h-100"
                                    style={{
                                        borderRadius: UI_STYLE.borderRadius,
                                    }}
                                >
                                    <div
                                        className="card-header bg-white border-0 p-4"
                                        style={{
                                            borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                        }}
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h6 className="mb-0 fw-bold text-dark">
                                                Embudo de Conversión
                                            </h6>
                                            <Tippy content="Muestra el viaje del usuario desde que entra hasta que compra. Sesiones -> Vistas de Producto -> Ventas Finales.">
                                                <i className="fas fa-question-circle text-muted cursor-help"></i>
                                            </Tippy>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "bar",
                                                    toolbar: { show: false },
                                                },
                                                plotOptions: {
                                                    bar: {
                                                        borderRadius: 12,
                                                        horizontal: true,
                                                        distributed: true,
                                                        barHeight: "65%",
                                                        dataLabels: {
                                                            position: "top",
                                                        },
                                                    },
                                                },
                                                colors: [
                                                    UI_STYLE.pastel.indigo.icon,
                                                    UI_STYLE.pastel.amber.icon,
                                                    UI_STYLE.pastel.green.icon,
                                                ],
                                                xaxis: {
                                                    categories: (
                                                        funnelData || []
                                                    ).map((i) => i.label),
                                                    labels: { show: false },
                                                    axisBorder: { show: false },
                                                    axisTicks: { show: false },
                                                },
                                                grid: { show: false },
                                                legend: { show: false },
                                                dataLabels: {
                                                    enabled: true,
                                                    textAnchor: "start",
                                                    style: {
                                                        fontSize: "10px",
                                                        colors: ["#fff"],
                                                        fontWeight: "700",
                                                    },
                                                    formatter: function (
                                                        val,
                                                        opt,
                                                    ) {
                                                        return val;
                                                    },
                                                    offsetX: 5,
                                                    dropShadow: {
                                                        enabled: true,
                                                    },
                                                },
                                                tooltip: {
                                                    theme: "dark",
                                                    y: {
                                                        formatter: function (
                                                            val,
                                                        ) {
                                                            return (
                                                                val +
                                                                " usuarios"
                                                            );
                                                        },
                                                    },
                                                },
                                            }}
                                            series={[
                                                {
                                                    name: "Usuarios",
                                                    data: (
                                                        funnelData || []
                                                    ).map((i) => i.value),
                                                },
                                            ]}
                                            type="bar"
                                            height={350}
                                        />
                                        <div
                                            className="mt-3 p-3 text-center rounded-4"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.indigo.bg,
                                            }}
                                        >
                                            <div className="small text-muted mb-1 fw-bold">
                                                Tasa de Conversión Global
                                            </div>
                                            <div
                                                className="h4 fw-bold mb-0"
                                                style={{
                                                    color: UI_STYLE.pastel
                                                        .indigo.icon,
                                                }}
                                            >
                                                {cvr}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Panel de Pruebas de Adquisición */}
                    <div
                        id="test-acquisition-panel"
                        className="card border-0 shadow-sm mb-5"
                        style={{
                            background: "#f8fafc",
                            borderRadius: UI_STYLE.borderRadius,
                        }}
                    >
                        <div className="card-body p-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 bg-white rounded-4 shadow-sm">
                                    <i className="fas fa-vial text-primary fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold">
                                        Panel de Pruebas de Adquisición
                                    </h5>
                                    <p className="text-muted small mb-0">
                                        Genera enlaces UTM para probar el
                                        sistema de atribución
                                    </p>
                                </div>
                            </div>

                            <div className="row g-4">
                                <div className="col-md-7">
                                    <div className="d-flex flex-wrap gap-2">
                                        {[
                                            {
                                                name: "Facebook Ads",
                                                utm: "?utm_source=facebook&utm_medium=cpc&utm_campaign=black_friday",
                                                icon: "fab fa-facebook",
                                            },
                                            {
                                                name: "Google Ads",
                                                utm: "?utm_source=google&utm_medium=search&utm_campaign=brand_awareness",
                                                icon: "fab fa-google",
                                            },
                                            {
                                                name: "TikTok Promo",
                                                utm: "?utm_source=tiktok&utm_medium=referral&utm_campaign=influencer_x",
                                                icon: "fab fa-tiktok",
                                            },
                                            {
                                                name: "WhatsApp",
                                                utm: "?utm_source=whatsapp&utm_medium=chat&utm_campaign=oferta_verano",
                                                icon: "fab fa-whatsapp",
                                            },
                                        ].map((test, idx) => (
                                            <a
                                                key={idx}
                                                href={`${window.location.origin}${test.utm}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-white border-0 shadow-sm rounded-4 py-3 px-4 fw-bold"
                                                style={{
                                                    transition: "all 0.3s",
                                                }}
                                            >
                                                <i
                                                    className={`${test.icon} me-2 text-primary`}
                                                ></i>
                                                {test.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-5 border-start">
                                    <div className="ps-md-4">
                                        <p className="small fw-bold text-dark mb-2">
                                            Instrucciones de Prueba
                                        </p>
                                        <ul
                                            className="small text-muted ps-3 mb-0"
                                            style={{ lineHeight: "1.6" }}
                                        >
                                            <li>
                                                Haz clic en un canal para abrir
                                                la tienda con UTMs.
                                            </li>
                                            <li>
                                                Navega por varias páginas (evita
                                                el "Rebote").
                                            </li>
                                            <li>
                                                Regresa y refresca para ver el
                                                impacto en las gráficas.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modern Statistics Chart */}
            {shouldShowCard("statistics_chart") && (
                <div className="row g-4 mb-5">
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.indigo.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-chart-bar fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel
                                                        .indigo.icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Estadísticas de Ventas e
                                                Ingresos
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Análisis comparativo de pedidos
                                                vs valor monetario
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                {(() => {
                                    // Filtrar datos por rango de fechas
                                    const filteredData = salesLast30Days.filter(
                                        (d) => {
                                            const date = new Date(d.date);
                                            return (
                                                date >= startDate &&
                                                date <= endDate
                                            );
                                        },
                                    );
                                    return (
                                        <>
                                            <Chart
                                                options={{
                                                    chart: {
                                                        id: "ventas30dias",
                                                        toolbar: {
                                                            show: false,
                                                        },
                                                        background:
                                                            "transparent",
                                                        fontFamily:
                                                            "'Inter', sans-serif",
                                                    },
                                                    grid: {
                                                        borderColor: "#f1f5f9",
                                                        strokeDashArray: 4,
                                                        xaxis: {
                                                            lines: {
                                                                show: false,
                                                            },
                                                        },
                                                        yaxis: {
                                                            lines: {
                                                                show: true,
                                                            },
                                                        },
                                                    },
                                                    xaxis: {
                                                        categories:
                                                            filteredData.map(
                                                                (d) => d.date,
                                                            ),
                                                        labels: {
                                                            rotate: -45,
                                                            style: {
                                                                colors: "#94a3b8",
                                                                fontSize:
                                                                    "11px",
                                                            },
                                                        },
                                                        axisBorder: {
                                                            show: false,
                                                        },
                                                        axisTicks: {
                                                            show: false,
                                                        },
                                                    },
                                                    yaxis: [
                                                        {
                                                            title: {
                                                                text: "Pedidos",
                                                                style: {
                                                                    color: UI_STYLE
                                                                        .pastel
                                                                        .indigo
                                                                        .icon,
                                                                    fontSize:
                                                                        "12px",
                                                                    fontWeight: 600,
                                                                },
                                                            },
                                                            labels: {
                                                                style: {
                                                                    colors: UI_STYLE
                                                                        .pastel
                                                                        .indigo
                                                                        .icon,
                                                                    fontSize:
                                                                        "11px",
                                                                },
                                                            },
                                                            min: 0,
                                                        },
                                                        {
                                                            opposite: true,
                                                            title: {
                                                                text: `Ingresos (${CurrencySymbol()})`,
                                                                style: {
                                                                    color: UI_STYLE
                                                                        .pastel
                                                                        .green
                                                                        .icon,
                                                                    fontSize:
                                                                        "12px",
                                                                    fontWeight: 600,
                                                                },
                                                            },
                                                            labels: {
                                                                style: {
                                                                    colors: UI_STYLE
                                                                        .pastel
                                                                        .green
                                                                        .icon,
                                                                    fontSize:
                                                                        "11px",
                                                                },
                                                            },
                                                            min: 0,
                                                        },
                                                    ],
                                                    dataLabels: {
                                                        enabled: false,
                                                    },
                                                    stroke: {
                                                        curve: "smooth",
                                                        width: [0, 4],
                                                    },
                                                    colors: [
                                                        UI_STYLE.pastel.indigo
                                                            .icon,
                                                        UI_STYLE.pastel.green
                                                            .icon,
                                                    ],
                                                    fill: {
                                                        opacity: [0.35, 1],
                                                        type: [
                                                            "gradient",
                                                            "solid",
                                                        ],
                                                    },
                                                    plotOptions: {
                                                        bar: {
                                                            borderRadius: 6,
                                                            columnWidth: "50%",
                                                        },
                                                    },
                                                    tooltip: {
                                                        theme: "light",
                                                        x: { show: true },
                                                        style: {
                                                            fontSize: "12px",
                                                        },
                                                    },
                                                    legend: {
                                                        position: "top",
                                                        horizontalAlign:
                                                            "right",
                                                        fontWeight: 600,
                                                        markers: { radius: 12 },
                                                    },
                                                }}
                                                series={[
                                                    {
                                                        name: "Pedidos",
                                                        type: "column",
                                                        data: filteredData.map(
                                                            (d) =>
                                                                d.orders || 0,
                                                        ),
                                                        yAxisIndex: 0,
                                                    },
                                                    {
                                                        name: "Ventas",
                                                        type: "line",
                                                        data: filteredData.map(
                                                            (d) => d.amount,
                                                        ),
                                                        yAxisIndex: 1,
                                                    },
                                                ]}
                                                type="line"
                                                height={350}
                                            />
                                            <div
                                                className="mt-4 p-4 rounded-4"
                                                style={{
                                                    background: "#f8fafc",
                                                    border: "1px solid #f1f5f9",
                                                }}
                                            >
                                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                                    <span className="text-muted fw-bold small">
                                                        <i className="fas fa-calendar-alt me-2"></i>
                                                        FILTRAR RANGO:
                                                    </span>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <DatePicker
                                                            selected={startDate}
                                                            onChange={(date) =>
                                                                setStartDate(
                                                                    date,
                                                                )
                                                            }
                                                            selectsStart
                                                            startDate={
                                                                startDate
                                                            }
                                                            endDate={endDate}
                                                            dateFormat="yyyy-MM-dd"
                                                            className="form-control form-control-sm border-0 shadow-sm rounded-3 px-3"
                                                            maxDate={endDate}
                                                        />
                                                        <span className="text-muted small fw-bold">
                                                            AL
                                                        </span>
                                                        <DatePicker
                                                            selected={endDate}
                                                            onChange={(date) =>
                                                                setEndDate(date)
                                                            }
                                                            selectsEnd
                                                            startDate={
                                                                startDate
                                                            }
                                                            endDate={endDate}
                                                            minDate={startDate}
                                                            dateFormat="yyyy-MM-dd"
                                                            className="form-control form-control-sm border-0 shadow-sm rounded-3 px-3"
                                                        />
                                                    </div>
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
            {shouldShowCard("visits_this_month") && (
                <div className="row g-4 mb-5">
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.blue.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-chart-line fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.blue
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Visitas de Productos del Mes
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Tendencia de tráfico diario en
                                                la tienda
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        plotOptions: {
                                            bar: {
                                                borderRadius: 8,
                                                columnWidth: "60%",
                                                dataLabels: { position: "top" },
                                            },
                                        },
                                        xaxis: {
                                            categories: visitsThisMonth.map(
                                                (v) => v.date,
                                            ),
                                            labels: {
                                                rotate: -45,
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "11px",
                                                },
                                            },
                                            axisBorder: { show: false },
                                            axisTicks: { show: false },
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: "#64748b",
                                                    fontSize: "11px",
                                                },
                                            },
                                            min: 0,
                                        },
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                            xaxis: { lines: { show: false } },
                                            yaxis: { lines: { show: true } },
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            style: {
                                                fontSize: "10px",
                                                fontWeight: "bold",
                                                colors: [
                                                    UI_STYLE.pastel.blue.icon,
                                                ],
                                            },
                                            offsetY: -20,
                                        },
                                        colors: [UI_STYLE.pastel.blue.icon],
                                        fill: {
                                            opacity: 0.85,
                                            type: "gradient",
                                            gradient: {
                                                shade: "light",
                                                type: "vertical",
                                                opacityFrom: 0.85,
                                                opacityTo: 0.55,
                                            },
                                        },
                                        tooltip: {
                                            theme: "light",
                                            style: { fontSize: "12px" },
                                            y: {
                                                formatter: (val) =>
                                                    `${val} visitas`,
                                            },
                                        },
                                    }}
                                    series={[
                                        {
                                            name: "Visitas",
                                            data: visitsThisMonth.map(
                                                (v) => v.visits,
                                            ),
                                        },
                                    ]}
                                    type="bar"
                                    height={320}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {shouldShowCard("product_views_by_device") && (
                <div className="row g-4 mb-5">
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.violet.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-mobile-alt fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel
                                                        .violet.icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Vistas de Productos por
                                                Dispositivo
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Distribución total y tráfico en
                                                tiempo real
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-5">
                                    <div className="col-md-6 border-end border-light">
                                        <h6 className="text-muted mb-4 fw-bold small text-uppercase">
                                            Total Histórico
                                        </h6>
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "donut",
                                                    toolbar: { show: false },
                                                    background: "transparent",
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                },
                                                labels: productViewsByDevice.map(
                                                    (d) =>
                                                        d.device === "desktop"
                                                            ? "Desktop"
                                                            : d.device ===
                                                                "mobile"
                                                              ? "Móvil"
                                                              : d.device ===
                                                                  "tablet"
                                                                ? "Tablet"
                                                                : "Otro",
                                                ),
                                                colors: [
                                                    UI_STYLE.pastel.indigo.icon,
                                                    UI_STYLE.pastel.blue.icon,
                                                    UI_STYLE.pastel.amber.icon,
                                                    UI_STYLE.pastel.slate.icon,
                                                ],
                                                plotOptions: {
                                                    pie: {
                                                        donut: {
                                                            size: "75%",
                                                            labels: {
                                                                show: true,
                                                                name: {
                                                                    show: true,
                                                                    fontSize:
                                                                        "14px",
                                                                    color: "#64748b",
                                                                    fontWeight: 600,
                                                                },
                                                                value: {
                                                                    show: true,
                                                                    fontSize:
                                                                        "28px",
                                                                    fontWeight: 800,
                                                                    color: "#1e293b",
                                                                },
                                                                total: {
                                                                    show: true,
                                                                    label: "Total",
                                                                    fontSize:
                                                                        "14px",
                                                                    fontWeight: 600,
                                                                    color: "#64748b",
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                                legend: {
                                                    position: "bottom",
                                                    fontWeight: 600,
                                                },
                                                dataLabels: { enabled: false },
                                                tooltip: { theme: "light" },
                                            }}
                                            series={productViewsByDevice.map(
                                                (d) => d.count,
                                            )}
                                            type="donut"
                                            height={350}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-muted mb-4 fw-bold small text-uppercase">
                                            Vistas de Hoy
                                        </h6>
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "bar",
                                                    toolbar: { show: false },
                                                    background: "transparent",
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                },
                                                plotOptions: {
                                                    bar: {
                                                        borderRadius: 10,
                                                        horizontal: true,
                                                        barHeight: "60%",
                                                    },
                                                },
                                                xaxis: {
                                                    categories: (
                                                        productViewsTodayByDevice ||
                                                        []
                                                    ).map((d) =>
                                                        d.device === "desktop"
                                                            ? "Desktop"
                                                            : d.device ===
                                                                "mobile"
                                                              ? "Móvil"
                                                              : d.device ===
                                                                  "tablet"
                                                                ? "Tablet"
                                                                : "Otro",
                                                    ),
                                                    labels: {
                                                        style: {
                                                            colors: "#94a3b8",
                                                            fontSize: "11px",
                                                        },
                                                    },
                                                },
                                                grid: {
                                                    borderColor: "#f1f5f9",
                                                    strokeDashArray: 4,
                                                    xaxis: {
                                                        lines: { show: true },
                                                    },
                                                    yaxis: {
                                                        lines: { show: false },
                                                    },
                                                },
                                                colors: [
                                                    UI_STYLE.pastel.green.icon,
                                                ],
                                                fill: {
                                                    opacity: 0.85,
                                                    type: "gradient",
                                                },
                                                dataLabels: {
                                                    enabled: true,
                                                    style: {
                                                        fontSize: "11px",
                                                        fontWeight: "bold",
                                                    },
                                                },
                                                tooltip: { theme: "light" },
                                            }}
                                            series={[
                                                {
                                                    name: "Vistas",
                                                    data: (
                                                        productViewsTodayByDevice ||
                                                        []
                                                    ).map((d) => d.count),
                                                },
                                            ]}
                                            type="bar"
                                            height={350}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {shouldShowCard("product_clicks_by_device") && (
                <div className="col-12">
                    <div
                        className="card border-0 shadow-sm"
                        style={{
                            borderRadius: UI_STYLE.borderRadius,
                        }}
                    >
                        <div
                            className="card-header bg-white border-0 p-4"
                            style={{
                                borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="rounded-4 p-3"
                                    style={{
                                        background: UI_STYLE.pastel.indigo.bg,
                                    }}
                                >
                                    <i
                                        className="fas fa-mobile-alt fs-4"
                                        style={{
                                            color: UI_STYLE.pastel.indigo.icon,
                                        }}
                                    ></i>
                                </div>
                                <div>
                                    <h5
                                        className="mb-0 fw-bold text-dark"
                                        style={{ letterSpacing: "-0.02em" }}
                                    >
                                        Clicks de Productos por Dispositivo
                                    </h5>
                                    <p className="text-muted mb-0 small fw-medium">
                                        Distribución histórica y de hoy por
                                        plataforma
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <h6
                                        className="text-muted mb-4 fw-bold small text-uppercase"
                                        style={{ letterSpacing: "0.05em" }}
                                    >
                                        Total Histórico
                                    </h6>
                                    <Chart
                                        options={{
                                            chart: {
                                                type: "donut",
                                                toolbar: { show: false },
                                                background: "transparent",
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                            },
                                            labels: productClicksByDevice.map(
                                                (d) => {
                                                    const deviceMap = {
                                                        mobile: "Móvil",
                                                        desktop: "Desktop",
                                                        tablet: "Tablet",
                                                        unknown: "Desconocido",
                                                    };
                                                    return (
                                                        deviceMap[d.device] ||
                                                        d.device
                                                    );
                                                },
                                            ),
                                            colors: [
                                                UI_STYLE.pastel.blue.icon,
                                                UI_STYLE.pastel.violet.icon,
                                                UI_STYLE.pastel.green.icon,
                                                UI_STYLE.pastel.slate.icon,
                                            ],
                                            plotOptions: {
                                                pie: {
                                                    donut: {
                                                        size: "75%",
                                                        labels: {
                                                            show: true,
                                                            name: {
                                                                show: true,
                                                                fontSize:
                                                                    "12px",
                                                                color: "#64748b",
                                                            },
                                                            value: {
                                                                show: true,
                                                                fontSize:
                                                                    "20px",
                                                                fontWeight:
                                                                    "bold",
                                                                color: "#1e293b",
                                                            },
                                                            total: {
                                                                show: true,
                                                                label: "Total Clicks",
                                                                fontSize:
                                                                    "12px",
                                                                color: "#64748b",
                                                                formatter: () =>
                                                                    productClicksByDevice.reduce(
                                                                        (
                                                                            sum,
                                                                            d,
                                                                        ) =>
                                                                            sum +
                                                                            d.count,
                                                                        0,
                                                                    ),
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                            legend: {
                                                position: "bottom",
                                                fontSize: "12px",
                                                labels: {
                                                    colors: "#64748b",
                                                },
                                            },
                                            dataLabels: { enabled: false },
                                            tooltip: { theme: "light" },
                                        }}
                                        series={productClicksByDevice.map(
                                            (d) => d.count,
                                        )}
                                        type="donut"
                                        height={320}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h6
                                        className="text-muted mb-4 fw-bold small text-uppercase"
                                        style={{ letterSpacing: "0.05em" }}
                                    >
                                        Clicks de Hoy
                                    </h6>
                                    <Chart
                                        options={{
                                            chart: {
                                                type: "bar",
                                                toolbar: { show: false },
                                                background: "transparent",
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                            },
                                            plotOptions: {
                                                bar: {
                                                    borderRadius: 10,
                                                    horizontal: true,
                                                    barHeight: "60%",
                                                },
                                            },
                                            xaxis: {
                                                categories: (
                                                    productClicksTodayByDevice ||
                                                    []
                                                ).map((d) => {
                                                    const deviceMap = {
                                                        mobile: "Móvil",
                                                        desktop: "Desktop",
                                                        tablet: "Tablet",
                                                        unknown: "Desconocido",
                                                    };
                                                    return (
                                                        deviceMap[d.device] ||
                                                        d.device
                                                    );
                                                }),
                                                labels: {
                                                    style: {
                                                        colors: "#94a3b8",
                                                        fontSize: "11px",
                                                    },
                                                },
                                            },
                                            grid: {
                                                borderColor: "#f1f5f9",
                                                strokeDashArray: 4,
                                                xaxis: {
                                                    lines: { show: true },
                                                },
                                                yaxis: {
                                                    lines: { show: false },
                                                },
                                            },
                                            colors: [UI_STYLE.pastel.blue.icon],
                                            fill: {
                                                opacity: 0.85,
                                                type: "gradient",
                                            },
                                            dataLabels: {
                                                enabled: true,
                                                style: {
                                                    fontSize: "11px",
                                                    fontWeight: "bold",
                                                },
                                            },
                                            tooltip: { theme: "light" },
                                        }}
                                        series={[
                                            {
                                                name: "Clicks",
                                                data: (
                                                    productClicksTodayByDevice ||
                                                    []
                                                ).map((d) => d.count),
                                            },
                                        ]}
                                        type="bar"
                                        height={320}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ANALÍTICAS DE PRODUCTOS */}
            <div className="row g-4 mb-5">
                {shouldShowCard("product_clicks_chart") && (
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background: UI_STYLE.pastel.blue.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-mouse-pointer fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.blue
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Clicks de Productos del Mes
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Interacciones diarias (últimos 30
                                            días)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        plotOptions: {
                                            bar: {
                                                borderRadius: 6,
                                                columnWidth: "70%",
                                            },
                                        },
                                        xaxis: {
                                            categories:
                                                productClicksThisMonth.map(
                                                    (d) => `Día ${d.day}`,
                                                ),
                                            labels: {
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "10px",
                                                },
                                                rotate: -45,
                                            },
                                            axisBorder: { show: false },
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: "#64748b",
                                                    fontSize: "11px",
                                                },
                                            },
                                            title: {
                                                text: "Clicks",
                                                style: {
                                                    color: "#64748b",
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                },
                                            },
                                        },
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                        },
                                        colors: [UI_STYLE.pastel.blue.icon],
                                        fill: {
                                            opacity: 0.85,
                                            type: "gradient",
                                        },
                                        tooltip: {
                                            theme: "light",
                                            y: {
                                                formatter: (val) =>
                                                    `${val} clicks`,
                                            },
                                        },
                                    }}
                                    series={[
                                        {
                                            name: "Clicks",
                                            data: productClicksThisMonth.map(
                                                (d) => d.clicks,
                                            ),
                                        },
                                    ]}
                                    type="bar"
                                    height={280}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modern Charts Grid */}
            <div className="row g-4 mb-5">
                {shouldShowCard("orders_statistics") && (
                    <div className="col-xl-6 col-lg-6">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.indigo.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-chart-pie fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel
                                                        .indigo.icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <h5
                                                    className="mb-0 fw-bold text-dark"
                                                    style={{
                                                        letterSpacing:
                                                            "-0.02em",
                                                    }}
                                                >
                                                    Estadísticas de Órdenes
                                                </h5>
                                                <Tippy content="Muestra la distribución porcentual de los pedidos según su estado actual (Pendiente, Pagado, Enviado, etc.).">
                                                    <i className="fas fa-question-circle text-muted extra-small cursor-help"></i>
                                                </Tippy>
                                            </div>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Distribución por estado actual
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4 text-center">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "radialBar",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        labels: ordersByStatus
                                            .filter((s) => s.count > 0)
                                            .map((s) => s.name),
                                        colors: [
                                            UI_STYLE.pastel.indigo.icon,
                                            UI_STYLE.pastel.green.icon,
                                            UI_STYLE.pastel.amber.icon,
                                            UI_STYLE.pastel.rose.icon,
                                            UI_STYLE.pastel.violet.icon,
                                            UI_STYLE.pastel.blue.icon,
                                            UI_STYLE.pastel.pink.icon,
                                        ],
                                        plotOptions: {
                                            radialBar: {
                                                hollow: { size: "40%" },
                                                track: {
                                                    background: "#f8fafc",
                                                },
                                                dataLabels: {
                                                    name: {
                                                        fontSize: "13px",
                                                        color: "#64748b",
                                                        fontWeight: 600,
                                                        offsetY: -10,
                                                    },
                                                    value: {
                                                        fontSize: "20px",
                                                        color: "#1e293b",
                                                        fontWeight: 800,
                                                        offsetY: 5,
                                                    },
                                                    total: {
                                                        show: true,
                                                        label: "Total",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        color: "#64748b",
                                                    },
                                                },
                                            },
                                        },
                                        stroke: { lineCap: "round" },
                                        legend: {
                                            show: true,
                                            position: "bottom",
                                            horizontalAlign: "center",
                                            fontWeight: 600,
                                        },
                                    }}
                                    series={(() => {
                                        const filtered = ordersByStatus.filter(
                                            (s) => s.count > 0,
                                        );
                                        const total = filtered.reduce(
                                            (a, b) => a + b.count,
                                            0,
                                        );
                                        return filtered.map((s) =>
                                            Math.round((s.count / total) * 100),
                                        );
                                    })()}
                                    type="radialBar"
                                    height={380}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("sales_by_location") && (
                    <div className="col-xl-6 col-lg-6">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.green.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-map-marked-alt fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.green
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <h5
                                                    className="mb-0 fw-bold text-dark"
                                                    style={{
                                                        letterSpacing:
                                                            "-0.02em",
                                                    }}
                                                >
                                                    Ventas por Ubicación
                                                </h5>
                                                <Tippy content="Identifica las zonas geográficas con mayor volumen de compras para optimizar la logística y el marketing.">
                                                    <i className="fas fa-question-circle text-muted extra-small cursor-help"></i>
                                                </Tippy>
                                            </div>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Distribución geográfica de
                                                pedidos
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-muted small fw-medium d-none d-sm-inline">
                                            Top{" "}
                                            {Math.min(
                                                salesByLocation.length,
                                                12,
                                            )}
                                        </span>
                                        <a
                                            href="/admin/sales"
                                            target="_blank"
                                            className="btn btn-sm btn-light border shadow-sm rounded-3 px-3 fw-bold text-primary"
                                        >
                                            VER TODAS
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "treemap",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        colors: [
                                            UI_STYLE.pastel.green.icon,
                                            UI_STYLE.pastel.blue.icon,
                                            UI_STYLE.pastel.amber.icon,
                                            UI_STYLE.pastel.rose.icon,
                                            UI_STYLE.pastel.indigo.icon,
                                        ],
                                        plotOptions: {
                                            treemap: {
                                                distributed: true,
                                                enableShades: false,
                                            },
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            style: {
                                                fontSize: "14px",
                                                fontWeight: 700,
                                            },
                                            formatter: (text, op) =>
                                                `${text}: ${op.value}`,
                                        },
                                        tooltip: { theme: "light" },
                                    }}
                                    series={[
                                        {
                                            data: (salesByLocation || []).map(
                                                (l) => ({
                                                    x:
                                                        l.district ||
                                                        l.province ||
                                                        l.department ||
                                                        "Desconocido",
                                                    y: l.total,
                                                }),
                                            ),
                                        },
                                    ]}
                                    type="treemap"
                                    height={380}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Inventory Charts Grid */}
            <div className="row g-4 mb-5">
                {shouldShowCard("categories_chart") && (
                    <div className="col-xl-6 col-lg-6">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.amber.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-tags fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.amber
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Productos por Categoría
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Distribución de inventario
                                                actual
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        plotOptions: {
                                            bar: {
                                                borderRadius: 8,
                                                columnWidth: "60%",
                                                distributed: true,
                                            },
                                        },
                                        xaxis: {
                                            categories: categoriesWithProducts
                                                .filter((c) => c.value > 0)
                                                .map((c) =>
                                                    c.name.length > 15
                                                        ? c.name.substring(
                                                              0,
                                                              15,
                                                          ) + "..."
                                                        : c.name,
                                                ),
                                            labels: {
                                                rotate: -45,
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "11px",
                                                },
                                            },
                                            axisBorder: { show: false },
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: "#64748b",
                                                    fontSize: "11px",
                                                },
                                            },
                                            min: 0,
                                        },
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                        },
                                        colors: [
                                            UI_STYLE.pastel.indigo.icon,
                                            UI_STYLE.pastel.green.icon,
                                            UI_STYLE.pastel.amber.icon,
                                            UI_STYLE.pastel.rose.icon,
                                            UI_STYLE.pastel.violet.icon,
                                            UI_STYLE.pastel.blue.icon,
                                            UI_STYLE.pastel.pink.icon,
                                        ],
                                        fill: {
                                            opacity: 0.85,
                                            type: "gradient",
                                        },
                                        tooltip: {
                                            theme: "light",
                                            y: {
                                                formatter: (val) =>
                                                    `${val} productos`,
                                            },
                                        },
                                        legend: { show: false },
                                    }}
                                    series={[
                                        {
                                            name: "Productos",
                                            data: categoriesWithProducts
                                                .filter((c) => c.value > 0)
                                                .map((c) => c.value),
                                        },
                                    ]}
                                    type="bar"
                                    height={350}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("brands_chart") && (
                    <div className="col-xl-6 col-lg-6">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.green.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-copyright fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.green
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Productos por Marca
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Distribución por fabricante
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        plotOptions: {
                                            bar: {
                                                horizontal: true,
                                                borderRadius: 8,
                                                barHeight: "60%",
                                                distributed: true,
                                            },
                                        },
                                        xaxis: {
                                            categories: brandsWithProducts
                                                .filter((b) => b.value > 0)
                                                .map((b) =>
                                                    b.name.length > 15
                                                        ? b.name.substring(
                                                              0,
                                                              15,
                                                          ) + "..."
                                                        : b.name,
                                                ),
                                            labels: {
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "11px",
                                                },
                                            },
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: "#64748b",
                                                    fontSize: "11px",
                                                },
                                            },
                                        },
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                        },
                                        colors: [
                                            UI_STYLE.pastel.blue.icon,
                                            UI_STYLE.pastel.indigo.icon,
                                            UI_STYLE.pastel.violet.icon,
                                            UI_STYLE.pastel.pink.icon,
                                        ],
                                        fill: {
                                            opacity: 0.85,
                                            type: "gradient",
                                        },
                                        tooltip: {
                                            theme: "light",
                                            y: {
                                                formatter: (val) =>
                                                    `${val} productos`,
                                            },
                                        },
                                        legend: { show: false },
                                    }}
                                    series={[
                                        {
                                            name: "Productos",
                                            data: brandsWithProducts
                                                .filter((b) => b.value > 0)
                                                .map((b) => b.value),
                                        },
                                    ]}
                                    type="bar"
                                    height={350}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Analytics de Servicios - Nuevas secciones */}
            <div className="row g-4 mb-5">
                {shouldShowCard("service_visits_chart") && (
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.indigo.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-chart-bar fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel
                                                        .indigo.icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Visitas de Servicios del Mes
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Tráfico diario de servicios
                                                (últimos 30 días)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        plotOptions: {
                                            bar: {
                                                borderRadius: 6,
                                                columnWidth: "75%",
                                            },
                                        },
                                        xaxis: {
                                            categories:
                                                serviceVisitsThisMonth.map(
                                                    (v) => v.label,
                                                ),
                                            labels: {
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "10px",
                                                },
                                                rotate: -45,
                                            },
                                            axisBorder: { show: false },
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: "#64748b",
                                                    fontSize: "11px",
                                                },
                                            },
                                            min: 0,
                                        },
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                        },
                                        colors: [UI_STYLE.pastel.indigo.icon],
                                        fill: {
                                            opacity: 0.85,
                                            type: "gradient",
                                        },
                                        tooltip: {
                                            theme: "light",
                                            y: {
                                                formatter: (val) =>
                                                    `${val} visitas`,
                                            },
                                        },
                                    }}
                                    series={[
                                        {
                                            name: "Visitas",
                                            data: serviceVisitsThisMonth.map(
                                                (v) => v.visits,
                                            ),
                                        },
                                    ]}
                                    type="bar"
                                    height={280}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("service_views_by_device") && (
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background:
                                                UI_STYLE.pastel.violet.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-mobile-alt fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.violet
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Vistas de Servicios por Dispositivo
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Distribución histórica y de hoy por
                                            plataforma
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <h6
                                            className="text-muted mb-4 fw-bold small text-uppercase"
                                            style={{ letterSpacing: "0.05em" }}
                                        >
                                            Total Histórico
                                        </h6>
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "donut",
                                                    toolbar: { show: false },
                                                    background: "transparent",
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                },
                                                labels: serviceViewsByDevice.map(
                                                    (d) => {
                                                        const deviceMap = {
                                                            mobile: "Móvil",
                                                            desktop: "Desktop",
                                                            tablet: "Tablet",
                                                            unknown:
                                                                "Desconocido",
                                                        };
                                                        return (
                                                            deviceMap[
                                                                d.device
                                                            ] || d.device
                                                        );
                                                    },
                                                ),
                                                colors: [
                                                    UI_STYLE.pastel.blue.icon,
                                                    UI_STYLE.pastel.violet.icon,
                                                    UI_STYLE.pastel.green.icon,
                                                    UI_STYLE.pastel.slate.icon,
                                                ],
                                                plotOptions: {
                                                    pie: {
                                                        donut: {
                                                            size: "75%",
                                                            labels: {
                                                                show: true,
                                                                name: {
                                                                    show: true,
                                                                    fontSize:
                                                                        "12px",
                                                                    color: "#64748b",
                                                                },
                                                                value: {
                                                                    show: true,
                                                                    fontSize:
                                                                        "20px",
                                                                    fontWeight:
                                                                        "bold",
                                                                    color: "#1e293b",
                                                                },
                                                                total: {
                                                                    show: true,
                                                                    label: "Total Vistas",
                                                                    fontSize:
                                                                        "12px",
                                                                    color: "#64748b",
                                                                    formatter:
                                                                        () =>
                                                                            serviceViewsByDevice.reduce(
                                                                                (
                                                                                    sum,
                                                                                    d,
                                                                                ) =>
                                                                                    sum +
                                                                                    d.count,
                                                                                0,
                                                                            ),
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                                legend: {
                                                    position: "bottom",
                                                    fontSize: "12px",
                                                    labels: {
                                                        colors: "#64748b",
                                                    },
                                                },
                                                dataLabels: { enabled: false },
                                                tooltip: { theme: "light" },
                                            }}
                                            series={serviceViewsByDevice.map(
                                                (d) => d.count,
                                            )}
                                            type="donut"
                                            height={320}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h6
                                            className="text-muted mb-4 fw-bold small text-uppercase"
                                            style={{ letterSpacing: "0.05em" }}
                                        >
                                            Visitas de Hoy
                                        </h6>
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "bar",
                                                    toolbar: { show: false },
                                                    background: "transparent",
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                },
                                                plotOptions: {
                                                    bar: {
                                                        borderRadius: 8,
                                                        horizontal: true,
                                                        barHeight: "60%",
                                                    },
                                                },
                                                xaxis: {
                                                    categories: (
                                                        serviceViewsTodayByDevice ||
                                                        []
                                                    ).map((d) => {
                                                        const deviceMap = {
                                                            mobile: "Móvil",
                                                            desktop: "Desktop",
                                                            tablet: "Tablet",
                                                            unknown:
                                                                "Desconocido",
                                                        };
                                                        return (
                                                            deviceMap[
                                                                d.device
                                                            ] || d.device
                                                        );
                                                    }),
                                                    labels: {
                                                        style: {
                                                            colors: "#94a3b8",
                                                            fontSize: "11px",
                                                        },
                                                    },
                                                },
                                                yaxis: {
                                                    labels: {
                                                        style: {
                                                            colors: "#64748b",
                                                            fontSize: "11px",
                                                            fontWeight: 600,
                                                        },
                                                    },
                                                },
                                                grid: {
                                                    borderColor: "#f1f5f9",
                                                    strokeDashArray: 4,
                                                    xaxis: {
                                                        lines: { show: true },
                                                    },
                                                },
                                                colors: [
                                                    UI_STYLE.pastel.violet.icon,
                                                ],
                                                fill: {
                                                    opacity: 0.85,
                                                    type: "gradient",
                                                },
                                                tooltip: { theme: "light" },
                                            }}
                                            series={[
                                                {
                                                    name: "Visitas Hoy",
                                                    data: (
                                                        serviceViewsTodayByDevice ||
                                                        []
                                                    ).map((d) => d.count),
                                                },
                                            ]}
                                            type="bar"
                                            height={320}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("service_views_trend") && (
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.amber.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-chart-line fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.amber
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Tendencia de Vistas de Servicios
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Análisis de tráfico (últimos 30
                                                días)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "area",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        xaxis: {
                                            categories:
                                                serviceViewsLast30Days.map(
                                                    (d) =>
                                                        new Date(
                                                            d.date,
                                                        ).toLocaleDateString(
                                                            "es-ES",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                            },
                                                        ),
                                                ),
                                            labels: {
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "11px",
                                                },
                                            },
                                            axisBorder: { show: false },
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: "#64748b",
                                                    fontSize: "11px",
                                                },
                                            },
                                        },
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                        },
                                        colors: [
                                            UI_STYLE.pastel.amber.icon,
                                            UI_STYLE.pastel.blue.icon,
                                        ],
                                        stroke: { curve: "smooth", width: 3 },
                                        fill: {
                                            type: "gradient",
                                            gradient: {
                                                opacityFrom: 0.4,
                                                opacityTo: 0.1,
                                            },
                                        },
                                        legend: {
                                            position: "top",
                                            horizontalAlign: "right",
                                            fontSize: "12px",
                                            labels: { colors: "#64748b" },
                                        },
                                        tooltip: { theme: "light" },
                                    }}
                                    series={[
                                        {
                                            name: "Vistas Totales",
                                            data: serviceViewsLast30Days.map(
                                                (d) => d.views,
                                            ),
                                        },
                                        {
                                            name: "Usuarios Únicos",
                                            data: serviceViewsLast30Days.map(
                                                (d) => d.unique_users,
                                            ),
                                        },
                                    ]}
                                    type="area"
                                    height={320}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("service_clicks_chart") && (
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.rose.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-mouse-pointer fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.rose
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Clicks de Servicios del Mes
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Interacciones diarias detectadas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        plotOptions: {
                                            bar: {
                                                borderRadius: 6,
                                                columnWidth: "70%",
                                            },
                                        },
                                        xaxis: {
                                            categories: (
                                                serviceClicksThisMonth || []
                                            ).map((v) => v.label),
                                            labels: {
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "10px",
                                                },
                                                rotate: -45,
                                            },
                                            axisBorder: { show: false },
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: "#64748b",
                                                    fontSize: "11px",
                                                },
                                            },
                                        },
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                        },
                                        colors: [UI_STYLE.pastel.rose.icon],
                                        fill: {
                                            opacity: 0.85,
                                            type: "gradient",
                                        },
                                        tooltip: {
                                            theme: "light",
                                            y: {
                                                formatter: (val) =>
                                                    `${val} clicks`,
                                            },
                                        },
                                    }}
                                    series={[
                                        {
                                            name: "Clicks",
                                            data: (
                                                serviceClicksThisMonth || []
                                            ).map((v) => v.clicks),
                                        },
                                    ]}
                                    type="bar"
                                    height={300}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {shouldShowCard("service_clicks_by_device") && (
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.rose.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-hand-pointer fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.rose
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Clicks por Dispositivo
                                                (Servicios)
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Distribución de interacciones
                                                por plataforma
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <h6
                                            className="text-muted mb-4 fw-bold small text-uppercase"
                                            style={{ letterSpacing: "0.05em" }}
                                        >
                                            Total Histórico
                                        </h6>
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "donut",
                                                    toolbar: { show: false },
                                                    background: "transparent",
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                },
                                                labels: (
                                                    serviceClicksByDevice || []
                                                ).map((d) =>
                                                    d.device === "desktop"
                                                        ? "Desktop"
                                                        : d.device === "mobile"
                                                          ? "Móvil"
                                                          : d.device ===
                                                              "tablet"
                                                            ? "Tablet"
                                                            : "Otro",
                                                ),
                                                colors: [
                                                    UI_STYLE.pastel.indigo.icon,
                                                    UI_STYLE.pastel.rose.icon,
                                                    UI_STYLE.pastel.amber.icon,
                                                    UI_STYLE.pastel.violet.icon,
                                                ],
                                                plotOptions: {
                                                    pie: {
                                                        donut: {
                                                            size: "75%",
                                                            labels: {
                                                                show: true,
                                                                name: {
                                                                    show: true,
                                                                    fontSize:
                                                                        "12px",
                                                                    color: "#64748b",
                                                                },
                                                                value: {
                                                                    show: true,
                                                                    fontSize:
                                                                        "20px",
                                                                    fontWeight:
                                                                        "bold",
                                                                    color: "#1e293b",
                                                                },
                                                                total: {
                                                                    show: true,
                                                                    label: "Total",
                                                                    fontSize:
                                                                        "12px",
                                                                    color: "#64748b",
                                                                    formatter: (
                                                                        w,
                                                                    ) =>
                                                                        w.globals.seriesTotals.reduce(
                                                                            (
                                                                                a,
                                                                                b,
                                                                            ) =>
                                                                                a +
                                                                                b,
                                                                            0,
                                                                        ),
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                                legend: {
                                                    position: "bottom",
                                                    fontSize: "12px",
                                                    labels: {
                                                        colors: "#64748b",
                                                    },
                                                },
                                                dataLabels: { enabled: false },
                                                tooltip: { theme: "light" },
                                            }}
                                            series={(
                                                serviceClicksByDevice || []
                                            ).map((d) => d.count)}
                                            type="donut"
                                            height={300}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h6
                                            className="text-muted mb-4 fw-bold small text-uppercase"
                                            style={{ letterSpacing: "0.05em" }}
                                        >
                                            Clicks de Hoy
                                        </h6>
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: "bar",
                                                    toolbar: { show: false },
                                                    background: "transparent",
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                },
                                                plotOptions: {
                                                    bar: {
                                                        borderRadius: 10,
                                                        horizontal: true,
                                                        barHeight: "60%",
                                                    },
                                                },
                                                xaxis: {
                                                    categories: (
                                                        serviceClicksTodayByDevice ||
                                                        []
                                                    ).map((d) => {
                                                        const deviceMap = {
                                                            mobile: "Móvil",
                                                            desktop: "Desktop",
                                                            tablet: "Tablet",
                                                            unknown:
                                                                "Desconocido",
                                                        };
                                                        return (
                                                            deviceMap[
                                                                d.device
                                                            ] || d.device
                                                        );
                                                    }),
                                                    labels: {
                                                        style: {
                                                            colors: "#94a3b8",
                                                            fontSize: "11px",
                                                        },
                                                    },
                                                },
                                                grid: {
                                                    borderColor: "#f1f5f9",
                                                    strokeDashArray: 4,
                                                    xaxis: {
                                                        lines: { show: true },
                                                    },
                                                    yaxis: {
                                                        lines: { show: false },
                                                    },
                                                },
                                                colors: [
                                                    UI_STYLE.pastel.rose.icon,
                                                ],
                                                fill: {
                                                    opacity: 0.85,
                                                    type: "gradient",
                                                },
                                                dataLabels: {
                                                    enabled: true,
                                                    style: {
                                                        fontSize: "11px",
                                                        fontWeight: "bold",
                                                    },
                                                },
                                                tooltip: { theme: "light" },
                                            }}
                                            series={[
                                                {
                                                    name: "Clicks",
                                                    data: (
                                                        serviceClicksTodayByDevice ||
                                                        []
                                                    ).map((d) => d.count),
                                                },
                                            ]}
                                            type="bar"
                                            height={300}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("service_clicks_vs_views") && (
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-4 p-3"
                                            style={{
                                                background:
                                                    UI_STYLE.pastel.green.bg,
                                            }}
                                        >
                                            <i
                                                className="fas fa-chart-bar fs-4"
                                                style={{
                                                    color: UI_STYLE.pastel.green
                                                        .icon,
                                                }}
                                            ></i>
                                        </div>
                                        <div>
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Clicks vs Vistas de Servicios
                                            </h5>
                                            <p className="text-muted mb-0 small fw-medium">
                                                Comparativa de engagement y CTR
                                                (últimos 30 días)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <Chart
                                    options={{
                                        chart: {
                                            type: "line",
                                            toolbar: { show: false },
                                            background: "transparent",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        xaxis: {
                                            categories:
                                                serviceViewsLast30Days.map(
                                                    (d) =>
                                                        new Date(
                                                            d.date,
                                                        ).toLocaleDateString(
                                                            "es-ES",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                            },
                                                        ),
                                                ),
                                            labels: {
                                                style: {
                                                    colors: "#94a3b8",
                                                    fontSize: "11px",
                                                },
                                            },
                                            axisBorder: { show: false },
                                        },
                                        yaxis: [
                                            {
                                                title: {
                                                    text: "Vistas / Clicks",
                                                    style: {
                                                        color: "#64748b",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                    },
                                                },
                                                labels: {
                                                    style: {
                                                        colors: "#64748b",
                                                        fontSize: "11px",
                                                    },
                                                },
                                                min: 0,
                                            },
                                            {
                                                opposite: true,
                                                title: {
                                                    text: "CTR (%)",
                                                    style: {
                                                        color: UI_STYLE.pastel
                                                            .green.icon,
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                    },
                                                },
                                                labels: {
                                                    style: {
                                                        colors: UI_STYLE.pastel
                                                            .green.icon,
                                                        fontSize: "11px",
                                                    },
                                                    formatter: (val) =>
                                                        `${val}%`,
                                                },
                                                min: 0,
                                            },
                                        ],
                                        grid: {
                                            borderColor: "#f1f5f9",
                                            strokeDashArray: 4,
                                        },
                                        colors: [
                                            UI_STYLE.pastel.indigo.icon,
                                            UI_STYLE.pastel.amber.icon,
                                            UI_STYLE.pastel.green.icon,
                                        ],
                                        stroke: {
                                            curve: "smooth",
                                            width: [0, 0, 3],
                                        },
                                        fill: {
                                            opacity: [0.85, 0.85, 1],
                                            type: [
                                                "gradient",
                                                "gradient",
                                                "solid",
                                            ],
                                        },
                                        legend: {
                                            position: "top",
                                            horizontalAlign: "right",
                                            fontSize: "12px",
                                            labels: { colors: "#64748b" },
                                        },
                                        tooltip: {
                                            theme: "light",
                                            shared: true,
                                            intersect: false,
                                        },
                                    }}
                                    series={[
                                        {
                                            name: "Vistas",
                                            type: "column",
                                            data: serviceViewsLast30Days.map(
                                                (d) => d.views,
                                            ),
                                        },
                                        {
                                            name: "Clicks",
                                            type: "column",
                                            data: serviceViewsLast30Days.map(
                                                (d) => d.clicks,
                                            ),
                                        },
                                        {
                                            name: "CTR",
                                            type: "line",
                                            data: serviceViewsLast30Days.map(
                                                (d) => d.ctr,
                                            ),
                                        },
                                    ]}
                                    height={360}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tablas de Productos */}
            <div className="row g-4 mb-5">
                {shouldShowCard("most_clicked_products") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background: UI_STYLE.pastel.blue.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-mouse-pointer fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.blue
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Productos Más Clickeados
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Top 10 productos con más
                                            interacciones
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Producto
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Clicks
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mostClickedProducts &&
                                            mostClickedProducts.length > 0 ? (
                                                mostClickedProducts.map(
                                                    (product, index) => (
                                                        <tr
                                                            key={product.id}
                                                            className="border-0"
                                                        >
                                                            <td className="px-4 py-3 border-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="position-relative">
                                                                        {product.image ? (
                                                                            <img
                                                                                src={`/storage/images/item/${product.image}`}
                                                                                alt={
                                                                                    product.name
                                                                                }
                                                                                className="rounded-3 shadow-sm"
                                                                                style={{
                                                                                    width: "48px",
                                                                                    height: "48px",
                                                                                    objectFit:
                                                                                        "cover",
                                                                                }}
                                                                                onError={(
                                                                                    e,
                                                                                ) => {
                                                                                    e.target.src =
                                                                                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23e5e7eb" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3E%3F%3C/text%3E%3C/svg%3E';
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                className="rounded-3 d-flex align-items-center justify-content-center bg-light"
                                                                                style={{
                                                                                    width: "48px",
                                                                                    height: "48px",
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-box text-secondary"></i>
                                                                            </div>
                                                                        )}
                                                                        <span
                                                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border-white border-2 text-white"
                                                                            style={{
                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div
                                                                            className="fw-bold text-dark mb-0"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.925rem",
                                                                            }}
                                                                        >
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-muted extra-small fw-medium">
                                                                            {product.sku && (
                                                                                <span className="me-2">
                                                                                    SKU:{" "}
                                                                                    {
                                                                                        product.sku
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                            {product.color && (
                                                                                <span className="me-2">
                                                                                    Color:{" "}
                                                                                    {
                                                                                        product.color
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-end">
                                                                <span
                                                                    className="badge rounded-pill px-3 py-2 fw-bold"
                                                                    style={{
                                                                        background:
                                                                            UI_STYLE
                                                                                .pastel
                                                                                .blue
                                                                                .bg,
                                                                        color: UI_STYLE
                                                                            .pastel
                                                                            .blue
                                                                            .icon,
                                                                        fontSize:
                                                                            "0.85rem",
                                                                    }}
                                                                >
                                                                    <i className="fas fa-mouse-pointer me-1"></i>
                                                                    {product.clicks ||
                                                                        0}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="2"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-inbox fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay datos de
                                                                clicks
                                                                disponibles
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {shouldShowCard("top_selling_products") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background:
                                                UI_STYLE.pastel.green.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-shopping-cart fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.green
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Productos Más Vendidos
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Basado en el volumen de ventas total
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Producto
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Ventas
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topProducts &&
                                            topProducts.length > 0 ? (
                                                topProducts.map(
                                                    (product, index) => (
                                                        <tr
                                                            key={product.id}
                                                            className="border-0"
                                                        >
                                                            <td className="px-4 py-3 border-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="position-relative">
                                                                        <img
                                                                            src={`/storage/images/item/${product.image}`}
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            className="rounded-3 shadow-sm"
                                                                            style={{
                                                                                width: "48px",
                                                                                height: "48px",
                                                                                objectFit:
                                                                                    "cover",
                                                                            }}
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                e.target.src =
                                                                                    "/api/cover/thumbnail/null";
                                                                            }}
                                                                        />
                                                                        <span
                                                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success border-white border-2 text-white"
                                                                            style={{
                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div
                                                                            className="fw-bold text-dark mb-0"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.925rem",
                                                                            }}
                                                                        >
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-muted extra-small fw-medium">
                                                                            {CurrencySymbol()}{" "}
                                                                            {Number(
                                                                                product.price,
                                                                            ).toFixed(
                                                                                2,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-end">
                                                                <div className="d-flex flex-column align-items-end">
                                                                    <span
                                                                        className="badge rounded-pill px-3 py-2 fw-bold"
                                                                        style={{
                                                                            background:
                                                                                UI_STYLE
                                                                                    .pastel
                                                                                    .green
                                                                                    .bg,
                                                                            color: UI_STYLE
                                                                                .pastel
                                                                                .green
                                                                                .icon,
                                                                            fontSize:
                                                                                "0.85rem",
                                                                        }}
                                                                    >
                                                                        {product.order_items_count ||
                                                                            0}{" "}
                                                                        vendidos
                                                                    </span>
                                                                    <span className="text-success extra-small fw-bold mt-1">
                                                                        <i className="fas fa-arrow-up me-1"></i>
                                                                        +
                                                                        {Math.round(
                                                                            Math.random() *
                                                                                20,
                                                                        )}
                                                                        %
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="2"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-box-open fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay datos de
                                                                ventas
                                                                disponibles
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="p-4 bg-light/30 border-top d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: `0 0 ${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius}`,
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Mostrando {topProducts.length} productos
                                    </span>
                                    <a
                                        href="/admin/items"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                    >
                                        Ver catálogo completo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("new_featured_products") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background:
                                                UI_STYLE.pastel.amber.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-star fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.amber
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Nuevos Productos Destacados
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Últimos lanzamientos y novedades
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Producto
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Precio
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Estado
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newFeatured &&
                                            newFeatured.length > 0 ? (
                                                newFeatured.map((product) => (
                                                    <tr
                                                        key={product.id}
                                                        className="border-0"
                                                    >
                                                        <td className="px-4 py-3 border-0">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="position-relative">
                                                                    <img
                                                                        src={`/storage/images/item/${product.image}`}
                                                                        alt={
                                                                            product.name
                                                                        }
                                                                        className="rounded-3 shadow-sm"
                                                                        style={{
                                                                            width: "48px",
                                                                            height: "48px",
                                                                            objectFit:
                                                                                "cover",
                                                                        }}
                                                                        onError={(
                                                                            e,
                                                                        ) => {
                                                                            e.target.src =
                                                                                "/api/cover/thumbnail/null";
                                                                        }}
                                                                    />
                                                                    <div className="position-absolute top-0 start-100 translate-middle">
                                                                        <span
                                                                            className="badge rounded-pill p-1"
                                                                            style={{
                                                                                background:
                                                                                    UI_STYLE
                                                                                        .pastel
                                                                                        .amber
                                                                                        .bg,
                                                                            }}
                                                                        >
                                                                            <i
                                                                                className="fas fa-sparkles"
                                                                                style={{
                                                                                    color: UI_STYLE
                                                                                        .pastel
                                                                                        .amber
                                                                                        .icon,
                                                                                    fontSize:
                                                                                        "8px",
                                                                                }}
                                                                            ></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div
                                                                        className="fw-bold text-dark mb-0"
                                                                        style={{
                                                                            fontSize:
                                                                                "0.925rem",
                                                                        }}
                                                                    >
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </div>
                                                                    <span
                                                                        className="badge rounded-pill px-2 py-0 fw-medium"
                                                                        style={{
                                                                            background:
                                                                                "#fffbeb",
                                                                            color: "#b45309",
                                                                            fontSize:
                                                                                "10px",
                                                                            border: "1px solid #fef3c7",
                                                                        }}
                                                                    >
                                                                        Nuevo
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 border-0">
                                                            <span
                                                                className="fw-bold text-dark"
                                                                style={{
                                                                    fontSize:
                                                                        "0.95rem",
                                                                }}
                                                            >
                                                                {CurrencySymbol()}{" "}
                                                                {Number(
                                                                    product.price,
                                                                ).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 border-0 text-end">
                                                            <span
                                                                className="badge rounded-pill px-3 py-2 fw-bold"
                                                                style={{
                                                                    background:
                                                                        UI_STYLE
                                                                            .pastel
                                                                            .amber
                                                                            .bg,
                                                                    color: UI_STYLE
                                                                        .pastel
                                                                        .amber
                                                                        .icon,
                                                                    fontSize:
                                                                        "0.8rem",
                                                                }}
                                                            >
                                                                Destacado
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-tags fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay productos
                                                                destacados
                                                                recientes
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="p-4 bg-light/30 border-top d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: `0 0 ${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius}`,
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Total: {newFeatured.length} items
                                    </span>
                                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                                        Administrar destacados
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("most_viewed_products") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background:
                                                UI_STYLE.pastel.violet.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-eye fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.violet
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Productos Más Vistos
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Mayor volumen de tráfico y
                                            visualizaciones
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Producto
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Vistas
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mostViewedProducts &&
                                            mostViewedProducts.length > 0 ? (
                                                mostViewedProducts.map(
                                                    (product, index) => (
                                                        <tr
                                                            key={product.id}
                                                            className="border-0"
                                                        >
                                                            <td className="px-4 py-3 border-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="position-relative">
                                                                        <img
                                                                            src={`/storage/images/item/${product.image}`}
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            className="rounded-3 shadow-sm"
                                                                            style={{
                                                                                width: "48px",
                                                                                height: "48px",
                                                                                objectFit:
                                                                                    "cover",
                                                                            }}
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                e.target.src =
                                                                                    "/api/cover/thumbnail/null";
                                                                            }}
                                                                        />
                                                                        <span
                                                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info border-white border-2 text-white"
                                                                            style={{
                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div
                                                                            className="fw-bold text-dark mb-0"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.925rem",
                                                                            }}
                                                                        >
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </div>
                                                                        <span
                                                                            className="badge rounded-pill px-2 py-0 fw-medium"
                                                                            style={{
                                                                                background:
                                                                                    "#f5f3ff",
                                                                                color: "#7c3aed",
                                                                                fontSize:
                                                                                    "10px",
                                                                                border: "1px solid #ede9fe",
                                                                            }}
                                                                        >
                                                                            Trending
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-end">
                                                                <span
                                                                    className="badge rounded-pill px-3 py-2 fw-bold"
                                                                    style={{
                                                                        background:
                                                                            UI_STYLE
                                                                                .pastel
                                                                                .violet
                                                                                .bg,
                                                                        color: UI_STYLE
                                                                            .pastel
                                                                            .violet
                                                                            .icon,
                                                                        fontSize:
                                                                            "0.85rem",
                                                                    }}
                                                                >
                                                                    <i className="fas fa-eye me-1"></i>
                                                                    {product.view_count ||
                                                                        0}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="2"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-eye-slash fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay datos de
                                                                visualizaciones
                                                                disponibles
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="p-4 bg-light/30 border-top d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: `0 0 ${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius}`,
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Mostrando {mostViewedProducts.length}{" "}
                                        productos
                                    </span>
                                    <a
                                        href="/admin/items"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                    >
                                        Ver catálogo completo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("most_viewed_services") && (
                    <div className="col-xl-6 col-lg-6">
                        <div
                            className="card border-0 h-100"
                            style={{
                                borderRadius: "1rem",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{ borderRadius: "1rem 1rem 0 0" }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-3 p-2"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                            }}
                                        >
                                            <i className="fas fa-concierge-bell text-white fs-5"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold text-dark">
                                                Servicios Más Vistos
                                            </h6>
                                            <p className="text-muted mb-0 small">
                                                Mayor interés de visitantes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div
                                    className="table-responsive"
                                    style={{ maxHeight: 380 }}
                                >
                                    <table className="table table-hover align-middle mb-0">
                                        <thead
                                            style={{ background: "#f8fafc" }}
                                        >
                                            <tr>
                                                <th className="border-0 py-3 px-4 fw-semibold text-muted">
                                                    Servicio
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-semibold text-muted">
                                                    Vistas
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-semibold text-muted">
                                                    Categoría
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mostViewedServices.map(
                                                (service, index) => (
                                                    <tr
                                                        key={service.id}
                                                        className="border-0"
                                                    >
                                                        <td className="px-4 py-3 border-0">
                                                            <div className="d-flex align-items-center">
                                                                <div className="position-relative me-3">
                                                                    <img
                                                                        src={
                                                                            service.image
                                                                                ? `/storage/images/service/${service.image}`
                                                                                : service.background_image
                                                                                  ? `/storage/images/service/${service.background_image}`
                                                                                  : "/api/cover/thumbnail/null"
                                                                        }
                                                                        alt={
                                                                            service.name
                                                                        }
                                                                        className="rounded-3 shadow-sm"
                                                                        style={{
                                                                            width: "48px",
                                                                            height: "48px",
                                                                            objectFit:
                                                                                "cover",
                                                                        }}
                                                                        onError={(
                                                                            e,
                                                                        ) => {
                                                                            if (
                                                                                service.image &&
                                                                                service.background_image &&
                                                                                !e.target.src.endsWith(
                                                                                    service.background_image,
                                                                                )
                                                                            ) {
                                                                                e.target.src = `/storage/images/service/${service.background_image}`;
                                                                            } else {
                                                                                e.target.src =
                                                                                    "/api/cover/thumbnail/null";
                                                                            }
                                                                        }}
                                                                    />
                                                                    <div className="position-absolute top-0 start-0 translate-middle">
                                                                        <span
                                                                            className="badge rounded-pill"
                                                                            style={{
                                                                                background:
                                                                                    "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-eye"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold text-dark mb-1">
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </div>
                                                                    <span
                                                                        className="badge rounded-pill px-2 py-1"
                                                                        style={{
                                                                            background:
                                                                                "#e0e7ff",
                                                                            color: "#6366f1",
                                                                            fontSize:
                                                                                "11px",
                                                                        }}
                                                                    >
                                                                        Popular
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 border-0">
                                                            <span
                                                                className="badge rounded-pill px-3 py-2 fw-semibold"
                                                                style={{
                                                                    background:
                                                                        "#dcfce7",
                                                                    color: "#16a34a",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                {
                                                                    service.view_count
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 border-0">
                                                            <span
                                                                className="badge rounded-pill px-3 py-2 fw-semibold"
                                                                style={{
                                                                    background:
                                                                        "#f3f4f6",
                                                                    color: "#6b7280",
                                                                    fontSize:
                                                                        "11px",
                                                                }}
                                                            >
                                                                {service.category ||
                                                                    "Sin categoría"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="d-flex justify-content-between align-items-center p-4"
                                    style={{
                                        background: "#f8fafc",
                                        borderRadius: "0 0 1rem 1rem",
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Mostrando {mostViewedServices.length}{" "}
                                        servicios
                                    </span>
                                    <a
                                        href="/admin/services"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-3 px-3"
                                    >
                                        Ver todos
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {shouldShowCard("most_clicked_services") && (
                    <div className="col-xl-6 col-lg-6">
                        <div
                            className="card border-0 h-100"
                            style={{
                                borderRadius: "1rem",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{ borderRadius: "1rem 1rem 0 0" }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-3 p-2"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                            }}
                                        >
                                            <i className="fas fa-mouse-pointer text-white fs-5"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold text-dark">
                                                Servicios Más Clickeados
                                            </h6>
                                            <p className="text-muted mb-0 small">
                                                Mayor interacción de visitantes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div
                                    className="table-responsive"
                                    style={{ maxHeight: 380 }}
                                >
                                    <table className="table table-hover align-middle mb-0">
                                        <thead
                                            style={{ background: "#f8fafc" }}
                                        >
                                            <tr>
                                                <th className="border-0 py-3 px-4 fw-semibold text-muted">
                                                    Servicio
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-semibold text-muted">
                                                    Clicks
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-semibold text-muted">
                                                    Categoría
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mostClickedServices &&
                                                mostClickedServices.map(
                                                    (service, index) => (
                                                        <tr
                                                            key={service.id}
                                                            className="border-0"
                                                        >
                                                            <td className="px-4 py-3 border-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="position-relative me-3">
                                                                        <img
                                                                            src={
                                                                                service.image
                                                                                    ? `/storage/images/service/${service.image}`
                                                                                    : service.background_image
                                                                                      ? `/storage/images/service/${service.background_image}`
                                                                                      : "/api/cover/thumbnail/null"
                                                                            }
                                                                            alt={
                                                                                service.name
                                                                            }
                                                                            className="rounded-3 shadow-sm"
                                                                            style={{
                                                                                width: "48px",
                                                                                height: "48px",
                                                                                objectFit:
                                                                                    "cover",
                                                                            }}
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                if (
                                                                                    service.image &&
                                                                                    service.background_image &&
                                                                                    !e.target.src.endsWith(
                                                                                        service.background_image,
                                                                                    )
                                                                                ) {
                                                                                    e.target.src = `/storage/images/service/${service.background_image}`;
                                                                                } else {
                                                                                    e.target.src =
                                                                                        "/api/cover/thumbnail/null";
                                                                                }
                                                                            }}
                                                                        />
                                                                        <div className="position-absolute top-0 start-0 translate-middle">
                                                                            <span
                                                                                className="badge rounded-pill"
                                                                                style={{
                                                                                    background:
                                                                                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                                                                    fontSize:
                                                                                        "10px",
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-mouse-pointer"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="fw-semibold text-dark mb-1">
                                                                            {
                                                                                service.name
                                                                            }
                                                                        </div>
                                                                        <span
                                                                            className="badge rounded-pill px-2 py-1"
                                                                            style={{
                                                                                background:
                                                                                    "#fef3c7",
                                                                                color: "#f59e0b",
                                                                                fontSize:
                                                                                    "11px",
                                                                            }}
                                                                        >
                                                                            Alto
                                                                            Engagement
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-0">
                                                                <span
                                                                    className="badge rounded-pill px-3 py-2 fw-semibold"
                                                                    style={{
                                                                        background:
                                                                            "#fef3c7",
                                                                        color: "#f59e0b",
                                                                        fontSize:
                                                                            "12px",
                                                                    }}
                                                                >
                                                                    {
                                                                        service.clicks
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 border-0">
                                                                <span
                                                                    className="badge rounded-pill px-3 py-2 fw-semibold"
                                                                    style={{
                                                                        background:
                                                                            "#f3f4f6",
                                                                        color: "#6b7280",
                                                                        fontSize:
                                                                            "11px",
                                                                    }}
                                                                >
                                                                    {service.category ||
                                                                        "Sin categoría"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="d-flex justify-content-between align-items-center p-4"
                                    style={{
                                        background: "#f8fafc",
                                        borderRadius: "0 0 1rem 1rem",
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Mostrando{" "}
                                        {mostClickedServices?.length || 0}{" "}
                                        servicios
                                    </span>
                                    <a
                                        href="/admin/services"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                    >
                                        Administrar servicios
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {shouldShowCard("most_used_coupons") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background: UI_STYLE.pastel.rose.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-ticket-alt fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.rose
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Cupones Más Usados
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Rendimiento de códigos promocionales
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Cupón
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-center">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Uso
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Valor
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topCoupons &&
                                            topCoupons.length > 0 ? (
                                                topCoupons.map(
                                                    (coupon, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-0"
                                                        >
                                                            <td className="px-4 py-3 border-0">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <code
                                                                        className="px-2 py-1 rounded bg-light text-primary fw-bold border"
                                                                        style={{
                                                                            fontSize:
                                                                                "0.85rem",
                                                                        }}
                                                                    >
                                                                        {
                                                                            coupon.code
                                                                        }
                                                                    </code>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-center">
                                                                <span
                                                                    className="badge rounded-pill px-3 py-2 fw-bold"
                                                                    style={{
                                                                        background:
                                                                            UI_STYLE
                                                                                .pastel
                                                                                .rose
                                                                                .bg,
                                                                        color: UI_STYLE
                                                                            .pastel
                                                                            .rose
                                                                            .icon,
                                                                        fontSize:
                                                                            "0.85rem",
                                                                    }}
                                                                >
                                                                    {coupon.used_count ||
                                                                        0}{" "}
                                                                    veces
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-end">
                                                                <span className="fw-bold text-dark">
                                                                    {coupon.type ===
                                                                    "percentage"
                                                                        ? `${coupon.value}%`
                                                                        : `${CurrencySymbol()} ${Number(coupon.value).toFixed(2)}`}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-ticket-alt fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay datos de
                                                                cupones
                                                                disponibles
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="p-4 bg-light/30 border-top d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: `0 0 ${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius}`,
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Total: {topCoupons.length} cupones
                                    </span>
                                    <a
                                        href="/admin/coupons"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                    >
                                        Administrar cupones
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {shouldShowCard("most_used_discount_rules") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background:
                                                UI_STYLE.pastel.green.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-percentage fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.green
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Reglas de Descuento Más Usadas
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Promociones automáticas más
                                            efectivas
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Regla
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-center">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Uso
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Ahorro
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topDiscountRules &&
                                            topDiscountRules.length > 0 ? (
                                                topDiscountRules.map(
                                                    (rule, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-0"
                                                        >
                                                            <td className="px-4 py-3 border-0">
                                                                <div className="fw-bold text-dark">
                                                                    {rule.name}
                                                                </div>
                                                                <div className="extra-small text-muted fw-medium">
                                                                    Activa
                                                                    actualmente
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-center">
                                                                <span
                                                                    className="badge rounded-pill px-3 py-2 fw-bold"
                                                                    style={{
                                                                        background:
                                                                            UI_STYLE
                                                                                .pastel
                                                                                .green
                                                                                .bg,
                                                                        color: UI_STYLE
                                                                            .pastel
                                                                            .green
                                                                            .icon,
                                                                        fontSize:
                                                                            "0.85rem",
                                                                    }}
                                                                >
                                                                    {rule.times_used ||
                                                                        0}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-end">
                                                                <span className="text-success fw-bold">
                                                                    {CurrencySymbol()}{" "}
                                                                    {formatIncome(
                                                                        rule.total_discount,
                                                                    )}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-percentage fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay reglas de
                                                                descuento
                                                                activas
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="p-4 bg-light/30 border-top d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: `0 0 ${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius}`,
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Total: {topDiscountRules.length} reglas
                                    </span>
                                    <a
                                        href="/admin/discount-rules"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                    >
                                        Gestionar reglas
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {shouldShowCard("brands_listing") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background:
                                                UI_STYLE.pastel.violet.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-tag fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.violet
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5
                                            className="mb-0 fw-bold text-dark"
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            Marcas Destacadas
                                        </h5>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Gestión de fabricantes y proveedores
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Nombre
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-center">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Estado
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Acciones
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {brands && brands.length > 0 ? (
                                                brands.map((brand, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-0"
                                                    >
                                                        <td className="px-4 py-3 border-0">
                                                            <div className="fw-bold text-dark">
                                                                {brand.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 border-0 text-center">
                                                            <span
                                                                className={`badge rounded-pill px-3 py-2 fw-bold ${brand.status === 1 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
                                                                style={{
                                                                    fontSize:
                                                                        "0.75rem",
                                                                }}
                                                            >
                                                                {brand.status ===
                                                                1
                                                                    ? "Activo"
                                                                    : "Inactivo"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 border-0 text-end">
                                                            <a
                                                                href={`/admin/brands/${brand.id}/edit`}
                                                                className="btn btn-sm btn-light rounded-circle p-2"
                                                            >
                                                                <i className="fas fa-edit text-muted"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-tag fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay marcas
                                                                registradas
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="p-4 bg-light/30 border-top d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: `0 0 ${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius}`,
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        {brands.length} marcas cargadas
                                    </span>
                                    <a
                                        href="/admin/brands"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                    >
                                        Ver catálogo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {shouldShowCard("top_clients") && (
                    <div className="col-xl-6">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: UI_STYLE.borderRadius,
                            }}
                        >
                            <div
                                className="card-header bg-white border-0 p-4"
                                style={{
                                    borderRadius: `${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius} 0 0`,
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-4 p-3"
                                        style={{
                                            background: UI_STYLE.pastel.blue.bg,
                                        }}
                                    >
                                        <i
                                            className="fas fa-crown fs-4"
                                            style={{
                                                color: UI_STYLE.pastel.blue
                                                    .icon,
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center gap-2">
                                            <h5
                                                className="mb-0 fw-bold text-dark"
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                Mejores Clientes
                                            </h5>
                                            <Tippy content="Ranking de usuarios basado en el monto total invertido y frecuencia de compra en la tienda.">
                                                <i className="fas fa-question-circle text-muted extra-small cursor-help"></i>
                                            </Tippy>
                                        </div>
                                        <p className="text-muted mb-0 small fw-medium">
                                            Clientes con mayor valor de compra
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light/50">
                                            <tr>
                                                <th className="px-4 py-3 border-0">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Cliente
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-center">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Pedidos
                                                    </small>
                                                </th>
                                                <th className="px-4 py-3 border-0 text-end">
                                                    <small
                                                        className="text-muted fw-bold text-uppercase"
                                                        style={{
                                                            letterSpacing:
                                                                "0.05em",
                                                        }}
                                                    >
                                                        Inversión
                                                    </small>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topClients &&
                                            topClients.length > 0 ? (
                                                topClients.map(
                                                    (client, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-0"
                                                        >
                                                            <td className="px-4 py-3 border-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div
                                                                        className="avatar-sm rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary shadow-sm"
                                                                        style={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            fontSize:
                                                                                "0.9rem",
                                                                        }}
                                                                    >
                                                                        {client.email
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="fw-bold text-dark">
                                                                            {
                                                                                client.email
                                                                            }
                                                                        </div>
                                                                        <div className="extra-small text-muted fw-medium">
                                                                            Cliente
                                                                            VIP
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-center">
                                                                <span
                                                                    className="badge rounded-pill px-3 py-2 fw-bold"
                                                                    style={{
                                                                        background:
                                                                            UI_STYLE
                                                                                .pastel
                                                                                .blue
                                                                                .bg,
                                                                        color: UI_STYLE
                                                                            .pastel
                                                                            .blue
                                                                            .icon,
                                                                        fontSize:
                                                                            "0.85rem",
                                                                    }}
                                                                >
                                                                    {
                                                                        client.total_orders
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 border-0 text-end">
                                                                <span className="fw-bold text-dark">
                                                                    {CurrencySymbol()}{" "}
                                                                    {formatIncome(
                                                                        client.total_spent,
                                                                    )}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center py-5 text-muted"
                                                    >
                                                        <div className="py-2">
                                                            <i className="fas fa-users-slash fa-3x mb-3 opacity-20"></i>
                                                            <p className="mb-0 fw-medium">
                                                                No hay datos de
                                                                clientes aún
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="p-4 bg-light/30 border-top d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: `0 0 ${UI_STYLE.borderRadius} ${UI_STYLE.borderRadius}`,
                                    }}
                                >
                                    <span className="text-muted small fw-medium">
                                        Ranking de {topClients.length} clientes
                                    </span>
                                    <a
                                        href="/admin/clients"
                                        target="_blank"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                    >
                                        Ver reporte CRM
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Organigrama de Vendedores */}
            {shouldShowCard("seller_tree") && (
                <div className="row g-4 mb-4">
                    <SellerTreeCard />
                </div>
            )}

            {/* Modern Visibility Configuration Modal */}
            {showVisibilityModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                    onClick={() => setShowVisibilityModal(false)}
                >
                    <div
                        className="modal-dialog modal-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-eye me-2"></i>
                                    Configurar Visibilidad del Dashboard
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowVisibilityModal(false)
                                    }
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted mb-4">
                                    Selecciona qué elementos del dashboard
                                    deseas mostrar u ocultar. Los cambios se
                                    aplicarán inmediatamente.
                                </p>

                                {Object.entries(CARD_CATEGORIES).map(
                                    ([categoryKey, category]) => {
                                        const categoryCards = Object.entries(
                                            DASHBOARD_CARDS,
                                        ).filter(([cardId, card]) => {
                                            // Filtrar cards de servicios si el proyecto no las usa

                                            return (
                                                card.category === categoryKey
                                            );
                                        });

                                        // No mostrar la categoría si no tiene cards
                                        if (categoryCards.length === 0) {
                                            return null;
                                        }

                                        return (
                                            <div
                                                key={categoryKey}
                                                className="mb-4"
                                            >
                                                <h6 className="fw-bold mb-3">
                                                    <i
                                                        className={`${category.icon} me-2`}
                                                    ></i>
                                                    {category.name}
                                                </h6>
                                                <div className="row">
                                                    {categoryCards.map(
                                                        ([cardId, card]) => (
                                                            <div
                                                                key={cardId}
                                                                className="col-md-6 mb-2"
                                                            >
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`visibility-${cardId}`}
                                                                        checked={
                                                                            cardVisibility[
                                                                                cardId
                                                                            ] !==
                                                                            false
                                                                        }
                                                                        onChange={() =>
                                                                            handleToggleCardVisibility(
                                                                                cardId,
                                                                            )
                                                                        }
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`visibility-${cardId}`}
                                                                    >
                                                                        {
                                                                            card.name
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowVisibilityModal(false)
                                    }
                                >
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
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>
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
        </BaseAdminto>,
    );
});
