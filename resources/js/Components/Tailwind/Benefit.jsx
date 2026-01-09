import React from "react"

const BenefitSimple = React.lazy(() => import('./Benefits/BenefitSimple'))

const Benefit = ({ data, which, items, generals }) => {
    const getBenefit = () => {
        switch (which) {
            case 'BenefitSimple':
                return <BenefitSimple data={data} items={items} />

            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getBenefit()
}

export default Benefit;
