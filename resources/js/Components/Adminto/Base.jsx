import React, { useState } from 'react'
import Footer from './Footer'
import Menu from './Menu'
import NavBar from './NavBar'
import RigthBar from './RightBar'

moment.tz.setDefault('UTC');

const Base = ({ children, title, ...props }) => {
  console.log("Rendering Base with props:", props);
  return (<>
    <div id="wrapper">
      <NavBar {...props} title={title} />
      <Menu {...props} />
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
    <RigthBar {...props} />
    <div className="rightbar-overlay"></div>
  </>)
}

export default Base