import React, { useState, useEffect, useCallback } from "react";
import SellersRest from "../../Actions/Admin/SellersRest";
import Global from "../../Utils/Global";

const sellersRest = new SellersRest();

/* ───────────────────────────────────────────────
   Utilidades: conteo, búsquedas e iniciales
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

const hasMatchingChild = (node, query) => {
    if (!query) return false;
    const q = query.toLowerCase();
    const children = node.referrals_recursive || node.children || [];
    return children.some((child) => {
        const nameMatch = `${child.name || ""} ${child.lastname || ""}`.toLowerCase().includes(q) || 
                          (child.email && child.email.toLowerCase().includes(q));
        return nameMatch || hasMatchingChild(child, query);
    });
};

const getInitials = (name, lastname) => {
    const first = name ? name[0] : "";
    const second = lastname ? lastname[0] : "";
    return (first + second).toUpperCase().slice(0, 2);
};

/* ───────────────────────────────────────────────
   Estilos CSS inline del organigrama
   ─────────────────────────────────────────────── */
const CONNECTOR_COLOR = "#cbd5e1";
const CONNECTOR_WIDTH = "2px";

/* ───────────────────────────────────────────────
   Card principal
   ─────────────────────────────────────────────── */
const SellerTreeCard = ({ isSellerView = false }) => {
    const [treeData, setTreeData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Controles de interacción
    const [searchQuery, setSearchQuery] = useState("");
    const [zoom, setZoom] = useState(1);

    const loadTree = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await sellersRest.getTree();
            if (response && response.status === 200 && response.data) {
                setTreeData(response.data.tree || []);
                setStats(response.data.stats || {});
            } else {
                setError("No se pudieron cargar los datos del árbol.");
            }
        } catch (err) {
            console.error("Error loading seller tree:", err);
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
                                {isSellerView
                                    ? "de Referidos"
                                    : "de Vendedores"}
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
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        {/* Search Input */}
                        <div className="position-relative me-2">
                            <input
                                type="text"
                                className="form-control form-control-sm rounded-pill px-3 py-1.5"
                                style={{
                                    maxWidth: "180px",
                                    fontSize: "12px",
                                    paddingLeft: "28px",
                                    border: "1px solid #e2e8f0",
                                    background: "#f8fafc",
                                }}
                                placeholder="Buscar socio..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i 
                                className="fas fa-search position-absolute text-muted" 
                                style={{ left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "11px" }}
                            ></i>
                            {searchQuery && (
                                <button
                                    className="btn btn-link btn-sm p-0 position-absolute text-muted hover-text-dark"
                                    style={{ right: "10px", top: "50%", transform: "translateY(-50%)", border: "0", background: "none" }}
                                    onClick={() => setSearchQuery("")}
                                >
                                    <i className="fas fa-times-circle"></i>
                                </button>
                            )}
                        </div>

                        {/* Zoom Controls */}
                        <div className="btn-group me-2" style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                            <button
                                className="btn btn-sm btn-white px-2 py-1.5"
                                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                                title="Alejar"
                                style={{ background: "#ffffff", border: "0", color: "#64748b" }}
                            >
                                <i className="mdi mdi-magnify-minus-outline fs-5"></i>
                            </button>
                            <button
                                className="btn btn-sm btn-white px-2 py-1.5 border-start border-end"
                                onClick={() => setZoom(1)}
                                title="Restablecer"
                                style={{ background: "#ffffff", border: "0", color: "#64748b" }}
                            >
                                <span className="small fw-semibold">{Math.round(zoom * 100)}%</span>
                            </button>
                            <button
                                className="btn btn-sm btn-white px-2 py-1.5"
                                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                                title="Acercar"
                                style={{ background: "#ffffff", border: "0", color: "#64748b" }}
                            >
                                <i className="mdi mdi-magnify-plus-outline fs-5"></i>
                            </button>
                        </div>

                        {/* Reload Button */}
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
                                    Sin vendedores registrados
                                </h6>
                                <p className="text-muted small mb-0">
                                    Los vendedores aparecerán aquí cuando se
                                    registren.
                                </p>
                            </div>
                        )}

                    {!loading && !error && treeData && treeData.length > 0 && (
                        <div 
                            className="org-tree-wrapper"
                            style={{ 
                                zoom: zoom,
                                transition: 'zoom 0.15s ease-out'
                            }}
                        >
                            {isSellerView ? (
                                treeData.map((node) => (
                                    <SellerTreeNode
                                        key={node.id}
                                        seller={node}
                                        level={0}
                                        isCompanyRoot={true}
                                        isSellerRoot={true}
                                        searchQuery={searchQuery}
                                    />
                                ))
                            ) : (
                                <SellerTreeNode
                                    seller={companyRootNode}
                                    level={0}
                                    isCompanyRoot={true}
                                    searchQuery={searchQuery}
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
                                        background: "#0ea5e9", // Sky Blue
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
                                        background: "#22c55e", // Green
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
                                        background: "#06b6d4", // Cyan
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
                                        background: "#eab308", // Yellow
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
const SellerTreeNode = ({
    seller,
    level = 0,
    isCompanyRoot = false,
    isSellerRoot = false,
    searchQuery = "",
}) => {
    const [expanded, setExpanded] = useState(level < 2);
    const children = seller.referrals_recursive || seller.children || [];
    const hasChildren = children.length > 0;
    const fullName =
        isCompanyRoot && !isSellerRoot
            ? Global.APP_NAME || "Empresa"
            : `${seller.name || ""} ${seller.lastname || ""}`.trim() ||
              "Sin nombre";
    const childCount = children.length;
    const totalDescendants = countDescendants(seller);

    // Búsqueda interactiva: comprobar coincidencia del nodo
    const nameStr = fullName.toLowerCase();
    const emailStr = (seller.email || "").toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    const isMatching = q ? (nameStr.includes(q) || emailStr.includes(q)) : false;

    // Auto-expandir si algún descendiente coincide con la búsqueda
    useEffect(() => {
        if (q && hasMatchingChild(seller, q)) {
            setExpanded(true);
        }
    }, [searchQuery, seller]);

    const getLevelStyle = () => {
        if (isCompanyRoot)
            return {
                bg: "#ffffff",
                border: "rgba(14, 165, 233, 0.15)", // Sky Blue accent border
                text: "#0f172a",
                badge: "#0ea5e9",
                iconBg: "#e0f2fe", // Sky Blue pastel
                iconColor: "#0284c7",
                shadow: "0 10px 25px rgba(0, 0, 0, 0.03)",
            };
        if (level === 1)
            return {
                bg: "#ffffff",
                border: "rgba(34, 197, 94, 0.15)", // Green accent border
                text: "#0f172a",
                badge: "#22c55e",
                iconBg: "#dcfce7", // Green pastel
                iconColor: "#16a34a",
                shadow: "0 6px 15px rgba(0, 0, 0, 0.03)",
            };
        if (hasChildren)
            return {
                bg: "#ffffff",
                border: "rgba(6, 182, 212, 0.15)", // Cyan accent border
                text: "#0f172a",
                badge: "#06b6d4",
                iconBg: "#ecfeff", // Cyan pastel
                iconColor: "#0891b2",
                shadow: "0 6px 15px rgba(0, 0, 0, 0.03)",
            };
        return {
            bg: "#ffffff",
            border: "rgba(234, 179, 8, 0.15)", // Yellow accent border
            text: "#475569",
            badge: "#eab308",
            iconBg: "#fef9c3", // Yellow pastel
            iconColor: "#ca8a04",
            shadow: "0 4px 10px rgba(0, 0, 0, 0.02)",
        };
    };

    const style = getLevelStyle();
    const initials = isCompanyRoot && !isSellerRoot ? "RW" : getInitials(seller.name, seller.lastname);

    return (
        <div className="org-tree-node">
            {/* Nodo */}
            <div
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{
                    background: style.bg,
                    border: isMatching ? "3px solid #6366f1" : `1px solid ${style.border}`,
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
                    boxShadow: isMatching ? "0 0 20px rgba(99, 102, 241, 0.6)" : style.shadow,
                    transform: isMatching ? "scale(1.05)" : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    position: "relative",
                    userSelect: "none",
                    display: "inline-block",
                }}
                onMouseEnter={(e) => {
                    if (!isMatching) e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                    if (!isMatching) e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                {/* Avatar / Iniciales */}
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
                        background: isMatching ? "#eff6ff" : style.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        border: isMatching ? "2px solid #6366f1" : `1px solid ${style.border}`,
                        fontSize: isCompanyRoot
                            ? "14px"
                            : level === 1
                              ? "12px"
                              : "10px",
                        fontWeight: 800,
                        color: isMatching ? "#2563eb" : style.iconColor,
                        fontFamily: "'Outfit', sans-serif"
                    }}
                >
                    {initials || <i className="fas fa-user"></i>}
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
                        color: "#64748b",
                        marginBottom: hasChildren ? "5px" : "0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {isCompanyRoot && !isSellerRoot
                        ? "Nodo principal"
                        : seller.email}
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
                                background: style.iconBg,
                                color: style.iconColor,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                border: `1px solid ${style.border}`,
                                fontFamily: "'Outfit', sans-serif"
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
                                    background: "#ffffff",
                                    color: style.iconColor,
                                    border: `1px solid ${style.border}`,
                                    fontFamily: "'Outfit', sans-serif"
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
                                <SellerTreeNode
                                    seller={child}
                                    level={level + 1}
                                    isCompanyRoot={false}
                                    searchQuery={searchQuery}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SellerTreeCard;
