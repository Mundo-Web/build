import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { Plus, Trash2, MoveUp, MoveDown, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import ImageFormGroup from './ImageFormGroup';

const BannersJsonEditor = forwardRef(({ name = "banners", label = "Banners", initialValue = [], model = "category" }, ref) => {
    const [banners, setBanners] = useState([]);
    const [expanded, setExpanded] = useState({});
    const imageRefs = useRef({});

    // Removed the initialValue useEffect - we use setValue() imperatively instead

    useImperativeHandle(ref, () => ({
        getValue: () => JSON.stringify(banners),
        setValue: (value) => {
            console.log('BannersJsonEditor.setValue called with:', value, 'type:', typeof value);
            try {
                const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                console.log('Parsed value:', parsed, 'is array:', Array.isArray(parsed));
                setBanners(Array.isArray(parsed) ? parsed : []);
                console.log('setBanners called, should trigger re-render');
                
                // Expand all banners when loading existing data
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const newExpanded = {};
                    parsed.forEach((_, index) => {
                        newExpanded[index] = true;
                    });
                    setExpanded(newExpanded);
                }
            } catch (error) {
                console.error('Error setting banners:', error);
                setBanners([]);
            }
        },
        reset: () => {
            setBanners([]);
            imageRefs.current = {};
        },
        getImageRefs: () => imageRefs.current,
        getImageFiles: () => {
            const files = {};
            console.log('getImageFiles - imageRefs.current:', imageRefs.current);
            Object.keys(imageRefs.current).forEach(index => {
                const imgRef = imageRefs.current[index];
                console.log(`getImageFiles - index ${index}:`, imgRef);
                
                // imgRef is the whole ref object with {current, image, getDeleteFlag, resetDeleteFlag}
                // We need to access imgRef.current.files[0]
                if (imgRef?.current?.files?.[0]) {
                    files[`banner_image_${index}`] = imgRef.current.files[0];
                    console.log(`getImageFiles - Added file for banner_image_${index}:`, imgRef.current.files[0].name);
                }
            });
            console.log('getImageFiles - Final files object:', files);
            return files;
        }
    }));

    const addBanner = () => {
        const newBanner = {
            image: '',
            title: '',
            description: '',
            button_text: '',
            button_link: ''
        };
        const newBanners = [...banners, newBanner];
        setBanners(newBanners);
        setExpanded({ ...expanded, [newBanners.length - 1]: true });
        
        // Create ref for new banner
        imageRefs.current[newBanners.length - 1] = { current: null };
    };

    const removeBanner = async (index) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar banner?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        
        if (isConfirmed) {
            const newBanners = banners.filter((_, i) => i !== index);
            setBanners(newBanners);
            
            // Remove ref
            delete imageRefs.current[index];
            
            // Reajustar refs
            const newRefs = {};
            Object.keys(imageRefs.current).forEach(key => {
                const idx = parseInt(key);
                if (idx > index) {
                    newRefs[idx - 1] = imageRefs.current[key];
                } else if (idx < index) {
                    newRefs[idx] = imageRefs.current[key];
                }
            });
            imageRefs.current = newRefs;
            
            // Reajustar expanded
            const newExpanded = {};
            Object.keys(expanded).forEach(key => {
                const idx = parseInt(key);
                if (idx < index) {
                    newExpanded[idx] = expanded[key];
                } else if (idx > index) {
                    newExpanded[idx - 1] = expanded[key];
                }
            });
            setExpanded(newExpanded);
        }
    };

    const moveBanner = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= banners.length) return;

        const newBanners = [...banners];
        [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
        setBanners(newBanners);

        // Swap refs
        const tempRef = imageRefs.current[index];
        imageRefs.current[index] = imageRefs.current[newIndex];
        imageRefs.current[newIndex] = tempRef;

        // Actualizar expanded
        const wasExpanded = expanded[index];
        const wasExpandedNext = expanded[newIndex];
        setExpanded({
            ...expanded,
            [index]: wasExpandedNext,
            [newIndex]: wasExpanded
        });
    };

    const updateBanner = (index, field, value) => {
        const newBanners = [...banners];
        newBanners[index] = { ...newBanners[index], [field]: value };
        setBanners(newBanners);
    };

    const toggleExpanded = (index) => {
        setExpanded({ ...expanded, [index]: !expanded[index] });
    };

    return (
        <div className="form-group">
            <label className="font-weight-bold mb-2">{label}</label>
            
            <div className="border rounded p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted">
                        {banners.length} banner{banners.length !== 1 ? 's' : ''} configurado{banners.length !== 1 ? 's' : ''}
                    </small>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={addBanner}
                    >
                        <Plus size={16} className="mr-1" />
                        Agregar Banner
                    </button>
                </div>

                {banners.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <ImageIcon size={48} className="mb-2 opacity-50" style={{ display: 'block', margin: '0 auto' }} />
                        <p className="mb-0">No hay banners configurados</p>
                        <small>Haz clic en "Agregar Banner" para comenzar</small>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {banners.map((banner, index) => (
                            <div key={`banner-${index}-${banner.image || 'new'}`} className="card mb-2 shadow-sm">
                                <div className="card-header bg-white d-flex justify-content-between align-items-center p-2">
                                    <button
                                        type="button"
                                        className="btn btn-link text-left flex-grow-1 text-decoration-none p-2"
                                        onClick={() => toggleExpanded(index)}
                                    >
                                        <strong>Banner {index + 1}</strong>
                                        {banner.title && (
                                            <small className="text-muted ml-2">- {banner.title}</small>
                                        )}
                                    </button>
                                    <div className="d-flex gap-1">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => moveBanner(index, 'up')}
                                                title="Mover arriba"
                                            >
                                                <MoveUp size={14} />
                                            </button>
                                        )}
                                        {index < banners.length - 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => moveBanner(index, 'down')}
                                                title="Mover abajo"
                                            >
                                                <MoveDown size={14} />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeBanner(index)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {expanded[index] && (
                                    <div className="card-body p-3">
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <ImageFormGroup
                                                    eRef={(() => {
                                                        if (!imageRefs.current[index]) {
                                                            imageRefs.current[index] = { current: null };
                                                        }
                                                        return imageRefs.current[index];
                                                    })()}
                                                    name={`banner_image_${index}`}
                                                    label="Imagen del Banner"
                                                    col="col-12"
                                                    aspect={16 / 9}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            updateBanner(index, 'image', file.name);
                                                        }
                                                    }}
                                                />
                                                {banner.image && (
                                                    <small className="text-muted d-block mt-2">
                                                        Archivo actual: <strong>{banner.image}</strong>
                                                    </small>
                                                )}
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="font-weight-semibold small">Título</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Título del banner"
                                                    value={banner.title || ''}
                                                    onChange={(e) => updateBanner(index, 'title', e.target.value)}
                                                />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="font-weight-semibold small">Descripción</label>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="3"
                                                    placeholder="Descripción del banner"
                                                    value={banner.description || ''}
                                                    onChange={(e) => updateBanner(index, 'description', e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="font-weight-semibold small">Texto del Botón</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Ver más"
                                                    value={banner.button_text || ''}
                                                    onChange={(e) => updateBanner(index, 'button_text', e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="font-weight-semibold small">Link del Botón</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="/ruta-destino"
                                                    value={banner.button_link || ''}
                                                    onChange={(e) => updateBanner(index, 'button_link', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <input
                type="hidden"
                name={name}
                value={JSON.stringify(banners)}
            />
        </div>
    );
});

BannersJsonEditor.displayName = 'BannersJsonEditor';

export default BannersJsonEditor;
