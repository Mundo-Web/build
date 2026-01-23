import React from "react";

const StepKuchara = ({ data }) => {
  const steps = data?.steps?.split('>') ?? ['Carro de la compra', 'Detalles de Pago', 'Orden completada'];
  const selected = data?.selected ?? 1;

  return (
    <section id={data?.element_id || null} className="bg-white px-[5%] py-8">
      <div className="flex justify-between items-start relative max-w-3xl mx-auto">
        {/* Línea de progreso */}
        <div className="absolute h-0.5 bg-primary top-4 left-[10%] right-[10%] z-0"></div>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index < selected 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index < selected ? (
                <i className="mdi mdi-check text-sm"></i>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="text-xs text-center max-w-[100px]">{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepKuchara;