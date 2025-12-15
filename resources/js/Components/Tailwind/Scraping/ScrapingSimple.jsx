import { useRef, useState } from 'react';
import ScrapRest from '../../../Actions/Scraping/ScrapRest';
import { Search } from 'lucide-react';
import { Loading } from '../Components/Resources/Loading';
import SelectForm from '../Filters/Components/SelectForm';
import HeaderScraping from './Components/HeaderScraping';
import MenuScraping from './Components/MenuScraping';
import BannerPublicitarioScraping from './Components/BannerPublicitarioScraping';

import CarruselBenefitsScraping from './Components/CarruselBenefitsScraping';
import CategoriesScraping from './Components/CategoriesScraping';
import BannerCategoryScraping from './Components/BannerCategoryScraping';
import ListProductsScraping from './Components/ListProductsScraping';
import OurBrandsScraping from './Components/OurBrandsScraping';
import ClientSatisfactionScraping from './Components/ClientSatisfactionScraping';

const ScrapingSimple = ({ pages, filteredData, items, cart, setCart }) => {
    const { categories, brands, priceRanges, subcategories, indicators } = filteredData;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);


    return (
        <>

            <MenuScraping items={categories} pages={pages} />

            <BannerPublicitarioScraping />
            <CarruselBenefitsScraping items={indicators} />
            <CategoriesScraping items={categories} />
            <div className="flex gap-4 px-primary mx-auto">
                {
                    [1, 2].map((item, index) => (
                        <BannerCategoryScraping key={index} />
                    ))
                }
            </div>
            <ListProductsScraping title='Destacados' products={items} cart={cart} setCart={setCart} />
            <OurBrandsScraping brands={brands} />
            <ListProductsScraping title='En oferta' products={items} cart={cart} setCart={setCart} />
            <ClientSatisfactionScraping />


        </>
    );
};

export default ScrapingSimple;

/*
    <div className='px-primary mx-auto py-20'>


                <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out mt-12">
                    {loading && <Loading />}
                    {products &&
                        products.map((product, index) => (
                            <div
                                key={index}
                                className="group w-full px-2 sm:w-1/4 flex-shrink-0 font-font-secondary cursor-pointer"
                            >
                                <div
                                    className="bg-white rounded-xl shadow-md p-4"
                                    style={{ boxShadow: "0px 0px 6px 0px #00000040" }}
                                >
                                    <div className="relative">
                                        {product?.discount != null && !isNaN(product?.discount) && (
                                            <span className="absolute top-2 left-2 bg-[#F93232] text-white text-base font-medium px-2 py-1 rounded-full">
                                                -{Number((product?.discount * 100 / product?.price)).toFixed(0)}%
                                            </span>
                                        )}
                                        <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center p-4">
                                            <img
                                                src={product?.image}
                                                alt={product?.name}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-hidden max-h-0 pb-4 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-[max-height,opacity] duration-1000 ease-in-out flex gap-2 my-2 transform group-hover:translate-y-0 translate-y-4">
                                        <a
                                            href="#"
                                            className="flex-1 inline-flex items-center justify-center font-bold text-sm bg-primary text-white py-3 rounded-xl shadow-lg transition-all duration-300 hover:opacity-90"
                                        >
                                            Ver detalle
                                        </a>
                                        <button
                                            className="py-2 px-2.5 border border-primary rounded-lg customtext-primary transition-all duration-300 hover:opacity-90"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div>
                                        <h3 className="customtext-neutral-dark text-sm font-semibold mb-2 line-clamp-2">
                                            {product?.name}
                                        </h3>
                                        <div className="flex flex-col items-baseline gap-2 mb-4">
                                            {product?.discount != null && !isNaN(product?.discount) && (
                                                <span className="text-xs customtext-neutral-light font-semibold1 line-through">
                                                    {CurrencySymbol()} {product?.price}
                                                </span>
                                            )}
                                            <span className="customtext-neutral-dark text-2xl font-bold">
                                                {CurrencySymbol()} {product?.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
             */