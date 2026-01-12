import React from "react"

const ApplicationSimple = React.lazy(() => import('./Applications/ApplicationSimple'))

const Application = ({ data, which, items, generals }) => {
    const getApplication = () => {
        switch (which) {
            case 'ApplicationSimple':
                return <ApplicationSimple data={data} items={items} />

            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getApplication()
}

export default Application;
