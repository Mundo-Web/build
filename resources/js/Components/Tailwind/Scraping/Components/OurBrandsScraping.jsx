// Nuestro componente en React
import React from 'react';

const OurBrandsScraping = ({ brands }) => {
    return (
        <div className=' px-primary mx-auto font-paragraph customtext-neutral-dark'>
            <div className="bg-primary text-center py-16 rounded-3xl p-6 ">
                <h1 className="text-[40px] font-bold mb-4">Nuestras Marcas</h1>
                <p className=" mb-8 w-9/12 mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu fermentum justo, ac fermentum nulla. Sed sed scelerisque urna, vitae ultrices libero. Pellentesque vehicula et urna in venenatis.
                </p>
                <div className="flex  w-full items-center justify-center gap-8">
                    {
                        brands &&
                        brands.slice(0, 5).map((brand, index) => (
                            <img key={index} src={`/storage/images/brand/${brand.image}`} alt={brand.name} className="w-auto h-10 object-contain grayscale brightness-0 invert-0" />
                        ))
                    }


                </div>
            </div>
        </div>
    );
}

export default OurBrandsScraping;