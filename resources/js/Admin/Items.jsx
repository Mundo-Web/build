import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ItemsRest from "../Actions/Admin/ItemsRest";
import AmenitiesRest from "../Actions/Admin/AmenitiesRest";
import ApplicationsRest from "../Actions/Admin/ApplicationsRest";
import AttributesRest from "../Actions/Admin/AttributesRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency, { CurrencySymbol } from "../Utils/Number2Currency";
import ReactAppend from "../Utils/ReactAppend";
import SetSelectValue from "../Utils/SetSelectValue";
import ItemsGalleryRest from "../Actions/Admin/ItemsGalleryRest";
import DynamicField from "../Components/Adminto/form/DynamicField";
import ModalImportItem from "./Components/ModalImportItem";
import ItemVariantsManager from "./ItemAdminComponents/ItemVariantsManager";
import Fillable from "../Utils/Fillable";

const itemsRest = new ItemsRest();
const amenitiesRest = new AmenitiesRest();
const applicationsRest = new ApplicationsRest();
const attributesRest = new AttributesRest();

const Items = ({
    categories,
    brands,
    collections,
    stores,
    generals,
    attributes: initialAttributes,
}) => {
    //!FALTA EDIT AND DELETEDE GALERIA

    const [itemData, setItemData] = useState([]);

    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref

    const idRef = useRef();
    const categoryRef = useRef();
    const collectionRef = useRef();
    const subcategoryRef = useRef();
    const brandRef = useRef();
    const nameRef = useRef();
    const colorRef = useRef();
    const sizeRef = useRef();
    const summaryRef = useRef();
    const priceRef = useRef();
    const discountRef = useRef();
    const tagsRef = useRef();
    const bannerRef = useRef();
    const imageRef = useRef();
    const textureRef = useRef();
    const descriptionRef = useRef();
    const skuRef = useRef();
    const agrupadorRef = useRef();

    // Nuevos campos
    const stockRef = useRef();
    const storeRef = useRef();

    const featuresRef = useRef([]);
    const specificationsRef = useRef([]);
    const weightRef = useRef();
    const amenitiesRef = useRef();
    const applicationsRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);

    /*ADD NEW LINES GALLERY */
    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();

    /* PDFs y Videos como arrays con ordenamiento */
    const [pdfs, setPdfs] = useState([]);
    const pdfRef = useRef();
    const [videos, setVideos] = useState([]);
    const videoUrlRef = useRef();
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [applications, setApplications] = useState([]);

    // Estados para atributos dinámicos
    const [availableAttributes, setAvailableAttributes] = useState(
        initialAttributes || [],
    );
    const [itemAttributes, setItemAttributes] = useState([]); // {attribute_id, value, attribute}

    // VARIANTES: Refs y Estados
    // Integrated Variant Manager State
    const [isMaster, setIsMaster] = useState(false);

    // Gestión Avanzada de Variantes (New Component)
    const [masterItemForVariants, setMasterItemForVariants] = useState(null);
    const [showVariantsManager, setShowVariantsManager] = useState(false);

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    useEffect(() => {
        getApplications();
        getAttributes();
    }, []);

    const getApplications = async () => {
        const result = await applicationsRest.paginate({
            page: 1,
            pageSize: 1000,
        });
        if (result?.data) {
            setApplications(result.data);
        }
    };

    const getAttributes = async () => {
        const result = await attributesRest.paginate({
            page: 1,
            pageSize: 1000,
        });
        if (result?.data) {
            setAvailableAttributes(result.data);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeGalleryImage = (e, index) => {
        e.preventDefault();
        const image = gallery[index];
        if (image.id) {
            // Si la imagen tiene ID, significa que está guardada en la base de datos.
            setGallery((prev) =>
                prev.map((img, i) =>
                    i === index ? { ...img, toDelete: true } : img,
                ),
            );
        } else {
            // Si es una imagen nueva, simplemente la eliminamos.
            setGallery((prev) => prev.filter((_, i) => i !== index));
        }
    };

    // Funciones para drag & drop de reordenamiento
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOverReorder = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newGallery = [...gallery];
        const draggedItem = newGallery[draggedIndex];

        // Remover el elemento arrastrado
        newGallery.splice(draggedIndex, 1);
        // Insertar en la nueva posición
        newGallery.splice(dropIndex, 0, draggedItem);

        setGallery(newGallery);
        setDraggedIndex(null);
    };

    /*************************/
    /* Funciones para PDFs */
    /*************************/
    const handlePdfChange = (e) => {
        const files = Array.from(e.target.files);
        const newPdfs = files.map((file) => ({
            file,
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setPdfs((prev) => [...prev, ...newPdfs]);
    };

    const removePdf = (e, index) => {
        e.preventDefault();
        const pdf = pdfs[index];
        if (pdf.url && !pdf.file) {
            // PDF existente - marcar para eliminar
            setPdfs((prev) =>
                prev.map((p, i) =>
                    i === index ? { ...p, toDelete: true } : p,
                ),
            );
        } else {
            // PDF nuevo - eliminar directamente
            setPdfs((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const [draggedPdfIndex, setDraggedPdfIndex] = useState(null);

    const handlePdfDragStart = (e, index) => {
        setDraggedPdfIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handlePdfDragEnd = () => {
        setDraggedPdfIndex(null);
    };

    const handlePdfDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handlePdfDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedPdfIndex === null || draggedPdfIndex === dropIndex) return;

        const newPdfs = [...pdfs];
        const draggedItem = newPdfs[draggedPdfIndex];

        newPdfs.splice(draggedPdfIndex, 1);
        newPdfs.splice(dropIndex, 0, draggedItem);

        setPdfs(newPdfs);
        setDraggedPdfIndex(null);
    };

    /*************************/
    /* Funciones para Videos */
    /*************************/
    const addVideo = (e) => {
        e.preventDefault();
        const url = videoUrlRef.current.value.trim();
        if (url) {
            setVideos((prev) => [...prev, { url, order: prev.length + 1 }]);
            videoUrlRef.current.value = "";
        }
    };

    const removeVideo = (e, index) => {
        e.preventDefault();
        const video = videos[index];
        if (video.order && !video.new) {
            // Video existente - marcar para eliminar
            setVideos((prev) =>
                prev.map((v, i) =>
                    i === index ? { ...v, toDelete: true } : v,
                ),
            );
        } else {
            // Video nuevo - eliminar directamente
            setVideos((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const [draggedVideoIndex, setDraggedVideoIndex] = useState(null);

    const handleVideoDragStart = (e, index) => {
        setDraggedVideoIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleVideoDragEnd = () => {
        setDraggedVideoIndex(null);
    };

    const handleVideoDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleVideoDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedVideoIndex === null || draggedVideoIndex === dropIndex)
            return;

        const newVideos = [...videos];
        const draggedItem = newVideos[draggedVideoIndex];
        newVideos.splice(draggedVideoIndex, 1);
        newVideos.splice(dropIndex, 0, draggedItem);

        setVideos(newVideos);
        setDraggedVideoIndex(null);
    };

    /*************************/
    /* MODAL OPEN LOGIC */
    /*************************/

    // Eliminado useEffect duplicado que causaba la duplicación de imágenes
    // La carga de imágenes se maneja directamente en onModalOpen

    const onModalOpen = (data) => {
        setItemData(data || null); // Guardamos los datos en el estado
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        if (idRef.current) idRef.current.value = data?.id || "";
        if (agrupadorRef.current)
            agrupadorRef.current.value = data?.agrupador || "";
        $(categoryRef.current)
            .val(data?.category_id || null)
            .trigger("change");
        $(collectionRef.current)
            .val(data?.collection_id || null)
            .trigger("change");
        SetSelectValue(
            subcategoryRef.current,
            data?.subcategory?.id,
            data?.subcategory?.name,
        );
        $(brandRef.current)
            .val(data?.brand_id || null)
            .trigger("change");

        $(storeRef.current)
            .val(data?.store_id && data.store_id !== "" ? data.store_id : "")
            .trigger("change");

        if (nameRef.current) nameRef.current.value = data?.name || "";
        if (skuRef.current) skuRef.current.value = data?.sku || "";
        if (agrupadorRef.current)
            agrupadorRef.current.value = data?.agrupador || "";
        if (colorRef.current) colorRef.current.value = data?.color || "";
        if (sizeRef.current) sizeRef.current.value = data?.size || "";
        if (summaryRef.current) summaryRef.current.value = data?.summary || "";
        if (priceRef.current) priceRef.current.value = data?.price || 0;
        if (discountRef.current)
            discountRef.current.value = data?.discount || 0;
        if (weightRef.current) weightRef.current.value = data?.weight || 0;

        SetSelectValue(tagsRef.current, data?.tags ?? [], "id", "name");

        if (bannerRef.current) bannerRef.current.value = null;
        if (imageRef.current) imageRef.current.value = null;

        if (bannerRef.image)
            bannerRef.image.src = data?.banner
                ? `/storage/images/item/${data.banner}`
                : "";
        if (imageRef.image)
            imageRef.image.src = data?.image
                ? `/storage/images/item/${data.image}`
                : "";
        if (textureRef.image)
            textureRef.image.src = data?.texture
                ? `/storage/images/item/${data.texture}`
                : "";

        if (descriptionRef.editor)
            descriptionRef.editor.root.innerHTML = data?.description ?? "";

        // Cargar PDFs existentes
        if (data?.pdf && Array.isArray(data.pdf)) {
            const existingPdfs = data.pdf.map((pdf) => ({
                url: pdf.url ? `/storage/images/item/${pdf.url}` : pdf,
                name: pdf.name || "Documento.pdf",
                order: pdf.order || 0,
            }));
            setPdfs(existingPdfs);
        } else {
            setPdfs([]);
        }

        // Cargar videos existentes
        if (data?.linkvideo && Array.isArray(data.linkvideo)) {
            setVideos(
                data.linkvideo.map((video) => ({
                    url: video.url || video,
                    order: video.order || 0,
                })),
            );
        } else {
            setVideos([]);
        }

        // Cargar las imágenes de la galería
        if (data?.images) {
            const existingImages = data.images.map((img) => ({
                id: img.id,
                url: `/storage/images/item/${img.url}`,
            }));
            setGallery(existingImages);
        } else {
            setGallery([]);
        }

        if (data?.specifications) {
            setSpecifications(
                data.specifications.map((spec) => ({
                    type: spec.type,
                    title: spec.title,
                    description: spec.description,
                    image: spec.image || "",
                })),
            );
        } else {
            setSpecifications([]);
        }

        setIsMaster(Boolean(data?.is_master));

        // Nuevos campos
        setFeatures(
            data?.features?.map((f) =>
                typeof f === "object" ? f : { feature: f },
            ) || [],
        );
        if (stockRef.current) stockRef.current.value = data?.stock ?? 0;

        // Cargar amenidades seleccionadas
        SetSelectValue(
            amenitiesRef.current,
            data?.amenities ?? [],
            "id",
            "name",
        );

        // Cargar aplicaciones seleccionadas
        if (data?.applications && Array.isArray(data.applications)) {
            const applicationsIds = data.applications.map((a) => a.id || a);
            setSelectedApplications(applicationsIds);
            setTimeout(() => {
                $(applicationsRef.current)
                    .val(applicationsIds)
                    .trigger("change");
            }, 100);
        } else {
            setSelectedApplications([]);
            setTimeout(() => {
                $(applicationsRef.current).val([]).trigger("change");
            }, 100);
        }

        // Cargar atributos del item con sus valores
        if (data?.attributes && Array.isArray(data.attributes)) {
            const attrs = data.attributes.map((attr) => ({
                attribute_id: attr.id,
                value: attr.pivot?.value || "",
                attribute: attr,
            }));
            setItemAttributes(attrs);
        } else {
            setItemAttributes([]);
        }

        // Reset delete flags using direct references - only when opening modal
        if (bannerRef.deleteRef) bannerRef.deleteRef.value = "";
        if (imageRef.deleteRef) imageRef.deleteRef.value = "";
        if (textureRef.deleteRef) textureRef.deleteRef.value = "";

        // Reset variant generation states (but not isMaster, which is set above based on data)

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        // Limpia características vacías
        const cleanFeatures = features.filter((f) => {
            if (typeof f === "string") return f.trim() !== "";
            if (typeof f === "object") return f.feature?.trim() !== "";
            return false;
        });

        // Limpia especificaciones vacías
        const cleanSpecs = specifications.filter(
            (s) =>
                (s.title && s.title.trim() !== "") ||
                (s.description && s.description.trim() !== ""),
        );

        const request = {
            id: idRef.current?.value || undefined,
            category_id: categoryRef.current?.value,
            collection_id: collectionRef.current?.value || null,
            subcategory_id: subcategoryRef.current?.value,
            brand_id: brandRef.current?.value,
            name: nameRef.current?.value,
            sku: skuRef.current?.value,
            color: colorRef.current?.value,
            size: sizeRef.current?.value,
            summary: summaryRef.current?.value,
            price: priceRef.current?.value || 0,
            discount: discountRef.current?.value || 0,
            tags: $(tagsRef.current).val(),
            description:
                descriptionRef.current?.value ||
                descriptionRef.editor?.root?.innerHTML ||
                "",
            stock: stockRef.current?.value || 0,
            agrupador: agrupadorRef.current?.value || null,
            features: cleanFeatures,
            specifications: cleanSpecs,
            weight: weightRef.current?.value || 0,
            store_id:
                storeRef.current?.value && storeRef.current?.value !== ""
                    ? storeRef.current?.value
                    : null,
            amenities: $(amenitiesRef.current).val() || [],
            applications: $(applicationsRef.current).val() || [],
            attributes: itemAttributes
                .filter((a) => a.attribute_id && a.value)
                .map((a) => ({
                    id: a.attribute_id,
                    value: a.value,
                })),
            is_master: isMaster,
            // Campos para clonación de imágenes
            clone_from_id: itemData?.clone_from_id || null,
            clone_image: itemData?.clone_image || null,
            clone_banner: itemData?.clone_banner || null,
            clone_texture: itemData?.clone_texture || null,
        };

        const formData = new FormData();

        for (const key in request) {
            if (key === "features" || key === "specifications") {
                formData.append(key, JSON.stringify(request[key]));
            } else if (key === "tags") {
                // Asegurar que tags sea un array
                const tagsValue = request[key];
                if (Array.isArray(tagsValue)) {
                    tagsValue.forEach((tag, index) => {
                        formData.append(`tags[${index}]`, tag);
                    });
                } else if (tagsValue) {
                    // Si no es array pero tiene valor, convertir a array
                    formData.append("tags[0]", tagsValue);
                }
            } else if (key === "amenities") {
                // Enviar amenities como array de items individuales (como en Rooms.jsx)
                const amenitiesValue = request[key];
                if (
                    Array.isArray(amenitiesValue) &&
                    amenitiesValue.length > 0
                ) {
                    amenitiesValue.forEach((amenityId, index) => {
                        formData.append(`amenities[${index}]`, amenityId);
                    });
                }
            } else if (key === "applications") {
                // Enviar applications como array de items individuales
                const applicationsValue = request[key];
                if (
                    Array.isArray(applicationsValue) &&
                    applicationsValue.length > 0
                ) {
                    applicationsValue.forEach((applicationId, index) => {
                        formData.append(
                            `applications[${index}]`,
                            applicationId,
                        );
                    });
                }
            } else if (key === "attributes") {
                // Enviar atributos como JSON con id y valor
                const attributesValue = request[key];
                if (
                    Array.isArray(attributesValue) &&
                    attributesValue.length > 0
                ) {
                    formData.append(
                        "attributes",
                        JSON.stringify(attributesValue),
                    );
                }
            } else if (key === "variants_list") {
                if (request[key]) {
                    formData.append(key, JSON.stringify(request[key]));
                }
            } else if (key === "is_master") {
                formData.append(key, request[key] ? 1 : 0);
            } else if (
                key === "clone_from_id" ||
                key === "clone_image" ||
                key === "clone_banner" ||
                key === "clone_texture"
            ) {
                // Solo enviar campos de clonación si tienen valor real
                if (
                    request[key] &&
                    request[key] !== null &&
                    request[key] !== "null"
                ) {
                    formData.append(key, request[key]);
                }
            } else if (key === "id") {
                // Solo enviar id si tiene valor real (no undefined, null, o string vacío)
                if (
                    request[key] &&
                    request[key] !== "" &&
                    request[key] !== "undefined"
                ) {
                    formData.append(key, request[key]);
                }
            } else {
                formData.append(key, request[key]);
            }
        }

        const image = imageRef.current.files[0];
        if (image) {
            formData.append("image", image);
        }
        const texture = textureRef.current.files[0];
        if (texture) {
            formData.append("texture", texture);
        }
        const banner = bannerRef.current.files[0];
        if (banner) {
            formData.append("banner", banner);
        }

        // Procesar PDFs (múltiples archivos)
        const pdfFiles = pdfs.filter((pdf) => !pdf.toDelete);
        let pdfIndex = 0;
        pdfFiles.forEach((pdf) => {
            if (pdf.file) {
                // Nuevo archivo PDF
                formData.append(`pdf[${pdfIndex}]`, pdf.file);
                pdfIndex++;
            }
        });

        // Enviar el orden de los PDFs
        const pdfOrder = pdfFiles.map((pdf, index) => ({
            index,
            order: index + 1,
            name: pdf.name || "Documento.pdf",
        }));
        if (pdfOrder.length > 0) {
            formData.append("pdf_order", JSON.stringify(pdfOrder));
        }

        // PDFs marcados para eliminar
        const deletedPdfs = pdfs
            .map((pdf, index) => (pdf.toDelete ? index : null))
            .filter((index) => index !== null);
        if (deletedPdfs.length > 0) {
            formData.append("deleted_pdfs", JSON.stringify(deletedPdfs));
        }

        // Procesar Videos (links)
        const videoLinks = videos.filter((video) => !video.toDelete);
        const videoData = videoLinks.map((video, index) => ({
            url: video.url,
            order: index + 1,
        }));
        if (videoData.length > 0) {
            formData.append("linkvideo", JSON.stringify(videoData));
        }

        // Videos marcados para eliminar
        const deletedVideos = videos
            .map((video, index) => (video.toDelete ? index : null))
            .filter((index) => index !== null);
        if (deletedVideos.length > 0) {
            formData.append("deleted_videos", JSON.stringify(deletedVideos));
        }

        if (bannerRef.getDeleteFlag && bannerRef.getDeleteFlag()) {
            formData.append("banner_delete", "DELETE");
        }

        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append("image_delete", "DELETE");
        }

        if (textureRef.getDeleteFlag && textureRef.getDeleteFlag()) {
            formData.append("texture_delete", "DELETE");
        }

        //TODO: Preparar los datos de la galería

        // Galería - Separar imágenes nuevas y existentes
        let galleryIndex = 0;
        let galleryIdsIndex = 0;

        // Crear array con el orden de las imágenes (solo las no marcadas para eliminar)
        const galleryOrder = [];

        gallery.forEach((img, index) => {
            if (!img.toDelete) {
                if (img.file) {
                    formData.append(`gallery[${galleryIndex}]`, img.file); // Imágenes nuevas
                    galleryOrder.push({ type: "new", index: galleryIndex });
                    galleryIndex++;
                } else {
                    formData.append(`gallery_ids[${galleryIdsIndex}]`, img.id); // IDs de imágenes existentes
                    galleryOrder.push({
                        type: "existing",
                        id: img.id,
                        index: galleryIdsIndex,
                    });
                    galleryIdsIndex++;
                }
            }
        });

        // Enviar el orden de la galería al backend
        if (galleryOrder.length > 0) {
            formData.append("gallery_order", JSON.stringify(galleryOrder));
        }

        const deletedImages = gallery
            .filter((img) => img.toDelete)
            .map((img) => img.id); // Mantener como UUID strings
        if (deletedImages.length > 0) {
            deletedImages.forEach((id, index) => {
                formData.append(`deleted_images[${index}]`, id); // Enviar cada ID por separado
            });
        }

        // Debug: Log all FormData entries
        for (let [key, value] of formData.entries()) {
            // console.log(`${key}: ${value}`);
        }

        // --- Agregar datos de Variantes ---
        if (isMaster) {
            formData.append("is_master", 1);
            if (isMaster) {
                formData.append("is_master", 1);
            }
        }

        const result = await itemsRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (textureRef.resetDeleteFlag) textureRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
        setPdfs([]);
        setVideos([]);
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await itemsRest.boolean({ id, field: "visible", value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await itemsRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar item",
            text: "¿Estás seguro de eliminar este item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await itemsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    // Función para clonar item - Abre el modal con los datos pero sin ID para crear uno nuevo
    const onCloneClicked = (data) => {
        // Crear una copia de los datos sin el ID pero guardando referencia al original
        const clonedData = {
            ...data,
            id: null, // Sin ID para que se cree como nuevo
            name: data.name + " (Copia)",
            sku: data.sku ? data.sku + "-COPY" : "",
            // Guardar referencia al item original para copiar imágenes
            clone_from_id: data.id,
            clone_image: data.image,
            clone_banner: data.banner,
            clone_texture: data.texture,
        };

        // Abrir el modal con los datos clonados
        onModalOpen(clonedData);
    };

    // Función para manejar el reordering remoto
    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;
        try {
            const result = await itemsRest.reorder(
                e.itemData.id,
                newOrderIndex,
            );
            if (result) {
                $(gridRef.current).dxDataGrid("instance").refresh();
            }
        } catch (error) {
            console.error("Error reordering item:", error);
        }
    };

    const [features, setFeatures] = useState([]); // Características
    const [specifications, setSpecifications] = useState([]); // Especificaciones

    // Opciones del campo "type"
    const typeOptions = ["Principal", "General"];
    const [showImportModal, setShowImportModal] = useState(false);
    const modalImportRef = useRef();
    const onModalImportOpen = () => {
        $(modalImportRef.current).modal("show");
    };

    const onExportItems = async () => {
        try {
            // Mostrar loader
            Swal.fire({
                title: "Exportando items...",
                text: "Por favor espere",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Usar el método exportData de ItemsRest
            await itemsRest.exportData();

            Swal.fire({
                icon: "success",
                title: "Exportación exitosa",
                text: "El archivo se ha descargado correctamente",
                timer: 2000,
            });
        } catch (error) {
            console.error("Error al exportar:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.message ||
                    "No se pudo exportar los items. Por favor intente nuevamente.",
            });
        }
    };

    const onManageVariants = (item) => {
        setMasterItemForVariants(item);
        setShowVariantsManager(true);
    };

    const refreshGrid = () => {
        try {
            if (gridRef.current) {
                // Try to find jQuery with DevExtreme plugin
                const jq = window.$ || window.jQuery || $;
                if (
                    jq &&
                    typeof jq(gridRef.current).dxDataGrid === "function"
                ) {
                    jq(gridRef.current).dxDataGrid("instance").refresh();
                }
            }
        } catch (e) {
            console.warn("Grid refresh failed", e);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Items"
                rest={itemsRest}
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
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "upload",
                            text: "Importar Datos",
                            hint: "Importar Datos",
                            onClick: () => onModalImportOpen(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "download",
                            text: "Exportar Items",
                            hint: "Exportar Items (Formato Excel)",
                            onClick: () => onExportItems(),
                        },
                    });
                }}
                exportable={true}
                exportableName="Items"
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: "push",
                }}
                sorting={{
                    mode: "single",
                }}
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
                    Fillable.has("items", "category_id") && {
                        dataField: "category.name",
                        caption: "Categoría",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b className="d-block fst-italic text-muted">
                                            {data.collection?.name}
                                        </b>
                                        <b className="d-block">
                                            {data.category?.name}
                                        </b>
                                        <small className="text-muted">
                                            {data.subcategory?.name}
                                        </small>
                                    </>,
                                ),
                            );
                        },
                    },
                    Fillable.has("items", "subcategory_id") && {
                        dataField: "subcategory.name",
                        caption: "Subcategoría",
                        visible: false,
                    },
                    Fillable.has("items", "brand_id") && {
                        dataField: "brand.name",
                        caption: "Marca",
                        width: "120px",
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
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

                            const truncatedSummary = truncateWords(
                                data.summary,
                                12,
                            );

                            container.html(
                                renderToString(
                                    <>
                                        <b>{data.name}</b>
                                        <br />
                                        <span>{truncatedSummary}</span>
                                    </>,
                                ),
                            );
                        },
                    },
                    Fillable.has("items", "sku") && {
                        dataField: "sku",
                        caption: "SKU",
                        width: "120px",
                    },
                    Fillable.has("items", "final_price") && {
                        dataField: "final_price",
                        caption: "Precio",
                        dataType: "number",
                        width: "75px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        {data.discount > 0 && (
                                            <small
                                                className="d-block text-muted"
                                                style={{
                                                    textDecoration:
                                                        "line-through",
                                                }}
                                            >
                                                {CurrencySymbol()}{" "}
                                                {Number2Currency(data.price)}
                                            </small>
                                        )}
                                        <span>
                                            {CurrencySymbol()}{" "}
                                            {Number2Currency(
                                                data.discount > 0
                                                    ? data.discount
                                                    : data.price,
                                            )}
                                        </span>
                                    </>,
                                ),
                            );
                        },
                    },

                    Fillable.has("items", "weight") && {
                        dataField: "weight",
                        caption: "Peso",
                        dataType: "number",
                        width: "75px",
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/item/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "contain",
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
                    Fillable.has("items", "banner") && {
                        dataField: "banner",
                        caption: "Imagen Banner",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/item/${data.banner}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "contain",
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
                    Fillable.has("items", "is_new") && {
                        dataField: "is_new",
                        caption: "Nuevo",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const is_newValue =
                                data.is_new === 1 ||
                                data.is_new === "1" ||
                                data.is_new === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={is_newValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "is_new",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "offering") && {
                        dataField: "offering",
                        caption: "En oferta",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const offeringValue =
                                data.offering === 1 ||
                                data.offering === "1" ||
                                data.offering === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={offeringValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "offering",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "recommended") && {
                        dataField: "recommended",
                        caption: "Recomendado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const recommendedValue =
                                data.recommended === 1 ||
                                data.recommended === "1" ||
                                data.recommended === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={recommendedValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "recommended",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "featured") && {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const featuredValue =
                                data.featured === 1 ||
                                data.featured === "1" ||
                                data.featured === true;

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={featuredValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "featured",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "views") && {
                        dataField: "views",
                        caption: "Vistas",
                        dataType: "number",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const viewCount = data.views || 0;
                            container.html(
                                renderToString(
                                    <div className="text-center">
                                        <i className="fas fa-eye text-primary me-1"></i>
                                        <span className="fw-bold">
                                            {viewCount.toLocaleString()}
                                        </span>
                                    </div>,
                                ),
                            );
                        },
                    },

                    Fillable.has("items", "most_view") && {
                        dataField: "most_view",
                        caption: "Más visto",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const mostViewValue =
                                data.most_view === 1 ||
                                data.most_view === "1" ||
                                data.most_view === true;

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={mostViewValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "most_view",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "is_detail") && {
                        dataField: "is_detail",
                        caption: "Con Detalle",
                        dataType: "boolean",
                        width: "90px",
                        cellTemplate: (container, { data }) => {
                            const isDetailValue =
                                data.is_detail === 1 ||
                                data.is_detail === "1" ||
                                data.is_detail === true;

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={isDetailValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "is_detail",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "sold_out") && {
                        dataField: "sold_out",
                        caption: "Agotado",
                        dataType: "boolean",
                        width: "85px",
                        cellTemplate: (container, { data }) => {
                            const soldOutValue =
                                data.sold_out === 1 ||
                                data.sold_out === "1" ||
                                data.sold_out === true;

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={soldOutValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "sold_out",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "visible") && {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible}
                                    onChange={(e) =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: e.target.checked,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "is_master") && {
                        dataField: "is_master",
                        caption: "Master",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.is_master}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "is_master",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("items", "agrupador") && {
                        dataField: "agrupador",
                        caption: "Agrupador",
                        width: "150px",
                    },
                    {
                        caption: "Acciones",
                        width: "130px",
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
                            if (
                                data.is_master &&
                                Fillable.has("items", "is_master")
                            ) {
                                container.append(
                                    DxButton({
                                        className:
                                            "btn btn-xs btn-soft-warning",
                                        title: "Gestionar Variantes",
                                        icon: "fa fa-layer-group",
                                        onClick: () => onManageVariants(data),
                                    }),
                                );
                            }
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-info",
                                    title: "Clonar",
                                    icon: "fa fa-clone",
                                    onClick: () => onCloneClicked(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
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
                title={isEditing ? "Editar item" : "Agregar item"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <div id="principal-container">
                    <input ref={idRef} type="hidden" />

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
                        {
                            /* Condicional para mostrar tab de Precios solo si es necesario */
                            (Fillable.has("items", "price") ||
                                Fillable.has("items", "stock")) && (
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link"
                                        id="pricing-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pricing"
                                        type="button"
                                        role="tab"
                                        aria-controls="pricing"
                                        aria-selected="false"
                                        style={{
                                            borderRadius: "6px",
                                            fontWeight: "500",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <i className="fas fa-dollar-sign me-2"></i>
                                        Precios y Stock
                                    </button>
                                </li>
                            )
                        }{" "}
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
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0">
                                                <i className="fas fa-tag me-2"></i>
                                                Identificación
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            {Fillable.has(
                                                "items",
                                                "is_master",
                                            ) && (
                                                <div className="mb-3">
                                                    <SwitchFormGroup
                                                        label="Tiene Variantes"
                                                        checked={isMaster}
                                                        onChange={(e) =>
                                                            setIsMaster(
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                    />
                                                    <small className="text-muted d-block mt-1">
                                                        Activa esta opción para
                                                        generar múltiples
                                                        variantes (talla, color,
                                                        etc.) de este producto.
                                                    </small>
                                                </div>
                                            )}
                                            <InputFormGroup
                                                eRef={skuRef}
                                                label="SKU"
                                                required
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "sku",
                                                    )
                                                }
                                            />
                                            <InputFormGroup
                                                eRef={agrupadorRef}
                                                label="Código Agrupador"
                                                placeholder="UUID para agrupar variantes"
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "agrupador",
                                                    )
                                                }
                                            />
                                            <InputFormGroup
                                                eRef={nameRef}
                                                label="Nombre del Producto"
                                                required
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "name",
                                                    )
                                                }
                                            />
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={colorRef}
                                                        label="Color"
                                                        required
                                                        hidden={
                                                            !Fillable.has(
                                                                "items",
                                                                "color",
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={sizeRef}
                                                        label="Talla"
                                                        required
                                                        hidden={
                                                            !Fillable.has(
                                                                "items",
                                                                "size",
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={weightRef}
                                                        label="Peso"
                                                        hidden={
                                                            !Fillable.has(
                                                                "items",
                                                                "weight",
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                                required
                                                dropdownParent="#principal-container"
                                                onChange={(e) =>
                                                    setSelectedCategory(
                                                        e.target.value,
                                                    )
                                                }
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "category_id",
                                                    )
                                                }
                                            >
                                                {categories.map(
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
                                                eRef={collectionRef}
                                                label="Colección"
                                                dropdownParent="#principal-container"
                                                onChange={(e) =>
                                                    setSelectedCollection(
                                                        e.target.value,
                                                    )
                                                }
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "collection_id",
                                                    )
                                                }
                                            >
                                                {collections.map(
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

                                            <SelectAPIFormGroup
                                                eRef={subcategoryRef}
                                                label="Subcategoría"
                                                searchAPI="/api/admin/subcategories/paginate"
                                                searchBy="name"
                                                filter={[
                                                    "category_id",
                                                    "=",
                                                    selectedCategory,
                                                ]}
                                                dropdownParent="#principal-container"
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "subcategory_id",
                                                    )
                                                }
                                            />

                                            <SelectFormGroup
                                                eRef={brandRef}
                                                label="Marca"
                                                dropdownParent="#principal-container"
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "brand_id",
                                                    )
                                                }
                                            >
                                                {brands.map((item, index) => (
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
                                                label="Resumen"
                                                rows={3}
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "summary",
                                                    )
                                                }
                                            />

                                            <SelectFormGroup
                                                eRef={storeRef}
                                                label="Tienda"
                                                dropdownParent="#principal-container"
                                                onChange={(e) =>
                                                    setSelectedStore(
                                                        e.target.value,
                                                    )
                                                }
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "store_id",
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Seleccionar tienda
                                                    (opcional)
                                                </option>
                                                {stores.map((item, index) => (
                                                    <option
                                                        key={index}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </SelectFormGroup>

                                            <SelectAPIFormGroup
                                                id="tags"
                                                eRef={tagsRef}
                                                searchAPI={
                                                    "/api/admin/tags/paginate"
                                                }
                                                searchBy="name"
                                                label="Tags"
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "is_tags",
                                                    )
                                                }
                                                dropdownParent="#principal-container"
                                                tags
                                                multiple
                                            />
                                        </div>
                                    </div>
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
                                </div>
                            </div>
                        </div>

                        {/* Pestaña: Precios y Stock */}
                        <div
                            className="tab-pane fade"
                            id="pricing"
                            role="tabpanel"
                            aria-labelledby="pricing-tab"
                        >
                            <div className="row g-3">
                                {Fillable.has("items", "price") && (
                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-dollar-sign me-2"></i>
                                                    Precios
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <InputFormGroup
                                                    eRef={priceRef}
                                                    label="Precio Regular"
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                />
                                                <InputFormGroup
                                                    eRef={discountRef}
                                                    label="Precio con Descuento"
                                                    type="number"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {Fillable.has("items", "stock") && (
                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-boxes me-2"></i>
                                                    Inventario
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <InputFormGroup
                                                    label="Stock Disponible"
                                                    eRef={stockRef}
                                                    type="number"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}{" "}
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
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0">
                                                <i className="fas fa-image me-2"></i>
                                                Imágenes Principales
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <ImageFormGroup
                                                    eRef={bannerRef}
                                                    name="banner"
                                                    label="Banner"
                                                    aspect={2 / 1}
                                                    col="col-12"
                                                    hidden={
                                                        !Fillable.has(
                                                            "items",
                                                            "banner",
                                                        )
                                                    }
                                                />
                                                <ImageFormGroup
                                                    eRef={imageRef}
                                                    name="image"
                                                    label="Imagen Principal"
                                                    aspect={1}
                                                    col="col-md-6"
                                                    hidden={
                                                        !Fillable.has(
                                                            "items",
                                                            "image",
                                                        )
                                                    }
                                                />
                                                <ImageFormGroup
                                                    eRef={textureRef}
                                                    name="texture"
                                                    label="Textura"
                                                    aspect={1}
                                                    col="col-md-6"
                                                    hidden={
                                                        !Fillable.has(
                                                            "items",
                                                            "texture",
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0">
                                                <i className="fas fa-photo-video me-2"></i>
                                                Galería y Multimedia
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            {/* Galería de Imágenes */}
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold text-dark mb-3">
                                                    <i className="fas fa-images me-2 text-primary"></i>
                                                    Galería de Imágenes
                                                    {gallery.filter(
                                                        (img) => !img.toDelete,
                                                    ).length > 0 && (
                                                        <span className="badge bg-primary ms-2">
                                                            {
                                                                gallery.filter(
                                                                    (img) =>
                                                                        !img.toDelete,
                                                                ).length
                                                            }
                                                        </span>
                                                    )}
                                                </label>

                                                <input
                                                    id="input-item-gallery"
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
                                                        borderRadius: "12px",
                                                        border: "2px dashed #dee2e6",
                                                        minHeight: "160px",
                                                    }}
                                                >
                                                    {/* Imágenes existentes con drag & drop */}
                                                    {gallery
                                                        .filter(
                                                            (image) =>
                                                                !image.toDelete,
                                                        )
                                                        .map((image, index) => {
                                                            const originalIndex =
                                                                gallery.findIndex(
                                                                    (img) =>
                                                                        img ===
                                                                        image,
                                                                );
                                                            const displayIndex =
                                                                index + 1;
                                                            return (
                                                                <div
                                                                    key={
                                                                        originalIndex
                                                                    }
                                                                    className="gallery-item position-relative"
                                                                    draggable
                                                                    onDragStart={(
                                                                        e,
                                                                    ) =>
                                                                        handleDragStart(
                                                                            e,
                                                                            originalIndex,
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
                                                                            originalIndex,
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
                                                                            originalIndex
                                                                                ? "scale(1.05)"
                                                                                : "scale(1)",
                                                                        opacity:
                                                                            draggedIndex ===
                                                                            originalIndex
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
                                                                            image.url
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
                                                                                        originalIndex,
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
                                                        })}

                                                    {/* Botón de agregar imagen mejorado */}
                                                    <div
                                                        className="gallery-add-button d-flex flex-column align-items-center justify-content-center"
                                                        style={{
                                                            aspectRatio: "1",
                                                            border: "3px dashed #71b6f9",
                                                            borderRadius:
                                                                "12px",
                                                            backgroundColor:
                                                                "rgba(13, 110, 253, 0.05)",
                                                            cursor: "pointer",
                                                            transition:
                                                                "all 0.3s ease",
                                                            minHeight: "120px",
                                                        }}
                                                        onClick={() =>
                                                            galleryRef.current.click()
                                                        }
                                                        onDrop={handleDrop}
                                                        onDragOver={
                                                            handleDragOver
                                                        }
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor =
                                                                "rgba(13, 110, 253, 0.1)";
                                                            e.currentTarget.style.borderColor =
                                                                "#0056b3";
                                                            e.currentTarget.style.transform =
                                                                "scale(1.02)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor =
                                                                "rgba(13, 110, 253, 0.05)";
                                                            e.currentTarget.style.borderColor =
                                                                "#0d6efd";
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
                                                                Agregar Imagen
                                                            </p>
                                                            <small
                                                                className="text-muted"
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                }}
                                                            >
                                                                Arrastra o haz
                                                                clic (Máx 10MB)
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mensaje cuando no hay imágenes */}
                                                {gallery.filter(
                                                    (img) => !img.toDelete,
                                                ).length === 0 && (
                                                    <div className="text-center py-4 text-muted">
                                                        <i className="fas fa-images fa-3x mb-3 opacity-50"></i>
                                                        <p className="mb-1">
                                                            No hay imágenes en
                                                            la galería
                                                        </p>
                                                        <small>
                                                            Arrastra archivos
                                                            aquí o haz clic en
                                                            "Agregar Imagen"
                                                        </small>
                                                    </div>
                                                )}
                                            </div>

                                            {/* PDFs múltiples con ordenamiento */}
                                            <div
                                                className="mb-4"
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "pdf",
                                                    )
                                                }
                                            >
                                                <label className="form-label fw-semibold text-dark mb-3">
                                                    <i className="fas fa-file-pdf me-2 text-danger"></i>
                                                    Archivos PDF (Manuales /
                                                    Catálogos)
                                                    {pdfs.filter(
                                                        (pdf) => !pdf.toDelete,
                                                    ).length > 0 && (
                                                        <span className="badge bg-danger ms-2">
                                                            {
                                                                pdfs.filter(
                                                                    (pdf) =>
                                                                        !pdf.toDelete,
                                                                ).length
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
                                                    onChange={handlePdfChange}
                                                />

                                                {/* Lista de PDFs con drag & drop */}
                                                <div className="list-group mb-3">
                                                    {pdfs
                                                        .filter(
                                                            (pdf) =>
                                                                !pdf.toDelete,
                                                        )
                                                        .map((pdf, index) => {
                                                            const originalIndex =
                                                                pdfs.findIndex(
                                                                    (p) =>
                                                                        p ===
                                                                        pdf,
                                                                );
                                                            return (
                                                                <div
                                                                    key={
                                                                        originalIndex
                                                                    }
                                                                    draggable
                                                                    onDragStart={(
                                                                        e,
                                                                    ) =>
                                                                        handlePdfDragStart(
                                                                            e,
                                                                            originalIndex,
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
                                                                            originalIndex,
                                                                        )
                                                                    }
                                                                    className="list-group-item d-flex align-items-center justify-content-between"
                                                                    style={{
                                                                        cursor: "grab",
                                                                        opacity:
                                                                            draggedPdfIndex ===
                                                                            originalIndex
                                                                                ? 0.5
                                                                                : 1,
                                                                        backgroundColor:
                                                                            draggedPdfIndex ===
                                                                            originalIndex
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
                                                                        {!pdf.file && (
                                                                            <a
                                                                                href={
                                                                                    pdf.url
                                                                                }
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
                                                                                    originalIndex,
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fas fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
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

                                            {/* Videos múltiples con ordenamiento */}
                                            <div
                                                className="mb-3"
                                                hidden={
                                                    !Fillable.has(
                                                        "items",
                                                        "linkvideo",
                                                    )
                                                }
                                            >
                                                <label className="form-label fw-semibold text-dark mb-3">
                                                    <i className="fas fa-video me-2 text-success"></i>
                                                    Links de Videos
                                                    {videos.filter(
                                                        (video) =>
                                                            !video.toDelete,
                                                    ).length > 0 && (
                                                        <span className="badge bg-success ms-2">
                                                            {
                                                                videos.filter(
                                                                    (video) =>
                                                                        !video.toDelete,
                                                                ).length
                                                            }
                                                        </span>
                                                    )}
                                                </label>

                                                {/* Lista de videos con drag & drop */}
                                                <div className="list-group mb-3">
                                                    {videos
                                                        .filter(
                                                            (video) =>
                                                                !video.toDelete,
                                                        )
                                                        .map((video, index) => {
                                                            const originalIndex =
                                                                videos.findIndex(
                                                                    (v) =>
                                                                        v ===
                                                                        video,
                                                                );
                                                            return (
                                                                <div
                                                                    key={
                                                                        originalIndex
                                                                    }
                                                                    draggable
                                                                    onDragStart={(
                                                                        e,
                                                                    ) =>
                                                                        handleVideoDragStart(
                                                                            e,
                                                                            originalIndex,
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
                                                                            originalIndex,
                                                                        )
                                                                    }
                                                                    className="list-group-item d-flex align-items-center justify-content-between"
                                                                    style={{
                                                                        cursor: "grab",
                                                                        opacity:
                                                                            draggedVideoIndex ===
                                                                            originalIndex
                                                                                ? 0.5
                                                                                : 1,
                                                                        backgroundColor:
                                                                            draggedVideoIndex ===
                                                                            originalIndex
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
                                                                                    originalIndex,
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fas fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                {/* Formulario para agregar nuevo video */}
                                                <div className="input-group">
                                                    <input
                                                        ref={videoUrlRef}
                                                        type="url"
                                                        className="form-control"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={addVideo}
                                                    >
                                                        <i className="fas fa-plus me-2"></i>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                {Fillable.has("items", "is_features") && (
                                    <div
                                        className={`${Fillable.has("items", "is_specifications") ? "col-md-6" : "col-12"}`}
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-list-ul me-2"></i>
                                                    Características
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <DynamicField
                                                    ref={featuresRef}
                                                    label="Lista de Características"
                                                    structure=""
                                                    value={features}
                                                    onChange={setFeatures}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {Fillable.has("items", "is_specifications") && (
                                    <div
                                        className={`${Fillable.has("items", "is_features") ? "col-md-6" : "col-12"}`}
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-cogs me-2"></i>
                                                    Especificaciones
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <DynamicField
                                                    ref={specificationsRef}
                                                    label="Especificaciones Técnicas"
                                                    structure={{
                                                        type: "",
                                                        title: "",
                                                        description: "",
                                                    }}
                                                    value={specifications}
                                                    onChange={setSpecifications}
                                                    typeOptions={typeOptions}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {Fillable.has("items", "is_amenities") && (
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-light">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-star-circle me-2 text-warning"></i>
                                                    Cualidades
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <SelectAPIFormGroup
                                                    eRef={amenitiesRef}
                                                    searchAPI="/api/admin/amenities/paginate"
                                                    searchBy="name"
                                                    label="Seleccionar Cualidades"
                                                    dropdownParent="#principal-container"
                                                    multiple
                                                />
                                                <small className="text-muted">
                                                    <i className="fas fa-info-circle me-1"></i>
                                                    Selecciona las cualidades o
                                                    atributos que destacan este
                                                    producto
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Selector de Aplicaciones */}
                                {Fillable.has("items", "is_applications") && (
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-th-large me-2 text-info"></i>
                                                    Aplicaciones / Usos
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <SelectFormGroup
                                                    eRef={applicationsRef}
                                                    label="Seleccionar Aplicaciones"
                                                    dropdownParent="#principal-container"
                                                    multiple
                                                >
                                                    {applications.map(
                                                        (application) => (
                                                            <option
                                                                key={
                                                                    application.id
                                                                }
                                                                value={
                                                                    application.id
                                                                }
                                                                data-image={
                                                                    application.image
                                                                }
                                                                data-icon={
                                                                    application.icon
                                                                }
                                                            >
                                                                {
                                                                    application.name
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </SelectFormGroup>
                                                <small className="text-muted">
                                                    <i className="fas fa-info-circle me-1"></i>
                                                    Selecciona las industrias o
                                                    usos donde se aplica este
                                                    producto
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Sección de Atributos Dinámicos */}
                                {Fillable.has("items", "is_attributes") &&
                                    availableAttributes.length > 0 && (
                                        <div className="col-12">
                                            <div className="card border-0 shadow-sm overflow-hidden">
                                                <div className="card-header bg-gradient">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className=""
                                                                style={{
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                <i className="fas fa-sliders-h text-primarye"></i>
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-0  fw-bold">
                                                                    Atributos
                                                                    Técnicos
                                                                </h6>
                                                                <small className="">
                                                                    Especificaciones
                                                                    del producto
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            {itemAttributes.length >
                                                                0 && (
                                                                <span
                                                                    className="badge bg-white text-primary fw-bold px-3 py-2"
                                                                    style={{
                                                                        fontSize:
                                                                            "0.85rem",
                                                                    }}
                                                                >
                                                                    {
                                                                        itemAttributes.length
                                                                    }{" "}
                                                                    {itemAttributes.length ===
                                                                    1
                                                                        ? "atributo"
                                                                        : "atributos"}
                                                                </span>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className="btn btn-light btn-sm fw-semibold d-flex align-items-center gap-2"
                                                                onClick={() => {
                                                                    setItemAttributes(
                                                                        [
                                                                            ...itemAttributes,
                                                                            {
                                                                                attribute_id:
                                                                                    "",
                                                                                value: "",
                                                                                attribute:
                                                                                    null,
                                                                            },
                                                                        ],
                                                                    );
                                                                }}
                                                                style={{
                                                                    borderRadius:
                                                                        "20px",
                                                                    padding:
                                                                        "8px 16px",
                                                                }}
                                                            >
                                                                <i className="fas fa-plus"></i>
                                                                <span>
                                                                    Agregar
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="card-body p-4"
                                                    style={{
                                                        backgroundColor:
                                                            "#f8f9ff",
                                                    }}
                                                >
                                                    {itemAttributes.length ===
                                                    0 ? (
                                                        <div className="text-center py-5">
                                                            <div className="mb-4">
                                                                <div
                                                                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: "80px",
                                                                        height: "80px",
                                                                        background:
                                                                            "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                                                                        border: "2px dashed #667eea50",
                                                                    }}
                                                                >
                                                                    <i
                                                                        className="fas fa-layer-group fa-2x"
                                                                        style={{
                                                                            color: "#667eea",
                                                                        }}
                                                                    ></i>
                                                                </div>
                                                            </div>
                                                            <h6 className="text-muted mb-2">
                                                                Sin atributos
                                                                configurados
                                                            </h6>
                                                            <p
                                                                className="text-muted small mb-4"
                                                                style={{
                                                                    maxWidth:
                                                                        "300px",
                                                                    margin: "0 auto",
                                                                }}
                                                            >
                                                                Agrega atributos
                                                                técnicos como
                                                                dimensiones,
                                                                peso, material y
                                                                más para
                                                                detallar tu
                                                                producto.
                                                            </p>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary btn-sm px-4"
                                                                onClick={() => {
                                                                    setItemAttributes(
                                                                        [
                                                                            ...itemAttributes,
                                                                            {
                                                                                attribute_id:
                                                                                    "",
                                                                                value: "",
                                                                                attribute:
                                                                                    null,
                                                                            },
                                                                        ],
                                                                    );
                                                                }}
                                                                style={{
                                                                    borderRadius:
                                                                        "20px",
                                                                }}
                                                            >
                                                                <i className="fas fa-plus me-2"></i>
                                                                Agregar primer
                                                                atributo
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="attributes-list">
                                                            {itemAttributes.map(
                                                                (
                                                                    attr,
                                                                    index,
                                                                ) => {
                                                                    const selectedAttr =
                                                                        availableAttributes.find(
                                                                            (
                                                                                a,
                                                                            ) =>
                                                                                a.id ===
                                                                                attr.attribute_id,
                                                                        );
                                                                    const typeIcons =
                                                                        {
                                                                            text: "fa-font",
                                                                            number: "fa-hashtag",
                                                                            select: "fa-list-ul",
                                                                            color: "fa-palette",
                                                                        };
                                                                    const typeColors =
                                                                        {
                                                                            text: "#3b82f6",
                                                                            number: "#10b981",
                                                                            select: "#f59e0b",
                                                                            color: "#ec4899",
                                                                        };
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="attribute-item mb-3 p-3 bg-white rounded-3 border"
                                                                            style={{
                                                                                borderColor:
                                                                                    selectedAttr
                                                                                        ? typeColors[
                                                                                              selectedAttr
                                                                                                  .type
                                                                                          ] +
                                                                                          "40"
                                                                                        : "#e5e7eb",
                                                                                borderLeftWidth:
                                                                                    "4px",
                                                                                borderLeftColor:
                                                                                    selectedAttr
                                                                                        ? typeColors[
                                                                                              selectedAttr
                                                                                                  .type
                                                                                          ]
                                                                                        : "#e5e7eb",
                                                                                transition:
                                                                                    "all 0.2s ease",
                                                                                boxShadow:
                                                                                    "0 1px 3px rgba(0,0,0,0.05)",
                                                                            }}
                                                                        >
                                                                            <div className="row g-3 align-items-center">
                                                                                {/* Número de orden */}
                                                                                <div className="col-auto">
                                                                                    <div
                                                                                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                                                        style={{
                                                                                            width: "32px",
                                                                                            height: "32px",
                                                                                            backgroundColor:
                                                                                                selectedAttr
                                                                                                    ? typeColors[
                                                                                                          selectedAttr
                                                                                                              .type
                                                                                                      ] +
                                                                                                      "15"
                                                                                                    : "#f3f4f6",
                                                                                            color: selectedAttr
                                                                                                ? typeColors[
                                                                                                      selectedAttr
                                                                                                          .type
                                                                                                  ]
                                                                                                : "#9ca3af",
                                                                                            fontSize:
                                                                                                "0.85rem",
                                                                                        }}
                                                                                    >
                                                                                        {index +
                                                                                            1}
                                                                                    </div>
                                                                                </div>

                                                                                {/* Selector de atributo */}
                                                                                <div className="col-md-4">
                                                                                    <label className="form-label small text-muted mb-1 d-flex align-items-center gap-2">
                                                                                        <i
                                                                                            className="fas fa-tag"
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    "0.7rem",
                                                                                            }}
                                                                                        ></i>
                                                                                        Atributo
                                                                                    </label>
                                                                                    <select
                                                                                        className="form-select"
                                                                                        value={
                                                                                            attr.attribute_id
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            const newAttrs =
                                                                                                [
                                                                                                    ...itemAttributes,
                                                                                                ];
                                                                                            const foundAttr =
                                                                                                availableAttributes.find(
                                                                                                    (
                                                                                                        a,
                                                                                                    ) =>
                                                                                                        a.id ===
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                );
                                                                                            newAttrs[
                                                                                                index
                                                                                            ] =
                                                                                                {
                                                                                                    ...newAttrs[
                                                                                                        index
                                                                                                    ],
                                                                                                    attribute_id:
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    attribute:
                                                                                                        foundAttr,
                                                                                                    value: "",
                                                                                                };
                                                                                            setItemAttributes(
                                                                                                newAttrs,
                                                                                            );
                                                                                        }}
                                                                                        style={{
                                                                                            borderRadius:
                                                                                                "8px",
                                                                                        }}
                                                                                    >
                                                                                        <option value="">
                                                                                            Seleccionar...
                                                                                        </option>
                                                                                        {availableAttributes
                                                                                            .filter(
                                                                                                (
                                                                                                    a,
                                                                                                ) =>
                                                                                                    !itemAttributes.some(
                                                                                                        (
                                                                                                            ia,
                                                                                                            i,
                                                                                                        ) =>
                                                                                                            i !==
                                                                                                                index &&
                                                                                                            ia.attribute_id ===
                                                                                                                a.id,
                                                                                                    ),
                                                                                            )
                                                                                            .map(
                                                                                                (
                                                                                                    a,
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            a.id
                                                                                                        }
                                                                                                        value={
                                                                                                            a.id
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            a.name
                                                                                                        }
                                                                                                    </option>
                                                                                                ),
                                                                                            )}
                                                                                    </select>
                                                                                </div>

                                                                                {/* Input de valor */}
                                                                                <div className="col">
                                                                                    <label className="form-label small text-muted mb-1 d-flex align-items-center gap-2">
                                                                                        {selectedAttr && (
                                                                                            <i
                                                                                                className={`fas ${typeIcons[selectedAttr.type]}`}
                                                                                                style={{
                                                                                                    fontSize:
                                                                                                        "0.7rem",
                                                                                                    color: typeColors[
                                                                                                        selectedAttr
                                                                                                            .type
                                                                                                    ],
                                                                                                }}
                                                                                            ></i>
                                                                                        )}
                                                                                        Valor
                                                                                        {selectedAttr?.unit && (
                                                                                            <span
                                                                                                className="badge ms-1"
                                                                                                style={{
                                                                                                    backgroundColor:
                                                                                                        typeColors[
                                                                                                            selectedAttr
                                                                                                                .type
                                                                                                        ] +
                                                                                                        "20",
                                                                                                    color: typeColors[
                                                                                                        selectedAttr
                                                                                                            .type
                                                                                                    ],
                                                                                                    fontSize:
                                                                                                        "0.7rem",
                                                                                                    fontWeight:
                                                                                                        "600",
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    selectedAttr.unit
                                                                                                }
                                                                                            </span>
                                                                                        )}
                                                                                    </label>
                                                                                    {selectedAttr?.type ===
                                                                                        "select" &&
                                                                                    selectedAttr?.options ? (
                                                                                        <select
                                                                                            className="form-select"
                                                                                            value={
                                                                                                attr.value
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) => {
                                                                                                const newAttrs =
                                                                                                    [
                                                                                                        ...itemAttributes,
                                                                                                    ];
                                                                                                newAttrs[
                                                                                                    index
                                                                                                ].value =
                                                                                                    e.target.value;
                                                                                                setItemAttributes(
                                                                                                    newAttrs,
                                                                                                );
                                                                                            }}
                                                                                            style={{
                                                                                                borderRadius:
                                                                                                    "8px",
                                                                                            }}
                                                                                        >
                                                                                            <option value="">
                                                                                                Seleccionar
                                                                                                opción...
                                                                                            </option>
                                                                                            {selectedAttr.options.map(
                                                                                                (
                                                                                                    opt,
                                                                                                    optIdx,
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            optIdx
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
                                                                                        </select>
                                                                                    ) : selectedAttr?.type ===
                                                                                      "color" ? (
                                                                                        <div className="d-flex gap-2 align-items-center">
                                                                                            <input
                                                                                                type="color"
                                                                                                className="form-control form-control-color p-1"
                                                                                                value={
                                                                                                    attr.value ||
                                                                                                    "#6366f1"
                                                                                                }
                                                                                                onChange={(
                                                                                                    e,
                                                                                                ) => {
                                                                                                    const newAttrs =
                                                                                                        [
                                                                                                            ...itemAttributes,
                                                                                                        ];
                                                                                                    newAttrs[
                                                                                                        index
                                                                                                    ].value =
                                                                                                        e.target.value;
                                                                                                    setItemAttributes(
                                                                                                        newAttrs,
                                                                                                    );
                                                                                                }}
                                                                                                style={{
                                                                                                    width: "50px",
                                                                                                    height: "38px",
                                                                                                    borderRadius:
                                                                                                        "8px",
                                                                                                    cursor: "pointer",
                                                                                                }}
                                                                                            />
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                value={
                                                                                                    attr.value ||
                                                                                                    "#6366f1"
                                                                                                }
                                                                                                onChange={(
                                                                                                    e,
                                                                                                ) => {
                                                                                                    const newAttrs =
                                                                                                        [
                                                                                                            ...itemAttributes,
                                                                                                        ];
                                                                                                    newAttrs[
                                                                                                        index
                                                                                                    ].value =
                                                                                                        e.target.value;
                                                                                                    setItemAttributes(
                                                                                                        newAttrs,
                                                                                                    );
                                                                                                }}
                                                                                                placeholder="#000000"
                                                                                                style={{
                                                                                                    borderRadius:
                                                                                                        "8px",
                                                                                                    fontFamily:
                                                                                                        "monospace",
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <input
                                                                                            type={
                                                                                                selectedAttr?.type ===
                                                                                                "number"
                                                                                                    ? "number"
                                                                                                    : "text"
                                                                                            }
                                                                                            className="form-control"
                                                                                            placeholder={
                                                                                                selectedAttr
                                                                                                    ? `Ingresa ${selectedAttr.name.toLowerCase()}${selectedAttr?.unit ? ` en ${selectedAttr.unit}` : ""}`
                                                                                                    : "Selecciona un atributo primero"
                                                                                            }
                                                                                            value={
                                                                                                attr.value
                                                                                            }
                                                                                            disabled={
                                                                                                !selectedAttr
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) => {
                                                                                                const newAttrs =
                                                                                                    [
                                                                                                        ...itemAttributes,
                                                                                                    ];
                                                                                                newAttrs[
                                                                                                    index
                                                                                                ].value =
                                                                                                    e.target.value;
                                                                                                setItemAttributes(
                                                                                                    newAttrs,
                                                                                                );
                                                                                            }}
                                                                                            style={{
                                                                                                borderRadius:
                                                                                                    "8px",
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </div>

                                                                                {/* Botón eliminar */}
                                                                                <div className="col-auto">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                                                                                        onClick={() => {
                                                                                            setItemAttributes(
                                                                                                itemAttributes.filter(
                                                                                                    (
                                                                                                        _,
                                                                                                        i,
                                                                                                    ) =>
                                                                                                        i !==
                                                                                                        index,
                                                                                                ),
                                                                                            );
                                                                                        }}
                                                                                        title="Eliminar atributo"
                                                                                        style={{
                                                                                            width: "38px",
                                                                                            height: "38px",
                                                                                            borderRadius:
                                                                                                "8px",
                                                                                            marginTop:
                                                                                                "24px",
                                                                                        }}
                                                                                    >
                                                                                        <i className="fas fa-trash-alt"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}

                                                            {/* Botón agregar más al final */}
                                                            <div
                                                                className="add-more-btn text-center py-3 rounded-3 mt-2"
                                                                style={{
                                                                    border: "2px dashed #667eea50",
                                                                    backgroundColor:
                                                                        "#667eea08",
                                                                    cursor: "pointer",
                                                                    transition:
                                                                        "all 0.2s ease",
                                                                }}
                                                                onClick={() => {
                                                                    setItemAttributes(
                                                                        [
                                                                            ...itemAttributes,
                                                                            {
                                                                                attribute_id:
                                                                                    "",
                                                                                value: "",
                                                                                attribute:
                                                                                    null,
                                                                            },
                                                                        ],
                                                                    );
                                                                }}
                                                                onMouseEnter={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "#667eea15";
                                                                    e.currentTarget.style.borderColor =
                                                                        "#667eea";
                                                                }}
                                                                onMouseLeave={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "#667eea08";
                                                                    e.currentTarget.style.borderColor =
                                                                        "#667eea50";
                                                                }}
                                                            >
                                                                <i
                                                                    className="fas fa-plus me-2"
                                                                    style={{
                                                                        color: "#667eea",
                                                                    }}
                                                                ></i>
                                                                <span
                                                                    style={{
                                                                        color: "#667eea",
                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >
                                                                    Agregar otro
                                                                    atributo
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal modalRef={modalImportRef} title={"Importar Datos"} size="lg">
                <ModalImportItem
                    gridRef={gridRef}
                    modalRef={modalImportRef}
                    excelTemplate={
                        Array.isArray(generals)
                            ? generals.find(
                                  (g) =>
                                      g.correlative === "excel_import_template",
                              )?.description
                            : null
                    }
                />
            </Modal>

            {/* Modal para Gestionar Variantes de un Master */}
            {showVariantsManager && (
                <ItemVariantsManager
                    isOpen={showVariantsManager}
                    onClose={() => setShowVariantsManager(false)}
                    item={masterItemForVariants}
                    gridRef={gridRef}
                    onRefreshGrid={refreshGrid}
                />
            )}
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Items">
            <Items {...properties} />
        </BaseAdminto>,
    );
});
