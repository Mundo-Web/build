import React, { useEffect, useRef, useState } from "react";
import SelectFormGroup from "../../Adminto/form/SelectFormGroup";

const ParamFormControl = ({
    page,
    param,
    models,
    setUsing,
    setPages,
    isExtra,
}) => {
    const modelRef = useRef();
    const fieldRef = useRef();
    const withRef = useRef();
    const fieldsRef = useRef();

    const using = page?.using;

    const [selected, setSelected] = useState(() => {
        const modelName = using?.[param]?.model;
        return models.find((x) => x.name === modelName) ?? null;
    });

    const onModelChange = (e) => {
        const value = modelRef.current.value;
        const model = models.find((x) => x.name == value) ?? null;
        setSelected(model);
    };

    useEffect(() => {
        const modelName = using?.[param]?.model || "";
        const model = models.find((x) => x.name === modelName) ?? null;
        if (selected?.name !== model?.name) {
            setSelected(model);
        }
    }, [param, using?.[param]?.model, models]);

    const container = `${param}-container`;
    return (
        <div id={container} className="row">
            <label className="form-label">
                {isExtra ? "Dato adicional" : "Parámetro URL"}{" "}
                <code>{param}</code>
            </label>
            <SelectFormGroup
                eRef={modelRef}
                label="Modelo"
                col="col-md-6"
                dropdownParent={`#${container}`}
                value={using?.[param]?.model || ""}
                onChange={(e) => {
                    const value = e.target.value;
                    const model = models.find((x) => x.name == value) ?? null;
                    setSelected(model);
                    setUsing((old) => ({
                        ...old,
                        [param]: {
                            ...old[param],
                            model: value || null,
                            field: null,
                            fields: [],
                            relations: [],
                        },
                    }));
                }}
            >
                <option value="">Seleccione un modelo</option>
                {models.map((model, index) => {
                    return (
                        <option key={index} value={model.name}>
                            {model.name}
                        </option>
                    );
                })}
            </SelectFormGroup>
            <SelectFormGroup
                eRef={fieldRef}
                label={isExtra ? "Filtrar por campo (Opcional)" : "Campo"}
                col="col-md-6"
                dropdownParent={`#${container}`}
                value={using?.[param]?.field || ""}
                onChange={(e) => {
                    setUsing((old) => ({
                        ...old,
                        [param]: {
                            ...old[param],
                            field: e.target.value,
                        },
                    }));
                }}
            >
                <option value="">
                    {isExtra
                        ? "Cargar toda la colección"
                        : "Seleccione un campo"}
                </option>
                {selected?.fields?.map((field, index) => {
                    return <option key={index}>{field}</option>
                })}
            </SelectFormGroup>
            <div className="col-12 mt-2">
                <SelectFormGroup
                    eRef={fieldsRef}
                    label="Seleccionar campos (Optimización)"
                    multiple
                    dropdownParent={`#${container}`}
                    value={using?.[param]?.fields || []}
                    onChange={(e) => {
                        const fields = $(e.target).val();
                        setUsing((old) => ({
                            ...old,
                            [param]: {
                                ...old[param],
                                fields,
                            },
                        }));
                    }}
                >
                    {selected?.fields?.map((field, index) => {
                        return <option key={index}>{field}</option>;
                    })}
                </SelectFormGroup>
                <small
                    className="text-muted d-block mb-3"
                    style={{ marginTop: "-10px" }}
                >
                    Si no seleccionas ninguno, se cargarán todos los campos (no
                    recomendado por rendimiento).
                </small>
            </div>
            <div
                className="col-12"
                hidden={(selected?.relations?.length ?? 0) == 0}
            >
                <SelectFormGroup
                    eRef={withRef}
                    label="Relaciones / Includes"
                    multiple
                    dropdownParent={`#${container}`}
                    value={using?.[param]?.relations || []}
                    onChange={(e) => {
                        const relations = $(e.target).val();
                        setUsing((old) => ({
                            ...old,
                            [param]: {
                                ...old[param],
                                relations,
                            },
                        }));
                    }}
                >
                    {selected?.relations?.map((rel, index) => {
                        return <option key={index}>{rel}</option>;
                    })}
                </SelectFormGroup>
            </div>
        </div>
    );
};

export default ParamFormControl;
