export const LineCursor = ({
  pos,
  setPos,
}: {
  pos: number
  setPos: React.Dispatch<React.SetStateAction<number>>
}) => {
  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const parent = e.currentTarget.closest(
      '.selector-container'
    ) as HTMLDivElement
    if (!parent) return
    const startLeft = parent.getBoundingClientRect().left
    const width = parent.offsetWidth
    if (!startLeft || !width) return

    const getPos = (pageX: number) => {
      const left = pageX - startLeft
      const pos = Math.round(Math.max(0, Math.min(left / (width / 7), 7)))
      return pos
    }
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      const pos =
        e instanceof MouseEvent ? getPos(e.pageX) : getPos(e.touches[0].pageX)
      setPos(pos)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onMouseMove, { passive: false })
    const clear = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onMouseMove)
      document.removeEventListener('mouseup', clear)
      document.removeEventListener('touchend', clear)
      document.removeEventListener('blur', clear)
    }
    document.addEventListener('mouseup', clear)
    document.addEventListener('touchend', clear)
    document.addEventListener('blur', clear)
  }

  return (
    <div
      className='selector-container absolute top-[5rem] select-none'
      style={{
        left: '1rem',
        width: '7ch',
      }}
    >
      <div
        onTouchStart={onMouseDown}
        onMouseDown={onMouseDown}
        className='-mx-3 h-5 -translate-y-5'
      />
      <div
        className='relative'
        style={{ left: `${pos === 0 ? -1 : pos > 6 ? pos + 1 : pos}ch` }}
      >
        <div
          onTouchStart={onMouseDown}
          onMouseDown={onMouseDown}
          className='triangle-text-clip absolute -bottom-4 flex h-8 w-4 -translate-x-1/2 touch-none items-end justify-center bg-yellow-200 text-yellow-800'
        >
          <div className='-m-[6px]'>{pos}</div>
        </div>
        <div
          onTouchStart={onMouseDown}
          onMouseDown={onMouseDown}
          className='absolute bottom-4 h-6 w-[1px] -translate-x-1/2 animate-blinking text-yellow-200'
        />
      </div>
    </div>
  )
}
