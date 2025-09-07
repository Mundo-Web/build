import React, { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CardProductMultivet from './Components/CardProductMultivet';
import CardProductKatya from './Components/CardProductKatya';

const ProductMultivet = ({ items, data, favorites = [], setFavorites }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Referencias para animaciones
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const carouselRef = useRef(null);

  // Detectar cuando los elementos entran en el viewport
  const sectionInView = useInView(sectionRef, { once: true, threshold: 0.1 });
  const headerInView = useInView(headerRef, { once: true, threshold: 0.3 });
  const carouselInView = useInView(carouselRef, { once: true, threshold: 0.2 });

  console.log("ProductMultivet items:", items);
  console.log("ProductMultivet data:", data);

  // Determinar qué tipo de card usar
  const cardType = data?.cardType || 'multivet'; // 'multivet' o 'katya'

  // Obtener categorías únicas de los productos
  const categories = useMemo(() => {
    if (!items || items.length === 0) return ['Todos'];

    const uniqueCategories = ['Todos'];
    const categorySet = new Set();

    items.forEach(item => {
      if (item.category) {
        const categoryName = item.category.name || item.category;
        if (!categorySet.has(categoryName)) {
          categorySet.add(categoryName);
          uniqueCategories.push(categoryName);
        }
      }
    });

    return uniqueCategories;
  }, [items]);

  // Filtrar productos por categoría
  const filteredProducts = useMemo(() => {
    if (!items || items.length === 0) return [];

    return selectedCategory === 'Todos'
      ? items
      : items.filter(product => {
        const categoryName = product.category?.name || product.category;
        return categoryName === selectedCategory;
      });
  }, [items, selectedCategory]);

  // Variantes de animación
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const carouselVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const productVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Si no hay productos
  if (!items || items.length === 0) {
    return (
      <div className="hidden w-full px-primary p-4 mx-auto">

      </div>
    );
  }

  return (
    <motion.section
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={sectionInView ? "visible" : "hidden"}
      className={`py-16 bg-gray-50 ${data?.class_section || ""}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12"
        >
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="text-3xl md:text-5xl font-bold customtext-secondary mb-4 font-title"
          >
            {data?.title || "Productos Destacados"}
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="customtext-neutral-light text-lg max-w-2xl mx-auto"
          >
            {data?.description || "Descubre nuestra selección de productos veterinarios de las mejores marcas nacionales e internacionales"}
          </motion.p>
        </motion.div>

        {/* Category filters */}
        {data?.show_categories && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                    ? 'bg-secondary text-white shadow-lg'
                    : 'bg-white customtext-neutral-light hover:bg-primary hover:text-white border border-gray-300'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
 {data?.button_top && data?.link_catalog && (
          <div className="text-center mt-12">
            <motion.a
              href={data.link_catalog}
              className={`inline-flex items-center gap-3 px-8 py-4 bg-primary font-bold customtext-primary  rounded-lg hover:bg-secondary hover:text-white transform hover:scale-105 transition-all duration-300 ${data?.class_button || ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {data?.text_button || "Ver todos los productos"}
            </motion.a>
          </div>
        )}



        {/* Products grid */}
        <motion.div
          ref={carouselRef}
          variants={carouselVariants}
          initial="hidden"
          animate={carouselInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id || index}
              variants={productVariants}
              className="flex"
            >
              {cardType === 'katya' ? (
                <CardProductKatya
                  product={product}
                  data={data}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              ) : (
                <CardProductMultivet
                  product={product}
                  data={data}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* View all products button */}
        {data?.button_bottom && data?.link_catalog && (
          <div className="text-center mt-12">
            <motion.a
              href={data.link_catalog}
              className={`inline-flex items-center gap-3 px-8 py-4 bg-primary font-bold customtext-primary  rounded-lg hover:bg-secondary hover:text-white transform hover:scale-105 transition-all duration-300 ${data?.class_button || ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {data?.text_button || "Ver todos los productos"}
            </motion.a>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ProductMultivet;