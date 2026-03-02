import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";
import { CurrencySymbol } from "../Utils/Number2Currency";

const Home = ({
    user,
    storeUrl,
    nextRank,
    totalCommissions = 0,
    commissionsToday = 0,
    commissionsMonth = 0,
    totalReferrerSales = 0,
    directReferrals = 0,
}) => {
    const [copiedStore, setCopiedStore] = useState(false);
    const [copiedReferral, setCopiedReferral] = useState(false);

    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/?ref=${user?.uuid || ""}#une-a-nosotros`;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === "store") {
                setCopiedStore(true);
                setTimeout(() => setCopiedStore(false), 2000);
            } else {
                setCopiedReferral(true);
                setTimeout(() => setCopiedReferral(false), 2000);
            }
            toast.success("Enlace copiado correctamente");
        });
    };

    const formatIncome = (value) => {
        return parseFloat(value || 0).toFixed(2);
    };

    // Cálculos de progreso de rango
    let progress = 0;
    let rankTargetLabel = "";
    let currentVal = 0;
    let targetVal = 0;

    if (nextRank) {
        const isItems = nextRank.requirement_type === "items";
        currentVal = nextRank.is_group
            ? isItems
                ? user.group_items
                : user.group_points
            : isItems
              ? user.total_items
              : user.total_points;
        targetVal = nextRank.min_points;
        progress = Math.min(100, Math.max(0, (currentVal / targetVal) * 100));
        rankTargetLabel = isItems
            ? `${Math.round(currentVal)} / ${targetVal} prendas`
            : `${CurrencySymbol()} ${parseFloat(currentVal).toFixed(2)} / ${targetVal}`;
    }

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

            {/* Header */}
            <div className="dashboard-header mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="mb-1 fw-bold text-dark">
                            Panel de Asesor
                        </h2>
                        <p className="text-muted mb-0">
                            Bienvenido,{" "}
                            <span className="fw-bold text-primary">
                                {user.name}
                            </span>
                            . Gestiona tu carrera aquí.
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {user.rank && (
                            <div
                                className="badge px-3 py-2 rounded-pill d-flex align-items-center shadow-sm"
                                style={{
                                    backgroundColor: user.rank.color,
                                    color: "#fff",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <i className="fas fa-medal me-2"></i>
                                {user.rank.name}
                            </div>
                        )}
                        <div
                            className="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm border"
                            style={{ fontSize: "0.9rem" }}
                        >
                            <i className="fas fa-star me-2 text-warning"></i>
                            Puntos: {Math.round(user.total_points || 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Career Progress Bar */}
            {nextRank && (
                <div
                    className="card border-0 shadow-sm mb-4"
                    style={{ borderRadius: "1rem", overflow: "hidden" }}
                >
                    <div
                        className="card-body p-4"
                        style={{
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-rocket me-2 text-primary"></i>
                                Próximo Rango:{" "}
                                <span className="text-primary">
                                    {nextRank.name}
                                </span>
                            </h5>
                            <span className="fw-bold text-muted small">
                                {rankTargetLabel}
                            </span>
                        </div>
                        <div
                            className="progress rounded-pill shadow-inner mb-2"
                            style={{
                                height: "12px",
                                backgroundColor: "#e2e8f0",
                            }}
                        >
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated rounded-pill"
                                role="progressbar"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor:
                                        nextRank.color || "#3b82f6",
                                    transition: "width 1s ease-in-out",
                                }}
                            ></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                Progreso: {Math.round(progress)}%
                            </small>
                            <small className="text-muted">
                                {nextRank.is_group
                                    ? "Meta Grupal"
                                    : "Meta Personal"}
                            </small>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded border border-info border-opacity-25 opacity-75 small text-info">
                            <i className="fas fa-info-circle me-1"></i>{" "}
                            {nextRank.description}
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards (Admin Style) */}
            <div className="row g-4 mb-5">
                {/* Prendas Vendidas */}
                <div className="col-xl-3 col-md-6">
                    <div
                        className="card border-0 h-100"
                        style={{
                            borderRadius: "1rem",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div
                                    className="rounded-3 p-3"
                                    style={{ background: "#fef3c7" }}
                                >
                                    <i className="fas fa-tshirt text-warning fs-4"></i>
                                </div>
                                <div className="text-end">
                                    <div className="fs-2 fw-bold text-dark mb-0">
                                        {Math.round(user.total_items || 0)}
                                    </div>
                                    <div className="text-muted small">
                                        Prendas Personales
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="text-muted small">
                                    Total Grupo:{" "}
                                    {Math.round(user.group_items || 0)}
                                </span>
                                <div className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill">
                                    Plan Carrera
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comisiones Hoy */}
                <div className="col-xl-3 col-md-6">
                    <div
                        className="card border-0 h-100"
                        style={{
                            borderRadius: "1rem",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div
                                    className="rounded-3 p-3"
                                    style={{ background: "#d1fae5" }}
                                >
                                    <i className="fas fa-hand-holding-usd text-success fs-4"></i>
                                </div>
                                <div className="text-end">
                                    <div className="fs-2 fw-bold text-dark mb-0">
                                        {CurrencySymbol()}{" "}
                                        {formatIncome(commissionsToday)}
                                    </div>
                                    <div className="text-muted small">
                                        Ganancia Hoy
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="text-muted small">
                                    Ganancia Mes: {CurrencySymbol()}{" "}
                                    {formatIncome(commissionsMonth)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comisiones Totales */}
                <div className="col-xl-3 col-md-6">
                    <div
                        className="card border-0 h-100"
                        style={{
                            borderRadius: "1rem",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div
                                    className="rounded-3 p-3"
                                    style={{ background: "#ddd6fe" }}
                                >
                                    <i
                                        className="fas fa-wallet fs-4"
                                        style={{ color: "#8b5cf6" }}
                                    ></i>
                                </div>
                                <div className="text-end">
                                    <div className="fs-2 fw-bold text-dark mb-0">
                                        {CurrencySymbol()}{" "}
                                        {formatIncome(totalCommissions)}
                                    </div>
                                    <div className="text-muted small">
                                        Acumulado Total
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="text-muted small">
                                    Billetera histórica
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referidos Directos */}
                <div className="col-xl-3 col-md-6">
                    <div
                        className="card border-0 h-100"
                        style={{
                            borderRadius: "1rem",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div
                                    className="rounded-3 p-3"
                                    style={{ background: "#ffedd5" }}
                                >
                                    <i
                                        className="fas fa-users text-orange fs-4"
                                        style={{ color: "#f97316" }}
                                    ></i>
                                </div>
                                <div className="text-end">
                                    <div className="fs-2 fw-bold text-dark mb-0">
                                        {directReferrals}
                                    </div>
                                    <div className="text-muted small">
                                        Asesores Directos
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="text-muted small">
                                    Volumen Red: {CurrencySymbol()}{" "}
                                    {parseFloat(
                                        user.group_points || 0,
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Links y Herramientas */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div
                        className="card border-0 h-100"
                        style={{
                            borderRadius: "1rem",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div className="card-header bg-transparent border-0 p-4 pb-0">
                            <h5 className="fw-bold mb-0">
                                Mi Enlace de Tienda
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-muted small mb-4">
                                Comparte este enlace con tus clientes. Todas las
                                compras realizadas aquí te generarán comisiones
                                automáticamente.
                            </p>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    value={storeUrl}
                                    readOnly
                                />
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() =>
                                        copyToClipboard(storeUrl, "store")
                                    }
                                >
                                    <i
                                        className={`fas ${copiedStore ? "fa-check" : "fa-copy"} me-2`}
                                    ></i>
                                    {copiedStore ? "Copiado" : "Copiar"}
                                </button>
                            </div>
                            <a
                                href={storeUrl}
                                target="_blank"
                                className="btn btn-soft-primary w-100 mt-2"
                            >
                                <i className="fas fa-external-link-alt me-2"></i>{" "}
                                Abrir mi tienda
                            </a>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div
                        className="card border-0 h-100"
                        style={{
                            borderRadius: "1rem",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div className="card-header bg-transparent border-0 p-4 pb-0">
                            <h5 className="fw-bold mb-0">
                                Enlace de Reclutamiento
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-muted small mb-4">
                                Invita a otros a unirse a tu red. Cuando se
                                registren con este link, formarán parte de tu
                                equipo de ventas.
                            </p>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    value={inviteUrl}
                                    readOnly
                                />
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() =>
                                        copyToClipboard(inviteUrl, "referral")
                                    }
                                >
                                    <i
                                        className={`fas ${copiedReferral ? "fa-check" : "fa-copy"} me-2`}
                                    ></i>
                                    {copiedReferral ? "Copiado" : "Copiar"}
                                </button>
                            </div>
                            <div className="mt-3 p-3 bg-soft-warning rounded-3 border border-warning border-opacity-25">
                                <small className="text-dark">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Tu código de referido es:{" "}
                                    <strong>{user.uuid}</strong>
                                </small>
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
        <BaseAdminto {...properties} title="Dashboard de Asesor">
            <Home {...properties} />
        </BaseAdminto>,
    );
});
