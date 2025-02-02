import React from "react"

const FooterSimple = React.lazy(() => import('./Footer/FooterSimple'))
const FooterSimpleCallToAction = React.lazy(() => import('./Footer/FooterSimpleCallToAction'))
const FooterCallToAction = React.lazy(() => import('./Footer/FooterCallToAction'))

const Footer = ({ which, items, pages, generals }) => {
  const getFooter = () => {
    switch (which) {
      case 'FooterSimpleCallToAction':
        return <FooterSimpleCallToAction socials={items} pages={pages} generals={generals} />
      case 'FooterCallToAction':
        return <FooterCallToAction socials={items} pages={pages} generals={generals} />
      case 'FooterSimple':
        return <FooterSimple socials={items} pages={pages} generals={generals} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFooter()
}

export default Footer