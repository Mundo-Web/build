import React, { useEffect, useState } from "react"
import { Search, RefreshCw, AlertTriangle, Package, CheckCircle } from "lucide-react"
import { GET } from "sode-extend-react"
import SalesRest from "../../../Actions/SalesRest"

const salesRest = new SalesRest()

const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    const date = d.toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" })
    const time = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: true })
    return { date, time }
}

const TrackTwenty = ({ data }) => {
    const [orderCode, setOrderCode] = useState(GET?.code ?? "")
    const [statusTracking, setStatusTracking] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchTracking = async (code) => {
        const { status, tracking } = await salesRest.track(code, false)
        if (!status) throw new Error("No encontrado")
        return tracking.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    const handleSearch = async (e) => {
        e?.preventDefault()
        if (!orderCode.trim()) return
        setIsLoading(true)
        setNotFound(false)
        setStatusTracking(null)
        try {
            setStatusTracking(await fetchTracking(orderCode))
        } catch {
            setNotFound(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = async () => {
        if (!orderCode.trim()) return
        setIsLoading(true)
        try {
            const result = await fetchTracking(orderCode)
            setStatusTracking(null)
            setTimeout(() => setStatusTracking(result), 80)
        } catch {
            setNotFound(true)
            setStatusTracking(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (orderCode) handleSearch()
    }, [])

    const currentStatus = statusTracking?.[0] ?? null

    return (
        <div
            id={data?.element_id || undefined}
            className="min-h-screen bg-black text-white font-paragraph py-16 px-4"
        >
            <div className="max-w-2xl mx-auto">

                {/* ── Header ── */}
                <div className="mb-12 text-center">
                    <p className="text-[10px] font-paragraph uppercase tracking-[0.3em] text-white/30 mb-3">
                        Estado del pedido
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Rastrear pedido
                    </h1>
                    <p className="mt-3 text-sm text-white/40 font-paragraph">
                        Ingresa el código de tu pedido para ver su estado actual
                    </p>
                </div>

                {/* ── Buscador ── */}
                <form onSubmit={handleSearch} className="flex gap-0 mb-10 border border-white/15">
                    <input
                        type="text"
                        placeholder="Ej: 20250624142749044420"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        className="flex-1 bg-white/5 text-white placeholder-white/25 px-5 py-4 text-sm font-paragraph outline-none focus:bg-white/10 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !orderCode.trim()}
                        className="bg-white text-black px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search size={14} strokeWidth={2.5} />
                        )}
                        {!isLoading && <span>Buscar</span>}
                    </button>
                </form>

                {/* ── Estado actual ── */}
                {currentStatus && (() => {
                    const { date, time } = formatDate(currentStatus.created_at)
                    return (
                        <div className="border border-white/15 mb-8 bg-white/5 backdrop-blur-sm">
                            <div
                                className="h-1 w-full"
                                style={{ backgroundColor: currentStatus.color || "#ffffff" }}
                            />
                            <div className="p-6 flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-11 h-11 flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: currentStatus.color || "#ffffff" }}
                                    >
                                        {currentStatus.icon ? (
                                            <i className={`${currentStatus.icon} text-white text-lg`} />
                                        ) : (
                                            <CheckCircle size={18} className="text-black" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-paragraph uppercase tracking-widest text-white/30 mb-1">
                                            Estado actual
                                        </p>
                                        <p
                                            className="text-xl font-black tracking-tight"
                                            style={{ color: currentStatus.color || "#ffffff" }}
                                        >
                                            {currentStatus.name}
                                        </p>
                                        {currentStatus.description && (
                                            <p className="text-xs text-white/50 font-paragraph mt-1 max-w-xs">
                                                {currentStatus.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-white">{date}</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">{time}</p>
                                </div>
                            </div>
                        </div>
                    )
                })()}

                {/* ── No encontrado ── */}
                {notFound && (
                    <div className="border border-red-500/30 bg-red-500/5 p-8 text-center mb-8">
                        <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-[9px] font-paragraph uppercase tracking-widest text-red-400/60 mb-2">
                            Error
                        </p>
                        <h3 className="text-base font-black text-red-400 mb-2">Pedido no encontrado</h3>
                        <p className="text-xs text-white/40 font-paragraph">
                            No se encontró información para el código{" "}
                            <span className="text-white/70 font-bold">{orderCode}</span>
                        </p>
                    </div>
                )}

                {/* ── Timeline ── */}
                {statusTracking && statusTracking.length > 0 && (
                    <div>
                        {/* Encabezado de timeline */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                            <div>
                                <p className="text-[9px] font-paragraph uppercase tracking-widest text-white/30 mb-1">
                                    Historial
                                </p>
                                <h3 className="text-base font-black tracking-tight text-white">
                                    Tracking de estados
                                </h3>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="flex items-center gap-2 border border-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/40 transition-all disabled:opacity-30"
                            >
                                <RefreshCw
                                    size={12}
                                    strokeWidth={2.5}
                                    className={isLoading ? "animate-spin" : ""}
                                />
                                Refrescar
                            </button>
                        </div>

                        {/* Items */}
                        <div className="relative">
                            {/* Línea vertical */}
                            <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />

                            <div className="space-y-5">
                                {statusTracking.map((status, index) => {
                                    const { date, time } = formatDate(status.created_at)
                                    const isFirst = index === 0
                                    return (
                                        <div
                                            key={status.id}
                                            className="relative flex items-start gap-5"
                                            style={{
                                                animation: `fadeSlideIn 0.3s ease both`,
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            {/* Dot */}
                                            <div
                                                className={`relative z-10 w-10 h-10 flex items-center justify-center shrink-0 transition-all ${isFirst ? "ring-4 ring-white/10" : ""}`}
                                                style={{ backgroundColor: status.color || "#333" }}
                                            >
                                                {status.icon ? (
                                                    <i className={`${status.icon} text-white text-sm`} />
                                                ) : (
                                                    <Package size={14} className="text-white" />
                                                )}
                                            </div>

                                            {/* Card */}
                                            <div
                                                className={`flex-1 border p-4 transition-all ${isFirst
                                                    ? "border-white/20 bg-white/8"
                                                    : "border-white/8 bg-white/3"
                                                    }`}
                                                style={isFirst ? { borderColor: `${status.color}40` } : {}}
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span
                                                            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5"
                                                            style={{
                                                                backgroundColor: `${status.color}20`,
                                                                color: status.color || "#fff",
                                                            }}
                                                        >
                                                            {status.name}
                                                        </span>
                                                        {isFirst && (
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 border border-white/10 px-2 py-0.5">
                                                                Actual
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-[10px] font-bold text-white/70">{date}</p>
                                                        <p className="text-[9px] text-white/30 mt-0.5">{time}</p>
                                                    </div>
                                                </div>
                                                {status.description && (
                                                    <p className="text-xs text-white/50 font-paragraph leading-relaxed">
                                                        {status.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Animación inline */}
                <style>{`
                    @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateY(8px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    .bg-white\/8  { background-color: rgba(255,255,255,0.08); }
                    .bg-white\/3  { background-color: rgba(255,255,255,0.03); }
                `}</style>
            </div>
        </div>
    )
}

export default TrackTwenty
