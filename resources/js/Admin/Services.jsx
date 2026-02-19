import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import QuillFormGroup from "@Adminto/form/QuillFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ServicesRest from "../Actions/Admin/ServicesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import Fillable from "../Utils/Fillable";

const servicesRest = new ServicesRest();

const Services = ({ service_categories = [], service_sub_categories = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const categoryRef = useRef();
    const subcategoryRef = useRef();
    const nameRef = useRef();
    const summaryRef = useRef();
    const descriptionRef = useRef();
    const pathRef = useRef();
    const imageRef = useRef();
    const backgroundImageRef = useRef();
    const slugRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Gallery, PDFs y Videos
    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();
    const [pdfs, setPdfs] = useState([]);
    const pdfRef = useRef();
    const [videos, setVideos] = useState([]);
    const videoUrlRef = useRef();

    // Features y Specifications
    const [features, setFeatures] = useState([]);
    const [specifications, setSpecifications] = useState([]);

    /*************************/
    /* Funciones para Gallery */
    /*************************/
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            order: gallery.length + index,
            id: null,
        }));
        setGallery([...gallery, ...newImages]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter((file) =>
            file.type.startsWith("image/"),
        );
        const newImages = imageFiles.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            order: gallery.length + index,
            id: null,
        }));
        setGallery([...gallery, ...newImages]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeGalleryImage = (e, index) => {
        e.preventDefault();
        const imageToRemove = gallery[index];

        if (imageToRemove.id) {
            const deletedInput = document.createElement("input");
            deletedInput.type = "hidden";
            deletedInput.name = "deleted_images[]";
            deletedInput.value = imageToRemove.id;
            deletedInput.className = "deleted-image-input";
            e.target.closest("form").appendChild(deletedInput);
        }

        setGallery(gallery.filter((_, i) => i !== index));
    };

    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOverReorder = (e) => {
        e.preventDefault();
    };

    const handleDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newGallery = [...gallery];
        const [draggedItem] = newGallery.splice(draggedIndex, 1);
        newGallery.splice(dropIndex, 0, draggedItem);

        setGallery(newGallery.map((img, idx) => ({ ...img, order: idx })));
        setDraggedIndex(null);
    };

    /*************************/
    /* Funciones para PDFs */
    /*************************/
    const handlePdfChange = (e) => {
        const files = Array.from(e.target.files);
        const newPdfs = files.map((file, index) => ({
            file,
            name: file.name,
            order: pdfs.length + index,
        }));
        setPdfs([...pdfs, ...newPdfs]);
    };

    const removePdf = (e, index) => {
        e.preventDefault();
        const pdfToRemove = pdfs[index];

        if (pdfToRemove.path) {
            const deletedInput = document.createElement("input");
            deletedInput.type = "hidden";
            deletedInput.name = "deleted_pdfs[]";
            deletedInput.value = pdfToRemove.path;
            deletedInput.className = "deleted-pdf-input";
            e.target.closest("form").appendChild(deletedInput);
        }

        setPdfs(pdfs.filter((_, i) => i !== index));
    };

    const [draggedPdfIndex, setDraggedPdfIndex] = useState(null);

    const handlePdfDragStart = (e, index) => {
        setDraggedPdfIndex(index);
    };

    const handlePdfDragEnd = () => {
        setDraggedPdfIndex(null);
    };

    const handlePdfDragOver = (e) => {
        e.preventDefault();
    };

    const handlePdfDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedPdfIndex === null || draggedPdfIndex === dropIndex) return;

        const newPdfs = [...pdfs];
        const [draggedItem] = newPdfs.splice(draggedPdfIndex, 1);
        newPdfs.splice(dropIndex, 0, draggedItem);

        setPdfs(newPdfs.map((pdf, idx) => ({ ...pdf, order: idx })));
        setDraggedPdfIndex(null);
    };

    /*************************/
    /* Funciones para Videos */
    /*************************/
    const addVideo = (e) => {
        e.preventDefault();
        const url = videoUrlRef.current?.value;
        if (url && url.trim()) {
            setVideos([...videos, { url: url.trim(), order: videos.length }]);
            if (videoUrlRef.current) videoUrlRef.current.value = "";
        }
    };

    const removeVideo = (e, index) => {
        e.preventDefault();
        const videoToRemove = videos[index];

        if (videoToRemove.id) {
            const deletedInput = document.createElement("input");
            deletedInput.type = "hidden";
            deletedInput.name = "deleted_videos[]";
            deletedInput.value = index;
            deletedInput.className = "deleted-video-input";
            e.target.closest("form").appendChild(deletedInput);
        }

        setVideos(videos.filter((_, i) => i !== index));
    };

    const [draggedVideoIndex, setDraggedVideoIndex] = useState(null);

    // Verificar qué secciones tienen campos disponibles
    const hasCategorizationFields =
        Fillable.has("services", "service_category_id") ||
        Fillable.has("services", "service_subcategory_id");
    const hasIdentificationFields =
        Fillable.has("services", "name") || Fillable.has("services", "path");
    const hasSummaryField = Fillable.has("services", "summary");
    const hasGalleryFields =
        Fillable.has("services", "is_gallery") ||
        Fillable.has("services", "pdf") ||
        Fillable.has("services", "linkvideo");
    const hasMainImagesFields =
        Fillable.has("services", "image") ||
        Fillable.has("services", "background_image");

    const handleVideoDragStart = (e, index) => {
        setDraggedVideoIndex(index);
    };

    const handleVideoDragEnd = () => {
        setDraggedVideoIndex(null);
    };

    const handleVideoDragOver = (e) => {
        e.preventDefault();
    };

    const handleVideoDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedVideoIndex === null || draggedVideoIndex === dropIndex)
            return;

        const newVideos = [...videos];
        const [draggedItem] = newVideos.splice(draggedVideoIndex, 1);
        newVideos.splice(dropIndex, 0, draggedItem);

        setVideos(newVideos.map((video, idx) => ({ ...video, order: idx })));
        setDraggedVideoIndex(null);
    };

    /*************************/
    /* Features y Specifications */
    /*************************/
    const addFeature = () => {
        setFeatures([...features, { id: null, feature: "" }]);
    };

    const updateFeature = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index].feature = value;
        setFeatures(newFeatures);
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const addSpecification = () => {
        setSpecifications([
            ...specifications,
            { id: null, type: "general", title: "", description: "" },
        ]);
    };

    const updateSpecification = (index, field, value) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };

    const removeSpecification = (index) => {
        setSpecifications(specifications.filter((_, i) => i !== index));
    };

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";

        if (nameRef.current) nameRef.current.value = data?.name ?? "";
        if (summaryRef.current) summaryRef.current.value = data?.summary ?? "";
        if (pathRef.current) pathRef.current.value = data?.path ?? "";
        if (slugRef.current) slugRef.current.value = data?.slug ?? "";

        // Establecer el contenido del editor Quill
        if (descriptionRef.current && descriptionRef.editor) {
            descriptionRef.editor.root.innerHTML = data?.description ?? "";
        }

        if (imageRef.current) {
            imageRef.image.src = data?.image
                ? `/storage/images/service/${data.image}`
                : "";
            imageRef.current.value = null;
            if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        }

        if (backgroundImageRef.current) {
            backgroundImageRef.image.src = data?.background_image
                ? `/storage/images/service/${data.background_image}`
                : "";
            backgroundImageRef.current.value = null;
            if (backgroundImageRef.resetDeleteFlag)
                backgroundImageRef.resetDeleteFlag();
        }

        if (categoryRef.current) {
            $(categoryRef.current)
                .val(data?.service_category_id || null)
                .trigger("change");
        }

        if (data?.service_category_id) {
            setSelectedCategory(Number(data.service_category_id));
        }

        if (subcategoryRef.current) {
            $(subcategoryRef.current)
                .val(data?.service_subcategory_id || null)
                .trigger("change");
        }

        if (data?.images && Array.isArray(data.images)) {
            const loadedImages = data.images.map((img) => ({
                id: img.id,
                preview: `/storage/images/service/${img.image}`,
                order: img.order,
                file: null,
            }));
            setGallery(loadedImages);
        } else {
            setGallery([]);
        }

        if (data?.pdf && Array.isArray(data.pdf)) {
            setPdfs(
                data.pdf.map((pdf) => ({
                    name: pdf.name,
                    path: pdf.path,
                    order: pdf.order,
                })),
            );
        } else {
            setPdfs([]);
        }

        if (data?.linkvideo && Array.isArray(data.linkvideo)) {
            setVideos(
                data.linkvideo.map((video) => ({
                    url: video.url,
                    order: video.order,
                })),
            );
        } else {
            setVideos([]);
        }

        if (data?.features && Array.isArray(data.features)) {
            setFeatures(
                data.features.map((f) => ({
                    id: f.id,
                    feature: f.feature || "",
                })),
            );
        } else {
            setFeatures([]);
        }

        if (data?.specifications && Array.isArray(data.specifications)) {
            setSpecifications(
                data.specifications.map((s) => ({
                    id: s.id,
                    type: s.type || "general",
                    title: s.title,
                    description: s.description,
                })),
            );
        } else {
            setSpecifications([]);
        }

        const deletedInputs = document.querySelectorAll(
            ".deleted-image-input, .deleted-pdf-input, .deleted-video-input",
        );
        deletedInputs.forEach((input) => input.remove());

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (idRef.current.value) formData.append("id", idRef.current.value);
        if (nameRef.current) formData.append("name", nameRef.current.value);
        if (summaryRef.current)
            formData.append("summary", summaryRef.current.value);
        if (descriptionRef.current)
            formData.append("description", descriptionRef.current.value);

        if (categoryRef.current) {
            const categoryValue = categoryRef.current.value;
            if (
                categoryValue &&
                categoryValue !== "" &&
                categoryValue !== "null"
            ) {
                formData.append("service_category_id", categoryValue);
            }
        }

        if (subcategoryRef.current) {
            const subcategoryValue = subcategoryRef.current.value;
            if (
                subcategoryValue &&
                subcategoryValue !== "" &&
                subcategoryValue !== "null"
            ) {
                formData.append("service_subcategory_id", subcategoryValue);
            }
        }

        if (pathRef.current) {
            const pathValue = pathRef.current.value;
            if (pathValue && pathValue.trim() !== "") {
                formData.append("path", pathValue);
            }
        }

        const slugValue = slugRef.current?.value;
        if (slugValue && slugValue.trim() !== "") {
            formData.append("slug", slugValue);
        }

        if (imageRef.current) {
            const imageFile = imageRef.current.files[0];
            if (imageFile) {
                formData.append("image", imageFile);
            }
        }

        if (backgroundImageRef.current) {
            const backgroundImageFile = backgroundImageRef.current.files[0];
            if (backgroundImageFile) {
                formData.append("background_image", backgroundImageFile);
            }
        }

        if (
            imageRef.current &&
            imageRef.getDeleteFlag &&
            imageRef.getDeleteFlag()
        ) {
            formData.append("image_delete", "DELETE");
        }

        if (
            backgroundImageRef.current &&
            backgroundImageRef.getDeleteFlag &&
            backgroundImageRef.getDeleteFlag()
        ) {
            formData.append("background_image_delete", "DELETE");
        }

        gallery.forEach((img, index) => {
            if (img.file) {
                formData.append(`gallery[]`, img.file);
            }
        });

        const deletedImageInputs = document.querySelectorAll(
            ".deleted-image-input",
        );
        const deletedImages = Array.from(deletedImageInputs).map(
            (input) => input.value,
        );
        if (deletedImages.length > 0) {
            formData.append("deleted_images", JSON.stringify(deletedImages));
        }

        pdfs.forEach((pdf, index) => {
            if (pdf.file) {
                formData.append(`pdf[]`, pdf.file);
            }
        });

        const deletedPdfInputs =
            document.querySelectorAll(".deleted-pdf-input");
        const deletedPdfs = Array.from(deletedPdfInputs).map(
            (input) => input.value,
        );
        if (deletedPdfs.length > 0) {
            formData.append("deleted_pdfs", JSON.stringify(deletedPdfs));
        }

        const videoUrls = videos.map((v) => v.url);
        formData.append("linkvideo", JSON.stringify(videoUrls));

        const deletedVideoInputs = document.querySelectorAll(
            ".deleted-video-input",
        );
        const deletedVideos = Array.from(deletedVideoInputs).map(
            (input) => input.value,
        );
        if (deletedVideos.length > 0) {
            formData.append("deleted_videos", JSON.stringify(deletedVideos));
        }

        formData.append("features", JSON.stringify(features));
        formData.append("specifications", JSON.stringify(specifications));

        const result = await servicesRest.save(formData);
        if (!result) return;

        if (imageRef.current && imageRef.resetDeleteFlag)
            imageRef.resetDeleteFlag();
        if (backgroundImageRef.current && backgroundImageRef.resetDeleteFlag)
            backgroundImageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "status",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onFeaturedChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "featured",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (row) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await servicesRest.delete(row.id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;

        try {
            const result = await servicesRest.reorder(
                e.itemData.id,
                newOrderIndex,
            );
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error("Error reordering service:", error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Servicios"
                rest={servicesRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            hint: "Agregar",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                exportable={true}
                exportableName="Servicios"
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    showDragIcons: true,
                }}
                sorting={{ mode: "single" }} // Desactivar ordenamiento por columnas para evitar conflictos con drag & drop
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "order_index",
                        caption: "Orden",
                        visible: false,
                        sortOrder: "asc",
                        sortIndex: 0,
                    },
                    (Fillable.has("services", "service_category_id") ||
                        Fillable.has("services", "service_subcategory_id")) && {
                        dataField: "category.name",
                        caption: "Categoría",
                        width: "150px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b className="d-block">
                                            {data.category?.name ||
                                                "Sin categoría"}
                                        </b>
                                        <small className="text-muted">
                                            {data.subcategory?.name || ""}
                                        </small>
                                    </>,
                                ),
                            );
                        },
                    },
                    Fillable.has("services", "name") && {
                        dataField: "name",
                        caption: "Servicio",
                        minWidth: "300px",
                        cellTemplate: (container, { data }) => {
                            const truncateWords = (text, maxWords) => {
                                if (!text) return "";
                                const words = text.split(" ");
                                if (words.length > maxWords) {
                                    return (
                                        words.slice(0, maxWords).join(" ") +
                                        "..."
                                    );
                                }
                                return text;
                            };

                            const stripHtml = (html) => {
                                if (!html) return "";
                                const tmp = document.createElement("div");
                                tmp.innerHTML = html;
                                return tmp.textContent || tmp.innerText || "";
                            };

                            // Priorizar summary, si no existe usar description limpiando HTML
                            const contentToShow = data.summary
                                ? data.summary
                                : stripHtml(data.description);

                            const truncatedContent = truncateWords(
                                contentToShow,
                                15,
                            );

                            container.html(
                                renderToString(
                                    <>
                                        <b>{data.name}</b>
                                        {(data.summary || data.description) &&
                                            truncatedContent && (
                                                <>
                                                    <br />
                                                    <span className="text-muted">
                                                        {truncatedContent}
                                                    </span>
                                                </>
                                            )}
                                    </>,
                                ),
                            );
                        },
                    },
                    Fillable.has("services", "image") && {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("services", "background_image") && {
                        dataField: "background_image",
                        caption: "Banner",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service/${data.background_image}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("services", "visible") && {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "90px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: !data.visible,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("services", "featured") && {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "110px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.featured == 1}
                                    onChange={() =>
                                        onFeaturedChange({
                                            id: data.id,
                                            value: !data.featured,
                                        })
                                    }
                                />,
                            );
                        },
                    },

                    {
                        caption: "Acciones",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data),
                                }),
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar servicio" : "Agregar servicio"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />
                <input ref={slugRef} type="hidden" />

                <div id="principal-container">
                    {/* Sistema de Pestañas */}
                    <ul
                        className="nav nav-pills nav-justified mb-4"
                        role="tablist"
                        style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                            padding: "4px",
                            border: "1px solid #e9ecef",
                        }}
                    >
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link active"
                                id="basic-info-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#basic-info"
                                type="button"
                                role="tab"
                                aria-controls="basic-info"
                                aria-selected="true"
                                style={{
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <i className="fas fa-info-circle me-2"></i>
                                Información Básica
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="multimedia-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#multimedia"
                                type="button"
                                role="tab"
                                aria-controls="multimedia"
                                aria-selected="false"
                                style={{
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <i className="fas fa-images me-2"></i>
                                Multimedia
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="features-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#features"
                                type="button"
                                role="tab"
                                aria-controls="features"
                                aria-selected="false"
                                style={{
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <i className="fas fa-list-ul me-2"></i>
                                Características
                            </button>
                        </li>
                    </ul>

                    {/* Contenido de las Pestañas */}
                    <div className="tab-content">
                        {/* Pestaña: Información Básica */}
                        <div
                            className="tab-pane fade show active"
                            id="basic-info"
                            role="tabpanel"
                            aria-labelledby="basic-info-tab"
                        >
                            <div className="row g-3">
                                {hasIdentificationFields && (
                                    <div
                                        className={
                                            hasCategorizationFields
                                                ? "col-md-6"
                                                : "col-12"
                                        }
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-tag me-2"></i>
                                                    Identificación
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <InputFormGroup
                                                    eRef={nameRef}
                                                    label="Nombre del Servicio"
                                                    required
                                                    hidden={
                                                        !Fillable.has(
                                                            "services",
                                                            "name",
                                                        )
                                                    }
                                                />
                                                <InputFormGroup
                                                    eRef={pathRef}
                                                    label="Ruta (Path)"
                                                    placeholder="/mi-servicio"
                                                    hidden={
                                                        !Fillable.has(
                                                            "services",
                                                            "path",
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {hasCategorizationFields && (
                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-sitemap me-2"></i>
                                                    Categorización
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <SelectFormGroup
                                                    eRef={categoryRef}
                                                    label="Categoría"
                                                    dropdownParent="#principal-container"
                                                    onChange={(e) =>
                                                        setSelectedCategory(
                                                            e.target.value
                                                                ? Number(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    hidden={
                                                        !Fillable.has(
                                                            "services",
                                                            "service_category_id",
                                                        )
                                                    }
                                                >
                                                    {service_categories.map(
                                                        (item, index) => (
                                                            <option
                                                                key={index}
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </option>
                                                        ),
                                                    )}
                                                </SelectFormGroup>

                                                <SelectFormGroup
                                                    eRef={subcategoryRef}
                                                    label="Subcategoría"
                                                    dropdownParent="#principal-container"
                                                    hidden={
                                                        !Fillable.has(
                                                            "services",
                                                            "service_subcategory_id",
                                                        )
                                                    }
                                                >
                                                    {service_sub_categories
                                                        .filter(
                                                            (sub) =>
                                                                !selectedCategory ||
                                                                sub.service_category_id ===
                                                                    selectedCategory,
                                                        )
                                                        .map((item, index) => (
                                                            <option
                                                                key={index}
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </SelectFormGroup>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {hasSummaryField && (
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-align-left me-2"></i>
                                                    Descripción
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <TextareaFormGroup
                                                    eRef={summaryRef}
                                                    label="Resumen Corto"
                                                    rows={3}
                                                    placeholder="Breve descripción del servicio (1-2 líneas)"
                                                    hidden={
                                                        !Fillable.has(
                                                            "services",
                                                            "summary",
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pestaña: Multimedia */}
                        <div
                            className="tab-pane fade"
                            id="multimedia"
                            role="tabpanel"
                            aria-labelledby="multimedia-tab"
                        >
                            <div className="row g-3">
                                {hasMainImagesFields && (
                                    <div
                                        className={
                                            hasGalleryFields
                                                ? "col-md-6"
                                                : "col-12"
                                        }
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-image me-2"></i>
                                                    Imágenes Principales
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    {Fillable.has(
                                                        "services",
                                                        "background_image",
                                                    ) && (
                                                        <ImageFormGroup
                                                            eRef={
                                                                backgroundImageRef
                                                            }
                                                            name="background_image"
                                                            label="Banner"
                                                            aspect={2 / 1}
                                                            col="col-12"
                                                        />
                                                    )}
                                                    {Fillable.has(
                                                        "services",
                                                        "image",
                                                    ) && (
                                                        <ImageFormGroup
                                                            eRef={imageRef}
                                                            name="image"
                                                            label="Imagen Principal"
                                                            aspect={1}
                                                            col="col-md-6"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {hasGalleryFields && (
                                    <div
                                        className={
                                            hasMainImagesFields
                                                ? "col-md-6"
                                                : "col-12"
                                        }
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-photo-video me-2"></i>
                                                    Galería y Multimedia
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                {/* Galería de Imágenes */}
                                                {Fillable.has(
                                                    "services",
                                                    "is_gallery",
                                                ) && (
                                                    <div className="mb-4">
                                                        <label className="form-label fw-semibold text-dark mb-3">
                                                            <i className="fas fa-images me-2 text-primary"></i>
                                                            Galería de Imágenes
                                                            {gallery.length >
                                                                0 && (
                                                                <span className="badge bg-primary ms-2">
                                                                    {
                                                                        gallery.length
                                                                    }
                                                                </span>
                                                            )}
                                                        </label>

                                                        <input
                                                            id="input-service-gallery"
                                                            ref={galleryRef}
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            hidden
                                                            onChange={
                                                                handleGalleryChange
                                                            }
                                                        />

                                                        {/* Contenedor de la galería con grid responsive */}
                                                        <div
                                                            className="gallery-container"
                                                            style={{
                                                                display: "grid",
                                                                gridTemplateColumns:
                                                                    "repeat(auto-fill, minmax(120px, 1fr))",
                                                                gap: "16px",
                                                                padding: "16px",
                                                                backgroundColor:
                                                                    "#f8f9fa",
                                                                borderRadius:
                                                                    "12px",
                                                                border: "2px dashed #dee2e6",
                                                                minHeight:
                                                                    "160px",
                                                            }}
                                                        >
                                                            {/* Imágenes existentes con drag & drop */}
                                                            {gallery.map(
                                                                (
                                                                    image,
                                                                    index,
                                                                ) => {
                                                                    const displayIndex =
                                                                        index +
                                                                        1;
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="gallery-item position-relative"
                                                                            draggable
                                                                            onDragStart={(
                                                                                e,
                                                                            ) =>
                                                                                handleDragStart(
                                                                                    e,
                                                                                    index,
                                                                                )
                                                                            }
                                                                            onDragEnd={
                                                                                handleDragEnd
                                                                            }
                                                                            onDragOver={
                                                                                handleDragOverReorder
                                                                            }
                                                                            onDrop={(
                                                                                e,
                                                                            ) =>
                                                                                handleDropReorder(
                                                                                    e,
                                                                                    index,
                                                                                )
                                                                            }
                                                                            style={{
                                                                                aspectRatio:
                                                                                    "1",
                                                                                borderRadius:
                                                                                    "12px",
                                                                                overflow:
                                                                                    "hidden",
                                                                                boxShadow:
                                                                                    "0 4px 12px rgba(0,0,0,0.1)",
                                                                                transition:
                                                                                    "all 0.3s ease",
                                                                                cursor: "grab",
                                                                                transform:
                                                                                    draggedIndex ===
                                                                                    index
                                                                                        ? "scale(1.05)"
                                                                                        : "scale(1)",
                                                                                opacity:
                                                                                    draggedIndex ===
                                                                                    index
                                                                                        ? 0.8
                                                                                        : 1,
                                                                                border: "3px solid transparent",
                                                                                background:
                                                                                    "white",
                                                                            }}
                                                                            onMouseEnter={(
                                                                                e,
                                                                            ) => {
                                                                                if (
                                                                                    draggedIndex ===
                                                                                    null
                                                                                ) {
                                                                                    e.currentTarget.style.transform =
                                                                                        "scale(1.02)";
                                                                                    e.currentTarget.style.boxShadow =
                                                                                        "0 6px 20px rgba(0,0,0,0.15)";
                                                                                }
                                                                            }}
                                                                            onMouseLeave={(
                                                                                e,
                                                                            ) => {
                                                                                if (
                                                                                    draggedIndex ===
                                                                                    null
                                                                                ) {
                                                                                    e.currentTarget.style.transform =
                                                                                        "scale(1)";
                                                                                    e.currentTarget.style.boxShadow =
                                                                                        "0 4px 12px rgba(0,0,0,0.1)";
                                                                                }
                                                                            }}
                                                                        >
                                                                            {/* Indicador de posición */}
                                                                            <div className="position-absolute top-0 start-0 m-2">
                                                                                <span
                                                                                    className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                                                                    style={{
                                                                                        width: "24px",
                                                                                        height: "24px",
                                                                                        fontSize:
                                                                                            "11px",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        displayIndex
                                                                                    }
                                                                                </span>
                                                                            </div>

                                                                            {/* Imagen */}
                                                                            <img
                                                                                src={
                                                                                    image.preview
                                                                                }
                                                                                alt={`Imagen ${displayIndex}`}
                                                                                className="w-100 h-100"
                                                                                style={{
                                                                                    objectFit:
                                                                                        "cover",
                                                                                    pointerEvents:
                                                                                        "none",
                                                                                }}
                                                                            />

                                                                            {/* Overlay con controles */}
                                                                            <div
                                                                                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                                                                style={{
                                                                                    background:
                                                                                        "rgba(0,0,0,0.7)",
                                                                                    opacity: 0,
                                                                                    transition:
                                                                                        "opacity 0.3s ease",
                                                                                }}
                                                                                onMouseEnter={(
                                                                                    e,
                                                                                ) =>
                                                                                    (e.currentTarget.style.opacity = 1)
                                                                                }
                                                                                onMouseLeave={(
                                                                                    e,
                                                                                ) =>
                                                                                    (e.currentTarget.style.opacity = 0)
                                                                                }
                                                                            >
                                                                                <div className="d-flex gap-2">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: "32px",
                                                                                            height: "32px",
                                                                                        }}
                                                                                        title="Mover imagen"
                                                                                    >
                                                                                        <i className="fas fa-arrows-alt text-dark"></i>
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: "32px",
                                                                                            height: "32px",
                                                                                        }}
                                                                                        onClick={(
                                                                                            e,
                                                                                        ) =>
                                                                                            removeGalleryImage(
                                                                                                e,
                                                                                                index,
                                                                                            )
                                                                                        }
                                                                                        title="Eliminar imagen"
                                                                                    >
                                                                                        <i className="fas fa-trash text-white"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}

                                                            {/* Botón de agregar imagen mejorado */}
                                                            <div
                                                                className="gallery-add-button d-flex flex-column align-items-center justify-content-center"
                                                                style={{
                                                                    aspectRatio:
                                                                        "1",
                                                                    border: "3px dashed #71b6f9",
                                                                    borderRadius:
                                                                        "12px",
                                                                    backgroundColor:
                                                                        "rgba(13, 110, 253, 0.05)",
                                                                    cursor: "pointer",
                                                                    transition:
                                                                        "all 0.3s ease",
                                                                    minHeight:
                                                                        "120px",
                                                                }}
                                                                onClick={() =>
                                                                    galleryRef.current.click()
                                                                }
                                                                onDrop={
                                                                    handleDrop
                                                                }
                                                                onDragOver={
                                                                    handleDragOver
                                                                }
                                                                onMouseEnter={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "rgba(13, 110, 253, 0.1)";
                                                                    e.currentTarget.style.borderColor =
                                                                        "#0056b3";
                                                                    e.currentTarget.style.transform =
                                                                        "scale(1.02)";
                                                                }}
                                                                onMouseLeave={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "rgba(13, 110, 253, 0.05)";
                                                                    e.currentTarget.style.borderColor =
                                                                        "#71b6f9";
                                                                    e.currentTarget.style.transform =
                                                                        "scale(1)";
                                                                }}
                                                            >
                                                                <div className="text-center">
                                                                    <div
                                                                        className="mb-2 bg-primary"
                                                                        style={{
                                                                            width: "48px",
                                                                            height: "48px",
                                                                            borderRadius:
                                                                                "50%",
                                                                            display:
                                                                                "flex",
                                                                            alignItems:
                                                                                "center",
                                                                            justifyContent:
                                                                                "center",
                                                                            margin: "0 auto",
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-plus text-white fa-lg"></i>
                                                                    </div>
                                                                    <p
                                                                        className="mb-0 text-primary fw-semibold"
                                                                        style={{
                                                                            fontSize:
                                                                                "12px",
                                                                        }}
                                                                    >
                                                                        Agregar
                                                                        Imagen
                                                                    </p>
                                                                    <small
                                                                        className="text-muted"
                                                                        style={{
                                                                            fontSize:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        Arrastra
                                                                        o haz
                                                                        clic
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Mensaje cuando no hay imágenes */}
                                                        {gallery.length ===
                                                            0 && (
                                                            <div className="text-center py-4 text-muted">
                                                                <i className="fas fa-images fa-3x mb-3 opacity-50"></i>
                                                                <p className="mb-1">
                                                                    No hay
                                                                    imágenes en
                                                                    la galería
                                                                </p>
                                                                <small>
                                                                    Arrastra
                                                                    archivos
                                                                    aquí o haz
                                                                    clic en
                                                                    "Agregar
                                                                    Imagen"
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* PDFs múltiples con ordenamiento */}
                                                {Fillable.has(
                                                    "services",
                                                    "pdf",
                                                ) && (
                                                    <div className="mb-4">
                                                        <label className="form-label fw-semibold text-dark mb-3">
                                                            <i className="fas fa-file-pdf me-2 text-danger"></i>
                                                            Archivos PDF
                                                            (Manuales /
                                                            Catálogos)
                                                            {pdfs.length >
                                                                0 && (
                                                                <span className="badge bg-danger ms-2">
                                                                    {
                                                                        pdfs.length
                                                                    }
                                                                </span>
                                                            )}
                                                        </label>

                                                        <input
                                                            ref={pdfRef}
                                                            type="file"
                                                            multiple
                                                            accept=".pdf"
                                                            hidden
                                                            onChange={
                                                                handlePdfChange
                                                            }
                                                        />

                                                        {/* Lista de PDFs con drag & drop */}
                                                        <div className="list-group mb-3">
                                                            {pdfs.map(
                                                                (
                                                                    pdf,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        draggable
                                                                        onDragStart={(
                                                                            e,
                                                                        ) =>
                                                                            handlePdfDragStart(
                                                                                e,
                                                                                index,
                                                                            )
                                                                        }
                                                                        onDragEnd={
                                                                            handlePdfDragEnd
                                                                        }
                                                                        onDragOver={
                                                                            handlePdfDragOver
                                                                        }
                                                                        onDrop={(
                                                                            e,
                                                                        ) =>
                                                                            handlePdfDropReorder(
                                                                                e,
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="list-group-item d-flex align-items-center justify-content-between"
                                                                        style={{
                                                                            cursor: "grab",
                                                                            opacity:
                                                                                draggedPdfIndex ===
                                                                                index
                                                                                    ? 0.5
                                                                                    : 1,
                                                                            backgroundColor:
                                                                                draggedPdfIndex ===
                                                                                index
                                                                                    ? "#f8f9fa"
                                                                                    : "white",
                                                                            transition:
                                                                                "all 0.2s ease",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="d-flex align-items-center flex-grow-1"
                                                                            style={{
                                                                                minWidth: 0,
                                                                            }}
                                                                        >
                                                                            <span
                                                                                className="badge bg-danger me-3"
                                                                                style={{
                                                                                    minWidth:
                                                                                        "28px",
                                                                                }}
                                                                            >
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                            <i className="fas fa-grip-vertical text-muted me-3"></i>
                                                                            <i className="fas fa-file-pdf text-danger me-2"></i>
                                                                            <span
                                                                                className="text-truncate"
                                                                                style={{
                                                                                    maxWidth:
                                                                                        "250px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    pdf.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="d-flex gap-2 flex-shrink-0">
                                                                            {!pdf.file &&
                                                                                pdf.path && (
                                                                                    <a
                                                                                        href={`/storage/pdfs/service/${pdf.path}`}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="btn btn-sm btn-outline-primary"
                                                                                    >
                                                                                        <i className="fas fa-eye"></i>
                                                                                    </a>
                                                                                )}
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-danger"
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    removePdf(
                                                                                        e,
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i className="fas fa-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger w-100"
                                                            onClick={() =>
                                                                pdfRef.current.click()
                                                            }
                                                        >
                                                            <i className="fas fa-plus me-2"></i>
                                                            Agregar PDFs
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Videos múltiples con ordenamiento */}
                                                {Fillable.has(
                                                    "services",
                                                    "linkvideo",
                                                ) && (
                                                    <div className="mb-3">
                                                        <label className="form-label fw-semibold text-dark mb-3">
                                                            <i className="fas fa-video me-2 text-success"></i>
                                                            Links de Videos
                                                            {videos.length >
                                                                0 && (
                                                                <span className="badge bg-success ms-2">
                                                                    {
                                                                        videos.length
                                                                    }
                                                                </span>
                                                            )}
                                                        </label>

                                                        {/* Lista de videos con drag & drop */}
                                                        <div className="list-group mb-3">
                                                            {videos.map(
                                                                (
                                                                    video,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        draggable
                                                                        onDragStart={(
                                                                            e,
                                                                        ) =>
                                                                            handleVideoDragStart(
                                                                                e,
                                                                                index,
                                                                            )
                                                                        }
                                                                        onDragEnd={
                                                                            handleVideoDragEnd
                                                                        }
                                                                        onDragOver={
                                                                            handleVideoDragOver
                                                                        }
                                                                        onDrop={(
                                                                            e,
                                                                        ) =>
                                                                            handleVideoDropReorder(
                                                                                e,
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="list-group-item d-flex align-items-center justify-content-between"
                                                                        style={{
                                                                            cursor: "grab",
                                                                            opacity:
                                                                                draggedVideoIndex ===
                                                                                index
                                                                                    ? 0.5
                                                                                    : 1,
                                                                            backgroundColor:
                                                                                draggedVideoIndex ===
                                                                                index
                                                                                    ? "#f8f9fa"
                                                                                    : "white",
                                                                            transition:
                                                                                "all 0.2s ease",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="d-flex align-items-center flex-grow-1"
                                                                            style={{
                                                                                minWidth: 0,
                                                                                overflow:
                                                                                    "hidden",
                                                                            }}
                                                                        >
                                                                            <span
                                                                                className="badge bg-success me-3 flex-shrink-0"
                                                                                style={{
                                                                                    minWidth:
                                                                                        "28px",
                                                                                }}
                                                                            >
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                            <i className="fas fa-grip-vertical text-muted me-3 flex-shrink-0"></i>
                                                                            <i className="fas fa-video text-success me-2 flex-shrink-0"></i>
                                                                            <span
                                                                                className="small"
                                                                                style={{
                                                                                    overflow:
                                                                                        "hidden",
                                                                                    textOverflow:
                                                                                        "ellipsis",
                                                                                    whiteSpace:
                                                                                        "nowrap",
                                                                                    maxWidth:
                                                                                        "100%",
                                                                                }}
                                                                                title={
                                                                                    video.url
                                                                                }
                                                                            >
                                                                                {
                                                                                    video.url
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="d-flex gap-2 flex-shrink-0 ms-2">
                                                                            <a
                                                                                href={
                                                                                    video.url
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="btn btn-sm btn-outline-primary"
                                                                            >
                                                                                <i className="fas fa-external-link-alt"></i>
                                                                            </a>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-danger"
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    removeVideo(
                                                                                        e,
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i className="fas fa-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>

                                                        {/* Formulario para agregar nuevo video */}
                                                        <div className="input-group">
                                                            <input
                                                                ref={
                                                                    videoUrlRef
                                                                }
                                                                type="url"
                                                                className="form-control"
                                                                placeholder="https://youtube.com/watch?v=..."
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-success"
                                                                onClick={
                                                                    addVideo
                                                                }
                                                            >
                                                                <i className="fas fa-plus me-2"></i>
                                                                Agregar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pestaña: Características */}
                        <div
                            className="tab-pane fade"
                            id="features"
                            role="tabpanel"
                            aria-labelledby="features-tab"
                        >
                            <div className="row g-3">
                                {Fillable.has("services", "is_features") && (
                                    <div
                                        className={`${Fillable.has("services", "is_features") && Fillable.has("services", "is_specifications") ? "col-md-6" : "col-12"}`}
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-list-ul me-2"></i>
                                                    Características
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                {features.length === 0 ? (
                                                    <div className="alert alert-info mb-0">
                                                        <i className="mdi mdi-information me-2"></i>
                                                        No hay características
                                                        agregadas. Haz clic en
                                                        "Agregar" para comenzar.
                                                    </div>
                                                ) : (
                                                    features.map(
                                                        (feature, index) => (
                                                            <div
                                                                key={index}
                                                                className="card mb-3 border"
                                                            >
                                                                <div className="card-body">
                                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                                        <label className="form-label mb-0">
                                                                            Característica
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </label>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() =>
                                                                                removeFeature(
                                                                                    index,
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="mdi mdi-delete"></i>
                                                                        </button>
                                                                    </div>
                                                                    <textarea
                                                                        className="form-control"
                                                                        rows="2"
                                                                        value={
                                                                            feature.feature
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateFeature(
                                                                                index,
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="Ej: Atención personalizada 24/7"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    )
                                                )}
                                                <button
                                                    type="button"
                                                    className="btn btn-primary w-100"
                                                    onClick={addFeature}
                                                >
                                                    <i className="mdi mdi-plus me-1"></i>{" "}
                                                    Agregar Característica
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {Fillable.has(
                                    "services",
                                    "is_specifications",
                                ) && (
                                    <div
                                        className={`${Fillable.has("services", "is_features") && Fillable.has("services", "is_specifications") ? "col-md-6" : "col-12"}`}
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-cogs me-2"></i>
                                                    Especificaciones
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                {specifications.length === 0 ? (
                                                    <div className="alert alert-info mb-0">
                                                        <i className="mdi mdi-information me-2"></i>
                                                        No hay especificaciones
                                                        agregadas. Haz clic en
                                                        "Agregar" para comenzar.
                                                    </div>
                                                ) : (
                                                    specifications.map(
                                                        (spec, index) => (
                                                            <div
                                                                key={index}
                                                                className="card mb-3 border"
                                                            >
                                                                <div className="card-body">
                                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                                        <label className="form-label mb-0">
                                                                            Especificación
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </label>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() =>
                                                                                removeSpecification(
                                                                                    index,
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="mdi mdi-delete"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="row g-3">
                                                                        <div className="col-md-12">
                                                                            <label className="form-label">
                                                                                Tipo
                                                                            </label>
                                                                            <select
                                                                                className="form-select"
                                                                                value={
                                                                                    spec.type
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateSpecification(
                                                                                        index,
                                                                                        "type",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <option value="principal">
                                                                                    Principal
                                                                                </option>
                                                                                <option value="general">
                                                                                    General
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-12">
                                                                            <label className="form-label">
                                                                                Título
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={
                                                                                    spec.title
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateSpecification(
                                                                                        index,
                                                                                        "title",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                                placeholder="Ej: Certificaciones ISO"
                                                                            />
                                                                        </div>
                                                                        <div className="col-12">
                                                                            <label className="form-label">
                                                                                Descripción
                                                                            </label>
                                                                            <textarea
                                                                                className="form-control"
                                                                                rows="2"
                                                                                value={
                                                                                    spec.description
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateSpecification(
                                                                                        index,
                                                                                        "description",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                                placeholder="Descripción detallada..."
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )
                                                )}
                                                <button
                                                    type="button"
                                                    className="btn btn-primary w-100"
                                                    onClick={addSpecification}
                                                >
                                                    <i className="mdi mdi-plus me-1"></i>{" "}
                                                    Agregar Especificación
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {Fillable.has("services", "description") && (
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-edit me-2"></i>
                                                    Descripción Detallada
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <QuillFormGroup
                                                    eRef={descriptionRef}
                                                    label="Descripción Completa"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Servicios">
            <Services {...properties} />
        </BaseAdminto>,
    );
});
