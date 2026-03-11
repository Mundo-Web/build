import { Search, X } from "lucide-react";
import BlogPostCard from "./BlogPostCard";

import DateFilter from "./DateFilter";
import { useEffect, useState } from "react";
import PostsRest from "../../../../Actions/PostsRest";

import SelectForm from "./SelectForm";
import Global from "../../../../Utils/Global";
import BlogCategoriesRest from "../../../../Actions/BlogCategoriesRest";

const postsRest = new PostsRest();
const blogCategoriesRest = new BlogCategoriesRest();

export default function BlogHeader({
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

        // Búsqueda (asumiendo que se filtra por título o contenido)
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
                        ["status", "=", true],
                    ],
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
    };

    return (
        <main className="bg-white font-title">
            {/* Hero Section */}
            <section
                className={`px-primary 2xl:px-0 2xl:max-w-7xl mx-auto ${
                    isFilter ? "pt-8" : "py-8"
                }`}
            >
                <div className="space-y-4">
                    <span className="text-primary font-bold">Blog</span>
                    <h1
                        className={` text-3xl md:text-5xl 2xl:text-6xl font-bold tracking-tight ${data?.class_title || "text-primary"}`}
                    >
                        {data?.title ? (
                            <span
                                dangerouslySetInnerHTML={{ __html: data.title }}
                                className="leading-tight block"
                                style={{ lineHeight: "1.1" }}
                            ></span>
                        ) : (
                            <>
                                Descubre lo mejor:
                                <br />
                                Publicaciones sobre el mundo de{" "}
                                {Global.APP_NAME}
                            </>
                        )}
                    </h1>
                    {data?.description && (
                        <p className="customtext-neutral-dark opacity-80 text-base 2xl:text-xl font-title">
                            {data?.description}
                        </p>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative md:w-6/12 flex items-center">
                        <input
                            type="search"
                            value={selectedFilters.name}
                            placeholder="Buscar publicación"
                            className={`w-full px-4 relative py-3 border border-neutral-ligth rounded-xl focus:outline-none focus:ring-0 customtext-neutral-dark transition-all duration-300`}
                            onChange={(e) =>
                                handleFilterChange("name", e.target.value)
                            }
                        />
                        <div className="absolute right-3 p-2 rounded-xl bg-primary pointer-events-none">
                            <Search className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="flex w-full gap-2 md:gap-4 md:w-5/12 items-center font-paragraph">
                        <div className="w-1/2 md:w-full">
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
                            />
                        </div>
                        <input
                            type="date"
                            value={selectedFilters.post_date}
                            className={`w-1/2 md:w-full px-4 py-3 border border-neutral-ligth rounded-xl focus:outline-none focus:ring-0 customtext-neutral-dark transition-all duration-300`}
                            onChange={(e) => {
                                handleFilterChange("post_date", e.target.value);
                            }}
                        />
                        {isFilter && (
                            <button
                                onClick={clearFilters}
                                className="flex-shrink-0 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                title="Limpiar filtros"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Featured Posts */}
                {!isFilter && headerPosts.length > 0 && (
                    <div className="mt-12 flex gap-8 py-[2.5%] rounded-2xl">
                        <div className="w-full md:w-1/2">
                            <BlogPostCard
                                data={data}
                                featured
                                post={headerPosts[0]}
                            />
                        </div>
                        <div className="hidden md:flex space-y-4  flex-col w-1/2">
                            {headerPosts.slice(1, 4).map((post) => (
                                <BlogPostCard
                                    data={data}
                                    flex
                                    key={post.id}
                                    post={post}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
