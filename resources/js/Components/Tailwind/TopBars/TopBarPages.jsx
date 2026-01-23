import { useEffect, useRef, useState } from "react";
import General from "../../../Utils/General"
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import Tippy from "@tippyjs/react";
import Global from "../../../Utils/Global";
import AnimatedCintillo from "../Components/AnimatedCintillo";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";
import useCintillos from "../../../Hooks/useCintillos";


const TopBarPages = ({ items, data, pages = [] }) => {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(true);
  const lastScroll = useRef(0);
  const { hasActiveCintillos } = useCintillos();

  useEffect(() => {

    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 60) {
        setShow(false); // Oculta al bajar
      } else {
        setShow(true); // Muestra al subir
      }
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Obtener tags activos al cargar el componente
    const fetchTags = async () => {
      try {
        const response = await tagsItemsRest.getTags();
        if (response?.data) {
          // Filtrar y ordenar tags: promocionales activos primero, luego permanentes
          const activeTags = response.data.filter(tag =>
            tag.promotional_status === 'permanent' || tag.promotional_status === 'active' && tag.menu === "1" || tag.menu === 1
          ).sort((a, b) => {
            // Promocionales activos primero
            if (a.promotional_status === 'active' && b.promotional_status !== 'active') return -1;
            if (b.promotional_status === 'active' && a.promotional_status !== 'active') return 1;
            // Luego por nombre
            return a.name.localeCompare(b.name);
          });

          setTags(activeTags);

          // Log para debug: mostrar información promocional
          const promotionalCount = activeTags.filter(t => t.promotional_status === 'active').length;
          const permanentCount = activeTags.filter(t => t.promotional_status === 'permanent').length;

          if (promotionalCount > 0) {
            const activePromotions = activeTags.filter(t => t.promotional_status === 'active');
          }
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Si no hay cintillos activos y este TopBar se usa principalmente para mostrar cintillos,
  // evaluamos si debe ocultarse o mantenerse para páginas y tags
  if (!hasActiveCintillos && !data?.isCopyright && (!pages || pages.length === 0) && (!tags || tags.length === 0)) {
    return null;
  }
  return (
    <section
      id={data?.element_id || null}
      ref={sectionRef}
      className={`${data?.background_color ? data?.background_color : "bg-primary"}  font-paragraph font-bold transition-all duration-300 w-full z-50  ${data?.border_color ? `border-t-2 ${data?.border_color}` : ""} text-white`}
    >
      <div className="px-primary  mx-auto py-1.5 flex flex-wrap justify-center md:justify-between items-center gap-2 2xl:max-w-7xl 2xl:px-0">
        <div className={`flex items-center gap-4 ${data?.pages_mobile || ""}`}>
          {
            pages && pages.length > 0 ? pages
              .filter(page => page.menuable)
              .map((page, index, arr) => (

                <a
                  key={index}
                  href={page.path}
                  className={
                    "font-medium text-sm hover:customtext-secondary cursor-pointer transition-all duration-300"
                  }
                >
                  {page.name}
                </a>

              )) : (
              <span className="text-sm opacity-75">No hay páginas configuradas</span>
            )
          }
          {/* Botones de Tags - Ahora al final */}
          <ul>
            {tags.length > 0 && (
              <div className="flex items-center gap-4 lg:gap-4 text-sm">
                {tags.map((tag, index) => (
                  <li key={tag.id} className="">
                    <a
                      href={`/catalogo?tag=${tag.id}`}
                      className={
                        `font-medium rounded-full py-1 px-2 hover:brightness-105 cursor-pointer transition-all duration-300 relative flex items-center gap-2`
                      }
                      style={{
                        backgroundColor: tag.background_color || '#3b82f6',
                        color: tag.text_color || '#ffffff',
                      }}
                      title={tag.description || tag.name}
                    >
                      {tag.icon && (
                        <img
                          src={`/storage/images/tag/${tag.icon}`}
                          alt={tag.name}
                          className="w-4 h-4"
                          onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                      )}

                      {tag.name}
                    </a>
                  </li>
                ))}
              </div>
            )}
          </ul>
        </div>
        <p className={`  text-xs ${data?.cintillo_mobile || "hidden md:block"}`}>{data?.isCopyright ?
          ` Copyright © ${new Date().getFullYear()} ${Global.APP_NAME}. Reservados todos los derechos.`
          : hasActiveCintillos ? <AnimatedCintillo /> : null}</p>


      </div>
    </section>
  );
}

export default TopBarPages;