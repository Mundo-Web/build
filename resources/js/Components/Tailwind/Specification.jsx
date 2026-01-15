import React from "react"

const SpecificationSimple = React.lazy(() => import('./Specifications/SpecificationSimple'))

const Specification = ({ data, which, items, generals }) => {
    const getSpecification = () => {
        switch (which) {
            case 'SpecificationSimple':
                return <SpecificationSimple data={data} items={items} />

            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getSpecification()
}

export default Specification;
