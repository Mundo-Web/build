import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { Loading } from "../../Components/Resources/Loading";
import { NoResults } from "../../Components/Resources/NoResult";
import { TrendingUp, Calendar } from "lucide-react";
import BlogPostCardMultivet from "./BlogPostCardMultivet";

export default function BlogListMultivet({ data, posts, postsLatest, loading, isFilter }) {
  // Referencias para animaciones
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, threshold: 0.1 });

  // Variantes de animación para contenedores
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

  // Variantes para títulos con estilo Multivet
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

  // Variantes para descripciones
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

  // Variantes para grids con animación de despliegue
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

  // Variantes para cards con estilo Multivet más elegante
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

  // Variantes para elementos de loading/no results
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
                    Últimas <span className="text-primary font-title ">Publicaciones</span>
               
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

            {/* Grid de posts con estilo Multivet */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              variants={gridVariants}
            >
              {Array.isArray(postsLatest) && postsLatest.length > 0 ? (
                postsLatest.map((post, index) => (
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
                    <BlogPostCardMultivet data={data} post={post} />
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
                    <BlogPostCardMultivet data={data} post={post} />
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
}