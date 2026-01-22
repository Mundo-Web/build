import React from "react";

const ImageSimple = ({ data }) => {
  return <img id={data?.element_id || null} className="w-full object-cover object-center aspect-square" src={data?.image} style={{
    aspectRatio: data?.aspect_ratio ?? 1
  }} />
}

export default ImageSimple