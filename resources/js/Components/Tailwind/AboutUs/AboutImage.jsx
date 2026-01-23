import React from "react"

const AboutImage = ({ data }) => {
    return (
        <div id={data?.element_id || null} className="mx-auto p-[5%]">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="relative w-full md:w-1/2 aspect-square max-w-lg mx-auto">
                    <img alt="Productos ecológicos Kuchara" decoding="async" data-nimg="fill" className="object-contain w-full aspect-square" src={data?.url_imagen} />
                </div>
                <div className="w-full md:w-1/2 text-left">
                    <h1 className="text-2xl whitespace-pre-line md:text-4xl font-bold customtext-primary mb-8 leading-tight font-title">
                        {data?.title}
                    </h1>
                    <div className="space-y-8 text-gray-800">
                        <p className="whitespace-pre-line">{data?.description}</p>
                        <a href={data?.about_url ?? '/about'} className="w-max flex items-center border h-10 mt-4 bg-accent customtext-primary  hover:bg-primary font-bold hover:text-white rounded-full px-8 transition-all">Nosotros</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutImage