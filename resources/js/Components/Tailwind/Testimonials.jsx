import React from "react"

const TestimonialsPaani = React.lazy(() => import('./Testimonials/TestimonialsPaani'))

const Testimonials = ({ which, items,  data }) => {
  const getTestimonials = () => {
    switch (which) {
      case 'TestimonialsPaani':
        return <TestimonialsPaani data={data} items={items} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getTestimonials()
}

export default Testimonials;