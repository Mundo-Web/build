import React, { Suspense } from "react"

const AdSubscription = React.lazy(() => import('./Ads/AdSubscription'))
const AdModal = React.lazy(() => import('./Ads/AdModal'))
const AdBanner = React.lazy(() => import('./Ads/AdBanner'))

const Ad = ({ which, data, items, generals }) => {
  const getAd = () => {
    switch (which) {
      case 'AdSubscription':
        return <AdSubscription data={data} items={items} generals={generals} />
      case 'AdModal':
        return <AdModal data={data} items={items} />
     /* case 'AdBanner':
        return <AdBanner data={data} items={items} />*/
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return (
    <Suspense fallback={<div className="w-full h-10"></div>}>
      {getAd()}
    </Suspense>
  )
}

export default Ad