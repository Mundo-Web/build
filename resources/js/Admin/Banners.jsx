import BaseAdminto from "@Adminto/Base";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, {
    Suspense,
    lazy,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import BannersRest from "../Actions/Admin/BannersRest";
import SystemRest from "../Actions/Admin/SystemRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SortByAfterField from "../Utils/SortByAfterField";
import { resolveSystemAsset } from "../Components/Tailwind/Banners/bannerUtils";

const bannersRest = new BannersRest();
const systemRest = new SystemRest();

const PREVIEW_VIEWPORT_WIDTH = 1600;
const PREVIEW_VIEWPORT_HEIGHT = 900;
const PREVIEW_MIN_HEIGHT = 360;
const PREVIEW_MAX_HEIGHT = 900;
const SCALE_EPSILON = 0.001;
const HEIGHT_EPSILON = 0.5;

const TailwindBanner = lazy(() => import("../Components/Tailwind/Banner"));

const getDefaultPreviewData = () => ({
    name: "",
    description: "",
    button_text: "",
    button_link: "",
    contenedor: "relativo",
    type: "BannerSimple",
    background: "",
    image: "",
    items: [],
});

const buildPreviewData = (data = {}) => {
    const defaults = getDefaultPreviewData();
    return {
        ...data,
        name: data?.name ?? defaults.name,
        description: data?.description ?? defaults.description,
        button_text: data?.button_text ?? defaults.button_text,
        button_link: data?.button_link ?? defaults.button_link,
        contenedor: data?.contenedor ?? defaults.contenedor,
        type: data?.type || defaults.type,
        background: data?.background ?? defaults.background,
        image: data?.image ?? defaults.image,
        items: Array.isArray(data?.items) ? data.items : defaults.items,
    };
};

const Banners = ({ pages, systems: systemsFromProps = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const backgroundRef = useRef();
    const imageRef = useRef();
    const buttonTextRef = useRef();
    const buttonLinkRef = useRef();
    const absoluteRef = useRef();
    const pageIdRef = useRef();
    const afterComponentRef = useRef();
    const bannerTypeRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [systems, setSystems] = useState(systemsFromProps);
    const [availableComponents, setAvailableComponents] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState("");
    const [editingSnapshot, setEditingSnapshot] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [previewData, setPreviewData] = useState(() => getDefaultPreviewData());
    const objectUrlRef = useRef({ background: null, image: null });
    const previewStageRef = useRef(null);
    const previewContentRef = useRef(null);
    const previewIframeRef = useRef(null);
    const iframeRootRef = useRef(null);
    const iframeDocRef = useRef(null);
    const previewScaleRef = useRef(1);
    const [previewScale, setPreviewScale] = useState(1);
    const [previewHeight, setPreviewHeight] = useState(PREVIEW_MIN_HEIGHT);
    const [isIframeReady, setIsIframeReady] = useState(false);
    const previewType = previewData.type || "BannerSimple";

    const updatePreviewScale = useCallback(() => {
        const stage = previewStageRef.current;
        const iframe = previewIframeRef.current;
        const content = previewContentRef.current;
        const doc = iframeDocRef.current;

        if (!stage || !iframe || !content || !doc) return;

        const stageWidth = stage.clientWidth || PREVIEW_VIEWPORT_WIDTH;
        const docElement = doc.documentElement;

        const contentWidth = Math.max(
            PREVIEW_VIEWPORT_WIDTH,
            content.scrollWidth || 0,
            content.offsetWidth || 0,
            docElement?.scrollWidth || 0,
            doc.body?.scrollWidth || 0
        );

        const contentHeight = Math.max(
            PREVIEW_VIEWPORT_HEIGHT,
            content.scrollHeight || 0,
            content.offsetHeight || 0,
            docElement?.scrollHeight || 0,
            doc.body?.scrollHeight || 0
        );

        const widthScale = stageWidth / contentWidth;
        const heightScale = PREVIEW_MAX_HEIGHT / contentHeight;
        const safeScale = Math.min(widthScale, heightScale, 1);

        const scaledHeight = contentHeight * safeScale;
        const desiredHeight = Math.max(
            Math.min(scaledHeight, PREVIEW_MAX_HEIGHT),
            PREVIEW_MIN_HEIGHT
        );

        if (Math.abs(previewScaleRef.current - safeScale) > SCALE_EPSILON) {
            previewScaleRef.current = safeScale;
            setPreviewScale(safeScale);
        } else {
            previewScaleRef.current = safeScale;
        }

        setPreviewHeight((prev) =>
            Math.abs(prev - desiredHeight) < HEIGHT_EPSILON ? prev : desiredHeight
        );

        iframe.style.height = `${contentHeight}px`;
    }, []);

    const getTailwindHrefCandidates = useCallback(() => {
        const urls = ["/build/app.css"];
        if (typeof document !== "undefined") {
            const viteClient = document.querySelector("script[src*='@vite/client']");
            if (viteClient?.src) {
                const baseUrl = viteClient.src.replace(/@vite\/client.*$/, "");
                urls.push(`${baseUrl}resources/css/app.css`);
            }
        }
        return urls;
    }, []);

    const injectTailwindIntoDocument = useCallback(
        (doc) => {
            if (!doc) return;
            const head = doc.head || doc.getElementsByTagName("head")[0];
            if (!head) return;

            const marker = head.querySelector("link[data-banner-preview='tailwind']");
            if (marker) return;

            const candidates = getTailwindHrefCandidates();

            const tryInject = (urls) => {
                const [current, ...rest] = urls;
                if (!current) {
                    console.warn("[Banners] No se pudo cargar los estilos Tailwind para la vista previa del banner.");
                    return;
                }

                const link = doc.createElement("link");
                link.rel = "stylesheet";
                link.href = current;
                link.dataset.bannerPreview = "tailwind";
                link.onload = () => {
                    requestAnimationFrame(() => updatePreviewScale());
                };
                link.onerror = () => {
                    link.remove();
                    tryInject(rest);
                };
                head.appendChild(link);
            };

            tryInject(candidates);
        },
        [getTailwindHrefCandidates, updatePreviewScale]
    );

    const initializeIframeDocument = useCallback(() => {
        const iframe = previewIframeRef.current;
        if (!iframe) return;

        setIsIframeReady(false);

        if (iframeRootRef.current) {
            try {
                iframeRootRef.current.unmount();
            } catch (error) {
                console.error("[Banners] Error unmounting previous iframe root", error);
            }
            iframeRootRef.current = null;
        }

        const doc = iframe.contentDocument;
        if (!doc) {
            setTimeout(() => initializeIframeDocument(), 0);
            return;
        }

        doc.open();
        doc.write("<!DOCTYPE html><html><head><base target='_blank' /></head><body></body></html>");
        doc.close();

        doc.documentElement.style.fontSize = "16px";
        doc.documentElement.style.background = "transparent";
        doc.body.style.margin = "0";
        doc.body.style.padding = "0";
        doc.body.style.background = "transparent";

        // Inyectar estilos de Tailwind
        injectTailwindIntoDocument(doc);

        // CRÍTICO: Copiar scripts de Vite/esbuild al iframe para que los lazy components funcionen
        const parentScripts = document.querySelectorAll('script[type="module"]');
        parentScripts.forEach(script => {
            if (script.src && (script.src.includes('@vite/client') || script.src.includes('app.js'))) {
                const iframeScript = doc.createElement('script');
                iframeScript.type = 'module';
                iframeScript.src = script.src;
                doc.head.appendChild(iframeScript);
            }
        });

        const rootContainer = doc.createElement("div");
        rootContainer.id = "banner-preview-root";
        rootContainer.style.width = `${PREVIEW_VIEWPORT_WIDTH}px`;
        rootContainer.style.minHeight = `${PREVIEW_VIEWPORT_HEIGHT}px`;
        rootContainer.style.boxSizing = "border-box";
        rootContainer.style.margin = "0 auto";

        doc.body.appendChild(rootContainer);

        iframeDocRef.current = doc;
        previewContentRef.current = rootContainer;
        iframeRootRef.current = createRoot(rootContainer);
        previewScaleRef.current = 1;
        setPreviewScale(1);
        setPreviewHeight(PREVIEW_MIN_HEIGHT);
        setIsIframeReady(true);
    }, [injectTailwindIntoDocument]);

    const renderPreviewIntoIframe = useCallback(() => {
        const root = iframeRootRef.current;
        const doc = iframeDocRef.current;
        if (!root || !doc) return;

        root.render(
            <div style={{ minHeight: `${PREVIEW_VIEWPORT_HEIGHT}px` }}>
                <Suspense
                    fallback={
                        <div
                            className="d-flex align-items-center justify-content-center text-muted small"
                            style={{ minHeight: `${PREVIEW_VIEWPORT_HEIGHT}px` }}
                        >
                            Cargando vista previa...
                        </div>
                    }
                >
                    <TailwindBanner
                        key={previewType}
                        which={previewType}
                        data={previewData}
                        items={previewData.items || []}
                    />
                </Suspense>
            </div>
        );
    }, [previewData, previewType]);

    useEffect(() => {
        if (!isIframeReady) return;
        renderPreviewIntoIframe();
        const raf = requestAnimationFrame(updatePreviewScale);
        return () => cancelAnimationFrame(raf);
    }, [isIframeReady, renderPreviewIntoIframe, updatePreviewScale]);

    useEffect(() => {
        return () => {
            if (iframeRootRef.current) {
                iframeRootRef.current.unmount();
            }
            iframeRootRef.current = null;
            iframeDocRef.current = null;
            previewContentRef.current = null;
        };
    }, []);

    const releaseObjectUrls = useCallback(() => {
        Object.entries(objectUrlRef.current).forEach(([, url]) => {
            if (
                url &&
                typeof url === "string" &&
                url.startsWith("blob:") &&
                typeof URL !== "undefined" &&
                typeof URL.revokeObjectURL === "function"
            ) {
                URL.revokeObjectURL(url);
            }
        });
        objectUrlRef.current = { background: null, image: null };
    }, []);

    const resetPreviewData = useCallback(
        (data = {}) => {
            releaseObjectUrls();
            setPreviewData(buildPreviewData(data));
        },
        [releaseObjectUrls]
    );

    const handlePreviewFieldChange = useCallback((field, value) => {
        setPreviewData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleImageChange = useCallback(
        (field) => (event) => {
            const file = event?.target?.files?.[0];
            const previousUrl = objectUrlRef.current[field];

            if (file) {
                const createUrl = (() => {
                    if (typeof window !== "undefined" && window.File && typeof window.File.toURL === "function") {
                        return window.File.toURL;
                    }
                    if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
                        return (blob) => URL.createObjectURL(blob);
                    }
                    return null;
                })();

                if (!createUrl) {
                    objectUrlRef.current[field] = null;
                    setPreviewData((prev) => ({ ...prev, [field]: "" }));
                    return;
                }

                const nextUrl = createUrl(file);

                if (
                    previousUrl &&
                    previousUrl.startsWith("blob:") &&
                    typeof URL !== "undefined" &&
                    typeof URL.revokeObjectURL === "function"
                ) {
                    URL.revokeObjectURL(previousUrl);
                }

                objectUrlRef.current[field] = nextUrl;
                // Actualizar inmediatamente el preview con la nueva imagen
                setPreviewData((prev) => ({ ...prev, [field]: nextUrl }));

                // Forzar actualización del preview después de un momento para que el componente se re-renderice
                requestAnimationFrame(() => {
                    updatePreviewScale();
                });
                return;
            }

            if (
                previousUrl &&
                previousUrl.startsWith("blob:") &&
                typeof URL !== "undefined" &&
                typeof URL.revokeObjectURL === "function"
            ) {
                URL.revokeObjectURL(previousUrl);
            }

            objectUrlRef.current[field] = null;
            setPreviewData((prev) => ({ ...prev, [field]: "" }));
        },
        [updatePreviewScale]
    );

    const onBannerTypeChange = useCallback(
        (event) => {
            const element = event?.target ?? bannerTypeRef.current;
            if (!element) return;

            const rawValue = $(element).val();
            const normalized = Array.isArray(rawValue) ? rawValue[0] : rawValue;
            const finalValue = normalized || "BannerSimple";

            // Actualizar el estado de preview data inmediatamente
            handlePreviewFieldChange("type", finalValue);
        },
        [handlePreviewFieldChange]
    );

    const handleAbsoluteChange = useCallback(
        (event) => {
            handlePreviewFieldChange("contenedor", event.target.checked ? "absoluto" : "relativo");
        },
        [handlePreviewFieldChange]
    );

    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const $modal = $(modalElement);
        const handleHidden = () => {
            releaseObjectUrls();
            setPreviewData(getDefaultPreviewData());
            setEditingSnapshot(null);
            setIsEditing(false);
            if (iframeRootRef.current) {
                try {
                    iframeRootRef.current.unmount();
                } catch (error) {
                    console.error("[Banners] Error unmounting iframe root on modal hide", error);
                }
                iframeRootRef.current = null;
            }
            iframeDocRef.current = null;
            previewContentRef.current = null;
            previewScaleRef.current = 1;
            setPreviewScale(1);
            setPreviewHeight(PREVIEW_MIN_HEIGHT);
            setIsIframeReady(false);
        };

        $modal.on("hidden.bs.modal", handleHidden);

        return () => {
            $modal.off("hidden.bs.modal", handleHidden);
        };
    }, [releaseObjectUrls]);

    useEffect(() => () => releaseObjectUrls(), [releaseObjectUrls]);

    useEffect(() => {
        const raf = requestAnimationFrame(updatePreviewScale);
        return () => cancelAnimationFrame(raf);
    }, [previewType, previewData, updatePreviewScale]);

    useEffect(() => {
        const handleResize = () => updatePreviewScale();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [updatePreviewScale]);

    useEffect(() => {
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(() => updatePreviewScale());
        if (previewStageRef.current) observer.observe(previewStageRef.current);
        if (previewContentRef.current) observer.observe(previewContentRef.current);
        return () => observer.disconnect();
    }, [updatePreviewScale, isIframeReady]);

    const refreshGrid = () => {
        if (!gridRef.current) return;
        const grid = $(gridRef.current);
        if (typeof grid.dxDataGrid !== 'function') return;
        const instance = grid.dxDataGrid('instance');
        instance?.refresh();
    };

    // Tipos de banners disponibles - basados en components.json
    const bannerTypes = [
        { id: 'BannerSimple', name: 'Banner Simple', icon: 'mdi mdi-image-size-select-large' },
        { id: 'BannerAd', name: 'Banner Ad', icon: 'mdi mdi-google-ads' },
        { id: 'BannerFullWidth', name: 'Banner Full Width', icon: 'mdi mdi-view-carousel' },
        { id: 'BannerIbergruas', name: 'Banner Ibergruas', icon: 'mdi mdi-image-size-select-large' },
        { id: 'BannerFlex', name: 'Banner Flex', icon: 'mdi mdi-view-split-vertical' },
        { id: 'BannerPublicitario', name: 'Banner Publicitario', icon: 'mdi mdi-bullhorn' },
        { id: 'BannerPublicitarioPaani', name: 'Banner Publicitario Paani', icon: 'mdi mdi-bullhorn-variant' },
        { id: 'BannerPostSuscriptionPaani', name: 'Banner Post Suscripción Paani', icon: 'mdi mdi-email-newsletter' },
        { id: 'BannerStatic', name: 'Banner Static', icon: 'mdi mdi-image-frame' },
        { id: 'BannerStaticSecond', name: 'Banner Static Second', icon: 'mdi mdi-image-multiple' },
        { id: 'BannerSimpleSF', name: 'Banner Simple SF', icon: 'mdi mdi-image-outline' },
        { id: 'BannerSimpleD2', name: 'Banner Simple D2', icon: 'mdi mdi-image' },
        { id: 'BannerBananaLab', name: 'Banner Banana Lab', icon: 'mdi mdi-fruit-grapes' },
        { id: 'BannerCTAMakita', name: 'Banner CTA Makita', icon: 'mdi mdi-call-to-action' },
        { id: 'BannerContactMakita', name: 'Banner Contact Makita', icon: 'mdi mdi-contact-mail' },
        { id: 'BannerPidelo', name: 'Banner Pidelo', icon: 'mdi mdi-shopping' },
        { id: 'BannerMultivet', name: 'Banner Multivet', icon: 'mdi mdi-medical-bag' },
        { id: 'BannerPublicitarioKatya', name: 'Banner Publicitario Katya', icon: 'mdi mdi-account-star' },
        { id: 'BannerBlogSectionKatya', name: 'Banner Blog Section Katya', icon: 'mdi mdi-post' },
        { id: 'BannerMobileApp', name: 'Banner Mobile App - FirstClass', icon: 'mdi mdi-cellphone-link' }
    ];

    const normalizePageId = (value) => value === undefined || value === null || value === '' ? null : value;

    // Replica la lógica de System.jsx para recalcular la cadena after_component de una página.
    const computeOrderUpdates = ({ pageId, baseSystems = [], insertedSystem = null }) => {
        const normalizedPageId = normalizePageId(pageId);
        const workingList = SortByAfterField(baseSystems.map(item => ({ ...item })));

        let desiredOrder = workingList;

        if (insertedSystem) {
            const systemClone = { ...insertedSystem, page_id: normalizedPageId };
            const afterId = systemClone.after_component ?? null;
            if (!afterId) {
                desiredOrder = [systemClone, ...desiredOrder];
            } else {
                const index = desiredOrder.findIndex(item => item.id === afterId);
                if (index === -1) {
                    desiredOrder = [...desiredOrder, systemClone];
                } else {
                    desiredOrder = [
                        ...desiredOrder.slice(0, index + 1),
                        systemClone,
                        ...desiredOrder.slice(index + 1)
                    ];
                }
            }
        }

        const updates = {};
        const ordered = desiredOrder.map((item, index) => {
            const expectedAfter = index === 0 ? null : desiredOrder[index - 1].id;
            const normalizedExpected = expectedAfter ?? null;
            const normalizedCurrent = item.after_component ?? null;
            const needsUpdate = normalizedCurrent !== normalizedExpected;

            if (needsUpdate) {
                updates[item.id] = normalizedExpected;
            }

            return {
                ...item,
                page_id: normalizedPageId,
                after_component: normalizedExpected
            };
        });

        return { ordered, updates };
    };

    // EXACTAMENTE como System.jsx - usar los datos que ya tenemos
    const loadPageComponents = (pageId) => {
        // System.jsx línea 263: SortByAfterField(systems).filter(x => x.page_id == null)
        // System.jsx línea 306: SortByAfterField(systems).filter(x => x.page_id == page.id)

        // Filtrar primero y luego ordenar con SortByAfterField como hace System.jsx
        const normalizedPageId = normalizePageId(pageId);
        const filteredSystems = systems.filter(s =>
            normalizePageId(s.page_id) === normalizedPageId
        );

        // ORDENAR igual que System.jsx para que el select muestre en orden correcto
        const orderedComponents = SortByAfterField(filteredSystems);



        setAvailableComponents(orderedComponents);
    };

    useEffect(() => {
        loadPageComponents();
    }, []);

    useEffect(() => {
        loadPageComponents(selectedPageId);
    }, [selectedPageId, systems]); // Agregar systems como dependencia

    const onModalOpen = (banner) => {
        initializeIframeDocument();

        if (banner?.id) {
            setIsEditing(true);
            setEditingSnapshot({
                id: banner.id,
                page_id: normalizePageId(banner.page_id),
                after_component: banner.after_component ?? null
            });
        } else {
            setIsEditing(false);
            setEditingSnapshot(null);
        }

        const bannerData = banner?.data || {};
        const previewSnapshot = buildPreviewData(bannerData);

        // Establecer el estado de previsualización PRIMERO
        resetPreviewData(previewSnapshot);

        idRef.current.value = banner?.id ?? "";
        nameRef.current.value = previewSnapshot.name;
        descriptionRef.current.value = previewSnapshot.description;
        buttonTextRef.current.value = previewSnapshot.button_text;
        buttonLinkRef.current.value = previewSnapshot.button_link;

        const backgroundUrl = resolveSystemAsset(previewSnapshot.background);
        const imageUrl = resolveSystemAsset(previewSnapshot.image);

        if (backgroundRef.image) {
            backgroundRef.image.src = backgroundUrl || '';
        }
        backgroundRef.current.value = null;
        if (imageRef.image) {
            imageRef.image.src = imageUrl || '';
        }
        imageRef.current.value = null;

        // Reset delete flags using the same pattern as Categories.jsx
        if (backgroundRef.resetDeleteFlag) backgroundRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        if (absoluteRef.current) {
            absoluteRef.current.checked = previewSnapshot.contenedor === 'absoluto';
        }

        // Nuevos campos
        $(pageIdRef.current).val(banner?.page_id || '').trigger('change');
        const editingPageId = banner?.page_id || '';
        setSelectedPageId(editingPageId);

        // CRÍTICO: Cargar componentes primero, luego establecer after_component
        loadPageComponents(editingPageId);

        // Esperar un momento para que se carguen los componentes y luego setear el valor
        setTimeout(() => {
            const afterValue = banner?.after_component || '';
            $(afterComponentRef.current).val(afterValue).trigger('change');
        }, 100);

        // Establecer el tipo de banner y disparar el evento para actualizar el preview
        $(bannerTypeRef.current).val(previewSnapshot.type || 'BannerSimple').trigger('change');

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        try {
            const bannerId = idRef.current.value;
            const pageId = $(pageIdRef.current).val();
            const normalizedPageId = normalizePageId(pageId);
            const afterComponent = $(afterComponentRef.current).val() || null;
            // CRÍTICO: Usar el estado previewData.type en lugar de leer del select
            // Esto garantiza que el valor guardado sea el que está en el estado actualizado
            const bannerType = previewData.type || 'BannerSimple';

            const systemData = {
                name: `Banner - ${nameRef.current.value}`,
                component: 'banner',
                value: bannerType,
                page_id: normalizedPageId,
                after_component: afterComponent,
                visible: true
            };

            if (bannerId) {
                systemData.id = bannerId;
            }

            const systemResult = await systemRest.save(systemData);
            if (!systemResult) return;

            const bannerData = {
                name: nameRef.current.value,
                description: descriptionRef.current.value,
                button_text: buttonTextRef.current.value,
                button_link: buttonLinkRef.current.value,
                contenedor: absoluteRef.current?.checked ? 'absoluto' : 'relativo',
                type: bannerType
            };

            const formData = new FormData();
            formData.append('id', systemResult.id);
            Object.entries(bannerData).forEach(([key, value]) => formData.append(key, value));

            const background = backgroundRef.current.files[0];
            if (background) {
                formData.append("background", background);
            }
            const image = imageRef.current.files[0];
            if (image) {
                formData.append("image", image);
            }

            if (backgroundRef.getDeleteFlag && backgroundRef.getDeleteFlag()) {
                formData.append('background_delete', 'DELETE');
            }
            if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
                formData.append('image_delete', 'DELETE');
            }

            const bannerResult = await bannersRest.save(formData);
            if (!bannerResult) return;

            if (backgroundRef.resetDeleteFlag) backgroundRef.resetDeleteFlag();
            if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

            let finalSystem = {
                ...systemResult,
                page_id: normalizedPageId,
                after_component: afterComponent ?? null,
                data: {
                    ...(systemResult.data || {}),
                    ...bannerData
                }
            };

            const previousPageId = normalizePageId(editingSnapshot?.page_id);
            const currentPageId = normalizePageId(finalSystem.page_id);

            const updatesPayload = {};

            if (editingSnapshot?.id && previousPageId !== currentPageId) {
                const oldPageSystems = systems
                    .filter(s => normalizePageId(s.page_id) === previousPageId && s.id !== finalSystem.id)
                    .map(s => ({ ...s }));

                const { updates: oldUpdates } = computeOrderUpdates({
                    pageId: previousPageId,
                    baseSystems: oldPageSystems
                });

                Object.assign(updatesPayload, oldUpdates);
            }

            const newPageSystems = systems
                .filter(s => normalizePageId(s.page_id) === currentPageId && s.id !== finalSystem.id)
                .map(s => ({ ...s }));

            const { ordered: newOrder, updates: newUpdates } = computeOrderUpdates({
                pageId: currentPageId,
                baseSystems: newPageSystems,
                insertedSystem: finalSystem
            });

            Object.assign(updatesPayload, newUpdates);

            const updatedFinalSystem = newOrder.find(item => item.id === finalSystem.id);
            if (updatedFinalSystem) {
                finalSystem = {
                    ...finalSystem,
                    after_component: updatedFinalSystem.after_component ?? null
                };
            }

            if (Object.keys(updatesPayload).length > 0) {
                const orderResult = await systemRest.updateOrder(updatesPayload);
                if (!orderResult) return;
            }

            setSystems(old => {
                const withoutCurrent = old.filter(item => item.id !== finalSystem.id);
                const updated = withoutCurrent.map(item => {
                    if (Object.prototype.hasOwnProperty.call(updatesPayload, item.id)) {
                        return { ...item, after_component: updatesPayload[item.id] ?? null };
                    }
                    return item;
                });

                return [...updated, finalSystem];
            });

            setSelectedPageId(currentPageId ?? '');
            refreshGrid();

            $(modalRef.current).modal("hide");
            setEditingSnapshot(null);
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };



    const onPageChange = (e) => {
        const pageId = $(e.target).val();
        setSelectedPageId(pageId);

        // Clear the after component selection safely
        setTimeout(() => {
            $(afterComponentRef.current).val('').trigger('change');
        }, 100);
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await bannersRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;

        // Actualizar el estado local en lugar de refrescar desde el backend
        setSystems(old => old.map(system =>
            system.id === id ? { ...system, visible: value } : system
        ));
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;

        const result = await bannersRest.delete(id);
        if (!result) return;

        // Actualizar el estado local inmediatamente como en System.jsx
        setSystems(old => old.filter(x => x.id != id));
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Banners"
                rest={bannersRest}
                // USAR EL BACKEND DIRECTAMENTE - SIN SORTING PERSONALIZADO
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
                        widget: 'dxButton',
                        location: 'after',
                        options: {
                            icon: 'plus',
                            text: 'Nuevo banner',
                            hint: 'Nuevo banner',
                            onClick: () => onModalOpen()
                        }
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Información",
                        cellTemplate: (container, { data }) => {
                            const page = pages.find(
                                (x) => x.id == data?.page_id
                            );
                            const bannerType = bannerTypes.find(
                                (type) => type.id === data?.data?.type
                            );
                            container.html(
                                renderToString(
                                    <>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <b className="d-block">{data?.name}</b>
                                                <small className="text-muted d-block">
                                                    Tipo: {bannerType?.name || 'Banner Simple'}
                                                </small>
                                                <small className="text-muted">
                                                    Página: {page?.name || 'Base Template'}
                                                </small>
                                            </div>
                                        </div>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "after_component",
                        caption: "Después de",
                        cellTemplate: (container, { data }) => {
                            if (!data.after_component) {
                                container.text("Al inicio");
                                return;
                            }

                            // Buscar el componente al que hace referencia
                            const afterComponent = systems.find(s => s.id === data.after_component);
                            container.text(afterComponent ? afterComponent.name : "Componente eliminado");
                        },
                    },
                    {
                        dataField: "background",
                        caption: "Fondo",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/system/${data?.data?.background}`}
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
                                />
                            );
                        },
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
                                    src={`/storage/images/system/${data?.data?.image}`}
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
                                />
                            );
                        },
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
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
                                />
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar banner" : "Agregar banner"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />
                <div className="row g-3" id="banner-container">
                    <div className="col-12 col-lg-5 order-1 order-lg-2">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-white border-0 pb-0">
                                <h6 className="mb-1 fw-semibold">Vista previa</h6>
                                <small className="text-muted">
                                    Se actualiza automáticamente con los cambios.
                                </small>
                            </div>
                            <div className="card-body">
                                <div
                                    ref={previewStageRef}
                                    className="banner-preview-stage border rounded bg-light p-3"
                                    style={{
                                        minHeight: PREVIEW_MIN_HEIGHT,
                                        height: previewHeight,
                                        maxHeight: PREVIEW_MAX_HEIGHT,
                                        overflow: "hidden",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                        transition: "height 150ms ease, min-height 150ms ease, max-height 150ms ease",
                                    }}
                                >
                                    <div
                                        className="banner-preview-frame position-relative"
                                        style={{
                                            width: `${PREVIEW_VIEWPORT_WIDTH}px`,
                                            minWidth: `${PREVIEW_VIEWPORT_WIDTH}px`,
                                            maxWidth: `${PREVIEW_VIEWPORT_WIDTH}px`,
                                            transform: `scale(${previewScale})`,
                                            transformOrigin: "top center",
                                            transition: "transform 150ms ease, width 150ms ease",
                                        }}
                                    >
                                        <iframe
                                            ref={previewIframeRef}
                                            title="Vista previa del banner"
                                            style={{
                                                width: `${PREVIEW_VIEWPORT_WIDTH}px`,
                                                height: `${PREVIEW_VIEWPORT_HEIGHT}px`,
                                                border: "0",
                                                pointerEvents: "none",
                                                backgroundColor: "transparent",
                                                display: "block",
                                            }}
                                            scrolling="no"
                                        />
                                        {!isIframeReady && (
                                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted small bg-white bg-opacity-75">
                                                Cargando vista previa...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-7 order-2 order-lg-1">
                        <div className="row">
                            <div className="col-md-6">
                                <SelectFormGroup
                                    eRef={bannerTypeRef}
                                    label="Tipo de Banner"
                                    dropdownParent={"#banner-container"}
                                    onChange={onBannerTypeChange}
                                >
                                    {bannerTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </SelectFormGroup>
                            </div>
                            <div className="col-md-6">
                                <SelectFormGroup
                                    eRef={pageIdRef}
                                    label="Página"
                                    onChange={onPageChange}
                                    dropdownParent={"#banner-container"}
                                >
                                    <option value="">Base Template</option>
                                    {pages.map(page => (
                                        <option key={page.id} value={page.id}>
                                            {page.name}
                                        </option>
                                    ))}
                                </SelectFormGroup>
                            </div>
                        </div>

                        <SelectFormGroup
                            eRef={afterComponentRef}
                            label="Posición (después de)"
                            dropdownParent="#banner-container"
                            changeWith={[selectedPageId]}
                        >
                            <option value="">Al inicio</option>
                            {availableComponents.map(component => (
                                <option key={component.id} value={component.id}>
                                    {component.name}
                                </option>
                            ))}
                        </SelectFormGroup>

                        <ImageFormGroup
                            eRef={backgroundRef}
                            name="background"
                            label="Fondo"
                            onChange={handleImageChange("background")}
                        />

                        <div className="row">
                            <div className="col-sm-6">
                                <ImageFormGroup
                                    eRef={imageRef}
                                    name="image"
                                    label="Imagen"
                                    aspect={1}
                                    onChange={handleImageChange("image")}
                                />
                            </div>
                            <div className="col-sm-6">
                                <TextareaFormGroup
                                    eRef={nameRef}
                                    label="Titulo"
                                    rows={2}
                                    onChange={(event) => handlePreviewFieldChange("name", event.target.value)}
                                />
                                <TextareaFormGroup
                                    eRef={descriptionRef}
                                    label="Descripción"
                                    rows={2}
                                    onChange={(event) => handlePreviewFieldChange("description", event.target.value)}
                                />
                                <InputFormGroup
                                    eRef={buttonTextRef}
                                    label="Texto botón"
                                    onChange={(event) => handlePreviewFieldChange("button_text", event.target.value)}
                                />
                            </div>
                        </div>

                        <InputFormGroup
                            eRef={buttonLinkRef}
                            label="URL botón"
                            onChange={(event) => handlePreviewFieldChange("button_link", event.target.value)}
                        />

                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Posición</label>
                            <div className="col-sm-9">
                                <div className="custom-control custom-switch">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="absoluteSwitch"
                                        ref={absoluteRef}
                                        onChange={handleAbsoluteChange}
                                    />
                                    <label className="custom-control-label" htmlFor="absoluteSwitch">
                                        Imagen absoluta
                                    </label>
                                </div>
                                <small className="form-text text-muted">
                                    Marca esta opción para posicionamiento absoluto de la imagen
                                </small>
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
        <BaseAdminto {...properties} title="Banners">
            <Banners {...properties} />
        </BaseAdminto>
    );
});
