import React, { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

export const img = (
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) => {
  if (props.src?.startsWith('/Screenshot%20')) {
    const { style, ...restProps } = props

    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...restProps} />
  }

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />
}
