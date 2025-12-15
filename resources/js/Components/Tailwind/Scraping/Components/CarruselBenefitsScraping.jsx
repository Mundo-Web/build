
import { useEffect, useRef, useState } from "react";


const CarruselBenefitsScraping = ({ items }) => {




    //infiniteBenefits si lo quiere infinito reemplaza
    //va en el div incial ref = { benefitsRef }
    // va en el div antes de hacer el map ref={sliderRef}
    return (
        <div className=" px-primary mx-auto   overflow-hidden customtext-neutral-dark font-paragraph">
            <div className=" relative bg-secondary   rounded-3xl p-6 ">
                <div
                    className="flex w-full gap-8 whitespace-nowrap transition-none"
                >
                    {items.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4 justify-start w-1/3 "> {/*para infinito usa esto flex-shrink-0*/}
                            <div className="relative w-10 h-10  bg-transparent flex items-center justify-center">

                                {/* Ícono */}
                                <div className="relative z-10 text-3xl">
                                    <img src={`/storage/images/indicator/${benefit.symbol}`} className="w-auto h-[40px] " />
                                </div>
                            </div>


                            <div>
                                <p className="text-base font-bold break-words whitespace-normal w-full ">{benefit.name}</p>
                                <p className="text-sm customtext-neutral-light break-words whitespace-normal w-full ">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CarruselBenefitsScraping;