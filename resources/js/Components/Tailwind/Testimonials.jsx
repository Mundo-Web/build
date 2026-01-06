import React from "react"

const TestimonialsPaani = React.lazy(() => import('./Testimonials/TestimonialsPaani'))
const TestimonialsMultivet = React.lazy(() => import('./Testimonials/TestimonialsMultivet'))
const TestimonialsFirstClass = React.lazy(() => import('./Testimonials/TestimonialsFirstClass'))
const TestimonialsLaPetaca = React.lazy(() => import('./Testimonials/TestimonialsLaPetaca'))
const TestimonialsVideosWebQuirurgica = React.lazy(() => import('./Testimonials/TestimonialsVideosWebQuirurgica'))
const TestimonialsTextWebQuirurgica = React.lazy(() => import('./Testimonials/TestimonialsTextWebQuirurgica'))

const Testimonials = ({ which, items,  data }) => {
  const getTestimonials = () => {
    switch (which) {
      case 'TestimonialsPaani':
        return <TestimonialsPaani data={data} items={items} />
      case 'TestimonialsMultivet':
        return <TestimonialsMultivet data={data} items={items} />
      case 'TestimonialsFirstClass':
        return <TestimonialsFirstClass data={data} items={items} />
      case 'TestimonialsLaPetaca':
        return <TestimonialsLaPetaca data={data} items={items} />
      case 'TestimonialsVideosWebQuirurgica':
        return <TestimonialsVideosWebQuirurgica data={data} items={items} />
      case 'TestimonialsTextWebQuirurgica':
        return <TestimonialsTextWebQuirurgica data={data} items={items} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getTestimonials()
}

export default Testimonials;