import React from 'react'
import './AutoAnimateHeight.css'
import cs from 'classnames'

const AutoAnimateHeight = ({
  children,
  expanded
}: React.PropsWithChildren<{ expanded?: boolean }>) => {
  return (
    <div className={cs('transition-height', { expanded })}>
      <div>{children}</div>
    </div>
  )
}

export default AutoAnimateHeight