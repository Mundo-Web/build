import React from "react"

const AboutSimple = React.lazy(() => import('./AboutUs/AboutSimple'))
const AboutImage = React.lazy(() => import('./AboutUs/AboutImage'))
const AboutAko = React.lazy(() => import('./AboutUs/AboutAko'))
const AboutPaani = React.lazy(() => import('./AboutUs/AboutPaani'))
const AboutMultivet = React.lazy(() => import('./AboutUs/AboutMultivet'))
const AboutKatya = React.lazy(() => import('./AboutUs/AboutKatya'))
const AboutHuaillys = React.lazy(() => import('./AboutUs/AboutHuaillys'))
const AboutModern = React.lazy(() => import('./AboutUs/AboutModern'))
const AboutSidebar = React.lazy(() => import('./AboutUs/AboutSidebar'))

const AboutUs = ({ data, which, filteredData, items }) => {
    const getAboutUs = () => {
        switch (which) {

            case 'AboutSimple':
                return <AboutSimple data={data} filteredData={filteredData} />

            case 'AboutImage':
                return <AboutImage data={data} filteredData={filteredData} />

            case 'AboutAko':
                return <AboutAko data={data} filteredData={filteredData} items={items} />
            case 'AboutMultivet':
                return <AboutMultivet data={data} filteredData={filteredData} items={items} />
            case 'AboutPaani':
                return <AboutPaani data={data} filteredData={filteredData} items={items} />
            case 'AboutKatya':
                return <AboutKatya data={data} filteredData={filteredData} items={items} />
            case 'AboutHuaillys':
                return <AboutHuaillys data={data} filteredData={filteredData} items={items} />
            case 'AboutModern':
                return <AboutModern data={data} filteredData={filteredData} items={items} />
            case 'AboutSidebar':
                return <AboutSidebar data={data} filteredData={filteredData} items={items} />
         
            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getAboutUs()
}

export default AboutUs;