import React, { useState, useEffect, useCallback } from "react";
import ProvidersRest from "../../Actions/Admin/ProvidersRest";
import Global from "../../Utils/Global";

const providersRest = new ProvidersRest();

/* ───────────────────────────────────────────────
   Utilidad: contar todos los descendientes
   ─────────────────────────────────────────────── */
const countDescendants = (node) => {
    const children = node.referrals_recursive || node.children || [];
    if (children.length === 0) return 0;
    let count = children.length;
    children.forEach((child) => {
        count += countDescendants(child);
    });
    return count;
};

/* ───────────────────────────────────────────────
   Estilos CSS inline del organigrama
   ─────────────────────────────────────────────── */
const CONNECTOR_COLOR = "#cbd5e1";
const CONNECTOR_WIDTH = "2px";

/* ───────────────────────────────────────────────
   Nodo individual del organigrama
   ─────────────────────────────────────────────── */
const OrgNode = ({ provider, level = 0, isCompanyRoot = false }) => {
    const [expanded, setExpanded] = useState(level < 2);
    const children = provider.referrals_recursive || provider.children || [];
    const hasChildren = children.length > 0;
    const fullName = isCompanyRoot
        ? Global.APP_NAME || "Empresa"
        : `${provider.name || ""} ${provider.lastname || ""}`.trim() ||
          "Sin nombre";
    const childCount = children.length;
    const totalDescendants = countDescendants(provider);

    const getLevelStyle = () => {
        if (isCompanyRoot)
            return {
                bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
                border: "#334155",
                text: "#fff",
                badge: "#0f172a",
                shadow: "0 8px 25px rgba(15,23,42,0.35)",
            };
        if (level === 1)
            return {
                bg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "#818cf8",
                text: "#fff",
                badge: "#4f46e5",
                shadow: "0 4px 15px rgba(99,102,241,0.25)",
            };
        if (hasChildren)
            return {
                bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "#34d399",
                text: "#fff",
                badge: "#047857",
                shadow: "0 4px 12px rgba(16,185,129,0.2)",
            };
        return {
            bg: "#ffffff",
            border: "#e2e8f0",
            text: "#374151",
            badge: "#6b7280",
            shadow: "0 2px 8px rgba(0,0,0,0.05)",
        };
    };

    const style = getLevelStyle();
    const isColoredNode = isCompanyRoot || level === 1 || hasChildren;

    return (
        <div className="org-tree-node">
            {/* ── Nodo card ── */}
            <div
                className="org-node-card"
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{
                    background: style.bg,
                    border: `2px solid ${style.border}`,
                    borderRadius: isCompanyRoot ? "14px" : "10px",
                    padding: isCompanyRoot
                        ? "18px 28px"
                        : level === 1
                          ? "14px 20px"
                          : "10px 16px",
                    minWidth: isCompanyRoot
                        ? "240px"
                        : level === 1
                          ? "190px"
                          : "160px",
                    maxWidth: "260px",
                    textAlign: "center",
                    cursor: hasChildren ? "pointer" : "default",
                    boxShadow: style.shadow,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    position: "relative",
                    userSelect: "none",
                    display: "inline-block",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                {/* Avatar */}
                <div
                    style={{
                        width: isCompanyRoot
                            ? "50px"
                            : level === 1
                              ? "40px"
                              : "32px",
                        height: isCompanyRoot
                            ? "50px"
                            : level === 1
                              ? "40px"
                              : "32px",
                        borderRadius: "50%",
                        background: isColoredNode
                            ? "rgba(255,255,255,0.18)"
                            : "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        border: isColoredNode
                            ? "2px solid rgba(255,255,255,0.25)"
                            : "2px solid #e2e8f0",
                    }}
                >
                    <i
                        className={
                            isCompanyRoot
                                ? "fas fa-building"
                                : level === 1
                                  ? "fas fa-crown"
                                  : "fas fa-user"
                        }
                        style={{
                            fontSize: isCompanyRoot
                                ? "20px"
                                : level === 1
                                  ? "15px"
                                  : "12px",
                            color: isColoredNode ? "#fff" : "#94a3b8",
                        }}
                    ></i>
                </div>

                {/* Nombre */}
                <div
                    style={{
                        fontWeight: isCompanyRoot ? 800 : 700,
                        fontSize: isCompanyRoot
                            ? "15px"
                            : level === 1
                              ? "12px"
                              : "11px",
                        color: style.text,
                        lineHeight: 1.3,
                        marginBottom: "3px",
                    }}
                >
                    {fullName}
                </div>

                {/* Email */}
                <div
                    style={{
                        fontSize: "9px",
                        color: isColoredNode
                            ? "rgba(255,255,255,0.6)"
                            : "#94a3b8",
                        marginBottom: hasChildren ? "6px" : "0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {isCompanyRoot ? "Nodo principal" : provider.email}
                </div>

                {/* Badges */}
                {hasChildren && (
                    <div
                        style={{
                            display: "flex",
                            gap: "3px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "8px",
                                fontWeight: 700,
                                padding: "1px 7px",
                                borderRadius: "8px",
                                background: isColoredNode
                                    ? "rgba(255,255,255,0.2)"
                                    : "#f1f5f9",
                                color: isColoredNode ? "#fff" : "#64748b",
                                border: isColoredNode
                                    ? "1px solid rgba(255,255,255,0.12)"
                                    : "1px solid #e2e8f0",
                                textTransform: "uppercase",
                                letterSpacing: "0.3px",
                            }}
                        >
                            {childCount} directo{childCount !== 1 ? "s" : ""}
                        </span>
                        {totalDescendants > childCount && (
                            <span
                                style={{
                                    fontSize: "8px",
                                    fontWeight: 600,
                                    padding: "1px 7px",
                                    borderRadius: "8px",
                                    background: isColoredNode
                                        ? "rgba(255,255,255,0.1)"
                                        : "#f8fafc",
                                    color: isColoredNode
                                        ? "rgba(255,255,255,0.75)"
                                        : "#94a3b8",
                                }}
                            >
                                {totalDescendants} total
                            </span>
                        )}
                    </div>
                )}

                {/* Expand/collapse toggle */}
                {hasChildren && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-13px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: style.badge,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "3px solid #fafbfc",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                            zIndex: 2,
                        }}
                    >
                        <i
                            className={`fas fa-chevron-${expanded ? "up" : "down"}`}
                            style={{ fontSize: "7px", color: "#fff" }}
                        ></i>
                    </div>
                )}
            </div>

            {/* ── Hijos con conectores profesionales ── */}
            {expanded && hasChildren && (
                <>
                    {/* Línea vertical desde el padre hasta la barra horizontal */}
                    <div
                        style={{
                            width: CONNECTOR_WIDTH,
                            height: "28px",
                            background: CONNECTOR_COLOR,
                            margin: "0 auto",
                        }}
                    />

                    {/* Contenedor de hijos con líneas de conexión usando border-top */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {children.map((child, index) => {
                            const isFirst = index === 0;
                            const isLast = index === children.length - 1;
                            const isOnly = children.length === 1;

                            return (
                                <div
                                    key={child.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        /* Barra horizontal superior:
                                           - Hijo único: sin borde
                                           - Primer hijo: borde solo a la derecha
                                           - Último hijo: borde solo a la izquierda
                                           - Hijos intermedios: borde completo
                                        */
                                        borderTop: isOnly
                                            ? "none"
                                            : `${CONNECTOR_WIDTH} solid ${CONNECTOR_COLOR}`,
                                        borderLeft:
                                            !isOnly && !isFirst
                                                ? "none"
                                                : "none",
                                        borderRight: "none",
                                        ...(isOnly
                                            ? {}
                                            : isFirst
                                              ? {
                                                    borderLeft: "none",
                                                    borderTopLeftRadius: "0",
                                                    marginLeft: "0",
                                                    borderTop: `${CONNECTOR_WIDTH} solid ${CONNECTOR_COLOR}`,
                                                    clipPath:
                                                        "inset(0 0 0 50%)",
                                                }
                                              : isLast
                                                ? {
                                                      borderTop: `${CONNECTOR_WIDTH} solid ${CONNECTOR_COLOR}`,
                                                      clipPath:
                                                          "inset(0 50% 0 0)",
                                                  }
                                                : {}),
                                        padding: "0 8px",
                                    }}
                                >
                                    {/* Línea vertical desde la barra horizontal al nodo hijo */}
                                    <div
                                        style={{
                                            width: CONNECTOR_WIDTH,
                                            height: "20px",
                                            background: CONNECTOR_COLOR,
                                        }}
                                    />
                                    <OrgNode
                                        provider={child}
                                        level={level + 1}
                                        isCompanyRoot={false}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

/* ───────────────────────────────────────────────
   Card principal
   ─────────────────────────────────────────────── */
const ProviderTreeCard = ({ isProviderView = false }) => {
    const [treeData, setTreeData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadTree = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await providersRest.getTree();
            if (response && response.status === 200 && response.data) {
                setTreeData(response.data.tree || []);
                setStats(response.data.stats || {});
            } else {
                setError("No se pudieron cargar los datos del árbol.");
            }
        } catch (err) {
            console.error("Error loading provider tree:", err);
            setError("Error de conexión al cargar el organigrama.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTree();
    }, [loadTree]);

    const companyRootNode = {
        id: "company-root",
        name: Global.APP_NAME || "Empresa",
        email: "",
        children: treeData || [],
    };

    return (
        <div className="col-12">
            {/* Inyectar CSS del organigrama */}
            <style>{`
                .org-tree-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: fit-content;
                    padding: 20px 40px 30px;
                }
                .org-tree-node {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .org-tree-children {
                    display: flex;
                    padding-top: 0;
                    position: relative;
                }
                .org-tree-children::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: calc(50% - 1px);
                    width: 0;
                    height: 0;
                }
                .org-child-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    padding: 0 10px;
                }
                /* Línea horizontal superior en cada hijo */
                .org-child-wrapper::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    height: ${CONNECTOR_WIDTH};
                    background: ${CONNECTOR_COLOR};
                    width: 50%;
                }
                .org-child-wrapper::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    height: ${CONNECTOR_WIDTH};
                    background: ${CONNECTOR_COLOR};
                    width: 50%;
                }
                /* Línea izquierda: del centro hacia la izquierda */
                .org-child-wrapper::before {
                    right: 50%;
                }
                /* Línea derecha: del centro hacia la derecha */
                .org-child-wrapper::after {
                    left: 50%;
                }
                /* Primer hijo: no extiende a la izquierda */
                .org-child-wrapper:first-child::before {
                    width: 0;
                }
                /* Último hijo: no extiende a la derecha */
                .org-child-wrapper:last-child::after {
                    width: 0;
                }
                /* Hijo único: sin líneas horizontales */
                .org-child-wrapper:only-child::before,
                .org-child-wrapper:only-child::after {
                    width: 0;
                }
                /* Línea vertical del hijo (baja de la barra horizontal al nodo) */
                .org-child-connector {
                    width: ${CONNECTOR_WIDTH};
                    height: 22px;
                    background: ${CONNECTOR_COLOR};
                }
                /* Línea vertical del padre (baja del nodo padre a la barra horizontal) */
                .org-parent-connector {
                    width: ${CONNECTOR_WIDTH};
                    height: 28px;
                    background: ${CONNECTOR_COLOR};
                    margin: 0 auto;
                }
            `}</style>

            <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "16px", overflow: "hidden" }}
            >
                {/* Header */}
                <div
                    className="card-header border-0 d-flex justify-content-between align-items-center"
                    style={{
                        background: "#ffffff",
                        padding: "1.25rem 2rem",
                        borderBottom: "1px solid #f1f5f9",
                    }}
                >
                    <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: "44px",
                                height: "44px",
                                backgroundColor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                            }}
                        >
                            <i
                                className="fas fa-sitemap text-primary"
                                style={{ fontSize: "18px" }}
                            ></i>
                        </div>
                        <div>
                            <h6
                                className="mb-0 text-dark fw-bold"
                                style={{ fontSize: "16px" }}
                            >
                                Organigrama{" "}
                                {isProviderView
                                    ? "de Referidos"
                                    : "de Proveedores"}
                            </h6>
                            <small
                                style={{
                                    color: "#64748b",
                                    fontSize: "11px",
                                }}
                            >
                                Red de referidos · Estructura piramidal
                            </small>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {stats && (
                            <>
                                <div
                                    style={{
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "8px 18px",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: 800,
                                            color: "#334155",
                                            lineHeight: 1,
                                            marginBottom: "2px",
                                        }}
                                    >
                                        {stats.total_providers || 0}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "9px",
                                            color: "#64748b",
                                            textTransform: "uppercase",
                                            letterSpacing: "1px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Socios
                                    </div>
                                </div>
                                <div
                                    style={{
                                        background: "#eff6ff",
                                        border: "1px solid #dbeafe",
                                        borderRadius: "12px",
                                        padding: "8px 18px",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: 800,
                                            color: "#1e40af",
                                            lineHeight: 1,
                                            marginBottom: "2px",
                                        }}
                                    >
                                        {stats.providers_with_referrals || 0}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "9px",
                                            color: "#3b82f6",
                                            textTransform: "uppercase",
                                            letterSpacing: "1px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Líderes
                                    </div>
                                </div>
                            </>
                        )}
                        <button
                            className="btn btn-sm"
                            onClick={loadTree}
                            title="Recargar"
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                color: "#64748b",
                                borderRadius: "10px",
                                width: "38px",
                                height: "38px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <i
                                className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`}
                                style={{ fontSize: "13px" }}
                            ></i>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div
                    className="card-body"
                    style={{
                        background: "#fafbfc",
                        minHeight: "200px",
                        maxHeight: "700px",
                        overflowX: "auto",
                        overflowY: "auto",
                        padding: "0",
                    }}
                >
                    {loading && (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                role="status"
                                style={{
                                    color: "#6366f1",
                                    width: "3rem",
                                    height: "3rem",
                                }}
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>
                            <p
                                className="mt-3 text-muted"
                                style={{ fontSize: "13px" }}
                            >
                                Cargando organigrama...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="p-3">
                            <div
                                className="alert alert-danger border-0 shadow-sm mb-0"
                                role="alert"
                                style={{ borderRadius: "12px" }}
                            >
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        treeData &&
                        treeData.length === 0 && (
                            <div className="text-center py-5">
                                <div
                                    style={{
                                        fontSize: "56px",
                                        opacity: 0.15,
                                        marginBottom: "16px",
                                    }}
                                >
                                    <i className="fas fa-sitemap"></i>
                                </div>
                                <h6
                                    className="text-muted mb-2"
                                    style={{ fontWeight: 600 }}
                                >
                                    Sin proveedores registrados
                                </h6>
                                <p className="text-muted small mb-0">
                                    Los proveedores aparecerán aquí cuando se
                                    registren.
                                </p>
                            </div>
                        )}

                    {!loading && !error && treeData && treeData.length > 0 && (
                        <div className="org-tree-wrapper">
                            {isProviderView ? (
                                treeData.map((node) => (
                                    <OrgTreeNode
                                        key={node.id}
                                        provider={node}
                                        level={0}
                                        isCompanyRoot={true}
                                        isProviderRoot={true}
                                    />
                                ))
                            ) : (
                                <OrgTreeNode
                                    provider={companyRootNode}
                                    level={0}
                                    isCompanyRoot={true}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && treeData && treeData.length > 0 && (
                    <div
                        className="card-footer border-0"
                        style={{
                            padding: "12px 24px",
                            background: "#fff",
                            borderTop: "1px solid #f3f4f6",
                        }}
                    >
                        <div
                            className="d-flex align-items-center gap-4 flex-wrap"
                            style={{ fontSize: "11px", color: "#94a3b8" }}
                        >
                            <span className="d-flex align-items-center gap-1">
                                <span
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "4px",
                                        background:
                                            "linear-gradient(135deg, #0f172a, #334155)",
                                        display: "inline-block",
                                    }}
                                ></span>
                                {Global.APP_NAME || "Empresa"}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                                <span
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "4px",
                                        background:
                                            "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                        display: "inline-block",
                                    }}
                                ></span>
                                Directo
                            </span>
                            <span className="d-flex align-items-center gap-1">
                                <span
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "4px",
                                        background:
                                            "linear-gradient(135deg, #10b981, #059669)",
                                        display: "inline-block",
                                    }}
                                ></span>
                                Con red
                            </span>
                            <span className="d-flex align-items-center gap-1">
                                <span
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "4px",
                                        background: "#fff",
                                        border: "2px solid #e2e8f0",
                                        display: "inline-block",
                                    }}
                                ></span>
                                Hoja
                            </span>
                            <span
                                className="ms-auto"
                                style={{ fontSize: "10px" }}
                            >
                                <i className="fas fa-mouse-pointer me-1"></i>
                                Clic para expandir/colapsar
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   Componente recursivo con conectores CSS ::before/::after
   ─────────────────────────────────────────────── */
const OrgTreeNode = ({
    provider,
    level = 0,
    isCompanyRoot = false,
    isProviderRoot = false,
}) => {
    const [expanded, setExpanded] = useState(level < 2);
    const children = provider.referrals_recursive || provider.children || [];
    const hasChildren = children.length > 0;
    const fullName =
        isCompanyRoot && !isProviderRoot
            ? Global.APP_NAME || "Empresa"
            : `${provider.name || ""} ${provider.lastname || ""}`.trim() ||
              "Sin nombre";
    const childCount = children.length;
    const totalDescendants = countDescendants(provider);

    const getLevelStyle = () => {
        if (isCompanyRoot)
            return {
                bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "#e2e8f0",
                text: "#1e293b",
                badge: "#94a3b8",
                iconColor: "#475569",
                shadow: "0 10px 25px rgba(0, 0, 0, 0.04)",
            };
        if (level === 1)
            return {
                bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                border: "#bfdbfe",
                text: "#1e40af",
                badge: "#3b82f6",
                iconColor: "#2563eb",
                shadow: "0 6px 15px rgba(37, 99, 235, 0.06)",
            };
        if (hasChildren)
            return {
                bg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
                border: "#99f6e4",
                text: "#0f766e",
                badge: "#14b8a6",
                iconColor: "#0d9488",
                shadow: "0 6px 15px rgba(20, 184, 166, 0.06)",
            };
        return {
            bg: "#ffffff",
            border: "#f1f5f9",
            text: "#64748b",
            badge: "#cbd5e1",
            iconColor: "#94a3b8",
            shadow: "0 4px 10px rgba(0, 0, 0, 0.03)",
        };
    };

    const style = getLevelStyle();
    const isColoredNode = isCompanyRoot || level === 1 || hasChildren;

    return (
        <div className="org-tree-node">
            {/* Nodo */}
            <div
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{
                    background: style.bg,
                    border: `2px solid ${style.border}`,
                    borderRadius: isCompanyRoot ? "14px" : "10px",
                    padding: isCompanyRoot
                        ? "18px 28px"
                        : level === 1
                          ? "12px 18px"
                          : "10px 14px",
                    minWidth: isCompanyRoot
                        ? "230px"
                        : level === 1
                          ? "180px"
                          : "150px",
                    maxWidth: "260px",
                    textAlign: "center",
                    cursor: hasChildren ? "pointer" : "default",
                    boxShadow: style.shadow,
                    transition: "transform 0.2s ease",
                    position: "relative",
                    userSelect: "none",
                    display: "inline-block",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                {/* Avatar */}
                <div
                    style={{
                        width: isCompanyRoot
                            ? "48px"
                            : level === 1
                              ? "38px"
                              : "30px",
                        height: isCompanyRoot
                            ? "48px"
                            : level === 1
                              ? "38px"
                              : "30px",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        border: `2px solid ${style.border}`,
                    }}
                >
                    <i
                        className={
                            isCompanyRoot
                                ? "fas fa-building"
                                : level === 1
                                  ? "fas fa-crown"
                                  : "fas fa-user"
                        }
                        style={{
                            fontSize: isCompanyRoot
                                ? "18px"
                                : level === 1
                                  ? "14px"
                                  : "11px",
                            color: style.iconColor,
                        }}
                    ></i>
                </div>

                {/* Nombre */}
                <div
                    style={{
                        fontWeight: isCompanyRoot ? 800 : 700,
                        fontSize: isCompanyRoot
                            ? "14px"
                            : level === 1
                              ? "12px"
                              : "11px",
                        color: style.text,
                        lineHeight: 1.3,
                        marginBottom: "2px",
                    }}
                >
                    {fullName}
                </div>

                {/* Email */}
                <div
                    style={{
                        fontSize: "9px",
                        color: isColoredNode ? "#000000" : "#000000",
                        marginBottom: hasChildren ? "5px" : "0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {isCompanyRoot && !isProviderRoot
                        ? "Nodo principal"
                        : provider.email}
                </div>

                {/* Badges */}
                {hasChildren && (
                    <div
                        style={{
                            display: "flex",
                            gap: "3px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "8px",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: "20px",
                                background: "#f1f5f9",
                                color: "#475569",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                border: "1px solid #e2e8f0",
                            }}
                        >
                            {childCount} dir.
                        </span>
                        {totalDescendants > childCount && (
                            <span
                                style={{
                                    fontSize: "8px",
                                    fontWeight: 700,
                                    padding: "2px 8px",
                                    borderRadius: "20px",
                                    background: "#f8fafc",
                                    color: "#64748b",
                                    border: "1px solid #f1f5f9",
                                }}
                            >
                                {totalDescendants} tot.
                            </span>
                        )}
                    </div>
                )}

                {/* Toggle */}
                {hasChildren && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-12px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: style.badge,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "3px solid #fafbfc",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            zIndex: 2,
                        }}
                    >
                        <i
                            className={`fas fa-chevron-${expanded ? "up" : "down"}`}
                            style={{ fontSize: "7px", color: "#fff" }}
                        ></i>
                    </div>
                )}
            </div>

            {/* Hijos */}
            {expanded && hasChildren && (
                <>
                    <div className="org-parent-connector" />
                    <div className="org-tree-children">
                        {children.map((child) => (
                            <div key={child.id} className="org-child-wrapper">
                                <div className="org-child-connector" />
                                <OrgTreeNode
                                    provider={child}
                                    level={level + 1}
                                    isCompanyRoot={false}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProviderTreeCard;
