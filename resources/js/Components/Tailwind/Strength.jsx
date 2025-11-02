import React from "react"

const StrengthFirstClass = React.lazy(() => import('./Strengths/StrengthFirstClass'))

const Strength = ({ which, items, data }) => {
  const getStrength = () => {
    switch (which) {
      case 'StrengthFirstClass':
        return <StrengthFirstClass data={data} items={items} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getStrength()
}

export default Strength;
