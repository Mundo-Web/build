import React, { useState } from "react";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";

const SupportWithTabs = ({ data, items }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");
    const title = data?.title || "Centro de Soporte";

    // Filtrar items que tengan video o manual
    const productsWithSupport = items?.filter(item => 
        item.linkvideo || item.manual || item.pdf
    ) || [];

    // Filtrar por tipo de recurso
    const filterByType = (products) => {
        switch(activeTab) {
            case 'videos':
                return products.filter(p => p.linkvideo);
            case 'manuales':
                return products.filter(p => p.manual || p.pdf);
            default:
                return products;
        }
    };

    // Aplicar búsqueda
    const filteredProducts = filterByType(productsWithSupport).filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const countVideos = productsWithSupport.filter(p => p.linkvideo).length;
    const countManuales = productsWithSupport.filter(p => p.manual || p.pdf).length;

    return (
        <section className="w-full py-16 bg-white">
            <div className="replace-max-w-here mx-auto px-[5%]">
                <h2 className="text-4xl font-bold text-center mb-10 customtext-neutral-dark">
                    {title}
                </h2>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre de producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-4 pl-14 border-2 border-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all customtext-neutral-dark"
                        />
                        <i className="mdi mdi-magnify absolute left-5 top-1/2 transform -translate-y-1/2 customtext-neutral-light text-2xl"></i>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-10 border-b-2 border-secondary">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-8 py-4 font-bold border-b-4 transition-all ${
                            activeTab === 'all' 
                                ? 'border-primary customtext-primary' 
                                : 'border-transparent customtext-neutral-light hover:customtext-neutral-dark'
                        }`}
                    >
                        <i className="mdi mdi-view-grid mr-2 text-lg"></i>
                        Todos ({productsWithSupport.length})
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`px-8 py-4 font-bold border-b-4 transition-all ${
                            activeTab === 'videos' 
                                ? 'border-primary customtext-primary' 
                                : 'border-transparent customtext-neutral-light hover:customtext-neutral-dark'
                        }`}
                    >
                        <i className="mdi mdi-play-circle mr-2 text-lg"></i>
                        Videos ({countVideos})
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('manuales')}
                        className={`px-8 py-4 font-bold border-b-4 transition-all ${
                            activeTab === 'manuales' 
                                ? 'border-primary customtext-primary' 
                                : 'border-transparent customtext-neutral-light hover:customtext-neutral-dark'
                        }`}
                    >
                        <i className="mdi mdi-file-document mr-2 text-lg"></i>
                        Manuales ({countManuales})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-fadeIn">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <i className="mdi mdi-file-document-outline text-7xl customtext-neutral-light opacity-50 mb-6"></i>
                            <p className="customtext-neutral-light text-xl">
                                {searchTerm ? 'No se encontraron productos' : 'No hay productos en esta categoría'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((item, index) => (
                                <div 
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-secondary hover:border-primary"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-48 bg-gray-200">
                                        <img
                                            src={item.image ? `/storage/images/item/${item.image}` : '/assets/img/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/assets/img/placeholder.png';
                                            }}
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {item.linkvideo && (
                                                <span className="bg-accent text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
                                                    <i className="mdi mdi-play mr-1"></i>
                                                    Video
                                                </span>
                                            )}
                                            {(item.manual || item.pdf) && (
                                                <span className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
                                                    <i className="mdi mdi-file-pdf mr-1"></i>
                                                    Manual
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem] customtext-neutral-dark">
                                            {item.name}
                                        </h3>
                                        
                                        {item.summary && (
                                            <p className="text-sm customtext-neutral-light mb-4 line-clamp-2">
                                                {item.summary}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 mb-5">
                                            <span className="text-xl font-bold customtext-primary">
                                                {CurrencySymbol()} {Number2Currency(item.final_price || item.price)}
                                            </span>
                                            {item.discount > 0 && (
                                                <span className="text-sm customtext-neutral-light line-through">
                                                    {CurrencySymbol()} {Number2Currency(item.price)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Resources */}
                                        <div className="space-y-3">
                                            {item.linkvideo && (
                                                <a
                                                    href={item.linkvideo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-full px-4 py-3 bg-accent text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                                >
                                                    <i className="mdi mdi-play-circle mr-2 text-lg"></i>
                                                    Ver Video
                                                </a>
                                            )}
                                            
                                            {item.manual && (
                                                <a
                                                    href={`/storage/images/item/${item.manual}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                                >
                                                    <i className="mdi mdi-download mr-2 text-lg"></i>
                                                    Manual
                                                </a>
                                            )}

                                            {!item.manual && item.pdf && (
                                                <a
                                                    href={`/storage/images/item/${item.pdf}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-full px-4 py-3 bg-secondary text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                                >
                                                    <i className="mdi mdi-download mr-2 text-lg"></i>
                                                    Catálogo
                                                </a>
                                            )}

                                            <a
                                                href={`/producto/${item.slug}`}
                                                className="flex items-center justify-center w-full px-4 py-3 border-2 border-secondary customtext-neutral-dark rounded-xl hover:bg-secondary hover:text-white transition-all text-sm font-semibold"
                                            >
                                                Ver Producto
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </section>
    );
};

export default SupportWithTabs;
