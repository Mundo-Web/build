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
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <h2 className="mb-1 fw-bold text-dark">
                                    Dashboard de Proveedor
                                </h2>
                                <p className="text-muted mb-0">
                                    Bienvenido,{" "}
                                    <span className="fw-bold text-primary">
                                        {session.name}
                                    </span>
                                    . Gestiona tus productos y revisa su estado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderRadius: "1rem" }}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div
                                        className="rounded-3 p-3"
                                        style={{ background: "#e0f2fe" }}
                                    >
                                        <i className="mdi mdi-package-variant-closed text-primary fs-4"></i>
                                    </div>
                                    <div className="text-end">
                                        <h3 className="fw-bold mb-0">
                                            {stats.total}
                                        </h3>
                                        <div className="text-muted small">
                                            Total Productos
                                        </div>
                                    </div>
                                </div>
                                <div className="text-muted small">
                                    Enviados a la plataforma
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderRadius: "1rem" }}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div
                                        className="rounded-3 p-3"
                                        style={{ background: "#fef3c7" }}
                                    >
                                        <i className="mdi mdi-clock-outline text-warning fs-4"></i>
                                    </div>
                                    <div className="text-end">
                                        <h3 className="fw-bold mb-0 text-warning">
                                            {stats.pending}
                                        </h3>
                                        <div className="text-muted small">
                                            Pendientes
                                        </div>
                                    </div>
                                </div>
                                <div className="text-muted small">
                                    En espera de revisión
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderRadius: "1rem" }}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div
                                        className="rounded-3 p-3"
                                        style={{ background: "#d1fae5" }}
                                    >
                                        <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
                                    </div>
                                    <div className="text-end">
                                        <h3 className="fw-bold mb-0 text-success">
                                            {stats.approved}
                                        </h3>
                                        <div className="text-muted small">
                                            Aprobados
                                        </div>
                                    </div>
                                </div>
                                <div className="text-muted small">
                                    Visibles en la tienda
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderRadius: "1rem" }}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div
                                        className="rounded-3 p-3"
                                        style={{ background: "#fee2e2" }}
                                    >
                                        <i className="mdi mdi-close-circle-outline text-danger fs-4"></i>
                                    </div>
                                    <div className="text-end">
                                        <h3 className="fw-bold mb-0 text-danger">
                                            {stats.rejected}
                                        </h3>
                                        <div className="text-muted small">
                                            Rechazados
                                        </div>
                                    </div>
                                </div>
                                <div className="text-muted small">
                                    Requieren correcciones
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: "1rem",
                                background:
                                    "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                            }}
                        >
                            <div className="card-body p-5 text-center text-white">
                                <h2 className="fw-bold mb-3">
                                    ¿Listo para expandir tu catálogo?
                                </h2>
                                <p className="mb-4 opacity-75 fs-5">
                                    Sube tus nuevos productos y los revisaremos a
                                    la brevedad para que comiencen a venderse.
                                </p>
                                <a
                                    href="/provider/items"
                                    className="btn btn-light btn-lg rounded-pill px-5 fw-bold"
                                    style={{ color: "#1e40af" }}
                                >
                                    <i className="mdi mdi-plus-circle-outline me-2"></i>
                                    Gestionar Mis Productos
                                </a>
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
