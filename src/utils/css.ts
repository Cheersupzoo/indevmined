/**
 * Converts a CSS string to a React style object
 * @param cssText - CSS string (e.g., 'color: red; background-color: blue;')
 * @returns React style object (e.g., { color: 'red', backgroundColor: 'blue' })
 */
export function cssToReactStyle(cssText: string): React.CSSProperties {
  if (!cssText || typeof cssText !== 'string') {
    return {}
  }

  // Split into individual style declarations
  const style: Record<string, string> = {}

  // Split by semicolon, trim whitespace, and filter out empty strings
  const declarations = cssText
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)

  declarations.forEach((declaration) => {
    const [property, value] = declaration.split(':').map((part) => part.trim())
    if (property && value) {
      // Convert CSS property to camelCase for React
      const reactProperty = property
        .split('-')
        .map((part, index) =>
          index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join('')

      style[reactProperty] = value.trim()
    }
  })

  return style as React.CSSProperties
}
