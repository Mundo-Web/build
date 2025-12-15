import React from "react"

const StoreMap = React.lazy(() => import('./Stores/StoreMap'))
const StoreList = React.lazy(() => import('./Stores/StoreList'))

const Store = ({ which, data, items }) => {
    const getStore = () => {
        switch (which) {
            case 'StoreMap':
                return <StoreMap data={data} stores={items} />
            case 'StoreList':
                return <StoreList data={data} stores={items} />
            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getStore()
}

export default Store;
