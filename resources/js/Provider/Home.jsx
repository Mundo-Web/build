import React from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import { Toaster } from "sonner";

const Home = ({ session, stats }) => {
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

            <div className="container-fluid p-0">
                {/* Header */}
                <div className="dashboard-header mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h2 className="mb-1 fw-bold text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Dashboard de Proveedor
                            </h2>
                            <p className="text-muted mb-0">
                                Bienvenido,{" "}
                                <span className="fw-bold text-primary">
                                    {session.name}
                                </span>
                                . Gestiona tus productos y revisa su estado en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards (Premium Style) */}
                <div className="row g-4 mb-5">
                    {/* Total Productos */}
                    <div className="col-xl-3 col-md-6">
                        <div
                            className="card border-0 h-100 shadow-sm"
                            style={{
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                background: "#ffffff",
                            }}
                        >
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        background: "#e0f2fe", // Sky/Blue pastel
                                    }}
                                >
                                    <i className="mdi mdi-package-variant-closed text-primary fs-3"></i>
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                    <h2 className="mb-0 text-dark fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                        {stats.total}
                                    </h2>
                                    <div className="text-muted small fw-medium mt-1">
                                        Total Productos
                                    </div>
                                    <div className="text-muted small" style={{ fontSize: "11px" }}>
                                        Enviados a la plataforma
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pendientes */}
                    <div className="col-xl-3 col-md-6">
                        <div
                            className="card border-0 h-100 shadow-sm"
                            style={{
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                background: "#ffffff",
                            }}
                        >
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        background: "#fef3c7", // Amber pastel
                                    }}
                                >
                                    <i className="mdi mdi-clock-outline text-warning fs-3"></i>
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                    <h2 className="mb-0 text-warning fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                        {stats.pending}
                                    </h2>
                                    <div className="text-muted small fw-medium mt-1">
                                        Pendientes
                                    </div>
                                    <div className="text-muted small" style={{ fontSize: "11px" }}>
                                        En espera de revisión
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aprobados */}
                    <div className="col-xl-3 col-md-6">
                        <div
                            className="card border-0 h-100 shadow-sm"
                            style={{
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                background: "#ffffff",
                            }}
                        >
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        background: "#d1fae5", // Green pastel
                                    }}
                                >
                                    <i className="mdi mdi-check-circle-outline text-success fs-3"></i>
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                    <h2 className="mb-0 text-success fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                        {stats.approved}
                                    </h2>
                                    <div className="text-muted small fw-medium mt-1">
                                        Aprobados
                                    </div>
                                    <div className="text-muted small" style={{ fontSize: "11px" }}>
                                        Visibles en la tienda
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rechazados */}
                    <div className="col-xl-3 col-md-6">
                        <div
                            className="card border-0 h-100 shadow-sm"
                            style={{
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                background: "#ffffff",
                            }}
                        >
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        background: "#fee2e2", // Red pastel
                                    }}
                                >
                                    <i className="mdi mdi-close-circle-outline text-danger fs-3"></i>
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                    <h2 className="mb-0 text-danger fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                        {stats.rejected}
                                    </h2>
                                    <div className="text-muted small fw-medium mt-1">
                                        Rechazados
                                    </div>
                                    <div className="text-muted small" style={{ fontSize: "11px" }}>
                                        Requieren correcciones
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Banner Call-to-Action */}
                <div className="row">
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-lg position-relative overflow-hidden bg-primary bg-gradient text-white"
                            style={{
                                borderRadius: "16px",
                                borderLeft: "5px solid var(--bg-secondary)", // Gold brand accent border
                            }}
                        >
                            {/* Decorative background shape */}
                            <div 
                                className="position-absolute rounded-circle bg-white opacity-10"
                                style={{
                                    width: "250px",
                                    height: "250px",
                                    bottom: "-80px",
                                    right: "-80px",
                                    pointerEvents: "none"
                                }}
                            ></div>

                            <div className="card-body p-4 p-md-5 position-relative z-index-1">
                                <div className="row align-items-center g-4">
                                    <div className="col-lg-8 text-center text-lg-start">
                                        <span className="badge bg-secondary text-uppercase mb-3 px-3 py-2 fw-bold" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>
                                            Expansión de Catálogo
                                        </span>
                                        <h2 className="fw-bold text-white mb-2" style={{ fontSize: "32px", lineHeight: "1.2" }}>
                                            ¿Tienes nuevos productos listos para vender?
                                        </h2>
                                        <p className="text-white-50 mb-0 fs-6" style={{ maxWidth: "600px" }}>
                                            Agrégalos a tu inventario hoy mismo. Nuestro equipo de soporte los revisará y publicará en la tienda en tiempo récord para maximizar tus ventas.
                                        </p>
                                    </div>
                                    <div className="col-lg-4 text-center text-lg-end">
                                        <a
                                            href="/provider/items"
                                            className="btn btn-light text-primary btn-lg rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                                            style={{
                                                fontSize: "15px",
                                                transition: "transform 0.2s ease"
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                            }}
                                        >
                                            <i className="mdi mdi-plus-circle-outline fs-5"></i>
                                            Subir Nuevo Producto
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Dashboard de Proveedor">
            <Home {...properties} />
        </BaseAdminto>,
    );
});

export default Home;
