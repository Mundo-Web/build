import React from "react"
import em from "../../Utils/em"

const AboutTrasciende = ({details}) => {

  return <section className="flex overflow-hidden flex-col justify-center p-[5%] bg-slate-100">
    <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-slate-700">
      {em(details['about.title'])}
    </h2>
    <div
      className="mt-2 text-center text-sm md:text-base not-italic text-[color:var(--Woodsmoke-900,#2B384F)]"
    >
      {em(details['about.description'])}
    </div>
    <iframe className="aspect-[1500/587] w-full mt-[5%] md:mt-[2.5%] rounded-lg" src="https://www.youtube.com/embed/0TvUs1IsOxE" title="NUEVAS INSTALACIONES ESCUELA TRASCIENDE @TrasciendeEscuela" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </section>
}


export default AboutTrasciende