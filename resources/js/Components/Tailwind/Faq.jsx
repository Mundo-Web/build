import React from "react"


const FaqSimple = React.lazy(() => import('./Faqs/FaqSimple'))
const FaqAko = React.lazy(() => import('./Faqs/FaqAko'))
const FaqModern = React.lazy(() => import('./Faqs/FaqModern'))
const FaqChat = React.lazy(() => import('./Faqs/FaqChat'))

const Faq = ({ which, data, faqs }) => {
  const getFaq = () => {
    switch (which) {
      case 'FaqSimple':
        return <FaqSimple data={data} faqs={faqs} />
      case 'FaqAko':
        return <FaqAko data={data} faqs={faqs} />
      case 'FaqModern':
        return <FaqModern data={data} faqs={faqs} />
      case 'FaqChat':
        return <FaqChat data={data} faqs={faqs} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFaq()
}

export default Faq;