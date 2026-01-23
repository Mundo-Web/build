import React from "react";

const StepSimple = ({ data }) => {

  const steps = data?.steps?.split('>') ?? ['Step 1', 'Step 2', 'Step 3']
  const selected = data?.selected ?? 1;

  return <section id={data?.element_id || null} className="bg-white">
    <ol className="w-full px-[5%] my-[5%] md:my-[2.5%] flex flex-wrap gap-4 justify-center items-center font-bold text-center">
      {
        steps.map((step, index) => {

          return <>
            <li key={index} className={`${index < selected ? 'text-primary' : ''}`}>
              {
                index < selected
                  ? <i className="mdi mdi-check-circle"></i>
                  : <span>{index + 1}</span>
              }
              <span className="ms-2">{step}</span>
            </li>
            {
              index < steps.length - 1 &&
              <figure className="h-[1px] w-10 bg-textPrimary hidden md:block"></figure>
            }
          </>
        })
      }
    </ol>
  </section>
}

export default StepSimple