import React, { useState, useEffect, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import $ from "jquery";
import Fillable from "../../Utils/Fillable";
import { CurrencySymbol } from "../../Utils/Number2Currency";
import ItemRest from "../../Actions/Admin/ItemsRest";
import AttributesRest from "../../Actions/Admin/AttributesRest";
import SelectFormGroup from "../../Components/Adminto/form/SelectFormGroup";
import InputFormGroup from "../../Components/Adminto/form/InputFormGroup";

const itemsRest = new ItemRest();
const attributesRest = new AttributesRest();

const ItemVariantsManager = ({
    isOpen,
    onClose,
    item,
    gridRef,
    onRefreshGrid,
}) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [groupBySku, setGroupBySku] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState([]);

    // Modales
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [isBulkMediaOpen, setIsBulkMediaOpen] = useState(false);

    // Estados del Generador
    const [variantAttributes, setVariantAttributes] = useState([]);
    const [generatedVariants, setGeneratedVariants] = useState([]);
    const [availableAttributes, setAvailableAttributes] = useState([]);

    // Multimedia en Generador
    const [variantImagePreview, setVariantImagePreview] = useState(null);
    const [variantGalleryPreview, setVariantGalleryPreview] = useState([]);
    const [variantGalleryFiles, setVariantGalleryFiles] = useState([]);
    const [keepMasterImage, setKeepMasterImage] = useState(true);
    const [keepMasterGalleryIds, setKeepMasterGalleryIds] = useState([]);

    const variantBaseRefs = {
        price: useRef(),
        sku: useRef(),
    };

    // --- Carga de Datos ---
    useEffect(() => {
        if (isOpen) loadAttributes();
    }, [isOpen]);

    const loadAttributes = async () => {
        const result = await attributesRest.paginate({
            page: 1,
            pageSize: 1000,
        });
        if (result?.data) setAvailableAttributes(result.data);
    };

    useEffect(() => {
        if (isOpen && item?.agrupador) loadVariants();
    }, [isOpen, item]);

    // Cleanup for select2 dropdowns when generator modal closes
    useEffect(() => {
        if (!isGeneratorOpen) {
            $(".select2-container--open").remove();
        }
    }, [isGeneratorOpen]);

    const loadVariants = async () => {
        if (!item?.agrupador) return;
        setLoading(true);
        try {
            const response = await fetch(
                `/api/admin/items/variants/${item.agrupador}`,
            );
            const data = await response.json();
            setVariants(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Lógica del Generador ---
    const handleOpenGenerator = () => {
        setVariantAttributes([]);
        setGeneratedVariants([]);
        setVariantImagePreview(null);
        setVariantGalleryFiles([]);
        setVariantGalleryPreview([]);
        setKeepMasterImage(!!item?.image);
        setKeepMasterGalleryIds(item?.images?.map((img) => img.id) || []);
        setIsGeneratorOpen(true);

        setTimeout(() => {
            if (variantBaseRefs.price.current)
                variantBaseRefs.price.current.value = item.price;
            if (variantBaseRefs.sku.current)
                variantBaseRefs.sku.current.value = item.sku;
        }, 100);
    };

    const handleVariantAttributeSelect = (e) => {
        const attrId = e.target.value;
        if (!attrId) return;
        const attr = availableAttributes.find((a) => a.id == attrId);
        if (attr)
            setVariantAttributes((prev) => [
                ...prev,
                { attribute_id: attrId, attribute: attr, values: [] },
            ]);
        e.target.value = "";
    };

    const generateCombinations = () => {
        const activeAttributes = variantAttributes.filter(
            (va) => va.values && va.values.length > 0,
        );
        if (activeAttributes.length === 0) {
            Swal.fire(
                "Atención",
                "Selecciona al menos un atributo y sus valores",
                "warning",
            );
            return;
        }

        const carte = (a, b) =>
            [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
        const cartesian = (a, b, ...c) =>
            b ? cartesian(carte(a, b), ...c) : a;
        const valuesArrays = activeAttributes.map((va) =>
            va.values.map((v) => ({
                attribute_id: va.attribute_id,
                attribute_name: va.attribute.name,
                value: v,
            })),
        );
        const combinations =
            valuesArrays.length === 1
                ? valuesArrays[0].map((x) => [x])
                : cartesian(...valuesArrays);

        const baseName = item.name;
        const basePrice = variantBaseRefs.price.current?.value || item.price;
        const baseSku = variantBaseRefs.sku.current?.value || item.sku || "SKU";

        let startIndex = 1;
        if (variants && variants.length > 0) {
            const maxIndex = variants.reduce((max, v) => {
                const parts = (v.sku || "").split("-");
                const num = parseInt(parts[parts.length - 1]);
                return !isNaN(num) && num > max ? num : max;
            }, 0);
            startIndex = maxIndex + 1;
        }

        const newVariants = combinations.map((combo, idx) => {
            const suffix = combo.map((c) => c.value).join(" - ");
            return {
                id: `new-${idx}`,
                name: `${baseName} - ${suffix}`,
                price: basePrice,
                stock: 0,
                sku: `${baseSku}-${startIndex + idx}`,
                attributes: combo,
            };
        });
        setGeneratedVariants(newVariants);
    };

    const onVariantsSubmit = async () => {
        try {
            Swal.fire({
                title: "Guardando...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });
            const agrupadorId = item.agrupador || crypto.randomUUID();

            for (const v of generatedVariants) {
                const fd = new FormData();
                fd.append("agrupador", agrupadorId);
                fd.append("name", v.name);
                fd.append("price", v.price);
                fd.append("stock", v.stock);
                fd.append("sku", v.sku);
                fd.append("is_master", "0");
                if (item.category_id)
                    fd.append("category_id", item.category_id);
                if (item.subcategory_id)
                    fd.append("subcategory_id", item.subcategory_id);
                if (item.brand_id) fd.append("brand_id", item.brand_id);

                if (variantImagePreview) {
                    // We need the file from the blob URL
                    const response = await fetch(variantImagePreview);
                    const blob = await response.blob();
                    fd.append("image", blob, "variant.jpg");
                } else if (!keepMasterImage) {
                    fd.append("skip_clone_image", "1");
                }

                if (variantGalleryFiles.length > 0) {
                    variantGalleryFiles.forEach((f) =>
                        fd.append("gallery[]", f),
                    );
                }

                if (item.id) {
                    fd.append("clone_images_from", item.id);
                    if (keepMasterGalleryIds.length > 0) {
                        keepMasterGalleryIds.forEach((id) =>
                            fd.append("clone_gallery_ids[]", id),
                        );
                    } else {
                        // If we don't keep any, tell the backend to not clone anything
                    }
                }

                const attrs = v.attributes.map((a) => ({
                    id: a.attribute_id,
                    value: a.value,
                }));
                fd.append("attributes", JSON.stringify(attrs));
                await itemsRest.save(fd);
            }
            Swal.fire("Éxito", "Variantes creadas", "success");
            setIsGeneratorOpen(false);
            loadVariants();
            if (onRefreshGrid) onRefreshGrid();
        } catch (e) {
            Swal.fire("Error", "Error al procesar", "error");
        }
    };

    // --- Inline Update ---
    const updateVariantInline = async (id, field, value) => {
        try {
            await fetch(`/api/admin/items/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content",
                    ),
                },
                body: JSON.stringify({ [field]: value }),
            });
        } catch (e) {
            console.error(e);
        }
    };

    // --- Agrupación Inteligente ---
    const groupedVariantsData = useMemo(() => {
        if (!groupBySku || variants.length === 0)
            return variants.map((v) => ({ ...v, rowType: "variant" }));

        const groups = {};
        variants.forEach((v) => {
            const skuStr = (v.sku || "").trim();
            const lastDashIndex = skuStr.lastIndexOf("-");
            const groupKey =
                lastDashIndex > 0
                    ? skuStr.substring(0, lastDashIndex)
                    : "Varios";
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(v);
        });

        const sortedItems = [];
        Object.keys(groups)
            .sort()
            .forEach((groupName) => {
                const isExpanded = expandedGroups.includes(groupName);
                sortedItems.push({
                    id: `header-${groupName}`,
                    name: groupName,
                    rowType: "header",
                    count: groups[groupName].length,
                    isExpanded,
                    allSelected: groups[groupName].every((v) =>
                        selectedIds.includes(v.id),
                    ),
                });
                if (isExpanded) {
                    groups[groupName].forEach((v) =>
                        sortedItems.push({ ...v, rowType: "variant" }),
                    );
                }
            });
        return sortedItems;
    }, [variants, groupBySku, selectedIds, expandedGroups]);

    const toggleGroupCollapse = (groupName) => {
        setExpandedGroups((prev) =>
            prev.includes(groupName)
                ? prev.filter((g) => g !== groupName)
                : [...prev, groupName],
        );
    };

    const toggleGroupSelection = (groupName, select) => {
        const groupItems = variants.filter((v) => {
            const skuStr = (v.sku || "").trim();
            const lastDashIndex = skuStr.lastIndexOf("-");
            const g =
                lastDashIndex > 0
                    ? skuStr.substring(0, lastDashIndex)
                    : "Varios";
            return g === groupName;
        });
        const groupIds = groupItems.map((v) => v.id);
        setSelectedIds((prev) =>
            select
                ? Array.from(new Set([...prev, ...groupIds]))
                : prev.filter((id) => !groupIds.includes(id)),
        );
    };

    const BulkMediaModal = () => {
        const [action, setAction] = useState("main");
        const [file, setFile] = useState(null);
        const [files, setFiles] = useState([]);
        const [previews, setPreviews] = useState([]);

        const handleProcess = async () => {
            if (selectedIds.length === 0) return;
            Swal.fire({
                title: "Actualizando...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });
            try {
                for (const vid of selectedIds) {
                    const variantData = variants.find((v) => v.id === vid);
                    const fd = new FormData();
                    fd.append("id", vid);
                    if (action === "main" && file) fd.append("image", file);
                    else if (action === "gallery_add" && files.length > 0)
                        files.forEach((f) => fd.append("gallery[]", f));
                    else if (action === "gallery_replace") {
                        if (variantData.images?.length > 0)
                            variantData.images.forEach((img) =>
                                fd.append("deleted_images[]", img.id),
                            );
                        if (files.length > 0)
                            files.forEach((f) => fd.append("gallery[]", f));
                    } else if (action === "gallery_clear") {
                        if (variantData.images?.length > 0)
                            variantData.images.forEach((img) =>
                                fd.append("deleted_images[]", img.id),
                            );
                    }
                    await fetch("/api/admin/items/media-update", {
                        method: "POST",
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content",
                            ),
                        },
                        body: fd,
                    });
                }
                Swal.close();
                setIsBulkMediaOpen(false);
                loadVariants();
            } catch (e) {
                Swal.fire("Error", "Error en actualización", "error");
            }
        };

        return (
            <div
                className="modal fade show"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    zIndex: 1085,
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg p-2">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold">
                                Multimedia Masiva ({selectedIds.length})
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setIsBulkMediaOpen(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="nav nav-tabs nav-tabs-custom nav-justified mb-3">
                                <button
                                    className={`nav-link cursor-pointer border-0 ${action === "main" ? "active" : ""}`}
                                    onClick={() => setAction("main")}
                                >
                                    Principal
                                </button>
                                <button
                                    className={`nav-link cursor-pointer border-0 ${action === "gallery_add" ? "active" : ""}`}
                                    onClick={() => setAction("gallery_add")}
                                >
                                    + Galería
                                </button>
                                <button
                                    className={`nav-link cursor-pointer border-0 ${action === "gallery_replace" ? "active" : ""}`}
                                    onClick={() => setAction("gallery_replace")}
                                >
                                    Reemplazar Galería
                                </button>
                                <button
                                    className={`nav-link cursor-pointer border-0 ${action === "gallery_clear" ? "active text-danger" : ""}`}
                                    onClick={() => setAction("gallery_clear")}
                                >
                                    Vaciar Galería
                                </button>
                            </div>
                            <div className="tab-content text-center py-2">
                                {action === "main" && (
                                    <label className="btn btn-outline-primary d-block py-4 border-dashed cursor-pointer">
                                        <i className="fas fa-image fa-2x mb-2 d-block"></i>{" "}
                                        Seleccionar Imagen Principal
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => {
                                                const f = e.target.files[0];
                                                setFile(f);
                                                if (f)
                                                    setPreviews([
                                                        URL.createObjectURL(f),
                                                    ]);
                                            }}
                                        />
                                        {file && (
                                            <img
                                                src={previews[0]}
                                                className="mt-3 rounded shadow-sm d-block mx-auto"
                                                style={{ height: "80px" }}
                                            />
                                        )}
                                    </label>
                                )}
                                {(action === "gallery_add" ||
                                    action === "gallery_replace") && (
                                    <label className="btn btn-outline-primary d-block py-4 border-dashed cursor-pointer">
                                        <i className="fas fa-images fa-2x mb-2 d-block"></i>{" "}
                                        Seleccionar Fotos para Galería
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            onChange={(e) => {
                                                const fls = Array.from(
                                                    e.target.files,
                                                );
                                                setFiles(fls);
                                                setPreviews(
                                                    fls.map((f) =>
                                                        URL.createObjectURL(f),
                                                    ),
                                                );
                                            }}
                                        />
                                        <div className="d-flex flex-wrap gap-1 justify-content-center mt-3">
                                            {previews.map((p, i) => (
                                                <img
                                                    key={i}
                                                    src={p}
                                                    className="rounded border"
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </label>
                                )}
                                {action === "gallery_clear" && (
                                    <div className="alert alert-soft-danger m-0 py-4 text-center">
                                        ¿Estás seguro de eliminar las galerías?
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer border-0">
                            <button
                                className="btn btn-light"
                                onClick={() => setIsBulkMediaOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary px-4 fw-bold shadow"
                                onClick={handleProcess}
                            >
                                Aplicar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="modal fade show"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 1050,
                }}
            >
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div
                        className="modal-content border-0 shadow-lg overflow-hidden"
                        style={{ borderRadius: "16px" }}
                    >
                        <div className="modal-header bg-white border-bottom py-3">
                            <div className="lh-1">
                                <h5 className="modal-title fw-bold text-dark d-flex align-items-center">
                                    <i className="fas fa-tasks me-2 text-primary"></i>{" "}
                                    Gestión de Variantes
                                </h5>
                                <small className="text-muted ms-4">
                                    {item?.name}
                                </small>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>

                        <div className="modal-body p-0">
                            <div
                                className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center sticky-top shadow-sm"
                                style={{
                                    zIndex: 1030,
                                    top: 0,
                                    minHeight: "70px",
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <button
                                        className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
                                        onClick={handleOpenGenerator}
                                    >
                                        <i className="fas fa-plus me-2"></i>{" "}
                                        Generar Masivo
                                    </button>
                                    <div className="form-check form-switch bg-white rounded-pill border px-3 py-1 shadow-sm ms-2">
                                        <input
                                            className="form-check-input ms-0 me-2"
                                            type="checkbox"
                                            id="skuGroupSwitch"
                                            checked={groupBySku}
                                            onChange={(e) =>
                                                setGroupBySku(e.target.checked)
                                            }
                                        />
                                        <label
                                            className="form-check-label small fw-bold text-dark cursor-pointer"
                                            htmlFor="skuGroupSwitch"
                                        >
                                            Agrupar por SKU
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    {selectedIds.length > 0 && (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-soft-info btn-sm rounded-pill px-3 fw-bold"
                                                onClick={() =>
                                                    setIsBulkMediaOpen(true)
                                                }
                                            >
                                                <i className="fas fa-photo-video me-1"></i>{" "}
                                                Multimedia
                                            </button>
                                            <button
                                                className="btn btn-soft-danger btn-sm rounded-pill px-3 fw-bold"
                                                onClick={async () => {
                                                    const res = await Swal.fire(
                                                        {
                                                            title: "¿Borrar seleccionados?",
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                        },
                                                    );
                                                    if (res.isConfirmed) {
                                                        for (const id of selectedIds)
                                                            await fetch(
                                                                `/api/admin/items/variant/${id}`,
                                                                {
                                                                    method: "DELETE",
                                                                    headers: {
                                                                        "X-CSRF-TOKEN":
                                                                            $(
                                                                                'meta[name="csrf-token"]',
                                                                            ).attr(
                                                                                "content",
                                                                            ),
                                                                    },
                                                                },
                                                            );
                                                        setSelectedIds([]);
                                                        loadVariants();
                                                        if (onRefreshGrid)
                                                            onRefreshGrid();
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-trash-alt me-1"></i>{" "}
                                                Borrar
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        className="btn btn-outline-secondary btn-sm rounded-circle shadow-sm"
                                        onClick={loadVariants}
                                    >
                                        <i className="fas fa-sync-alt"></i>
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            ) : (
                                <div>
                                    <table
                                        className="table table-hover align-middle mb-0"
                                        style={{
                                            borderCollapse: "separate",
                                            borderSpacing: 0,
                                        }}
                                    >
                                        <thead>
                                            <tr className="small text-muted text-uppercase">
                                                <th
                                                    className="ps-4 bg-white border-bottom"
                                                    style={{ width: "50px" }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={
                                                            selectedIds.length ===
                                                                variants.length &&
                                                            variants.length > 0
                                                        }
                                                        onChange={(e) =>
                                                            setSelectedIds(
                                                                e.target.checked
                                                                    ? variants.map(
                                                                          (v) =>
                                                                              v.id,
                                                                      )
                                                                    : [],
                                                            )
                                                        }
                                                    />
                                                </th>
                                                <th className="bg-white border-bottom">
                                                    Variante
                                                </th>
                                                {Fillable.has(
                                                    "items",
                                                    "is_attributes",
                                                ) && (
                                                    <th
                                                        className="bg-white border-bottom"
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                    >
                                                        Atributos
                                                    </th>
                                                )}
                                                {Fillable.has(
                                                    "items",
                                                    "price",
                                                ) && (
                                                    <th
                                                        className="bg-white border-bottom"
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                    >
                                                        Precio
                                                    </th>
                                                )}
                                                {Fillable.has(
                                                    "items",
                                                    "stock",
                                                ) && (
                                                    <th
                                                        className="bg-white border-bottom"
                                                        style={{
                                                            width: "120px",
                                                        }}
                                                    >
                                                        Stock
                                                    </th>
                                                )}
                                                <th className="text-center bg-white border-bottom">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variants.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={
                                                            Fillable.has(
                                                                "items",
                                                                "is_attributes",
                                                            ) +
                                                            Fillable.has(
                                                                "items",
                                                                "price",
                                                            ) +
                                                            Fillable.has(
                                                                "items",
                                                                "stock",
                                                            ) +
                                                            3
                                                        }
                                                        className="text-center py-5 text-muted small"
                                                    >
                                                        No hay variantes creadas
                                                        para este item.
                                                    </td>
                                                </tr>
                                            ) : (
                                                groupedVariantsData.map((v) => {
                                                    if (v.rowType === "header")
                                                        return (
                                                            <tr
                                                                key={v.id}
                                                                className={`${v.isExpanded ? "bg-soft-primary" : ""} cursor-pointer align-middle`}
                                                                onClick={() =>
                                                                    toggleGroupCollapse(
                                                                        v.name,
                                                                    )
                                                                }
                                                            >
                                                                <td
                                                                    className="ps-4"
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={
                                                                            v.allSelected
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            toggleGroupSelection(
                                                                                v.name,
                                                                                e
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                                <td
                                                                    colSpan={
                                                                        Fillable.has(
                                                                            "items",
                                                                            "is_attributes",
                                                                        ) +
                                                                        Fillable.has(
                                                                            "items",
                                                                            "price",
                                                                        ) +
                                                                        Fillable.has(
                                                                            "items",
                                                                            "stock",
                                                                        ) +
                                                                        2
                                                                    }
                                                                    className="fw-bold text-primary small"
                                                                >
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <span>
                                                                            <i
                                                                                className={`fas ${v.isExpanded ? "fa-folder-open" : "fa-folder"} me-2`}
                                                                            ></i>
                                                                            GRUPO
                                                                            SKU:{" "}
                                                                            {
                                                                                v.name
                                                                            }{" "}
                                                                            (
                                                                            {
                                                                                v.count
                                                                            }
                                                                            )
                                                                        </span>
                                                                        <i
                                                                            className={`fas ${v.isExpanded ? "fa-chevron-up" : "fa-chevron-down"} x-small text-black opacity-50`}
                                                                        ></i>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    return (
                                                        <tr
                                                            key={v.id}
                                                            className={
                                                                selectedIds.includes(
                                                                    v.id,
                                                                )
                                                                    ? "table-active"
                                                                    : ""
                                                            }
                                                        >
                                                            <td className="ps-4">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={selectedIds.includes(
                                                                        v.id,
                                                                    )}
                                                                    onChange={() =>
                                                                        setSelectedIds(
                                                                            (
                                                                                prev,
                                                                            ) =>
                                                                                prev.includes(
                                                                                    v.id,
                                                                                )
                                                                                    ? prev.filter(
                                                                                          (
                                                                                              x,
                                                                                          ) =>
                                                                                              x !==
                                                                                              v.id,
                                                                                      )
                                                                                    : [
                                                                                          ...prev,
                                                                                          v.id,
                                                                                      ],
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="position-relative">
                                                                        <img
                                                                            src={
                                                                                v.image
                                                                                    ? `/storage/images/item/${v.image}`
                                                                                    : "/storage/utils/cover-404.svg"
                                                                            }
                                                                            className="rounded shadow-sm border"
                                                                            style={{
                                                                                width: "38px",
                                                                                height: "38px",
                                                                                objectFit:
                                                                                    "cover",
                                                                            }}
                                                                        />
                                                                        {v
                                                                            .images
                                                                            ?.length >
                                                                            0 && (
                                                                            <span
                                                                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "8px",
                                                                                    transform:
                                                                                        "translate(-50%, -50%)",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    v
                                                                                        .images
                                                                                        .length
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="ms-3 lh-1">
                                                                        <div className="fw-bold text-dark small">
                                                                            {
                                                                                v.name
                                                                            }
                                                                        </div>
                                                                        {Fillable.has(
                                                                            "items",
                                                                            "sku",
                                                                        ) && (
                                                                            <small className="text-muted fw-bold x-small">
                                                                                {
                                                                                    v.sku
                                                                                }
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            {Fillable.has(
                                                                "items",
                                                                "is_attributes",
                                                            ) && (
                                                                <td>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {v.attributes?.map(
                                                                            (
                                                                                a,
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        a.id
                                                                                    }
                                                                                    className="badge bg-soft-secondary text-secondary x-small py-1 border"
                                                                                >
                                                                                    {
                                                                                        a.name
                                                                                    }

                                                                                    :{" "}
                                                                                    {
                                                                                        a
                                                                                            .pivot
                                                                                            ?.value
                                                                                    }
                                                                                </span>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {Fillable.has(
                                                                "items",
                                                                "price",
                                                            ) && (
                                                                <td>
                                                                    <div className="input-group input-group-sm">
                                                                        <span className="input-group-text bg-white">
                                                                            {CurrencySymbol()}
                                                                        </span>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            defaultValue={
                                                                                v.price
                                                                            }
                                                                            onBlur={(
                                                                                e,
                                                                            ) =>
                                                                                updateVariantInline(
                                                                                    v.id,
                                                                                    "price",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {Fillable.has(
                                                                "items",
                                                                "stock",
                                                            ) && (
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        defaultValue={
                                                                            v.stock
                                                                        }
                                                                        onBlur={(
                                                                            e,
                                                                        ) =>
                                                                            updateVariantInline(
                                                                                v.id,
                                                                                "stock",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            )}
                                                            <td className="text-center">
                                                                <button
                                                                    className="btn btn-sm text-danger"
                                                                    onClick={async () => {
                                                                        if (
                                                                            (
                                                                                await Swal.fire(
                                                                                    {
                                                                                        title: "¿Eliminar?",
                                                                                        icon: "warning",
                                                                                        showCancelButton: true,
                                                                                    },
                                                                                )
                                                                            )
                                                                                .isConfirmed
                                                                        ) {
                                                                            await fetch(
                                                                                `/api/admin/items/variant/${v.id}`,
                                                                                {
                                                                                    method: "DELETE",
                                                                                    headers:
                                                                                        {
                                                                                            "X-CSRF-TOKEN":
                                                                                                $(
                                                                                                    'meta[name="csrf-token"]',
                                                                                                ).attr(
                                                                                                    "content",
                                                                                                ),
                                                                                        },
                                                                                },
                                                                            );
                                                                            loadVariants();
                                                                            if (
                                                                                onRefreshGrid
                                                                            )
                                                                                onRefreshGrid();
                                                                        }
                                                                    }}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isGeneratorOpen && (
                <div
                    id="generatorModal"
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        zIndex: 1060,
                    }}
                >
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
                            <div className="modal-header bg-primary text-white py-3 border-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="fas fa-magic me-2"></i>{" "}
                                    Generador de Variantes
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setIsGeneratorOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <div className="row g-4">
                                    <div className="col-md-5">
                                        <div className="card border-0 shadow-sm rounded-3 h-100 p-3">
                                            <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                                                Configuración Base
                                            </h6>
                                            <div className="mb-2">
                                                <label className="form-label x-small fw-bold text-muted">
                                                    Nombre de Variantes
                                                    (Automático)
                                                </label>
                                                <input
                                                    className="form-control bg-light"
                                                    value={item.name}
                                                    disabled
                                                />
                                            </div>
                                            <div className="row g-2 mb-3">
                                                {Fillable.has(
                                                    "items",
                                                    "price",
                                                ) && (
                                                    <div className="col-6">
                                                        <InputFormGroup
                                                            eRef={
                                                                variantBaseRefs.price
                                                            }
                                                            label="Precio Base"
                                                            type="number"
                                                        />
                                                    </div>
                                                )}
                                                {Fillable.has(
                                                    "items",
                                                    "sku",
                                                ) && (
                                                    <div className="col-6">
                                                        <InputFormGroup
                                                            eRef={
                                                                variantBaseRefs.sku
                                                            }
                                                            label="Prefijo SKU"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <h6 className="text-primary fw-bold mb-2 border-bottom pb-2">
                                                Multimedia Compartida
                                            </h6>
                                            <div className="row g-2 mb-3">
                                                <div className="col-4">
                                                    <div
                                                        className="bg-white rounded border-dashed p-1 text-center position-relative overflow-hidden"
                                                        style={{
                                                            minHeight: "70px",
                                                        }}
                                                    >
                                                        {variantImagePreview ? (
                                                            <img
                                                                src={
                                                                    variantImagePreview
                                                                }
                                                                className="img-fluid rounded"
                                                            />
                                                        ) : keepMasterImage &&
                                                          item?.image ? (
                                                            <img
                                                                src={`/storage/images/item/${item.image}`}
                                                                className="img-fluid rounded opacity-50"
                                                            />
                                                        ) : (
                                                            <i className="fas fa-image fa-2x mt-2 text-muted"></i>
                                                        )}
                                                        <input
                                                            type="file"
                                                            hidden
                                                            id="gen-main-img"
                                                            onChange={(e) => {
                                                                const f =
                                                                    e.target
                                                                        .files[0];
                                                                if (f) {
                                                                    setVariantImagePreview(
                                                                        URL.createObjectURL(
                                                                            f,
                                                                        ),
                                                                    );
                                                                    setKeepMasterImage(
                                                                        false,
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor="gen-main-img"
                                                            className="stretched-link cursor-pointer"
                                                        ></label>
                                                    </div>
                                                </div>
                                                <div className="col-8">
                                                    <div
                                                        className="bg-white rounded border p-2 d-flex flex-wrap gap-1"
                                                        style={{
                                                            minHeight: "70px",
                                                        }}
                                                    >
                                                        {keepMasterGalleryIds.map(
                                                            (gid) => (
                                                                <div
                                                                    key={gid}
                                                                    className="position-relative"
                                                                >
                                                                    <img
                                                                        src={`/storage/images/item/${item.images?.find((x) => x.id === gid)?.url}`}
                                                                        style={{
                                                                            width: "28px",
                                                                            height: "28px",
                                                                            objectFit:
                                                                                "cover",
                                                                            opacity: 0.6,
                                                                        }}
                                                                        className="rounded"
                                                                    />
                                                                    <button
                                                                        onClick={() =>
                                                                            setKeepMasterGalleryIds(
                                                                                (
                                                                                    prev,
                                                                                ) =>
                                                                                    prev.filter(
                                                                                        (
                                                                                            x,
                                                                                        ) =>
                                                                                            x !==
                                                                                            gid,
                                                                                    ),
                                                                            )
                                                                        }
                                                                        className="btn btn-danger btn-xs position-absolute top-0 end-0 p-0"
                                                                        style={{
                                                                            width: "10px",
                                                                            height: "10px",
                                                                            fontSize:
                                                                                "6px",
                                                                        }}
                                                                    >
                                                                        x
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                        {variantGalleryPreview.map(
                                                            (url, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="position-relative"
                                                                >
                                                                    <img
                                                                        src={
                                                                            url
                                                                        }
                                                                        style={{
                                                                            width: "28px",
                                                                            height: "28px",
                                                                            objectFit:
                                                                                "cover",
                                                                        }}
                                                                        className="rounded border"
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            setVariantGalleryPreview(
                                                                                (
                                                                                    p,
                                                                                ) =>
                                                                                    p.filter(
                                                                                        (
                                                                                            _,
                                                                                            idx,
                                                                                        ) =>
                                                                                            idx !==
                                                                                            i,
                                                                                    ),
                                                                            );
                                                                            setVariantGalleryFiles(
                                                                                (
                                                                                    p,
                                                                                ) =>
                                                                                    p.filter(
                                                                                        (
                                                                                            _,
                                                                                            idx,
                                                                                        ) =>
                                                                                            idx !==
                                                                                            i,
                                                                                    ),
                                                                            );
                                                                        }}
                                                                        className="btn btn-danger btn-xs position-absolute top-0 end-0 p-0"
                                                                        style={{
                                                                            width: "10px",
                                                                            height: "10px",
                                                                            fontSize:
                                                                                "6px",
                                                                        }}
                                                                    >
                                                                        x
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                        <label
                                                            className="btn btn-outline-dashed btn-xs d-flex align-items-center justify-content-center p-0 m-0"
                                                            style={{
                                                                width: "28px",
                                                                height: "28px",
                                                            }}
                                                        >
                                                            <i className="fas fa-plus x-small"></i>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                hidden
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const fls =
                                                                        Array.from(
                                                                            e
                                                                                .target
                                                                                .files,
                                                                        );
                                                                    setVariantGalleryFiles(
                                                                        (p) => [
                                                                            ...p,
                                                                            ...fls,
                                                                        ],
                                                                    );
                                                                    setVariantGalleryPreview(
                                                                        (p) => [
                                                                            ...p,
                                                                            ...fls.map(
                                                                                (
                                                                                    f,
                                                                                ) =>
                                                                                    URL.createObjectURL(
                                                                                        f,
                                                                                    ),
                                                                            ),
                                                                        ],
                                                                    );
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {Fillable.has(
                                                "items",
                                                "is_attributes",
                                            ) && (
                                                <>
                                                    <h6 className="text-primary fw-bold mb-2 border-bottom pb-2">
                                                        Atributos
                                                    </h6>
                                                    <select
                                                        className="form-select mb-2"
                                                        onChange={
                                                            handleVariantAttributeSelect
                                                        }
                                                    >
                                                        <option value="">
                                                            + Añadir Atributo...
                                                        </option>
                                                        {availableAttributes
                                                            .filter(
                                                                (a) =>
                                                                    !variantAttributes.find(
                                                                        (va) =>
                                                                            va.attribute_id ==
                                                                            a.id,
                                                                    ),
                                                            )
                                                            .map((a) => (
                                                                <option
                                                                    key={a.id}
                                                                    value={a.id}
                                                                >
                                                                    {a.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    <div
                                                        style={{
                                                            maxHeight: "200px",
                                                            overflowY: "auto",
                                                        }}
                                                    >
                                                        {variantAttributes.map(
                                                            (va, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="bg-white border rounded p-2 mb-2"
                                                                >
                                                                    <div className="d-flex justify-content-between mb-1 small fw-bold">
                                                                        {
                                                                            va
                                                                                .attribute
                                                                                .name
                                                                        }
                                                                        <button
                                                                            onClick={() =>
                                                                                setVariantAttributes(
                                                                                    (
                                                                                        prev,
                                                                                    ) =>
                                                                                        prev.filter(
                                                                                            (
                                                                                                _,
                                                                                                i,
                                                                                            ) =>
                                                                                                i !==
                                                                                                idx,
                                                                                        ),
                                                                                )
                                                                            }
                                                                            className="btn btn-xs text-danger p-0"
                                                                        >
                                                                            x
                                                                        </button>
                                                                    </div>
                                                                    <SelectFormGroup
                                                                        multiple
                                                                        tags={
                                                                            true
                                                                        }
                                                                        dropdownParent="#generatorModal"
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            const val =
                                                                                $(
                                                                                    e.target,
                                                                                ).val();
                                                                            setVariantAttributes(
                                                                                (
                                                                                    prev,
                                                                                ) => {
                                                                                    const n =
                                                                                        [
                                                                                            ...prev,
                                                                                        ];
                                                                                    n[
                                                                                        idx
                                                                                    ].values =
                                                                                        val ||
                                                                                        [];
                                                                                    return n;
                                                                                },
                                                                            );
                                                                        }}
                                                                    >
                                                                        {va.attribute.options?.map(
                                                                            (
                                                                                opt,
                                                                                i,
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    value={
                                                                                        opt
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        opt
                                                                                    }
                                                                                </option>
                                                                            ),
                                                                        )}
                                                                    </SelectFormGroup>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            <button
                                                className="btn btn-primary w-100 mt-3 py-2 fw-bold"
                                                onClick={generateCombinations}
                                                disabled={
                                                    variantAttributes.length ===
                                                        0 &&
                                                    Fillable.has(
                                                        "items",
                                                        "is_attributes",
                                                    )
                                                }
                                            >
                                                Generar Previsualización
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden">
                                            <div className="card-header bg-white py-2 fw-bold text-dark border-0">
                                                Lista de Combinaciones (
                                                {generatedVariants.length})
                                            </div>
                                            <div className="card-body p-0">
                                                <div
                                                    className="table-responsive"
                                                    style={{
                                                        maxHeight: "550px",
                                                    }}
                                                >
                                                    <table className="table table-sm table-hover mb-0">
                                                        <thead className="table-light sticky-top">
                                                            <tr>
                                                                <th className="ps-3 py-2">
                                                                    #
                                                                </th>
                                                                <th>Nombre</th>
                                                                {Fillable.has(
                                                                    "items",
                                                                    "price",
                                                                ) && (
                                                                    <th
                                                                        style={{
                                                                            width: "90px",
                                                                        }}
                                                                    >
                                                                        Precio
                                                                    </th>
                                                                )}
                                                                {Fillable.has(
                                                                    "items",
                                                                    "sku",
                                                                ) && (
                                                                    <th>SKU</th>
                                                                )}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {generatedVariants.length ===
                                                            0 ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan={
                                                                            Fillable.has(
                                                                                "items",
                                                                                "price",
                                                                            ) +
                                                                            Fillable.has(
                                                                                "items",
                                                                                "sku",
                                                                            ) +
                                                                            2
                                                                        }
                                                                        className="text-center py-5 text-muted small"
                                                                    >
                                                                        Sin
                                                                        combinaciones
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                generatedVariants.map(
                                                                    (gv, i) => (
                                                                        <tr
                                                                            key={
                                                                                gv.id
                                                                            }
                                                                        >
                                                                            <td className="ps-3 py-2 small text-muted">
                                                                                {i +
                                                                                    1}
                                                                            </td>
                                                                            <td>
                                                                                {Fillable.has(
                                                                                    "items",
                                                                                    "name",
                                                                                ) ? (
                                                                                    <input
                                                                                        className="form-control form-control-xs fw-bold border-0 bg-transparent"
                                                                                        value={
                                                                                            gv.name
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            const n =
                                                                                                [
                                                                                                    ...generatedVariants,
                                                                                                ];
                                                                                            n[
                                                                                                i
                                                                                            ].name =
                                                                                                e.target.value;
                                                                                            setGeneratedVariants(
                                                                                                n,
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <span className="small fw-bold">
                                                                                        {
                                                                                            gv.name
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                                {Fillable.has(
                                                                                    "items",
                                                                                    "is_attributes",
                                                                                ) && (
                                                                                    <div className="x-small text-muted ps-1">
                                                                                        {gv.attributes
                                                                                            .map(
                                                                                                (
                                                                                                    a,
                                                                                                ) =>
                                                                                                    `${a.attribute_name}:${a.value}`,
                                                                                            )
                                                                                            .join(
                                                                                                ", ",
                                                                                            )}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            {Fillable.has(
                                                                                "items",
                                                                                "price",
                                                                            ) && (
                                                                                <td>
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control form-control-xs border-0 bg-transparent"
                                                                                        value={
                                                                                            gv.price
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            const n =
                                                                                                [
                                                                                                    ...generatedVariants,
                                                                                                ];
                                                                                            n[
                                                                                                i
                                                                                            ].price =
                                                                                                e.target.value;
                                                                                            setGeneratedVariants(
                                                                                                n,
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                            )}
                                                                            {Fillable.has(
                                                                                "items",
                                                                                "sku",
                                                                            ) && (
                                                                                <td>
                                                                                    <input
                                                                                        className="form-control form-control-xs border-0 bg-transparent"
                                                                                        value={
                                                                                            gv.sku
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            const n =
                                                                                                [
                                                                                                    ...generatedVariants,
                                                                                                ];
                                                                                            n[
                                                                                                i
                                                                                            ].sku =
                                                                                                e.target.value;
                                                                                            setGeneratedVariants(
                                                                                                n,
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                            )}
                                                                        </tr>
                                                                    ),
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-white border-0 py-3 px-4">
                                <button
                                    className="btn btn-link text-muted"
                                    onClick={() => setIsGeneratorOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-success px-5 rounded-pill shadow-lg fw-bold"
                                    onClick={onVariantsSubmit}
                                    disabled={generatedVariants.length === 0}
                                >
                                    Guardar Variantes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isBulkMediaOpen && <BulkMediaModal />}
        </>
    );
};

export default ItemVariantsManager;
