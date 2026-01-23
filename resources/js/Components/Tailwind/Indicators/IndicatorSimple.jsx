import React from "react"

const IndicatorSimple = ({ items, data }) => {
  return (
    <section id={data?.element_id || null} className="bg-accent w-full">
      <div className="px-primary py-[2.5%] 2xl:max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:justify-center w-full gap-6 md:gap-4 lg:gap-8">
          {items.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4 justify-center w-full">
              <div className="flex-shrink-0">
                <div className="bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center">
                  <img
                    src={`/storage/images/indicator/${benefit.symbol}`}
                    onError={(e) => (e.target.src = "assets/img/noimage/no_imagen_circular.png")}
                    className="w-8 h-8 object-contain"
                    alt={benefit.name}
                  />
                </div>
              </div>
              <p children={benefit.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IndicatorSimple