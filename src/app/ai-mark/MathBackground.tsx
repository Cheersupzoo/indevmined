import React from 'react'

const EnhancedMathBackground = () => {
  const symbols = ['+', '-', '×', '÷', '=', '∑', '∫', '√', 'π', '∞']
  const equations = ['E=mc²', 'a²+b²=c²', 'F=ma', 'e^(iπ)+1=0']
  const greyColor = '#a19e9a6e'

  const randomPosition = (index: number, total: number) => {
    const gridSize = Math.ceil(Math.sqrt(total))
    const cellWidth = 100 / gridSize
    const cellHeight = 100 / gridSize
    const col = index % gridSize
    const row = Math.floor(index / gridSize)

    return {
      x: col * cellWidth + Math.random() * cellWidth,
      y: row * cellHeight + Math.random() * cellHeight,
      rotation: Math.random() * 360
    }
  }

  const renderSymbols = () =>
    symbols.map((symbol, index) => {
      const { x, y, rotation } = randomPosition(index, symbols.length)

      return (
        <text
          key={`symbol-${index}`}
          x={`${x}%`}
          y={`${y}%`}
          fontFamily='Arial, sans-serif'
          fontSize='24'
          fill={greyColor}
          transform={`rotate(${rotation}, ${x}%, ${y}%)`}
        >
          {symbol}
        </text>
      )
    })

  const renderEquations = () =>
    equations.map((equation, index) => {
      const { x, y, rotation } = randomPosition(index, equations.length)

      return (
        <text
          key={`equation-${index}`}
          x={`${x}%`}
          y={`${y}%`}
          fontFamily='Arial, sans-serif'
          fontSize='20'
          fill={greyColor}
          transform={`rotate(${rotation}, ${x}%, ${y}%)`}
        >
          {equation}
        </text>
      )
    })

  const renderBrainWaves = () => {
    const waves = []
    for (let i = 0; i < 10; i++) {
      const { x, y } = randomPosition(i, 10)
      waves.push(
        <path
          key={`wave-${i}`}
          d={`M${x},${y} Q${x + 5},${y - 10} ${x + 10},${y} T${x + 20},${y}`}
          stroke={greyColor}
          fill='none'
          strokeWidth='2'
        />
      )
    }

    return waves
  }

  const renderNeurons = () => {
    const neurons = []
    for (let i = 0; i < 15; i++) {
      const { x, y } = randomPosition(i, 15)
      neurons.push(
        <g key={`neuron-${i}`}>
          <circle cx={`${x}%`} cy={`${y}%`} r='5' fill={greyColor} />
          <line
            x1={`${x}%`}
            y1={`${y}%`}
            x2={`${x + 3}%`}
            y2={`${y + 3}%`}
            stroke={greyColor}
            strokeWidth='1'
          />
          <line
            x1={`${x}%`}
            y1={`${y}%`}
            x2={`${x - 2}%`}
            y2={`${y + 3}%`}
            stroke={greyColor}
            strokeWidth='1'
          />
        </g>
      )
    }

    return neurons
  }

  return (
    <div className='z-0 absolute inset-0 top-24 overflow-hidden select-none'>
      <svg className='w-full h-full'>
        {/* {renderBrainWaves()} */}
        {/* {renderNeurons()} */}
        {renderSymbols()}
        {renderEquations()}
      </svg>
    </div>
  )
}

export default EnhancedMathBackground
