import React from 'react'
import './StuntingBackground.css'

const StuntingBackground = () => {
  return (
    <div className='background -z-10'>
      <div
        className='shape circle'
        style={{ width: '100px', height: '100px', left: '10%', top: '20%' }}
      ></div>
      <div
        className='shape square'
        style={{ width: '80px', height: '80px', right: '15%', bottom: '30%' }}
      ></div>
      <div className='shape triangle' style={{ left: '50%', top: '40%' }}></div>
      <div
        className='shape line'
        style={{ width: '200px', left: '0', top: '60%' }}
      ></div>
      <div
        className='shape circle'
        style={{ width: '150px', height: '150px', right: '5%', top: '10%' }}
      ></div>
      <div
        className='shape square'
        style={{ width: '120px', height: '120px', left: '25%', bottom: '15%' }}
      ></div>
      <div
        className='shape line'
        style={{ width: '150px', right: '10%', top: '80%' }}
      ></div>

      <div className='dot-grid near-parallax'>
        {[...Array(100)].map((_, index) => (
          <div key={index} className='dot'></div>
        ))}
      </div>
    </div>
  )
}

export default StuntingBackground
