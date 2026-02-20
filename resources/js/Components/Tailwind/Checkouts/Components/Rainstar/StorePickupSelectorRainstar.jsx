import {
    StoreIcon,
    MapPin,
    Phone,
    User,
    Clock,
    CheckCircle2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import StoresRest from "../../../../../Actions/Admin/StoresRest";

const StorePickupSelectorRainstar = ({
    ubigeoCode,
    ubigeo,
    onStoreSelect,
    selectedStore = null,
    specificStores = null,
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
            const storesRest = new StoresRest();
            const result = await storesRest.paginate({
                status: true,
                visible: true,
            });

            let allStores = result?.data || [];
            allStores = allStores.filter((store) => {
                const isVisible = store.visible === true || store.visible === 1;
                const isActive = store.status === true || store.status === 1;
                const isPickupEnabled =
                    store.pickup_available === true ||
                    store.pickup_available === 1 ||
                    store.pickup_available === undefined;
                return isVisible && isActive && isPickupEnabled;
            });

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
        } catch (error) {
            setError("No se pudieron cargar las tiendas disponibles");
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="py-12 border-2 border-black border-dashed flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">
                    Escaneando sistema logístico...
                </p>
            </div>
        );

    if (error)
        return (
            <div className="p-8 border-2 border-red-500 bg-red-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                    {error}
                </p>
            </div>
        );

    if (stores.length === 0)
        return (
            <div className="p-8 border-2 border-black bg-neutral-50 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    No hay puntos de retiro activos en esta zona.
                </p>
            </div>
        );

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="border-b-2 border-black pb-4">
                <h3 className="text-xl font-black uppercase tracking-tighter">
                    Puntos de Retiro Rainstar
                </h3>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                    Selecciona una base para la recolección de suministros
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {stores.map((store) => (
                    <button
                        key={store.id}
                        type="button"
                        onClick={() => onStoreSelect(store)}
                        className={`p-6 border-2 text-left relative transition-all group overflow-hidden ${
                            selectedStore?.id === store.id
                                ? "border-black bg-black text-white shadow-none translate-x-1 translate-y-1"
                                : "border-black/10 bg-white hover:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none"
                        }`}
                    >
                        <div className="flex gap-4 relative z-10">
                            <div
                                className={`w-16 h-16 border-2 shrink-0 overflow-hidden ${selectedStore?.id === store.id ? "border-white" : "border-black"}`}
                            >
                                <img
                                    src={`/storage/images/store/${store.image}`}
                                    alt={store.name}
                                    className="w-full h-full object-cover grayscale"
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black uppercase tracking-tight text-sm truncate">
                                    {store.name}
                                </h4>
                                <div
                                    className={`inline-block px-2 py-0.5 mt-2 text-[8px] font-black uppercase tracking-widest ${selectedStore?.id === store.id ? "bg-white text-black" : "bg-black text-white"}`}
                                >
                                    {store.type?.replace("_", " ") ||
                                        "SUCURSAL"}
                                </div>
                                <p
                                    className={`mt-3 text-[9px] font-bold uppercase tracking-widest line-clamp-2 ${selectedStore?.id === store.id ? "text-white/60" : "text-neutral-400"}`}
                                >
                                    {store.address}
                                </p>
                            </div>
                        </div>

                        {selectedStore?.id === store.id && (
                            <div className="absolute -bottom-4 -right-4 bg-white/10 p-4 rotate-12">
                                <CheckCircle2 size={48} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StorePickupSelectorRainstar;
