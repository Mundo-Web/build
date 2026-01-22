import React from "react"
import HtmlContent from "../../../Utils/HtmlContent"

const FrameFull = ({ data }) => {
  return <section id={data?.element_id || null} className="w-full">
    <HtmlContent html={data?.['code:html'] ?? ''} />
  </section>
}

export default FrameFull