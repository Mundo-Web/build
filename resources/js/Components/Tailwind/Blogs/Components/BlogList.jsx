import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import BlogPostCard from "./BlogPostCard";
import { Loading } from "../../Components/Resources/Loading";
import { NoResults } from "../../Components/Resources/NoResult";

export default function BlogList({ data, posts, postsLatest, loading, isFilter }) {
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

  // Variantes para títulos
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
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

  // Variantes para grids
  const gridVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  };

  // Variantes para cards - animaciones amigables y bonitas
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1], // Curva de animación suave
        type: "spring",
        damping: 20,
        stiffness: 100
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  return (
    <motion.section
      ref={listRef}
      className={`font-paragraph ${isFilter ? "pb-16" : "pb-16"}`}
      variants={containerVariants}
      initial="hidden"
      animate={listInView ? "visible" : "hidden"}
    >
      <motion.div className="px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto" variants={containerVariants}>
        {!isFilter ? (
          <motion.div variants={containerVariants}>
            <motion.h2 
              className="text-3xl font-bold mb-4 font-title customtext-primary"
              variants={titleVariants}
              whileHover={{
                scale: 1.02,
            
                transition: { duration: 0.3 }
              }}
            >
              {
                data?.second_title ? data?.second_title : 'Últimas publicaciones'
              }
            </motion.h2>
            {
              data?.second_description &&
              <motion.p 
                className="text-gray-600 mb-8"
                variants={descriptionVariants}
                whileHover={{
                  color: "#374151",
                  transition: { duration: 0.3 }
                }}
              >
                Nam tempor diam quis urna maximus, ac laoreet arcu
                convallis. Aenean dignissim nec sem quis consequat.
              </motion.p>
            }
            <motion.div 
              className="grid mt-8 grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
              variants={gridVariants}
            >
              {Array.isArray(postsLatest) &&
                postsLatest.length > 0 ? (
                postsLatest.map((post, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      rotateY: 5,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      transition: { 
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <BlogPostCard data={data} post={post} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="col-span-3 my-8"
                  variants={utilityVariants}
                >
                  <NoResults />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
            variants={gridVariants}
          >
            {loading ? (
              <motion.div 
                className="col-span-3 my-8"
                variants={utilityVariants}
                animate={{
                  scale: [1, 1.02, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Loading />
              </motion.div>
            ) : Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { 
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                >
                  <BlogPostCard data={data} post={post} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-3 my-8"
                variants={utilityVariants}
              >
                <NoResults />
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}
