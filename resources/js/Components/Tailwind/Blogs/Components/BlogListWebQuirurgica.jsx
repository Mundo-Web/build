import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Filter, Grid3x3, List } from "lucide-react";
import { Loading } from "../../../Tailwind/Components/Resources/Loading";
import { NoResults } from "../../../Tailwind/Components/Resources/NoResult";
import BlogPostCardWebQuirurgica from "./BlogPostCardWebQuirurgica";
import TextWithHighlight from "../../../../Utils/TextWithHighlight";

const BlogListWebQuirurgica = ({ 
    data, 
    postsLatest, 
    posts, 
    loading, 
    setLoading, 
    isFilter, 
    setIsFilter,
    filteredData 
}) => {
    const { categories } = filteredData;
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const postsPerPage = 9;

    // Referencias para animaciones
    const listRef = useRef(null);
    const listInView = useInView(listRef, { once: true, threshold: 0.1 });

    const sortOptions = [
        { value: 'newest', label: 'Más Recientes' },
        { value: 'oldest', label: 'Más Antiguos' },
        { value: 'title-asc', label: 'Título A-Z' },
        { value: 'title-desc', label: 'Título Z-A' },
    ];

    // Filtrar y ordenar posts
    useEffect(() => {
        let filtered = isFilter && posts.length > 0 ? posts : postsLatest || [];

        // Filtrar por categoría
        if (activeCategory !== 'all') {
            filtered = filtered.filter(post => 
                post.category && post.category.name === activeCategory
            );
        }

        // Ordenar
        filtered = [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [activeCategory, sortOption, posts, postsLatest, isFilter]);

    // Paginación
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const currentPosts = filteredPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section className="bg-white py-24 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Filters Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    
                    {/* Categories Filter */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 border ${
                                activeCategory === 'all'
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-neutral-dark border-gray-200 hover:border-primary hover:text-primary'
                            }`}
                        >
                            Todas
                        </button>
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.name)}
                                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 border whitespace-nowrap ${
                                    activeCategory === category.name
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-neutral-dark border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort & View Options */}
                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="flex border border-gray-200 rounded-full p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-full transition-all duration-300 ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-white'
                                        : 'text-neutral-dark hover:bg-gray-100'
                                }`}
                            >
                                <Grid3x3 size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-full transition-all duration-300 ${
                                    viewMode === 'list'
                                        ? 'bg-primary text-white'
                                        : 'text-neutral-dark hover:bg-gray-100'
                                }`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-light text-neutral-dark focus:outline-none focus:border-primary transition-all duration-300"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-neutral-dark font-light">
                    Mostrando <span className="font-medium">{currentPosts.length}</span> de{' '}
                    <span className="font-medium">{filteredPosts.length}</span> artículos
                </div>

                {/* Posts Grid/List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loading />
                    </div>
                ) : currentPosts.length === 0 ? (
                    <div className="py-20">
                        <NoResults />
                    </div>
                ) : (
                    <motion.div
                        ref={listRef}
                        variants={containerVariants}
                        initial="hidden"
                        animate={listInView ? "visible" : "hidden"}
                        className={
                            viewMode === 'grid'
                                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                                : "grid md:grid-cols-2 gap-8"
                        }
                    >
                        {currentPosts.map((post) => (
                            <motion.div key={post.id} variants={itemVariants}>
                                <BlogPostCardWebQuirurgica
                                    data={data}
                                    post={post}
                                    listView={viewMode === 'list'}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-8">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-light text-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all duration-300"
                        >
                            Anterior
                        </button>
                        
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Mostrar solo algunas páginas alrededor de la actual
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`w-10 h-10 rounded-full text-sm font-light transition-all duration-300 ${
                                                currentPage === pageNumber
                                                    ? 'bg-primary text-white'
                                                    : 'border border-gray-200 text-neutral-dark hover:border-primary hover:text-primary'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return <span key={pageNumber} className="px-2">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-light text-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all duration-300"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogListWebQuirurgica;
