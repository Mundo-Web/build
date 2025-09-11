import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, Filter } from "lucide-react";
import { Loading } from "../../Components/Resources/Loading";
import { NoResults } from "../../Components/Resources/NoResult";
import BlogPostCardKatya from "./BlogPostCardKatya";

const BlogListKatya = ({ 
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const postsPerPage = 9;

    // Referencias para animaciones (igual que Multivet)
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

    // Variantes de animación exactas de Multivet
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

    const titleVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const descriptionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut"
            }
        }
    };

    const gridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                delay: 0.3,
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 60, 
            scale: 0.9,
            rotateX: 15
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                type: "spring",
                damping: 25,
                stiffness: 120
            }
        }
    };

    const utilityVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section
            ref={listRef}
            className={`font-title bg-gradient-to-b from-gray-50 to-white ${isFilter ? "py-16 mt-4" : "py-24"}`}
            variants={containerVariants}
            initial="hidden"
            animate={listInView ? "visible" : "hidden"}
        >
            <motion.div className="px-4 2xl:px-0 2xl:max-w-7xl mx-auto" variants={containerVariants}>
                {!isFilter ? (
                    <motion.div variants={containerVariants}>
                        {/* Header Section con estilo Multivet */}
                        <motion.div 
                            className="text-center mb-16"
                            variants={containerVariants}
                        >
                            <motion.h2 
                                className="text-4xl md:text-5xl font-bold mb-6 font-title customtext-secondary leading-tight"
                                variants={titleVariants}
                            >
                                {data?.second_title ? (
                                    <span dangerouslySetInnerHTML={{ __html: data.second_title }} />
                                ) : (
                                    <>
                                        Últimas <span className="text-primary font-title">Publicaciones</span>
                                    </>
                                )}
                            </motion.h2>
                            
                            {data?.second_description && (
                                <motion.p 
                                    className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
                                    variants={descriptionVariants}
                                >
                                    {data.second_description}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Filtros y Controles */}
                        <motion.div 
                            className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-12"
                            variants={containerVariants}
                        >
                            {/* Tabs de Categorías */}
                            <div className="flex-1">
                                <motion.div 
                                    className="flex flex-wrap gap-3"
                                    variants={containerVariants}
                                >
                                    {/* Tab "Todas" */}
                                    <motion.button
                                        className={`px-6 py-3 rounded-full transition-all duration-300 font-medium text-sm ${
                                            activeCategory === 'all'
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={() => setActiveCategory('all')}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Todas ({filteredData?.posts?.length || postsLatest?.length || 0})
                                    </motion.button>

                                    {/* Tabs de Categorías */}
                                    {categories?.map((category, index) => {
                                        const categoryCount = (isFilter && posts.length > 0 ? posts : postsLatest || [])
                                            .filter(post => post.category && post.category.name === category.name).length;
                                        
                                        return (
                                            <motion.button
                                                key={category.id}
                                                className={`px-6 py-3 rounded-full transition-all duration-300 font-medium text-sm ${
                                                    activeCategory === category.name
                                                        ? 'bg-primary text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                                onClick={() => setActiveCategory(category.name)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {category.name} ({categoryCount})
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            </div>

                            {/* Dropdown de Ordenamiento */}
                            <motion.div className="relative">
                                <motion.button
                                    className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors duration-300 min-w-[200px] justify-between"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {sortOptions.find(opt => opt.value === sortOption)?.label}
                                        </span>
                                    </div>
                                    <ChevronDown 
                                        className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                                            isDropdownOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                        >
                                            {sortOptions.map((option) => (
                                                <motion.button
                                                    key={option.value}
                                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                                                        sortOption === option.value ? 'bg-primary text-white' : 'text-gray-700'
                                                    }`}
                                                    onClick={() => {
                                                        setSortOption(option.value);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    {option.label}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        {/* Grid de posts con estilo Multivet EXACTO */}
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                            variants={gridVariants}
                        >
                            {Array.isArray(currentPosts) && currentPosts.length > 0 ? (
                                currentPosts.map((post, index) => (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        whileHover={{ 
                                            scale: 1.03,
                                            y: -15,
                                            transition: { 
                                                duration: 0.4,
                                                ease: [0.22, 1, 0.36, 1]
                                            }
                                        }}
                                        whileTap={{ 
                                            scale: 0.97,
                                            transition: { duration: 0.1 }
                                        }}
                                        className="h-full"
                                        style={{
                                            transformStyle: "preserve-3d"
                                        }}
                                    >
                                        <BlogPostCardKatya data={data} post={post} />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    className="col-span-full my-16"
                                    variants={utilityVariants}
                                >
                                    <div className="text-center">
                                        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                                            <NoResults />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <motion.div 
                                className="flex items-center justify-center mt-16 gap-2"
                                variants={utilityVariants}
                            >
                                {/* Botón Anterior */}
                                <motion.button
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary shadow-sm hover:shadow-md'
                                    }`}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                                >
                                    Anterior
                                </motion.button>

                                {/* Números de página */}
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;
                                    const isActive = currentPage === pageNumber;
                                    
                                    return (
                                        <motion.button
                                            key={pageNumber}
                                            className={`w-12 h-12 rounded-lg font-medium transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-primary text-white shadow-lg'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary shadow-sm hover:shadow-md'
                                            }`}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {pageNumber}
                                        </motion.button>
                                    );
                                })}

                                {/* Botón Siguiente */}
                                <motion.button
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary shadow-sm hover:shadow-md'
                                    }`}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                                >
                                    Siguiente
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants}>
                        {/* Header para filtros con estilo Multivet */}
                        <motion.div 
                            className="text-center mb-12"
                            variants={titleVariants}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold customtext-secondary font-title">
                                Artículos <span className="customtext-secondary font-title">Encontrados</span>
                            </h2>
                        </motion.div>

                        {/* Grid de resultados filtrados */}
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                            variants={gridVariants}
                        >
                            {loading ? (
                                <motion.div 
                                    className="col-span-full my-16"
                                    variants={utilityVariants}
                                >
                                    <div className="text-center">
                                        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                                            <Loading />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : Array.isArray(posts) && posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ 
                                            scale: 1.03,
                                            y: -15,
                                            transition: { 
                                                duration: 0.4,
                                                ease: [0.22, 1, 0.36, 1]
                                            }
                                        }}
                                        whileTap={{ 
                                            scale: 0.97,
                                            transition: { duration: 0.1 }
                                        }}
                                        className="h-full"
                                        style={{
                                            transformStyle: "preserve-3d"
                                        }}
                                    >
                                        <BlogPostCardKatya data={data} post={post} />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    className="col-span-full my-16"
                                    variants={utilityVariants}
                                >
                                    <div className="text-center">
                                        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                                            <NoResults />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </motion.section>
    );
};

export default BlogListKatya;