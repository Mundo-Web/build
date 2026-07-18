import React from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "../Components/Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency, { CurrencySymbol } from "../Utils/Number2Currency";
import { motion } from "framer-motion";

const Dashboard = ({ stats, recentOrders = [], support = {}, session }) => {
    // Dynamic greeting based on current local time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "¡Buenos días";
        if (hour < 18) return "¡Buenas tardes";
        return "¡Buenas noches";
    };

    // Animation presets
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 110,
                damping: 15
            }
        }
    };

    // Clean, beautiful stats cards style
    const getCardStyle = () => ({
        transition: "all 0.25s ease-in-out",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.05)",
        background: "#ffffff"
    });

    // Clean phone number for WhatsApp link
    const cleanPhone = support.phone ? support.phone.replace(/[^0-9]/g, '') : '';

    return (
        <motion.div 
            className="container-fluid py-3"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header de Texto Limpio y Elegante */}
            <motion.div className="row mb-4" variants={itemVariants}>
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-3 border-bottom">
                        <div>
                            <h2 className="mb-1 fw-black text-dark" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "28px" }}>
                                {getGreeting()}, {session?.name}! ✨
                            </h2>
                            <p className="text-muted mb-0">
                                Desde aquí puedes revisar el estado de tus compras y comunicarte con soporte.
                            </p>
                        </div>
                        <div>
                            <a 
                                href="/" 
                                className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm transition-all hover-scale"
                            >
                                <i className="mdi mdi-store-outline me-1 fs-5"></i>
                                Volver a la Tienda
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Fila de Tarjetas de Estadísticas Más Bonitas */}
            <motion.div className="row g-3 mb-4" variants={containerVariants}>
                {/* Pedidos Totales */}
                <motion.div className="col-xl-3 col-md-6" variants={itemVariants}>
                    <div 
                        className="card border-0 h-100 shadow-sm card-hover-effect" 
                        style={getCardStyle()}
                    >
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: "56px", height: "56px", background: "#eff6ff" }}
                            >
                                <i className="mdi mdi-cart-outline text-primary fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="fw-black mb-1 text-dark" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {stats.total_orders}
                                </h2>
                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                                    Pedidos Totales
                                </h6>
                                <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-format-list-bulleted text-primary"></i>
                                    <span>Historial registrado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Pedidos en Proceso */}
                <motion.div className="col-xl-3 col-md-6" variants={itemVariants}>
                    <div 
                        className="card border-0 h-100 shadow-sm card-hover-effect" 
                        style={getCardStyle()}
                    >
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: "56px", height: "56px", background: "#fffbeb" }}
                            >
                                <i className="mdi mdi-truck-delivery-outline text-warning fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="fw-black mb-1 text-warning" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {stats.pending_orders}
                                </h2>
                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                                    En Proceso
                                </h6>
                                <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-sync mdi-spin text-warning"></i>
                                    <span>En producción o envío</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Pedidos Entregados */}
                <motion.div className="col-xl-3 col-md-6" variants={itemVariants}>
                    <div 
                        className="card border-0 h-100 shadow-sm card-hover-effect" 
                        style={getCardStyle()}
                    >
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: "56px", height: "56px", background: "#ecfdf5" }}
                            >
                                <i className="mdi mdi-checkbox-marked-circle-outline text-success fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="fw-black mb-1 text-success" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {stats.completed_orders}
                                </h2>
                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                                    Completados
                                </h6>
                                <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-check text-success"></i>
                                    <span>Entregados con éxito</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Total Invertido */}
                <motion.div className="col-xl-3 col-md-6" variants={itemVariants}>
                    <div 
                        className="card border-0 h-100 shadow-sm card-hover-effect" 
                        style={getCardStyle()}
                    >
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: "56px", height: "56px", background: "#ecfeff" }}
                            >
                                <i className="mdi mdi-cash-multiple text-info fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="fw-black mb-1 text-info" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {CurrencySymbol()} {Number2Currency(stats.total_spent)}
                                </h2>
                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                                    Total Invertido
                                </h6>
                                <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-shield-check-outline text-info"></i>
                                    <span>Excluye anulaciones</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Cuerpo: Pedidos Recientes & Soporte Dinámico */}
            <div className="row g-4">
                {/* Tabla de Pedidos Recientes (col-lg-9 para darle más amplitud) */}
                <motion.div className="col-lg-9 col-md-8" variants={itemVariants}>
                    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)" }}>
                        <div className="card-header bg-transparent d-flex justify-content-between align-items-center border-bottom py-3">
                            <h4 className="header-title mb-0 text-dark fw-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <i className="mdi mdi-history text-primary me-2"></i> Mis Pedidos Recientes
                            </h4>
                            <a 
                                href="/customer/orders" 
                                className="btn btn-sm btn-light rounded-pill px-3 fw-bold"
                            >
                                Ver todos <i className="mdi mdi-arrow-right ms-1"></i>
                            </a>
                        </div>
                        <div className="card-body p-0">
                            {recentOrders.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover table-centered mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4">Código</th>
                                                <th>Fecha</th>
                                                <th>Estado</th>
                                                <th>Total</th>
                                                <th className="pe-4 text-end">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((sale) => {
                                                const totalAmount =
                                                    Number(sale.amount) +
                                                    Number(sale.delivery || 0) +
                                                    Number(sale.seguro_importacion_total || 0) +
                                                    Number(sale.derecho_arancelario_total || 0) +
                                                    Number(sale.flete_total || 0) -
                                                    Number(sale.bundle_discount || 0) -
                                                    Number(sale.renewal_discount || 0) -
                                                    Number(sale.coupon_discount || 0);

                                                return (
                                                    <tr key={sale.id}>
                                                        <td className="ps-4 fw-bold text-primary">
                                                            #{sale.code}
                                                        </td>
                                                        <td className="text-muted small">
                                                            {moment(sale.created_at).format("DD/MM/YYYY hh:mm A")}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="badge rounded-pill"
                                                                style={{
                                                                    backgroundColor: sale.status?.color
                                                                        ? `${sale.status.color}1c`
                                                                        : "#3333331c",
                                                                    color: sale.status?.color ?? "#333",
                                                                    border: `1px solid ${sale.status?.color ? sale.status.color + '33' : '#33333333'}`,
                                                                    fontSize: "11px",
                                                                    padding: "0.45em 0.9em",
                                                                    fontWeight: "bold"
                                                                }}
                                                            >
                                                                {sale.status?.name}
                                                            </span>
                                                        </td>
                                                        <td className="fw-semibold text-dark">
                                                            {CurrencySymbol()} {Number2Currency(totalAmount)}
                                                        </td>
                                                        <td className="pe-4 text-end">
                                                            <a
                                                                href="/customer/orders"
                                                                className="btn btn-xs btn-light px-3 rounded-pill"
                                                            >
                                                                <i className="mdi mdi-eye text-muted me-1"></i> Ver pedido
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <div className="mb-3">
                                        <div 
                                            className="avatar-lg rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto"
                                            style={{ width: "80px", height: "80px" }}
                                        >
                                            <i className="mdi mdi-cart-off fs-1 text-muted"></i>
                                        </div>
                                    </div>
                                    <h5 className="fw-bold text-dark">Aún no tienes pedidos</h5>
                                    <p className="text-muted mb-0 small">¡Todo lo que necesitas está esperándote en la tienda!</p>
                                    <a href="/catalogo" className="btn btn-primary rounded-pill mt-3 px-4 fw-bold">
                                        Explorar Catálogo
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Tarjeta de Soporte Dinámico (col-lg-3 para balancear la fila) */}
                <motion.div className="col-lg-3 col-md-4" variants={itemVariants}>
                    <div 
                        className="card text-white shadow-sm border-0 h-100"
                        style={{
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                            minHeight: "260px"
                        }}
                    >
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex align-items-center mb-3">
                                    <div 
                                        className="avatar-sm bg-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                        style={{ width: "38px", height: "38px" }}
                                    >
                                        <i className="mdi mdi-whatsapp text-success fs-4"></i>
                                    </div>
                                    <h5 className="text-white fw-bold mb-0" style={{ fontFamily: "'Outfit', sans-serif" }}>¿Necesitas ayuda?</h5>
                                </div>
                                <p className="text-white-50 small mb-4" style={{ lineHeight: "1.6" }}>
                                    Si tienes consultas o inconvenientes con tus pedidos, comunícate con atención al cliente para asistirte de inmediato de forma personalizada.
                                </p>
                            </div>
                            
                            <div className="d-flex flex-column gap-2 mt-auto">
                                {support.phone && (
                                    <a 
                                        href={`https://wa.me/${cleanPhone}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="btn btn-white text-dark rounded-pill px-3 py-2 fw-bold text-center shadow-sm"
                                        style={{ backgroundColor: "#ffffff", border: "0" }}
                                    >
                                        <i className="mdi mdi-whatsapp me-2 text-success"></i> {support.phone}
                                    </a>
                                )}
                                
                                {support.email && (
                                    <a 
                                        href={`mailto:${support.email}`} 
                                        className="btn btn-dark text-white rounded-pill px-3 py-2 fw-bold text-center shadow-sm"
                                        style={{ background: "rgba(0, 0, 0, 0.2)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                                    >
                                        <i className="mdi mdi-email-outline me-2"></i> {support.email}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Panel del Cliente">
            <Dashboard {...properties} />
        </BaseAdminto>
    );
});

export default Dashboard;
