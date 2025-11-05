import React from "react"

const TrackSimple = React.lazy(() => import('./Tracks/TrackSimple'))
const TrackingFirstClass = React.lazy(() => import('./Tracks/TrackingFirstClass'))

const Track = ({ which, data, generals }) => {
 
  const getTrack = () => {
    switch (which) {
      case 'TrackSimple':
        return <TrackSimple data={data} />
      case 'TrackingFirstClass':
        return <TrackingFirstClass data={data} generals={generals} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getTrack()
}

export default Track;