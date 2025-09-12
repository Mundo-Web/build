import { motion } from 'framer-motion';
import React from "react";
import { createRoot } from "react-dom/client";
import { JSON } from "sode-extend-react";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import HtmlContent from "./Utils/HtmlContent";
import Number2Currency, { CurrencySymbol } from "./Utils/Number2Currency";

const CourseDetails = ({ course }) => {
  const content = []
  const objectives = []
  const audience = []
  const requirements = []
  if (JSON.parseable(course.content)) content.push(...JSON.parse(course.content))
  if (JSON.parseable(course.objectives)) objectives.push(...JSON.parse(course.objectives))
  if (JSON.parseable(course.audience)) audience.push(...JSON.parse(course.audience))
  if (JSON.parseable(course.requirements)) requirements.push(...JSON.parse(course.requirements))

  return <>
    <section className="mt-16 bg-slate-100">
      <div className="flex flex-col p-[5%]  items-start px-[5%] replace-max-w-here mx-auto ">
        <div className="flex flex-col">
          <div className="flex flex-col w-full">
            <div
              $name="Curso: Coaching y Liderazgo Personal: ‘Encendete más’"
              className="text-3xl not-italic font-semibold tracking-tight leading-tight text-[color:var(--Woodsmoke-900,#2B384F)] max-md:max-w-full"
            >
              <span className="text-slate-700">
                Curso: {course.name}
              </span>
            </div>
            <div
              className="mt-2 text-lg not-italic leading-8 text-[color:var(--Woodsmoke-800,#2E405E)] max-md:max-w-full"
            >
              {course.summary}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-16 mx-auto w-full pt-[5%]">
          <div className="flex flex-col space-y-1">
            <h3 className="text-xs font-medium text-pink-500">Sesiones</h3>
            <p className="text-base font-semibold text-blue-900">{course.sessions} sesiones - {course.type}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <h3 className="text-xs font-medium text-pink-500">Certificado</h3>
            <p className="text-base font-semibold text-blue-900">{course.certificate}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <h3 className="text-xs font-medium text-pink-500">Duración</h3>
            <p className="text-base font-semibold text-blue-900">{course.session_duration}h por sesión</p>
          </div>
        </div>
      </div>
    </section>
    <section className="relative p-[5%] px-[5%] replace-max-w-here mx-auto max-md:flex max-md:flex-col-reverse md:grid md:grid-cols-2 lg:grid-cols-3 gap-[5%]">
      <div className="lg:col-span-2 w-full">
        <img
          className="w-full aspect-video rounded-lg object-cover object-center"
          src={`/storage/images/course/${course.image}`}
          alt={course.name}
          onError={e => e.target.src = `https://placehold.co/?text=${slider.name}`}
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="prose max-w-none ql-editor"
        >
          <h1 className="my-[5%] text-xl font-bold">Descripción</h1>
          <HtmlContent html={course.description} />
          <div
            className="p-6 text-sm rounded-lg bg-[color:var(--My-Sin-50,#FFFAEB)] text-[color:var(--Woodsmoke-800,#2E405E)] my-[5%]"
          >
            <div className="text-2xl not-italic font-semibold tracking-tight leading-snug text-[color:var(--Woodsmoke-900,#2B384F)] max-md:max-w-full">
              Lo que aprenderás en este curso
            </div>

            {/* Dividimos los items en grupos de 2 */}
            <div className="flex flex-wrap gap-6 items-start mt-6 w-full max-md:max-w-full">
              {objectives.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-1 gap-2 items-start basis-0 min-w-[240px]"
                >
                  <i className="fas fa-check-circle w-6 text-[#F2930E] text-center mt-1" />
                  <div className="flex-1 not-italic basis-0">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-2xl not-italic font-semibold tracking-tight leading-snug text-[color:var(--Woodsmoke-900,#2B384F)] max-md:max-w-full mb-6">
            A quién va dirigido este curso:
          </div>
          {
            audience.map((item, index) => {
              return <div key={index}
                className="flex flex-1 gap-2 items-start basis-0 min-w-[240px]"
              >
                <i className="mdi mdi-arrow-right w-6 text-pink-500 text-center" />
                <div className="flex-1 not-italic basis-0">
                  {item}
                </div>
              </div>
            })
          }
          <div className="text-2xl mt-[5%] not-italic font-semibold tracking-tight leading-snug text-[color:var(--Woodsmoke-900,#2B384F)] max-md:max-w-full mb-6">
            Requisitos del curso
          </div>
          {
            requirements.map((item, index) => {
              return <div key={index}
                className="flex flex-1 gap-2 items-start basis-0 min-w-[240px]"
              >
                <i className="mdi mdi-circle-small w-6 font-bold text-center" />
                <div className="flex-1 not-italic basis-0">
                  {item}
                </div>
              </div>
            })
          }
        </motion.div>
      </div>
      {/* <div className="w-full"> */}
      <div className="sticky top-2 h-max rounded bg-slate-100 w-full px-6 max-md:px-5">
        <div className="flex gap-10 justify-between items-center pt-8 pb-6 w-full font-medium leading-none uppercase border-b border-solid border-b-[#CFD8E8]">
          <div className="self-stretch my-auto text-2xl not-italic tracking-wide text-[#2B384F]">
            {CurrencySymbol()} {Number2Currency(course.price)}
          </div>
          <div className="flex gap-2.5 justify-center items-center self-stretch px-3 py-2 my-auto text-sm not-italic whitespace-nowrap rounded-3xl bg-[#FFF0FA] text-[#FF27B9]">
            OFERTA
          </div>
        </div>

        <div className="flex flex-col py-6 w-full text-sm tracking-normal leading-relaxed border-b border-solid border-b-[#CFD8E8]">
          <div className="flex gap-10 justify-between items-center w-full">
            <div className="flex gap-2 items-center justify-between self-stretch my-auto text-[#2E405E]">
              <i className="fas fa-clock w-6 text-center"></i>
              <div className="self-stretch my-auto not-italic">
                Duración del curso
              </div>
            </div>
            <div className="self-stretch my-auto not-italic text-[#5375A4] text-end">
              {course.long_duration} días
            </div>
          </div>

          <div className="flex gap-10 justify-between items-center mt-3 w-full">
            <div className="flex gap-2 items-center justify-between self-stretch my-auto text-[#2E405E]">
              <i className="fas fa-users w-6 text-center"></i>
              <div className="self-stretch my-auto not-italic">
                Estudiantes matriculados
              </div>
            </div>
            <div className="self-stretch my-auto not-italic text-[#5375A4] text-end">
              {course.students} estudiantes
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center py-6 w-full text-base font-medium tracking-normal leading-none text-white uppercase">
          <a href={`//wa.me/51945622983?text=${encodeURIComponent(`Estoy interesado en este curso:\n- ${course.name}`)}`} className="flex gap-2 justify-center items-center px-6 py-4 w-full rounded-3xl bg-[#2E405E] max-md:px-5" target="_blank">
            <div className="self-stretch my-auto">
              Quiero el curso
            </div>
            <i className="mdi mdi-arrow-top-right"></i>
          </a>
        </div>

        <div className="flex flex-col pt-6 pb-8 w-full">
          <div className="text-base not-italic font-medium tracking-normal leading-none uppercase text-[#07090D]">
            Este curso incluye:
          </div>
          <div className="flex flex-col gap-2 mt-6 w-full text-sm tracking-normal leading-relaxed text-[#4E5566]">
            {
              content.map(({ icon, text }, index) => {
                return <div className="flex gap-3 items-center w-full">
                  <i className={`${icon || 'fas fa-cube'} w-6 text-center`}></i>
                  <div className="flex-1 shrink self-stretch my-auto not-italic basis-0">
                    {text}
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>
      {/* </div> */}
    </section>
  </>
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<Base {...properties}>
    <CourseDetails {...properties} />
  </Base>);
})
