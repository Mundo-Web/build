import React, { useState } from "react";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";

const SupportDownloadCenter = ({ data, items }) => {
    const title = data?.title || "Centro de Descargas";
    const subtitle = data?.subtitle || "Todos los recursos que necesitas en un solo lugar";

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState('all'); // all, video, manual
    
    // Filtrar items que tengan video o manual
    const productsWithSupport = items?.filter(item => 
        item.linkvideo || item.manual || item.pdf
    ) || [];

    // Aplicar filtros
    const getFilteredProducts = () => {
        let filtered = productsWithSupport;

        // Filtrar por tipo
        if (filterType === 'video') {
            filtered = filtered.filter(p => p.linkvideo);
        } else if (filterType === 'manual') {
            filtered = filtered.filter(p => p.manual || p.pdf);
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    return (
        <section className="w-full py-20 bg-white">
            <div className="replace-max-w-here mx-auto px-[5%]">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-5xl font-bold mb-4 customtext-neutral-dark">
                        {title}
                    </h2>
                    <p className="text-xl customtext-neutral-light mb-8">
                        {subtitle}
                    </p>

                    {/* Search and Filter */}
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-5 py-4 pl-14 border-2 border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all customtext-neutral-dark"
                                />
                                <i className="mdi mdi-magnify absolute left-5 top-1/2 transform -translate-y-1/2 customtext-neutral-light text-2xl"></i>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setFilterType('all')}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                                        filterType === 'all'
                                            ? 'bg-primary text-white scale-105'
                                            : 'bg-white customtext-neutral-dark border-2 border-primary hover:bg-secondary hover:text-white'
                                    }`}
                                >
                                    <i className="mdi mdi-view-grid mr-2"></i>
                                    Todos
                                </button>
                                <button
                                    onClick={() => setFilterType('video')}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                                        filterType === 'video'
                                            ? 'bg-accent text-white scale-105'
                                            : 'bg-white customtext-neutral-dark border-2 border-primary hover:bg-accent hover:text-white'
                                    }`}
                                >
                                    <i className="mdi mdi-play-circle mr-2"></i>
                                    Videos
                                </button>
                                <button
                                    onClick={() => setFilterType('manual')}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                                        filterType === 'manual'
                                            ? 'bg-primary text-white scale-105'
                                            : 'bg-white customtext-neutral-dark border-2 border-primary hover:bg-primary hover:text-white'
                                    }`}
                                >
                                    <i className="mdi mdi-file-pdf-box mr-2"></i>
                                    Manuales
                                </button>
                            </div>
                        </div>

                      
                    </div>
                </div>

                {/* Products List */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="mdi mdi-folder-open-outline text-8xl customtext-neutral-light opacity-40 mb-8"></i>
                        <h3 className="text-3xl font-bold customtext-neutral-dark mb-3">
                            No se encontraron productos
                        </h3>
                        <p className="customtext-neutral-light text-lg">
                            {searchTerm 
                                ? 'Intenta con otro término de búsqueda' 
                                : 'No hay productos con recursos disponibles en esta categoría'}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-8">
                        {filteredProducts.map((item, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 "
                            >
                                <div className="md:flex">
                                    {/* Product Image */}
                                    <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-200">
                                        <img
                                            src={item.image ? `/storage/images/item/${item.image}` : '/assets/img/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/assets/img/placeholder.png';
                                            }}
                                        />
                                        <div className="absolute top-6 left-6 flex flex-col gap-3">
                                            {item.linkvideo && (
                                                <span className="bg-accent text-white px-5 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center w-fit">
                                                    <i className="mdi mdi-play-circle mr-2 text-lg"></i>
                                                    VIDEO DISPONIBLE
                                                </span>
                                            )}
                                            {(item.manual || item.pdf) && (
                                                <span className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center w-fit">
                                                    <i className="mdi mdi-file-pdf-box mr-2 text-lg"></i>
                                                    MANUAL DISPONIBLE
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="md:w-2/3 p-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-bold mb-3 customtext-neutral-dark">
                                                    {item.name}
                                                </h3>
                                          
                                                       <div className="prose prose-lg max-w-none customtext-neutral-dark line-clamp-5" dangerouslySetInnerHTML={{ __html: item?.description || item?.summary }} />

                                             
                                            </div>
                                            <div className="text-right ml-6 customtext-neutral-dark px-6 py-4 ">
                                                <div className="text-xs font-semibold customtext-neutral-light  mb-1">PRECIO</div>
                                                <div className="text-3xl font-bold">
                                                    {CurrencySymbol()} {Number2Currency(item.final_price || item.price)}
                                                </div>
                                                {item.discount > 0 && (
                                                    <div className="text-sm opacity-75 line-through mt-1">
                                                        {CurrencySymbol()} {Number2Currency(item.price)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Resources Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                            {item.linkvideo && (
                                                <div className="flex items-start p-5  rounded-2xl border-2 border-accent/20">
                                                    <i className="mdi mdi-play-circle text-3xl customtext-accent mr-4 mt-1"></i>
                                                    <div>
                                                        <h4 className="font-bold customtext-neutral-dark text-lg">Video Tutorial</h4>
                                                        <p className="text-sm customtext-neutral-light">Aprende a usar el producto</p>
                                                    </div>
                                                </div>
                                            )}

                                            {(item.manual || item.pdf) && (
                                                <div className="flex items-start p-5  rounded-2xl border-2 border-primary/20">
                                                    <i className="mdi mdi-file-pdf-box text-3xl customtext-primary mr-4 mt-1"></i>
                                                    <div>
                                                        <h4 className="font-bold customtext-neutral-dark text-lg">
                                                            {item.manual ? 'Manual de Usuario' : 'Catálogo'}
                                                        </h4>
                                                        <p className="text-sm customtext-neutral-light">Descarga el documento PDF</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-4">
                                            {item.linkvideo && (
                                                <a
                                                    href={item.linkvideo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:shadow-2xl transition-all shadow-lg transform hover:scale-105"
                                                >
                                                    <i className="mdi mdi-play-circle mr-3 text-2xl"></i>
                                                    Ver Video
                                                </a>
                                            )}
                                            
                                            {item.manual && (
                                                <a
                                                    href={`/storage/images/item/${item.manual}`}
                                                    download
                                                    className="inline-flex items-center px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:shadow-2xl transition-all shadow-lg transform hover:scale-105"
                                                >
                                                    <i className="mdi mdi-download mr-3 text-2xl"></i>
                                                    Descargar Manual
                                                </a>
                                            )}

                                            {!item.manual && item.pdf && (
                                                <a
                                                    href={`/storage/images/item/${item.pdf}`}
                                                    download
                                                    className="inline-flex items-center px-8 py-4 bg-neutral-dark text-white font-bold rounded-xl hover:shadow-2xl transition-all shadow-lg transform hover:scale-105"
                                                >
                                                    <i className="mdi mdi-download mr-3 text-2xl"></i>
                                                    Descargar Catálogo
                                                </a>
                                            )}

                                            <a
                                                href={`/producto/${item.slug}`}
                                                className="inline-flex items-center px-8 py-4 border-2 border-neutral-dark customtext-neutral-dark font-bold rounded-xl hover:bg-neutral-dark hover:text-white transition-all shadow-md"
                                            >
                                                <i className="mdi mdi-eye mr-3 text-xl"></i>
                                                Ver Producto
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border-2 border-primary/20 shadow-lg">
                        <i className="mdi mdi-help-circle customtext-primary text-4xl"></i>
                        <span className="customtext-neutral-dark font-semibold text-lg">
                            ¿Necesitas más ayuda?
                        </span>
                        <a href="/contacto" className="customtext-primary hover:customtext-accent font-bold text-lg ml-3 hover:underline">
                            Contáctanos →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SupportDownloadCenter;
