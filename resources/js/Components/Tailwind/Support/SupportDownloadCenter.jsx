import React, { useState } from "react";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";

const SupportDownloadCenter = ({ data, items }) => {
    const title = data?.title || "Centro de Recursos";
    const subtitle = data?.subtitle || "Manuales, videos y documentación de tus productos";

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState('all');
    const [selectedResource, setSelectedResource] = useState(null);
    const [previewType, setPreviewType] = useState(null); // 'video' o 'pdf'
    const [expandedSections, setExpandedSections] = useState({}); // {itemIndex: {videos: true/false, pdfs: true/false}}
    
    const toggleSection = (itemIndex, sectionType) => {
        setExpandedSections(prev => ({
            ...prev,
            [itemIndex]: {
                ...prev[itemIndex],
                [sectionType]: !prev[itemIndex]?.[sectionType]
            }
        }));
    }
    
    // Filtrar items que tengan video o manual (soporta arrays)
    const productsWithSupport = items?.filter(item => {
        const hasVideos = Array.isArray(item.linkvideo) ? item.linkvideo.length > 0 : item.linkvideo;
        const hasPdfs = Array.isArray(item.pdf) ? item.pdf.length > 0 : item.pdf;
        return hasVideos || hasPdfs;
    }) || [];

    // Aplicar filtros
    const getFilteredProducts = () => {
        let filtered = productsWithSupport;

        if (filterType === 'video') {
            filtered = filtered.filter(p => {
                const hasVideos = Array.isArray(p.linkvideo) ? p.linkvideo.length > 0 : p.linkvideo;
                return hasVideos;
            });
        } else if (filterType === 'manual') {
            filtered = filtered.filter(p => {
                const hasPdfs = Array.isArray(p.pdf) ? p.pdf.length > 0 : p.pdf;
                return hasPdfs;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    const openPreview = (resource, type, productName) => {
        setSelectedResource({ ...resource, productName });
        setPreviewType(type);
    };

    const closePreview = () => {
        setSelectedResource(null);
        setPreviewType(null);
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            return url;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    return (
        <>
            <section className="w-full my-10 lg:my-16 bg-white">
                <div className=" mx-auto px-[5%]  2xl:px-0">
                    {/* Header Premium */}
                    <div className="text-center mb-16">
                      
                        <h1 className="text-5xl font-bold customtext-neutral-dark mb-4">
                            {title}
                        </h1>
                        <p className="text-xl customtext-neutral-dark max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </div>

                    {/* Barra de búsqueda premium */}
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="mdi mdi-magnify text-xl text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar en recursos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none  focus:ring-0 focus:ring-transparent  transition-all customtext-neutral-dark bg-white shadow-sm"
                            />
                        </div>

                        {/* Filtros modernos */}
                        <div className="flex justify-center gap-3">
                            {[
                                { id: 'all', label: 'Todos', icon: 'view-grid' },
                                { id: 'video', label: 'Videos', icon: 'play-circle' },
                                { id: 'manual', label: 'Documentos', icon: 'file-document' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setFilterType(filter.id)}
                                    className={`group relative px-6 py-3 rounded-xl font-medium transition-all ${
                                        filterType === filter.id
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-white customtext-neutral-dark hover:border-primary border-2 border-gray-200'
                                    }`}
                                >
                                    <i className={`mdi mdi-${filter.icon} mr-2`}></i>
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid de productos - Estilo premium con tarjetas */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                                <i className="mdi mdi-folder-open-outline text-5xl text-gray-400"></i>
                            </div>
                            <h3 className="text-2xl font-semibold customtext-neutral-dark mb-2">
                                Sin resultados
                            </h3>
                            <p className="text-lg customtext-neutral-dark">
                                {searchTerm 
                                    ? 'Prueba con otro término de búsqueda' 
                                    : 'No hay recursos disponibles'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  max-w-7xl mx-auto">
                            {filteredProducts.map((item, index) => {
                                const videos = Array.isArray(item.linkvideo) ? item.linkvideo : (item.linkvideo ? [{url: item.linkvideo}] : []);
                                const pdfs = Array.isArray(item.pdf) ? item.pdf : (item.pdf ? [{url: item.pdf, name: 'Documento.pdf'}] : []);
                                
                                return (
                                    <div 
                                        key={index}
                                        className="group bg-white rounded-2xl border-2 border-gray-100  hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Imagen del producto */}
                                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                                            <img
                                                src={item.image ? `/storage/images/item/${item.image}` : '/assets/img/placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => e.target.src = '/assets/img/placeholder.png'}
                                            />
                                            {/* Overlay con contador de recursos */}
                                            <div className="absolute top-4 left-4 right-4 flex gap-2">
                                                {videos.length > 0 && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                                                        <i className="mdi mdi-play-circle customtext-primary"></i>
                                                        <span className="text-xs font-semibold customtext-neutral-dark">{videos.length}</span>
                                                    </div>
                                                )}
                                                {pdfs.length > 0 && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                                                        <i className="mdi mdi-file-pdf-box customtext-primary"></i>
                                                        <span className="text-xs font-semibold customtext-neutral-dark">{pdfs.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Contenido de la tarjeta */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold customtext-neutral-dark mb-2 line-clamp-2 min-h-[3.5rem]">
                                                {item.name}
                                            </h3>

                                               <div className="mb-4 prose line-clamp-2 prose-lg max-w-none customtext-neutral-dark" dangerouslySetInnerHTML={{ __html: item?.description || item?.summary }} />



                                            {/* Precio */}
                                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                                                
                                                <a
                                                    href={`/producto/${item.slug}`}
                                                    className="inline-flex w-full text-center justify-center rounded-full items-center gap-2 px-4 py-3 bg-primary text-white  transition-all text-sm font-medium hover:bg-primary/90 hover:shadow-lg"
                                                >
                                                    <span>Ver más</span>
                                                    <i className="mdi mdi-arrow-right"></i>
                                                </a>
                                            </div>

                                            {/* Recursos - Videos con Acordeón */}
                                            {videos.length > 0 && (
                                                <div className="mb-4">
                                                    <button
                                                        onClick={() => toggleSection(index, 'videos')}
                                                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 rounded-xl transition-all group/header border border-primary/20"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                                                <i className="mdi mdi-play-circle text-white"></i>
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="text-sm font-semibold customtext-primary">
                                                                    Videos Tutoriales
                                                                </div>
                                                                <div className="text-xs customtext-neutral-dark">
                                                                    {videos.length} video{videos.length > 1 ? 's' : ''} disponible{videos.length > 1 ? 's' : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <i className={`mdi mdi-chevron-${expandedSections[index]?.videos ? 'up' : 'down'} text-xl customtext-neutral-dark transition-transform`}></i>
                                                    </button>
                                                    
                                                    {/* Contenido expandible */}
                                                    <div className={`overflow-hidden transition-all duration-300 ${
                                                        expandedSections[index]?.videos ? 'max-h-[500px] mt-2' : 'max-h-0'
                                                    }`}>
                                                        <div className="space-y-2 pl-2">
                                                            {videos.map((video, vidIdx) => (
                                                                <button
                                                                    key={`vid-${vidIdx}`}
                                                                    onClick={() => openPreview(video, 'video', item.name)}
                                                                    className="w-full flex items-center gap-3 p-3 bg-white border-2 border-gray-100 hover:border-primary hover:shadow-md rounded-xl transition-all group/video"
                                                                >
                                                                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                                                                        <i className="mdi mdi-play text-white text-lg"></i>
                                                                    </div>
                                                                    <div className="flex-1 text-left">
                                                                        <div className="text-sm font-medium customtext-primary">
                                                                            Video {videos.length > 1 ? vidIdx + 1 : 'Tutorial'}
                                                                        </div>
                                                                        <div className="text-xs customtext-neutral-dark">Click para visualizar</div>
                                                                    </div>
                                                                    <i className="mdi mdi-eye-outline customtext-primary group-hover/video:scale-110 transition-transform"></i>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recursos - PDFs con Acordeón */}
                                            {pdfs.length > 0 && (
                                                <div>
                                                    <button
                                                        onClick={() => toggleSection(index, 'pdfs')}
                                                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 rounded-xl transition-all group/header border border-primary/20"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                                                <i className="mdi mdi-file-pdf-box text-white"></i>
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="text-sm font-semibold customtext-primary">
                                                                    Documentos PDF
                                                                </div>
                                                                <div className="text-xs customtext-neutral-dark">
                                                                    {pdfs.length} documento{pdfs.length > 1 ? 's' : ''} disponible{pdfs.length > 1 ? 's' : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <i className={`mdi mdi-chevron-${expandedSections[index]?.pdfs ? 'up' : 'down'} text-xl customtext-neutral-dark transition-transform`}></i>
                                                    </button>
                                                    
                                                    {/* Contenido expandible */}
                                                    <div className={`overflow-hidden transition-all duration-300 ${
                                                        expandedSections[index]?.pdfs ? 'max-h-[500px] mt-2' : 'max-h-0'
                                                    }`}>
                                                        <div className="space-y-2 pl-2">
                                                            {pdfs.map((pdf, pdfIdx) => (
                                                                <button
                                                                    key={`pdf-${pdfIdx}`}
                                                                    onClick={() => openPreview(pdf, 'pdf', item.name)}
                                                                    className="w-full flex items-center gap-3 p-3 bg-white border-2 border-gray-100 hover:border-primary hover:shadow-md rounded-xl transition-all group/pdf"
                                                                >
                                                                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                                                                        <i className="mdi mdi-file-pdf-box text-white text-lg"></i>
                                                                    </div>
                                                                    <div className="flex-1 text-left min-w-0">
                                                                        <div className="text-sm font-medium customtext-primary truncate">
                                                                            {pdf.name || `Documento ${pdfIdx + 1}`}
                                                                        </div>
                                                                        <div className="text-xs customtext-neutral-dark">Click para visualizar</div>
                                                                    </div>
                                                                    <i className="mdi mdi-eye-outline customtext-primary group-hover/pdf:scale-110 transition-transform"></i>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* CTA de ayuda */}
                    {filteredProducts.length > 0 && (
                        <div className="max-w-4xl mx-auto mt-20">
                            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 text-center border-2 border-primary/20 shadow-lg">
                              
                                <h3 className="text-2xl font-bold customtext-neutral-dark mb-3">
                                    ¿Necesitas ayuda adicional?
                                </h3>
                                <p className="text-lg customtext-neutral-dark mb-6 max-w-2xl mx-auto">
                                    Nuestro equipo de soporte técnico está disponible para resolver tus dudas
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <a 
                                        href="/contacto" 
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all transform hover:scale-105"
                                    >
                                        <i className="mdi mdi-chat-processing-outline text-xl"></i>
                                        Contactar Soporte
                                    </a>
                                   
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de previsualización Premium */}
            {selectedResource && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                    onClick={closePreview}
                >
                    <div 
                        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del modal */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-white">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                                    previewType === 'video' ? 'bg-primary/10' : 'bg-primary/10'
                                }`}>
                                    <i className={`mdi ${previewType === 'video' ? 'mdi-play-circle customtext-primary' : 'mdi-file-pdf-box customtext-primary'} text-2xl`}></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold customtext-neutral-dark">
                                        {selectedResource.productName}
                                    </h3>
                                    <p className="text-sm customtext-neutral-dark">
                                        {previewType === 'video' ? 'Video Tutorial' : selectedResource.name || 'Documento PDF'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {previewType === 'pdf' && (
                                    <a
                                        href={`/storage/images/item/${selectedResource.url}`}
                                        download
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                                    >
                                        <i className="mdi mdi-download"></i>
                                        Descargar
                                    </a>
                                )}
                                <button
                                    onClick={closePreview}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <i className="mdi mdi-close text-2xl customtext-neutral-dark"></i>
                                </button>
                            </div>
                        </div>

                        {/* Contenido del modal */}
                        <div className="bg-gray-900" style={{ height: '70vh' }}>
                            {previewType === 'video' ? (
                                <iframe
                                    src={getYoutubeEmbedUrl(selectedResource.url)}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <iframe
                                    src={`/storage/images/item/${selectedResource.url}#toolbar=1&navpanes=1&scrollbar=1`}
                                    className="w-full h-full"
                                    title={selectedResource.name}
                                ></iframe>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Estilos para animaciones */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default SupportDownloadCenter;
