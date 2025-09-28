import React from 'react'

const PageHeader = ({title}) => {
  return (
       <header className="head">
      <div className="head-inner">
        <h2 className="head-text">{title}</h2>
        <div className="head-line"></div>
      </div>
    </header>
  )
}

export default PageHeader