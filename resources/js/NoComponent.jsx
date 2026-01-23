const NoComponent = ({which, data}) => {
    return <div id={data?.element_id || null} className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
        - No Hay componente <b>{which}</b> -
    </div>
}

export default NoComponent