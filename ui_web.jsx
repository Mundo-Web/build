import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  Star, 
  Plus,
  Play,
  ArrowUpRight,
  Trash2,
  Minus,
  Eye,
  Globe,
  Award,
  Users,
  Box
} from 'lucide-react';

/**
 * SISTEMA DE COLORES
 * Primary: #000000
 * Secondary: #ffffff
 */
const ColorStyles = () => (
  <style>{`
    :root {
      --bg-primary: #000000;
      --bg-primary-hover: #1a1a1a;
      --bg-secondary: #ffffff;
      --bg-accent: #f3f4f6;
      --bg-neutral-light: #fafafa;
      --bg-neutral-dark: #0a0a0a;
      --bg-page-background: #ffffff;
    }
    .bg-primary { background-color: var(--bg-primary); }
    .text-primary { color: var(--bg-primary); }
    .bg-secondary { background-color: var(--bg-secondary); }
    .text-secondary { color: var(--bg-secondary); }
    .bg-page-background { background-color: var(--bg-page-background); }

    /* Animación Marquee */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 20s linear infinite;
    }
  `}</style>
);

// --- DATOS MOCK ---

const MOCK_SLIDERS = [
  {
    id: '1',
    title: 'Minimalist Future',
    subtitle: 'Fall / Winter 2026',
    description: 'La elegancia no es hacerse notar, es ser recordado.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    button_text: 'Explorar Colección',
    link: '#catalogo'
  },
  {
    id: '2',
    title: 'Monochrome Edit',
    subtitle: 'Exclusive Drop',
    description: 'Texturas puras y cortes arquitectónicos.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
    button_text: 'Ver Novedades',
    link: '#ofertas'
  }
];

const MOCK_CATEGORIES = [
  { id: '1', name: 'Man', slug: 'hombres', image: 'https://images.unsplash.com/photo-1516257984-b1b4d8c9230c?auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Woman', slug: 'mujeres', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Accessories', slug: 'accesorios', image: 'https://images.unsplash.com/photo-1509319117193-51043f6556f4?auto=format&fit=crop&w=800&q=80' },
];

const MOCK_ITEMS = [
  {
    id: '101',
    name: 'Oversized Blazer Noir',
    final_price: 120.00,
    price: 120.00,
    discount_percent: 0,
    image: 'https://images.unsplash.com/photo-1548624149-f321d750b3e2?auto=format&fit=crop&w=600&q=80',
    is_new: true,
    offering: false,
    category: { name: 'Woman' }
  },
  {
    id: '102',
    name: 'Essential Cotton Tee',
    final_price: 35.00,
    price: 45.00,
    discount_percent: 22,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    is_new: false,
    offering: true,
    category: { name: 'Man' }
  },
  {
    id: '103',
    name: 'Structured Trench Coat',
    final_price: 240.00,
    price: 240.00,
    discount_percent: 0,
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=600&q=80',
    is_new: true,
    offering: false,
    category: { name: 'Woman' }
  },
  {
    id: '104',
    name: 'Leather Utility Boots',
    final_price: 180.00,
    price: 180.00,
    discount_percent: 0,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80',
    is_new: false,
    offering: false,
    category: { name: 'Unisex' }
  }
];

const MOCK_MOST_VIEWED = [
  {
    id: 'mv1',
    name: 'Silk Scarf Print',
    final_price: 85.00,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?auto=format&fit=crop&w=600&q=80',
    views: '1.2k',
    category: { name: 'Accessories' }
  },
  {
    id: 'mv2',
    name: 'Urban Denim Jacket',
    final_price: 145.00,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    views: '950',
    category: { name: 'Man' }
  },
  {
    id: 'mv3',
    name: 'Minimalist Watch',
    final_price: 210.00,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    views: '3.5k',
    category: { name: 'Accessories' }
  },
  {
    id: 'mv4',
    name: 'Leather Crossbody',
    final_price: 180.00,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    views: '2.1k',
    category: { name: 'Woman' }
  }
];

const MOCK_OFFERS = [
  {
    id: 'off1',
    name: 'Slim Fit Chinos',
    price: 80.00,
    final_price: 56.00,
    discount_percent: 30,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80',
    offering: true,
    category: { name: 'Man' }
  },
  {
    id: 'off2',
    name: 'Summer Linen Dress',
    price: 120.00,
    final_price: 84.00,
    discount_percent: 30,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    offering: true,
    category: { name: 'Woman' }
  },
  {
    id: 'off3',
    name: 'Canvas Sneakers',
    price: 60.00,
    final_price: 45.00,
    discount_percent: 25,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
    offering: true,
    category: { name: 'Unisex' }
  },
  {
    id: 'off4',
    name: 'Travel Backpack',
    price: 95.00,
    final_price: 76.00,
    discount_percent: 20,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    offering: true,
    category: { name: 'Accessories' }
  }
];

const MOCK_INDICATORS = [
  { id: 1, title: "Happy Customers", value: "50", suffix: "k+", icon: Users },
  { id: 2, title: "Global Stores", value: "120", suffix: "", icon: Globe },
  { id: 3, title: "Design Awards", value: "15", suffix: "", icon: Award },
  { id: 4, title: "Products Sold", value: "1", suffix: "M+", icon: Box },
];

// --- COMPONENTES UI AUXILIARES ---

const TopBar = () => (
  <div className="fixed top-0 left-0 w-full h-10 bg-black text-white z-[60] flex items-center overflow-hidden">
    <div className="whitespace-nowrap animate-marquee flex items-center">
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">Envío mundial gratuito en órdenes sobre $200</span>
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">•</span>
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">Nueva Colección Disponible</span>
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">•</span>
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">Suscríbete para 10% OFF</span>
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">•</span>
       {/* Duplicado para loop infinito fluido */}
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">Envío mundial gratuito en órdenes sobre $200</span>
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">•</span>
      <span className="mx-8 text-[10px] font-bold tracking-[0.2em] uppercase">Nueva Colección Disponible</span>
    </div>
  </div>
);

const SearchOverlay = ({ isOpen, onClose }) => (
  <div 
    className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-[70] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
  >
    <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:rotate-90 transition-transform duration-500">
      <X size={32} strokeWidth={1} />
    </button>
    
    <div className="container mx-auto h-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl relative">
        <input 
          type="text" 
          placeholder="BUSCAR PRODUCTOS..." 
          className="w-full bg-transparent border-b-2 border-black py-6 text-2xl md:text-5xl font-black uppercase tracking-tighter placeholder-gray-300 focus:outline-none"
          autoFocus={isOpen}
        />
        <button className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold uppercase tracking-widest hover:text-gray-500">
          Enter
        </button>
      </div>
      <div className="mt-8 flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
        <span>Popular:</span>
        <a href="#" className="hover:text-black hover:underline">Blazer</a>
        <a href="#" className="hover:text-black hover:underline">Boots</a>
        <a href="#" className="hover:text-black hover:underline">Denim</a>
      </div>
    </div>
  </div>
);

const CartDrawer = ({ isOpen, onClose }) => (
  <>
    {/* Backdrop */}
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
    
    {/* Drawer */}
    <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[75] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-tighter">Shopping Bag (2)</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items List (Mock) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Item 1 */}
          <div className="flex gap-4">
            <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
               <img src={MOCK_ITEMS[0].image} className="w-full h-full object-cover" alt="Item" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm uppercase tracking-wide">{MOCK_ITEMS[0].name}</h3>
                  <span className="font-bold text-sm">${MOCK_ITEMS[0].final_price}</span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Color: Noir</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Size: M</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center border border-gray-200">
                  <button className="p-1 hover:bg-gray-100"><Minus size={12} /></button>
                  <span className="px-2 text-xs font-bold">1</span>
                  <button className="p-1 hover:bg-gray-100"><Plus size={12} /></button>
                </div>
                <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 border-b border-transparent hover:border-red-500 transition-all">Remove</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="font-medium text-gray-500 uppercase tracking-widest">Subtotal</span>
            <span className="font-black text-lg">$300.00</span>
          </div>
          <p className="text-[10px] text-gray-400 mb-6 text-center">Shipping & taxes calculated at checkout</p>
          <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  </>
);

const Header = ({ onSearchClick, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-10 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white border-b border-gray-100 py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMenuOpen(true)}
              className={`flex items-center gap-2 group ${isScrolled ? 'text-black' : 'text-white mix-blend-difference'}`}
            >
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-current transition-all group-hover:w-4"></span>
                <span className="block w-4 h-0.5 bg-current transition-all group-hover:w-6"></span>
              </div>
              <span className="hidden md:block text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0">Menu</span>
            </button>
          </div>

          <div className={`absolute left-1/2 -translate-x-1/2 text-3xl font-black tracking-tighter uppercase ${isScrolled ? 'text-black' : 'text-white mix-blend-difference'}`}>
            Panel<span className="font-light">Pro</span>
          </div>

          <div className={`flex items-center space-x-6 ${isScrolled ? 'text-black' : 'text-white mix-blend-difference'}`}>
            <button onClick={onSearchClick} className="hover:opacity-50 transition-opacity">
               <Search size={20} strokeWidth={1.5} />
            </button>
            <button onClick={onCartClick} className="relative hover:opacity-50 transition-opacity">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-3 h-3 flex items-center justify-center rounded-none">2</span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 bg-white z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-14 right-6 md:right-12 p-2 hover:rotate-90 transition-transform duration-500">
          <X size={32} strokeWidth={1} />
        </button>
        
        <div className="container mx-auto h-full flex items-center justify-center">
          <ul className="space-y-2 text-center">
            {['Home', 'New Arrivals', 'Collection', 'Editorial', 'Stores'].map((item, i) => (
              <li key={item} className="overflow-hidden">
                <a href="#" className="block text-4xl md:text-7xl font-black uppercase tracking-tighter hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-black to-gray-400 transition-all transform hover:skew-x-6">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const HeroSlider = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {MOCK_SLIDERS.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === active ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover object-center grayscale-[20%] contrast-125" 
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20 md:pb-32 px-6 md:px-12">
            <div className="max-w-4xl border-l-2 border-white pl-6 md:pl-10 animate-fade-in-up">
              <span className="text-white font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">{slide.subtitle}</span>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">{slide.title}</h1>
              <a 
                href={slide.link} 
                className="inline-flex items-center text-white text-sm font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all"
              >
                {slide.button_text} <ArrowRight className="ml-3 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-0 right-0 z-30 flex bg-white">
        <button onClick={() => setActive(active === 0 ? 1 : 0)} className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-r border-gray-200 hover:bg-black hover:text-white transition-colors">
          <span className="text-xs font-bold">PREV</span>
        </button>
        <button onClick={() => setActive(active === 0 ? 1 : 0)} className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
          <span className="text-xs font-bold">NEXT</span>
        </button>
      </div>
    </section>
  );
};

const ProductCard = ({ item }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
      <div className="absolute top-0 left-0 p-3 z-10 flex flex-col items-start gap-2">
        {item.is_new && <span className="bg-white text-black text-[9px] font-bold px-2 py-1 uppercase border border-black">New In</span>}
        {item.offering && <span className="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase">Sale</span>}
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-0"></div>
      
      <button className="absolute bottom-0 left-0 right-0 bg-white text-black py-4 font-bold uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 border-t border-black hover:bg-black hover:text-white">
        Add to Cart — ${item.final_price}
      </button>

      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale-[10%] group-hover:grayscale-0"
      />
    </div>

    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-dark group-hover:underline decoration-1 underline-offset-4">{item.name}</h3>
        {item.category && <p className="text-xs text-gray-500 mt-1">{item.category.name}</p>}
      </div>
      <div className="text-sm font-bold">
        {item.offering ? (
          <div className="flex flex-col items-end">
            <span className="text-red-600">${item.final_price.toFixed(2)}</span>
            <span className="text-gray-400 line-through text-xs">${item.price.toFixed(2)}</span>
          </div>
        ) : (
          <span>${item.final_price.toFixed(2)}</span>
        )}
      </div>
    </div>
  </div>
);

const CategoryMosaic = () => (
  <section className="py-20 md:py-32 container mx-auto px-6 md:px-12">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[800px]">
      
      <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden bg-gray-100 min-h-[400px]">
        <img src={MOCK_CATEGORIES[0].image} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" alt="Man Category" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        <div className="absolute bottom-8 left-8">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">{MOCK_CATEGORIES[0].name}</h2>
          <a href="#" className="text-white border-b border-white pb-1 text-sm font-bold uppercase tracking-widest hover:text-gray-200">Shop Collection</a>
        </div>
      </div>

      <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden bg-gray-100 min-h-[300px]">
        <img src={MOCK_CATEGORIES[1].image} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" alt="Woman Category" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        <div className="absolute bottom-6 left-6">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{MOCK_CATEGORIES[1].name}</h2>
          <ArrowUpRight className="text-white" />
        </div>
      </div>

      <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden bg-black text-white flex items-center justify-center min-h-[300px]">
        <div className="text-center p-8 group-hover:scale-105 transition-transform">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 block">Limited Edition</span>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Accessories</h2>
          <a href="#" className="inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
            View All
          </a>
        </div>
      </div>
    </div>
  </section>
);

// --- BANNER 1: CAMPAÑA (Llamada a la Acción) ---
const MidSectionBanner = () => (
  <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white my-12">
    <div className="absolute inset-0 opacity-60">
      <img 
        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=80" 
        alt="Fashion Campaign" 
        className="w-full h-full object-cover"
      />
    </div>
    
    <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">
      <span className="block text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 text-gray-300">
        Campaign 2026
      </span>
      <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
        Rebel <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Elegance</span>
      </h2>
      <button className="bg-white text-black px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 border border-white">
        Compra Ahora
      </button>
    </div>
  </section>
);

// --- BANNER 2: ACCIÓN SECUNDARIA ---
const SecondActionBanner = () => (
  <section className="relative py-24 bg-neutral-900 text-white overflow-hidden">
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6">The Monogram Edit</span>
      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight">
        Personaliza tu <br/><span className="italic font-serif font-light text-gray-400">identidad</span>
      </h2>
      <p className="max-w-xl text-gray-400 mb-10 text-sm leading-relaxed">
        Descubre nuestra nueva línea de personalización. Bordados exclusivos, materiales premium y la posibilidad de hacer que cada pieza sea verdaderamente tuya.
      </p>
      <button className="bg-transparent border border-white text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
        Descubrir Atelier
      </button>
    </div>
  </section>
);

// --- SECCIÓN: PRODUCTOS MÁS VISTOS (GRID REFACTORED) ---
const MostViewedSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6 md:px-12">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Most Viewed <br/>Items</h2>
        <a href="#" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
          View Trends <ArrowRight size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
        {MOCK_MOST_VIEWED.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  </section>
);

// --- NUEVA SECCIÓN: OFERTAS ---
const OffersSection = () => (
  <section id="ofertas" className="py-20 bg-neutral-50">
    <div className="container mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Limited Time Only</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Exclusive Offers</h2>
        <div className="w-16 h-1 bg-black mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
        {MOCK_OFFERS.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  </section>
);

// --- NUEVA SECCIÓN: INDICADORES ---
const IndicatorsSection = () => (
  <section className="py-16 bg-black text-white border-t border-neutral-800">
    <div className="container mx-auto px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {MOCK_INDICATORS.map((indicator) => (
          <div key={indicator.id} className="flex flex-col items-center text-center p-6 border border-neutral-800 hover:border-white transition-colors group">
            <indicator.icon size={32} strokeWidth={1} className="mb-4 text-gray-500 group-hover:text-white transition-colors" />
            <div className="text-4xl md:text-5xl font-black mb-2 flex items-baseline">
              {indicator.value}<span className="text-2xl text-gray-500">{indicator.suffix}</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
              {indicator.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-neutral-900 text-white pt-24 pb-8 border-t border-black">
    <div className="container mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        
        {/* Brand Column */}
        <div className="md:col-span-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Panel<span className="font-light">Pro</span></h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Redefiniendo el lujo moderno a través de la simplicidad y la artesanía superior. Diseñado para el individuo contemporáneo.
          </p>
          <div className="flex space-x-4">
             {/* Social Placeholders */}
             <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"><span className="font-bold text-xs">IG</span></div>
             <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"><span className="font-bold text-xs">FB</span></div>
             <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"><span className="font-bold text-xs">TW</span></div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-white">Shop</h4>
          <ul className="space-y-4 text-xs font-medium tracking-wide uppercase text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Clothing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-white">Support</h4>
          <ul className="space-y-4 text-xs font-medium tracking-wide uppercase text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-white">Newsletter</h4>
          <p className="text-gray-400 text-xs mb-6">Suscríbete para recibir actualizaciones exclusivas y acceso anticipado a nuestras colecciones.</p>
          <div className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="bg-transparent border border-gray-700 p-3 text-xs text-white focus:outline-none focus:border-white w-full placeholder-gray-600 uppercase tracking-widest" 
            />
            <button className="bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <p>&copy; 2026 PanelPro System. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0 items-center">
          <span>Secure Payment</span>
          <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="w-8 h-5 bg-gray-700 rounded-sm"></div> {/* Placeholder VISA */}
             <div className="w-8 h-5 bg-gray-700 rounded-sm"></div> {/* Placeholder MC */}
             <div className="w-8 h-5 bg-gray-700 rounded-sm"></div> {/* Placeholder AMEX */}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      <ColorStyles />
      
      <TopBar />
      
      <Header 
        onSearchClick={() => setSearchOpen(true)} 
        onCartClick={() => setCartOpen(true)}
      />
      
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main>
        <HeroSlider />
        
        <div className="container mx-auto px-6 md:px-12 py-20 text-center max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-gray-400">Philosophy</p>
          <h2 className="text-2xl md:text-4xl leading-tight font-medium">
            Creemos en el diseño que trasciende las temporadas. Piezas construidas para durar.
          </h2>
        </div>

        {/* 1. Categorías */}
        <CategoryMosaic />
        
        {/* 2. Banner Campaña */}
        <MidSectionBanner />
        
        {/* 3. Catálogo Principal */}
        <section id="catalogo" className="container mx-auto px-6 md:px-12 py-12 md:py-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Selected <br/>Items</h2>
            <a href="#" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
              View Full Catalog <ArrowRight size={14} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
            {MOCK_ITEMS.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 4. Productos Más Vistos (GRID MEJORADO) */}
        <MostViewedSection />

        {/* 5. Banner Acción Secundaria */}
        <SecondActionBanner />

        {/* 6. Sección Ofertas */}
        <OffersSection />

        {/* 7. Indicadores de Empresa */}
        <IndicatorsSection />

      </main>

      <Footer />
    </div>
  );
}