import React, { useState, useEffect, useRef } from "react";
import Global from "../../../Utils/Global";
import ItemsRest from "../../../Actions/ItemsRest";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import { AnimatePresence, motion } from "framer-motion";

const itemsRest = new ItemsRest()

const HeaderSimple = ({ data, cart, setCart, pages, generals = [] }) => {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchBarRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity)
  }, 0)

  // Effect for sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target) && 
          !searchInputRef.current?.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC key to close
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showSuggestions) {
          setShowSuggestions(false);
        } else if (searchBarOpen) {
          setSearchBarOpen(false);
          setSearchQuery('');
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showSuggestions, searchBarOpen]);

  // Debounced search with loading state
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 2) {
      setIsLoadingSearch(true);
      setShowSuggestions(true);
      searchTimeoutRef.current = setTimeout(() => {
        itemsRest.paginate({
          filter: [
            ['name', 'contains', searchQuery], 'or',
            ['summary', 'contains', searchQuery], 'or',
            ['description', 'contains', searchQuery]
          ]
        })
          .then(({ data }) => {
            setSearchResults(data || []);
            setIsLoadingSearch(false);
          })
          .catch(() => {
            setSearchResults([]);
            setIsLoadingSearch(false);
          });
      }, 300); // 300ms debounce
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
      setIsLoadingSearch(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const getContact = (correlative) => {
    return (
      generals?.find((item) => item.correlative === correlative)
        ?.description || ""
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      const selectedResult = searchResults[selectedSuggestionIndex];
      if (selectedResult) {
        window.location.href = `/${data?.path_product}/${selectedResult.slug}`;
      }
    }
  };

  // Variantes de animación para el menú móvil
  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para la barra de búsqueda
  const searchBarVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <header className={`w-full top-0 left-0 z-[100] transition-all duration-300 sticky ${isFixed ? "shadow-lg" : ""} bg-primary ${data?.class || ''}`}>
        <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Section */}
            <a href="/" className="flex items-center z-[101]">
              <img 
                className="h-12 md:h-14 aspect-[13/4] object-contain object-center w-auto" 
                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} 
                alt={Global.APP_NAME} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/img/logo-bk.svg';
                }} 
              />
            </a>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-8 font-paragraph">
              {pages
                .filter((x) => x.menuable)
                .map((page, index) => (
                  <a
                    key={index}
                    href={page.pseudo_path || page.path}
                    className="relative group text-white font-title text-sm md:text-base 2xl:text-xl font-medium py-2 transition-all duration-300 hover:customtext-accent cursor-pointer"
                  >
                    {page.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-3">
              
              {/* Icon mail */}
              <a href={`mailto:${getContact('email_contact')}`} className="hidden lg:block">
                <button 
                  type="button"
                  className="bg-accent customtext-neutral-dark  hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M1.66699 5L7.42784 8.26414C9.55166 9.4675 10.449 9.4675 12.5728 8.26414L18.3337 5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                    <path d="M1.68013 11.23C1.73461 13.7847 1.76185 15.0619 2.70446 16.0082C3.64706 16.9543 4.95893 16.9872 7.58268 17.0532C9.19974 17.0938 10.8009 17.0938 12.418 17.0532C15.0417 16.9872 16.3536 16.9543 17.2962 16.0082C18.2388 15.0619 18.2661 13.7847 18.3205 11.23C18.3381 10.4086 18.3381 9.59208 18.3205 8.77066C18.2661 6.21604 18.2388 4.93873 17.2962 3.99254C16.3536 3.04635 15.0417 3.01339 12.418 2.94747C10.8009 2.90683 9.19974 2.90683 7.58268 2.94746C4.95893 3.01338 3.64706 3.04633 2.70445 3.99253C1.76184 4.93873 1.73461 6.21603 1.68013 8.77066C1.66261 9.59208 1.66262 10.4086 1.68013 11.23Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                  </svg>
                </button>
              </a>

              {/* Icon phone*/}
              <a href={`tel:${getContact('phone_contact')}`} className="hidden lg:block">
                <button 
                  type="button"
                  className="bg-accent customtext-neutral-dark  hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.63188 4.76019L7.29633 4.00521C7.07693 3.51157 6.96723 3.26473 6.80317 3.07584C6.59756 2.83912 6.32956 2.66495 6.02973 2.57321C5.79049 2.5 5.52038 2.5 4.98017 2.5C4.18992 2.5 3.7948 2.5 3.46311 2.65191C3.07239 2.83085 2.71953 3.2194 2.57894 3.6255C2.45959 3.97024 2.49378 4.32453 2.56215 5.03308C3.28992 12.5752 7.42485 16.7101 14.9669 17.4378C15.6755 17.5062 16.0298 17.5404 16.3745 17.4211C16.7806 17.2805 17.1691 16.9276 17.3481 16.5369C17.5 16.2052 17.5 15.8101 17.5 15.0198C17.5 14.4796 17.5 14.2095 17.4268 13.9702C17.335 13.6704 17.1609 13.4024 16.9241 13.1968C16.7353 13.0327 16.4885 12.9231 15.9948 12.7037L15.2398 12.3681C14.7052 12.1305 14.4379 12.0117 14.1663 11.9859C13.9063 11.9612 13.6442 11.9977 13.4009 12.0924C13.1466 12.1914 12.922 12.3787 12.4725 12.7532C12.0251 13.126 11.8015 13.3124 11.5281 13.4122C11.2858 13.5007 10.9655 13.5336 10.7103 13.4959C10.4224 13.4535 10.202 13.3358 9.76105 13.1001C8.38938 12.3671 7.63294 11.6107 6.89989 10.2389C6.66428 9.79808 6.54648 9.57758 6.50406 9.28975C6.46645 9.0345 6.49923 8.71417 6.58775 8.47192C6.6876 8.19857 6.87401 7.97488 7.24682 7.5275C7.62135 7.07807 7.80861 6.85335 7.90762 6.59909C8.00237 6.35578 8.03885 6.09367 8.01412 5.83373C7.98828 5.5621 7.86948 5.2948 7.63188 4.76019Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                </button>
              </a>

              {/* Icon search */}
              <button
                type="button"
                className="bg-accent customtext-neutral-dark hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                onClick={() => setSearchBarOpen(!searchBarOpen)}
              >
                {searchBarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14.167 14.167L17.5003 17.5003" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Icon menu hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden bg-accent customtext-neutral-dark hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3.33301 5H16.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M3.33301 10H16.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M3.33301 15H16.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <nav className="px-primary py-4 space-y-3">
                {pages
                  .filter((x) => x.menuable)
                  .map((page, index) => (
                    <a
                      key={index}
                      href={page.pseudo_path || page.path}
                      className="block py-2 customtext-neutral-dark hover:customtext-primary font-medium transition-colors duration-200"
                    >
                      {page.name}
                    </a>
                  ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Bar Expandible - Below Header */}
      <AnimatePresence>
        {searchBarOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={searchBarVariants}
            className="w-full bg-white shadow-lg  fixed top-[72px] md:top-[80px] left-0 right-0 z-[99]"
          >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4">
              <div className="relative  mx-auto">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 customtext-neutral-light">
                  {isLoadingSearch ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M14.167 14.167L17.5003 17.5003" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <form onSubmit={handleFormSubmit}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="¿Qué estás buscando?"
                    className="w-full pl-14 pr-24 py-3 md:py-4 text-base md:text-lg border-2 border-neutral-dark rounded-full focus:border-primary focus:outline-none transition-colors duration-200"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 customtext-neutral-light  transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </form>
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="mt-4 mx-auto max-h-[50vh] overflow-y-auto bg-white rounded-lg">
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((result, index) => (
                        <motion.a
                          href={`/${data?.path_product}/${result.slug}`}
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={`px-4 py-3 flex gap-4 items-center transition-all duration-200 ${
                            selectedSuggestionIndex === index
                              ? 'bg-gray-100'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <motion.img
                            src={`/storage/images/item/${result.image}`}
                            className="h-20 w-24 object-contain rounded-lg "
                            alt={result.name}
                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate text-gray-800 text-sm md:text-base mb-1">{result.name}</h3>
                            
                            {result?.final_price && Number(result.final_price) > 0 && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base font-bold customtext-primary">
                                  {CurrencySymbol()} {Number2Currency(result.final_price)}
                                </span>
                                {result?.discount_percent > 0 && Number(result.final_price) < Number(result.price) && (
                                  <span className="text-xs line-through text-neutral-light font-normal">
                                    {CurrencySymbol()} {Number2Currency(result.price)}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {result.summary && (
                              <p className="text-xs md:text-sm text-gray-500 truncate">{result.summary}</p>
                            )}
                          </div>
                          <motion.svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 20 20" 
                            fill="none" 
                            className="flex-shrink-0 text-neutral-light"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </motion.svg>
                        </motion.a>
                      ))}
                    </div>
                  ) : !isLoadingSearch ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-8 text-center text-gray-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-gray-300">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8 11H14M11 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <p className="text-base font-medium">No se encontraron resultados</p>
                      <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                    </motion.div>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HeaderSimple
