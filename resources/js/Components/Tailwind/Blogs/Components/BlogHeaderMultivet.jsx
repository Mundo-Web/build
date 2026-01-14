import { Search, Heart, Filter } from "lucide-react";

import { useEffect, useState } from "react";
import PostsRest from "../../../../Actions/PostsRest";
import BlogCategoriesRest from "../../../../Actions/Admin/BlogCategoriesRest";
import SelectForm from "./SelectForm";
import Global from "../../../../Utils/Global";
import { motion } from "framer-motion";
import BlogPostCardMultivet from "./BlogPostCardMultivet";

const postsRest = new PostsRest();
const blogCategoriesRest = new BlogCategoriesRest();

export default function BlogHeaderMultivet({
  data,
  posts,
  setPosts,
  headerPosts,
  filteredData,
  loading,
  setLoading,
  isFilter,
  setIsFilter,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category_id: "",
    post_date: "",
    name: "",
  });
  const [initialLoad, setInitialLoad] = useState(true);

  const transformFilters = (filters) => {
    const transformedFilters = [];

    // Categorías
    if (filters.category_id) {
      transformedFilters.push(["category_id", "=", filters.category_id]);
    }
    // Fecha
    if (filters.post_date) {
      transformedFilters.push(["post_date", "=", filters.post_date]);
    }

    // Búsqueda por nombre
    if (filters.name) {
      transformedFilters.push(["name", "contains", filters.name]);
    }

    return transformedFilters;
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const filters = transformFilters(selectedFilters);

      // Verificar si hay filtros activos
      const hasFilters =
        selectedFilters.category_id ||
        selectedFilters.post_date ||
        selectedFilters.name;

      const params = {
        with: "category",
        filter: filters,
      };

      const response = await postsRest.paginate(params);

      setPosts(response.data);

      // Actualizar isFilter solo si hay filtros activos
      hasFilters ? setIsFilter(true) : setIsFilter(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar las categorías de posts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = {
          filter: [
            ["visible", "=", true],
            ["status", "=", true]
          ]
        };
        const response = await blogCategoriesRest.paginate(params);
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      fetchPosts();
    } else {
      setInitialLoad(false); // Marcar que ya se realizó la carga inicial
    }
  }, [selectedFilters]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      category_id: "",
      post_date: "",
      name: "",
    });
    // Actualizar isFilter inmediatamente al limpiar
    setIsFilter(false);
  };

  return (
    <main className={`relative bg-sections-color ${isFilter ? "":"min-h-screen"} font-title`}>
      {/* Hero Section con estilo Multivet */}
      <section
        className={`relative  overflow-visible z-10 ${
          isFilter ? "pt-16 pb-8" : "py-16"
        }`}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="relative px-4 2xl:px-0 2xl:max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
          
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={` text-4xl md:text-6xl 2xl:text-5xl max-w-6xl mx-auto font-bold customtext-secondary font-title leading-tight ${data?.class_title || ''}`}
            >
              {data?.title ? (
                <span 
                  dangerouslySetInnerHTML={{ __html: data.title }}
                  className="block font-title"
                />
              ) : (
                <>
                  Conocimiento Veterinario
                  <br />
                  <span className="text-accent">para tu Mascota</span>
                </>
              )}
            </motion.h1>
            
            {data?.description && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white/90 text-lg 2xl:text-xl font-medium max-w-3xl mx-auto"
              >
                {data.description}
              </motion.p>
            )}
          </motion.div>

          {/* Search and Filters con estilo Multivet */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 bg-white rounded-2xl shadow-xl p-6 relative overflow-visible"
          >
            <div className="flex flex-col lg:flex-row gap-4 relative">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder={data?.placeholder_search || "Buscar artículos..."}
                  className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 focus:outline-0 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 lg:w-auto">
                <div className="relative flex-1 lg:w-64 z-[9999]">
                  <SelectForm
                    options={categories}
                    placeholder="Todas las categorías"
                    value={selectedFilters.category_id}
                    onChange={(value) => {
                      setSelectedFilters((prev) => ({
                        ...prev,
                        category_id: value,
                      }));
                    }}
                    labelKey="name"
                    valueKey="id"
                    className="border-2 py-4 border-gray-200 focus:border-primary"
                  />
                    
                </div>
                
                <div className="flex-1 lg:w-48">
                  <input
                    type="date"
                    value={selectedFilters.post_date}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 focus:outline-0 transition-all duration-300 text-gray-700"
                    onChange={(e) => {
                      handleFilterChange("post_date", e.target.value);
                    }}
                  />
                </div>

                {/* Botón para limpiar filtros */}
                {(selectedFilters.name || selectedFilters.category_id || selectedFilters.post_date) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Filter className="w-4 h-4" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Featured Posts con estilo Multivet */}
          {!isFilter && headerPosts && headerPosts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16"
            >
              <div className="text-center mb-8">
                <h2   className="text-4xl md:text-5xl font-bold mb-6 font-title customtext-secondary leading-tight">
                  Artículos Destacados
                </h2>
               
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                  <BlogPostCardMultivet data={data} featured post={headerPosts[0]} />
                </div>
                <div className="hidden lg:flex flex-col gap-6">
                  {headerPosts.slice(1, 3).map((post) => (
                    <BlogPostCardMultivet data={data} flex key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}