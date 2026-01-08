import React from "react"

const UnsubscribeSimple = React.lazy(() => import('./Unsubscribe/UnsubscribeSimple'))

const Unsubscribe = ({ data, which }) => {
    const getUnsubscribe = () => {
        switch (which) {
            case 'UnsubscribeSimple':
                return <UnsubscribeSimple data={data} />
            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getUnsubscribe()
}

export default Unsubscribe;
