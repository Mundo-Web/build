import React, { useState, useEffect } from "react";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";

const SupportSimple = ({ data, items }) => {
    const title = data?.title || "Soporte Técnico";
    const subtitle = data?.subtitle || "Recursos de productos disponibles";

    const [searchTerm, setSearchTerm] = useState("");
    
    // Filtrar items que tengan video o manual
    const productsWithSupport = items?.filter(item => 
        item.linkvideo || item.manual || item.pdf
    ) || [];

    // Filtrar por búsqueda
    const filteredProducts = productsWithSupport.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';
        
        // Detectar diferentes formatos de URL de YouTube
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
        <section className="w-full py-16 bg-white">
            <div className="replace-max-w-here mx-auto px-[5%]">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold mb-3 customtext-neutral-dark">
                        {title}
                    </h2>
                    <p className="text-lg customtext-neutral-light mb-8">
                        {subtitle}
                    </p>

                    {/* Buscador */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar producto por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-5 py-4 pl-14 border-2 border-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all customtext-neutral-dark"
                            />
                            <i className="mdi mdi-magnify absolute left-5 top-1/2 transform -translate-y-1/2 customtext-neutral-light text-2xl"></i>
                        </div>
                        <p className="text-sm customtext-neutral-light mt-3 text-center">
                            <span className="font-semibold customtext-primary">{filteredProducts.length}</span> producto{filteredProducts.length !== 1 ? 's' : ''} con recursos disponibles
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <i className="mdi mdi-file-document-outline text-7xl customtext-neutral-light opacity-50 mb-6"></i>
                        <p className="customtext-neutral-light text-xl">
                            {searchTerm ? 'No se encontraron productos con ese nombre' : 'No hay productos con recursos de soporte disponibles'}
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
                                    {item.linkvideo && (
                                        <div className="absolute top-4 left-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg">
                                            <i className="mdi mdi-play-circle mr-1.5 text-sm"></i>
                                            VIDEO
                                        </div>
                                    )}
                                    {(item.manual || item.pdf) && (
                                        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg">
                                            <i className="mdi mdi-file-pdf-box mr-1.5 text-sm"></i>
                                            MANUAL
                                        </div>
                                    )}
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
                                                className="flex items-center justify-center w-full px-5 py-3 bg-accent text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                            >
                                                <i className="mdi mdi-play-circle mr-2 text-lg"></i>
                                                Ver Video Tutorial
                                            </a>
                                        )}
                                        
                                        {item.manual && (
                                            <a
                                                href={`/storage/images/item/${item.manual}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-full px-5 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                            >
                                                <i className="mdi mdi-download mr-2 text-lg"></i>
                                                Descargar Manual
                                            </a>
                                        )}

                                        {!item.manual && item.pdf && (
                                            <a
                                                href={`/storage/images/item/${item.pdf}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-full px-5 py-3 bg-secondary text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                            >
                                                <i className="mdi mdi-download mr-2 text-lg"></i>
                                                Descargar Catálogo
                                            </a>
                                        )}

                                        <a
                                            href={`/producto/${item.slug}`}
                                            className="flex items-center justify-center w-full px-5 py-3 border-2 border-secondary customtext-neutral-dark rounded-xl hover:bg-secondary hover:text-white transition-all text-sm font-semibold"
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
        </section>
    );
};

export default SupportSimple;
