import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";
import Chart from "react-apexcharts";
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
    requirementsProgress = {},
    earningsHistory = [],
    growthPercentage = 0,
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

        // Determinar qué meta mostrar (Priorizar Grupal si la personal es 0 o si es predominante)
        const useGroup =
            nextRank.min_group_items > 0 &&
            (nextRank.min_personal_items <= 0 ||
                nextRank.requirement_logic === "AND");

        currentVal = useGroup
            ? isItems
                ? user.group_items
                : user.group_points
            : isItems
              ? user.total_items
              : user.total_points;

        targetVal = useGroup
            ? isItems
                ? nextRank.min_group_items
                : nextRank.min_points
            : isItems
              ? nextRank.min_personal_items
              : nextRank.min_points;

        progress =
            targetVal > 0
                ? Math.min(100, Math.max(0, (currentVal / targetVal) * 100))
                : 0;

        rankTargetLabel = isItems
            ? `${Math.round(currentVal)} / ${Math.round(targetVal)} prendas`
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
                            Panel de Vendedor
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

            {/* KPI Cards (Admin Style) */}
            <div className="row g-4 mb-5">
                {/* Prendas Personales */}
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
                                <i className="mdi mdi-tshirt-crew text-info fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="mb-0 text-dark fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {Math.round(user.total_items || 0)}
                                </h2>
                                <div className="text-muted small fw-medium mt-1">
                                    Prendas Personales
                                </div>
                                <div className="text-success fw-semibold mt-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-arrow-up-bold-outline me-1"></i>Grupo: {Math.round(user.group_items || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comisiones Hoy */}
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
                                    background: "#dcfce7", // Green pastel
                                }}
                            >
                                <i className="mdi mdi-currency-usd text-success fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="mb-0 text-dark fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {CurrencySymbol()} {formatIncome(commissionsToday)}
                                </h2>
                                <div className="text-muted small fw-medium mt-1">
                                    Ganancia Hoy
                                </div>
                                <div className="text-success fw-semibold mt-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-arrow-up-bold-outline me-1"></i>Mes: {CurrencySymbol()} {formatIncome(commissionsMonth)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comisiones Totales */}
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
                                    background: "#eff6ff", // Blue pastel
                                }}
                            >
                                <i className="mdi mdi-wallet-outline text-primary fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="mb-0 text-dark fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {CurrencySymbol()} {formatIncome(totalCommissions)}
                                </h2>
                                <div className="text-muted small fw-medium mt-1">
                                    Acumulado Total
                                </div>
                                <div className="text-muted mt-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-history me-1"></i>Billetera histórica
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referidos Directos */}
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
                                    background: "#fef9c3", // Yellow pastel
                                }}
                            >
                                <i className="mdi mdi-account-group-outline text-warning fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="mb-0 text-dark fw-black" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {directReferrals}
                                </h2>
                                <div className="text-muted small fw-medium mt-1">
                                    Vendedores Directos
                                </div>
                                <div className="text-success fw-semibold mt-1" style={{ fontSize: "11px" }}>
                                    <i className="mdi mdi-arrow-up-bold-outline me-1"></i>Red: {CurrencySymbol()} {parseFloat(user.group_points || 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Career Progress & Roadmap */}
            {nextRank && (
                <div className="row g-4 mb-4">
                    <div className="col-lg-8">
                        <div
                            className="card border-0 shadow-sm h-100"
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
                                        Progreso hacia:{" "}
                                        <span className="text-primary">
                                            {nextRank.name}
                                        </span>
                                    </h5>
                                    <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">
                                        {Math.round(progress)}% completado
                                    </span>
                                </div>

                                <div
                                    className="progress rounded-pill shadow-inner mb-4"
                                    style={{
                                        height: "15px",
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
                                            boxShadow: `0 0 15px ${nextRank.color}44`,
                                            transition: "width 1s ease-in-out",
                                        }}
                                    ></div>
                                </div>

                                <div className="mt-2 p-3 bg-white rounded-3 border border-primary border-opacity-10 shadow-sm small text-dark">
                                    <div className="d-flex align-items-start">
                                        <i className="fas fa-award mt-1 me-2 text-warning fs-5"></i>
                                        <div>
                                            <span className="fw-bold d-block">
                                                Misión del Rango
                                            </span>
                                            {nextRank.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: "1.25rem",
                                background: "#fff",
                            }}
                        >
                            <div className="card-header bg-transparent border-0 p-4 pb-0">
                                <h5 className="fw-bold mb-0">Hoja de Ruta</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="requirement-list d-flex flex-column gap-3">
                                    {/* Item Personal */}
                                    {nextRank.min_personal_items > 0 && (
                                        <div className="d-flex align-items-center justify-content-between p-2 rounded-3 hover-bg-light transition-all">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className={`rounded-circle p-2 me-3 ${user.total_items >= nextRank.min_personal_items ? "bg-success text-white" : "bg-light text-muted"}`}
                                                >
                                                    <i
                                                        className={`fas ${user.total_items >= nextRank.min_personal_items ? "fa-check" : "fa-user"}`}
                                                    ></i>
                                                </div>
                                                <span className="small fw-medium">
                                                    Volumen Personal
                                                </span>
                                            </div>
                                            <span className="small fw-bold">
                                                {Math.round(user.total_items)} /{" "}
                                                {Math.round(
                                                    nextRank.min_personal_items,
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* Item Grupal */}
                                    {nextRank.min_group_items > 0 && (
                                        <div className="d-flex align-items-center justify-content-between p-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className={`rounded-circle p-2 me-3 ${user.group_items >= nextRank.min_group_items ? "bg-success text-white" : "bg-light text-muted"}`}
                                                >
                                                    <i
                                                        className={`fas ${user.group_items >= nextRank.min_group_items ? "fa-check" : "fa-users"}`}
                                                    ></i>
                                                </div>
                                                <span className="small fw-medium">
                                                    Volumen Grupal
                                                </span>
                                            </div>
                                            <span className="small fw-bold">
                                                {Math.round(user.group_items)} /{" "}
                                                {Math.round(
                                                    nextRank.min_group_items,
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* Reclutas Activos */}
                                    {nextRank.min_active_recruits > 0 && (
                                        <div className="d-flex align-items-center justify-content-between p-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className={`rounded-circle p-2 me-3 ${requirementsProgress?.activeRecruits >= nextRank.min_active_recruits ? "bg-success text-white" : "bg-light text-muted"}`}
                                                >
                                                    <i
                                                        className={`fas ${requirementsProgress?.activeRecruits >= nextRank.min_active_recruits ? "fa-check" : "fa-user-plus"}`}
                                                    ></i>
                                                </div>
                                                <span className="small fw-medium">
                                                    Reclutas Activos
                                                </span>
                                            </div>
                                            <span className="small fw-bold">
                                                {requirementsProgress?.activeRecruits ||
                                                    0}{" "}
                                                / {nextRank.min_active_recruits}
                                            </span>
                                        </div>
                                    )}

                                    {/* Líderes */}
                                    {nextRank.min_leaders > 0 && (
                                        <div className="d-flex align-items-center justify-content-between p-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className={`rounded-circle p-2 me-3 ${requirementsProgress?.leaders >= nextRank.min_leaders ? "bg-success text-white" : "bg-light text-muted"}`}
                                                >
                                                    <i
                                                        className={`fas ${requirementsProgress?.leaders >= nextRank.min_leaders ? "fa-check" : "fa-chess-king"}`}
                                                    ></i>
                                                </div>
                                                <span className="small fw-medium">
                                                    Líderes de Equipo
                                                </span>
                                            </div>
                                            <span className="small fw-bold">
                                                {requirementsProgress?.leaders ||
                                                    0}{" "}
                                                / {nextRank.min_leaders}
                                            </span>
                                        </div>
                                    )}

                                    {/* Mantenimiento */}
                                    {nextRank.maintenance_months > 0 && (
                                        <div className="d-flex align-items-center justify-content-between p-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className={`rounded-circle p-2 me-3 ${requirementsProgress?.maintenanceMonths >= nextRank.maintenance_months ? "bg-success text-white" : "bg-light text-muted"}`}
                                                >
                                                    <i
                                                        className={`fas ${requirementsProgress?.maintenanceMonths >= nextRank.maintenance_months ? "fa-check" : "fa-calendar-check"}`}
                                                    ></i>
                                                </div>
                                                <span className="small fw-medium">
                                                    Meses Mantenimiento
                                                </span>
                                            </div>
                                            <span className="small fw-bold">
                                                {requirementsProgress?.maintenanceMonths ||
                                                    0}{" "}
                                                / {nextRank.maintenance_months}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-4 mb-4">
                {/* Chart Section */}
                <div className="col-lg-8">
                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                            borderRadius: "12px",
                            border: "1px solid rgba(0,0,0,0.05)",
                            background: "#ffffff",
                        }}
                    >
                        <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-bold mb-1 text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    <i className="mdi mdi-trending-up me-2 text-info fs-4"></i>
                                    Análisis de Desempeño
                                </h5>
                                <small className="text-muted">
                                    Tus ganancias en los últimos 15 días
                                </small>
                            </div>
                            <div
                                className={`badge ${growthPercentage >= 0 ? "bg-success" : "bg-danger"} bg-opacity-10 ${growthPercentage >= 0 ? "text-success" : "text-danger"} px-3 py-2 rounded-pill`}
                            >
                                <i
                                    className={`fas fa-caret-${growthPercentage >= 0 ? "up" : "down"} me-1`}
                                ></i>
                                {Math.abs(growthPercentage).toFixed(1)}% vs mes anterior
                            </div>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <Chart
                                options={{
                                    chart: {
                                        type: "area",
                                        toolbar: { show: false },
                                        zoom: { enabled: false },
                                    },
                                    colors: ["#06b6d4"], // Cyan area as in the mockup image
                                    fill: {
                                        type: "gradient",
                                        gradient: {
                                            shadeIntensity: 1,
                                            opacityFrom: 0.4,
                                            opacityTo: 0.01,
                                            stops: [30, 100],
                                        },
                                    },
                                    dataLabels: { enabled: false },
                                    stroke: { curve: "smooth", width: 3 },
                                    xaxis: {
                                        categories: (earningsHistory || []).map(
                                            (h) => h.date,
                                        ),
                                        labels: {
                                            style: { colors: "#94a3b8", fontFamily: "'Outfit', sans-serif" },
                                        },
                                        axisBorder: { show: false },
                                        axisTicks: { show: false },
                                    },
                                    yaxis: {
                                        labels: {
                                            style: { colors: "#94a3b8", fontFamily: "'Outfit', sans-serif" },
                                        },
                                    },
                                    grid: { borderColor: "#f1f5f9" },
                                    tooltip: {
                                        theme: "light",
                                        x: { show: true },
                                    },
                                }}
                                series={[
                                    {
                                        name: "Ganancias",
                                        data: (earningsHistory || []).map((h) =>
                                            parseFloat(h.total),
                                        ),
                                    },
                                ]}
                                type="area"
                                height={300}
                            />
                        </div>
                    </div>
                </div>

                {/* Rank Perks Section */}
                <div className="col-lg-4">
                    <div
                        className="card border-0 shadow-lg h-100"
                        style={{
                            borderRadius: "1.5rem",
                            background: `linear-gradient(135deg, ${user.rank?.color || "#3b82f6"} 0%, #0f172a 100%)`,
                            position: "relative",
                            overflow: "hidden",
                            color: "#fff",
                        }}
                    >
                        {/* Abstract Background Design */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-20px",
                                right: "-20px",
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.15)",
                                filter: "blur(20px)",
                            }}
                        ></div>
                        <div
                            style={{
                                position: "absolute",
                                bottom: "10%",
                                left: "-20px",
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.1)",
                                filter: "blur(15px)",
                            }}
                        ></div>

                        <div className="card-body p-4 position-relative z-1 d-flex flex-column">
                            <div className="d-flex align-items-center mb-4">
                                <div
                                    className=" bg-white  rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "50px",
                                        height: "50px",

                                        color: user.rank?.color,
                                    }}
                                >
                                    <i className="fas fa-gem fa-2x"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1 text-white">
                                        Tus Beneficios
                                    </h5>
                                    <span className="badge py-2 px-2 bg-white bg-opacity-25 rounded-pill small">
                                        Rango {user.rank?.name || "Vendedor"}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-3 flex-grow-1">
                                {/* Personal Commission */}
                                <div
                                    className="p-3 rounded-4 border border-white border-opacity-10"
                                    style={{
                                        background: "rgba(255,255,255,0.08)",
                                        backdropFilter: "blur(5px)",
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-percentage me-2 opacity-75"></i>
                                            <span className="small">
                                                Comisión por Ventas
                                            </span>
                                        </div>
                                        <span className="fw-black fs-4">
                                            {user.rank?.commission_percent || 0}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Fixed Salary */}
                                {user.rank?.fixed_salary > 0 && (
                                    <div
                                        className="p-3 rounded-4 border border-white border-opacity-10"
                                        style={{
                                            background:
                                                "rgba(255,255,255,0.08)",
                                            backdropFilter: "blur(5px)",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-money-bill-wave me-2 opacity-75"></i>
                                                <span className="small">
                                                    Sueldo Fijo Mensual
                                                </span>
                                            </div>
                                            <span className="fw-bold fs-5">
                                                {CurrencySymbol()}{" "}
                                                {parseFloat(
                                                    user.rank.fixed_salary,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Promotion Bonus */}
                                {user.rank?.bonus_amount > 0 && (
                                    <div
                                        className="p-3 rounded-4 border border-white border-opacity-10"
                                        style={{
                                            background:
                                                "rgba(34, 197, 94, 0.2)",
                                            backdropFilter: "blur(5px)",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-gift me-2 text-warning"></i>
                                                <span className="small">
                                                    Bono por Ascenso
                                                </span>
                                            </div>
                                            <span className="fw-bold fs-5">
                                                {CurrencySymbol()}{" "}
                                                {parseFloat(
                                                    user.rank.bonus_amount,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Perks */}
                                <div className="mt-auto pt-3">
                                    <p
                                        className="small opacity-75 mb-2 fw-bold text-uppercase"
                                        style={{
                                            fontSize: "0.65rem",
                                            letterSpacing: "1px",
                                        }}
                                    >
                                        Privilegios Adicionales
                                    </p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {(Array.isArray(user.rank?.benefits)
                                            ? user.rank.benefits
                                            : []
                                        )
                                            .slice(0, 4)
                                            .map((b, idx) => (
                                                <span
                                                    key={idx}
                                                    className="badge bg-white bg-opacity-15 border border-white border-opacity-10 px-3 py-2 fw-normal"
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "#000",
                                                    }}
                                                >
                                                    <i className="fas fa-check-circle me-1 text-success"></i>{" "}
                                                    {b}
                                                </span>
                                            ))}
                                        {(Array.isArray(user.rank?.benefits)
                                            ? user.rank.benefits
                                            : []
                                        ).length === 0 && (
                                            <span className="text-white opacity-50 small italic">
                                                Seguimiento estándar activado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Links y Herramientas */}
            <div className="row g-4 mt-1">
                <div className="col-lg-6">
                    <div
                        className="card border-0 h-100 shadow-sm"
                        style={{
                            borderRadius: "12px",
                            border: "1px solid rgba(0,0,0,0.05)",
                            background: "#ffffff",
                        }}
                    >
                        <div className="card-header bg-transparent border-0 p-4 pb-0">
                            <h5 className="fw-bold mb-0 text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <i className="mdi mdi-storefront-outline me-2 text-primary fs-5"></i>
                                Mi Enlace de Tienda
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-muted small mb-4">
                                Comparte este enlace con tus clientes. Todas las compras realizadas aquí te generarán comisiones automáticamente.
                            </p>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    value={storeUrl}
                                    readOnly
                                    style={{ borderRadius: "8px 0 0 8px" }}
                                />
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() =>
                                        copyToClipboard(storeUrl, "store")
                                    }
                                    style={{ borderRadius: "0 8px 8px 0" }}
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
                                style={{ borderRadius: "8px" }}
                            >
                                <i className="fas fa-external-link-alt me-2"></i>{" "}
                                Abrir mi tienda
                            </a>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div
                        className="card border-0 h-100 shadow-sm"
                        style={{
                            borderRadius: "12px",
                            border: "1px solid rgba(0,0,0,0.05)",
                            background: "#ffffff",
                        }}
                    >
                        <div className="card-header bg-transparent border-0 p-4 pb-0">
                            <h5 className="fw-bold mb-0 text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <i className="mdi mdi-link-variant me-2 text-primary fs-5"></i>
                                Enlace de Reclutamiento
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-muted small mb-4">
                                Invita a otros a unirse a tu red. Cuando se registren con este link, formarán parte de tu equipo de ventas.
                            </p>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    value={inviteUrl}
                                    readOnly
                                    style={{ borderRadius: "8px 0 0 8px" }}
                                />
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() =>
                                        copyToClipboard(inviteUrl, "referral")
                                    }
                                    style={{ borderRadius: "0 8px 8px 0" }}
                                >
                                    <i
                                        className={`fas ${copiedReferral ? "fa-check" : "fa-copy"} me-2`}
                                    ></i>
                                    {copiedReferral ? "Copiado" : "Copiar"}
                                </button>
                            </div>
                            <div className="mt-3 p-3 bg-soft-warning rounded-3 border border-warning border-opacity-25 small">
                                <span className="text-dark">
                                    <i className="fas fa-info-circle me-1 text-warning"></i>
                                    Tu código de referido es:{" "}
                                    <strong>{user.uuid}</strong>
                                </span>
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
        <BaseAdminto {...properties} title="Dashboard de Vendedor">
            <Home {...properties} />
        </BaseAdminto>,
    );
});
