import { MapPin, Phone, User, Clock, CheckCircle2, Store } from "lucide-react";
import React, { useState, useEffect } from "react";

const StorePickupSelectorTwenty = ({
    ubigeoCode,
    ubigeo,
    onStoreSelect,
    selectedStore = null,
    specificStores = null, // Array de IDs de tiendas específicas, o null/[] para todas
    className = "",
}) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStores();
    }, [specificStores]);

    const loadStores = async () => {
        setLoading(true);
        setError(null);

        try {
            // Ruta pública — no requiere autenticación
            const response = await fetch("/api/stores", {
                method: "GET",
                headers: { Accept: "application/json" },
            });

            if (!response.ok) throw new Error("Error al obtener tiendas");
            const result = await response.json();

            let allStores = result?.data || [];

            // Filtrar: activas, visibles, con pickup habilitado
            allStores = allStores.filter((store) => {
                const isVisible = store.visible === true || store.visible === 1;
                const isActive = store.status === true || store.status === 1;
                const isPickupEnabled =
                    store.pickup_available === true ||
                    store.pickup_available === 1 ||
                    store.pickup_available === undefined;
                return isVisible && isActive && isPickupEnabled;
            });

            // Filtrar por tiendas específicas si se indicaron
            if (
                specificStores &&
                Array.isArray(specificStores) &&
                specificStores.length > 0
            ) {
                allStores = allStores.filter((store) =>
                    specificStores.includes(store.id),
                );
            }

            setStores(allStores);
        } catch (err) {
            setError("No se pudieron cargar las tiendas disponibles");
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    /* ── Estados de carga / error / vacío ─────────────────────────── */

    if (loading)
        return (
            <div className="py-10 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin" />
                <p className="text-[10px] font-paragraph uppercase tracking-widest text-white/40">
                    Cargando puntos de retiro...
                </p>
            </div>
        );

    if (error)
        return (
            <div className="p-6 border border-red-500/30 bg-red-500/5">
                <p className="text-[10px] font-paragraph uppercase tracking-widest text-red-400 text-center">
                    {error}
                </p>
            </div>
        );

    if (stores.length === 0)
        return (
            <div className="p-6 border border-white/10 text-center">
                <Store size={24} className="mx-auto mb-3 text-white/20" />
                <p className="text-[10px] font-paragraph uppercase tracking-widest text-white/30">
                    No hay puntos de retiro disponibles en esta zona.
                </p>
            </div>
        );

    /* ── Render principal ──────────────────────────────────────────── */

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="mb-2">
                <h3 className="text-[10px] font-paragraph uppercase tracking-widest text-white/50 mb-1">
                    Selecciona una tienda para retiro
                </h3>
                <div className="w-8 h-px bg-white/20" />
            </div>

            {/* Grid de tiendas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {stores.map((store) => {
                    const isSelected = selectedStore?.id === store.id;

                    return (
                        <button
                            key={store.id}
                            type="button"
                            onClick={() => onStoreSelect(store)}
                            className={`text-left border transition-all duration-200 p-4 relative overflow-hidden group ${
                                isSelected
                                    ? "border-white bg-white text-black"
                                    : "border-white/10 bg-white/[0.02] text-white hover:border-white/30 hover:bg-white/[0.05]"
                            }`}
                        >
                            {/* Indicador de selección */}
                            <div
                                className={`absolute top-3 right-3 w-4 h-4 border flex items-center justify-center transition-all ${
                                    isSelected
                                        ? "border-black bg-black"
                                        : "border-white/20 group-hover:border-white/40"
                                }`}
                            >
                                {isSelected && (
                                    <div className="w-1.5 h-1.5 bg-white" />
                                )}
                            </div>

                            {/* Fila superior: imagen + nombre */}
                            <div className="flex items-start gap-3 pr-6 mb-3">
                                <div
                                    className={`w-12 h-12 shrink-0 overflow-hidden border ${
                                        isSelected
                                            ? "border-black/20"
                                            : "border-white/10"
                                    }`}
                                >
                                    <img
                                        src={`/api/stores/media/${store.image}`}
                                        alt={store.name}
                                        className="w-full h-full object-cover grayscale"
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4
                                        className={`text-sm font-paragraph uppercase tracking-tight truncate font-semibold ${
                                            isSelected
                                                ? "text-black"
                                                : "text-white"
                                        }`}
                                    >
                                        {store.name}
                                    </h4>

                                    {/* Badge tipo */}
                                    <span
                                        className={`inline-block mt-1 px-2 py-0.5 text-[8px] font-paragraph uppercase tracking-widest ${
                                            isSelected
                                                ? "bg-black text-white"
                                                : "bg-white/10 text-white/50"
                                        }`}
                                    >
                                        {store.type === "tienda_principal"
                                            ? "Tienda Principal"
                                            : store.type?.replace("_", " ") ||
                                              "Tienda"}
                                    </span>
                                </div>
                            </div>

                            {/* Dirección */}
                            {store.address && (
                                <div className="flex items-start gap-2 mb-2">
                                    <MapPin
                                        size={11}
                                        className={`mt-0.5 shrink-0 ${
                                            isSelected
                                                ? "text-black/40"
                                                : "text-white/30"
                                        }`}
                                    />
                                    <p
                                        className={`text-[10px] font-paragraph uppercase tracking-wide line-clamp-2 ${
                                            isSelected
                                                ? "text-black/60"
                                                : "text-white/40"
                                        }`}
                                    >
                                        {store.address}
                                    </p>
                                </div>
                            )}

                            {/* Teléfono */}
                            {store.phone && (
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone
                                        size={11}
                                        className={`shrink-0 ${
                                            isSelected
                                                ? "text-black/40"
                                                : "text-white/30"
                                        }`}
                                    />
                                    <span
                                        className={`text-[10px] font-paragraph tracking-wide ${
                                            isSelected
                                                ? "text-black/60"
                                                : "text-white/40"
                                        }`}
                                    >
                                        {store.phone}
                                    </span>
                                </div>
                            )}

                            {/* Horario de hoy */}
                            {store.business_hours && (
                                <TodaySchedule
                                    hours={store.business_hours}
                                    isSelected={isSelected}
                                />
                            )}

                            {/* Decoración: checkmark cuando está seleccionado */}
                            {isSelected && (
                                <div className="absolute -bottom-3 -right-3 opacity-10">
                                    <CheckCircle2 size={56} className="text-black" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/* ── Sub-componente: horario de hoy ──────────────────────────────── */

function TodaySchedule({ hours, isSelected }) {
    try {
        const parsed =
            typeof hours === "string" ? JSON.parse(hours) : hours;
        if (!Array.isArray(parsed)) return null;

        const dayMap = {
            lunes: "Lunes",
            martes: "Martes",
            "miércoles": "Miércoles",
            jueves: "Jueves",
            viernes: "Viernes",
            "sábado": "Sábado",
            domingo: "Domingo",
        };

        const todayKey = new Date()
            .toLocaleDateString("es-PE", { weekday: "long" })
            .toLowerCase();
        const todayLabel = dayMap[todayKey] || todayKey;
        const schedule = parsed.find(
            (h) => h.day?.toLowerCase() === todayLabel.toLowerCase(),
        );
        if (!schedule) return null;

        const now = new Date();
        const curr = now.getHours() * 60 + now.getMinutes();
        let isOpen = false;
        let label = "Cerrado hoy";

        if (!schedule.closed && schedule.open && schedule.close) {
            const [oh, om] = schedule.open.split(":").map(Number);
            const [ch, cm] = schedule.close.split(":").map(Number);
            isOpen = curr >= oh * 60 + om && curr <= ch * 60 + cm;
            label = `${schedule.open} – ${schedule.close}`;
        }

        return (
            <div className="flex items-center gap-2 mt-2">
                <Clock
                    size={11}
                    className={`shrink-0 ${
                        isSelected ? "text-black/40" : "text-white/30"
                    }`}
                />
                <span
                    className={`text-[10px] font-paragraph tracking-wide ${
                        isSelected ? "text-black/60" : "text-white/40"
                    }`}
                >
                    {label}
                </span>
                <span
                    className={`ml-auto px-1.5 py-0.5 text-[8px] font-paragraph uppercase tracking-widest ${
                        isSelected
                            ? isOpen
                                ? "bg-green-600 text-white"
                                : "bg-black/20 text-black/50"
                            : isOpen
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/5 text-white/20"
                    }`}
                >
                    {isOpen ? "Abierto" : "Cerrado"}
                </span>
            </div>
        );
    } catch {
        return null;
    }
}

export default StorePickupSelectorTwenty;
