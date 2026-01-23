import React from "react"

const IndicatorSimple = React.lazy(() => import('./Indicators/IndicatorSimple'))
const IndicatorHuaillys = React.lazy(() => import('./Indicators/IndicatorHuaillys'))
const IndicatorIbergruas = React.lazy(() => import('./Indicators/IndicatorIbergruas.jsx'))
const IndicatorLaPetaca = React.lazy(() => import('./Indicators/IndicatorLaPetaca'))
const IndicatorHostinfinity = React.lazy(() => import('./Indicators/IndicatorHostinfinity'))

const Indicator = ({ data, which, items, generals }) => {
    const getIndicator = () => {
        switch (which) {

            case 'IndicatorSimple':
                return <IndicatorSimple data={data} items={items} />


            case 'IndicatorHuaillys':
                return <IndicatorHuaillys data={data} items={items} generals={generals} />
            case 'IndicatorIbergruas':
                return <IndicatorIbergruas data={data} items={items} generals={generals} />
            case 'IndicatorLaPetaca':
                return <IndicatorLaPetaca data={data} items={items} />
            case 'IndicatorHostinfinity':
                return <IndicatorHostinfinity data={data} items={items} />


            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getIndicator()
}

export default Indicator;