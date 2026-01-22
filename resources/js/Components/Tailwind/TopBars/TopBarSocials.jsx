import { useEffect, useRef, useState } from "react";
import General from "../../../Utils/General"
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import Tippy from "@tippyjs/react";
import Global from "../../../Utils/Global";
import AnimatedCintillo from "../Components/AnimatedCintillo";
import useCintillos from "../../../Hooks/useCintillos";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaSnapchat,
  FaPinterest,
  FaReddit
} from 'react-icons/fa';

// Redes sociales predefinidas (mismo mapeo que en Socials.jsx)
const predefinedSocials = [
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, iconRef: 'fab fa-facebook' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, iconRef: 'fab fa-instagram' },
  { id: 'twitter', name: 'Twitter/X', icon: FaTwitter, iconRef: 'fab fa-twitter' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, iconRef: 'fab fa-linkedin' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, iconRef: 'fab fa-youtube' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, iconRef: 'fab fa-tiktok' },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, iconRef: 'fab fa-whatsapp' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, iconRef: 'fab fa-telegram' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, iconRef: 'fab fa-discord' },
  { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, iconRef: 'fab fa-snapchat' },
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, iconRef: 'fab fa-pinterest' },
  { id: 'reddit', name: 'Reddit', icon: FaReddit, iconRef: 'fab fa-reddit' }
];


const TopBarSocials = ({ items, data }) => {
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

  // Si no hay cintillos activos y este TopBar se usa principalmente para mostrar cintillos,
  // podemos ocultarlo o mostrar el copyright
  if (!hasActiveCintillos && !data?.isCopyright) {
    return null;
  }
 

   const copyright = General.get('copyright') ?? ''
  const content = copyright.replace(/\{\{([^}]+)\}\}/g, (match, code) => {
    try {
      return eval(code);
    } catch (error) {
      console.error('Error evaluating code:', error);
      return match;
    }
  });
  return (
    <section
      id={data?.element_id || null}
      ref={sectionRef}
      className={`${data?.background_color ? data?.background_color : "bg-primary"} ${data?.color ? data?.color : "text-white"}  font-paragraph font-bold transition-all duration-300 w-full z-50  ${data?.border_color ? `border-t-2 ${data?.border_color}`:""} `}
    >
      <div className="px-primary  mx-auto py-1.5 flex flex-wrap justify-center md:justify-between items-center gap-2 2xl:max-w-7xl 2xl:px-0">
        <p className={`hidden md:block text-xs ${data?.class_copyright || ''}`}>{data?.isCopyright ?
       <>
       {content}
      <span className="italic ">  Powered by  <a href="https://www.mundoweb.pe" target="_blank" rel="noopener noreferrer">MundoWeb</a></span>
       </>
        : hasActiveCintillos ? <AnimatedCintillo /> : null}</p>
      
        <div className="flex gap-4">
          {
            items && items.length > 0 ? items.map((social, index) => {
              // Buscar el icono correcto basado en la descripción o el iconRef
              const socialData = predefinedSocials.find(s => 
                s.name === social.description || 
                s.iconRef === social.icon ||
                s.name.toLowerCase() === social.description?.toLowerCase()
              );
              
              const IconComponent = socialData?.icon;

              return (
                <Tippy
                  key={index}
                  content={`Ver ${social.name || social.description || 'Red social'}`}>
                  <a
                    className={`text-xl w-8 h-8 flex items-center justify-center rounded-full p-2 ${data?.class_icon ? data?.class_icon : "customtext-primary"} hover:scale-110 transition-transform duration-200 cursor-pointer`}
                    href={social.url || social.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!social.url && !social.link) {
                        e.preventDefault();
                        console.warn('URL no configurada para:', social);
                      }
                    }}
                  >
                    {
                      IconComponent ? (
                        <IconComponent className="w-5 h-5" />
                      ) : (
                        <i className={social.icon || 'fab fa-globe'} />
                      )
                    }
                  </a>
                </Tippy>
              );
            }) : (
              <span className="text-sm opacity-75">No hay redes sociales configuradas</span>
            )
          }
        </div>
      </div>
    </section>
  );
}

export default TopBarSocials;