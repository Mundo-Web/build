import React, { useEffect, useState } from "react";
import Modal from "../../Adminto/Modal";
import SystemRest from "../../../Actions/Admin/SystemRest";
import RouteParams from "../../../Utils/RouteParams";
import ParamFormControl from "./ParamFormControl";

const systemRest = new SystemRest();

const ParamsModal = ({
    dataLoaded,
    setDataLoaded,
    setPages,
    modalRef,
    models,
}) => {
    const routeParams = RouteParams(dataLoaded?.path ?? "");
    const [using, setUsing] = useState({});
    const [extraKeys, setExtraKeys] = useState([]);

    const onParamsSubmit = async (e) => {
        e.preventDefault();
        const result = await systemRest.savePage({
            id: dataLoaded.id,
            using,
        });
        if (!result) return;
        setDataLoaded(null);
        setPages(result);
        $(modalRef.current).modal("hide");
    };

    useEffect(() => {
        const existingUsing = dataLoaded?.using ?? {};
        setUsing(existingUsing);

        const keysInUsing = Object.keys(existingUsing);
        const nonRouteKeys = keysInUsing.filter(
            (key) => !routeParams.includes(key),
        );
        setExtraKeys(nonRouteKeys);
    }, [dataLoaded]);

    const addExtraKey = () => {
        const newKey = prompt(
            "Ingrese el nombre de la clave (ej: categories, brands):",
        );
        if (
            newKey &&
            !routeParams.includes(newKey) &&
            !extraKeys.includes(newKey)
        ) {
            setExtraKeys([...extraKeys, newKey]);
            setUsing((prev) => ({
                ...prev,
                [newKey]: { model: null, field: null, relations: [] },
            }));
        }
    };

    const removeExtraKey = (key) => {
        setExtraKeys(extraKeys.filter((k) => k !== key));
        setUsing((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const allKeys = [...new Set([...routeParams, ...extraKeys])];

    return (
        <Modal
            modalRef={modalRef}
            title={`Gestionar datos de la página - ${dataLoaded?.name || ""}`}
            onSubmit={onParamsSubmit}
            onClose={() => setDataLoaded(null)}
        >
            <div className="d-flex flex-column gap-3">
                {allKeys.length === 0 && dataLoaded && (
                    <div className="text-center py-3 text-muted">
                        No hay parámetros ni datos adicionales configurados.
                    </div>
                )}

                {allKeys.map((key) => (
                    <div
                        key={`${dataLoaded?.id}-${key}`}
                        className="border rounded p-3 position-relative"
                    >
                        {extraKeys.includes(key) && (
                            <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                onClick={() => removeExtraKey(key)}
                                title="Eliminar clave personalizada"
                            >
                                <i className="mdi mdi-close"></i>
                            </button>
                        )}
                        <ParamFormControl
                            page={{ ...dataLoaded, using }}
                            param={key}
                            models={models}
                            setUsing={setUsing}
                            setPages={setPages}
                            isExtra={extraKeys.includes(key)}
                        />
                    </div>
                ))}

                <div className="text-center mt-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={addExtraKey}
                    >
                        <i className="mdi mdi-plus me-1"></i>
                        Agregar dato adicional (Modelos/Colecciones)
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ParamsModal;
